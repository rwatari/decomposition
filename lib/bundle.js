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
	
	var _simulation_js = __webpack_require__(3);
	
	var _simulation_js2 = _interopRequireDefault(_simulation_js);
	
	var _view = __webpack_require__(4);
	
	var _view2 = _interopRequireDefault(_view);
	
	var _webgl_util = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var simulation = void 0,
	    view = void 0;
	
	var renderWebGL = function renderWebGL(image, canvas) {
	  var gl = canvas.getContext("webgl");
	  if (!gl) {
	    alert("You don't have WebGl enabled!");
	    return;
	  }
	
	  var simulation = new _simulation2.default(gl, image);
	  var view = new _view2.default(simulation);
	
	  var startButton = document.getElementById("start");
	  startButton.addEventListener("click", function () {
	    view.toggle(startButton);
	  });
	};
	
	var renderJS = function renderJS(image, canvas) {
	  var ctx = canvas.getContext("2d");
	  ctx.drawImage(image, 0, 0);
	
	  var simulationJS = new _simulation_js2.default(ctx, canvas.width, canvas.height);
	  var viewJS = new _view2.default(simulationJS);
	
	  var startButton = document.getElementById("start");
	  startButton.addEventListener("click", function () {
	    viewJS.toggle(startButton);
	  });
	};
	
	document.addEventListener("DOMContentLoaded", function () {
	  var image = new Image();
	  image.crossOrigin = 'anonymous';
	  image.src = "https://res.cloudinary.com/dpgudhebt/image/upload/c_crop,h_1080,w_1920/v1484899897/magic-cube-cube-puzzle-play-54101_kaeq1l.jpg";
	  image.onload = function () {
	    var canvas = document.getElementById("canvas");
	
	    canvas.width = image.width;
	    canvas.height = image.height;
	
	    renderWebGL(image, canvas);
	
	    var modal = document.getElementById("modal");
	    var modalVisible = true;
	    window.addEventListener("click", function (event) {
	      if (modalVisible && event.target === modal) {
	        modal.style.display = "none";
	      } else {
	        modal.style.display = "flex";
	      }
	      modalVisible = !modalVisible;
	    });
	
	    var switchButton = document.getElementById("switch");
	    var webGLSim = true;
	    switchButton.addEventListener("click", function () {
	      // resetting the context by creating a new canvas
	      var newCanvas = canvas.cloneNode(false);
	      canvas.parentNode.replaceChild(newCanvas, canvas);
	      canvas = newCanvas;
	
	      if (webGLSim) {
	        renderJS(image, canvas);
	        switchButton.innerHTML = "Switch to WebGL";
	      } else {
	        renderWebGL(image, canvas);
	        switchButton.innerHTML = "Switch to JavaScript";
	      }
	
	      webGLSim = !webGLSim;
	    });
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
	      gl.flush();
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
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var SimulationJS = function () {
	  function SimulationJS(ctx, width, height) {
	    _classCallCheck(this, SimulationJS);
	
	    this.ctx = ctx;
	    this.imageData = ctx.getImageData(0, 0, width, height);
	    this.width = width;
	    this.height = height;
	    this.data = this.getGrayScaleData();
	    this.buffer = new Uint8ClampedArray(width * height * 4);
	    this.GAMMA = 0.5;
	    this.DIFFUSE = 2;
	  }
	
	  _createClass(SimulationJS, [{
	    key: "getGrayScaleData",
	    value: function getGrayScaleData() {
	      var data = this.imageData.data;
	      var grayScaleData = [];
	
	      for (var i = 0; i < data.length; i += 4) {
	        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
	        grayScaleData.push((avg - 128) / 256);
	      }
	
	      return grayScaleData;
	    }
	  }, {
	    key: "draw",
	    value: function draw() {
	      var height = this.height,
	          width = this.width,
	          buffer = this.buffer,
	          data = this.data,
	          imageData = this.imageData,
	          ctx = this.ctx;
	
	      for (var row = 0; row < height; row++) {
	        for (var col = 0; col < width; col++) {
	          var i = row * width + col;
	          var bufferIdx = i * 4;
	          var pixelData = data[i] * 256 + 128;
	          buffer[bufferIdx] = pixelData;
	          buffer[bufferIdx + 1] = pixelData;
	          buffer[bufferIdx + 2] = pixelData;
	          buffer[bufferIdx + 3] = 255;
	        }
	      }
	
	      imageData.data.set(buffer);
	
	      ctx.putImageData(imageData, 0, 0);
	    }
	  }, {
	    key: "step",
	    value: function step() {
	      var height = this.height,
	          width = this.width,
	          data = this.data,
	          GAMMA = this.GAMMA,
	          DIFFUSE = this.DIFFUSE,
	          laplacian = this.laplacian;
	
	      var delta = 20;
	      var lapl = laplacian.call(this, data);
	      var chemPot = data.map(function (conc, i) {
	        return Math.pow(conc, 3) - conc - GAMMA * lapl[i];
	      });
	
	      //Add console log to see maximum value of chemical potential
	      console.log(Math.min.apply(Math, _toConsumableArray(chemPot)));
	      var diff = laplacian.call(this, chemPot);
	
	      var newData = data.map(function (conc, i) {
	        return conc + DIFFUSE * diff[i] * delta / 1000;
	      });
	
	      this.data = newData;
	    }
	  }, {
	    key: "laplacian",
	    value: function laplacian(data) {
	      var height = this.height,
	          width = this.width;
	
	      var len = data.length;
	      var lapl = new Array(len);
	
	      for (var row = 0; row < height; row++) {
	        for (var col = 0; col < width; col++) {
	          var i = row * width + col;
	          var n = row === 0 ? i - width + len : i - width;
	          var w = col === 0 ? i - 1 + width : i - 1;
	          var e = col === width - 1 ? i + 1 - width : i + 1;
	          var s = row === height - 1 ? i + width - len : i + width;
	
	          lapl[i] = data[n] + data[w] + data[e] + data[s] - 4 * data[i];
	        }
	      }
	      return lapl;
	    }
	  }]);
	
	  return SimulationJS;
	}();
	
	exports.default = SimulationJS;

/***/ },
/* 4 */
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
	    this.run = false;
	  }
	
	  _createClass(View, [{
	    key: "toggle",
	    value: function toggle(startButton) {
	      if (this.run) {
	        this.run = false;
	        startButton.innerHTML = "Start";
	      } else {
	        this.run = true;
	        startButton.innerHTML = "Stop";
	        this.start();
	      }
	    }
	  }, {
	    key: "start",
	    value: function start() {
	      this.lastTime = 0;
	      requestAnimationFrame(this.simulate.bind(this));
	    }
	  }, {
	    key: "simulate",
	    value: function simulate(time) {
	      if (!this.run) return;
	      var delta = time - this.lastTime;
	      this.simulation.draw(delta);
	      this.lastTime = time;
	      this.updateFPS(delta);
	      requestAnimationFrame(this.simulate.bind(this));
	    }
	  }, {
	    key: "updateFPS",
	    value: function updateFPS(delta) {
	      document.getElementById("fps").innerHTML = Math.round(1000 / delta);
	    }
	  }]);
	
	  return View;
	}();
	
	exports.default = View;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map