/* globals SVG */

export function createSvgCanvasExternalSVGjs(container) {

  try {

    if(!container) {
      throw 'Missing container';
    }

    const svgCanvas = SVG().addTo(container);
    return svgCanvas;

  } catch(e) {
    console.error( 'Charts → createSvgCanvasExternalSVGjs', e ); // eslint-disable-line
  }

}
