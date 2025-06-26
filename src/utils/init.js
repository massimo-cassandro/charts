import { utils } from './utilities.js';
import { default_colors } from './default-chart-colors.js';
import { createSvgCanvas } from './create-svg-canvas.js';

export function chart_init(customUtils = {}) {

  const chartUtils = {
    ...customUtils,
    ...utils
  };

  chartUtils.defaults = {

    ...(customUtils.defaults?? {}),

    ...{
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
    }
  };

  chartUtils.createSvgCanvas = customUtils.createSvgCanvas?? createSvgCanvas;


  // DA' PROBLEMI CON WEBPACK
  // switch (svgjs_mode) {
  //   case 'node':
  //     utils.createSvgCanvas = await import('./create-svg-canvas-node.mjs')
  //       .then(module => module.createSvgCanvasNode);
  //     break;

  //   case 'global':
  //     utils.createSvgCanvas = await import('./create-svg-canvas-global-svgjs.js')
  //       .then(module => module.createSvgCanvasGlobalSVGjs);
  //     break;

  //   default:
  //     utils.createSvgCanvas = await import('./create-svg-canvas.js')
  //       .then(module => module.createSvgCanvas);
  // }

  return  chartUtils;
}
