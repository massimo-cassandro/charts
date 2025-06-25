/* globals SVG */

export function createSvgCanvasGlobalSVGjs(container) {

  try {

    if(!container) {
      throw 'Missing container';
    }

    const svgCanvas = SVG().addTo(container);
    return svgCanvas;

  } catch(e) {
    console.error( 'Charts → createSvgCanvasGlobalSVGjs', e ); // eslint-disable-line
  }

}
