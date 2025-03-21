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
let minimizedWindows = new Set();
let originalSize = {};

function createTitleBarClone(window) {
    const titleBar = window.querySelector('.title-bar');
    const clone = titleBar.cloneNode(true);
    document.body.appendChild(clone);
    
    // 位置を合わせる
    const rect = titleBar.getBoundingClientRect();
    clone.style.position = 'absolute';
    clone.style.top = `${rect.top}px`;
    clone.style.left = `${rect.left}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.transition = 'all 0.3s ease';
    clone.style.zIndex = '1002';
    
    return clone;
}

function maximizeWindow(windowId) {
    const window = document.getElementById(windowId);
    const content = window.querySelector('.window-body');

    if (isMaximized) {
        // タイトルバーのクローンを作って元の位置へ戻す
        const clone = createTitleBarClone(window);
        clone.style.width = originalSize[windowId].width;
        clone.style.left = originalSize[windowId].left;
        clone.style.top = originalSize[windowId].top;

        setTimeout(() => {
            document.body.removeChild(clone);
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

        // タイトルバーのクローンを作ってアニメーション
        const clone = createTitleBarClone(window);
        clone.style.width = '100%';
        clone.style.left = '0';
        clone.style.top = '0';

        setTimeout(() => {
            document.body.removeChild(clone);
            window.style.transition = 'none';
            window.style.top = '0';
            window.style.left = '0';
            window.style.width = '100%';
            window.style.height = '100%';
            content.style.display = 'block';
            isMaximized = true;
        }, 300);
    }
}

function minimizeWindow(windowId) {
    const window = document.getElementById(windowId);
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

        // タイトルバーのクローンを作ってタスクバーへ移動
        const clone = createTitleBarClone(window);
        clone.style.top = '95%';
        clone.style.left = '100px'; // スタートボタンの右側
        clone.style.width = '100px';
        clone.style.transition = 'all 0.2s ease';

        setTimeout(() => {
            document.body.removeChild(clone);
            window.style.transition = 'none';
            window.style.display = 'none';
            content.style.display = 'none';
            minimizedWindows.add(windowId);
            updateTaskbarButtons();
        }, 200);
    }
}

function restoreWindow(windowId) {
    const window = document.getElementById(windowId);
    const content = window.querySelector('.window-body');

    if (minimizedWindows.has(windowId)) {
        // タイトルバーのクローンを作って元の位置へ戻す
        const clone = createTitleBarClone(window);
        clone.style.top = originalSize[windowId].top;
        clone.style.left = originalSize[windowId].left;
        clone.style.width = originalSize[windowId].width;

        setTimeout(() => {
            document.body.removeChild(clone);
            window.style.transition = 'none';
            window.style.display = 'block';
            content.style.display = 'block';
            minimizedWindows.delete(windowId);
            updateTaskbarButtons();
        }, 300);
    }
}

function updateTaskbarButtons() {
    const taskbar = document.querySelector('.taskbar-windows');
    taskbar.innerHTML = '';

    let leftOffset = 120; // スタートボタンの右側へ間隔を開ける
    minimizedWindows.forEach(winId => {
        const button = document.createElement('button');
        button.classList.add('window-title');
        button.textContent = winId;
        button.onclick = () => restoreWindow(winId);
        button.style.position = 'absolute';
        button.style.left = `${leftOffset}px`;
        leftOffset += 90; // 各ボタンの間隔を確保

        taskbar.appendChild(button);
    });
}

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
            document.getElementById('calcWindow').style.display = 'block';
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

function openCalculator() {
    const calcWindow = document.getElementById('calcWindow');
    calcWindow.style.display = 'block';
    setActiveWindow('calcWindow'); // 計算機をアクティブにする
}

// ウィンドウをクリックするとアクティブになるようにする
document.getElementById('calcWindow').addEventListener('mousedown', function(event) {
    setActiveWindow('calcWindow'); // 計算機ウィンドウをアクティブ化
});

function appendNumber(num) {
    document.getElementById('calcInput').value += num;
}

function appendOperator(op) {
    document.getElementById('calcInput').value += " " + op + " ";
}

function clearCalc() {
    document.getElementById('calcInput').value = "";
}

function calculate() {
    try {
        const expression = document.getElementById('calcInput').value;
        const result = eval(expression);
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('無効な計算です');
        }
        document.getElementById('calcInput').value = result;
    } catch (error) {
        showError('計算エラー: ' + error.message);
    }
}

function showError(message) {
    document.getElementById('errorText').textContent = message;
    document.getElementById('errorWindow').style.display = 'block';
    setActiveWindow('errorWindow');
}

// IE6
let ie6History = [];
let ie6HistoryIndex = -1;

function openIE6() {
    const ieWindow = document.getElementById('ie6-window');
    if (ieWindow) {
        ieWindow.style.display = 'block';
        setActiveWindow('ie6-window'); // ウィンドウをアクティブ化
    } else {
        console.error('IE6のウィンドウが見つかりません');
    }
}

function initializeIE6() {
    const iframe = document.getElementById("ie6-browser-view");

    if (!iframe) {
        console.error("エラー: #ie6-browser-view が見つかりません");
        return;
    }

    const goButton = document.querySelector("#ie6-window .go");
    const refreshButton = document.querySelector("#ie6-window .refresh");
    const backButton = document.querySelector("#ie6-window .back");
    const forwardButton = document.querySelector("#ie6-window .forward");

    if (goButton) goButton.addEventListener("click", navigateIE6);
    if (refreshButton) refreshButton.addEventListener("click", refreshIE6);
    if (backButton) backButton.addEventListener("click", goBackIE6);
    if (forwardButton) forwardButton.addEventListener("click", goForwardIE6);

    iframe.addEventListener("load", function () {
        if (ie6HistoryIndex === -1 || ie6History[ie6HistoryIndex] !== iframe.src) {
            ie6History.push(iframe.src);
            ie6HistoryIndex = ie6History.length - 1;
        }
    });

    iframe.addEventListener("error", function () {
        showIE6Error("ページが見つかりませんでした");
    });

    document.getElementById('ie6-window')?.addEventListener('mousedown', function () {
        setActiveWindow('ie6-window');
    });

    window.addEventListener("resize", resizeIE6);
}

function navigateIE6() {
    const iframe = document.getElementById("ie6-browser-view");
    const addressBar = document.querySelector("#ie6-window .address-bar");

    if (!iframe || !addressBar) return;

    let url = addressBar.value.trim();
    if (!url.startsWith("http")) {
        url = "http://" + url;
    }

    iframe.src = url;
}

function refreshIE6() {
    const iframe = document.getElementById("ie6-browser-view");
    if (iframe) {
        iframe.src = iframe.src;
    }
}

function goBackIE6() {
    if (ie6HistoryIndex > 0) {
        ie6HistoryIndex--;
        document.getElementById("ie6-browser-view").src = ie6History[ie6HistoryIndex];
    }
}

function goForwardIE6() {
    if (ie6HistoryIndex < ie6History.length - 1) {
        ie6HistoryIndex++;
        document.getElementById("ie6-browser-view").src = ie6History[ie6HistoryIndex];
    }
}

function showIE6Error(message) {
    alert(message);
}

// ページが読み込まれたときに時間を更新し、毎分更新する
window.onload = function () {
    initializeIE6();
    updateTime();
    setInterval(updateTime, 10);
};
