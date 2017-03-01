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
  image.src = "http://localhost:8080/sample.jpg";
  image.onload = () => render(image);
});
