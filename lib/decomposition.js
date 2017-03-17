import Simulation from './simulation';
import View from './view';

import {resize} from './webgl_util';

const render = (image) => {
  const canvas = document.getElementById("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert("You don't have WebGl enabled!");
    return;
  }
  // resize(canvas);
  const simulation = new Simulation(gl, image);
  const view = new View(simulation);
  view.start();
};

document.addEventListener("DOMContentLoaded", () => {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = "https://res.cloudinary.com/dpgudhebt/image/upload/c_crop,h_1080,w_1920/v1484899897/magic-cube-cube-puzzle-play-54101_kaeq1l.jpg";
  image.onload = () => render(image);
});
