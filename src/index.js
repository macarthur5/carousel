import "./scss/normalize.scss";
import "./scss/rootstyler.scss";
import "./scss/styles.scss";
import Carousel from "./lib/carousel.js";

let carousel_ready = new CustomEvent("carousel_ready", {
  detail: { Carousel: Carousel }
});
window.dispatchEvent(carousel_ready);
