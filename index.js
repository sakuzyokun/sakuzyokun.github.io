// 移動間隔を設定する変数をグローバルに宣言
let moveMessageBoxInterval;

// ページ読み込み時の処理を定義
window.addEventListener('load', function() {
    if (!isMobile() && !isMac()) {
        showMessageBox();
    } else if (isMac()) {
        createToggleButton();
    }
    setMode('photo'); // デフォルトで写真モードを設定
});

// デバイスがモバイルかどうかを判定する関数
function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
}

// デバイスがMacかどうかを判定する関数
function isMac() {
    return /Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.userAgent);
}

// メッセージボックスを表示する関数
function showMessageBox() {
    const messageBox = document.getElementById('messageBox');
    messageBox.style.display = 'block';
    moveMessageBox();

    moveMessageBoxInterval = setInterval(moveMessageBox, 1000);
}

// メッセージボックスを閉じる関数
function closeMessageBox() {
    document.getElementById('messageBox').style.display = 'none';
    clearInterval(moveMessageBoxInterval); // メッセージボックスの動きを停止
}

// メッセージボックスを移動させる関数
function moveMessageBox() {
    const messageBox = document.getElementById('messageBox');
    const x = Math.floor(Math.random() * (window.innerWidth - messageBox.clientWidth));
    const y = Math.floor(Math.random() * (window.innerHeight - messageBox.clientHeight));
    messageBox.style.left = `${x}px`;
    messageBox.style.top = `${y}px`;
}

// リンクを新しいタブで開く関数
function web() {
    window.open('YouTube.html', '_blank');
}

// トグルボタンを作成する関数
function createToggleButton() {
    const toggleButtonContainer = document.getElementById('toggleButton');
    const button = document.createElement('button');
    button.textContent = 'メッセージボックスをON/OFFにする';
    button.addEventListener('click', toggleMessageBox);
    toggleButtonContainer.appendChild(button);
}

// メッセージボックスの表示/非表示を切り替える関数
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

// 右クリックメニューの表示
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();

    // メッセージボックスの動きを一時停止
    //clearInterval(moveMessageBoxInterval);

    // リンクを右クリックした場合
    if (event.target.tagName === 'A') {
        showLinkMenu(event);
    } else {
        showPageMenu(event);
    }
});

// クリック時の処理を定義
document.addEventListener('mousedown', function(event) {
    const linkMenu = document.getElementById('linkMenu');
    const pageMenu = document.getElementById('pageMenu');

    // メニュー内のクリックを無視
    if (!linkMenu.contains(event.target) && !pageMenu.contains(event.target)) {
        hideMenus();
    }
});

// タッチイベントの処理を定義
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
document.addEventListener('touchend', handleTouchEnd, false);

let touchStartTime;
let touchX;
let touchY;
const touchDuration = 250; // 長押しとみなす時間（ミリ秒）

// タッチ開始時の処理
function handleTouchStart(event) {
    touchStartTime = Date.now();
    touchX = event.touches[0].clientX;
    touchY = event.touches[0].clientY;
}

// タッチ移動時の処理
function handleTouchMove(event) {
    const deltaX = Math.abs(event.touches[0].clientX - touchX);
    const deltaY = Math.abs(event.touches[0].clientY - touchY);
    if (deltaX > 10 || deltaY > 10) {
        touchStartTime = null; // 長押しをキャンセル
    }
}

// タッチ終了時の処理
function handleTouchEnd(event) {
    if (!touchStartTime) {
        return;
    }
    const elapsedTime = Date.now() - touchStartTime;
    if (elapsedTime >= touchDuration) {
        // 長押しとみなす
        event.preventDefault();

        // メッセージボックスの動きを一時停止
        //clearInterval(moveMessageBoxInterval);

        // リンクを長押しした場合
        if (event.target.tagName === 'A') {
            showLinkMenu(event);
        } else {
            showPageMenu(event);
        }
    }
}

// リンクメニューを表示する関数
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

// ページメニューを表示する関数
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

