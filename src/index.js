import { pie } from './charts/pie.js';
import { bars } from './charts/bars.js';
import { default_cfg } from './utils/config-default.js';
import { utils } from './utils/utilities.js';
import { createSvgCanvas } from './utils/create-svg-canvas.js';

export class mChart {

  /**
   * L'oggetto config permette di riconfigurare i valori di default
   * impostando, ad esempio, dei nuovi colori base per tutta l'istanza di mChart
   *
   * @param {*} config
   */
  constructor(config = {}) {

    this.config = { ...default_cfg, ...config };

  }

}

// mChart.prototype.fontsReady = await document.fonts.ready;

mChart.prototype.utils = utils;
mChart.prototype.createSvgCanvas = createSvgCanvas;
mChart.prototype.pie = pie;
mChart.prototype.bars = bars;
