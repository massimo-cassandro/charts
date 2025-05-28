import { createSVGWindow } from 'svgdom';
import { SVG, registerWindow } from '@svgdotjs/svg.js';


// https://svgjs.dev/docs/3.2/getting-started/
// https://github.com/svgdotjs/svgdom#readme


export function createSvgCanvasNode() {

  // returns a window with a document and an svg root node
  const window = createSVGWindow();
  const document = window.document;

  // register window and document
  registerWindow(window, document);

  // create svgCanvas
  const svgCanvas = SVG(document.documentElement);

  return svgCanvas;
}
