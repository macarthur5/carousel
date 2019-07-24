import "./scss/normalize.scss";
import "./scss/rootstyler.scss";
import "./scss/styles.scss";
import Carousel from "./lib/carousel.js";

const elements = document.querySelectorAll(".x-carousel-placeholder");
elements.forEach(elem => {
  new Carousel(elem, ["div1", "div2", "div3", "div4", "div5"]).init();
});
