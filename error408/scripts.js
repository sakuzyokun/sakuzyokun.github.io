function repeatCloneWindow() {
    const originalWindow = document.querySelector('.window.active');
    let count = 0;

    function createClone() {
        if (count < 10) {
            // クローンを作成
            const clone = originalWindow.cloneNode(true);
            document.body.appendChild(clone);

            // クローンの位置を調整
            clone.style.position = 'absolute';
            clone.style.top = `calc(50% + ${count * 25}px)`;
            clone.style.left = `calc(50% + ${count * 25}px)`;
            clone.style.transform = 'translate(-50%, -50%)';

            count++;
            setTimeout(createClone, 150); // 0.15秒の待ち時間
        }
    }

    function createClone1() {
        if (count < 4) {
            // クローンを作成
            const clone = originalWindow.cloneNode(true);
            document.body.appendChild(clone);

            // クローンの位置を調整
            clone.style.position = 'absolute';
            clone.style.top = `calc(50% + ${count * 25}px)`;
            clone.style.left = `calc(50% + ${count * 25}px)`;
            clone.style.transform = 'translate(-50%, -50%)';

            count++;
            setTimeout(createClone, 150); // 0.15秒の待ち時間
        }
    }

    // 最初のウィンドウを削除
    originalWindow.remove();

    // 1秒後に音声を再生し、クローンを作成
    setTimeout(() => {
        const audio = document.getElementById('errorSound');
        audio.play().catch(error => {
            console.log("音声の自動再生がブロックされました:", error);
        });
        createClone();
        setTimeout(() => {
            createClone1();
        }, 800);
    }, 3000); // 3秒の遅延
}

// ページがロードされたときに音声を再生し、クローンを作成
document.addEventListener('DOMContentLoaded', () => {
    repeatCloneWindow();
});
