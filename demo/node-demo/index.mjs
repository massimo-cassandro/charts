/* eslint-disable no-console */
import { bars, pie, signalBars }  from '../../src/index.js';
import * as fs_promises from 'node:fs/promises';
import path from 'node:path';


import { createSvgCanvasNode } from './create-svg-canvas-node.mjs';

console.clear();

const testValues = {
  'Label 1': 120,
  'B': 20,
  'Label 3': 50,
  'Qualcosa': 95,
  'E': 144
};

// ridefinizione di createSvgCanvas in modo che sia utilizzata la versione per node
const base_cfg = {
  chartUtils: { createSvgCanvas: createSvgCanvasNode}
};
const output_path = new URL(import.meta.resolve('./demo-node-output')).pathname;

// svuota cartella output
try {
  await fs_promises.rm(output_path, { recursive: true, force: true });
  await fs_promises.mkdir(output_path, { recursive: true });
} catch (err) {
  console.error('Error clearing output folder:', err);
}


const pie_svg = pie({
  ...base_cfg,
  innerRadius: 30,
  radius: 50,
  values: Object.values(testValues)
});

try {
  await fs_promises.writeFile(path.join(output_path, 'pie.svg'), pie_svg);
} catch (err) {
  console.error(err);
}

// --------------------------------------------

const bar_svg = bars({
  ...base_cfg,
  width: 400,
  height: 350,
  values: Object.values(testValues),
  labels: Object.keys(testValues),
  showValues: true,
  showValuesAs: 'percent',
  barsStrokeWidth: 4,
  barsStrokeColor: '#333',
  // barsDirection: 'right', // default
  labelsFont: {
    family: 'Roboto Flex',
    size: 16,
    // stretch: 'normal',
    // style: 'normal',
    // variant: 'normal',
    weight: 800
  },
  valuesFont: {
    family: 'Roboto Flex',
    size: 14,
    // stretch: 'normal',
    style: 'italic',
    // variant: 'normal',
    // weight: 400
  },
});



try {
  await fs_promises.writeFile(path.join(output_path, 'bars.svg'), bar_svg);
} catch (err) {
  console.error(err);
}

// --------------------------------------------

const signal_bars_svg = signalBars({
  ...base_cfg,
  height: 150,
  width: 350,
  ranges: [1,2,3,4,5],
  labelFont: {
    family: 'Roboto Flex',
    size: 72,
    // stretch: 'normal',
    // style: 'italic',
    // variant: 'normal',
    weight: 700
  },
  labelFill: '#051b52',
  barsStrokeWidth: 4,
  barsStrokeColor: '#213c7f',
  barsOnFillColor: '#4765b076',
  barsOffFillColor: '#fff',
  value: 3.63,
  label: null,
  labelPosition: 'right',
});

try {
  await fs_promises.writeFile(path.join(output_path, 'signal-bars.svg'), signal_bars_svg);
} catch (err) {
  console.error(err);
}



// --------------------------------------------
// --------------------------------------------

console.log(' DONE ');
