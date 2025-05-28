import { SVG } from '@svgdotjs/svg.js';


export function createSvgCanvas(container) {

  const svgCanvas = SVG().addTo(container);
  return svgCanvas;
}
