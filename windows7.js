let isMaximized = false;
let originalWidth, originalHeight, originalTop, originalLeft;

function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    startMenu.style.display = startMenu.style.display === 'none' ? 'block' : 'none';
}

let windowsState = {};

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".title-bar").forEach(bar => {
        bar.addEventListener("mousedown", (event) => dragStart(event, bar.parentElement.id));
    });
});

function dragStart(event, windowId) {
    const window = document.getElementById(windowId);
    let shiftX = event.clientX - window.getBoundingClientRect().left;
    let shiftY = event.clientY - window.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        window.style.left = `${pageX - shiftX}px`;
        window.style.top = `${pageY - shiftY}px`;
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener("mousemove", onMouseMove);

    document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", onMouseMove);
    }, { once: true });
}

function maximizeWindow(windowId) {
    const window = document.getElementById(windowId);
    if (!windowsState[windowId]) windowsState[windowId] = {};

    if (windowsState[windowId].maximized) {
        Object.assign(window.style, windowsState[windowId]);
        windowsState[windowId].maximized = false;
    } else {
        windowsState[windowId] = {
            width: window.style.width,
            height: window.style.height,
            top: window.style.top,
            left: window.style.left,
            position: window.style.position,
            maximized: true
        };
        Object.assign(window.style, {
            width: "100%",
            height: "100%",
            top: "0",
            left: "0",
            position: "fixed"
        });
    }
}

function minimizeWindow(windowId, title) {
    const window = document.getElementById(windowId);
    window.style.display = "none";
    const taskbarWindows = document.getElementById("taskbarWindows");
    const minimizedTitle = document.createElement("div");
    minimizedTitle.className = "window-title";
    minimizedTitle.innerText = title;
    minimizedTitle.onclick = function () {
        window.style.display = "block";
        taskbarWindows.removeChild(minimizedTitle);
        setActiveWindow(windowId);
    };
    taskbarWindows.appendChild(minimizedTitle);
}

function closeWindow(windowId) {
    document.getElementById(windowId).style.display = "none";
}

function setActiveWindow(windowId) {
    document.querySelectorAll(".window").forEach(win => {
        win.classList.toggle("active", win.id === windowId);
        win.style.zIndex = win.id === windowId ? "1000" : "1";
    });
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

document.ondragstart = function() {
    return false;
};

function setActiveWindow(windowId) {
    const windows = document.getElementsByClassName('window');
    for (const win of windows) {
        if (win.id === windowId) {
            win.className = 'window active';
            win.style.zIndex = '1000'; // 最前面に表示
        } else {
            win.className = 'window';
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
