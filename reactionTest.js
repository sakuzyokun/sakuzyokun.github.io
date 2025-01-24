const gameCanvas = document.getElementById('gameCanvas');
const reactionTimeDisplay = document.getElementById('reactionTime');

let startTime;
let endTime;
let timer;

gameCanvas.addEventListener('click', () => {
    if (gameCanvas.textContent === 'スタート') {
        startGame();
    } else if (gameCanvas.style.backgroundColor === 'red') {
        endTime = new Date();
        const reactionTime = (endTime - startTime) / 1000;
        reactionTimeDisplay.textContent = `反応時間: ${reactionTime}秒`;
        gameCanvas.textContent = '再挑戦';
        clearTimeout(timer);
    }
});

function startGame() {
    reactionTimeDisplay.textContent = '反応時間: --';
    gameCanvas.style.backgroundColor = 'white';
    gameCanvas.textContent = '準備';
    const delay = Math.random() * 5000 + 1000; // 1～6秒のランダムな遅延
    timer = setTimeout(() => {
        gameCanvas.style.backgroundColor = 'red';
        gameCanvas.textContent = 'クリック！';
        startTime = new Date();
    }, delay);
}
