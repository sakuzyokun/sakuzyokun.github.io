import platform
import socket
import os
import time
import argparse
import shutil
import tkinter as tk
from tkinter import ttk, simpledialog

# ===== Static Info =====
def get_static_info():
    return {
        "OS": platform.system(),
        "OS Version": platform.version(),
        "Architecture": platform.machine(),
        "Hostname": socket.gethostname(),
        "IP Address": get_ip_address(),
        "Processor": platform.processor(),
    }

def get_ip_address():
    try:
        return socket.gethostbyname(socket.gethostname())
    except socket.gaierror:
        return "Unknown"

# ===== Dynamic Info =====
def get_cpu_usage():
    if os.name == 'posix':
        with open("/proc/stat") as f:
            fields = list(map(int, f.readline().split()[1:]))
        idle1, total1 = fields[3], sum(fields)
        time.sleep(0.1)
        with open("/proc/stat") as f:
            fields = list(map(int, f.readline().split()[1:]))
        idle2, total2 = fields[3], sum(fields)
        return 100 * (1 - (idle2 - idle1) / (total2 - total1))
    elif os.name == 'nt':
        import ctypes
        class FILETIME(ctypes.Structure):
            _fields_ = [("dwLowDateTime", ctypes.c_ulong),
                        ("dwHighDateTime", ctypes.c_ulong)]
        idle, kernel, user = FILETIME(), FILETIME(), FILETIME()
        ctypes.windll.kernel32.GetSystemTimes(
            ctypes.byref(idle), ctypes.byref(kernel), ctypes.byref(user))
        def to_int(ft): return (ft.dwHighDateTime << 32) + ft.dwLowDateTime
        idle1, total1 = to_int(idle), to_int(kernel) + to_int(user)
        time.sleep(0.1)
        ctypes.windll.kernel32.GetSystemTimes(
            ctypes.byref(idle), ctypes.byref(kernel), ctypes.byref(user))
        idle2, total2 = to_int(idle), to_int(kernel) + to_int(user)
        return 100 * (1 - (idle2 - idle1) / (total2 - total1))
    return None

def get_memory_usage():
    if os.name == 'posix':
        with open('/proc/meminfo') as f:
            lines = f.readlines()
            total = int(lines[0].split()[1])
            available = int(lines[2].split()[1])
            used = total - available
            return used / 1024, total / 1024
    elif os.name == 'nt':
        import ctypes
        class MEMORYSTATUSEX(ctypes.Structure):
            _fields_ = [('dwLength', ctypes.c_ulong),
                        ('dwMemoryLoad', ctypes.c_ulong),
                        ('ullTotalPhys', ctypes.c_ulonglong),
                        ('ullAvailPhys', ctypes.c_ulonglong),
                        *[(f'f{i}', ctypes.c_ulonglong) for i in range(6)]]
        mem = MEMORYSTATUSEX()
        mem.dwLength = ctypes.sizeof(mem)
        ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(mem))
        total = mem.ullTotalPhys / (1024 ** 2)
        used = total - (mem.ullAvailPhys / (1024 ** 2))
        return used, total
    return 0, 0

def get_disk_usage():
    try:
        total, used, _ = shutil.disk_usage("/")
        return used // (1024 ** 3), total // (1024 ** 3)
    except:
        return 0, 0

def get_network_bytes():
    if os.name == 'posix':
        with open('/proc/net/dev') as f:
            lines = f.readlines()[2:]
            total_recv, total_sent = 0, 0
            for line in lines:
                parts = line.split()
                total_recv += int(parts[1])
                total_sent += int(parts[9])
            return total_recv, total_sent
    elif os.name == 'nt':
        import ctypes
        import ctypes.wintypes as wintypes

        MIB_IF_ROW2_SIZE = 864  # Windows 10+
        class MIB_IF_ROW2(ctypes.Structure):
            _fields_ = [("Data", ctypes.c_byte * MIB_IF_ROW2_SIZE)]

        GetIfTable2 = ctypes.windll.Iphlpapi.GetIfTable2
        FreeMibTable = ctypes.windll.Iphlpapi.FreeMibTable
        GetIfEntry2 = ctypes.windll.Iphlpapi.GetIfEntry2

        class MIB_IF_TABLE2(ctypes.Structure):
            _fields_ = [("NumEntries", ctypes.c_ulong),
                        ("Table", MIB_IF_ROW2 * 128)]

        table = ctypes.POINTER(MIB_IF_TABLE2)()
        GetIfTable2(ctypes.byref(table))
        recv, sent = 0, 0
        for i in range(table.contents.NumEntries):
            row = table.contents.Table[i]
            recv += int.from_bytes(row.Data[552:560], 'little')
            sent += int.from_bytes(row.Data[560:568], 'little')
        FreeMibTable(table)
        return recv, sent
    return 0, 0

