# train_controller.gd — Simple arcade train on PathFollow3D
# Attach to a PathFollow3D that is child of a RailGenerator (Path3D)
extends PathFollow3D
class_name TrainController

@export var max_speed := 30.0   # m/s (~108 km/h)
@export var acceleration := 4.0
@export var brake_force := 8.0
@export var idle_drag := 1.5
@export var train_scene: PackedScene  # Optional 3D model

@export_group("Camera")
@export var camera_offset := Vector3(0, 3.5, -8)
@export var camera_look_ahead := 5.0

var speed := 0.0
var throttle := 0.0  # 0.0 to 1.0
var braking := false
var arrived := false

signal station_reached(station_name: String)
signal journey_complete

@onready var camera: Camera3D = $Camera3D

func _ready():
	# Create camera if not present
	if not has_node("Camera3D"):
		camera = Camera3D.new()
		camera.name = "Camera3D"
		add_child(camera)
	else:
		camera = $Camera3D
	camera.current = true

	# Load train model if provided
	if train_scene:
		var train = train_scene.instantiate()
		add_child(train)

func _process(delta):
	if arrived:
		return

	# --- Input ---
	# Mobile: touch = throttle, release = coast
	# PC: Hold Space/W/Up = throttle, S/Down = brake
	throttle = 0.0
	braking = false

	if Input.is_action_pressed("advance"):  # Space / tap
		throttle = 1.0
	if Input.is_action_pressed("go_back"):  # Arrow left / swipe down
		braking = true

	# Touch input
	if Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT):
		# Bottom half of screen = brake, top half = throttle
		var touch_y = get_viewport().get_mouse_position().y
		var half = get_viewport().get_visible_rect().size.y * 0.5
		if touch_y < half:
			throttle = 1.0
		else:
			braking = true

	# --- Physics ---
	if throttle > 0:
		speed += acceleration * throttle * delta
	elif braking:
		speed -= brake_force * delta
	else:
		speed -= idle_drag * delta

	speed = clamp(speed, 0.0, max_speed)

	# --- Move along path ---
	var path = get_parent() as Path3D
	if path:
		var total = path.curve.get_baked_length()
		progress += speed * delta

		# Check if arrived at end
		if progress >= total - 1.0:
			progress = total - 1.0
			speed = 0.0
			arrived = true
			journey_complete.emit()

	# --- Camera ---
	if camera:
		var look_target = global_position + global_transform.basis.z * camera_look_ahead
		camera.global_position = global_position + global_transform.basis * camera_offset
		camera.look_at(look_target)

func reset():
	progress = 0.0
	speed = 0.0
	arrived = false

func get_speed_kmh() -> float:
	return speed * 3.6

# HUD info
func get_progress_pct() -> float:
	var path = get_parent() as Path3D
	if path and path.curve:
		return progress / path.curve.get_baked_length() * 100.0
	return 0.0
