import "./scss/normalize.scss";
import "./scss/rootstyler.scss";
import "./scss/styles.scss";
import Carousel from "./lib/carousel.js";
import * as Constants from "../src/util/constants.js";

let carousel_ready = new CustomEvent("carousel_ready", {
  detail: { Carousel: Carousel, Constants: Constants }
});
window.dispatchEvent(carousel_ready);
