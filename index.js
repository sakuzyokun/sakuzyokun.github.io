window.addEventListener('load', function() {
    if (!isMobile() && !isMac()) {
        showMessageBox();
    } else if (isMac()) {
        createToggleButton();
    }
    setMode('photo'); // デフォルトで写真モードを設定
});

function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
}

function isMac() {
    return /Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.userAgent);
}

function showMessageBox() {
    const messageBox = document.getElementById('messageBox');
    messageBox.style.display = 'block';
    moveMessageBox();

    moveMessageBoxInterval = setInterval(moveMessageBox, 1000);
}

function closeMessageBox() {
    document.getElementById('messageBox').style.display = 'none';
    clearInterval(moveMessageBoxInterval); // メッセージボックスの動きを停止
}

function moveMessageBox() {
    const messageBox = document.getElementById('messageBox');
    const x = Math.floor(Math.random() * (window.innerWidth - messageBox.clientWidth));
    const y = Math.floor(Math.random() * (window.innerHeight - messageBox.clientHeight));
    messageBox.style.left = `${x}px`;
    messageBox.style.top = `${y}px`;
}

function web() {
    window.open('YouTube.html', '_blank');
}

function createToggleButton() {
    const toggleButtonContainer = document.getElementById('toggleButton');
    const button = document.createElement('button');
    button.textContent = 'メッセージボックスをON/OFFにする';
    button.addEventListener('click', toggleMessageBox);
    toggleButtonContainer.appendChild(button);
}

function toggleMessageBox() {
    const messageBox = document.getElementById('messageBox');
    if (messageBox.style.display === 'block') {
        messageBox.style.display = 'none';
        clearInterval(moveMessageBoxInterval); // 停止
    } else {
        messageBox.style.display = 'block';
        moveMessageBoxInterval = setInterval(moveMessageBox, 1000); // 再開
    }
}

let moveMessageBoxInterval;

document.addEventListener('contextmenu', function(event) {
    event.preventDefault();

    // メッセージボックスの動きを一時停止
    clearInterval(moveMessageBoxInterval);

    // リンクを右クリックした場合
    if (event.target.tagName === 'A') {
        showLinkMenu(event);
    } else {
        showPageMenu(event);
    }
});

document.addEventListener('mousedown', function(event) {
    const linkMenu = document.getElementById('linkMenu');
    const pageMenu = document.getElementById('pageMenu');

    // メニュー内のクリックを無視
    if (!linkMenu.contains(event.target) && !pageMenu.contains(event.target)) {
        hideMenus();
    }
});

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
document.addEventListener('touchend', handleTouchEnd, false);

let touchStartTime;
let touchX;
let touchY;
const touchDuration = 500; // 長押しとみなす時間（ミリ秒）

function handleTouchStart(event) {
    touchStartTime = Date.now();
    touchX = event.touches[0].clientX;
    touchY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    const deltaX = Math.abs(event.touches[0].clientX - touchX);
    const deltaY = Math.abs(event.touches[0].clientY - touchY);
    if (deltaX > 10 || deltaY > 10) {
        touchStartTime = null; // 長押しをキャンセル
    }
}

function handleTouchEnd(event) {
    if (!touchStartTime) {
        return;
    }
    const elapsedTime = Date.now() - touchStartTime;
    if (elapsedTime >= touchDuration) {
        // 長押しとみなす
        event.preventDefault();

        // メッセージボックスの動きを一時停止
        clearInterval(moveMessageBoxInterval);

        // リンクを長押しした場合
        if (event.target.tagName === 'A') {
            showLinkMenu(event);
        } else {
            showPageMenu(event);
        }
    }
}

function showLinkMenu(event) {
    const linkMenu = document.getElementById('linkMenu');
    hideMenus();
    linkMenu.style.display = 'block';
    setTimeout(() => {
        linkMenu.style.opacity = '1';
    }, 10);  // 小さな遅延を挿入
    linkMenu.style.left = `${event.pageX}px`;
    linkMenu.style.top = `${event.pageY}px`;
    linkMenu.dataset.url = event.target.href; // リンクURLをデータ属性として保存
}

function showPageMenu(event) {
    const pageMenu = document.getElementById('pageMenu');
    hideMenus();
    pageMenu.style.display = 'block';
    setTimeout(() => {
        pageMenu.style.opacity = '1';
    }, 10);  // 小さな遅延を挿入
    pageMenu.style.left = `${event.pageX}px`;
    pageMenu.style.top = `${event.pageY}px`;
}

function hideMenus() {
    const linkMenu = document.getElementById('linkMenu');
    const pageMenu = document.getElementById('pageMenu');

    linkMenu.style.opacity = '0';
    pageMenu.style.opacity = '0';

    setTimeout(() => {
        linkMenu.style.display = 'none';
        pageMenu.style.display = 'none';

        // メッセージボックスの動きを再開
        moveMessageBoxInterval = setInterval(moveMessageBox, 1000);
    }, 300); // トランジションの時間と一致させる
}

function openLink(event, target) {
    const url = document.getElementById('linkMenu').dataset.url;
    window.open(url, target);
    hideMenus();
}

function copyLink(event) {
    const url = document.getElementById('linkMenu').dataset.url;
    navigator.clipboard.writeText(url).then(() => {
        alert('リンクがコピーされました');
    });
    hideMenus();
}

function copyPageLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('ページのリンクがコピーされました');
    });
    hideMenus();
}

function hideMessageBox() {
    document.getElementById('messageBox').style.display = 'none';
    clearInterval(moveMessageBoxInterval); // メッセージボックスの動きを停止
    hideMenus();
}

function setMode(mode) {
    const body = document.body;
    const main = document.querySelector('main');
    const header = document.querySelector('header');
    const customMenus = document.querySelectorAll('.custom-menu');

    body.className = ''; // Reset all mode classes
    main.className = ''; // Reset all mode classes
    header.className = ''; // Reset all mode classes
    customMenus.forEach(menu => menu.className = 'custom-menu'); // Reset custom menu classes

    if (mode === 'light') {
        body.classList.add('light-mode');
        main.classList.add('light-mode');
        header.classList.add('light-mode');
        customMenus.forEach(menu => menu.classList.add('light-mode'));
    } else if (mode === 'dark') {
        body.classList.add('dark-mode');
        main.classList.add('dark-mode');
        header.classList.add('dark-mode');
        customMenus.forEach(menu => menu.classList.add('dark-mode'));
    } else if (mode === 'photo') {
        body.classList.add('photo-mode');
        main.classList.add('photo-mode');
        header.classList.add('photo-mode');
        customMenus.forEach(menu => menu.classList.add('photo-mode'));
    }
}
