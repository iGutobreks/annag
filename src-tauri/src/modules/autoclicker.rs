use winapi::{
	um::winuser::{PostMessageA,FindWindowA, GetAsyncKeyState, VK_LBUTTON},
};
use std::ptr::null;
use std::ffi::CString;

static mut ENABLE: bool = false;

#[tauri::command]
pub fn enable_autoclicker(cps: f32, title: String, enable: bool) {
	unsafe {ENABLE = enable};

	let click_per_secound = (1000.0 / cps * 0.1) * 10.0;

	let window = CString::new(title).unwrap();
	std::thread::spawn(move || {
		let h_wnd = unsafe {FindWindowA(null(), window.as_ptr())};
	
		if h_wnd == 0 {
			eprintln!("cant resume this title");
			break;
		}
	
		loop {
			if unsafe {ENABLE} {
				if (unsafe {GetAsyncKeyState(VK_LBUTTON) as u16 & 0x8000} )!= 0 {
					unsafe {
						PostMessageA(h_wnd, 0x0201, 0x0, 0x0);
						PostMessageA(h_wnd, 0x0202, 0x0, 0x0);
					}
					std::thread::sleep(std::time::Duration::from_millis(click_per_secound as u64));
				}
			} else {
				break;
			}
		}
	});
}

