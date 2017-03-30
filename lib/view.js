class View {
  constructor(simulation) {
    this.simulation = simulation;
    this.run = false;
  }

  toggle(startButton) {
    if (this.run) {
      this.run = false;
      startButton.innerHTML = "Start";
    } else {
      this.run = true;
      startButton.innerHTML = "Stop";
      this.start();
    }
  }

  start() {
    this.lastTime = 0;
    requestAnimationFrame(this.simulate.bind(this));
  }

  simulate(time) {
    if (!this.run) return;
    const delta = time - this.lastTime;
    this.simulation.draw(delta);
    this.lastTime = time;
    this.updateFPS(delta);
    requestAnimationFrame(this.simulate.bind(this));
  }

  updateFPS(delta) {
    document.getElementById("fps").innerHTML = Math.round(1000/delta);
  }
}

export default View;
