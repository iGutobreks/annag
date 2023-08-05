use super::modules::{pattern_movement, game};
use crate::Memory::memory_parser;

#[tauri::command]
pub fn enable_speed(enable: bool) {
	std::thread::spawn(move || {
			if enable {
			match memory_parser(
				pattern_movement::SPEED, 
				30, 
				game::PROCESS, 
				None, 
				Some(pattern_movement::SPEED_ENABLE)) {
				Ok(_) => {},
				Err(_) => panic!("an error occurred!"),
			}
			return;
		}
		match memory_parser(
			pattern_movement::SPEED_ENABLE, 
			30, 
			game::PROCESS, 
			None, 
			Some(pattern_movement::SPEED)) {
			Ok(_) => {},
			Err(_) => panic!("an error occurred!"),
		}
	});
}