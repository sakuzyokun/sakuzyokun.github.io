let isMaximized = false;
let previousDimensions = {};
let zIndexCounter = 10; // z-indexのカウンター

function toggleStartMenu() {
  const startMenu = document.getElementById('start-menu');
  startMenu.style.display = startMenu.style.display === 'none' ? 'block' : 'none';
}

function minimizeWindow(windowId, taskbarItemId) {
  const windowElement = document.getElementById(windowId);
  const taskbarItem = document.getElementById(taskbarItemId);
  windowElement.classList.add('minimized');
  setTimeout(() => {
    windowElement.classList.add('hidden');
    windowElement.classList.remove('minimized');
    taskbarItem.classList.remove('hidden');
  }, 500); // アニメーションの時間に合わせて遅延
  setInactive(windowId); // ウィンドウを非アクティブに設定
}

function restoreWindow(windowId, taskbarItemId) {
  const windowElement = document.getElementById(windowId);
  const taskbarItem = document.getElementById(taskbarItemId);
  windowElement.classList.remove('hidden');
  taskbarItem.classList.add('hidden');
  setActive(windowId); // ウィンドウをアクティブに設定
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

function closeWindow(windowId) {
  const windowElement = document.getElementById(windowId);
  windowElement.style.display = 'none';
  setInactive(windowId); // ウィンドウを非アクティブに設定
}

let offsetX, offsetY, draggedElement;

function dragStart(event, windowId) {
  if (isMaximized) {
    const windowElement = document.getElementById(windowId);
    windowElement.style.width = previousDimensions.width;
    windowElement.style.height = previousDimensions.height;
    windowElement.style.top = previousDimensions.top;
    windowElement.style.left = previousDimensions.left;
    isMaximized = false;
    const maximizeButton = document.getElementById('maximize-button');
    maximizeButton.innerHTML = '□'; // ボタンを元のサイズに戻す
  }

  draggedElement = document.getElementById(windowId);
  offsetX = event.clientX - draggedElement.getBoundingClientRect().left;
  offsetY = event.clientY - draggedElement.getBoundingClientRect().top;
  document.addEventListener('mousemove', dragMove);
  document.addEventListener('mouseup', dragEnd);

  setActive(windowId); // ウィンドウをアクティブに設定
}

function dragMove(event) {
  draggedElement.style.left = `${event.clientX - offsetX}px`;
  draggedElement.style.top = `${event.clientY - offsetY}px`;
}

function dragEnd() {
  document.removeEventListener('mousemove', dragMove);
  document.removeEventListener('mouseup', dragEnd);
}

function setActive(windowId) {
  const allWindows = document.querySelectorAll('.window');
  allWindows.forEach(win => {
    const titleBar = win.querySelector('.title-bar');
    titleBar.classList.remove('active');
    titleBar.classList.add('inactive');
  });
  const windowElement = document.getElementById(windowId);
  const titleBar = windowElement.querySelector('.title-bar');
  titleBar.classList.add('active');
  titleBar.classList.remove('inactive');

  // ウィンドウを最前面に表示
  zIndexCounter++;
  windowElement.style.zIndex = zIndexCounter;
}

function setInactive(windowId) {
  const windowElement = document.getElementById(windowId);
  const titleBar = windowElement.querySelector('.title-bar');
  titleBar.classList.add('inactive');
  titleBar.classList.remove('active');
}

// メモ帳関連の関数
function openNotepad() {
  const notepadWindow = document.getElementById('notepad-window');
  notepadWindow.classList.remove('hidden');
  const notepadItem = document.getElementById('notepad-item');
  notepadItem.classList.add('hidden');
  setActive('notepad-window'); // メモ帳ウィンドウをアクティブに設定
}
