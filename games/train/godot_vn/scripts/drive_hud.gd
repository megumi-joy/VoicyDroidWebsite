# drive_hud.gd — In-game HUD for train driving segments
extends CanvasLayer

@onready var speed_label: Label = $Panel/Speed
@onready var progress_label: Label = $Panel/Progress
@onready var hint_label: Label = $HintLabel

var train: TrainController

func _ready():
	# Find train in tree
	await get_tree().process_frame
	var trains = get_tree().get_nodes_in_group("train")
	if trains.size() > 0:
		train = trains[0]

func _process(_delta):
	if not train:
		return
	speed_label.text = "%d km/h" % train.get_speed_kmh()
	progress_label.text = "%d%%" % train.get_progress_pct()

	# Show hint based on speed
	if train.speed < 0.1 and not train.arrived:
		hint_label.text = "TAP to drive →"
		hint_label.visible = true
	elif train.arrived:
		hint_label.text = "🚉 Arrived!"
		hint_label.visible = true
	else:
		hint_label.visible = false
