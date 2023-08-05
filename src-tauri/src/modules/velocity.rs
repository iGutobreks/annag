
use super::modules::{pattern_combat, game};
use crate::Memory::memory_parser;

#[tauri::command]
pub fn enable_velocity(enable: bool) {
	std::thread::spawn(move || {
			if enable {
			match memory_parser(
				pattern_combat::VELOCITY, 
				usize::MAX, 
				game::PROCESS, 
				None, 
				Some(pattern_combat::VELOCITY_ENABLE)
			) {
				Ok(_) => {},
				Err(_) => panic!("an error occurred!"),
			};
			return;
		}
		match memory_parser(
			pattern_combat::VELOCITY_ENABLE, 
			usize::MAX, 
			game::PROCESS, 
			None, 
			Some(pattern_combat::VELOCITY)
		) {
			Ok(_) => {},
			Err(_) => panic!("an error occurred!"),
		};
	});
}