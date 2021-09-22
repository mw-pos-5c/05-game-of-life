
class Game {
    private boardWidth = 0;
    private boardHeight = 0;
    private running = false;

    private lastDraw = -1;

    private board: boolean[][] = [];
    private nextBoard: boolean[][] = [];
    private drawPixel: (alive: boolean, x: number, y: number) => void = () => {};

    paused = false;
    fps = 0;

    init(width: number, height: number, drawCallback: (alive: boolean, x: number, y: number) => void): void {

        this.boardHeight = height;
        this.boardWidth = width;
        this.drawPixel = drawCallback

        for (let x = 0; x < this.boardWidth; x++) {
            const line: boolean[] = [];
            const nextLine: boolean[] = [];
            this.board.push(line);
            this.nextBoard.push(nextLine);
            for (let y = 0; y < this.boardHeight; y++) {
                line.push(Math.random()*100 <= 3);
                nextLine.push(false);
            }
        }

    }

    wakeupCell(x: number,y: number) {
        if (this.paused && this.inBoard(x,y)) {
            this.board[x][y] = true;
            this.drawPixel(true, x,y);
        }
    }

    start(): void {
        if (this.running) return;

        this.running = true;
        this.paused = false;
        this.draw();
    }

    stop(): void {
        this.paused = true;
    }

    private inBoard(x: number,y: number) {
        return x < this.boardWidth && y < this.boardHeight && x >= 0 && y >= 0
    }

    private calcLife(): void {

        const isAlive = (x: number, y: number) => {
            if (!this.inBoard(x,y)){
                return 0;
            }

            return this.board[x][y] ? 1:0;
        }

        for (let x = 0; x < this.boardWidth; x++) {
            for (let y = 0; y < this.boardHeight; y++) {
                const neighbours =
                    isAlive(x-1,y+1) + isAlive(x,y+1) + isAlive(x+1,y+1) +
                    isAlive(x-1,y) + isAlive(x+1,y) +
                    isAlive(x-1,y-1) + isAlive(x,y-1) + isAlive(x+1,y-1);


                if (neighbours < 2 || neighbours > 3) {
                    this.nextBoard[x][y] = false;
                } else if (neighbours === 3) {
                    this.nextBoard[x][y] = true;
                } else {
                    this.nextBoard[x][y] = this.board[x][y];
                }

            }
        }
    }

    draw(): void {
        this.calcLife();
        for (let x = 0; x < this.boardWidth; x++) {
            for (let y = 0; y < this.boardHeight; y++) {
                let next = this.nextBoard[x][y];
                const update = this.board[x][y] !== next;

                if (update) {
                    this.drawPixel(next, x, y);
                    this.board[x][y] = next;
                }
            }
        }
        const now = performance.now();
        const elapsed = now - this.lastDraw;
        this.fps = 1000 / elapsed;
        this.lastDraw = now;

        if (!this.paused) {
            window.requestAnimationFrame(() => this.draw());
        } else {
            this.running = false;
        }
    }

}


window.onload = () => {

    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    const debug = <HTMLElement>document.getElementById('debug');
    const ctx = <CanvasRenderingContext2D>canvas.getContext('2d', { alpha: false });

    const pixelSize = 10;
    const boardWidth = Math.floor(canvas.clientWidth / pixelSize);
    const boardHeight = Math.floor(canvas.clientHeight / pixelSize);


    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // @ts-ignore
    const game = window.game = new Game();

    game.init(boardWidth, boardHeight, (alive, x, y) => {
        ctx.fillStyle = alive ? 'black' : 'white';
        ctx.fillRect(pixelSize*x, pixelSize*y, pixelSize, pixelSize);
    });

    game.start();

    function displayFps() {
        debug.innerText = 'FPS: ' + game.fps.toFixed(2);
        setTimeout(displayFps, 500);
    }

    displayFps();


    const stopBtn = <HTMLElement>document.getElementById('btn-stop');
    const startBtn = <HTMLElement>document.getElementById('btn-start');
    const nextBtn = <HTMLElement>document.getElementById('btn-next');

    stopBtn.addEventListener('click', ev => {
        game.stop();
    });

    startBtn.addEventListener('click', ev => {
        game.start();
    })

    nextBtn.addEventListener('click', ev => {
        game.stop();
        game.draw();
    });

    canvas.addEventListener('mousemove', ev => {
        if (game.paused && ev.buttons > 0) {
            game.wakeupCell(Math.floor(ev.offsetX / pixelSize), Math.floor(ev.offsetY / pixelSize));
        }
    })




};
