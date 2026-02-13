use std::ffi::OsString;
use std::os::windows::ffi::OsStringExt;
use winapi::um::winuser::{GetForegroundWindow, GetWindowTextW, GetWindowThreadProcessId};
use winapi::um::processthreadsapi::OpenProcess;
use winapi::um::handleapi::CloseHandle;
use winapi::um::psapi::{GetModuleFileNameExW, PROCESS_QUERY_INFORMATION, PROCESS_VM_READ};

pub struct WindowInfo {
    pub title: String,
    pub process_name: String,
}

pub fn get_active_window() -> Option<WindowInfo> {
    unsafe {
        let hwnd = GetForegroundWindow();
        if hwnd.is_null() {
            return None;
        }
        
        let title = get_window_title(hwnd);
        let process_name = get_process_name(hwnd);
        
        Some(WindowInfo {
            title,
            process_name,
        })
    }
}

unsafe fn get_window_title(hwnd: winapi::shared::windef::HWND) -> String {
    let mut buffer: [u16; 512] = [0; 512];
    let length = GetWindowTextW(hwnd, buffer.as_mut_ptr(), buffer.len() as i32);
    
    if length == 0 {
        return String::new();
    }
    
    let os_string = OsString::from_wide(&buffer[..length as usize]);
    os_string.to_string_lossy().to_string()
}

unsafe fn get_process_name(hwnd: winapi::shared::windef::HWND) -> String {
    let mut process_id: u32 = 0;
    GetWindowThreadProcessId(hwnd, &mut process_id);
    
    if process_id == 0 {
        return String::new();
    }
    
    let process_handle = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, 0, process_id);
    
    if process_handle.is_null() {
        return String::new();
    }
    
    let mut buffer: [u16; 512] = [0; 512];
    let length = GetModuleFileNameExW(process_handle, std::ptr::null_mut(), buffer.as_mut_ptr(), buffer.len() as u32);
    
    CloseHandle(process_handle);
    
    if length == 0 {
        return String::new();
    }
    
    let os_string = OsString::from_wide(&buffer[..length as usize]);
    let path = os_string.to_string_lossy().to_string();
    
    path.rsplit('\\').next().unwrap_or(&path).to_string()
}

pub fn is_idle() -> bool {
    use winapi::um::winuser::{GetLastInputInfo, LASTINPUTINFO};
    use winapi::shared::minwindef::DWORD;
    use std::mem::size_of;
    
    unsafe {
        let mut last_input: LASTINPUTINFO = std::mem::zeroed();
        last_input.cbSize = size_of::<LASTINPUTINFO>() as DWORD;
        
        if GetLastInputInfo(&mut last_input) == 0 {
            return false;
        }
        
        let tick_count = winapi::um::sysinfoapi::GetTickCount64() as DWORD;
        let idle_time = tick_count - last_input.dwTime;
        
        idle_time > 300_000
    }
}
