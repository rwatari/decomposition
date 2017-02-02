/*
These utility functions are based on the content from
https://webglfundamentals.org
*/

export const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(source, shader);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) return shader;

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
};
