import leftarrsvg from "../resources/svgs/left-arrow.svg";
import rightarrsvg from "../resources/svgs/right-arrow.svg";
import animator from "../util/animator.js";
import { genStyleSheet } from "../util/styles.js";
import * as Constants from "../util/constants.js";
import {
  styleToNumber,
  toggleHide,
  cyclicDecrement,
  cyclicIncrement
} from "../util/helper.js";

export default class Carousel {
  constructor(elem, number, props) {
    this.elem = elem;
    this.currentpage = 0;
    this.totalpages = number;
    this.engaged = false;
    this.pagesparent = null;
    this.pageRefs = [];
    this.pageOffIndex = 0;
    this.props = props;

    this.leftnav = this.leftnav.bind(this);
    this.rightnav = this.rightnav.bind(this);
    this.prevpage = this.prevpage.bind(this);
    this.nextpage = this.nextpage.bind(this);
    this.getfootermessage = this.getfootermessage.bind(this);
    this.postFooterMessage = this.postFooterMessage.bind(this);
    this.coregen = this.coregen.bind(this);
    this.divsgen = this.divsgen.bind(this);
    this.refsgen = this.refsgen.bind(this);
    this.setProps = this.setProps.bind(this);
    this.skate = this.skate.bind(this);
    this.skate_executor = this.skate_executor.bind(this);
    this.getcore = this.getcore.bind(this);
    this.getpageRefs = this.getpageRefs.bind(this);

    this.setProps();
  }

  skateLeft(steps = 1) {
    this.leftnav(steps);
  }

  skateRight(steps = 1) {
    this.rightnav(steps);
  }

  appendPage(count = 1) {
    this.insertPage(this.totalpages, count);
  }

  insertPage(index = 0, count = 1) {
    let htmlindex =
      index < this.currentpage
        ? this.totalpages - this.currentpage + 1 + index
        : index - this.currentpage + 1;

    let afterNode = null;

    if (htmlindex <= this.totalpages) {
      afterNode = this.x_carousel_div.querySelector(`:nth-child(${htmlindex})`);
    }

    let newdivs = [];

    if (afterNode) {
      for (let i = 0; i < count; ++i) {
        newdivs.push(
          this.x_carousel_div.insertBefore(
            this.divcontentnode("i", "inode"),
            afterNode
          )
        );
      }
    } else {
      for (let i = 0; i < count; ++i) {
        newdivs.push(
          this.x_carousel_div.append(this.divcontentnode("i", "inode"))
        );
      }
    }

    this.pageRefs.splice(index, 0, ...newdivs);
    this.totalpages += count;
  }

  //====================================================================================//

  getpageRefs() {
    return this.pageRefs;
  }

  getcore() {
    return this;
  }

  getfootermessage() {
    return `${this.currentpage + 1}/${this.totalpages}`;
  }

  prevpage() {
    this.currentpage = cyclicDecrement(this.currentpage, this.totalpages);
  }

  nextpage() {
    this.currentpage = cyclicIncrement(this.currentpage, this.totalpages);
  }

  postFooterMessage() {
    this.x_carousel_footer.innerHTML = "";
    this.x_carousel_footer.appendChild(
      document.createTextNode(this.getfootermessage())
    );
  }

  setProps() {
    if (this.props.hasOwnProperty("type")) {
      this.type = this.props.type;
    } else {
      this.type = this.props.type = Constants.TYPE_FULL_CAROUSEL;
    }

    if (!this.props.hasOwnProperty("width")) {
      this.props.width = "30%";
    }

    if (!this.props.hasOwnProperty("marginLeft")) {
      this.props.marginLeft = "2px";
    }

    if (!this.props.hasOwnProperty("marginRight")) {
      this.props.marginRight = "2px";
    }
  }

  leftnav(steps = 1) {
    switch (this.type) {
      case Constants.TYPE_FULL_CAROUSEL:
      case Constants.TYPE_SLIDER_CAROUSEL:
        if (!this.engaged) {
          this.skate_executor(
            Constants.LEFT_DIRECTION,
            0,
            steps,
            (Constants.SKATE_DURATION / steps) * 1.0
          );
        }
        break;
    }
  }

  rightnav(steps = 1) {
    switch (this.type) {
      case Constants.TYPE_FULL_CAROUSEL:
      case Constants.TYPE_SLIDER_CAROUSEL:
        if (!this.engaged) {
          this.skate_executor(
            Constants.RIGHT_DIRECTION,
            0,
            steps,
            (Constants.SKATE_DURATION / steps) * 1.0
          );
        }
        break;
    }
  }

