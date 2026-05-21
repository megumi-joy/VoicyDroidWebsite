# level_manager.gd — Alternates between VN scenes and driving segments
extends Node

enum State { VN, DRIVING }

var current_state := State.VN
var current_level := 0

# Define driving segments between VN story beats
# Each segment: { "from": slide_idx, "to": slide_idx, "track_scene": "res://..." }
var levels := [
	{"from": 0, "to": 10, "track": "forest"},      # Journey 1: Forest
	{"from": 10, "to": 13, "track": "coast"},       # Journey 1: Coast
	{"from": 13, "to": 18, "track": "spain"},       # Journey 2: Almería→Madrid
	{"from": 18, "to": 20, "track": "eggplant"},    # Side: Eggplant
	{"from": 20, "to": 24, "track": "andalucia"},   # Journey 3: Jaén→Tabernas
	{"from": 24, "to": 30, "track": "levant_coast"}, # Journey 3: Murcia→Night
	{"from": 30, "to": 35, "track": "valencia"},    # Journey 3: Valencia→Teruel
	{"from": 35, "to": 38, "track": "aragon"},      # Journey 3: Zaragoza→Barcelona
]

signal switch_to_vn(slide: int)
signal switch_to_driving(level: int)

func vn_finished_at(slide_idx: int):
	# Check if this slide triggers a driving segment
	for i in range(levels.size()):
		if levels[i]["from"] == slide_idx:
			current_level = i
			current_state = State.DRIVING
			switch_to_driving.emit(i)
			return
	# Otherwise continue VN
	current_state = State.VN

func driving_finished():
	var lvl = levels[current_level]
	current_state = State.VN
	switch_to_vn.emit(lvl["to"])
