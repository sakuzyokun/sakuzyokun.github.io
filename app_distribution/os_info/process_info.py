# フル機能付きシステムモニター（GUI + CLI）
# OS情報、CPU、メモリ、ディスク、ネットワーク、バッテリー、プロセス表示対応

import argparse
import os
import platform
import time
import threading
import tkinter as tk
from tkinter import ttk, messagebox
import psutil
import shutil

def get_system_info():
    return {
        "OS": platform.system(),
        "OS Version": platform.version(),
        "Architecture": platform.machine(),
        "Processor": platform.processor(),
        "Hostname": platform.node()
    }

def get_cpu_usage():
    return psutil.cpu_percent(interval=None)

def get_memory_info():
    mem = psutil.virtual_memory()
    return {
        "total": mem.total,
        "available": mem.available,
        "percent": mem.percent,
        "used": mem.used,
        "free": mem.free
    }

def get_disk_info():
    usage = shutil.disk_usage("/")
    return {
        "total": usage.total,
        "used": usage.used,
        "free": usage.free,
        "percent": (usage.used / usage.total) * 100
    }

def get_network_bytes():
    try:
        net = psutil.net_io_counters()
        return net.bytes_recv, net.bytes_sent
    except Exception:
        return 0, 0

def get_battery_info():
    battery = psutil.sensors_battery()
    if battery:
        return {
            "percent": battery.percent,
            "plugged": battery.power_plugged,
            "secsleft": battery.secsleft
        }
    return None

def get_process_list(limit=None):
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
        try:
            info = proc.info
            processes.append(info)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    processes.sort(key=lambda x: x['cpu_percent'], reverse=True)
    return processes[:limit] if limit else processes

def bytes_to_gb(b):
    return f"{b / (1024 ** 3):.2f} GB"

def display_cli(interval):
    prev_recv, prev_sent = get_network_bytes()
    try:
        while True:
            os.system("cls" if os.name == "nt" else "clear")
            info = get_system_info()
            print("=== System Info ===")
            for k, v in info.items():
                print(f"{k}: {v}")

            print("\n=== CPU ===")
            print(f"Usage: {get_cpu_usage():.1f}%")

            print("\n=== Memory ===")
            mem = get_memory_info()
            print(f"Used: {bytes_to_gb(mem['used'])} / {bytes_to_gb(mem['total'])} ({mem['percent']}%)")

            print("\n=== Disk ===")
            disk = get_disk_info()
            print(f"Used: {bytes_to_gb(disk['used'])} / {bytes_to_gb(disk['total'])} ({disk['percent']:.1f}%)")

            print("\n=== Network ===")
            recv, sent = get_network_bytes()
            print(f"Download: {(recv - prev_recv)/interval/1024:.2f} KB/s")
            print(f"Upload:   {(sent - prev_sent)/interval/1024:.2f} KB/s")
            prev_recv, prev_sent = recv, sent

            battery = get_battery_info()
            if battery:
                print("\n=== Battery ===")
                print(f"Charge: {battery['percent']}% {'(Charging)' if battery['plugged'] else '(Discharging)'}")

            print("\n=== Top Processes ===")
            processes = get_process_list(limit=10)
            print(f"{'PID':>6} {'Name':<25} {'CPU%':>6} {'Mem%':>6}")
            for proc in processes:
                print(f"{proc['pid']:>6} {proc['name'][:25]:<25} {proc['cpu_percent']:>6.1f} {proc['memory_percent']:>6.1f}")

            time.sleep(interval)
    except KeyboardInterrupt:
        print("\n[Exited by user]")

class ProcessWindow(tk.Toplevel):
    def __init__(self, master):
        super().__init__(master)
        self.title("Process List")
        self.geometry("600x400")
        self.tree = ttk.Treeview(self, columns=("PID", "Name", "CPU%", "Mem%"), show="headings")
        for col in ("PID", "Name", "CPU%", "Mem%"):
            self.tree.heading(col, text=col)
            self.tree.column(col, width=100 if col != "Name" else 250)
        self.tree.pack(fill=tk.BOTH, expand=True)

        scrollbar = ttk.Scrollbar(self, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        self.update_processes()

    def update_processes(self):
        for item in self.tree.get_children():
            self.tree.delete(item)
        for proc in get_process_list():
            self.tree.insert("", "end", values=(proc["pid"], proc["name"], f"{proc['cpu_percent']:.1f}", f"{proc['memory_percent']:.1f}"))
        self.after(5000, self.update_processes)

class SystemMonitorGUI:
    def __init__(self, interval):
        self.root = tk.Tk()
        self.root.title("System Monitor")
        self.interval = interval

        self.labels = {}
        self.prev_recv, self.prev_sent = get_network_bytes()

        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)

        view_menu = tk.Menu(menubar, tearoff=0)
        view_menu.add_command(label="Show Processes", command=self.show_processes)
        menubar.add_cascade(label="View", menu=view_menu)

        interval_menu = tk.Menu(menubar, tearoff=0)
        for sec in [1, 2, 5, 10]:
            interval_menu.add_command(label=f"{sec} sec", command=lambda s=sec: self.set_interval(s))
        menubar.add_cascade(label="Update Interval", menu=interval_menu)

        frame = tk.Frame(self.root)
        frame.pack(padx=10, pady=10)

        self.label_keys = [
            "CPU", "Memory", "Disk", "Network Down", "Network Up", "Battery"
        ]

        for key in self.label_keys:
            label = tk.Label(frame, text=f"{key}: ", anchor="w", font=("Consolas", 12))
            label.pack(fill=tk.X)
            self.labels[key] = label

        self.update_loop()
        self.root.mainloop()

    def show_processes(self):
        ProcessWindow(self.root)

    def set_interval(self, interval):
        self.interval = interval

    def update_loop(self):
        self.labels["CPU"].config(text=f"CPU: {get_cpu_usage():.1f}%")

        mem = get_memory_info()
        self.labels["Memory"].config(
            text=f"Memory: {bytes_to_gb(mem['used'])}/{bytes_to_gb(mem['total'])} ({mem['percent']}%)"
        )

        disk = get_disk_info()
        self.labels["Disk"].config(
            text=f"Disk: {bytes_to_gb(disk['used'])}/{bytes_to_gb(disk['total'])} ({disk['percent']:.1f}%)"
        )

        recv, sent = get_network_bytes()
        down_speed = (recv - self.prev_recv) / self.interval / 1024
        up_speed = (sent - self.prev_sent) / self.interval / 1024
        self.prev_recv, self.prev_sent = recv, sent

        self.labels["Network Down"].config(text=f"Network Down: {down_speed:.2f} KB/s")
        self.labels["Network Up"].config(text=f"Network Up: {up_speed:.2f} KB/s")

        battery = get_battery_info()
        if battery:
            text = f"Battery: {battery['percent']}% {'(Charging)' if battery['plugged'] else '(Discharging)'}"
        else:
            text = "Battery: N/A"
        self.labels["Battery"].config(text=text)

        self.root.after(int(self.interval * 1000), self.update_loop)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="System Monitor Tool")
    parser.add_argument("--gui", action="store_true", help="Launch GUI mode")
    parser.add_argument("--interval", type=int, default=2, help="Update interval in seconds")
    args = parser.parse_args()

    if args.gui:
        SystemMonitorGUI(args.interval)
    else:
        display_cli(args.interval)