  skate_executor(
    direction,
    step,
    steps = 1,
    duration = Constants.SKATE_DURATION
  ) {
    if (step === steps) return;
    this.engaged = true;

    if (direction === Constants.LEFT_DIRECTION) {
      this.tbrindex =
        (this.pageOffIndex - 1 + this.totalpages) % this.totalpages;
      let clone = this.pageRefs[this.tbrindex].cloneNode(true);
      this.tempclone = this.pagesparent.insertBefore(
        clone,
        this.pageRefs[this.pageOffIndex]
      );

      this.skate(this.tempclone, direction, step, steps, duration).then(() => {
        this.pagesparent.removeChild(this.pageRefs[this.tbrindex]);
        this.pageRefs[this.tbrindex] = this.tempclone;
        this.pageOffIndex = this.tbrindex;
        this.prevpage();
        this.postFooterMessage();

        if (step + 1 === steps) {
          this.engaged = false;
        } else {
          this.skate_executor(
            Constants.LEFT_DIRECTION,
            step + 1,
            steps,
            duration
          );
        }
      });
    } else if (direction === Constants.RIGHT_DIRECTION) {
      let clone = this.pageRefs[this.pageOffIndex].cloneNode(true);
      this.tempclone = this.pagesparent.appendChild(clone);

      this.skate(
        this.pageRefs[this.pageOffIndex],
        Constants.RIGHT_DIRECTION,
        step,
        steps,
        duration
      ).then(() => {
        this.pagesparent.removeChild(this.pageRefs[this.pageOffIndex]);
        this.pageRefs[this.pageOffIndex] = this.tempclone;
        this.pageRefs[this.pageOffIndex].marginLeft = `0px`;
        this.pageOffIndex = (this.pageOffIndex + 1) % this.totalpages;
        this.nextpage();
        this.postFooterMessage();

        if (step + 1 === steps) {
          this.engaged = false;
        } else {
          this.skate_executor(
            Constants.RIGHT_DIRECTION,
            step + 1,
            steps,
            duration
          );
        }
      });
    }
  }

  skate(node, direction, step, steps, duration = Constants.SKATE_DURATION) {
    let computedStyle = window.getComputedStyle(
      this.pageRefs[this.pageOffIndex]
    );
    const width = styleToNumber(computedStyle.width);
    const marginLeft = styleToNumber(computedStyle.marginLeft);
    const marginRight = styleToNumber(computedStyle.marginRight);

    let ivalue = null;
    let fvalue = null;

    if (direction === Constants.RIGHT_DIRECTION) {
      fvalue = -(width + marginRight);
      ivalue = marginLeft;
    } else if (direction === Constants.LEFT_DIRECTION) {
      ivalue = -(width + marginRight);
      fvalue = marginLeft;
    }

    return new Promise((resolve, reject) => {
      new animator(
        ivalue,
        fvalue,
        duration,
        value => {
          node.style.marginLeft = `${value}px`;
        },
        value => {
          node.style.marginLeft = `${value}px`;
          resolve();
        },
        step + 1 === steps ? animator.EASEOUTEXPO : animator.EASEOUTLINEAR
      ).start();
    });
  }

  divcontentnode(index, type = "normal") {
    let node = document.createElement("div");
    node.classList.add("x-carousel-div-content");
    node.classList.add("verticalbox");
    node.classList.add("jacc");
    node.innerHTML = `<div class="pagelabel">
            <span>${type === "normal" ? index + 1 : index}</span>
        </div>`;
    return node;
  }

  divcontent(index) {
    return `
    <div class="x-carousel-div-content verticalbox jacc" >
        <div class="pagelabel">
          <span>${index + 1}</span>
        </div>
    </div>
`;
  }

  divsgen() {
    let html = ``;
    [...Array(this.totalpages).keys()].forEach(index => {
      html += this.divcontent(index);
    });
    return html;
  }

  coregen() {
    return `
        <div class="x-carousel block fullheight">
          
          <div class="x-carousel-nav x-carousel-leftnav verticalbox jacc fullheight">
            <img class="x-carousel-leftarr" src=${leftarrsvg} width="30" height="30" />
          </div>

          <div class="x-carousel-div block fullheight horizontalbox jasc">
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
    this.x_carousel_div = this.x_carousel.querySelector(".x-carousel-div");
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

    this.x_carousel_leftnav.addEventListener("click", () => {
      this.leftnav(1);
    });
    this.x_carousel_rightnav.addEventListener("click", () => {
      this.rightnav(1);
    });
    this.x_carousel_leftnav.addEventListener("mouseenter", event => {
      toggleHide(this.x_carousel_leftarr);
    });
    this.x_carousel_rightnav.addEventListener("mouseenter", event => {
      toggleHide(this.x_carousel_rightarr);
    });
    this.x_carousel_leftnav.addEventListener("mouseleave", event => {
      toggleHide(this.x_carousel_leftarr);
    });
    this.x_carousel_rightnav.addEventListener("mouseleave", event => {
      toggleHide(this.x_carousel_rightarr);
    });

    toggleHide(this.x_carousel_leftarr);
    toggleHide(this.x_carousel_rightarr);
  }

  init() {
    this.elem.innerHTML = this.coregen();
    this.refsgen();
    genStyleSheet(this.props);
  }
}

Carousel.getConstants = () => {
  return Constants;
};
