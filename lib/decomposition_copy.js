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
  const fragmentShaderSourceLaplacian = document.getElementById("f-shader-laplacian").text;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShaderGray = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceGray);
  const fragmentShaderLaplacian = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceLaplacian);


  const programGray = createProgram(gl, vertexShader, fragmentShaderGray);
  const programLaplacian = createProgram(gl, vertexShader, fragmentShaderLaplacian);

  // allow shaders to access variables
  const positionAttributeLocation = gl.getAttribLocation(programGray, "a_position");
  const texCoordAttributeLocation = gl.getAttribLocation(programGray, "a_texCoord");
  const resolutionUniformLocation = gl.getUniformLocation(programGray, "u_resolution");
  const texSizeUniformLocation = gl.getUniformLocation(programLaplacian, "u_textureSize");
  const positionAttributeLocation2 = gl.getAttribLocation(programLaplacian, "a_position");
  const texCoordAttributeLocation2 = gl.getAttribLocation(programLaplacian, "a_texCoord");

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

  // image loaded onto this texture
  const originalTexture = createTexture(gl);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  // create second texture to render gray scale image
  const grayScaleTexture = createTexture(gl);
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height,
    0, gl.RGBA, gl.UNSIGNED_BYTE, null
  );

  // create framebuffer to attach texture
  const grayScaleFBO = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, grayScaleFBO);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, grayScaleTexture, 0
  );

  // rendering
  resize(canvas);

  gl.viewport(0, 0, image.width, image.height); //set clip space

  // clear canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(programGray);
  gl.uniform2f(resolutionUniformLocation, image.width, image.height);

  gl.enableVertexAttribArray(positionAttributeLocation2);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  let size = 2, type = gl.FLOAT, normalize = false, stride = 0, offset = 0;
  //size = 2 => only grab x, y coordinates, z, w default to 0, 1
  gl.vertexAttribPointer(
    positionAttributeLocation2,
    size,
    type,
    normalize,
    stride,
    offset
  );

  gl.enableVertexAttribArray(texCoordAttributeLocation2);
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.vertexAttribPointer(
    texCoordAttributeLocation2,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // gl.bindTexture(gl.TEXTURE_2D, originalTexture);
  // gl.bindFramebuffer(gl.FRAMEBUFFER, grayScaleFBO);
  //
  let primitiveType = gl.TRIANGLE_STRIP, count = 4;
  // gl.drawArrays(primitiveType, offset, count);

  gl.useProgram(programLaplacian);
  gl.uniform2f(texSizeUniformLocation, image.width, image.height);
  gl.bindTexture(gl.TEXTURE_2D, originalTexture);
  // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.drawArrays(primitiveType, offset, count);
};



document.addEventListener("DOMContentLoaded", () => {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = "http://localhost:8080/sample.jpg";
  image.onload = () => render(image);
});
