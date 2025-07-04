// raccolta di utilità
// vengono ampliate da init.js e condivise in ogni grafico


const chartUtils = {};

chartUtils.truncateDecimal = (number, decimals = 4) => {
  return +parseFloat((number).toFixed(decimals));
};

chartUtils.toRadians = degrees_angle => (degrees_angle * Math.PI) / 180.0;
// chartUtils.toDeg = radians_angle => (radians_angle * 180.0 ) / Math.PI;

// transform polar coordinates (center + radius) to cartesian ones (x, y)
chartUtils.polarToCartesian = (degrees_angle, circleCenter, circleRadius) => {
  const radians = chartUtils.toRadians(degrees_angle);

  return {
    x: chartUtils.truncateDecimal(Math.abs(circleCenter.x + circleRadius * Math.cos(radians))),
    y: chartUtils.truncateDecimal(Math.abs(circleCenter.y - circleRadius * Math.sin(radians)))
  };
};

chartUtils.classnames = (...args) => {
  return args.filter(Boolean).join(' ');
};



// return the coordinates an arc `path` element
// where start_angle is the starting point and percentage is the length % of the arc against max_angle
chartUtils.calcArcCoords = (options) => {

  const default_options = {
    start_angle   : 0,
    percentage    : null,
    max_arc       : 360,
    center        : {x: null, y: null},
    radius        : null,
    clockwise     : true
  };

  options = {...default_options, ...options};

  try {

    if(options.percentage == null
      || options.center?.x == null
      || options.center?.y == null
      || options.start_angle == null
      || options.radius == null
      || options.max_arc == null
    ) {
      throw '`calcArcCoords` parameters error';
    }

  } catch(e) { //throw error
    console.error( e ); // eslint-disable-line
  }

  // arc angle corresponding to the given percentage
  let arc_length = options.max_arc * options.percentage,
    end_angle = options.start_angle + (options.clockwise? - arc_length : arc_length);

  if(options.percentage === 1) {
    end_angle -= .001; // to avoid rounding error
  }

  return {
    arc_length    : arc_length,
    start         : chartUtils.polarToCartesian(options.start_angle, options.center, options.radius),
    end           : chartUtils.polarToCartesian(end_angle, options.center, options.radius),
  };

};


chartUtils.calcAttrD = (options) => { // same options of calcArcCoords
  const points = chartUtils.calcArcCoords(options);

  return [
    `M${points.start.x},${points.start.y}`,
    `A${options.radius},${options.radius}`,
    0, //xAxisRotation,
    (points.arc_length <= 180 ? 0 : 1), // largeArcFlag
    options.clockwise && points.arc_length < 360? 1 : 0, // sweepFlag
    `${points.end.x},${points.end.y}`
  ].join(' ');
};


chartUtils.getElementFromContainer = container => {
  let containerElement = null;

  if(container) {
    if(typeof container === 'string') {
      containerElement = document.querySelector(container);

    } else if (container instanceof Element) {
      containerElement = container;
    }
  }


  return containerElement;
};


export { chartUtils };

