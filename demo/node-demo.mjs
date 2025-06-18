/* eslint-disable no-console */
import { mChart } from '../src/index-node.mjs';
import * as fs_promises from 'node:fs/promises';
import path from 'node:path';

const mc = new mChart();

const testValues = {
  'Label 1': 120,
  'B': 20,
  'Label 3': 50,
  'Qualcosa': 95,
  'E': 144
};

const output_path = new URL(import.meta.resolve('./demo-ouput')).pathname;

const pie = mc.pie({innerRadius: 30, radius: 50, values: Object.values(testValues)});

try {
  await fs_promises.writeFile(path.join(output_path, 'pie.svg'), pie);
} catch (err) {
  console.error(err);
}


const bars = mc.bars({
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
  await fs_promises.writeFile(path.join(output_path, 'bars.svg'), bars);
} catch (err) {
  console.error(err);
}
