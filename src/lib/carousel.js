import leftarrsvg from "../resources/svgs/left-arrow.svg";
import rightarrsvg from "../resources/svgs/right-arrow.svg";

export default class carousel {
  constructor(elem, titles) {
    this.elem = elem;
    this.titles = titles;
  }

  getleftnavimage() {
    return `
      <img src=${leftarrsvg} width="30" height="30" />
    `;
  }

  getrightnavimage() {
    return `
      <img src=${rightarrsvg} width="30" height="30" />
    `;
  }

  add_divs() {
    this.titles.forEach((title, index) => {
      const x_carousel_div_content = document.createElement("div");
      x_carousel_div_content.classList.add(`x-carousel-div-content`);
      x_carousel_div_content.classList.add(`x-carousel-div-content-${index}`);
      x_carousel_div_content.setAttribute["data-title"] = title;
      x_carousel_div_content.classList.add(index === 0 ? `full` : `collapsed`);
      x_carousel_div_content.classList.add(`fullheight`);
      this.x_carousel.querySelector(`.x-carousel-div`).appendChild(x_carousel_div_content);
    });
  }

  init() {
    let x_carousel = document.createElement(`div`);
    x_carousel.classList.add(`x-carousel`);
    x_carousel.classList.add(`block`);
    x_carousel.classList.add(`horizontalbox`);
    x_carousel.classList.add(`jass`);
    x_carousel.classList.add(`fullheight`);

    let x_carousel_leftnav = document.createElement(`div`);
    x_carousel_leftnav.classList.add(`x-carousel-nav`);
    x_carousel_leftnav.classList.add(`x-carousel-leftnav`);
    x_carousel_leftnav.classList.add(`verticalbox`);
    x_carousel_leftnav.classList.add(`jacc`);
    x_carousel_leftnav.classList.add(`fullheight`);
    x_carousel_leftnav.innerHTML += this.getleftnavimage();

    let x_carousel_div = document.createElement(`div`);
    x_carousel_div.classList.add(`x-carousel-div`);
    x_carousel_div.classList.add(`fullheight`);
    x_carousel_div.classList.add(`horizontalbox`);
    x_carousel_div.classList.add(`jasbc`);
    x_carousel_div.classList.add(`flexgrowval1`);

    let x_carousel_rightnav = document.createElement(`div`);
    x_carousel_rightnav.classList.add(`x-carousel-nav`);
    x_carousel_rightnav.classList.add(`x-carousel-rightnav`);
    x_carousel_rightnav.classList.add(`verticalbox`);
    x_carousel_rightnav.classList.add(`jacc`);
    x_carousel_rightnav.classList.add(`fullheight`);
    x_carousel_rightnav.innerHTML += this.getrightnavimage();

    x_carousel.appendChild(x_carousel_leftnav);
    x_carousel.appendChild(x_carousel_div);
    x_carousel.appendChild(x_carousel_rightnav);

    this.x_carousel = this.elem.appendChild(x_carousel);
    this.add_divs();
  }
}
