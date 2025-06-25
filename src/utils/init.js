import { utils } from './utilities.js';
import { default_colors } from './default-chart-colors.js';


export async function chart_init(svgjs_mode) {

  /** modalita caricamento svg.js */
  svgjs_mode??= 'esm'; // esm | node | global


  utils.defaults = {

    colors: Object.values(default_colors),

    // i valori commentati sono quelli di default
    // se non vanno modificati è inutile impostarli
    fonts: {
      // family: 'sans-serif',
      // size: 14,
      // stretch: 'normal',
      // style: 'normal',
      // variant: 'normal',
      // weight: 400
    }
  };

  switch (svgjs_mode) {
    case 'node':
      utils.createSvgCanvas = await import('./create-svg-canvas-node.mjs')
        .then(module => module.createSvgCanvasNode);
      break;

    case 'global':
      utils.createSvgCanvas = await import('./create-svg-canvas-global-svgjs.js')
        .then(module => module.createSvgCanvasGlobalSVGjs);
      break;

    default:
      utils.createSvgCanvas = await import('./create-svg-canvas.js')
        .then(module => module.createSvgCanvas);
  }

  return  utils;
}
