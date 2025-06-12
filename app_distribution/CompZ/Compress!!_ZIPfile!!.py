import tkinter as tk
from tkinter import ttk, filedialog
import zipfile
import os
import threading
import py7zr
import shutil

def run_gui():
    root = tk.Tk()
    root.title("圧縮！！ZIPファイル！！")
    root.geometry("600x600")

    # ファイル選択リスト
    selected_files = []

    # 圧縮形式
    tk.Label(root, text="圧縮形式を選択:").pack()
    format_var = tk.StringVar(value="zip")
    format_menu = ttk.Combobox(root, textvariable=format_var, values=["zip", "7z"])
    format_menu.pack()

    # 圧縮率とパスワード
    tk.Label(root, text="圧縮率（7zのみ、0〜9）").pack()
    level_scale = tk.Scale(root, from_=0, to=9, orient=tk.HORIZONTAL)
    level_scale.set(5)
    level_scale.pack()

    tk.Label(root, text="パスワード（7zのみ）").pack()
    password_entry = tk.Entry(root, show='*')
    password_entry.pack()

    # プログレスバーとログ
    progress = ttk.Progressbar(root, length=400, mode='determinate')
    progress.pack(pady=10)

    log_text = tk.Text(root, height=12, width=70)
    log_text.pack()

    def log(msg):
        log_text.insert(tk.END, msg + "\n")
        log_text.see(tk.END)
        root.update()

    # ファイル・フォルダ選択ボタン
    def select_files():
        files = filedialog.askopenfilenames(title="圧縮するファイルを選択")
        selected_files.extend(files)
        log(f"📂 選択されたファイル: {', '.join(files)}")

    def select_folder():
        folder = filedialog.askdirectory(title="圧縮するフォルダを選択")
        if folder:
            selected_files.append(folder)
            log(f"📁 選択されたフォルダ: {folder}")

    # 圧縮処理
    def compress():
        def run():
            if not selected_files:
                log("⚠ ファイルやフォルダが選択されていません")
                return

            outtype = format_var.get()
            output = filedialog.asksaveasfilename(defaultextension=f".{outtype}")
            if not output:
                return

            level = level_scale.get()
            password = password_entry.get() or None

            try:
                file_list = []
                for path in selected_files:
                    if os.path.isdir(path):
                        for foldername, _, filenames in os.walk(path):
                            for filename in filenames:
                                full_path = os.path.join(foldername, filename)
                                arcname = os.path.relpath(full_path, os.path.dirname(path))
                                file_list.append((full_path, arcname))
                    else:
                        file_list.append((path, os.path.basename(path)))

                progress["maximum"] = len(file_list)
                log(f"▶ 圧縮開始 → {output}")

                if outtype == "zip":
                    with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as zipf:
                        for i, (src, arc) in enumerate(file_list, 1):
                            zipf.write(src, arc)
                            log(f"📦 圧縮: {arc}")
                            progress["value"] = i
                            root.update()

                elif outtype == "7z":
                    filters = [{'id': py7zr.FILTER_LZMA2, 'preset': level}]
                    with py7zr.SevenZipFile(output, 'w', filters=filters, password=password) as archive:
                        for i, (src, arc) in enumerate(file_list, 1):
                            archive.write(src, arc)
                            log(f"📦 圧縮: {arc}")
                            progress["value"] = i
                            root.update()

                log("✅ 圧縮完了！")
            except Exception as e:
                log(f"❌ エラー: {e}")

        threading.Thread(target=run).start()

    # 解凍処理
    def extract():
        def run():
            file = filedialog.askopenfilename(title="解凍するファイルを選択", filetypes=[("Archive", "*.zip *.7z")])
            if not file:
                return
            outdir = filedialog.askdirectory(title="解凍先のフォルダを選択")
            if not outdir:
                return
            try:
                log(f"▶ 解凍開始: {file}")
                if file.endswith(".zip"):
                    with zipfile.ZipFile(file, 'r') as zipf:
                        zipf.extractall(outdir)
                        for name in zipf.namelist():
                            log(f"📂 解凍: {name}")
                elif file.endswith(".7z"):
                    with py7zr.SevenZipFile(file, 'r') as archive:
                        archive.extractall(path=outdir)
                        log("📂 解凍成功（中身表示できないけど成功）")
                log("✅ 解凍完了！")
            except Exception as e:
                log(f"❌ エラー: {e}")

        threading.Thread(target=run).start()

    # ボタン
    tk.Button(root, text="📄ファイル選択", command=select_files).pack(pady=5)
    tk.Button(root, text="📂フォルダ選択", command=select_folder).pack(pady=5)
    tk.Button(root, text="📦圧縮開始！", command=compress).pack(pady=10)
    tk.Button(root, text="📂解凍する", command=extract).pack(pady=5)

    root.mainloop()

# 直接実行されたとき
if __name__ == "__main__":
    run_gui()
