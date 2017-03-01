import {
  createShader,
  createProgram,
  createTexture,
  resize
} from './webgl_util';

class Simulation {
  constructor(gl, image, canvas) {
    this.gl = gl;
    this.width = image.width;
    this.height = image.height;
    this.GAMMA = 0.5;
    this.DIFFUSE = 2;


  }

  setup(image) {

  }

  draw() {
    const { gl, step, show, T1, T2, FBO1, FBO2, it } = this;
    gl.useProgram(step);
    gl.uniform2f(resolutionUniformLocationStep, image.width, image.height);
    if (it > 0) {
      gl.bindTexture(gl.TEXTURE_2D, T1);
      gl.bindFramebuffer(gl.FRAMEBUFFER, FBO2);
    } else {
      gl.bindTexture(gl.TEXTURE_2D, T2);
      gl.bindFramebuffer(gl.FRAMEBUFFER, FBO1);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.useProgram(show);
    gl.uniform2f(resolutionUniformLocationShow, image.width, image.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this.it = -it;
  }
}

export default Simulation;
