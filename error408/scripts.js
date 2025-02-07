function repeatMoveWindow() {
    const windowElement = document.querySelector('.window.active');
    let count = 0;
    
    function move() {
        windowElement.style.animation = 'none'; // アニメーションをリセット
        windowElement.offsetHeight; // 強制リフローでアニメーションをリセット
        windowElement.style.animation = 'moveWindow 2s ease-in-out';
        
        count++;
        if (count < 8) {
            setTimeout(move, 2250); // 0.25秒の待ち時間＋2秒のアニメーション時間
        }
    }
    
    move();
}

document.addEventListener('DOMContentLoaded', repeatMoveWindow);
