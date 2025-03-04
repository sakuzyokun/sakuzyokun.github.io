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
    const window = document.getElementById(windowId);
    const titleBar = window.querySelector('.title-bar');
    const content = window.querySelector('.window-body');
    
    if (isMaximized) {
        // 元の状態に戻す
        window.style.transition = 'none';
        window.style.width = originalWidth;
        window.style.height = originalHeight;
        window.style.top = originalTop;
        window.style.left = originalLeft;
        window.style.position = 'absolute';
        
        content.style.transition = 'none';
        content.style.width = '100%';
        content.style.height = '100%';
        
        isMaximized = false;
    } else {
        // 現在の状態を保存
        originalWidth = window.style.width;
        originalHeight = window.style.height;
        originalTop = window.style.top;
        originalLeft = window.style.left;

        // タイトルバーだけ先に最大化位置に移動
        window.style.transition = 'top 0.5s, left 0.5s';
        window.style.top = '0';
        window.style.left = '0';
        window.style.width = originalWidth; // 幅はそのまま
        window.style.height = originalHeight; // 高さもそのまま

        // 0.5秒後に全画面最大化
        setTimeout(() => {
            window.style.transition = 'width 0.5s, height 0.5s';
            window.style.width = '100%';
            window.style.height = '100%';
            window.style.position = 'fixed';

            content.style.transition = 'width 0.5s, height 0.5s';
            content.style.width = '100%';
            content.style.height = 'calc(100% - 30px)'; // タイトルバーを考慮
            isMaximized = true;
        }, 500);
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
    const commandInput = document.getElementById('commandInput').value;
    const runWindow = document.getElementById('runWindow');
    runWindow.style.display = 'none';
    document.getElementById('startButton').classList.remove('active');
    if (commandInput.toLowerCase() === 'winver') {
        const winverWindow = document.getElementById('winverWindow');
        winverWindow.style.display = 'block';
    }
}

function dragStart(event, windowId) {
    const window = document.getElementById(windowId);
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

// ページが読み込まれたときに時間を更新し、毎分更新する
window.onload = function() {
    updateTime();
    setInterval(updateTime, 60000);
};
