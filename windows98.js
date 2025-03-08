function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    const startButton = document.getElementById('startButton');
    if (startMenu.style.display === 'none') {
        startMenu.style.display = 'block';
        startButton.classList.add('active');
    } else {
        startMenu.style.display = 'none';
        startButton.classList.remove('active');
    }
}

// スタートメニューが表示されているときにデスクトップなどの別のところをクリックしたらスタートメニューを隠してスタートボタンを戻す
document.addEventListener('click', function(event) {
    const startMenu = document.getElementById('startMenu');
    const startButton = document.getElementById('startButton');
    if (!startMenu.contains(event.target) && !startButton.contains(event.target)) {
        startMenu.style.display = 'none';
        startButton.classList.remove('active');
    }
});

let isMaximized = false;
let activeWindow = null;
let originalSize = {};
let minimizedWindows = new Set();

function maximizeWindow(windowId) {
    const window = document.getElementById(windowId);
    const titleBar = window.querySelector('.title-bar');
    const content = window.querySelector('.window-body');

    if (isMaximized) {
        titleBar.style.transition = 'width 0.3s ease, left 0.3s ease, top 0.3s ease';
        titleBar.style.width = originalSize[windowId].width;
        titleBar.style.left = originalSize[windowId].left;
        titleBar.style.top = originalSize[windowId].top;

        setTimeout(() => {
            window.style.transition = 'none';
            window.style.width = originalSize[windowId].width;
            window.style.height = originalSize[windowId].height;
            window.style.top = originalSize[windowId].top;
            window.style.left = originalSize[windowId].left;
            content.style.display = 'block';
            isMaximized = false;
        }, 300);
    } else {
        originalSize[windowId] = {
            width: window.style.width,
            height: window.style.height,
            top: window.style.top,
            left: window.style.left
        };

        titleBar.style.transition = 'width 0.3s ease, left 0.3s ease, top 0.3s ease';
        titleBar.style.width = '100%';
        titleBar.style.left = '0';
        titleBar.style.top = '0';

        setTimeout(() => {
            window.style.transition = 'none';
            window.style.top = '0';
            window.style.left = '0';
            window.style.width = '100%';
            window.style.height = '100%';
            content.style.display = 'block';
            isMaximized = true;
        }, 300);
    }

    setActiveWindow(windowId);
}

function minimizeWindow(windowId) {
    const window = document.getElementById(windowId);
    const titleBar = window.querySelector('.title-bar');
    const content = window.querySelector('.window-body');

    if (minimizedWindows.has(windowId)) {
        restoreWindow(windowId);
    } else {
        originalSize[windowId] = {
            width: window.style.width,
            height: window.style.height,
            top: window.style.top,
            left: window.style.left
        };

        titleBar.style.transition = 'top 0.2s ease, left 0.2s ease, width 0.2s ease';
        titleBar.style.top = '95%';
        titleBar.style.left = '10px';
        titleBar.style.width = '100px';

        setTimeout(() => {
            window.style.transition = 'none';
            window.style.width = '100px';
            window.style.height = '20px';
            window.style.top = '95%';
            window.style.left = '10px';
            content.style.display = 'none';
            minimizedWindows.add(windowId);
            updateTaskbarButtons();
        }, 200);
    }
}

function restoreWindow(windowId) {
    const window = document.getElementById(windowId);
    const titleBar = window.querySelector('.title-bar');
    const content = window.querySelector('.window-body');

    if (minimizedWindows.has(windowId)) {
        titleBar.style.transition = 'top 0.3s ease, left 0.3s ease, width 0.3s ease';
        titleBar.style.top = originalSize[windowId].top;
        titleBar.style.left = originalSize[windowId].left;
        titleBar.style.width = '100%';

        setTimeout(() => {
            window.style.transition = 'none';
            window.style.width = originalSize[windowId].width;
            window.style.height = originalSize[windowId].height;
            window.style.top = originalSize[windowId].top;
            window.style.left = originalSize[windowId].left;
            content.style.display = 'block';
            minimizedWindows.delete(windowId);
            updateTaskbarButtons();
        }, 300);
    }

    setActiveWindow(windowId);
}

function updateTaskbarButtons() {
    const taskbar = document.querySelector('.taskbar-windows');
    taskbar.innerHTML = '';

    minimizedWindows.forEach(winId => {
        const button = document.createElement('button');
        button.classList.add('window-title');
        button.textContent = winId;
        button.onclick = () => restoreWindow(winId);

        if (winId === activeWindow) {
            button.classList.add('active');
        }

        taskbar.appendChild(button);
    });
}

