export const styleToNumber = rule => {
  return parseFloat(rule.substring(0, rule.length - 2));
};
