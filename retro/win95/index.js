let dragging = false;
let offsetX, offsetY;
let currentWindow = null;
let touchTimeout = null;

function makeDraggable(el) {
  const titleBar = el.querySelector('.title-bar');

  // PC: マウスでドラッグ
  titleBar.addEventListener('mousedown', (e) => {
    dragging = true;
    currentWindow = el;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
  });

  // スマホ: 長押し → ドラッグ
  titleBar.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    touchTimeout = setTimeout(() => {
      dragging = true;
      currentWindow = el;
      offsetX = touch.clientX - el.offsetLeft;
      offsetY = touch.clientY - el.offsetTop;
    }, 300); // 300ms長押しで発動
  });

  titleBar.addEventListener('touchend', () => {
    clearTimeout(touchTimeout);
    dragging = false;
  });

  titleBar.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const touch = e.touches[0];
    moveWindow(touch.clientX, touch.clientY);
    e.preventDefault(); // スクロール防止
  });
}

// ドラッグ中の移動
document.addEventListener('mousemove', (e) => {
  if (dragging && currentWindow) {
    moveWindow(e.clientX, e.clientY);
  }
});

document.addEventListener('mouseup', () => {
  dragging = false;
  currentWindow = null;
});

// 共通の移動処理
function moveWindow(x, y) {
  currentWindow.style.position = 'absolute';
  currentWindow.style.left = `${x - offsetX}px`;
  currentWindow.style.top = `${y - offsetY}px`;
}

// ページ内の全ウィンドウを有効化
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.window').forEach(makeDraggable);
});
