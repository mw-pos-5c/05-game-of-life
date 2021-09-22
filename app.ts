window.onload = () => {
   const boardSize = 800;
   const pixelSize = 4;

   const canvas = <HTMLCanvasElement>document.getElementById('canvas');
   canvas.width = canvas.height = boardSize;
   const ctx = canvas.getContext('2d');
   ctx.fillStyle = 'rgba(0, 0, 0, 1)';

   window.requestAnimationFrame(draw);

   function draw() {
      ctx.clearRect(0, 0, boardSize, boardSize);
      ctx.fillRect(300, 300, pixelSize, pixelSize);

      window.requestAnimationFrame(draw);
   }
};
