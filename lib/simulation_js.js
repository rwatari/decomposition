class SimulationJS {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.imageData = ctx.getImageData(0, 0, width, height);
    this.width = width;
    this.height = height;
    this.data = this.getGrayScaleData();
    this.buffer = new Uint8ClampedArray(width * height * 4);
    this.GAMMA = 0.5;
    this.DIFFUSE = 2;
  }

  getGrayScaleData() {
    const data = this.imageData.data;
    const grayScaleData = [];

    for (let i = 0; i < data.length; i += 4) {
      let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      grayScaleData.push((avg - 128) / 256);
    }

    return grayScaleData;
  }

  draw() {
    const { height, width, buffer, data, imageData, ctx } = this;
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        let i = row * width + col;
        let bufferIdx = i * 4;
        let pixelData = data[i] * 256 + 128;
        buffer[bufferIdx] = pixelData;
        buffer[bufferIdx + 1] = pixelData;
        buffer[bufferIdx + 2] = pixelData;
        buffer[bufferIdx + 3] = 255;
      }
    }

    imageData.data.set(buffer);

    ctx.putImageData(imageData, 0, 0);
  }

  step() {
    const { height, width, data, GAMMA, DIFFUSE, laplacian } = this;
    const delta = 20;
    const lapl = laplacian.call(this, data);
    const chemPot = data.map((conc, i) => (
      Math.pow(conc, 3)- conc - GAMMA * lapl[i]
    ));

    //Add console log to see maximum value of chemical potential
    console.log(Math.min(...chemPot));
    const diff = laplacian.call(this, chemPot);

    const newData = data.map((conc, i) => (
      conc + (DIFFUSE * diff[i] * delta / 1000)
    ));

    this.data = newData;
  }

  laplacian(data) {
    const { height, width } = this;
    const len = data.length;
    const lapl = new Array(len);

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        let i = row * width + col;
        let n = (row === 0) ? (i - width + len) : (i - width);
        let w = (col === 0) ? (i - 1 + width) : (i - 1);
        let e = (col === width - 1) ? (i + 1 - width) : (i + 1);
        let s = (row === height - 1) ? (i + width - len) : (i + width);

        lapl[i] = (
          data[n]
          + data[w]
          + data[e]
          + data[s]
          - 4 * data[i]
        );
      }
    }
    return lapl;
  }

}

export default SimulationJS;