# ===== CLI =====
def display_cli_loop(interval):
    try:
        prev_recv, prev_sent = get_network_bytes()
        while True:
            os.system('cls' if os.name == 'nt' else 'clear')
            static = get_static_info()
            print("=== System Info ===")
            for k, v in static.items():
                print(f"{k}: {v}")

            cpu = get_cpu_usage()
            mem_used, mem_total = get_memory_usage()
            disk_used, disk_total = get_disk_usage()
            curr_recv, curr_sent = get_network_bytes()

            net_recv = (curr_recv - prev_recv) / interval / 1024
            net_sent = (curr_sent - prev_sent) / interval / 1024
            prev_recv, prev_sent = curr_recv, curr_sent

            print("\n=== Live Status ===")
            print(f"CPU Usage: {cpu:.1f}%")
            print(f"Memory Usage: {mem_used:.1f} / {mem_total:.1f} MB")
            print(f"Disk Usage: {disk_used} / {disk_total} GB")
            print(f"Network: ↓ {net_recv:.1f} KB/s | ↑ {net_sent:.1f} KB/s")

            time.sleep(interval)
    except KeyboardInterrupt:
        print("\n終了しました。")

# ===== GUI =====
class SystemMonitorGUI:
    def __init__(self, interval):
        self.interval = interval
        self.prev_recv, self.prev_sent = get_network_bytes()

        self.root = tk.Tk()
        self.root.title("System Monitor")
        self.labels = {}

        self.build_menu()
        self.build_layout()
        self.update_dynamic()
        self.root.mainloop()

    def build_menu(self):
        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)

        setting_menu = tk.Menu(menubar, tearoff=0)
        setting_menu.add_command(label="更新間隔を変更", command=self.change_interval)
        menubar.add_cascade(label="設定", menu=setting_menu)

    def build_layout(self):
        frame = ttk.Frame(self.root, padding=20)
        frame.grid()

        static = get_static_info()
        ttk.Label(frame, text="System Info", font=("Segoe UI", 12, "bold")).grid(row=0, column=0, columnspan=2, sticky='w')
        row = 1
        for k, v in static.items():
            ttk.Label(frame, text=f"{k}:").grid(row=row, column=0, sticky='w')
            ttk.Label(frame, text=v).grid(row=row, column=1, sticky='w')
            row += 1

        ttk.Label(frame, text="Live Status", font=("Segoe UI", 12, "bold")).grid(row=row, column=0, columnspan=2, sticky='w', pady=(10, 0))
        row += 1
        for key in ["CPU Usage", "Memory Usage", "Disk Usage", "Network"]:
            ttk.Label(frame, text=f"{key}:").grid(row=row, column=0, sticky='w')
            self.labels[key] = ttk.Label(frame, text="...")
            self.labels[key].grid(row=row, column=1, sticky='w')
            row += 1

    def update_dynamic(self):
        cpu = get_cpu_usage()
        mem_used, mem_total = get_memory_usage()
        disk_used, disk_total = get_disk_usage()
        curr_recv, curr_sent = get_network_bytes()

        net_recv = (curr_recv - self.prev_recv) / self.interval / 1024
        net_sent = (curr_sent - self.prev_sent) / self.interval / 1024
        self.prev_recv, self.prev_sent = curr_recv, curr_sent

        self.labels["CPU Usage"].config(text=f"{cpu:.1f}%")
        self.labels["Memory Usage"].config(text=f"{mem_used:.1f} / {mem_total:.1f} MB")
        self.labels["Disk Usage"].config(text=f"{disk_used} / {disk_total} GB")
        self.labels["Network"].config(text=f"↓ {net_recv:.1f} KB/s | ↑ {net_sent:.1f} KB/s")

        self.root.after(int(self.interval * 1000), self.update_dynamic)

    def change_interval(self):
        new_value = simpledialog.askfloat("更新間隔", "更新間隔（秒）を入力：", minvalue=0.5, maxvalue=60)
        if new_value:
            self.interval = new_value

# ===== Main =====
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--gui", action="store_true", help="GUIモードで表示")
    parser.add_argument("--interval", type=float, default=1.0, help="更新間隔（秒）")
    args = parser.parse_args()

    if args.gui:
        SystemMonitorGUI(args.interval)
    else:
        display_cli_loop(args.interval)
