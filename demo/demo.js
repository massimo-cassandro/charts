import { mChart } from '../src/index-external-svgjs.js';
// import { labels_icons } from './labels-icons.js';

const mc = new mChart;

const testValues = {
  'Label 1': 120,
  'B': 20,
  'Label 3': 50,
  'Qualcosa': 95,
  'E': 144
};

mc.pie({container: '#pie', radius: 50, values: Object.values(testValues)});
mc.pie({container: '#donut', innerRadius: 20, radius: 50, values: Object.values(testValues)});

mc.bars({
  container: '#bars',
  height: 250,
  values: Object.values(testValues),
  labels: Object.keys(testValues),
  showValues: true,
  showValuesAs: 'percent',
  barsStrokeWidth: 4,
  barsStrokeColor: '#333',
  // barsDirection: 'right', // default
  // textBarsGap: 8,
  // barsGap: 10,
  // barsHeight: 40,
  // barsCornerRadius: 5,
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
    weight: 400
  },
});


mc.bars({
  container: '#bars-to-left',
  height: 'auto',
  values: Object.values(testValues),
  labels: Object.keys(testValues),
  showValues: true,
  showValuesAs: 'euro',
  barsStrokeWidth: 4,
  barsStrokeColor: '#333',
  barsDirection: 'left',
  labelsFont: {
    family: 'Roboto',
    size: 16,
    // stretch: 'normal',
    // style: 'normal',
    // variant: 'normal',
    weight: 700
  },
  valuesFont: {
    family: 'Roboto',
    size: 14,
    // stretch: 'normal',
    style: 'italic',
    // variant: 'normal',
    weight: 400
  },
});

/*
mc.bars({
  container: '#bars-w-icons',
  height: 250,
  values: Object.values(testValues),
  labels: Object.values(labels_icons),
  labelsAreIcons: true,
  showValues: true,
  showValuesAs: 'numbers',
  showValuesFractionDigits: 0,
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
    weight: 400
  },
});
 */


// import {radialBars} from '../src/esm/index.js';

// (() => {
//   radialBars({
//     container   : document.getElementById('radial-bars-demo'),
//     svgClassName: 'radial-bar-demo-svg-class',
//     gap         : 15,
//     strokeWidth : 30, // px
//     clockwise   : true,
//     start       : 'bottom',
//     barClassName: 'radial-bar-demo',
//     showBarsGuides: true,
//     barGuidesClassName: 'radial-bar-demo-guide',
//     labelClassName: 'radial-bar-demo-label',
//     data: [
//       {
//         label: 'set 1',
//         value: 250,
//         stroke: 'green'
//       },
//       {
//         label: 'set 2',
//         value: 120,
//         stroke: 'purple'
//       },
//       {
//         label: 'set 3',
//         value: 90,
//         barClassName: 'radial-bar-demo-pattern',
//       }
//     ]
//   });

// })();
