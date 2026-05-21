# game_data.gd — Autoload singleton: slides data + save/load + i18n
extends Node

var current_slide := 0
var max_slide := 0
var current_lang := "ru"
var voice_on := false

const LANGS = ["ru","en","es","ca","fr","de","uk"]
const LANG_NAMES = {"ru":"РУ","en":"EN","es":"ES","ca":"CA","fr":"FR","de":"DE","uk":"УК"}

var slides: Array = []

func _ready():
	_load_slides()
	_load_progress()

func _load_slides():
	var f = FileAccess.open("res://data/slides.json", FileAccess.READ)
	if f:
		var json = JSON.new()
		json.parse(f.get_as_text())
		slides = json.data
		f.close()

func get_text(obj) -> String:
	if obj is String: return obj
	if obj is Dictionary:
		if obj.has(current_lang): return obj[current_lang]
		if obj.has("ru"): return obj["ru"]
		if obj.has("en"): return obj["en"]
	return ""

func save_progress():
	var save = {"cur": current_slide, "max": max_slide, "lang": current_lang, "voice": voice_on}
	var f = FileAccess.open("user://save.json", FileAccess.WRITE)
	f.store_string(JSON.stringify(save))
	f.close()

func _load_progress():
	if FileAccess.file_exists("user://save.json"):
		var f = FileAccess.open("user://save.json", FileAccess.READ)
		var json = JSON.new()
		json.parse(f.get_as_text())
		var d = json.data
		current_slide = d.get("cur", 0)
		max_slide = d.get("max", 0)
		current_lang = d.get("lang", "ru")
		voice_on = d.get("voice", false)
		f.close()

func has_save() -> bool:
	return FileAccess.file_exists("user://save.json")

func reset():
	current_slide = 0
	max_slide = 0
	save_progress()

# UI translations
var UI = {
	"title": {"ru":"Электричка","en":"Elektrichka","es":"Cercanías","ca":"Rodalies","fr":"L'Électrique","de":"Elektritschka","uk":"Електричка"},
	"subtitle": {"ru":"Визуальная Новелла","en":"Visual Novel","es":"Novela Visual","ca":"Novel·la Visual","fr":"Roman Visuel","de":"Visual Novel","uk":"Візуальна Новела"},
	"start": {"ru":"Начать Путь","en":"Start Journey","es":"Iniciar Viaje","ca":"Iniciar Viatge","fr":"Commencer","de":"Starten","uk":"Розпочати"},
	"continue": {"ru":"Продолжить","en":"Continue","es":"Continuar","ca":"Continuar","fr":"Continuer","de":"Fortsetzen","uk":"Продовжити"},
	"new_game": {"ru":"Новая Игра","en":"New Game","es":"Nuevo Juego","ca":"Nou Joc","fr":"Nouvelle Partie","de":"Neues Spiel","uk":"Нова Гра"},
	"pause": {"ru":"Пауза","en":"Paused","es":"Pausa","ca":"Pausa","fr":"Pause","de":"Pause","uk":"Пауза"},
	"resume": {"ru":"Продолжить","en":"Resume","es":"Reanudar","ca":"Reprendre","fr":"Reprendre","de":"Fortfahren","uk":"Продовжити"},
	"menu": {"ru":"В Меню","en":"Main Menu","es":"Menú","ca":"Menú","fr":"Menu","de":"Menü","uk":"Меню"},
	"voice_on": {"ru":"Озвучка: ВКЛ","en":"Voice: ON","es":"Voz: SÍ","ca":"Veu: SÍ","fr":"Voix: OUI","de":"Stimme: AN","uk":"Озвучка: ВКЛ"},
	"voice_off": {"ru":"Озвучка: ВЫКЛ","en":"Voice: OFF","es":"Voz: NO","ca":"Veu: NO","fr":"Voix: NON","de":"Stimme: AUS","uk":"Озвучка: ВИМК"},
}

func t(key: String) -> String:
	if UI.has(key):
		return get_text(UI[key])
	return key
