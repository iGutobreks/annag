use super::modules::{pattern_combat, game};
use crate::Memory::memory_parser;

#[tauri::command]
pub fn enable_reach(min: f32, max: f32) {
	let convert: f32 = (max / min) * 3.0; 

	std::thread::spawn(move || {
		match memory_parser(
			pattern_combat::REACH, 
			usize::MAX, 
			game::PROCESS, 
			Some(convert), 
			None
		) {
			Ok(_) => {},
			Err(_) => panic!("an error occurred!"),
		};
	}); 
}