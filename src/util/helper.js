export const styleToNumber = rule => {
  return parseFloat(rule.substring(0, rule.length - 2));
};

export const collapse = elem => {
  elem.classList.toggle("gone", true);
};

export const grow = elem => {
  elem.classList.toggle("gone", false);
};

export const toggleHide = elem => {
  elem.classList.toggle("hide");
};

export const cyclicDecrement = (num, den) => {
  return (--num + den) % den;
};

export const cyclicIncrement = (num, den) => {
  return (++num + den) % den;
};
