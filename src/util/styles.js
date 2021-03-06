import * as constants from "../util/constants.js";

const insertRule = (style, rule) => {
  style.innerHTML += rule;
};

export function genStyleSheet(props) {
  let style = document.createElement("style");
  style.appendChild(document.createTextNode(""));

  let carouselType = props.type;
  switch (carouselType) {
    case constants.TYPE_FULL_CAROUSEL:
      insertRule(
        style,
        `
            .x-carousel-div-content{
                width : 100%;
                height: 100%;
            }
        `
      );
      break;
    case constants.TYPE_SLIDER_CAROUSEL:
      insertRule(
        style,
        `
            .x-carousel-div-content{
                width : ${props.width};
                height: 96%;
                margin-left: ${props.marginLeft};
                margin-right: ${props.marginRight};
            }
        `
      );
      insertRule(
        style,
        `
            .x-carousel-footer{
                display:none;
            }
        `
      );
      break;
  }
  document.head.appendChild(style);
}