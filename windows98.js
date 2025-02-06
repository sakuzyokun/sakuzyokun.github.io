let isMaximized = false;
let originalWidth, originalHeight, originalTop, originalLeft;

function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    startMenu.style.display = startMenu.style.display === 'none' ? 'block' : 'none';
}

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
    const window = document.getElementById(windowId);
    const textarea = window.querySelector('textarea');
    const input = window.querySelector('input');
    if (isMaximized) {
        window.style.width = originalWidth;
        window.style.height = originalHeight;
        window.style.top = originalTop;
        window.style.left = originalLeft;
        window.style.position = 'absolute';
        if (textarea) {
            textarea.style.width = '100%';
            textarea.style.height = 'calc(100% - 30px)';
        }
        if (input) {
            input.style.width = '100%';
        }
        isMaximized = false;
    } else {
        originalWidth = window.style.width;
        originalHeight = window.style.height;
        originalTop = window.style.top;
        originalLeft = window.style.left;
        window.style.width = '100%';
        window.style.height = '100%';
        window.style.top = '0';
        window.style.left = '0';
        window.style.position = 'fixed';
        if (textarea) {
            textarea.style.width = '100%';
            textarea.style.height = 'calc(100% - 30px)';
        }
        if (input) {
            input.style.width = '100%';
        }
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
}

function openRun() {
    const runWindow = document.getElementById('runWindow');
    runWindow.style.display = 'block';
    runWindow.style.bottom = '50px'; // スタートボタンの上に表示
    runWindow.style.left = '10px'; // スタートボタンと同じ位置に表示
    const startMenu = document.getElementById('startMenu');
    startMenu.style.display = 'none';
}

function runCommand() {
    const commandInput = document.getElementById('commandInput').value;
    const runWindow = document.getElementById('runWindow');
    runWindow.style.display = 'none';
    if (commandInput.toLowerCase() === 'winver') {
        const winverWindow = document.getElementById('winverWindow');
        winverWindow.style.display = 'block';
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
