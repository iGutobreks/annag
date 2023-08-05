pub mod game {
	pub const PROCESS: &str = "javaw";
}

pub mod pattern_combat {
	pub const REACH: &str = "00 00 00 00 00 00 08 40 00 00 00 00 00";
	pub const VELOCITY: &str = "00 00 00 00 00 40 BF 40";
	pub const VELOCITY_ENABLE: &str = "00 00 00 00 00 94 C1 40 00 00";
}

pub mod pattern_movement {
	pub const BHOP: &str = "C3 F5 68 3F";
	pub const BHOP_ENABLE: &str = "10 00 80 3F";
	pub const SPEED: &str = "00 00 00 00 00 40 8F 40";
	pub const SPEED_ENABLE: &str = "00 00 00 00 00 00 89 40";
	pub const MEGAJUMP: &str = "3D 0A D7 3E";
	pub const MEGAJUMP_ENABLE: &str = "10 00 80 3F";
}