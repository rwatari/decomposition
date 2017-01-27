class View {
  constructor(simulation) {
    this.simulation = simulation;
  }

  start() {
    this.lastTime = 0;
    requestAnimationFrame(this.simulate.bind(this));
  }

  simulate(time) {
    const delta = time - this.lastTime;
    this.simulation.step(delta);
    this.simulation.draw();
    this.lastTime = time;
    requestAnimationFrame(this.simulate.bind(this));
  }
}

export default View;
