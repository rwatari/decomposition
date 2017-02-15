// import Simulation from './simulation';
// import View from './view';
import {
  createShader,
  createProgram,
  createTexture,
  resize
} from './webgl_util';

const render = (image) => {
  // getting webgl context
  const canvas = document.getElementById("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert("You don't have WebGl enabled!");
    return;
  }

  // grabbing shader source and attaching them to make program
  const vertexShaderSource = document.getElementById("v-shader").text;
  const fragmentShaderSourceGray = document.getElementById("f-shader-gray").text;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShaderGray = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceGray);

  const program = createProgram(gl, vertexShader, fragmentShaderGray);

  // allow shaders to access variables
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");
  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

  // create buffers
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // set current buffer as positionBuffer
  const positions = [
    0          , 0,
    image.width, 0,
    0          , image.height,
    image.width, image.height
  ];
  //set positions to positionBuffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    1.0, 1.0
  ]), gl.STATIC_DRAW);

  const originalTexture = createTexture(gl);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);


  // rendering
  resize(canvas);

  gl.viewport(0, 0, image.width, image.height); //set clip space

  // clear canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.uniform2f(resolutionUniformLocation, image.width, image.height);

  gl.enableVertexAttribArray(positionAttributeLocation);
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

  gl.enableVertexAttribArray(texCoordAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.vertexAttribPointer(
    texCoordAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );



  let primitiveType = gl.TRIANGLE_STRIP, count = 4;
  gl.drawArrays(primitiveType, offset, count);
};



document.addEventListener("DOMContentLoaded", () => {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = "http://localhost:8080/sample.jpg";
  image.onload = () => render(image);
});
