/* globals SVG */

export function createSvgCanvasExternalSVGjs(container) {

  const svgCanvas = SVG().addTo(container);
  return svgCanvas;
}
