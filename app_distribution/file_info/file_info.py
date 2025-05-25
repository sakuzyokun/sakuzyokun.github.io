import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext
import os
import time
import struct
import zipfile

TEXT_EXTENSIONS = {'.txt', '.log', '.py', '.html', '.htm', '.csv', '.json', '.md','.js','.css','.sh','.bat','.ini','.conf','.c','.cpp','.cs','.java','.php','.rb','.vbs','.nako'}
BINARY_EXTENSIONS = {'.exe', '.dll', '.bin', '.dat', '.zip'}

current_theme = "light"
show_all = False  # すべて表示の状態

def get_file_info(file_path):
    return {
        'フルパス': file_path,
        'ファイル名': os.path.basename(file_path),
        '拡張子': os.path.splitext(file_path)[1],
        'サイズ': f"{os.path.getsize(file_path)} バイト",
        '作成日時': time.ctime(os.path.getctime(file_path)),
        '更新日時': time.ctime(os.path.getmtime(file_path)),
        'アクセス日時': time.ctime(os.path.getatime(file_path))
    }

def preview_zip_contents(file_path):
    try:
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            return ["ZIP内容一覧:"] + [f"  - {info.filename} ({info.file_size} バイト)" for info in zip_ref.infolist()]
    except Exception as e:
        return [f"ZIP読み取りエラー: {e}"]

def preview_text_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            if not show_all:
                lines = lines[:30] + ["...（省略）"] if len(lines) > 30 else lines
        return ''.join(line.rstrip() + '\n' for line in lines)
    except Exception as e:
        return f"読み込みエラー: {e}"

def get_jpg_info(file_path):
    try:
        with open(file_path, 'rb') as f:
            data = f.read()
        if data[:2] != b'\xff\xd8':
            return "JPEG形式ではありません。"
        index = 2
        while index < len(data):
            marker, = struct.unpack('>H', data[index:index+2])
            index += 2
            if marker == 0xFFC0:  # SOF0
                length = struct.unpack('>H', data[index:index+2])[0]
                bits, height, width = struct.unpack('>BHH', data[index+2:index+7])
                return f"画像サイズ: {width}x{height}px\nビット: {bits}"
            else:
                length = struct.unpack('>H', data[index:index+2])[0]
                index += length
        return "画像情報を取得できませんでした。"
    except Exception as e:
        return f"読み込みエラー: {e}"

def get_binary_preview(file_path):
    try:
        max_bytes = 10 * 1024 * 1024 if show_all else 64  # 最大10MB読み込み
        with open(file_path, 'rb') as f:
            data = f.read(max_bytes)
        if not show_all and os.path.getsize(file_path) > max_bytes:
            data += b"..."
        hex_lines = []
        for i in range(0, len(data), 16):
            segment = data[i:i+16]
            hex_str = ' '.join(f'{b:02X}' for b in segment)
            ascii_str = ''.join(chr(b) if 32 <= b <= 126 else '.' for b in segment)
            hex_lines.append(f"{i:08X}  {hex_str:<47}  {ascii_str}")
        if not show_all and os.path.getsize(file_path) > max_bytes:
            hex_lines.append("...（省略）")
        return "\n".join(hex_lines)
    except Exception as e:
        return f"バイナリ読み込みエラー: {e}"

def select_file():
    file_path = filedialog.askopenfilename()
    if not file_path:
        return
    
    if os.path.getsize(file_path) > 50 * 1024 * 1024:
        proceed = messagebox.askyesno("警告", "ファイルが50MB以上あります\nフリーズするかもしれませんがよろしいですか？")
        if not proceed:
            return

    info = get_file_info(file_path)
    result = [f"{k}: {v}" for k, v in info.items()]
    ext = info['拡張子'].lower()

    if ext in TEXT_EXTENSIONS:
        result.append("\n--- テキストプレビュー ---")
        result.append(preview_text_file(file_path))
    elif ext == '.zip':
        result.append("\n--- ZIP内容 ---")
        result.extend(preview_zip_contents(file_path))
        result.append("\n--- ZIPファイルのバイナリヘッダー ---")
        result.append(get_binary_preview(file_path))
    elif ext in ['.jpg', '.jpeg']:
        result.append("\n--- 画像情報 ---")
        result.append(get_jpg_info(file_path))
    elif ext in BINARY_EXTENSIONS:
        result.append("\n--- バイナリヘッダー ---")
        result.append(get_binary_preview(file_path))
    else:
        result.append("\n※この形式のプレビューには未対応です")

    output_box.delete('1.0', tk.END)
    output_box.insert(tk.END, "\n".join(result))

def toggle_show_all():
    global show_all
    show_all = not show_all
    toggle_btn.config(text="すべて表示: ON" if show_all else "すべて表示: OFF")

def show_help():
    messagebox.showinfo("ヘルプ", "ファイルを選択すると情報を表示します。\n\n"
                                  "対応形式:\n"
                                  "- テキスト: txt, log, py, html など\n"
                                  "- 画像: jpg\n"
                                  "- バイナリ: exe, dll, bin, zip")

def exit_app():
    root.quit()

def set_theme(theme):
    global current_theme
    current_theme = theme
    if theme == "dark":
        output_box.config(bg="#1e1e1e", fg="#dcdcdc", insertbackground="white")
    else:
        output_box.config(bg="white", fg="black", insertbackground="black")

def create_context_menu(text_widget):
    menu = tk.Menu(root, tearoff=0)
    menu.add_command(label="コピー", command=lambda: text_widget.event_generate("<<Copy>>"))
    def show_menu(event):
        try:
            menu.tk_popup(event.x_root, event.y_root)
        finally:
            menu.grab_release()
    text_widget.bind("<Button-3>", show_menu)

def show_ver():
    messagebox.showinfo("バージョン情報","ファイル情報ビューア\nfile_info.py\nVersion:1.1.2\nこのプログラムはPythonを使用しています")

# GUI初期化
root = tk.Tk()
root.title("ファイル情報ビューア")

# メニュー
menu_bar = tk.Menu(root)
file_menu = tk.Menu(menu_bar, tearoff=0)
file_menu.add_command(label="ファイルを選択…", command=select_file)
file_menu.add_command(label="終了", command=exit_app)
menu_bar.add_cascade(label="ファイル", menu=file_menu)

view_menu = tk.Menu(menu_bar, tearoff=0)
view_menu.add_command(label="ライトモード", command=lambda: set_theme("light"))
view_menu.add_command(label="ダークモード", command=lambda: set_theme("dark"))
view_menu.add_command(label="すべて表示 ON/OFF", command=toggle_show_all)
menu_bar.add_cascade(label="表示", menu=view_menu)

help_menu = tk.Menu(menu_bar, tearoff=0)
help_menu.add_command(label="バージョン情報", command=show_ver)
help_menu.add_command(label="ヘルプ", command=show_help)
menu_bar.add_cascade(label="ヘルプ", menu=help_menu)

root.config(menu=menu_bar)

# メインUI
frame = tk.Frame(root, padx=10, pady=10)
frame.pack(fill=tk.BOTH, expand=True)

# btn = tk.Button(frame, text="ファイルを選択", command=select_file)
# btn.pack(pady=5)

toggle_btn = tk.Button(frame, text="すべて表示: OFF", command=toggle_show_all)
toggle_btn.pack(pady=5)

output_box = scrolledtext.ScrolledText(frame, width=90, height=30, font=("Consolas", 10), undo=True)
output_box.pack(pady=5)

create_context_menu(output_box)
set_theme("light")

root.mainloop()
