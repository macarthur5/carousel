export default class animator {
  constructor(ivalue, fvalue, duration, cb, endcb) {
    this.ivalue = ivalue;
    this.fvalue = fvalue;
    this.duration = duration;
    this.cb = cb;
    this.endcb = endcb;
    this.animate = this.animate.bind(this);
  }

  start() {
    this.cvalue = this.ivalue;
    this.startTime = Date.now();
    this.animate();
  }

  animate() {
    const t_elapsed = (Date.now() - this.startTime) / 1000.0;
    this.cvalue =
      this.ivalue + ((this.fvalue - this.ivalue) * t_elapsed) / this.duration;

    if (t_elapsed < this.duration) {
      window.requestAnimationFrame(this.animate);
      this.cb(this.cvalue);
    } else {
      this.endcb(this.fvalue);
    }
  }
}
