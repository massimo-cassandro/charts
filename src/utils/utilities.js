const utils = {};

utils.truncateDecimal = (number, decimals = 4) => {
  return +parseFloat((number).toFixed(decimals));
};

utils.toRadians = degrees_angle => degrees_angle * Math.PI / 180.0;

// transform polar coordinates (center + radius) to cartesian ones (x, y)
utils.polarToCartesian = (degrees_angle, circleCenter, circleRadius) => {
  const radians = utils.toRadians(degrees_angle);

  return {
    x: utils.truncateDecimal(Math.abs(circleCenter.x + circleRadius * Math.cos(radians))),
    y: utils.truncateDecimal(Math.abs(circleCenter.y - circleRadius * Math.sin(radians)))
  };
};

utils.classnames = (...args) => {
  return args.filter(Boolean).join(' ');
};



export { utils };
