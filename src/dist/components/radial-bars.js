"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _propTypes = _interopRequireDefault(require("prop-types"));
var _react = _interopRequireDefault(require("react"));
var _radialBars = _interopRequireDefault(require("../../js/radial-bars"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
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

// import classnames from 'classnames';
// import styled from 'styled-components';

function RadialBars(props) {
  const container = _react.default.useRef(null);
  _react.default.useEffect(() => {
    (0, _radialBars.default)({
      ...props,
      container: container.current
    });
  }, [props]);
  return /*#__PURE__*/_react.default.createElement("div", {
    ref: container
  });
}

// https://it.reactjs.org/docs/typechecking-with-proptypes.html

RadialBars.propTypes = {
  // container             : PropTypes.element.isRequired,
  gap: _propTypes.default.number,
  strokeWidth: _propTypes.default.number,
  clockwise: _propTypes.default.bool,
  start: _propTypes.default.string,
  circleRadius: _propTypes.default.number,
  barClassName: _propTypes.default.string,
  barStrokeLinecap: _propTypes.default.oneOf(['round', 'butt', 'square']),
  barFill: _propTypes.default.string,
  labelClassName: _propTypes.default.string,
  showBarsGuides: _propTypes.default.bool,
  barGuidesFill: _propTypes.default.string,
  barGuidesStroke: _propTypes.default.string,
  barGuidesClassName: _propTypes.default.string,
  data: _propTypes.default.arrayOf(_propTypes.default.shape({
    label: _propTypes.default.string,
    value: _propTypes.default.number.isRequired,
    stroke: _propTypes.default.string,
    barClassName: _propTypes.default.string,
    labelClassName: _propTypes.default.string
  })).isRequired
};
RadialBars.defaultProps = {
  gap: 5,
  strokeWidth: 20,
  clockwise: true,
  start: 'bottom',
  showBarsGuides: false
};
var _default = RadialBars;
exports.default = _default;