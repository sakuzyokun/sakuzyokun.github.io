document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetris');
    const context = canvas.getContext('2d');
    context.scale(20, 20);

    const arena = createMatrix(12, 20);

    const player = {
        pos: { x: 0, y: 0 },
        matrix: null,
        score: 0
    };

    function createMatrix(w, h) {
        const matrix = [];
        while (h--) {
            matrix.push(new Array(w).fill(0));
        }
        return matrix;
    }

    function createPiece(type) {
        if (type === 'T') {
            return [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0],
            ];
        } else if (type === 'O') {
            return [
                [2, 2],
                [2, 2],
            ];
        } else if (type === 'L') {
            return [
                [0, 3, 0],
                [0, 3, 0],
                [0, 3, 3],
            ];
        } else if (type === 'J') {
            return [
                [0, 4, 0],
                [0, 4, 0],
                [4, 4, 0],
            ];
        } else if (type === 'I') {
            return [
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0],
            ];
        } else if (type === 'S') {
            return [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0],
            ];
        } else if (type === 'Z') {
            return [
                [7, 7, 0],
                [0, 7, 7],
                [0, 0, 0],
            ];
        }
    }

    function drawMatrix(matrix, offset) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    context.fillStyle = colors[value];
                    context.fillRect(x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
    }

    function draw() {
        context.fillStyle = '#000';
        context.fillRect(0, 0, canvas.width, canvas.height);

        drawMatrix(arena, { x: 0, y: 0 });
        drawMatrix(player.matrix, player.pos);
    }

    function merge(arena, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    arena[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    }

    function rotate(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [
                    matrix[x][y],
                    matrix[y][x],
                ] = [
                    matrix[y][x],
                    matrix[x][y],
                ];
            }
        }

        if (dir > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
    }

    function playerDrop() {
        player.pos.y++;
        if (collide(arena, player)) {
            player.pos.y--;
            merge(arena, player);
            playerReset();
            arenaSweep();
            updateScore();
        }
        dropCounter = 0;
    }

    function playerMove(offset) {
        player.pos.x += offset;
        if (collide(arena, player)) {
            player.pos.x -= offset;
        }
    }

    function playerReset() {
        const pieces = 'TJLOSZI';
        player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
        player.pos.y = 0;
        player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
        if (collide(arena, player)) {
            arena.forEach(row => row.fill(0));
            player.score = 0;
            updateScore();
        }
    }

    function playerRotate(dir) {
        const pos = player.pos.x;
        let offset = 1;
        rotate(player.matrix, dir);
        while (collide(arena, player)) {
            player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > player.matrix[0].length) {
                rotate(player.matrix, -dir);
                player.pos.x = pos;
                return;
            }
        }
    }

    function collide(arena, player) {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 &&
                   (arena[y + o.y] &&
                    arena[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    function arenaSweep() {
        let rowCount = 1;
        outer: for (let y = arena.length - 1; y > 0; --y) {
            for (let x = 0; x < arena[y].length; ++x) {
                if (arena[y][x] === 0) {
                    continue outer;
                }
            }

            const row = arena.splice(y, 1)[0].fill(0);
            arena.unshift(row);
            ++y;

            player.score += rowCount * 10;
            rowCount *= 2;
        }
    }

    function update(time = 0) {
        const deltaTime = time - lastTime;
        lastTime = time;

        dropCounter += deltaTime;
        if (dropCounter > dropInterval) {
            playerDrop();
        }

        draw();
        requestAnimationFrame(update);
    }

    function updateScore() {
        document.getElementById('score').innerText = `スコア: ${player.score}`;
    }

    const colors = [_{{{CITATION{{{_1{](https://github.com/l-julius/tetris/tree/e192a622586627ef7376659ee754b4e53f694220/tetris.js)[_{{{CITATION{{{_2{](https://github.com/aliemir/tetris-clone/tree/ed12998a0c2b7df36c7992fadea58b556d9a2cf6/tetris.js)[_{{{CITATION{{{_3{](https://github.com/xeviert/Tetris/tree/5ebfa63e79888cd4c0eaad5cf7185ed93c4ad589/tetris.js)[_{{{CITATION{{{_4{](https://github.com/W-Conway/tetrisjs/tree/b7208c1cfac0cf4fb6b4a99fca8820253c9098b6/Resources%2Ftetris.js)[_{{{CITATION{{{_5{](https://github.com/getromandev/tetrisJavscript/tree/5d6cf7460add2a2f47c391e950d06c1099db1e6b/tetris.js)[_{{{CITATION{{{_6{](https://github.com/beadx6ggwp/Tetris/tree/5e87da69cbb896fa9f1e0b7d9c5760c476eb7f75/ver0.2%2Fmain.js)[_{{{CITATION{{{_7{](https://github.com/fathidk/tetris/tree/41982ff99128f763ded1a62da8a53edc1b9c189f/script.js)[_{{{CITATION{{{_8{](https://github.com/morshinin/tetris/tree/5eb56562bd053188a3fce7cbaf72b0337c7502c2/tetris.js)[_{{{CITATION{{{_9{](https://github.com/vaibhav111tandon/Tetris/tree/2d5d2bc15c2e452fd48b1a1c1c5258cb397e0b50/script.js)[_{{{CITATION{{{_10{](https://github.com/MrMace/Tetris/tree/330be953227160a0257d86bb2248b85ffd976ccb/script.js)[_{{{CITATION{{{_11{](https://github.com/thomasongley/tetris/tree/e0c1a3729515cc02f10d21b7a046ada871b47f8c/tetris.js)
