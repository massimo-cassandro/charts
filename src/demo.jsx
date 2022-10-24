import {RadialBars} from './lib/index';

import './demo.css';

function Demo() {
  return (<>
    <h1>Charts</h1>

    <div className='charts-wrapper'>
      <div>
        <RadialBars {...{
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
        }} />
      </div>
    </div>

    <svg xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* https://patterns.helloyes.dev/pattern/3/ */}
        <pattern id="pattern" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="#ccc" />
          <path d="M-1,1 l4,-4 M0,8 l8,-8 M6,10 l4,-4" stroke="#800" />
        </pattern>
      </defs>
    </svg>
  </>);
}

export default Demo;
