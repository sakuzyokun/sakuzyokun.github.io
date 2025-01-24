const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

const cellSize = 40;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;
const maze = generateMaze(rows, cols);

let player = { row: 0, col: 0 };

function generateMaze(rows, cols) {
    const grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({ top: true, right: true, bottom: true, left: true }))
    );

    const stack = [];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    let currentCell = { row: 0, col: 0 };
    visited[0][0] = true;

    while (true) {
        const neighbors = getUnvisitedNeighbors(currentCell, visited);
        if (neighbors.length > 0) {
            const nextCell = neighbors[Math.floor(Math.random() * neighbors.length)];
            stack.push(currentCell);

            removeWalls(currentCell, nextCell, grid);

            currentCell = nextCell;
            visited[currentCell.row][currentCell.col] = true;
        } else if (stack.length > 0) {
            currentCell = stack.pop();
        } else {
            break;
        }
    }

    return grid;
}

function getUnvisitedNeighbors(cell, visited) {
    const { row, col } = cell;
    const neighbors = [];

    if (row > 0 && !visited[row - 1][col]) neighbors.push({ row: row - 1, col });
    if (row < rows - 1 && !visited[row + 1][col]) neighbors.push({ row: row + 1, col });
    if (col > 0 && !visited[row][col - 1]) neighbors.push({ row, col: col - 1 });
    if (col < cols - 1 && !visited[row][col + 1]) neighbors.push({ row, col: col + 1 });

    return neighbors;
}

function removeWalls(cell1, cell2, grid) {
    const dx = cell2.col - cell1.col;
    const dy = cell2.row - cell1.row;

    if (dx === 1) {
        grid[cell1.row][cell1.col].right = false;
        grid[cell2.row][cell2.col].left = false;
    } else if (dx === -1) {
        grid[cell1.row][cell1.col].left = false;
        grid[cell2.row][cell2.col].right = false;
    }

    if (dy === 1) {
        grid[cell1.row][cell1.col].bottom = false;
        grid[cell2.row][cell2.col].top = false;
    } else if (dy === -1) {
        grid[cell1.row][cell1.col].top = false;
        grid[cell2.row][cell2.col].bottom = false;
    }
}

function drawMaze(maze) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    maze.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const x = colIndex * cellSize;
            const y = rowIndex * cellSize;

            ctx.beginPath();
            if (cell.top) ctx.moveTo(x, y), ctx.lineTo(x + cellSize, y);
            if (cell.right) ctx.moveTo(x + cellSize, y), ctx.lineTo(x + cellSize, y + cellSize);
            if (cell.bottom) ctx.moveTo(x, y + cellSize), ctx.lineTo(x + cellSize, y + cellSize);
            if (cell.left) ctx.moveTo(x, y), ctx.lineTo(x, y + cellSize);
            ctx.stroke();
        });
    });
}

function drawPlayer() {
    const x = player.col * cellSize + cellSize / 4;
    const y = player.row * cellSize + cellSize / 4;
    ctx.fillStyle = 'blue';
    ctx.fillRect(x, y, cellSize / 2, cellSize / 2);
}

function movePlayer(event) {
    const { row, col } = player;
    switch (event.key) {
        case 'ArrowUp':
            if (!maze[row][col].top) player.row--;
            break;
        case 'ArrowRight':
            if (!maze[row][col].right) player.col++;
            break;
        case 'ArrowDown':
            if (!maze[row][col].bottom) player.row++;
            break;
        case 'ArrowLeft':
            if (!maze[row][col].left) player.col--;
            break;
    }
    drawMaze(maze);
    drawPlayer();
}

document.addEventListener('keydown', movePlayer);

drawMaze(maze);
drawPlayer();
