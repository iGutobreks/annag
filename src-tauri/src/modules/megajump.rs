use super::modules::{pattern_movement, game};
use crate::Memory::memory_parser;

#[tauri::command]
pub fn enable_megajump(enable: bool) {
	std::thread::spawn(move || {
			if enable {
			match memory_parser(
				pattern_movement::MEGAJUMP, 
				30, 
				game::PROCESS, 
				None, 
				Some(pattern_movement::MEGAJUMP_ENABLE)) {
			    Ok(_) => {},
			    Err(_) => panic!("an error occurred!"),
			}
			return;
		}
		match memory_parser(
			pattern_movement::MEGAJUMP_ENABLE, 
			30, 
			game::PROCESS, 
			None, 
			Some(pattern_movement::MEGAJUMP)) {
			Ok(_) => {},
			Err(_) => panic!("an error occurred!"),
		}
	});
}