use std::ffi::{CStr};
use std::ptr;
use winapi::shared::minwindef::{DWORD, FALSE};
use winapi::um::processthreadsapi::{OpenProcess};
use winapi::um::winnt::{PROCESS_QUERY_INFORMATION, PROCESS_VM_READ};
use winapi::um::psapi::{GetModuleBaseNameA};
use winapi::um::winnt::{HANDLE, LPCSTR, LPSTR, PROCESS_ALL_ACCESS};
use winapi::shared::minwindef::MAX_PATH;

pub fn memory_parser<'a>(pattern: &str, max_address: usize, process_name: &str, pattern_writer: Option<f32>, pattern_wslice: Option<&str>) -> Result<(usize, usize), &'a str> {
  let pid = get_pid(process_name);
  let slice = get_slice(pattern);
  let scan_result = scan_array(pid, slice.as_slice(), max_address);

  let process_handle = open_process(pid);
  let (scan_quantity, mut changed_quantity) = (scan_result.1, scan_result.0.len());

  if !(scan_result.0).is_empty() {
    for address in scan_result.0 {
      println!("changed 0x{:X}", &address);

      if pattern_writer.is_some() {
        let value_bytes = pattern_writer.unwrap().to_le_bytes();
        write_array(process_handle, address, value_bytes.to_vec().as_slice());
      }

      if pattern_wslice.is_some() {
        write_array(process_handle, address, get_slice(pattern_wslice.unwrap()).as_slice());
      }
    }
  } else {
    return Err("not find this aob");
  }

  close_handle(process_handle);

  Ok((scan_quantity, changed_quantity))
}

fn string_to_hex_slice(string: &str) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
  let hex_vec: Result<Vec<u8>, _> = string
      .split_whitespace()
      .map(|hex_str| {
        u8::from_str_radix(hex_str, 16)
            .map_err(|_e| format!("Failed to parse hexadecimal value: {}", hex_str))
      })
      .collect();

  Ok(hex_vec?)
}


fn get_slice(pattern: &str) -> Vec<u8>{
  string_to_hex_slice(pattern).unwrap()
}

fn get_pid(process_name: &str) -> DWORD {
  let mut processes: [DWORD; 1024] = [0; 1024];
  let mut bytes_returned: DWORD = 0;

  unsafe {
    if winapi::um::psapi::EnumProcesses(
      processes.as_mut_ptr(),
      std::mem::size_of_val(&processes) as DWORD,
      &mut bytes_returned,
    ) != FALSE
    {
      let num_processes = bytes_returned / std::mem::size_of::<DWORD>() as DWORD;

      for i in 0..num_processes {
        let process_id = processes[i as usize];

        if let Some(name) = get_process_name(process_id) {
          if name.to_lowercase().contains(process_name) {
            return process_id;
          }
        }
      }
    }
  }

  panic!("Process '{}' not found", process_name);
}

fn get_process_name(process_id: DWORD) -> Option<String> {
  let process_handle = unsafe {
    OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE, process_id)
  };

  if process_handle != ptr::null_mut() {
    let mut module_handles: [winapi::shared::minwindef::HMODULE; 1024] = [ptr::null_mut(); 1024];
    let mut bytes_returned: DWORD = 0;

    unsafe {
      if winapi::um::psapi::EnumProcessModules(
        process_handle,
        module_handles.as_mut_ptr(),
        std::mem::size_of_val(&module_handles) as DWORD,
        &mut bytes_returned,
      ) != FALSE
      {
        let num_modules = bytes_returned / std::mem::size_of::<winapi::shared::minwindef::HMODULE>() as DWORD;

        for i in 0..num_modules {
          let mut module_name: [winapi::shared::minwindef::UCHAR; MAX_PATH] = [0; MAX_PATH];

          if GetModuleBaseNameA(
            process_handle,
            module_handles[i as usize],
            module_name.as_mut_ptr() as LPSTR,
            std::mem::size_of_val(&module_name) as DWORD,
          ) != FALSE as u32
          {
            let name = CStr::from_ptr(module_name.as_ptr() as LPCSTR).to_string_lossy().into_owned();
            return Some(name);
          }
        }
      }
    }
  }

  None
}