// メニューを隠す関数
function hideMenus() {
    const linkMenu = document.getElementById('linkMenu');
    const pageMenu = document.getElementById('pageMenu');

    linkMenu.style.opacity = '0';
    pageMenu.style.opacity = '0';
/*
    setTimeout(() => {
        linkMenu.style.display = 'none';
        pageMenu.style.display = 'none';

        // メッセージボックスの動きを再開
        //moveMessageBoxInterval = setInterval(moveMessageBox, 1000);
    }, 1000); // トランジションの時間と一致させる 300ms*/
}

// リンクを新しいタブで開く関数
function openLink(event, target) {
    const url = document.getElementById('linkMenu').dataset.url;
    window.open(url, target);
    hideMenus();
}

// リンクをコピーする関数
function copyLink(event) {
    const url = document.getElementById('linkMenu').dataset.url;
    navigator.clipboard.writeText(url).then(() => {
        alert('リンクがコピーされました');
    });
    hideMenus();
}

// ページリンクをコピーする関数
function copyPageLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('ページのリンクがコピーされました');
    });
    hideMenus();
}

// メッセージボックスを隠す関数
function hideMessageBox() {
    document.getElementById('messageBox').style.display = 'none';
    clearInterval(moveMessageBoxInterval); // メッセージボックスの動きを停止
    hideMenus();
}
/*
//画面の下の方で右クリックしても見えるように
document.addEventListener("contextmenu", function (event) {
    event.preventDefault();

    let menu = document.getElementById("pageMenu"); // 例: ページメニューをターゲット
    menu.style.display = "block";

    let menuWidth = menu.offsetWidth;
    let menuHeight = menu.offsetHeight;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    let x = event.clientX;
    let y = event.clientY;

    // 画面の右端に近い場合、メニューの表示位置を調整
    if (x + menuWidth > windowWidth) {
        x -= menuWidth;
    }
    
    // 画面の下端に近い場合、メニューの表示位置を調整
    if (y + menuHeight > windowHeight) {
        y -= menuHeight;
    }

    menu.style.left = x + "px";
    menu.style.top = y + "px";
    menu.style.opacity = "1";
});
*/
function changeModes() {
    setMode('light');
    setTimeout(() => {
        setMode('dark');
        setTimeout(() => {
                setMode('photo');
        }, 1000);
    }, 1000);
}

// モードを設定する関数
function setMode(mode) {
    const body = document.body;
    const main = document.querySelector('main');
    const header = document.querySelector('header');
    const customMenus = document.querySelectorAll('.custom-menu');

    // 適用中メッセージを表示
    const applyingMessage = document.createElement('div');
    applyingMessage.id = 'applyingMessage';
    applyingMessage.textContent = '適用中...';
    applyingMessage.style.position = 'fixed';
    applyingMessage.style.top = '50%';
    applyingMessage.style.left = '50%';
    applyingMessage.style.transform = 'translate(-50%, -50%)';
    applyingMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    applyingMessage.style.color = '#ffffff';
    applyingMessage.style.padding = '20px';
    applyingMessage.style.borderRadius = '5px';
    applyingMessage.style.zIndex = '1000';
    applyingMessage.style.transition = 'opacity 0.5s ease'; // フェード効果を追加
    document.body.appendChild(applyingMessage);

    // フェードアウト
    body.style.transition = 'opacity 0.5s ease';
    main.style.transition = 'opacity 0.5s ease';
    header.style.transition = 'opacity 0.5s ease';
    customMenus.forEach(menu => menu.style.transition = 'opacity 0.5s ease');
    
    body.style.opacity = '0';
    main.style.opacity = '0';
    header.style.opacity = '0';
    customMenus.forEach(menu => menu.style.opacity = '0');

    setTimeout(() => {
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

        // フェードイン
        body.style.opacity = '1';
        main.style.opacity = '1';
        header.style.opacity = '1';
        customMenus.forEach(menu => menu.style.opacity = '1');

        // 適用中メッセージをフェードアウト
        applyingMessage.style.opacity = '0';

        setTimeout(() => {
            document.body.removeChild(applyingMessage);
        }, 500); // 0.5秒後に削除
    }, 500); // 0.5秒の遅延を挿入
}

