import {
  createShader,
  createProgram,
  createTexture,
  createFramebuffer,
  bindVertexAttrib
} from './webgl_util';

class Simulation {
  constructor(gl, image) {
    this.gl = gl;
    this.width = image.width;
    this.height = image.height;
    this.GAMMA = 0.5;
    this.DIFFUSE = 2;
    this.setup(image);
  }

  setup(image) {
    const { gl, width, height } = this;
    gl.viewport(0, 0, width, height); //set clip space
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
    const deltaTUniformLoc = gl.getUniformLocation(programStep, "u_deltaT");

    // original image loaded into this texture
    const texture0 = createTexture(gl);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // load image without flipping upside down
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    const texture1 = createTexture(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

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
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.useProgram(programShow);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    this.programShow = programShow;
    this.programStep = programStep;
    this.texture0 = texture0;
    this.texture1 = texture1;
    this.fbo0 = fbo0;
    this.fbo1 = fbo1;
    this.texSizeUniformLoc = texSizeUniformLoc;
    this.deltaTUniformLoc = deltaTUniformLoc;
    this.it = -1;
  }

  draw(delta) {
    const {
      gl,
      width, height,
      programStep, programShow,
      texture0, texture1,
      fbo0, fbo1,
      texSizeUniformLoc, deltaTUniformLoc,
      it
    } = this;

    gl.useProgram(programStep);
    gl.uniform2f(texSizeUniformLoc, width, height);
    gl.uniform1f(deltaTUniformLoc, delta);
    if (it > 0) {
      gl.bindTexture(gl.TEXTURE_2D, texture0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo1);
    } else {
      gl.bindTexture(gl.TEXTURE_2D, texture1);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo0);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.useProgram(programShow);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this.it = -it;
  }
}

export default Simulation;
