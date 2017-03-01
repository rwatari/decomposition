// import Simulation from './simulation';
// import View from './view';
import {
  createShader,
  createProgram,
  createTexture,
  createFramebuffer,
  bindVertexAttrib,
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
  // rendering
  resize(canvas);
  gl.viewport(0, 0, image.width, image.height); //set clip space
  gl.clearColor(0, 0, 0, 0); // clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);

  // grabbing shader source and attaching them to make program
  const vShaderSource = document.getElementById("v-shader").text;
  const fShaderSourceGray = document.getElementById("f-shader-gray").text;
  const fShaderSourceShow = document.getElementById("f-shader-show").text;
  const fShaderSourceStep = document.getElementById("f-shader-step").text;

  const vShader = createShader(gl, gl.VERTEX_SHADER, vShaderSource);
  const fShaderGray = createShader(gl, gl.FRAGMENT_SHADER, fShaderSourceGray);
  const fShaderShow = createShader(gl, gl.FRAGMENT_SHADER, fShaderSourceShow);
  const fShaderStep = createShader(gl, gl.FRAGMENT_SHADER, fShaderSourceStep);

  const programGray = createProgram(gl, vShader, fShaderGray);
  const programShow = createProgram(gl, vShader, fShaderShow);
  const programStep = createProgram(gl, vShader, fShaderStep);

  // allow shaders to access variables
  const positionAttribLoc = gl.getAttribLocation(programGray, "a_position");
  const texCoordAttribLoc = gl.getAttribLocation(programGray, "a_texCoord");
  const texSizeUniformLoc = gl.getUniformLocation(programStep, "u_textureSize");

  // original image loaded into this texture
  const texture0 = createTexture(gl);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // load image without flipping upside down
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  const texture1 = createTexture(gl);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  // create framebuffer to attach texture
  const fbo0 = createFramebuffer(gl, texture0);
  const fbo1 = createFramebuffer(gl, texture1);

  // bind vertex attributes to position and texture coordinate bounds
  const positions = [
    -1., -1.,
     1., -1.,
    -1.,  1.,
     1.,  1.
  ];
  bindVertexAttrib(gl, positions, positionAttribLoc);

  const texCoords = [
    0., 0.,
    1., 0.,
    0., 1.,
    1., 1.
  ];
  bindVertexAttrib(gl, texCoords, texCoordAttribLoc);

  // uniform2f needs to come after program declaration
  // location needs to be attached to program
  // bind texture to read from
  // bind framebuffer to render to
  gl.useProgram(programGray);
  gl.bindTexture(gl.TEXTURE_2D, texture0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo1);
  let primitiveType = gl.TRIANGLE_STRIP, offset = 0, count = 4;
  gl.drawArrays(primitiveType, offset, count);

  gl.useProgram(programShow);
  gl.bindTexture(gl.TEXTURE_2D, texture1);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.drawArrays(primitiveType, offset, count);
};



document.addEventListener("DOMContentLoaded", () => {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = "http://localhost:8080/sample.jpg";
  image.onload = () => render(image);
});
