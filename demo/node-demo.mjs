/* eslint-disable no-console */
import { mChart } from '../src/index-node.mjs';

const mc = new mChart();

const pie = mc.pie({innerRadius: 40, radius: 50, values: [120, 20, 50]});

console.log(pie);
