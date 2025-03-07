let isMaximized = false;
let originalWidth, originalHeight, originalTop, originalLeft;

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

function minimizeWindow(windowId, title) {
    const window = document.getElementById(windowId);
    const taskbarWindows = document.getElementById('taskbarWindows');
    window.style.display = 'none';
    const minimizedTitle = document.createElement('div');
    minimizedTitle.className = 'window-title';
    minimizedTitle.innerText = title;
    minimizedTitle.onclick = function() {
        window.style.display = 'block';
        taskbarWindows.removeChild(minimizedTitle);
        setActiveWindow(windowId);
    };
    taskbarWindows.appendChild(minimizedTitle);
}

let isMaximized = false;
let originalWidth, originalHeight, originalTop, originalLeft;

function maximizeWindow(windowId) {
    const windowEl = document.getElementById(windowId);
    const titleBar = windowEl.querySelector('.title-bar');

    if (isMaximized) {
        // ① タイトルバーを元のサイズに戻す（0.3秒）
        titleBar.style.transition = 'width 0.3s ease, left 0.3s ease';
        titleBar.style.width = originalWidth;
        titleBar.style.left = originalLeft;
        titleBar.style.position = 'absolute';

        setTimeout(() => {
            // ② ウィンドウのサイズを元に戻す（即座に適用）
            windowEl.style.top = originalTop;
            windowEl.style.left = originalLeft;
            windowEl.style.width = originalWidth;
            windowEl.style.height = originalHeight;
            isMaximized = false;
        }, 300);
    } else {
        // 現在のウィンドウの状態を保存
        originalWidth = windowEl.style.width;
        originalHeight = windowEl.style.height;
        originalTop = windowEl.style.top;
        originalLeft = windowEl.style.left;

        // ① タイトルバーを最大化（0.3秒）
        titleBar.style.transition = 'width 0.3s ease, left 0.3s ease';
        titleBar.style.width = '100vw';
        titleBar.style.left = '0';
        titleBar.style.position = 'fixed';
        titleBar.style.top = '0';
        titleBar.style.zIndex = '1002';

        setTimeout(() => {
            // ② ウィンドウ全体を最大化（即座に適用）
            windowEl.style.top = '0';
            windowEl.style.left = '0';
            windowEl.style.width = '100vw';
            windowEl.style.height = '100vh';
            isMaximized = true;
        }, 300);
    }
}

function dragStart(event, windowId) {
    const windowEl = document.getElementById(windowId);
    const titleBar = windowEl.querySelector('.title-bar');

    const shiftX = event.clientX - windowEl.getBoundingClientRect().left;
    const shiftY = event.clientY - windowEl.getBoundingClientRect().top;

    // **最大化状態なら、ドラッグ開始時にタイトルバーを0.3秒かけて縮小**
    if (isMaximized) {
        titleBar.style.transition = 'width 0.3s ease, left 0.3s ease';
        titleBar.style.width = originalWidth;
        titleBar.style.left = originalLeft;
        titleBar.style.position = 'absolute';

        setTimeout(() => {
            // **ウィンドウ全体を元のサイズに戻す**
            windowEl.style.top = originalTop;
            windowEl.style.left = originalLeft;
            windowEl.style.width = originalWidth;
            windowEl.style.height = originalHeight;
            isMaximized = false;
        }, 300);
    }

    function moveAt(pageX, pageY) {
        windowEl.style.left = pageX - shiftX + 'px';
        windowEl.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    windowEl.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        windowEl.onmouseup = null;
    };
}

document.ondragstart = function() {
    return false;
};

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
