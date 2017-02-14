// import Simulation from './simulation';
// import View from './view';
import {
  createShader,
  createProgram,
  resize
} from './webgl_util';


document.addEventListener("DOMContentLoaded", () => {
  // getting webgl context
  const canvas = document.getElementById("canvas");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert("You don't have WebGl enabled!");
  }

  // grabbing shader source and attaching them to make program
  const vertexShaderSource = document.getElementById("v-shader").text;
  const fragmentShaderSource = document.getElementById("f-shader").text;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  const program = createProgram(gl, vertexShader, fragmentShader);

  // allow shaders to access variables
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

  // create buffers
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // set current buffer as positionBuffer
  const positions = [
    10, 20,
    80, 20,
    10, 30,
    10, 30,
    80, 20,
    80, 30
  ];
  //set positions to positionBuffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // rendering
  resize(canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); //set clip space

  // clear canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  let size = 2, type = gl.FLOAT, normalize = false, stride = 0, offset = 0;
  //size = 2 => only grab x, y coordinates, z, w default to 0, 1
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  let primitiveType = gl.TRIANGLES, count = 6;
  gl.drawArrays(primitiveType, offset, count);
});


// document.addEventListener("DOMContentLoaded", () => {
//   const canvas = document.getElementById("canvas");
//   const ctx = canvas.getContext("2d");
//
//   const img = new Image();
//   img.onload = function() {
//     ctx.drawImage(this, 0, 0);
//
//     const simulation = new Simulation(ctx, canvas.width, canvas.height);
//     const view = new View(simulation);
//     view.start();
//   };
//
//   img.crossOrigin = 'anonymous';
//   img.src = "http://res.cloudinary.com/dpgudhebt/image/upload/v1484899730/sample.jpg";
//
//
//   function pick(event) {
//     var x = event.layerX;
//     var y = event.layerY;
//     var pixel = ctx.getImageData(x, y, 1, 1);
//     var data = pixel.data;
//     console.log(data);
//   }
//   canvas.addEventListener('click', pick);
// });

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
