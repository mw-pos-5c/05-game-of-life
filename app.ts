import calcLife from "./GameOfLife";

window.onload = () => {
    const boardSize = 800;
    const pixelSize = 4;

    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    const debug = <HTMLElement>document.getElementById('debug');
    const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
    canvas.width = canvas.height = boardSize;

    const black = 'rgba(0, 0, 0, 1)';

    const board: boolean[][] = [];
    const nextBoard: boolean[][] = [];



    for (let x = 0; x < boardSize; x++) {
        const line: boolean[] = [];
        const nextLine: boolean[] = [];
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
        calcLife(board, nextBoard);
        for (let x = 0; x < boardSize; x++) {
            for (let y = 0; y < boardSize; y++) {
                let next = nextBoard[x][y];
                const update = board[x][y] !== next;

                if (update) {
                    if (next) {
                        ctx.fillStyle = black;
                        ctx.fillRect(pixelSize * x, pixelSize * y, pixelSize, pixelSize);
                    } else {
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
