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

function setMode(mode) {
    const body = document.body;
    const main = document.querySelector('main');
    const header = document.querySelector('header');

    body.className = ''; // Reset all mode classes
    main.className = ''; // Reset all mode classes
    header.className = ''; // Reset all mode classes

    if (mode === 'light') {
        body.classList.add('light-mode');
        main.classList.add('light-mode');
        header.classList.add('light-mode');
    } else if (mode === 'dark') {
        body.classList.add('dark-mode');
        main.classList.add('dark-mode');
        header.classList.add('dark-mode');
    } else if (mode === 'photo') {
        body.classList.add('photo-mode');
        main.classList.add('photo-mode');
        header.classList.add('photo-mode');
    }
}

document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    
    // リンクを右クリックした場合
    if (event.target.tagName === 'A') {
        showLinkMenu(event);
    } else {
        showPageMenu(event);
    }
});

document.addEventListener('click', function() {
    hideMenus();
});

function showLinkMenu(event) {
    const linkMenu = document.getElementById('linkMenu');
    hideMenus();
    linkMenu.style.display = 'block';
    linkMenu.style.left = `${event.pageX}px`;
    linkMenu.style.top = `${event.pageY}px`;
    linkMenu.dataset.url = event.target.href; // リンクURLをデータ属性として保存
}

function showPageMenu(event) {
    const pageMenu = document.getElementById('pageMenu');
    hideMenus();
    pageMenu.style.display = 'block';
    pageMenu.style.left = `${event.pageX}px`;
    pageMenu.style.top = `${event.pageY}px`;
}

function hideMenus() {
    document.getElementById('linkMenu').style.display = 'none';
    document.getElementById('pageMenu').style.display = 'none';
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