function setActiveWindow(windowId) {
    activeWindow = windowId;
    document.querySelectorAll('.window-title').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === windowId);
    });
}

document.querySelectorAll('.window').forEach(win => {
    win.onclick = () => setActiveWindow(win.id);
});

// 初回のタスクバー更新
updateTaskbarButtons();

function closeWindow(windowId) {
    const window = document.getElementById(windowId);
    window.style.display = 'none';
}

function openNotepad() {
    const notepadWindow = document.getElementById('notepadWindow');
    notepadWindow.style.display = 'block';
    const startMenu = document.getElementById('startMenu');
    startMenu.style.display = 'none';
    document.getElementById('startButton').classList.remove('active');
}

function openRun() {
    const runWindow = document.getElementById('runWindow');
    runWindow.style.display = 'block';
    runWindow.style.bottom = '50px'; // スタートボタンの上に表示
    runWindow.style.left = '10px'; // スタートボタンと同じ位置に表示
    const startMenu = document.getElementById('startMenu');
    startMenu.style.display = 'none';
    document.getElementById('startButton').classList.remove('active');
}

function runCommand() {
    const commandInput = document.getElementById('commandInput').value.trim().toLowerCase();
    const runWindow = document.getElementById('runWindow');
    runWindow.style.display = 'none';
    document.getElementById('startButton').classList.remove('active');

    switch (commandInput) {
        case 'winver':
            document.getElementById('winverWindow').style.display = 'block';
            break;
        case 'notepad':
            document.getElementById('notepadWindow').style.display = 'block';
            break;
        case 'calc':  // 新しいコマンド（計算機）を追加
            alert('計算機はまだ実装されていません！');
            break;
        default:
            alert(`"${commandInput}" は見つかりませんでした。`);
            break;
    }
}

function setActiveWindow(windowId) {
    const windows = document.getElementsByClassName('window');
    for (const win of windows) {
        if (win.id === windowId) {
            win.classList.add('active');
            win.querySelector('.title-bar').classList.remove('inactive');
            win.style.zIndex = '1000'; // 最前面に表示
        } else {
            win.classList.remove('active');
            win.querySelector('.title-bar').classList.add('inactive');
            win.style.zIndex = '1';
        }
    }
    const taskbarWindows = document.getElementsByClassName('window-title');
    for (const title of taskbarWindows) {
        if (title.innerText === document.getElementById(windowId).querySelector('.title-bar-text').innerText) {
            title.classList.add('active');
        } else {
            title.classList.remove('active');
        }
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'r' && event.ctrlKey) {
        openRun();
    }
});

// タスクバーの右に現在の時間を表示する関数
function updateTime() {
    const statusBar = document.getElementById('statusBar');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    statusBar.textContent = `${hours}:${minutes}`;
}

function hideStartMenu(event) {
    const startMenu = document.getElementById('startMenu');
    const startButton = document.getElementById('startButton');

    // クリックイベントがスタートメニューやスタートボタン以外の場合のみ実行
    if (!startMenu.contains(event.target) && !startButton.contains(event.target)) {
        startMenu.style.display = 'none';
        startButton.classList.remove('active');
    }
}

document.querySelectorAll('.window').forEach(windowEl => {
    let isDragging = false;
    let offsetX, offsetY;

    const titleBar = windowEl.querySelector('.title-bar');

    // マウスイベント（PC向け）
    titleBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - windowEl.offsetLeft;
        offsetY = e.clientY - windowEl.offsetTop;
        windowEl.style.zIndex = 1000;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        windowEl.style.left = `${e.clientX - offsetX}px`;
        windowEl.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // タッチイベント（スマホ・タブレット向け）
    titleBar.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0]; // 最初のタッチポイントを取得
        offsetX = touch.clientX - windowEl.offsetLeft;
        offsetY = touch.clientY - windowEl.offsetTop;
        windowEl.style.zIndex = 1000;
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        windowEl.style.left = `${touch.clientX - offsetX}px`;
        windowEl.style.top = `${touch.clientY - offsetY}px`;
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });
});

// ページが読み込まれたときに時間を更新し、毎分更新する
window.onload = function() {
    updateTime();
    setInterval(updateTime, 1);
};
