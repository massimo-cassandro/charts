// transform polar coordinates (center + radius) to cartesian ones (x, y)
export function polarToCartesian(degrees_angle, center, radius) {
  let radians = degrees_angle * Math.PI / 180.0;
  return {
    x: Math.abs(center.x + radius * Math.cos(radians)),
    y: Math.abs(center.y - radius * Math.sin(radians))
  };

}

export function calcArcCoords(options) {
  // return the coordinates an arc `path` element
  // where start_angle is the starting point and percentage is the length % of the arc against max_angle

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
    start         : polarToCartesian(options.start_angle, options.center, options.radius),
    end           : polarToCartesian(end_angle, options.center, options.radius),
  };

}


export function calcAttrD(options) { // same options of calcArcCoords
  const points = calcArcCoords(options);

  return [
    `M${points.start.x},${points.start.y}`,
    `A${options.radius},${options.radius}`,
    0, //xAxisRotation,
    (points.arc_length <= 180 ? 0 : 1), // largeArcFlag
    options.clockwise && points.arc_length < 360? 1 : 0, // sweepFlag
    `${points.end.x},${points.end.y}`
  ].join(' ');
}
