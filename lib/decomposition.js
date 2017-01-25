import Simulation from './simulation';
import View from './view';

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.onload = function() {
    ctx.drawImage(this, 0, 0);

    const simulation = new Simulation(ctx, canvas.width, canvas.height);
    const view = new View(simulation);
    view.start();
  };

  img.crossOrigin = 'anonymous';
  img.src = "http://res.cloudinary.com/dpgudhebt/image/upload/v1484899730/sample.jpg";


  function pick(event) {
    var x = event.layerX;
    var y = event.layerY;
    var pixel = ctx.getImageData(x, y, 1, 1);
    var data = pixel.data;
    console.log(data);
  }
  canvas.addEventListener('click', pick);
});

// const drawGrayscale = img => {
//   const canvas = document.getElementById("canvas");
//   const ctx = canvas.getContext("2d");
//   ctx.drawImage(img, 0, 0);
//   const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//   const data = imageData.data;
//
//   for (let i = 0; i < data.length; i += 4) {
//     let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
//     data[i] = data[i + 1] = data[i + 2] = avg;
//   }
//   ctx.putImageData(imageData, 0, 0);
// };
