/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _simulation = __webpack_require__(1);
	
	var _simulation2 = _interopRequireDefault(_simulation);
	
	var _view = __webpack_require__(3);
	
	var _view2 = _interopRequireDefault(_view);
	
	var _webgl_util = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var render = function render(image) {
	  var canvas = document.getElementById("canvas");
	  canvas.width = image.width;
	  canvas.height = image.height;
	  var gl = canvas.getContext("webgl");
	  if (!gl) {
	    alert("You don't have WebGl enabled!");
	    return;
	  }
	  // resize(canvas);
	  var simulation = new _simulation2.default(gl, image);
	  var view = new _view2.default(simulation);
	  view.start();
	};
	
	document.addEventListener("DOMContentLoaded", function () {
	  var image = new Image();
	  image.crossOrigin = 'anonymous';
	  image.src = "http://localhost:8080/sample.jpg";
	  image.onload = function () {
	    return render(image);
	  };
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _webgl_util = __webpack_require__(2);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Simulation = function () {
	  function Simulation(gl, image) {
	    _classCallCheck(this, Simulation);
	
	    this.gl = gl;
	    this.width = image.width;
	    this.height = image.height;
	    this.GAMMA = 0.5;
	    this.DIFFUSE = 2;
	    this.setup(image);
	  }
	
	  _createClass(Simulation, [{
	    key: "setup",
	    value: function setup(image) {
	      var gl = this.gl,
	          width = this.width,
	          height = this.height;
	
	      gl.viewport(0, 0, width, height); //set clip space
	      gl.clearColor(0, 0, 0, 0); // clear canvas
	      gl.clear(gl.COLOR_BUFFER_BIT);
	
	      // grabbing shader source and attaching them to make program
	      var vShaderSource = document.getElementById("v-shader").text;
	      var fShaderSourceGray = document.getElementById("f-shader-gray").text;
	      var fShaderSourceShow = document.getElementById("f-shader-show").text;
	      var fShaderSourceStep = document.getElementById("f-shader-step").text;
	
	      var vShader = (0, _webgl_util.createShader)(gl, gl.VERTEX_SHADER, vShaderSource);
	      var fShaderGray = (0, _webgl_util.createShader)(gl, gl.FRAGMENT_SHADER, fShaderSourceGray);
	      var fShaderShow = (0, _webgl_util.createShader)(gl, gl.FRAGMENT_SHADER, fShaderSourceShow);
	      var fShaderStep = (0, _webgl_util.createShader)(gl, gl.FRAGMENT_SHADER, fShaderSourceStep);
	
	      var programGray = (0, _webgl_util.createProgram)(gl, vShader, fShaderGray);
	      var programShow = (0, _webgl_util.createProgram)(gl, vShader, fShaderShow);
	      var programStep = (0, _webgl_util.createProgram)(gl, vShader, fShaderStep);
	
	      // allow shaders to access variables
	      var positionAttribLoc = gl.getAttribLocation(programGray, "a_position");
	      var texCoordAttribLoc = gl.getAttribLocation(programGray, "a_texCoord");
	      var texSizeUniformLoc = gl.getUniformLocation(programStep, "u_textureSize");
	      var deltaTUniformLoc = gl.getUniformLocation(programStep, "u_deltaT");
	
	      // original image loaded into this texture
	      var texture0 = (0, _webgl_util.createTexture)(gl);
	      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // load image without flipping upside down
	      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	
	      var texture1 = (0, _webgl_util.createTexture)(gl);
	      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	
	      // create framebuffer to attach texture
	      var fbo0 = (0, _webgl_util.createFramebuffer)(gl, texture0);
	      var fbo1 = (0, _webgl_util.createFramebuffer)(gl, texture1);
	
	      // bind vertex attributes to position and texture coordinate bounds
	      var positions = [-1., -1., 1., -1., -1., 1., 1., 1.];
	      (0, _webgl_util.bindVertexAttrib)(gl, positions, positionAttribLoc);
	
	      var texCoords = [0., 0., 1., 0., 0., 1., 1., 1.];
	      (0, _webgl_util.bindVertexAttrib)(gl, texCoords, texCoordAttribLoc);
	
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
	  }, {
	    key: "draw",
	    value: function draw(delta) {
	      var gl = this.gl,
	          width = this.width,
	          height = this.height,
	          programStep = this.programStep,
	          programShow = this.programShow,
	          texture0 = this.texture0,
	          texture1 = this.texture1,
	          fbo0 = this.fbo0,
	          fbo1 = this.fbo1,
	          texSizeUniformLoc = this.texSizeUniformLoc,
	          deltaTUniformLoc = this.deltaTUniformLoc,
	          it = this.it;
	
	
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
	  }]);
	
	  return Simulation;
	}();
	
	exports.default = Simulation;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/*
	These utility functions are based on the content from
	https://webglfundamentals.org
	*/
	
	var createShader = exports.createShader = function createShader(gl, type, source) {
	  var shader = gl.createShader(type);
	  gl.shaderSource(shader, source);
	  gl.compileShader(shader);
	  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	  if (success) return shader;
	
	  console.log(gl.getShaderInfoLog(shader));
	  gl.deleteShader(shader);
	};
	
	var createProgram = exports.createProgram = function createProgram(gl, vertexShader, fragmentShader) {
	  var program = gl.createProgram();
	  gl.attachShader(program, vertexShader);
	  gl.attachShader(program, fragmentShader);
	  gl.linkProgram(program);
	  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
	  if (success) return program;
	
	  console.log(gl.getProgramInfoLog(program));
	  gl.deleteProgram(program);
	};
	
	var createTexture = exports.createTexture = function createTexture(gl) {
	  var texture = gl.createTexture();
	  gl.bindTexture(gl.TEXTURE_2D, texture);
	
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	
	  return texture;
	};
	
	var createFramebuffer = exports.createFramebuffer = function createFramebuffer(gl, texture) {
	  var fbo = gl.createFramebuffer();
	  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
	  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
	  return fbo;
	};
	
	var bindVertexAttrib = exports.bindVertexAttrib = function bindVertexAttrib(gl, data, attributeLocation) {
	  var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2;
	  var type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : gl.FLOAT;
	  var normalize = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
	  var stride = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
	  var offset = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
	
	  var buffer = gl.createBuffer();
	  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	
	  gl.enableVertexAttribArray(attributeLocation);
	  gl.vertexAttribPointer(attributeLocation, size, type, normalize, stride, offset);
	};
	
	var resize = exports.resize = function resize(canvas) {
	  // Lookup the size the browser is displaying the canvas.
	  var displayWidth = canvas.clientWidth;
	  var displayHeight = canvas.clientHeight;
	
	  // Check if the canvas is not the same size.
	  if (canvas.width != displayWidth || canvas.height != displayHeight) {
	
	    // Make the canvas the same size
	    canvas.width = displayWidth;
	    canvas.height = displayHeight;
	  }
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var View = function () {
	  function View(simulation) {
	    _classCallCheck(this, View);
	
	    this.simulation = simulation;
	  }
	
	  _createClass(View, [{
	    key: "start",
	    value: function start() {
	      this.lastTime = 0;
	      requestAnimationFrame(this.simulate.bind(this));
	    }
	  }, {
	    key: "simulate",
	    value: function simulate(time) {
	      var delta = time - this.lastTime;
	      this.simulation.draw(delta);
	      this.lastTime = time;
	      console.log(delta);
	      requestAnimationFrame(this.simulate.bind(this));
	    }
	  }]);
	
	  return View;
	}();
	
	exports.default = View;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map