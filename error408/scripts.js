function repeatCloneWindow() {
    const originalWindow = document.querySelector('.window.active');
    let count = 0;

    function createClone() {
        if (count < 8) {
            // クローンを作成
            const clone = originalWindow.cloneNode(true);
            document.body.appendChild(clone);

            // クローンの位置を調整
            clone.style.position = 'absolute';
            clone.style.top = `calc(50% + ${count * 25}px)`;
            clone.style.left = `calc(50% + ${count * 25}px)`;
            clone.style.transform = 'translate(-50%, -50%)';

            count++;
            setTimeout(createClone, 250); // 0.25秒の待ち時間
        }
    }

    // 最初のウィンドウを削除
    originalWindow.remove();

    createClone();
}

document.addEventListener('DOMContentLoaded', repeatCloneWindow);
