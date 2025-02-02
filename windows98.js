let isMaximized = false;
let previousDimensions = {};

function toggleStartMenu() {
  const startMenu = document.getElementById('start-menu');
  startMenu.style.display = startMenu.style.display === 'none' ? 'block' : 'none';
}

function minimizeWindow() {
  const windowElement = document.getElementById('my-window');
  const taskbarItem = document.getElementById('taskbar-item');
  windowElement.classList.add('minimized');
  setTimeout(() => {
    windowElement.classList.add('hidden');
    windowElement.classList.remove('minimized');
    taskbarItem.classList.remove('hidden');
  }, 500); // アニメーションの時間に合わせて遅延
}

function restoreWindow() {
  const windowElement = document.getElementById('my-window');
  const taskbarItem = document.getElementById('taskbar-item');
  windowElement.classList.remove('hidden');
  taskbarItem.classList.add('hidden');
}

function maximizeWindow() {
  const windowElement = document.getElementById('my-window');
  const maximizeButton = document.getElementById('maximize-button');

  if (isMaximized) {
    windowElement.style.width = previousDimensions.width;
    windowElement.style.height = previousDimensions.height;
    windowElement.style.top = previousDimensions.top;
    windowElement.style.left = previousDimensions.left;
    isMaximized = false;
    maximizeButton.innerHTML = '□'; // ボタンを元のサイズに戻す
  } else {
    previousDimensions = {
      width: windowElement.style.width,
      height: windowElement.style.height,
      top: windowElement.style.top,
      left: windowElement.style.left
    };
    windowElement.style.width = '100%';
    windowElement.style.height = 'calc(100% - 40px)'; /* タスクバーの高さを考慮 */
    windowElement.style.top = '0';
    windowElement.style.left = '0';
    isMaximized = true;
    maximizeButton.innerHTML = '□'; // ボタンを元のサイズに戻す
  }

  windowElement.classList.add('maximized');
  setTimeout(() => {
    windowElement.classList.remove('maximized');
  }, 500); // アニメーションの時間に合わせて遅延
}

function closeWindow() {
  const windowElement = document.getElementById('my-window');
  windowElement.style.display = 'none';
}

let offsetX, offsetY, draggedElement;

function dragStart(event) {
  if (isMaximized) {
    const windowElement = document.getElementById('my-window');
    windowElement.style.width = previousDimensions.width;
    windowElement.style.height = previousDimensions.height;
    windowElement.style.top = previousDimensions.top;
    windowElement.style.left = previousDimensions.left;
    isMaximized = false;
    const maximizeButton = document.getElementById('maximize-button');
    maximizeButton.innerHTML = '□'; // ボタンを元のサイズに戻す
  }

  draggedElement = event.target.closest('.window');
  offsetX = event.clientX - draggedElement.getBoundingClientRect().left;
  offsetY = event.clientY - draggedElement.getBoundingClientRect().top;
  document.addEventListener('mousemove', dragMove);
  document.addEventListener('mouseup', dragEnd);
}

function dragMove(event) {
  draggedElement.style.left = `${event.clientX - offsetX}px`;
  draggedElement.style.top = `${event.clientY - offsetY}px`;
}

function dragEnd() {
  document.removeEventListener('mousemove', dragMove);
  document.removeEventListener('mouseup', dragEnd);
}

// メモ帳関連の関数
function openNotepad() {
  const notepadWindow = document.getElementById('notepad-window');
  notepadWindow.classList.remove('hidden');
  const notepadItem = document.getElementById('notepad-item');
  notepadItem.classList.add('hidden');
}

function minimizeNotepad() {
  const notepadWindow = document.getElementById('notepad-window');
  const notepadItem = document.getElementById('notepad-item');
  notepadWindow.classList.add('minimized');
  setTimeout(() => {
    notepadWindow.classList.add('hidden');
    notepadWindow.classList.remove('minimized');
    notepadItem.classList.remove('hidden');
  }, 500); // アニメーションの時間に合わせて遅延
}

function restoreNotepad() {
  const notepadWindow = document.getElementById('notepad-window');
  const notepadItem = document.getElementById('notepad-item');
  notepadWindow.classList.remove('hidden');
  notepadItem.classList.add('hidden');
}

function closeNotepad() {
  const notepadWindow = document.getElementById('notepad-window');
  notepadWindow.style.display = 'none';
}
