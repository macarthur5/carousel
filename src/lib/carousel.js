import leftarrsvg from "../resources/svgs/left-arrow.svg";
import rightarrsvg from "../resources/svgs/right-arrow.svg";
import animator from "../util/animator.js";
import * as Constants from "../util/constants.js";
import { genStyleSheet } from "../util/styles.js";

export default class Carousel {
  constructor(elem, titles, props) {
    this.elem = elem;
    this.titles = titles;
    this.currentpage = 0;
    this.totalpages = titles.length;
    this.engaged = false;
    this.pagesparent = null;
    this.pageRefs = [];
    this.page1pos = 0;
    this.pageOffIndex = 0;
    this.props = props;
    this.type = this.props.type;

    this.leftnav = this.leftnav.bind(this);
    this.rightnav = this.rightnav.bind(this);
    this.prevpage = this.prevpage.bind(this);
    this.nextpage = this.nextpage.bind(this);
    this.slide = this.slide.bind(this);
    this.collapse = this.collapse.bind(this);
    this.grow = this.grow.bind(this);
    this.toggleHide = this.toggleHide.bind(this);
    this.plugPage1ToStart = this.plugPage1ToStart.bind(this);
    this.plugPage1ToEnd = this.plugPage1ToEnd.bind(this);
    this.getfootermessage = this.getfootermessage.bind(this);
    this.postFooterMessage = this.postFooterMessage.bind(this);
    this.coregen = this.coregen.bind(this);
    this.divsgen = this.divsgen.bind(this);
    this.refsgen = this.refsgen.bind(this);
  }

  getfootermessage() {
    return `${this.currentpage + 1}/${this.totalpages}`;
  }

  collapse(elem) {
    elem.classList.toggle("gone", true);
  }

  grow(elem) {
    elem.classList.toggle("gone", false);
  }

  toggleHide(elem) {
    elem.classList.toggle("hide");
  }

  prevpage() {
    this.currentpage = (--this.currentpage + this.totalpages) % this.totalpages;
  }

  nextpage() {
    this.currentpage = (++this.currentpage + this.totalpages) % this.totalpages;
  }

  leftnav() {
    switch (this.type) {
      case Constants.TYPE_FULL_CAROUSEL:
        if (!this.engaged) {
          if (this.currentpage === 1 && this.page1pos === this.totalpages - 1) {
            this.plugPage1ToStart();
          } else if (this.currentpage === 0 && this.page1pos === 0) {
            this.plugPage1ToEnd();
          }
          this.toBeCollapsed = this.pageRefs[this.currentpage];
          this.prevpage();
          this.toBeGrown = this.pageRefs[this.currentpage];
          this.grow(this.toBeGrown);
          this.grow(this.toBeCollapsed);
          this.slide();
        }
        break;
      case Constants.TYPE_SLIDER_CAROUSEL:
        console.log("not doing anything right now");
        break;
    }
  }

  rightnav() {
    switch (this.type) {
      case Constants.TYPE_FULL_CAROUSEL:
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
          this.grow(this.toBeGrown);
          this.grow(this.toBeCollapsed);

          this.slide();
        }
        break;
      case Constants.TYPE_SLIDER_CAROUSEL:
        this.pageRefs[this.pageOffIndex] = this.pagesparent.removeChild(
          this.pageRefs[this.pageOffIndex]
        );
        this.pageRefs[this.pageOffIndex] = this.pagesparent.appendChild(
          this.pageRefs[this.pageOffIndex]
        );
        this.pageOffIndex = (this.pageOffIndex + 1) % this.totalpages;
        break;
    }
  }

  postFooterMessage() {
    this.x_carousel_footer.innerHTML = "";
    this.x_carousel_footer.appendChild(
      document.createTextNode(this.getfootermessage())
    );
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

        this.collapse(this.toBeCollapsed);
        this.engaged = false;
        this.postFooterMessage();
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

  divsgen() {
    let html = ``;
    this.titles.forEach((title, index) => {
      html += `
        <div class="x-carousel-div-content x-carousel-div-content-${index} verticalbox jacc" >
            <div class="pagelabel">
              <span>${index + 1}</span>
            </div>
        </div>
    `;
    });
    return html;
  }

  coregen() {
    return `
        <div class="x-carousel block fullheight">
          
          <div class="x-carousel-nav x-carousel-leftnav verticalbox jacc fullheight">
            <img class="x-carousel-leftarr" src=${leftarrsvg} width="30" height="30" />
          </div>

          <div class="x-carousel-div fullheight horizontalbox jasc">
            ${this.divsgen()}
          </div>

          <div class="x-carousel-nav x-carousel-rightnav verticalbox jacc fullheight">
            <img class="x-carousel-rightarr" src=${rightarrsvg} width="30" height="30" />
          </div>

          <div class="x-carousel-footer block horizontalbox jacs justlargerfont">
            <span>${this.getfootermessage()}</span>
          </div>

        </div>
    `;
  }

  refsgen() {
    this.pagesparent = this.elem.querySelector(`.x-carousel-div`);
    let pages = this.elem.getElementsByClassName(`x-carousel-div-content`);
    for (let i = 0; i < pages.length; ++i) {
      this.pageRefs.push(pages[i]);
    }
    this.x_carousel = this.elem.querySelector(".x-carousel");
    this.x_carousel_footer = this.x_carousel.querySelector(
      `.x-carousel-footer`
    );

    this.x_carousel_leftnav = this.x_carousel.querySelector(
      `.x-carousel-leftnav`
    );
    this.x_carousel_rightnav = this.x_carousel.querySelector(
      `.x-carousel-rightnav`
    );

    this.x_carousel_leftarr = this.x_carousel.querySelector(
      `.x-carousel-leftarr`
    );
    this.x_carousel_rightarr = this.x_carousel.querySelector(
      `.x-carousel-rightarr`
    );

    this.x_carousel_leftnav.addEventListener("click", this.leftnav);
    this.x_carousel_rightnav.addEventListener("click", this.rightnav);
    this.x_carousel_leftnav.addEventListener("mouseenter", event => {
      this.toggleHide(this.x_carousel_leftarr);
    });
    this.x_carousel_rightnav.addEventListener("mouseenter", event => {
      this.toggleHide(this.x_carousel_rightarr);
    });
    this.x_carousel_leftnav.addEventListener("mouseleave", event => {
      this.toggleHide(this.x_carousel_leftarr);
    });
    this.x_carousel_rightnav.addEventListener("mouseleave", event => {
      this.toggleHide(this.x_carousel_rightarr);
    });

    this.toggleHide(this.x_carousel_leftarr);
    this.toggleHide(this.x_carousel_rightarr);
  }

  init() {
    this.elem.innerHTML = this.coregen();
    this.refsgen();
    genStyleSheet(this.props);
  }
}
