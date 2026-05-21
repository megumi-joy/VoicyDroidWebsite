# vn_engine.gd — Main VN scene controller
extends Control

@onready var bg: TextureRect = %Background
@onready var speaker_label: Label = %SpeakerLabel
@onready var dialogue_label: RichTextLabel = %DialogueLabel
@onready var textbox: PanelContainer = %Textbox
@onready var counter_label: Label = %CounterLabel
@onready var progress_bar: ProgressBar = %ProgressBar
@onready var voice_btn: Button = %VoiceBtn
@onready var lang_container: HBoxContainer = %LangContainer
@onready var pause_overlay: ColorRect = %PauseOverlay
@onready var title_overlay: ColorRect = %TitleOverlay

var typing := false
var full_text := ""
var char_index := 0
var type_timer := 0.0
const TYPE_SPEED := 0.025

func _ready():
	_build_lang_buttons(lang_container)
	_show_title()

func _process(delta):
	if typing:
		type_timer += delta
		while type_timer >= TYPE_SPEED and char_index < full_text.length():
			type_timer -= TYPE_SPEED
			char_index += 1
			dialogue_label.text = full_text.substr(0, char_index)
		if char_index >= full_text.length():
			typing = false
			dialogue_label.text = full_text

func _input(event):
	if event.is_action_pressed("pause_menu"):
		if title_overlay.visible: return
		_toggle_pause()
		get_viewport().set_input_as_handled()
	elif event.is_action_pressed("advance"):
		if title_overlay.visible or pause_overlay.visible: return
		_advance()
		get_viewport().set_input_as_handled()
	elif event.is_action_pressed("go_back"):
		if title_overlay.visible or pause_overlay.visible: return
		_go(-1)
		get_viewport().set_input_as_handled()
	elif event is InputEventScreenTouch and event.pressed:
		if title_overlay.visible or pause_overlay.visible: return
		_advance()

# --- Slide display ---
func _show_slide(idx: int):
	var slides = GameData.slides
	if idx < 0 or idx >= slides.size(): return
	GameData.current_slide = idx
	GameData.max_slide = max(GameData.max_slide, idx)
	GameData.save_progress()

	var s = slides[idx]
	# Load image
	var img_path = "res://art/" + s["img"].trim_prefix("art/")
	var tex = load(img_path)
	if tex:
		bg.texture = tex

	# Speaker
	speaker_label.text = GameData.get_text(s.get("who", ""))

	# Typewriter
	full_text = GameData.get_text(s.get("text", ""))
	char_index = 0
	type_timer = 0.0
	typing = true
	dialogue_label.text = ""

	# HUD
	counter_label.text = "%d/%d" % [idx + 1, slides.size()]
	progress_bar.value = float(idx + 1) / slides.size() * 100.0

func _advance():
	if typing:
		typing = false
		dialogue_label.text = full_text
		return
	if GameData.current_slide < GameData.slides.size() - 1:
		_show_slide(GameData.current_slide + 1)

func _go(dir: int):
	var target = clamp(GameData.current_slide + dir, 0, GameData.slides.size() - 1)
	_show_slide(target)

# --- Title screen ---
func _show_title():
	title_overlay.visible = true
	pause_overlay.visible = false
	textbox.visible = false
	var start_btn: Button = %StartBtn
	var new_btn: Button = %NewGameBtn
	var title_lbl: Label = %TitleLabel
	var sub_lbl: Label = %SubtitleLabel
	title_lbl.text = GameData.t("title")
	sub_lbl.text = GameData.t("subtitle")
	start_btn.text = GameData.t("continue") if GameData.has_save() else GameData.t("start")
	new_btn.text = GameData.t("new_game")

func _on_start_pressed():
	title_overlay.visible = false
	textbox.visible = true
	_show_slide(GameData.current_slide)

func _on_new_game_pressed():
	GameData.reset()
	title_overlay.visible = false
	textbox.visible = true
	_show_slide(0)

# --- Pause ---
func _toggle_pause():
	pause_overlay.visible = !pause_overlay.visible
	if pause_overlay.visible:
		%PauseTitle.text = GameData.t("pause")
		%ResumeBtn.text = GameData.t("resume")
		%MenuBtn.text = GameData.t("menu")
		_update_voice_btn()
		%PauseProgress.text = "%d/%d (%d%%)" % [GameData.current_slide + 1, GameData.slides.size(), int(float(GameData.current_slide + 1) / GameData.slides.size() * 100)]

func _on_resume_pressed():
	pause_overlay.visible = false

func _on_menu_pressed():
	pause_overlay.visible = false
	_show_title()

# --- Voice ---
func _update_voice_btn():
	voice_btn.text = "🔊" if GameData.voice_on else "🔇"
	if pause_overlay.visible:
		%PauseVoiceBtn.text = GameData.t("voice_on") if GameData.voice_on else GameData.t("voice_off")

func _on_voice_pressed():
	GameData.voice_on = !GameData.voice_on
	_update_voice_btn()
	# TTS via DisplayServer on Android, or OS.execute on desktop
	if GameData.voice_on and full_text:
		_speak(full_text)

func _speak(text: String):
	if OS.has_feature("android"):
		# Android TTS via JNI — needs plugin, placeholder
		pass
	# Desktop fallback: espeak if available
	elif OS.has_feature("linux"):
		var lang_map = {"ru":"ru","en":"en","es":"es","ca":"ca","fr":"fr","de":"de","uk":"uk"}
		var l = lang_map.get(GameData.current_lang, "en")
		OS.create_process("espeak", ["-v", l, text])

# --- Language ---
func _build_lang_buttons(container: HBoxContainer):
	for c in container.get_children(): c.queue_free()
	for lang in GameData.LANGS:
		var btn = Button.new()
		btn.text = GameData.LANG_NAMES[lang]
		btn.custom_minimum_size = Vector2(40, 30)
		btn.add_theme_font_size_override("font_size", 11)
		if lang == GameData.current_lang:
			btn.modulate = Color(0.83, 0.65, 0.46) # accent
		btn.pressed.connect(_on_lang_selected.bind(lang))
		container.add_child(btn)

func _on_lang_selected(lang: String):
	GameData.current_lang = lang
	GameData.save_progress()
	_build_lang_buttons(lang_container)
	_show_slide(GameData.current_slide)
	if title_overlay.visible:
		_show_title()

# --- Textbox click ---
func _on_textbox_gui_input(event: InputEvent):
	if event is InputEventMouseButton and event.pressed:
		_advance()
