import leftarrsvg from "../resources/svgs/left-arrow.svg";
import rightarrsvg from "../resources/svgs/right-arrow.svg";
import animator from "../util/animator.js";

export default class carousel {
  constructor(elem, titles) {
    this.elem = elem;
    this.titles = titles;
    this.currentpage = 0;
    this.totalpages = titles.length;
    this.engaged = false;
    this.pagesparent = null;
    this.pageRefs = [];
    this.page1pos = 0;

    this.leftnav = this.leftnav.bind(this);
    this.rightnav = this.rightnav.bind(this);
    this.prevpage = this.prevpage.bind(this);
    this.nextpage = this.nextpage.bind(this);
    this.slide = this.slide.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
    this.plugPage1ToStart = this.plugPage1ToStart.bind(this);
    this.plugPage1ToEnd = this.plugPage1ToEnd.bind(this);
  }

  hide(elem) {
    elem.style.display = "none";
  }

  show(elem) {
    elem.style.display = "flex";
  }

  prevpage() {
    this.currentpage = (--this.currentpage + this.totalpages) % this.totalpages;
  }

  nextpage() {
    this.currentpage = (++this.currentpage + this.totalpages) % this.totalpages;
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

  leftnav() {
    if (!this.engaged) {
      if (this.currentpage === 1 && this.page1pos === this.totalpages - 1) {
        this.plugPage1ToStart();
      } else if (this.currentpage === 0 && this.page1pos === 0) {
        this.plugPage1ToEnd();
      }
      this.toBeCollapsed = this.pageRefs[this.currentpage];
      this.prevpage();
      this.toBeGrown = this.pageRefs[this.currentpage];
      this.show(this.toBeGrown);
      this.show(this.toBeCollapsed);
      this.slide();
    }
  }

  rightnav() {
    if (!this.engaged) {
      if (this.currentpage === 0 && this.page1pos === this.totalpages - 1) {
        this.plugPage1ToStart();
      } else if (
        this.currentpage === this.totalpages - 1 &&
        this.page1pos === 0
      ) {
        this.plugPage1ToEnd();
      }

      this.toBeCollapsed = this.pageRefs[this.currentpage];
      this.nextpage();
      this.toBeGrown = this.pageRefs[this.currentpage];
      this.show(this.toBeGrown);
      this.show(this.toBeCollapsed);

      this.slide();
    }
  }

  slide() {
    this.engaged = true;
    new animator(
      0,
      100,
      0.3,
      value => {
        const ivalstr = `${value.toString()}%`;
        const dvalstr = `${(100 - value).toString()}%`;

        this.toBeGrown.style.width = ivalstr;
        this.toBeCollapsed.style.width = dvalstr;
      },
      value => {
        this.toBeGrown.style.width = `${Math.floor(value).toString()}%`;
        this.toBeCollapsed.style.width = `${(
          100 - Math.floor(value)
        ).toString()}%`;

        this.hide(this.toBeCollapsed);
        this.engaged = false;
      }
    ).start();
  }

  plugPage1ToStart() {
    if (this.page1pos !== 0) {
      this.pageRefs[0] = this.pagesparent.removeChild(this.pageRefs[0]);
      this.pageRefs[0] = this.pagesparent.insertBefore(
        this.pageRefs[0],
        this.pageRefs[1]
      );
      this.page1pos = 0;
    }
  }

  plugPage1ToEnd() {
    if (this.page1pos + 1 !== this.totalpages) {
      this.pageRefs[0] = this.pagesparent.removeChild(this.pageRefs[0]);
      this.pageRefs[0] = this.pagesparent.appendChild(this.pageRefs[0]);
      this.page1pos = this.totalpages - 1;
    }
  }

  add_divs() {
    this.titles.forEach((title, index) => {
      const x_carousel_div_content = document.createElement("div");
      x_carousel_div_content.classList.add(`x-carousel-div-content`);
      x_carousel_div_content.classList.add(`x-carousel-div-content-${index}`);
      x_carousel_div_content.setAttribute["data-title"] = title;
      x_carousel_div_content.classList.add(index === 0 ? `full` : `collapsed`);
      x_carousel_div_content.classList.add(`fullheight`);
      x_carousel_div_content.classList.add(`verticalbox`);
      x_carousel_div_content.classList.add(`jacc`);

      let pagelabel = document.createElement("div");
      pagelabel.classList.add(`pagelabel`);
      let pagetitle = document.createTextNode(`${index}`);
      pagelabel.appendChild(pagetitle);
      x_carousel_div_content.appendChild(pagelabel);

      if (index !== 0) this.hide(x_carousel_div_content);

      this.pageRefs.push(x_carousel_div_content);

      this.x_carousel
        .querySelector(`.x-carousel-div`)
        .appendChild(x_carousel_div_content);
    });
  }

  init() {
    let x_carousel = document.createElement(`div`);
    x_carousel.classList.add(`x-carousel`);
    x_carousel.classList.add(`block`);
    x_carousel.classList.add(`fullheight`);

    let x_carousel_leftnav = document.createElement(`div`);
    x_carousel_leftnav.classList.add(`x-carousel-nav`);
    x_carousel_leftnav.classList.add(`x-carousel-leftnav`);
    x_carousel_leftnav.classList.add(`verticalbox`);
    x_carousel_leftnav.classList.add(`jacc`);
    x_carousel_leftnav.classList.add(`fullheight`);
    x_carousel_leftnav.addEventListener("click", this.leftnav);
    x_carousel_leftnav.innerHTML += this.getleftnavimage();

    let x_carousel_div = document.createElement(`div`);
    x_carousel_div.classList.add(`x-carousel-div`);
    x_carousel_div.classList.add(`fullheight`);
    x_carousel_div.classList.add(`horizontalbox`);
    x_carousel_div.classList.add(`jasbc`);
    x_carousel_div.classList.add(`flexgrowval1`);
    this.pagesparent = x_carousel_div;

    let x_carousel_rightnav = document.createElement(`div`);
    x_carousel_rightnav.classList.add(`x-carousel-nav`);
    x_carousel_rightnav.classList.add(`x-carousel-rightnav`);
    x_carousel_rightnav.classList.add(`fullheight`);
    x_carousel_rightnav.classList.add(`verticalbox`);
    x_carousel_rightnav.classList.add(`jacc`);
    x_carousel_rightnav.addEventListener("click", this.rightnav);
    x_carousel_rightnav.innerHTML += this.getrightnavimage();

    x_carousel.appendChild(x_carousel_leftnav);
    x_carousel.appendChild(x_carousel_div);
    x_carousel.appendChild(x_carousel_rightnav);

    this.x_carousel = this.elem.appendChild(x_carousel);
    this.add_divs();
  }
}
