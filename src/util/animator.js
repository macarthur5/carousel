export default class animator {
  constructor(
    ivalue,
    fvalue,
    duration,
    cb,
    endcb,
    interplorator = animator.EASEOUTLINEAR
  ) {
    this.ivalue = ivalue;
    this.fvalue = fvalue;
    this.duration = duration;
    this.cb = cb;
    this.endcb = endcb;
    this.interplorator = interplorator;
    this.animate = this.animate.bind(this);
  }

  start() {
    this.cvalue = this.ivalue;
    this.startTime = Date.now();
    this.animate();
  }

  easeOutQuad(t, b, c, d) {
    /*
      t = current time
      b = start value
      c = change in value
      d = duration
    */
    t /= d;
    return -c * t * (t - 2) + b;
  }

  easeOutExpo(t, b, c, d) {
    return c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
  }

  easeOutLinear(t, b, c, d) {
    return b + (c * t) / d;
  }

  animate() {
    const t_elapsed = (Date.now() - this.startTime) / 1000.0;

    this.cvalue = this[this.interplorator](
      t_elapsed,
      this.ivalue,
      this.fvalue - this.ivalue,
      this.duration
    );

    if (t_elapsed < this.duration) {
      window.requestAnimationFrame(this.animate);
      this.cb(this.cvalue);
    } else {
      this.endcb(this.fvalue);
    }
  }
}

animator.EASEOUTEXPO = `easeOutExpo`;
animator.EASEOUTQUAD = `easeOutQuad`;
animator.EASEOUTLINEAR = `easeOutLinear`;
