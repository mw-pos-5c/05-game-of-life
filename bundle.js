System.register("GameOfLife", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function calcLife(currentBoard, nextBoard) {
        return 'sus';
    }
    exports_1("default", calcLife);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("app", ["GameOfLife"], function (exports_2, context_2) {
    "use strict";
    var GameOfLife_1;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (GameOfLife_1_1) {
                GameOfLife_1 = GameOfLife_1_1;
            }
        ],
        execute: function () {
            window.onload = () => {
                const boardSize = 800;
                const pixelSize = 4;
                const canvas = document.getElementById('canvas');
                const debug = document.getElementById('debug');
                canvas.width = canvas.height = boardSize;
                const ctx = canvas.getContext('2d');
                const black = 'rgba(0, 0, 0, 1)';
                const board = [];
                const nextBoard = [];
                for (let x = 0; x < boardSize; x++) {
                    const line = [];
                    const nextLine = [];
                    board.push(line);
                    nextBoard.push(nextLine);
                    for (let y = 0; y < boardSize; y++) {
                        line.push(false);
                        nextLine.push(Math.random() * 100 <= 3);
                    }
                }
                let fps = -1;
                let drawRequested = performance.now();
                function draw() {
                    GameOfLife_1.default(board, nextBoard);
                    for (let x = 0; x < boardSize; x++) {
                        for (let y = 0; y < boardSize; y++) {
                            let next = nextBoard[x][y];
                            const update = board[x][y] !== next;
                            if (update) {
                                if (next) {
                                    ctx.fillStyle = black;
                                    ctx.fillRect(pixelSize * x, pixelSize * y, pixelSize, pixelSize);
                                }
                                else {
                                    ctx.clearRect(pixelSize * x, pixelSize * y, pixelSize, pixelSize);
                                }
                                board[x][y] = next;
                            }
                        }
                    }
                    const now = performance.now();
                    const elapsed = now - drawRequested;
                    fps = 1000 / elapsed;
                    drawRequested = now;
                    window.requestAnimationFrame(draw);
                }
                window.requestAnimationFrame(draw);
                function displayFps() {
                    debug.innerText = 'FPS: ' + fps.toFixed(2);
                    setTimeout(displayFps, 500);
                }
                displayFps();
            };
        }
    };
});
