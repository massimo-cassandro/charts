import { bars, pie, signalBars } from './charts-demo.js';

const base_cfg = {};

const testValues = {
  'Label 1': 120,
  'B': 20,
  'Label 3': 50,
  'Qualcosa': 95,
  'E': 144
};

pie({...base_cfg, container: '#pie', radius: 50, values: Object.values(testValues)});
pie({...base_cfg, container: '#donut', innerRadius: 20, radius: 50, values: Object.values(testValues)});


const barsOpts = {
  ...base_cfg,
  values: Object.values(testValues),
  labels: Object.keys(testValues),
  showValues: true,
  barsStrokeWidth: 4,
  barsStrokeColor: '#333',
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
};
bars({
  ...barsOpts,
  container: '#bars',
  height: 250,
  showValuesAs: 'percent',
  // barsDirection: 'right', // default

});
bars({
  ...barsOpts,
  container: '#bars-to-left',
  height: 'auto',
  showValuesAs: 'euro',
  barsDirection: 'left',
});

const signalBarsOpts = {
  ...base_cfg,
  height: 250,
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
  barsOnAttr: {
    fill: '#4664af',
    opacity: 0.5,
    stroke: '#213c7f'
  },
  barsOffAttr: {
    fill: '#fff',
    stroke: '#213c7f'
  }
};
signalBars({
  ...signalBarsOpts,
  container: '#signalBars1',
  height: 150,
  value: 3.63,
  label: null,
  labelPosition: 'right',
});
signalBars({
  ...signalBarsOpts,
  // height: 150,
  container: '#signalBars2',
  value: 3.33,
  // maxBarWidth: 40,
  barsRelativeCornerRadius: .5,
  label: ''
});
signalBars({
  ...signalBarsOpts,
  container: '#signalBars3',
  // value: 2.83,
  label: 'Tra 1 e 2',
  labelPosition: 'bottom',
  maxBarWidth: 40,
  barsStrokeWidth: 0,
  barsOnAttr: {
    fill: '#0c811c',
  },
  barsOffAttr: {
    fill: '#c00',
  },
  activeBars: 1,
  svgClassName: 'test-class'
});


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
