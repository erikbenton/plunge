const isDefined = (property) => {
  return typeof property !== "undefined" && property !== null;
};

module.exports = {
  isDefined
};