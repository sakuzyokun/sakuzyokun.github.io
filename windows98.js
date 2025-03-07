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
let isMinimized = false;
let originalWidth, originalHeight, originalTop, originalLeft;

function maximizeWindow(windowId) {
    const window = document.getElementById(windowId);
    const titleBar = window.querySelector('.title-bar');
    const content = window.querySelector('.window-body');

    if (isMaximized) {
        // タイトルバーを0.3秒で元のサイズに戻す
        titleBar.style.transition = 'width 0.3s ease, left 0.3s ease';
        titleBar.style.width = originalWidth;
        titleBar.style.left = originalLeft;

        setTimeout(() => {
            // ウィンドウ全体のサイズを元に戻す（アニメーションなし）
            window.style.transition = 'none';
            window.style.width = originalWidth;
            window.style.height = originalHeight;
            window.style.top = originalTop;
            window.style.left = originalLeft;

            // 内容のサイズを元に戻す
            content.style.display = 'block';
            isMaximized = false;
        }, 300);
    } else {
        // 現在のウィンドウのサイズと位置を保存
        originalWidth = window.style.width;
        originalHeight = window.style.height;
        originalTop = window.style.top;
        originalLeft = window.style.left;

        // タイトルバーを0.3秒で最大化
        titleBar.style.transition = 'width 0.3s ease';
        titleBar.style.width = '100%';

        setTimeout(() => {
            // ウィンドウ全体を最大化（アニメーションなし）
            window.style.transition = 'none';
            window.style.top = '0';
            window.style.left = '0';
            window.style.width = '100%';
            window.style.height = '100%';

            // 内容のサイズを最大化
            content.style.display = 'block';
            isMaximized = true;
        }, 300);
    }
}

function minimizeWindow(windowId) {
    const window = document.getElementById(windowId);
    const titleBar = window.querySelector('.title-bar');
    const content = window.querySelector('.window-body');

    if (isMinimized) {
        // 元の位置に戻す
        window.style.transition = 'top 0.2s ease, left 0.2s ease, width 0.2s ease, height 0.2s ease';
        window.style.width = originalWidth;
        window.style.height = originalHeight;
        window.style.top = originalTop;
        window.style.left = originalLeft;

        setTimeout(() => {
            content.style.display = 'block';
            isMinimized = false;
        }, 200);
    } else {
        // 現在の位置とサイズを保存
        originalTop = window.style.top;
        originalLeft = window.style.left;
        originalWidth = window.style.width;
        originalHeight = window.style.height;

        // タスクバーの位置へ移動
        window.style.transition = 'top 0.2s ease, left 0.2s ease, width 0.2s ease, height 0.2s ease';
        window.style.top = '95%'; // タスクバーの位置
        window.style.left = '10px'; // タスクバーの左端
        window.style.width = '100px'; // 小さくする
        window.style.height = '20px';

        // 0.2秒後に内容を非表示
        setTimeout(() => {
            content.style.display = 'none';
            isMinimized = true;
        }, 200);
    }
}

// ドラッグでウィンドウを移動
function dragStart(event, windowId) {
    const window = document.getElementById(windowId);

    // 最大化状態なら元のサイズに戻す（マウス位置には移動しない）
    if (isMaximized) {
        maximizeWindow(windowId);
    }

    const shiftX = event.clientX - window.getBoundingClientRect().left;
    const shiftY = event.clientY - window.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        window.style.left = pageX - shiftX + 'px';
        window.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    window.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        window.onmouseup = null;
    };
}

// タッチ操作にも対応（スマホ・タブレット）
function touchStart(event, windowId) {
    const window = document.getElementById(windowId);
    
    if (isMaximized) {
        maximizeWindow(windowId);
    }

    const touch = event.touches[0];
    const shiftX = touch.clientX - window.getBoundingClientRect().left;
    const shiftY = touch.clientY - window.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        window.style.left = pageX - shiftX + 'px';
        window.style.top = pageY - shiftY + 'px';
    }

    function onTouchMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        moveAt(touch.pageX, touch.pageY);
    }

    document.addEventListener('touchmove', onTouchMove);

    window.ontouchend = function() {
        document.removeEventListener('touchmove', onTouchMove);
        window.ontouchend = null;
    };
}

// ドラッグとタッチイベントを適用
document.querySelectorAll('.title-bar').forEach(bar => {
    const windowId = bar.closest('.window').id;
    bar.addEventListener('mousedown', event => dragStart(event, windowId));
    bar.addEventListener('touchstart', event => touchStart(event, windowId));
});

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
