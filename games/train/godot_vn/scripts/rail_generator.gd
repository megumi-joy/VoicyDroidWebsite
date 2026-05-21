# rail_generator.gd — Generates rail track mesh along a Path3D curve
# Attach to a Path3D node. It will generate sleepers + rails as MeshInstance3D children.
@tool
extends Path3D
class_name RailGenerator

@export var rail_width := 1.435  # Standard gauge in meters
@export var rail_height := 0.15
@export var rail_thickness := 0.07
@export var sleeper_spacing := 0.6
@export var sleeper_width := 2.4
@export var sleeper_height := 0.12
@export var sleeper_depth := 0.22
@export var segment_length := 0.5  # Mesh resolution along curve
@export var ballast_width := 3.0
@export var ballast_height := 0.15
@export var auto_generate := true
@export var rail_material: Material
@export var sleeper_material: Material
@export var ballast_material: Material

# Pole/catenary
@export var pole_spacing := 30.0
@export var pole_height := 6.0
@export var generate_poles := true

var _generated := false

func _ready():
	if auto_generate:
		generate()

func generate():
	# Clear old
	for c in get_children():
		if c is MeshInstance3D or c is CSGBox3D:
			c.queue_free()

	if not curve or curve.point_count < 2:
		return

	var total_length = curve.get_baked_length()

	_generate_rails(total_length)
	_generate_sleepers(total_length)
	if generate_poles:
		_generate_poles(total_length)
	_generated = true

func _generate_rails(total_length: float):
	# Left and right rail as extruded mesh along curve
	for side in [-1.0, 1.0]:
		var st = SurfaceTool.new()
		st.begin(Mesh.PRIMITIVE_TRIANGLES)

		var steps = int(total_length / segment_length)
		var offset = side * rail_width * 0.5

		for i in range(steps):
			var d0 = float(i) / steps * total_length
			var d1 = float(i + 1) / steps * total_length

			var t0 = curve.sample_baked_with_rotation(d0)
			var t1 = curve.sample_baked_with_rotation(d1)

			var p0 = t0.origin
			var r0 = t0.basis.x.normalized()
			var u0 = t0.basis.y.normalized()

			var p1 = t1.origin
			var r1 = t1.basis.x.normalized()
			var u1 = t1.basis.y.normalized()

			# Rail profile: simple box
			var hw = rail_thickness * 0.5
			var hh = rail_height

			# Bottom-left, bottom-right, top-right, top-left for each cross-section
			var bl0 = p0 + r0 * (offset - hw)
			var br0 = p0 + r0 * (offset + hw)
			var tl0 = bl0 + u0 * hh
			var tr0 = br0 + u0 * hh

			var bl1 = p1 + r1 * (offset - hw)
			var br1 = p1 + r1 * (offset + hw)
			var tl1 = bl1 + u1 * hh
			var tr1 = br1 + u1 * hh

			# Top face
			_add_quad(st, tl0, tr0, tr1, tl1)
			# Right face
			_add_quad(st, tr0, br0, br1, tr1)
			# Left face
			_add_quad(st, bl0, tl0, tl1, bl1)

		st.generate_normals()
		var mesh_inst = MeshInstance3D.new()
		mesh_inst.mesh = st.commit()
		if rail_material:
			mesh_inst.material_override = rail_material
		mesh_inst.name = "Rail_" + ("L" if side < 0 else "R")
		add_child(mesh_inst)
		mesh_inst.owner = get_tree().edited_scene_root if Engine.is_editor_hint() else self

func _generate_sleepers(total_length: float):
	var count = int(total_length / sleeper_spacing)
	var st = SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)

	for i in range(count):
		var d = float(i) * sleeper_spacing
		var t = curve.sample_baked_with_rotation(d)
		var p = t.origin
		var right = t.basis.x.normalized()
		var up = t.basis.y.normalized()
		var fwd = t.basis.z.normalized()

		var hw = sleeper_width * 0.5
		var hh = sleeper_height
		var hd = sleeper_depth * 0.5

		# 8 corners of sleeper box
		var corners = [
			p + right * (-hw) + fwd * (-hd),              # 0 back-left-bottom
			p + right * (hw) + fwd * (-hd),               # 1 back-right-bottom
			p + right * (hw) + fwd * (hd),                # 2 front-right-bottom
			p + right * (-hw) + fwd * (hd),               # 3 front-left-bottom
			p + right * (-hw) + up * hh + fwd * (-hd),    # 4 back-left-top
			p + right * (hw) + up * hh + fwd * (-hd),     # 5 back-right-top
			p + right * (hw) + up * hh + fwd * (hd),      # 6 front-right-top
			p + right * (-hw) + up * hh + fwd * (hd),     # 7 front-left-top
		]
		# Top
		_add_quad(st, corners[4], corners[5], corners[6], corners[7])
		# Front
		_add_quad(st, corners[7], corners[6], corners[2], corners[3])
		# Back
		_add_quad(st, corners[5], corners[4], corners[0], corners[1])

	st.generate_normals()
	var mesh_inst = MeshInstance3D.new()
	mesh_inst.mesh = st.commit()
	if sleeper_material:
		mesh_inst.material_override = sleeper_material
	mesh_inst.name = "Sleepers"
	add_child(mesh_inst)
	mesh_inst.owner = get_tree().edited_scene_root if Engine.is_editor_hint() else self

func _generate_poles(total_length: float):
	var count = int(total_length / pole_spacing)
	for i in range(count):
		var d = float(i) * pole_spacing
		var t = curve.sample_baked_with_rotation(d)
		var p = t.origin
		var right = t.basis.x.normalized()

		# Alternate sides
		var side = 1.0 if i % 2 == 0 else -1.0
		var pole_pos = p + right * side * (rail_width * 0.5 + 1.5)

		var pole = CSGBox3D.new()
		pole.size = Vector3(0.15, pole_height, 0.15)
		pole.position = pole_pos + Vector3.UP * pole_height * 0.5
		pole.name = "Pole_%d" % i
		add_child(pole)
		pole.owner = get_tree().edited_scene_root if Engine.is_editor_hint() else self

		# Cross arm
		var arm = CSGBox3D.new()
		arm.size = Vector3(2.5, 0.08, 0.08)
		arm.position = pole_pos + Vector3.UP * pole_height
		arm.name = "Arm_%d" % i
		add_child(arm)
		arm.owner = get_tree().edited_scene_root if Engine.is_editor_hint() else self

func _add_quad(st: SurfaceTool, a: Vector3, b: Vector3, c: Vector3, d: Vector3):
	st.add_vertex(a); st.add_vertex(b); st.add_vertex(c)
	st.add_vertex(a); st.add_vertex(c); st.add_vertex(d)
