const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    width: 50,
    height: 10,
    dx: 5
};

let bullets = [];
let enemies = [];
let score = 0;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        player.dx = 5;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        player.dx = -5;
    } else if (e.key === "Enter") {
        shootBullet();
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight" || e.key === "Left" || e.key === "ArrowLeft") {
        player.dx = 0;
    }
}

function shootBullet() {
    bullets.push({
        x: player.x + player.width / 2,
        y: player.y,
        dy: -5
    });
}

function createEnemy() {
    const x = Math.random() * (canvas.width - 30);
    enemies.push({
        x: x,
        y: 0,
        width: 30,
        height: 30,
        dy: 2
    });
}

function drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    ctx.fillStyle = "black";
    bullets.forEach((bullet, index) => {
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
        bullet.y += bullet.dy;

        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

function drawEnemies() {
    ctx.fillStyle = "red";
    enemies.forEach((enemy, index) => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.y += enemy.dy;

        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }

        bullets.forEach((bullet, bIndex) => {
            if (bullet.x > enemy.x && bullet.x < enemy.x + enemy.width && bullet.y > enemy.y && bullet.y < enemy.y + enemy.height) {
                enemies.splice(index, 1);
                bullets.splice(bIndex, 1);
                score++;
                document.getElementById("score").innerText = `スコア: ${score}`;
            }
        });
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawEnemies();

    player.x += player.dx;
    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    requestAnimationFrame(update);
}

setInterval(createEnemy, 1000);
update();
