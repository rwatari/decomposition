import Simulation from './simulation';
import SimulationJS from './simulation_js';
import View from './view';

import {resize} from './webgl_util';

let simulation, view;

const renderWebGL = (image, canvas) => {
  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert("You don't have WebGl enabled!");
    return;
  }

  const simulation = new Simulation(gl, image);
  const view = new View(simulation);

  const startButton = document.getElementById("start");
  startButton.addEventListener("click", () => {
    view.toggle(startButton);
  });
};

const renderJS = (image, canvas) => {
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  const simulationJS = new SimulationJS(ctx, canvas.width, canvas.height);
  const viewJS = new View(simulationJS);

  const startButton = document.getElementById("start");
  startButton.addEventListener("click", () => {
    viewJS.toggle(startButton);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = "https://res.cloudinary.com/dpgudhebt/image/upload/c_crop,h_1080,w_1920/v1484899897/magic-cube-cube-puzzle-play-54101_kaeq1l.jpg";
  image.onload = () => {
    let canvas = document.getElementById("canvas");

    canvas.width = image.width;
    canvas.height = image.height;

    renderWebGL(image, canvas);

    const modal = document.getElementById("modal");
    let modalVisible = true;
    window.addEventListener("click", event => {
      if (modalVisible && event.target === modal) {
        modal.style.display = "none";
      } else {
        modal.style.display = "flex";
      }
      modalVisible = !modalVisible;
    });

    const switchButton = document.getElementById("switch");
    let webGLSim = true;
    switchButton.addEventListener("click", () => {
      // resetting the context by creating a new canvas
      let newCanvas = canvas.cloneNode(false);
      canvas.parentNode.replaceChild(newCanvas, canvas);
      canvas = newCanvas;

      if (webGLSim) {
        renderJS(image, canvas);
        switchButton.innerHTML = "Switch to WebGL";
      } else {
        renderWebGL(image, canvas);
        switchButton.innerHTML = "Switch to JavaScript"
      }

      webGLSim = !webGLSim;
    });
  }
});
