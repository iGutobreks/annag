// Prevents additional console window on Windows in release, DO NOT REMOVE!! (really do not remove)
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod modules;
mod Memory;
use crate::modules::reach::*;
use crate::modules::autoclicker::*;
use crate::modules::velocity::*;
use crate::modules::bhop::*;
use crate::modules::speed::*;
use crate::modules::megajump::*;

#[allow(dead_code)]
#[tauri::command]
fn active(value: usize) {
    println!("{}", value);
}

fn main() {
   tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            enable_reach,
            enable_autoclicker,
            enable_velocity,
            enable_bhop,
            enable_speed,
            enable_megajump,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
