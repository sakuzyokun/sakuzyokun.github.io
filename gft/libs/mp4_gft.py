import os
import subprocess
from pathlib import Path
from tkinter import Tk, filedialog, messagebox, Button, Label, StringVar, OptionMenu
from PIL import Image

# GUIで選んだパスを保持
selected_file = ""
output_dir = "frames"

# フレーム間隔(ms)と解像度オプション
interval = 200
res_options = [64, 128, 256, 512]

# GUI構築
root = Tk()
root.title("MP4 → GFT 変換ツール")
root.geometry("400x250")

# StringVar() は Tk() の後に作成
selected_res = StringVar()
selected_res.set("512")

def select_file():
    global selected_file
    selected_file = filedialog.askopenfilename(filetypes=[("MP4 files", "*.mp4")])
    if selected_file:
        file_label.config(text=f"選択中: {os.path.basename(selected_file)}")

def extract_frames():
    if not selected_file:
        messagebox.showerror("エラー", "先にMP4ファイルを選択してください")
        return

    os.makedirs(output_dir, exist_ok=True)
    fps = 1000 / interval
    output_pattern = os.path.join(output_dir, "frame_%05d.png")
    cmd = [
        "ffmpeg", "-y", "-i", selected_file,
        "-vf", f"fps={fps}",
        output_pattern
    ]
    subprocess.run(cmd)
    messagebox.showinfo("完了", "フレーム抽出完了！")

def rgba_hex_string(image):
    image = image.convert("RGBA")
    pixels = list(image.getdata())
    hex_lines = [f"  {r:02x}{g:02x}{b:02x}{a:02x}" for r, g, b, a in pixels]
    return hex_lines

def convert_to_gft():
    files = sorted(Path(output_dir).glob("frame_*.png"))
    if not files:
        messagebox.showerror("エラー", "フレーム画像が見つかりません")
        return

    with Image.open(files[0]) as img:
        w0, h0 = img.size
        w_target = int(selected_res.get())
        scale = w_target / w0
        size = (w_target, int(h0 * scale))

    gft = [f"width: {size[0]}", f"height: {size[1]}", ""]

    for f in files:
        with Image.open(f) as img:
            resized = img.resize(size)
            gft.append(f"frame {{\n  duration: {interval}")
            gft.extend(rgba_hex_string(resized))
            gft.append("}\n")

    save_path = filedialog.asksaveasfilename(defaultextension=".gft", filetypes=[("GFT files", "*.gft")])
    if save_path:
        with open(save_path, "w", encoding="utf-8") as f:
            f.write("\n".join(gft))
        messagebox.showinfo("完了", f"GFTファイル保存完了: {save_path}")

# UI設定
Label(root, text="MP4ファイル選択").pack()
Button(root, text="📁 ファイルを開く", command=select_file).pack()
file_label = Label(root, text="未選択")
file_label.pack()

Label(root, text="解像度").pack()
OptionMenu(root, selected_res, *map(str, res_options)).pack()

Button(root, text="🎞 フレーム抽出", command=extract_frames).pack(pady=5)
Button(root, text="🔁 GFTに変換して保存", command=convert_to_gft).pack(pady=5)

root.mainloop()
