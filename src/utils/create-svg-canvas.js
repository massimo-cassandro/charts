import { SVG } from '@svgdotjs/svg.js';


export function createSvgCanvas(container) {

  try {

    if(!container) {
      throw 'Missing container';
    }

    const svgCanvas = SVG().addTo(container);
    return svgCanvas;

  } catch(e) {
    console.error( 'Charts → createSvgCanvas', e ); // eslint-disable-line
  }

}
