/**
 *
//  * @property {element} container - chart wrapper
 * @property {number} gap - space between bars
 * @property {number} strokeWidth - bar stroke width
 * @property {boolean} clockwise - chart direction
 * @property {string} start- chart start (`top` or `bottom`)
 * @property {number} circleRadius - chart circke radius size, if null is calculated from container width
 * @property {string} barClassName - class for bars
 * @property {string} barStrokeLinecap - bars stroke-linecap (round, butt, square)
 * @property {string} barFill - bars fill value
 * @property {string} labelClassName - class for labels
 * @property {boolean} showBarsGuides - if true, draws a circle under each bar
 * @property {string} barGuidesFill - optional `fill` attribute value for the guides
 * @property {string} barGuidesStroke - optional `stroke` (it also adds `stroke-width`) attribute to the guides
 * @property {string} barGuidesClassName - optional guides className; if set, `stroke`, `fill` and `stroke-width` attributes are not added to the guides
 * @property {array} data - chart data, array of objects
 * @property {string} data.label - data description
 * @property {number} data.value - data value
 * @property {string} data.stroke - optional bar stroke property value
 * @property {string} data.barClassName - optional extra class for bar
 * @property {string} data.labelClassName - optional extra class for label

 * @author Massimo Cassandro
 */

import PropTypes from 'prop-types';
import React from 'react';
// import classnames from 'classnames';
// import styled from 'styled-components';
import radial_bars from '../../js/radial-bars';

function RadialBars(props) {
  const container = React.useRef(null);

  React.useEffect(() => {
    radial_bars({
      ...props, 
      container: container.current
    });
  }, [props]);

  return (<div ref={container}></div>);
}

// https://it.reactjs.org/docs/typechecking-with-proptypes.html

RadialBars.propTypes = {
  // container             : PropTypes.element.isRequired,
  gap                   : PropTypes.number,
  strokeWidth           : PropTypes.number,
  clockwise             : PropTypes.bool,
  start                 : PropTypes.string,
  circleRadius          : PropTypes.number,
  barClassName          : PropTypes.string,
  barStrokeLinecap      : PropTypes.oneOf(['round', 'butt', 'square']),
  barFill               : PropTypes.string,
  labelClassName        : PropTypes.string,
  showBarsGuides        : PropTypes.bool,
  barGuidesFill         : PropTypes.string,
  barGuidesStroke       : PropTypes.string,
  barGuidesClassName    : PropTypes.string,
  data                  : PropTypes.arrayOf(
    PropTypes.shape({
      label                 : PropTypes.string,
      value                 : PropTypes.number.isRequired,
      stroke                : PropTypes.string,
      barClassName          : PropTypes.string,
      labelClassName        : PropTypes.string
    })
  ).isRequired
};
RadialBars.defaultProps = {
  gap: 5,
  strokeWidth: 20,
  clockwise: true,
  start: 'bottom',
  showBarsGuides: false
};

export default RadialBars;
