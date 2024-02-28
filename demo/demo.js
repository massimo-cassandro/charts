import {radialBars} from '../src/esm/index.js';

(() => {
  radialBars({
    container   : document.getElementById('radial-bars-demo'),
    svgClassName: 'radial-bar-demo-svg-class',
    gap         : 15,
    strokeWidth : 30, // px
    clockwise   : true,
    start       : 'bottom',
    barClassName: 'radial-bar-demo',
    showBarsGuides: true,
    barGuidesClassName: 'radial-bar-demo-guide',
    labelClassName: 'radial-bar-demo-label',
    data: [
      {
        label: 'set 1',
        value: 250,
        stroke: 'green'
      },
      {
        label: 'set 2',
        value: 120,
        stroke: 'purple'
      },
      {
        label: 'set 3',
        value: 90,
        barClassName: 'radial-bar-demo-pattern',
      }
    ]
  });

})();
