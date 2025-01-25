document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.querySelector('.startup-screen').style.display = 'none';
        document.getElementById('main-window').style.display = 'block'; // Show the main window after startup
        setActiveWindow(document.getElementById('main-window'));
    }, 5000); // 5秒後に起動画面を非表示にし、メインウィンドウを表示する

    const startButton = document.querySelector('.start-button');
    const startMenu = document.getElementById('start-menu');

    startButton.addEventListener('click', function() {
        toggleStartMenu();
    });

    function toggleStartMenu() {
        startMenu.style.display = startMenu.style.display === 'none' ? 'block' : 'none';
    }

    function shutdown() {
        document.getElementById('shutdown-screen').style.display = 'flex';
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000); // 3秒後にindex.htmlにリダイレクトする
    }

    function makeDraggable(element) {
        let isDragging = false;
        let offsetX, offsetY;

        element.addEventListener('mousedown', (event) => {
            setActiveWindow(element);
            isDragging = true;
            offsetX = event.clientX - element.offsetLeft;
            offsetY = event.clientY - element.offsetTop;
            element.style.cursor = 'move';
        });

        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                element.style.left = event.clientX - offsetX + 'px';
                element.style.top = event.clientY - offsetY + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            element.style.cursor = 'default';
        });
    }

    function createWindow() {
        const newWindow = document.createElement('div');
        newWindow.className = 'window';
        newWindow.innerHTML = `
            <div class="window-header">
                <span>新しいウィンドウ</span>
                <span onclick="closeWindow(this.parentElement.parentElement)">×</span>
            </div>
            <div class="window-content">
                <p>これは新しいウィンドウです。</p>
                <button class="button">OK</button>
                <button class="button">キャンセル</button>
            </div>
        `;
        document.body.appendChild(newWindow);
        makeDraggable(newWindow);
        setActiveWindow(newWindow);
    }

    function openWindow(windowId) {
        const windowElement = document.getElementById(windowId);
        windowElement.style.display = 'block';
        makeDraggable(windowElement);
        setActiveWindow(windowElement);
    }

    function closeWindow(windowElement) {
        windowElement.style.display = 'none';
    }

    function setActiveWindow(windowElement) {
        const windows = document.querySelectorAll('.window');
        windows.forEach(win => {
            win.classList.remove('active');
            win.querySelector('.window-header').classList.remove('active');
        });
        windowElement.classList.add('active');
        windowElement.querySelector('.window-header').classList.add('active');
    }

    // プログレスバーのアニメーション
    let progress = 0;
    const progressBar = document.querySelector('.progress');
    const interval = setInterval(() => {
        progress += 1;
        progressBar.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 50); // 5秒間で進行

    // 初期のウィンドウをドラッグ可能にする
    makeDraggable(document.getElementById('main-window'));

    // スタートメニューとシャットダウンの関数をグローバルにアクセス可能にする
    window.toggleStartMenu = toggleStartMenu;
    window.shutdown = shutdown;
    window.openWindow = openWindow;
    window.closeWindow = closeWindow;
});
