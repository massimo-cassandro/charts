// radial bars

// TODO
//   - legend
//   - radial grid

import {calcAttrD} from './utilities.js';

export default function (options = {}) {

  const default_options = {
      container             : null, // container element
      gap                   : 5, // px
      strokeWidth           : 20, // px
      clockwise             : true,
      start                 : 'bottom', // bottom or top
      circleRadius          : null,  // if null is calculated from container width
      barClassName          : null,  // class for bars
      barStrokeLinecap      : null,  // bars stroke-linecap (round, butt, square)
      barFill               : null,
      labelClassName        : null,  // class for labels
      showBarsGuides        : false, // draws a circle under each bar
      barGuidesFill         : null,  // adds a fill attribute to the guides
      barGuidesStroke       : null,  // adds a stroke (and a stroke-width) attribute to the guides
      barGuidesClassName    : null,  // if set, stroke, fill and stroke-width attributes are not added to the guides
      data                  : [],
    },
    bars_data_defaults = {
      label                 : '_label_',
      value                 : 0,
      stroke                : null,
      barClassName          : null, // optional extra class for bar
      labelClassName        : null  // optional extra class for label
    },

    svg_namespace = 'http://www.w3.org/2000/svg',

    setAttrs = (node, attrs) => { // attrs = {key: value, ...}
      for(const key in attrs) {
        if(attrs[key]) {
          // node.setAttributeNS(svg_namespace, key, attrs[key]);
          node.setAttribute(key, attrs[key]);
        }
      }
    };

  options.data = (options.data?? []).map(item => { return {...bars_data_defaults, ...item}; });

  options = {...default_options, ...options};

  try {

    if(['top', 'bottom'].indexOf(options.start) === -1) {
      throw 'The `start` option must be `top` or `bottom`';
    }

    options.circleRadius??= parseInt(getComputedStyle(options.container).width) / 2;

    const chart = new DocumentFragment(),
      svg = document.createElementNS(svg_namespace, 'svg');

    svg.classList.add('radial-bars-chart');
    svg.style.setProperty('--stroke-width', options.strokeWidth + 'px');

    setAttrs(svg, {
      viewBox: [
        -options.strokeWidth / 2,
        -options.strokeWidth / 2,
        options.circleRadius * 2 + options.strokeWidth,
        options.circleRadius * 2 + options.strokeWidth
      ].join(' '),
      width   : options.circleRadius * 2,
      height  : options.circleRadius * 2
    });


    const start_angle = options.start === 'bottom'? 270 : 90,
      max_value = Math.max(...options.data.map(i => i.value)),
      center = {
        x: options.circleRadius,
        y: options.circleRadius
      };

    options.data.forEach((item, idx) => {

      const radius = options.circleRadius - (idx * (options.strokeWidth + options.gap));

      // guide
      if(options.showBarsGuides) {
        const guide = document.createElementNS(svg_namespace, 'circle');

        guide.dataset.idx = idx;

        setAttrs(guide, {
          cx    : center.x,
          cy    : center.y,
          r     : radius
        });

        if(options.barGuidesClassName) {
          guide.classList.add(options.barGuidesClassName);

        } else {

          setAttrs(guide, {
            fill              : options.barGuidesFill?? 'none',
            'stroke-width'    : options.strokeWidth,
            stroke            : options.barGuidesStroke
          });
        }

        svg.appendChild(guide);
      } // end if(options.showBarsGuides)

      // bar
      const bar = document.createElementNS(svg_namespace, 'path');
      bar.dataset.idx = idx;
      bar.classList.toggle(options.barClassName, !!options.barClassName);
      bar.classList.toggle(item.barClassName, !!item.barClassName);

      setAttrs(bar, {
        'stroke-width'    : options.strokeWidth,
        fill              : options.barFill?? 'none',
        'stroke-linecap'  : options.barStrokeLinecap,
        stroke            : item.stroke,
        d                 : calcAttrD({
          start_angle   : start_angle,
          percentage    : item.value / max_value,
          max_arc       : 270,
          center        : center,
          radius        : radius,
          clockwise     : options.clockwise
        })
      });

      svg.appendChild(bar);

      // label

      let text_align = 'start',
        text_margin = 20;

      if((options.start === 'top' && options.clockwise)
      || (options.start === 'bottom' && !options.clockwise)) {
        text_align = 'end';
        text_margin = -20;
      }

      const label = document.createElementNS(svg_namespace, 'text');
      label.classList.toggle(options.labelClassName, !!options.labelClassName);
      label.classList.toggle(item.labelClassName, !!item.labelClassName);
      setAttrs(label, {
        x    : options.circleRadius + text_margin,
        y    : options.start === 'top'? idx * (options.strokeWidth + options.gap) :
          options.circleRadius * 2 - idx * (options.strokeWidth + options.gap),
        'text-anchor' : text_align,
        'dominant-baseline': 'middle'
      });
      label.append(item.label);

      svg.appendChild(label);
    });

    chart.append(svg);
    options.container.innerHTML = '';
    options.container.appendChild(chart);
    

  } catch(e) { //throw error
    console.error( e ); // eslint-disable-line
  }
}
