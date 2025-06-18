import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import platform
import threading
import requests
import os
import sys

# ---- ショートカット作成 (Windowsのみ) ----
def create_shortcut(name, target, shortcut_dir):
    import winshell
    from win32com.client import Dispatch
    shortcut_path = os.path.join(shortcut_dir, f"{name}.lnk")
    shell = Dispatch('WScript.Shell')
    shortcut = shell.CreateShortCut(shortcut_path)
    shortcut.Targetpath = target
    shortcut.WorkingDirectory = os.path.dirname(target)
    shortcut.IconLocation = target
    shortcut.save()

# ---- インストール対象ファイル ----
INSTALL_FILES = {
    "Windows": [
        {"name": "Lite Explorer", "url": "https://sakuzyokun.github.io/LiteExplorer/files/LiteExplorer.exe"},
        {"name": "Lite Explorer (32bit版,x86)", "url": "https://sakuzyokun.github.io/LiteExplorer/files/LiteExplorer_x86.exe"},
        {"name": "GFT Viewer & Editor", "url": "https://sakuzyokun.github.io/gft/libs/GFT.py"},
        {"name": "MP4→GFT変換", "url": "https://sakuzyokun.github.io/gft/libs/mp4_gft.py"},
        {"name": "ファイル情報ビューア", "url": "https://sakuzyokun.github.io/app_distribution/file_info/file_info.py"},
        {"name": "OS Info", "url": "https://sakuzyokun.github.io/app_distribution/os_info/os_info.py"},
        {"name": "Process Info", "url": "https://sakuzyokun.github.io/app_distribution/os_info/process_info.py"},
        {"name": "圧縮 ZIPファイル", "url": "https://sakuzyokun.github.io/app_distribution/CompZ/Compress_ZIPfile.py"},
        {"name": "WinQuickLauncher", "url": "https://sakuzyokun.github.io/app_distribution/WQL/WinQuickLauncher.bat"},
        {"name": "Temp & Cache Cleanup Tool", "url": "https://sakuzyokun.github.io/app_distribution/TCT/Temp_Cleanup_Tool.bat"},
        {"name": "YukkuriMovieMaker Installer", "url": "https://github.com/sakuzyokun/YukkuriMovieMaker_Installer/releases/download/1.0.1/YukkuriMovieMaker_Installer.bat"},
        {"name": "RomajiLang", "url": "https://github.com/sakuzyokun/RomajiLang/releases/download/1.0.0/romajilang.py"},
    ],
    "Other": [
        {"name": "GFT Viewer & Editor", "url": "https://sakuzyokun.github.io/gft/libs/GFT.py"},
        {"name": "MP4→GFT変換", "url": "https://sakuzyokun.github.io/gft/libs/mp4_gft.py"},
        {"name": "ファイル情報ビューア", "url": "https://sakuzyokun.github.io/app_distribution/file_info/file_info.py"},
        {"name": "OS Info", "url": "https://sakuzyokun.github.io/app_distribution/os_info/os_info.py"},
        {"name": "Process Info", "url": "https://sakuzyokun.github.io/app_distribution/os_info/process_info.py"},
        {"name": "圧縮 ZIPファイル", "url": "https://sakuzyokun.github.io/app_distribution/CompZ/Compress_ZIPfile.py"},
        {"name": "RomajiLang", "url": "https://github.com/sakuzyokun/RomajiLang/releases/download/1.0.0/romajilang.py"},
    ]
}

class InstallerApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Sakuzyokun application Installer セットアップ")
        self.geometry("600x350")
        self.resizable(False, False)

        self.os_type = platform.system()
        self.selected_files = []
        self.install_path = ""
        self.create_desktop = False
        self.create_startmenu = False
        self.current_page = 0
        self.frames = []

        self.container = tk.Frame(self)
        self.container.pack(expand=True, fill="both")

        self.nav_frame = ttk.Frame(self)
        self.nav_frame.pack(fill="x")

        self.back_btn = ttk.Button(self.nav_frame, text="戻る", command=self.go_back)
        self.next_btn = ttk.Button(self.nav_frame, text="次へ", command=self.go_next)
        self.cancel_btn = ttk.Button(self.nav_frame, text="キャンセル", command=self.quit)

        self.back_btn.pack(side="left", padx=5, pady=5)
        self.cancel_btn.pack(side="right", padx=5, pady=5)
        self.next_btn.pack(side="right", padx=5, pady=5)

        self.setup_pages()
        self.show_page(0)

    def setup_pages(self):
        self.frames = [
            WelcomePage(self.container, self),
            LicensePage(self.container, self),
            FileSelectPage(self.container, self),
            PathSelectPage(self.container, self),
            ShortcutPage(self.container, self) if self.os_type == "Windows" else DummyPage(self.container),
            DownloadPage(self.container, self),
            CompletePage(self.container, self),
        ]
        for frame in self.frames:
            frame.grid(row=0, column=0, sticky="nsew")

    def show_page(self, index):
        self.current_page = index
        frame = self.frames[index]
        frame.tkraise()
        self.back_btn.config(state="normal" if index > 0 else "disabled")
        self.next_btn.config(text="完了" if index == len(self.frames) - 1 else "次へ")

    def go_next(self):
        current = self.frames[self.current_page]
        if not current.validate():
            return
        if self.current_page < len(self.frames) - 1:
            self.show_page(self.current_page + 1)
        else:
            self.quit()

    def go_back(self):
        if self.current_page > 0:
            self.show_page(self.current_page - 1)

class WelcomePage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        ttk.Label(self, text="Sakuzyokun application Installer \nセットアップ", font=("Segoe UI", 16)).pack(pady=20)
        ttk.Label(self, text="Sakuzyokun application Installerは、ご使用のコンピュータへ \n削除くんが作ったアプリをインストールします。「次へ」を押して続行してください").pack()
    def validate(self): return True

class LicensePage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller
        self.accept_var = tk.BooleanVar()

        ttk.Label(self, text="使用許諾契約書", font=("Segoe UI", 14)).pack(pady=10)
        text_frame = tk.Frame(self)
        text_frame.pack(padx=10, pady=5, expand=True, fill="both")

        self.license_text = tk.Text(text_frame, wrap="word", height=10)
        self.license_text.pack(side="left", fill="both", expand=True)

        scrollbar = ttk.Scrollbar(text_frame, orient="vertical", command=self.license_text.yview)
        scrollbar.pack(side="right", fill="y")
        self.license_text.config(yscrollcommand=scrollbar.set)

        license_content = """\
このソフトウェアの使用にあたっては、以下の使用許諾条件に同意いただく必要があります。

1. 本ソフトウェアは無保証で提供されます。
2. 開発者は、本ソフトウェアの使用または使用不能から生じるいかなる損害についても責任を負いません。
3. この使用許諾は、日本国の法律に準拠します。
4. 本ソフトウェアの再配布は禁止されています。ただし、本ソフトウェアを改変した上での再配布は許可されます。その際は、改変したことを明記してください。
5. 改変版を再配布する際は、本ソフトウェアの原作者として開発者名を明記してください。
6. 本ソフトウェアおよびその改変版の商用利用は禁止されています。

上記に同意しない場合、本ソフトウェアをインストールまたは使用しないでください。"""
        self.license_text.insert("1.0", license_content)
        self.license_text.config(state="disabled")

        ttk.Checkbutton(self, text="使用許諾契約書に同意します", variable=self.accept_var).pack(pady=10)

    def validate(self):
        if not self.accept_var.get():
            messagebox.showwarning("確認", "使用許諾に同意してください。")
            return False
        return True

class FileSelectPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller
        self.selected_files = []
        self.vars = []

        ttk.Label(self, text="インストールするファイルを選んでください", font=("Segoe UI", 12)).pack(pady=10)

        files = INSTALL_FILES["Windows"] if controller.os_type == "Windows" else INSTALL_FILES["Other"]

        for file in files:
            var = tk.BooleanVar(value=True)
            cb = ttk.Checkbutton(self, text=file["name"], variable=var)
            cb.pack(anchor="w", padx=20)
            self.vars.append((var, file))

    def validate(self):
        self.selected_files.clear()
        for var, file in self.vars:
            if var.get():
                self.selected_files.append(file)
        if not self.selected_files:
            messagebox.showwarning("確認", "少なくとも1つのファイルを選んでください。")
            return False
        self.controller.selected_files = self.selected_files
        return True

class PathSelectPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller
        self.path_var = tk.StringVar()
        default_path = "C:\\PY" if controller.os_type == "Windows" else ""
        self.path_var.set(default_path)

        ttk.Label(self, text="インストール先を選んでください", font=("Segoe UI", 12)).pack(pady=10)
        entry = ttk.Entry(self, textvariable=self.path_var, width=40)
        entry.pack(pady=5)
        ttk.Button(self, text="参照", command=self.browse).pack()

    def browse(self):
        folder = filedialog.askdirectory()
        if folder:
            self.path_var.set(folder)

    def validate(self):
        path = self.path_var.get().strip()
        if not path:
            messagebox.showwarning("確認", "保存先フォルダを選択してください。")
            return False
        self.controller.install_path = path
        return True

class ShortcutPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller
        self.desktop = tk.BooleanVar(value=True)
        self.startmenu = tk.BooleanVar(value=True)

        ttk.Label(self, text="ショートカットを作成しますか？", font=("Segoe UI", 12)).pack(pady=10)
        ttk.Checkbutton(self, text="デスクトップに作成", variable=self.desktop).pack(anchor="w", padx=20)
        ttk.Checkbutton(self, text="スタートメニューに作成", variable=self.startmenu).pack(anchor="w", padx=20)

    def validate(self):
        self.controller.create_desktop = self.desktop.get()
        self.controller.create_startmenu = self.startmenu.get()
        return True

class DummyPage(tk.Frame):
    def validate(self): return True

class DownloadPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller
        ttk.Label(self, text="インストール中...", font=("Segoe UI", 14)).pack(pady=20)
        self.progress = ttk.Progressbar(self, orient="horizontal", mode="determinate", length=300)
        self.progress.pack(pady=10)
        self.status = ttk.Label(self, text="")
        self.status.pack()

    def validate(self):
        # ボタンを無効化しておく（インストール中は押せないように）
        self.controller.next_btn.config(state="disabled")
        self.controller.back_btn.config(state="disabled")
        self.download_files()
        return True

    def download_files(self):
        def run():
            files = self.controller.selected_files
            total = len(files)
            self.progress["maximum"] = total

            for i, file in enumerate(files):
                name = file["name"]
                url = file["url"]
                self.status.config(text=f"{name} をダウンロード中...")
                try:
                    r = requests.get(url)
                    r.raise_for_status()
                    filename = os.path.join(self.controller.install_path, os.path.basename(url))
                    os.makedirs(os.path.dirname(filename), exist_ok=True)
                    with open(filename, "wb") as f:
                        f.write(r.content)
                except Exception as e:
                    messagebox.showerror("エラー", f"{name} のダウンロード失敗: {e}")
                self.progress["value"] = i + 1
                self.update_idletasks()

            self.status.config(text="すべてのファイルをインストールしました")

            if self.controller.os_type == "Windows":
                if self.controller.create_desktop:
                    desktop = os.path.join(os.environ["USERPROFILE"], "Desktop")
                    for f in files:
                        target = os.path.join(self.controller.install_path, os.path.basename(f["url"]))
                        create_shortcut(f["name"], target, desktop)
                if self.controller.create_startmenu:
                    startmenu = os.path.join(os.environ["APPDATA"], "Microsoft", "Windows", "Start Menu", "Programs")
                    for f in files:
                        target = os.path.join(self.controller.install_path, os.path.basename(f["url"]))
                        create_shortcut(f["name"], target, startmenu)

            # 完了ページへ自動で遷移する（インストール終わったら）
            self.controller.show_page(self.controller.current_page + 1)
            self.controller.next_btn.config(state="normal")
            self.controller.back_btn.config(state="disabled")

        threading.Thread(target=run).start()

class CompletePage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        ttk.Label(self, text="インストール完了", font=("Segoe UI", 14)).pack(pady=20)
        ttk.Label(self, text="Sakuzyokun application Installer のインストールが完了しました。\n「完了」をクリックしてウィザードを終了します。").pack()

if __name__ == "__main__":
    app = InstallerApp()
    app.mainloop()
