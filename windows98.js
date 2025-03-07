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

function maximizeWindow(windowId) {
    const windowEl = document.getElementById(windowId);
    const titleBar = windowEl.querySelector('.title-bar');
    const content = windowEl.querySelector('.window-body');

    if (isMaximized) {
        // 🔹 元の状態に戻す
        windowEl.style.width = originalWidth;
        windowEl.style.height = originalHeight;
        windowEl.style.top = originalTop;
        windowEl.style.left = originalLeft;

        // タイトルバーのスタイルをリセット
        titleBar.style.transition = 'width 0.3s ease';
        titleBar.style.width = '100%';
        titleBar.style.position = 'relative';

        // 内容のサイズをリセット（即時変更）
        setTimeout(() => {
            content.style.width = '100%';
            content.style.height = 'calc(100% - 30px)';
        }, 0);

        isMaximized = false;
    } else {
        // 🔹 現在のウィンドウの状態を保存
        originalWidth = windowEl.style.width;
        originalHeight = windowEl.style.height;
        originalTop = windowEl.style.top;
        originalLeft = windowEl.style.left;

        // タイトルバーを先に拡大
        titleBar.style.transition = 'width 0.3s ease';
        titleBar.style.width = '100vw';
        titleBar.style.position = 'fixed';
        titleBar.style.top = '0';
        titleBar.style.left = '0';
        titleBar.style.zIndex = '1002';

        // タイトルバーが拡大した後にウィンドウ全体を最大化
        setTimeout(() => {
            windowEl.style.top = '0';
            windowEl.style.left = '0';
            windowEl.style.width = '100vw';
            windowEl.style.height = '100vh';

            // 内容のサイズを一瞬で変更
            content.style.width = '100%';
            content.style.height = 'calc(100% - 30px)';
        }, 300); // 0.3秒後に変更

        isMaximized = true;
    }
}

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

function dragStart(event, windowId) {
    const window = document.getElementById(windowId);
    let shiftX = event.clientX - window.getBoundingClientRect().left;
    let shiftY = event.clientY - window.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        window.style.left = pageX - shiftX + 'px';
        window.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);
    
    // mouseup でイベントリスナーを削除（パフォーマンス向上）
    document.addEventListener('mouseup', function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    });
}

document.ondragstart = function() {
    return false;
};

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
