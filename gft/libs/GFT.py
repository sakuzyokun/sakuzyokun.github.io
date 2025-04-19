import tkinter as tk
from tkinter import filedialog
import re

# --- GFT パース周り ---
def hex_to_rgba(hex_color):
    hex_color = hex_color.strip().lstrip("#")
    if len(hex_color) == 6:
        hex_color += "FF"
    if len(hex_color) != 8:
        return (0, 0, 0, 0)
    return tuple(int(hex_color[i:i+2], 16) for i in range(0, 8, 2))

def parse_gft(text):
    lines = [line.strip() for line in text.splitlines() if line.strip() and not line.strip().startswith('#')]
    width = int(next((line.split(":")[1] for line in lines if line.startswith("width:")), 0))
    height = int(next((line.split(":")[1] for line in lines if line.startswith("height:")), 0))

    frame_blocks = re.findall(r'frame\s*{[\s\S]*?}', text)
    if not frame_blocks:
        raise ValueError("frame { ... } が見つかりません")

    frames = []
    for block in frame_blocks:
        duration_match = re.search(r'duration\s*:\s*(\d+)', block)
        duration = int(duration_match.group(1)) if duration_match else 500

        pixel_lines = [line.strip() for line in block.splitlines()
                       if line.strip() and not line.strip().startswith("frame") and not line.strip().startswith("duration") and not line.strip().startswith("}")]
        frames.append({
            "duration": duration,
            "pixels": pixel_lines
        })

    return {"width": width, "height": height, "frames": frames}

# --- 描画とアニメーション ---
def draw_frame(frame_data, width, height):
    zoom = min(16, 800 // max(width, height))  # 拡大しすぎないズーム
    canvas.config(width=width * zoom, height=height * zoom)
    canvas.delete("all")
    for y in range(height):
        for x in range(width):
            index = y * width + x
            if index >= len(frame_data["pixels"]):
                continue
            r, g, b, a = hex_to_rgba(frame_data["pixels"][index])
            if a == 0:
                continue
            color = f'#{r:02x}{g:02x}{b:02x}'
            canvas.create_rectangle(
                x * zoom, y * zoom, (x + 1) * zoom, (y + 1) * zoom,
                fill=color, outline=color
            )

def play_animation(data):
    global frame_index, animation_after_id, current_gft_data
    current_gft_data = data
    frame_index = 0

    def update():
        global frame_index, animation_after_id
        if not current_gft_data:
            return
        frame = current_gft_data["frames"][frame_index]
        draw_frame(frame, current_gft_data["width"], current_gft_data["height"])
        frame_index = (frame_index + 1) % len(current_gft_data["frames"])
        animation_after_id = root.after(frame["duration"], update)

    if animation_after_id is not None:
        root.after_cancel(animation_after_id)
    update()

def on_editor_change(event=None):
    global animation_after_id
    text = editor.get("1.0", "end-1c")
    try:
        data = parse_gft(text)
        play_animation(data)
    except Exception as e:
        print("パースエラー:", e)

# --- ファイル操作 ---
def open_file():
    global animation_after_id
    file_path = filedialog.askopenfilename(filetypes=[("GFT files", "*.gft"), ("Text files", "*.txt")])
    if file_path:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        if animation_after_id:
            root.after_cancel(animation_after_id)
            animation_after_id = None

        editor.delete("1.0", "end")
        editor.insert("1.0", content)
        on_editor_change()

# --- UI 初期化 ---
root = tk.Tk()
root.title("🖼️ GFT Viewer & Editor")

editor = tk.Text(root, width=60, height=15, font=("Courier", 10))
editor.pack()

canvas = tk.Canvas(root, bg="white", width=300, height=300)
canvas.pack(pady=10)

toolbar = tk.Frame(root)
toolbar.pack()

tk.Button(toolbar, text="📂 GFTを開く", command=open_file).pack(side="left", padx=5)

editor.bind("<KeyRelease>", on_editor_change)

# 状態管理用の変数
animation_after_id = None
frame_index = 0
current_gft_data = None

# --- デモGFTロード ---
demo_gft = """width: 3
height: 3

frame {
  duration: 400
  FF0000FF
  00FF00FF
  0000FFFF
  000000FF
  FFFFFF00
  00000000
  FF00FFFF
  00FFFFFF
  FFFF00FF
}

frame {
  duration: 700
  00000000
  FFFF00FF
  00FFFFFF
  00000000
  FFFFFF00
  000000FF
  0000FFFF
  00FF00FF
  FF0000FF
}
"""
editor.insert("1.0", demo_gft)
on_editor_change()

root.mainloop()
