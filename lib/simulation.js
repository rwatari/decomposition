class Simulation {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.imageData = ctx.getImageData(0, 0, width, height);
    this.width = width;
    this.height = height;
    this.data = this.getGrayScaleData();
    this.buffer = new Uint8ClampedArray(width * height * 4);
  }

  getGrayScaleData() {
    const data = this.imageData.data;
    const grayScaleData = [];

    for (let i = 0; i < data.length; i += 4) {
      let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      grayScaleData.push(avg);
    }

    return grayScaleData;
  }

  draw() {
    const { height, width, buffer, data, imageData, ctx } = this;
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        let i = row * width + col;
        let bufferIdx = i * 4;
        let pixelData = data[i];
        buffer[bufferIdx] = pixelData;
        buffer[bufferIdx + 1] = pixelData;
        buffer[bufferIdx + 2] = pixelData;
        buffer[bufferIdx + 3] = 255;
      }
    }

    imageData.data.set(buffer);

    ctx.putImageData(imageData, 0, 0);
  }

  step(delta) {

  }

}

export default Simulation;