fn scan_array(pid: DWORD, pattern: &[u8], max_addresses: usize) -> (Vec<usize>, usize) {
  let process_handle = open_process(pid);
  let mut addresses = Vec::new();
  let mut address = 0;
  let mut num_addresses = 0;

  let mut memory_info = unsafe { std::mem::zeroed::<winapi::um::winnt::MEMORY_BASIC_INFORMATION>() };
  let mut buffer = vec![0u8; 4096];
  let mut scan_quantity = 0;

  while address < usize::MAX && num_addresses < max_addresses {
    let result = unsafe {
      winapi::um::memoryapi::VirtualQueryEx(
        process_handle,
        address as winapi::shared::minwindef::LPCVOID,
        &mut memory_info,
        std::mem::size_of::<winapi::um::winnt::MEMORY_BASIC_INFORMATION>(),
      )
    };

    if result == 0 {
      break;
    }

    if memory_info.State == winapi::um::winnt::MEM_COMMIT
        && (memory_info.Protect & winapi::um::winnt::PAGE_GUARD) == 0
        && (memory_info.Protect & winapi::um::winnt::PAGE_NOACCESS) == 0
    {
      let mut region_size = memory_info.RegionSize as usize;
      let mut region_address = address;

      while region_size > 0 && num_addresses < max_addresses {
        let bytes_to_read = std::cmp::min(region_size, buffer.len());
        let mut bytes_read = 0;

        let result = unsafe {
          winapi::um::memoryapi::ReadProcessMemory(
            process_handle,
            region_address as winapi::shared::minwindef::LPCVOID,
            buffer.as_mut_ptr() as winapi::shared::minwindef::LPVOID,
            bytes_to_read,
            &mut bytes_read,
          )
        };

        if result != 0 && bytes_read >= pattern.len() {
          let data = &buffer[..bytes_read];

          if let Some(index) = data.windows(pattern.len()).position(|window| window == pattern) {
            let pattern_address = region_address + index;
            addresses.push(pattern_address);
            num_addresses += 1;
          }
        }

        region_address += bytes_read;
        region_size -= bytes_read;
      }
    }

    address += memory_info.RegionSize as usize;

    scan_quantity += 1;
    println!("{}", &address);
  }

  close_handle(process_handle);

  (addresses, scan_quantity)
}

fn write_array(process_handle: HANDLE, address: usize, data: &[u8]) {
  let mut old_protect: winapi::shared::minwindef::DWORD = 0;

  unsafe {
    winapi::um::memoryapi::VirtualProtectEx(
      process_handle,
      address as winapi::shared::minwindef::LPVOID,
      data.len(),
      winapi::um::winnt::PAGE_EXECUTE_READWRITE,
      &mut old_protect as *mut _ as winapi::shared::minwindef::PDWORD,
    );

    let mut bytes_written: usize = 0;

    winapi::um::memoryapi::WriteProcessMemory(
      process_handle,
      address as winapi::shared::minwindef::LPVOID,
      data.as_ptr() as winapi::shared::minwindef::LPCVOID,
      data.len(),
      &mut bytes_written,
    );

    winapi::um::memoryapi::VirtualProtectEx(
      process_handle,
      address as winapi::shared::minwindef::LPVOID,
      data.len(),
      old_protect,
      &mut old_protect as *mut _ as winapi::shared::minwindef::PDWORD,
    );
  }
}

fn open_process(pid: DWORD) -> HANDLE {
  let process_handle = unsafe {
    OpenProcess(PROCESS_ALL_ACCESS, FALSE, pid)
  };

  if process_handle == ptr::null_mut() {
    panic!("Failed to open process");
  }

  process_handle
}

fn close_handle(handle: HANDLE) {
  unsafe {
    winapi::um::handleapi::CloseHandle(handle);
  }
}