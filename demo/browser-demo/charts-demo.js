// raccolta di utilità
// vengono ampliate da init.js e condivise in ogni grafico


const chartUtils = {};

chartUtils.truncateDecimal = (number, decimals = 4) => {
  return +parseFloat((number).toFixed(decimals));
};

chartUtils.toRadians = degrees_angle => (degrees_angle * Math.PI) / 180.0;
chartUtils.toDeg = radians_angle => (radians_angle * 180.0 ) / Math.PI;

// transform polar coordinates (center + radius) to cartesian ones (x, y)
chartUtils.polarToCartesian = (degrees_angle, circleCenter, circleRadius) => {
  const radians = chartUtils.toRadians(degrees_angle);

  return {
    x: chartUtils.truncateDecimal(Math.abs(circleCenter.x + circleRadius * Math.cos(radians))),
    y: chartUtils.truncateDecimal(Math.abs(circleCenter.y - circleRadius * Math.sin(radians)))
  };
};

chartUtils.classnames = (...args) => {
  return args.filter(Boolean).join(' ');
};



// return the coordinates an arc `path` element
// where start_angle is the starting point and percentage is the length % of the arc against max_angle
chartUtils.calcArcCoords = (options) => {

  const default_options = {
    start_angle   : 0,
    percentage    : null,
    max_arc       : 360,
    center        : {x: null, y: null},
    radius        : null,
    clockwise     : true
  };

  options = {...default_options, ...options};

  try {

    if(options.percentage == null
      || options.center?.x == null
      || options.center?.y == null
      || options.start_angle == null
      || options.radius == null
      || options.max_arc == null
    ) {
      throw '`calcArcCoords` parameters error';
    }

  } catch(e) { //throw error
    console.error( e ); // eslint-disable-line
  }

  // arc angle corresponding to the given percentage
  let arc_length = options.max_arc * options.percentage,
    end_angle = options.start_angle + (options.clockwise? - arc_length : arc_length);

  if(options.percentage === 1) {
    end_angle -= .001; // to avoid rounding error
  }

  return {
    arc_length    : arc_length,
    start         : chartUtils.polarToCartesian(options.start_angle, options.center, options.radius),
    end           : chartUtils.polarToCartesian(end_angle, options.center, options.radius),
  };

};


chartUtils.calcAttrD = (options) => { // same options of calcArcCoords
  const points = chartUtils.calcArcCoords(options);

  return [
    `M${points.start.x},${points.start.y}`,
    `A${options.radius},${options.radius}`,
    0, //xAxisRotation,
    (points.arc_length <= 180 ? 0 : 1), // largeArcFlag
    options.clockwise && points.arc_length < 360? 1 : 0, // sweepFlag
    `${points.end.x},${points.end.y}`
  ].join(' ');
};


chartUtils.getElementFromContainer = container => {
  let containerElement = null;

  if(container) {
    if(typeof container === 'string') {
      containerElement = document.querySelector(container);

    } else if (container instanceof Element) {
      containerElement = container;
    }
  }


  return containerElement;
};

// Documento generato da `default-chart-colors.css`.
// Non editare

const default_colors = {
  azzurro: '#2387e2',
  rosaScuro: '#fc1484',
  giallo: '#f5a623',
  verdeAcqua: '#6dbebf',
  lavanda: '#9894fd',
  carminio: '#af373e',
  verdeElettrico: '#54f25a',
  verdeBlu: '#167bac',
  acqua: '#00e6fb',
  bluElettrico: '#0b16e9',
  oliva: '#9dbf6d',
  violaElettrico: '#c614fc',
  lime: '#d9f440',
  rosaChiaro: '#fea4f2',
};

const methods$1 = {};
const names = [];

function registerMethods(name, m) {
  if (Array.isArray(name)) {
    for (const _name of name) {
      registerMethods(_name, m);
    }
    return
  }

  if (typeof name === 'object') {
    for (const _name in name) {
      registerMethods(_name, name[_name]);
    }
    return
  }

  addMethodNames(Object.getOwnPropertyNames(m));
  methods$1[name] = Object.assign(methods$1[name] || {}, m);
}

function getMethodsFor(name) {
  return methods$1[name] || {}
}

function getMethodNames() {
  return [...new Set(names)]
}

function addMethodNames(_names) {
  names.push(..._names);
}

// Map function
function map(array, block) {
  let i;
  const il = array.length;
  const result = [];

  for (i = 0; i < il; i++) {
    result.push(block(array[i]));
  }

  return result
}

// Filter function
function filter(array, block) {
  let i;
  const il = array.length;
  const result = [];

  for (i = 0; i < il; i++) {
    if (block(array[i])) {
      result.push(array[i]);
    }
  }

  return result
}

// Degrees to radians
function radians(d) {
  return ((d % 360) * Math.PI) / 180
}

// Convert camel cased string to dash separated
function unCamelCase(s) {
  return s.replace(/([A-Z])/g, function (m, g) {
    return '-' + g.toLowerCase()
  })
}

// Capitalize first letter of a string
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Calculate proportional width and height values when necessary
function proportionalSize(element, width, height, box) {
  if (width == null || height == null) {
    box = box || element.bbox();

    if (width == null) {
      width = (box.width / box.height) * height;
    } else if (height == null) {
      height = (box.height / box.width) * width;
    }
  }

  return {
    width: width,
    height: height
  }
}

/**
 * This function adds support for string origins.
 * It searches for an origin in o.origin o.ox and o.originX.
 * This way, origin: {x: 'center', y: 50} can be passed as well as ox: 'center', oy: 50
 **/
function getOrigin(o, element) {
  const origin = o.origin;
  // First check if origin is in ox or originX
  let ox = o.ox != null ? o.ox : o.originX != null ? o.originX : 'center';
  let oy = o.oy != null ? o.oy : o.originY != null ? o.originY : 'center';

  // Then check if origin was used and overwrite in that case
  if (origin != null) {
[ox, oy] = Array.isArray(origin)
      ? origin
      : typeof origin === 'object'
        ? [origin.x, origin.y]
        : [origin, origin];
  }

  // Make sure to only call bbox when actually needed
  const condX = typeof ox === 'string';
  const condY = typeof oy === 'string';
  if (condX || condY) {
    const { height, width, x, y } = element.bbox();

    // And only overwrite if string was passed for this specific axis
    if (condX) {
      ox = ox.includes('left')
        ? x
        : ox.includes('right')
          ? x + width
          : x + width / 2;
    }

    if (condY) {
      oy = oy.includes('top')
        ? y
        : oy.includes('bottom')
          ? y + height
          : y + height / 2;
    }
  }

  // Return the origin as it is if it wasn't a string
  return [ox, oy]
}

const descriptiveElements = new Set(['desc', 'metadata', 'title']);
const isDescriptive = (element) =>
  descriptiveElements.has(element.nodeName);

const writeDataToDom = (element, data, defaults = {}) => {
  const cloned = { ...data };

  for (const key in cloned) {
    if (cloned[key].valueOf() === defaults[key]) {
      delete cloned[key];
    }
  }

  if (Object.keys(cloned).length) {
    element.node.setAttribute('data-svgjs', JSON.stringify(cloned)); // see #428
  } else {
    element.node.removeAttribute('data-svgjs');
    element.node.removeAttribute('svgjs:data');
  }
};

// Default namespaces
const svg = 'http://www.w3.org/2000/svg';
const html = 'http://www.w3.org/1999/xhtml';
const xmlns = 'http://www.w3.org/2000/xmlns/';
const xlink = 'http://www.w3.org/1999/xlink';

const globals = {
  window: typeof window === 'undefined' ? null : window,
  document: typeof document === 'undefined' ? null : document
};

function getWindow() {
  return globals.window
}

class Base {
  // constructor (node/*, {extensions = []} */) {
  //   // this.tags = []
  //   //
  //   // for (let extension of extensions) {
  //   //   extension.setup.call(this, node)
  //   //   this.tags.push(extension.name)
  //   // }
  // }
}

const elements = {};
const root = '___SYMBOL___ROOT___';

// Method for element creation
function create(name, ns = svg) {
  // create element
  return globals.document.createElementNS(ns, name)
}

function makeInstance(element, isHTML = false) {
  if (element instanceof Base) return element

  if (typeof element === 'object') {
    return adopter(element)
  }

  if (element == null) {
    return new elements[root]()
  }

  if (typeof element === 'string' && element.charAt(0) !== '<') {
    return adopter(globals.document.querySelector(element))
  }

  // Make sure, that HTML elements are created with the correct namespace
  const wrapper = isHTML ? globals.document.createElement('div') : create('svg');
  wrapper.innerHTML = element;

  // We can use firstChild here because we know,
  // that the first char is < and thus an element
  element = adopter(wrapper.firstChild);

  // make sure, that element doesn't have its wrapper attached
  wrapper.removeChild(wrapper.firstChild);
  return element
}

function nodeOrNew(name, node) {
  return node &&
    (node instanceof globals.window.Node ||
      (node.ownerDocument &&
        node instanceof node.ownerDocument.defaultView.Node))
    ? node
    : create(name)
}

// Adopt existing svg elements
function adopt(node) {
  // check for presence of node
  if (!node) return null

  // make sure a node isn't already adopted
  if (node.instance instanceof Base) return node.instance

  if (node.nodeName === '#document-fragment') {
    return new elements.Fragment(node)
  }

  // initialize variables
  let className = capitalize(node.nodeName || 'Dom');

  // Make sure that gradients are adopted correctly
  if (className === 'LinearGradient' || className === 'RadialGradient') {
    className = 'Gradient';

    // Fallback to Dom if element is not known
  } else if (!elements[className]) {
    className = 'Dom';
  }

  return new elements[className](node)
}

let adopter = adopt;

function register(element, name = element.name, asRoot = false) {
  elements[name] = element;
  if (asRoot) elements[root] = element;

  addMethodNames(Object.getOwnPropertyNames(element.prototype));

  return element
}

function getClass(name) {
  return elements[name]
}

// Element id sequence
let did = 1000;

// Get next named element id
function eid(name) {
  return 'Svgjs' + capitalize(name) + did++
}

// Deep new id assignment
function assignNewId(node) {
  // do the same for SVG child nodes as well
  for (let i = node.children.length - 1; i >= 0; i--) {
    assignNewId(node.children[i]);
  }

  if (node.id) {
    node.id = eid(node.nodeName);
    return node
  }

  return node
}

// Method for extending objects
function extend(modules, methods) {
  let key, i;

  modules = Array.isArray(modules) ? modules : [modules];

  for (i = modules.length - 1; i >= 0; i--) {
    for (key in methods) {
      modules[i].prototype[key] = methods[key];
    }
  }
}

function wrapWithAttrCheck(fn) {
  return function (...args) {
    const o = args[args.length - 1];

    if (o && o.constructor === Object && !(o instanceof Array)) {
      return fn.apply(this, args.slice(0, -1)).attr(o)
    } else {
      return fn.apply(this, args)
    }
  }
}

// Get all siblings, including myself
function siblings() {
  return this.parent().children()
}

// Get the current position siblings
function position() {
  return this.parent().index(this)
}

// Get the next element (will return null if there is none)
function next() {
  return this.siblings()[this.position() + 1]
}

// Get the next element (will return null if there is none)
function prev() {
  return this.siblings()[this.position() - 1]
}

// Send given element one step forward
function forward() {
  const i = this.position();
  const p = this.parent();

  // move node one step forward
  p.add(this.remove(), i + 1);

  return this
}

// Send given element one step backward
function backward() {
  const i = this.position();
  const p = this.parent();

  p.add(this.remove(), i ? i - 1 : 0);

  return this
}

// Send given element all the way to the front
function front() {
  const p = this.parent();

  // Move node forward
  p.add(this.remove());

  return this
}

// Send given element all the way to the back
function back() {
  const p = this.parent();

  // Move node back
  p.add(this.remove(), 0);

  return this
}

// Inserts a given element before the targeted element
function before(element) {
  element = makeInstance(element);
  element.remove();

  const i = this.position();

  this.parent().add(element, i);

  return this
}

// Inserts a given element after the targeted element
function after(element) {
  element = makeInstance(element);
  element.remove();

  const i = this.position();

  this.parent().add(element, i + 1);

  return this
}

function insertBefore(element) {
  element = makeInstance(element);
  element.before(this);
  return this
}

function insertAfter(element) {
  element = makeInstance(element);
  element.after(this);
  return this
}

registerMethods('Dom', {
  siblings,
  position,
  next,
  prev,
  forward,
  backward,
  front,
  back,
  before,
  after,
  insertBefore,
  insertAfter
});

// Parse unit value
const numberAndUnit =
  /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i;

// Parse hex value
const hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

// Parse rgb value
const rgb = /rgb\((\d+),(\d+),(\d+)\)/;

// Parse reference id
const reference = /(#[a-z_][a-z0-9\-_]*)/i;

// splits a transformation chain
const transforms = /\)\s*,?\s*/;

// Whitespace
const whitespace = /\s/g;

// Test hex value
const isHex = /^#[a-f0-9]{3}$|^#[a-f0-9]{6}$/i;

// Test rgb value
const isRgb = /^rgb\(/;

// Test for blank string
const isBlank = /^(\s+)?$/;

// Test for numeric string
const isNumber = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;

// Test for image url
const isImage = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i;

// split at whitespace and comma
const delimiter = /[\s,]+/;

// Test for path letter
const isPathLetter = /[MLHVCSQTAZ]/i;

// Return array of classes on the node
function classes() {
  const attr = this.attr('class');
  return attr == null ? [] : attr.trim().split(delimiter)
}

// Return true if class exists on the node, false otherwise
function hasClass(name) {
  return this.classes().indexOf(name) !== -1
}

// Add class to the node
function addClass(name) {
  if (!this.hasClass(name)) {
    const array = this.classes();
    array.push(name);
    this.attr('class', array.join(' '));
  }

  return this
}

// Remove class from the node
function removeClass(name) {
  if (this.hasClass(name)) {
    this.attr(
      'class',
      this.classes()
        .filter(function (c) {
          return c !== name
        })
        .join(' ')
    );
  }

  return this
}

// Toggle the presence of a class on the node
function toggleClass(name) {
  return this.hasClass(name) ? this.removeClass(name) : this.addClass(name)
}

registerMethods('Dom', {
  classes,
  hasClass,
  addClass,
  removeClass,
  toggleClass
});

// Dynamic style generator
function css(style, val) {
  const ret = {};
  if (arguments.length === 0) {
    // get full style as object
    this.node.style.cssText
      .split(/\s*;\s*/)
      .filter(function (el) {
        return !!el.length
      })
      .forEach(function (el) {
        const t = el.split(/\s*:\s*/);
        ret[t[0]] = t[1];
      });
    return ret
  }

  if (arguments.length < 2) {
    // get style properties as array
    if (Array.isArray(style)) {
      for (const name of style) {
        const cased = name;
        ret[name] = this.node.style.getPropertyValue(cased);
      }
      return ret
    }

    // get style for property
    if (typeof style === 'string') {
      return this.node.style.getPropertyValue(style)
    }

    // set styles in object
    if (typeof style === 'object') {
      for (const name in style) {
        // set empty string if null/undefined/'' was given
        this.node.style.setProperty(
          name,
          style[name] == null || isBlank.test(style[name]) ? '' : style[name]
        );
      }
    }
  }

  // set style for property
  if (arguments.length === 2) {
    this.node.style.setProperty(
      style,
      val == null || isBlank.test(val) ? '' : val
    );
  }

  return this
}

// Show element
function show() {
  return this.css('display', '')
}

// Hide element
function hide() {
  return this.css('display', 'none')
}

// Is element visible?
function visible() {
  return this.css('display') !== 'none'
}

registerMethods('Dom', {
  css,
  show,
  hide,
  visible
});

// Store data values on svg nodes
function data(a, v, r) {
  if (a == null) {
    // get an object of attributes
    return this.data(
      map(
        filter(
          this.node.attributes,
          (el) => el.nodeName.indexOf('data-') === 0
        ),
        (el) => el.nodeName.slice(5)
      )
    )
  } else if (a instanceof Array) {
    const data = {};
    for (const key of a) {
      data[key] = this.data(key);
    }
    return data
  } else if (typeof a === 'object') {
    for (v in a) {
      this.data(v, a[v]);
    }
  } else if (arguments.length < 2) {
    try {
      return JSON.parse(this.attr('data-' + a))
    } catch (e) {
      return this.attr('data-' + a)
    }
  } else {
    this.attr(
      'data-' + a,
      v === null
        ? null
        : r === true || typeof v === 'string' || typeof v === 'number'
          ? v
          : JSON.stringify(v)
    );
  }

  return this
}

registerMethods('Dom', { data });

// Remember arbitrary data
function remember(k, v) {
  // remember every item in an object individually
  if (typeof arguments[0] === 'object') {
    for (const key in k) {
      this.remember(key, k[key]);
    }
  } else if (arguments.length === 1) {
    // retrieve memory
    return this.memory()[k]
  } else {
    // store memory
    this.memory()[k] = v;
  }

  return this
}

// Erase a given memory
function forget() {
  if (arguments.length === 0) {
    this._memory = {};
  } else {
    for (let i = arguments.length - 1; i >= 0; i--) {
      delete this.memory()[arguments[i]];
    }
  }
  return this
}

// This triggers creation of a new hidden class which is not performant
// However, this function is not rarely used so it will not happen frequently
// Return local memory object
function memory() {
  return (this._memory = this._memory || {})
}

registerMethods('Dom', { remember, forget, memory });

function sixDigitHex(hex) {
  return hex.length === 4
    ? [
        '#',
        hex.substring(1, 2),
        hex.substring(1, 2),
        hex.substring(2, 3),
        hex.substring(2, 3),
        hex.substring(3, 4),
        hex.substring(3, 4)
      ].join('')
    : hex
}

function componentHex(component) {
  const integer = Math.round(component);
  const bounded = Math.max(0, Math.min(255, integer));
  const hex = bounded.toString(16);
  return hex.length === 1 ? '0' + hex : hex
}

function is(object, space) {
  for (let i = space.length; i--; ) {
    if (object[space[i]] == null) {
      return false
    }
  }
  return true
}

function getParameters(a, b) {
  const params = is(a, 'rgb')
    ? { _a: a.r, _b: a.g, _c: a.b, _d: 0, space: 'rgb' }
    : is(a, 'xyz')
      ? { _a: a.x, _b: a.y, _c: a.z, _d: 0, space: 'xyz' }
      : is(a, 'hsl')
        ? { _a: a.h, _b: a.s, _c: a.l, _d: 0, space: 'hsl' }
        : is(a, 'lab')
          ? { _a: a.l, _b: a.a, _c: a.b, _d: 0, space: 'lab' }
          : is(a, 'lch')
            ? { _a: a.l, _b: a.c, _c: a.h, _d: 0, space: 'lch' }
            : is(a, 'cmyk')
              ? { _a: a.c, _b: a.m, _c: a.y, _d: a.k, space: 'cmyk' }
              : { _a: 0, _b: 0, _c: 0, space: 'rgb' };

  params.space = b || params.space;
  return params
}

function cieSpace(space) {
  if (space === 'lab' || space === 'xyz' || space === 'lch') {
    return true
  } else {
    return false
  }
}

function hueToRgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

class Color {
  constructor(...inputs) {
    this.init(...inputs);
  }

  // Test if given value is a color
  static isColor(color) {
    return (
      color && (color instanceof Color || this.isRgb(color) || this.test(color))
    )
  }

  // Test if given value is an rgb object
  static isRgb(color) {
    return (
      color &&
      typeof color.r === 'number' &&
      typeof color.g === 'number' &&
      typeof color.b === 'number'
    )
  }

  /*
  Generating random colors
  */
  static random(mode = 'vibrant', t) {
    // Get the math modules
    const { random, round, sin, PI: pi } = Math;

    // Run the correct generator
    if (mode === 'vibrant') {
      const l = (81 - 57) * random() + 57;
      const c = (83 - 45) * random() + 45;
      const h = 360 * random();
      const color = new Color(l, c, h, 'lch');
      return color
    } else if (mode === 'sine') {
      t = t == null ? random() : t;
      const r = round(80 * sin((2 * pi * t) / 0.5 + 0.01) + 150);
      const g = round(50 * sin((2 * pi * t) / 0.5 + 4.6) + 200);
      const b = round(100 * sin((2 * pi * t) / 0.5 + 2.3) + 150);
      const color = new Color(r, g, b);
      return color
    } else if (mode === 'pastel') {
      const l = (94 - 86) * random() + 86;
      const c = (26 - 9) * random() + 9;
      const h = 360 * random();
      const color = new Color(l, c, h, 'lch');
      return color
    } else if (mode === 'dark') {
      const l = 10 + 10 * random();
      const c = (125 - 75) * random() + 86;
      const h = 360 * random();
      const color = new Color(l, c, h, 'lch');
      return color
    } else if (mode === 'rgb') {
      const r = 255 * random();
      const g = 255 * random();
      const b = 255 * random();
      const color = new Color(r, g, b);
      return color
    } else if (mode === 'lab') {
      const l = 100 * random();
      const a = 256 * random() - 128;
      const b = 256 * random() - 128;
      const color = new Color(l, a, b, 'lab');
      return color
    } else if (mode === 'grey') {
      const grey = 255 * random();
      const color = new Color(grey, grey, grey);
      return color
    } else {
      throw new Error('Unsupported random color mode')
    }
  }

  // Test if given value is a color string
  static test(color) {
    return typeof color === 'string' && (isHex.test(color) || isRgb.test(color))
  }

  cmyk() {
    // Get the rgb values for the current color
    const { _a, _b, _c } = this.rgb();
    const [r, g, b] = [_a, _b, _c].map((v) => v / 255);

    // Get the cmyk values in an unbounded format
    const k = Math.min(1 - r, 1 - g, 1 - b);

    if (k === 1) {
      // Catch the black case
      return new Color(0, 0, 0, 1, 'cmyk')
    }

    const c = (1 - r - k) / (1 - k);
    const m = (1 - g - k) / (1 - k);
    const y = (1 - b - k) / (1 - k);

    // Construct the new color
    const color = new Color(c, m, y, k, 'cmyk');
    return color
  }

  hsl() {
    // Get the rgb values
    const { _a, _b, _c } = this.rgb();
    const [r, g, b] = [_a, _b, _c].map((v) => v / 255);

    // Find the maximum and minimum values to get the lightness
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    // If the r, g, v values are identical then we are grey
    const isGrey = max === min;

    // Calculate the hue and saturation
    const delta = max - min;
    const s = isGrey
      ? 0
      : l > 0.5
        ? delta / (2 - max - min)
        : delta / (max + min);
    const h = isGrey
      ? 0
      : max === r
        ? ((g - b) / delta + (g < b ? 6 : 0)) / 6
        : max === g
          ? ((b - r) / delta + 2) / 6
          : max === b
            ? ((r - g) / delta + 4) / 6
            : 0;

    // Construct and return the new color
    const color = new Color(360 * h, 100 * s, 100 * l, 'hsl');
    return color
  }

  init(a = 0, b = 0, c = 0, d = 0, space = 'rgb') {
    // This catches the case when a falsy value is passed like ''
    a = !a ? 0 : a;

    // Reset all values in case the init function is rerun with new color space
    if (this.space) {
      for (const component in this.space) {
        delete this[this.space[component]];
      }
    }

    if (typeof a === 'number') {
      // Allow for the case that we don't need d...
      space = typeof d === 'string' ? d : space;
      d = typeof d === 'string' ? 0 : d;

      // Assign the values straight to the color
      Object.assign(this, { _a: a, _b: b, _c: c, _d: d, space });
      // If the user gave us an array, make the color from it
    } else if (a instanceof Array) {
      this.space = b || (typeof a[3] === 'string' ? a[3] : a[4]) || 'rgb';
      Object.assign(this, { _a: a[0], _b: a[1], _c: a[2], _d: a[3] || 0 });
    } else if (a instanceof Object) {
      // Set the object up and assign its values directly
      const values = getParameters(a, b);
      Object.assign(this, values);
    } else if (typeof a === 'string') {
      if (isRgb.test(a)) {
        const noWhitespace = a.replace(whitespace, '');
        const [_a, _b, _c] = rgb
          .exec(noWhitespace)
          .slice(1, 4)
          .map((v) => parseInt(v));
        Object.assign(this, { _a, _b, _c, _d: 0, space: 'rgb' });
      } else if (isHex.test(a)) {
        const hexParse = (v) => parseInt(v, 16);
        const [, _a, _b, _c] = hex.exec(sixDigitHex(a)).map(hexParse);
        Object.assign(this, { _a, _b, _c, _d: 0, space: 'rgb' });
      } else throw Error("Unsupported string format, can't construct Color")
    }

    // Now add the components as a convenience
    const { _a, _b, _c, _d } = this;
    const components =
      this.space === 'rgb'
        ? { r: _a, g: _b, b: _c }
        : this.space === 'xyz'
          ? { x: _a, y: _b, z: _c }
          : this.space === 'hsl'
            ? { h: _a, s: _b, l: _c }
            : this.space === 'lab'
              ? { l: _a, a: _b, b: _c }
              : this.space === 'lch'
                ? { l: _a, c: _b, h: _c }
                : this.space === 'cmyk'
                  ? { c: _a, m: _b, y: _c, k: _d }
                  : {};
    Object.assign(this, components);
  }

  lab() {
    // Get the xyz color
    const { x, y, z } = this.xyz();

    // Get the lab components
    const l = 116 * y - 16;
    const a = 500 * (x - y);
    const b = 200 * (y - z);

    // Construct and return a new color
    const color = new Color(l, a, b, 'lab');
    return color
  }

  lch() {
    // Get the lab color directly
    const { l, a, b } = this.lab();

    // Get the chromaticity and the hue using polar coordinates
    const c = Math.sqrt(a ** 2 + b ** 2);
    let h = (180 * Math.atan2(b, a)) / Math.PI;
    if (h < 0) {
      h *= -1;
      h = 360 - h;
    }

    // Make a new color and return it
    const color = new Color(l, c, h, 'lch');
    return color
  }
  /*
  Conversion Methods
  */

  rgb() {
    if (this.space === 'rgb') {
      return this
    } else if (cieSpace(this.space)) {
      // Convert to the xyz color space
      let { x, y, z } = this;
      if (this.space === 'lab' || this.space === 'lch') {
        // Get the values in the lab space
        let { l, a, b } = this;
        if (this.space === 'lch') {
          const { c, h } = this;
          const dToR = Math.PI / 180;
          a = c * Math.cos(dToR * h);
          b = c * Math.sin(dToR * h);
        }

        // Undo the nonlinear function
        const yL = (l + 16) / 116;
        const xL = a / 500 + yL;
        const zL = yL - b / 200;

        // Get the xyz values
        const ct = 16 / 116;
        const mx = 0.008856;
        const nm = 7.787;
        x = 0.95047 * (xL ** 3 > mx ? xL ** 3 : (xL - ct) / nm);
        y = 1.0 * (yL ** 3 > mx ? yL ** 3 : (yL - ct) / nm);
        z = 1.08883 * (zL ** 3 > mx ? zL ** 3 : (zL - ct) / nm);
      }

      // Convert xyz to unbounded rgb values
      const rU = x * 3.2406 + y * -1.5372 + z * -0.4986;
      const gU = x * -0.9689 + y * 1.8758 + z * 0.0415;
      const bU = x * 0.0557 + y * -0.204 + z * 1.057;

      // Convert the values to true rgb values
      const pow = Math.pow;
      const bd = 0.0031308;
      const r = rU > bd ? 1.055 * pow(rU, 1 / 2.4) - 0.055 : 12.92 * rU;
      const g = gU > bd ? 1.055 * pow(gU, 1 / 2.4) - 0.055 : 12.92 * gU;
      const b = bU > bd ? 1.055 * pow(bU, 1 / 2.4) - 0.055 : 12.92 * bU;

      // Make and return the color
      const color = new Color(255 * r, 255 * g, 255 * b);
      return color
    } else if (this.space === 'hsl') {
      // https://bgrins.github.io/TinyColor/docs/tinycolor.html
      // Get the current hsl values
      let { h, s, l } = this;
      h /= 360;
      s /= 100;
      l /= 100;

      // If we are grey, then just make the color directly
      if (s === 0) {
        l *= 255;
        const color = new Color(l, l, l);
        return color
      }

      // TODO I have no idea what this does :D If you figure it out, tell me!
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      // Get the rgb values
      const r = 255 * hueToRgb(p, q, h + 1 / 3);
      const g = 255 * hueToRgb(p, q, h);
      const b = 255 * hueToRgb(p, q, h - 1 / 3);

      // Make a new color
      const color = new Color(r, g, b);
      return color
    } else if (this.space === 'cmyk') {
      // https://gist.github.com/felipesabino/5066336
      // Get the normalised cmyk values
      const { c, m, y, k } = this;

      // Get the rgb values
      const r = 255 * (1 - Math.min(1, c * (1 - k) + k));
      const g = 255 * (1 - Math.min(1, m * (1 - k) + k));
      const b = 255 * (1 - Math.min(1, y * (1 - k) + k));

      // Form the color and return it
      const color = new Color(r, g, b);
      return color
    } else {
      return this
    }
  }

  toArray() {
    const { _a, _b, _c, _d, space } = this;
    return [_a, _b, _c, _d, space]
  }

  toHex() {
    const [r, g, b] = this._clamped().map(componentHex);
    return `#${r}${g}${b}`
  }

  toRgb() {
    const [rV, gV, bV] = this._clamped();
    const string = `rgb(${rV},${gV},${bV})`;
    return string
  }

  toString() {
    return this.toHex()
  }

  xyz() {
    // Normalise the red, green and blue values
    const { _a: r255, _b: g255, _c: b255 } = this.rgb();
    const [r, g, b] = [r255, g255, b255].map((v) => v / 255);

    // Convert to the lab rgb space
    const rL = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    const gL = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    const bL = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    // Convert to the xyz color space without bounding the values
    const xU = (rL * 0.4124 + gL * 0.3576 + bL * 0.1805) / 0.95047;
    const yU = (rL * 0.2126 + gL * 0.7152 + bL * 0.0722) / 1.0;
    const zU = (rL * 0.0193 + gL * 0.1192 + bL * 0.9505) / 1.08883;

    // Get the proper xyz values by applying the bounding
    const x = xU > 0.008856 ? Math.pow(xU, 1 / 3) : 7.787 * xU + 16 / 116;
    const y = yU > 0.008856 ? Math.pow(yU, 1 / 3) : 7.787 * yU + 16 / 116;
    const z = zU > 0.008856 ? Math.pow(zU, 1 / 3) : 7.787 * zU + 16 / 116;

    // Make and return the color
    const color = new Color(x, y, z, 'xyz');
    return color
  }

  /*
  Input and Output methods
  */

  _clamped() {
    const { _a, _b, _c } = this.rgb();
    const { max, min, round } = Math;
    const format = (v) => max(0, min(round(v), 255));
    return [_a, _b, _c].map(format)
  }

  /*
  Constructing colors
  */
}

class Point {
  // Initialize
  constructor(...args) {
    this.init(...args);
  }

  // Clone point
  clone() {
    return new Point(this)
  }

  init(x, y) {
    const base = { x: 0, y: 0 };

    // ensure source as object
    const source = Array.isArray(x)
      ? { x: x[0], y: x[1] }
      : typeof x === 'object'
        ? { x: x.x, y: x.y }
        : { x: x, y: y };

    // merge source
    this.x = source.x == null ? base.x : source.x;
    this.y = source.y == null ? base.y : source.y;

    return this
  }

  toArray() {
    return [this.x, this.y]
  }

  transform(m) {
    return this.clone().transformO(m)
  }

  // Transform point with matrix
  transformO(m) {
    if (!Matrix.isMatrixLike(m)) {
      m = new Matrix(m);
    }

    const { x, y } = this;

    // Perform the matrix multiplication
    this.x = m.a * x + m.c * y + m.e;
    this.y = m.b * x + m.d * y + m.f;

    return this
  }
}

function point(x, y) {
  return new Point(x, y).transformO(this.screenCTM().inverseO())
}

function closeEnough(a, b, threshold) {
  return Math.abs(b - a) < (1e-6)
}

class Matrix {
  constructor(...args) {
    this.init(...args);
  }

  static formatTransforms(o) {
    // Get all of the parameters required to form the matrix
    const flipBoth = o.flip === 'both' || o.flip === true;
    const flipX = o.flip && (flipBoth || o.flip === 'x') ? -1 : 1;
    const flipY = o.flip && (flipBoth || o.flip === 'y') ? -1 : 1;
    const skewX =
      o.skew && o.skew.length
        ? o.skew[0]
        : isFinite(o.skew)
          ? o.skew
          : isFinite(o.skewX)
            ? o.skewX
            : 0;
    const skewY =
      o.skew && o.skew.length
        ? o.skew[1]
        : isFinite(o.skew)
          ? o.skew
          : isFinite(o.skewY)
            ? o.skewY
            : 0;
    const scaleX =
      o.scale && o.scale.length
        ? o.scale[0] * flipX
        : isFinite(o.scale)
          ? o.scale * flipX
          : isFinite(o.scaleX)
            ? o.scaleX * flipX
            : flipX;
    const scaleY =
      o.scale && o.scale.length
        ? o.scale[1] * flipY
        : isFinite(o.scale)
          ? o.scale * flipY
          : isFinite(o.scaleY)
            ? o.scaleY * flipY
            : flipY;
    const shear = o.shear || 0;
    const theta = o.rotate || o.theta || 0;
    const origin = new Point(
      o.origin || o.around || o.ox || o.originX,
      o.oy || o.originY
    );
    const ox = origin.x;
    const oy = origin.y;
    // We need Point to be invalid if nothing was passed because we cannot default to 0 here. That is why NaN
    const position = new Point(
      o.position || o.px || o.positionX || NaN,
      o.py || o.positionY || NaN
    );
    const px = position.x;
    const py = position.y;
    const translate = new Point(
      o.translate || o.tx || o.translateX,
      o.ty || o.translateY
    );
    const tx = translate.x;
    const ty = translate.y;
    const relative = new Point(
      o.relative || o.rx || o.relativeX,
      o.ry || o.relativeY
    );
    const rx = relative.x;
    const ry = relative.y;

    // Populate all of the values
    return {
      scaleX,
      scaleY,
      skewX,
      skewY,
      shear,
      theta,
      rx,
      ry,
      tx,
      ty,
      ox,
      oy,
      px,
      py
    }
  }

  static fromArray(a) {
    return { a: a[0], b: a[1], c: a[2], d: a[3], e: a[4], f: a[5] }
  }

  static isMatrixLike(o) {
    return (
      o.a != null ||
      o.b != null ||
      o.c != null ||
      o.d != null ||
      o.e != null ||
      o.f != null
    )
  }

  // left matrix, right matrix, target matrix which is overwritten
  static matrixMultiply(l, r, o) {
    // Work out the product directly
    const a = l.a * r.a + l.c * r.b;
    const b = l.b * r.a + l.d * r.b;
    const c = l.a * r.c + l.c * r.d;
    const d = l.b * r.c + l.d * r.d;
    const e = l.e + l.a * r.e + l.c * r.f;
    const f = l.f + l.b * r.e + l.d * r.f;

    // make sure to use local variables because l/r and o could be the same
    o.a = a;
    o.b = b;
    o.c = c;
    o.d = d;
    o.e = e;
    o.f = f;

    return o
  }

  around(cx, cy, matrix) {
    return this.clone().aroundO(cx, cy, matrix)
  }

  // Transform around a center point
  aroundO(cx, cy, matrix) {
    const dx = cx || 0;
    const dy = cy || 0;
    return this.translateO(-dx, -dy).lmultiplyO(matrix).translateO(dx, dy)
  }

  // Clones this matrix
  clone() {
    return new Matrix(this)
  }

  // Decomposes this matrix into its affine parameters
  decompose(cx = 0, cy = 0) {
    // Get the parameters from the matrix
    const a = this.a;
    const b = this.b;
    const c = this.c;
    const d = this.d;
    const e = this.e;
    const f = this.f;

    // Figure out if the winding direction is clockwise or counterclockwise
    const determinant = a * d - b * c;
    const ccw = determinant > 0 ? 1 : -1;

    // Since we only shear in x, we can use the x basis to get the x scale
    // and the rotation of the resulting matrix
    const sx = ccw * Math.sqrt(a * a + b * b);
    const thetaRad = Math.atan2(ccw * b, ccw * a);
    const theta = (180 / Math.PI) * thetaRad;
    const ct = Math.cos(thetaRad);
    const st = Math.sin(thetaRad);

    // We can then solve the y basis vector simultaneously to get the other
    // two affine parameters directly from these parameters
    const lam = (a * c + b * d) / determinant;
    const sy = (c * sx) / (lam * a - b) || (d * sx) / (lam * b + a);

    // Use the translations
    const tx = e - cx + cx * ct * sx + cy * (lam * ct * sx - st * sy);
    const ty = f - cy + cx * st * sx + cy * (lam * st * sx + ct * sy);

    // Construct the decomposition and return it
    return {
      // Return the affine parameters
      scaleX: sx,
      scaleY: sy,
      shear: lam,
      rotate: theta,
      translateX: tx,
      translateY: ty,
      originX: cx,
      originY: cy,

      // Return the matrix parameters
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      e: this.e,
      f: this.f
    }
  }

  // Check if two matrices are equal
  equals(other) {
    if (other === this) return true
    const comp = new Matrix(other);
    return (
      closeEnough(this.a, comp.a) &&
      closeEnough(this.b, comp.b) &&
      closeEnough(this.c, comp.c) &&
      closeEnough(this.d, comp.d) &&
      closeEnough(this.e, comp.e) &&
      closeEnough(this.f, comp.f)
    )
  }

  // Flip matrix on x or y, at a given offset
  flip(axis, around) {
    return this.clone().flipO(axis, around)
  }

  flipO(axis, around) {
    return axis === 'x'
      ? this.scaleO(-1, 1, around, 0)
      : axis === 'y'
        ? this.scaleO(1, -1, 0, around)
        : this.scaleO(-1, -1, axis, around || axis) // Define an x, y flip point
  }

  // Initialize
  init(source) {
    const base = Matrix.fromArray([1, 0, 0, 1, 0, 0]);

    // ensure source as object
    source =
      source instanceof Element$1
        ? source.matrixify()
        : typeof source === 'string'
          ? Matrix.fromArray(source.split(delimiter).map(parseFloat))
          : Array.isArray(source)
            ? Matrix.fromArray(source)
            : typeof source === 'object' && Matrix.isMatrixLike(source)
              ? source
              : typeof source === 'object'
                ? new Matrix().transform(source)
                : arguments.length === 6
                  ? Matrix.fromArray([].slice.call(arguments))
                  : base;

    // Merge the source matrix with the base matrix
    this.a = source.a != null ? source.a : base.a;
    this.b = source.b != null ? source.b : base.b;
    this.c = source.c != null ? source.c : base.c;
    this.d = source.d != null ? source.d : base.d;
    this.e = source.e != null ? source.e : base.e;
    this.f = source.f != null ? source.f : base.f;

    return this
  }

  inverse() {
    return this.clone().inverseO()
  }

  // Inverses matrix
  inverseO() {
    // Get the current parameters out of the matrix
    const a = this.a;
    const b = this.b;
    const c = this.c;
    const d = this.d;
    const e = this.e;
    const f = this.f;

    // Invert the 2x2 matrix in the top left
    const det = a * d - b * c;
    if (!det) throw new Error('Cannot invert ' + this)

    // Calculate the top 2x2 matrix
    const na = d / det;
    const nb = -b / det;
    const nc = -c / det;
    const nd = a / det;

    // Apply the inverted matrix to the top right
    const ne = -(na * e + nc * f);
    const nf = -(nb * e + nd * f);

    // Construct the inverted matrix
    this.a = na;
    this.b = nb;
    this.c = nc;
    this.d = nd;
    this.e = ne;
    this.f = nf;

    return this
  }

  lmultiply(matrix) {
    return this.clone().lmultiplyO(matrix)
  }

  lmultiplyO(matrix) {
    const r = this;
    const l = matrix instanceof Matrix ? matrix : new Matrix(matrix);

    return Matrix.matrixMultiply(l, r, this)
  }

  // Left multiplies by the given matrix
  multiply(matrix) {
    return this.clone().multiplyO(matrix)
  }

  multiplyO(matrix) {
    // Get the matrices
    const l = this;
    const r = matrix instanceof Matrix ? matrix : new Matrix(matrix);

    return Matrix.matrixMultiply(l, r, this)
  }

  // Rotate matrix
  rotate(r, cx, cy) {
    return this.clone().rotateO(r, cx, cy)
  }

  rotateO(r, cx = 0, cy = 0) {
    // Convert degrees to radians
    r = radians(r);

    const cos = Math.cos(r);
    const sin = Math.sin(r);

    const { a, b, c, d, e, f } = this;

    this.a = a * cos - b * sin;
    this.b = b * cos + a * sin;
    this.c = c * cos - d * sin;
    this.d = d * cos + c * sin;
    this.e = e * cos - f * sin + cy * sin - cx * cos + cx;
    this.f = f * cos + e * sin - cx * sin - cy * cos + cy;

    return this
  }

  // Scale matrix
  scale() {
    return this.clone().scaleO(...arguments)
  }

  scaleO(x, y = x, cx = 0, cy = 0) {
    // Support uniform scaling
    if (arguments.length === 3) {
      cy = cx;
      cx = y;
      y = x;
    }

    const { a, b, c, d, e, f } = this;

    this.a = a * x;
    this.b = b * y;
    this.c = c * x;
    this.d = d * y;
    this.e = e * x - cx * x + cx;
    this.f = f * y - cy * y + cy;

    return this
  }

  // Shear matrix
  shear(a, cx, cy) {
    return this.clone().shearO(a, cx, cy)
  }

  // eslint-disable-next-line no-unused-vars
  shearO(lx, cx = 0, cy = 0) {
    const { a, b, c, d, e, f } = this;

    this.a = a + b * lx;
    this.c = c + d * lx;
    this.e = e + f * lx - cy * lx;

    return this
  }

  // Skew Matrix
  skew() {
    return this.clone().skewO(...arguments)
  }

  skewO(x, y = x, cx = 0, cy = 0) {
    // support uniformal skew
    if (arguments.length === 3) {
      cy = cx;
      cx = y;
      y = x;
    }

    // Convert degrees to radians
    x = radians(x);
    y = radians(y);

    const lx = Math.tan(x);
    const ly = Math.tan(y);

    const { a, b, c, d, e, f } = this;

    this.a = a + b * lx;
    this.b = b + a * ly;
    this.c = c + d * lx;
    this.d = d + c * ly;
    this.e = e + f * lx - cy * lx;
    this.f = f + e * ly - cx * ly;

    return this
  }

  // SkewX
  skewX(x, cx, cy) {
    return this.skew(x, 0, cx, cy)
  }

  // SkewY
  skewY(y, cx, cy) {
    return this.skew(0, y, cx, cy)
  }

  toArray() {
    return [this.a, this.b, this.c, this.d, this.e, this.f]
  }

  // Convert matrix to string
  toString() {
    return (
      'matrix(' +
      this.a +
      ',' +
      this.b +
      ',' +
      this.c +
      ',' +
      this.d +
      ',' +
      this.e +
      ',' +
      this.f +
      ')'
    )
  }

  // Transform a matrix into another matrix by manipulating the space
  transform(o) {
    // Check if o is a matrix and then left multiply it directly
    if (Matrix.isMatrixLike(o)) {
      const matrix = new Matrix(o);
      return matrix.multiplyO(this)
    }

    // Get the proposed transformations and the current transformations
    const t = Matrix.formatTransforms(o);
    const current = this;
    const { x: ox, y: oy } = new Point(t.ox, t.oy).transform(current);

    // Construct the resulting matrix
    const transformer = new Matrix()
      .translateO(t.rx, t.ry)
      .lmultiplyO(current)
      .translateO(-ox, -oy)
      .scaleO(t.scaleX, t.scaleY)
      .skewO(t.skewX, t.skewY)
      .shearO(t.shear)
      .rotateO(t.theta)
      .translateO(ox, oy);

    // If we want the origin at a particular place, we force it there
    if (isFinite(t.px) || isFinite(t.py)) {
      const origin = new Point(ox, oy).transform(transformer);
      // TODO: Replace t.px with isFinite(t.px)
      // Doesn't work because t.px is also 0 if it wasn't passed
      const dx = isFinite(t.px) ? t.px - origin.x : 0;
      const dy = isFinite(t.py) ? t.py - origin.y : 0;
      transformer.translateO(dx, dy);
    }

    // Translate now after positioning
    transformer.translateO(t.tx, t.ty);
    return transformer
  }

  // Translate matrix
  translate(x, y) {
    return this.clone().translateO(x, y)
  }

  translateO(x, y) {
    this.e += x || 0;
    this.f += y || 0;
    return this
  }

  valueOf() {
    return {
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      e: this.e,
      f: this.f
    }
  }
}

function ctm() {
  return new Matrix(this.node.getCTM())
}

function screenCTM() {
  try {
    /* https://bugzilla.mozilla.org/show_bug.cgi?id=1344537
       This is needed because FF does not return the transformation matrix
       for the inner coordinate system when getScreenCTM() is called on nested svgs.
       However all other Browsers do that */
    if (typeof this.isRoot === 'function' && !this.isRoot()) {
      const rect = this.rect(1, 1);
      const m = rect.node.getScreenCTM();
      rect.remove();
      return new Matrix(m)
    }
    return new Matrix(this.node.getScreenCTM())
  } catch (e) {
    console.warn(
      `Cannot get CTM from SVG node ${this.node.nodeName}. Is the element rendered?`
    );
    return new Matrix()
  }
}

register(Matrix, 'Matrix');

function parser() {
  // Reuse cached element if possible
  if (!parser.nodes) {
    const svg = makeInstance().size(2, 0);
    svg.node.style.cssText = [
      'opacity: 0',
      'position: absolute',
      'left: -100%',
      'top: -100%',
      'overflow: hidden'
    ].join(';');

    svg.attr('focusable', 'false');
    svg.attr('aria-hidden', 'true');

    const path = svg.path().node;

    parser.nodes = { svg, path };
  }

  if (!parser.nodes.svg.node.parentNode) {
    const b = globals.document.body || globals.document.documentElement;
    parser.nodes.svg.addTo(b);
  }

  return parser.nodes
}

function isNulledBox(box) {
  return !box.width && !box.height && !box.x && !box.y
}

function domContains(node) {
  return (
    node === globals.document ||
    (
      globals.document.documentElement.contains ||
      function (node) {
        // This is IE - it does not support contains() for top-level SVGs
        while (node.parentNode) {
          node = node.parentNode;
        }
        return node === globals.document
      }
    ).call(globals.document.documentElement, node)
  )
}

class Box {
  constructor(...args) {
    this.init(...args);
  }

  addOffset() {
    // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
    this.x += globals.window.pageXOffset;
    this.y += globals.window.pageYOffset;
    return new Box(this)
  }

  init(source) {
    const base = [0, 0, 0, 0];
    source =
      typeof source === 'string'
        ? source.split(delimiter).map(parseFloat)
        : Array.isArray(source)
          ? source
          : typeof source === 'object'
            ? [
                source.left != null ? source.left : source.x,
                source.top != null ? source.top : source.y,
                source.width,
                source.height
              ]
            : arguments.length === 4
              ? [].slice.call(arguments)
              : base;

    this.x = source[0] || 0;
    this.y = source[1] || 0;
    this.width = this.w = source[2] || 0;
    this.height = this.h = source[3] || 0;

    // Add more bounding box properties
    this.x2 = this.x + this.w;
    this.y2 = this.y + this.h;
    this.cx = this.x + this.w / 2;
    this.cy = this.y + this.h / 2;

    return this
  }

  isNulled() {
    return isNulledBox(this)
  }

  // Merge rect box with another, return a new instance
  merge(box) {
    const x = Math.min(this.x, box.x);
    const y = Math.min(this.y, box.y);
    const width = Math.max(this.x + this.width, box.x + box.width) - x;
    const height = Math.max(this.y + this.height, box.y + box.height) - y;

    return new Box(x, y, width, height)
  }

  toArray() {
    return [this.x, this.y, this.width, this.height]
  }

  toString() {
    return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height
  }

  transform(m) {
    if (!(m instanceof Matrix)) {
      m = new Matrix(m);
    }

    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;

    const pts = [
      new Point(this.x, this.y),
      new Point(this.x2, this.y),
      new Point(this.x, this.y2),
      new Point(this.x2, this.y2)
    ];

    pts.forEach(function (p) {
      p = p.transform(m);
      xMin = Math.min(xMin, p.x);
      xMax = Math.max(xMax, p.x);
      yMin = Math.min(yMin, p.y);
      yMax = Math.max(yMax, p.y);
    });

    return new Box(xMin, yMin, xMax - xMin, yMax - yMin)
  }
}

function getBox(el, getBBoxFn, retry) {
  let box;

  try {
    // Try to get the box with the provided function
    box = getBBoxFn(el.node);

    // If the box is worthless and not even in the dom, retry
    // by throwing an error here...
    if (isNulledBox(box) && !domContains(el.node)) {
      throw new Error('Element not in the dom')
    }
  } catch (e) {
    // ... and calling the retry handler here
    box = retry(el);
  }

  return box
}

function bbox() {
  // Function to get bbox is getBBox()
  const getBBox = (node) => node.getBBox();

  // Take all measures so that a stupid browser renders the element
  // so we can get the bbox from it when we try again
  const retry = (el) => {
    try {
      const clone = el.clone().addTo(parser().svg).show();
      const box = clone.node.getBBox();
      clone.remove();
      return box
    } catch (e) {
      // We give up...
      throw new Error(
        `Getting bbox of element "${
          el.node.nodeName
        }" is not possible: ${e.toString()}`
      )
    }
  };

  const box = getBox(this, getBBox, retry);
  const bbox = new Box(box);

  return bbox
}

function rbox(el) {
  const getRBox = (node) => node.getBoundingClientRect();
  const retry = (el) => {
    // There is no point in trying tricks here because if we insert the element into the dom ourselves
    // it obviously will be at the wrong position
    throw new Error(
      `Getting rbox of element "${el.node.nodeName}" is not possible`
    )
  };

  const box = getBox(this, getRBox, retry);
  const rbox = new Box(box);

  // If an element was passed, we want the bbox in the coordinate system of that element
  if (el) {
    return rbox.transform(el.screenCTM().inverseO())
  }

  // Else we want it in absolute screen coordinates
  // Therefore we need to add the scrollOffset
  return rbox.addOffset()
}

// Checks whether the given point is inside the bounding box
function inside(x, y) {
  const box = this.bbox();

  return (
    x > box.x && y > box.y && x < box.x + box.width && y < box.y + box.height
  )
}

registerMethods({
  viewbox: {
    viewbox(x, y, width, height) {
      // act as getter
      if (x == null) return new Box(this.attr('viewBox'))

      // act as setter
      return this.attr('viewBox', new Box(x, y, width, height))
    },

    zoom(level, point) {
      // Its best to rely on the attributes here and here is why:
      // clientXYZ: Doesn't work on non-root svgs because they dont have a CSSBox (silly!)
      // getBoundingClientRect: Doesn't work because Chrome just ignores width and height of nested svgs completely
      //                        that means, their clientRect is always as big as the content.
      //                        Furthermore this size is incorrect if the element is further transformed by its parents
      // computedStyle: Only returns meaningful values if css was used with px. We dont go this route here!
      // getBBox: returns the bounding box of its content - that doesn't help!
      let { width, height } = this.attr(['width', 'height']);

      // Width and height is a string when a number with a unit is present which we can't use
      // So we try clientXYZ
      if (
        (!width && !height) ||
        typeof width === 'string' ||
        typeof height === 'string'
      ) {
        width = this.node.clientWidth;
        height = this.node.clientHeight;
      }

      // Giving up...
      if (!width || !height) {
        throw new Error(
          'Impossible to get absolute width and height. Please provide an absolute width and height attribute on the zooming element'
        )
      }

      const v = this.viewbox();

      const zoomX = width / v.width;
      const zoomY = height / v.height;
      const zoom = Math.min(zoomX, zoomY);

      if (level == null) {
        return zoom
      }

      let zoomAmount = zoom / level;

      // Set the zoomAmount to the highest value which is safe to process and recover from
      // The * 100 is a bit of wiggle room for the matrix transformation
      if (zoomAmount === Infinity) zoomAmount = Number.MAX_SAFE_INTEGER / 100;

      point =
        point || new Point(width / 2 / zoomX + v.x, height / 2 / zoomY + v.y);

      const box = new Box(v).transform(
        new Matrix({ scale: zoomAmount, origin: point })
      );

      return this.viewbox(box)
    }
  }
});

register(Box, 'Box');

// import { subClassArray } from './ArrayPolyfill.js'

class List extends Array {
  constructor(arr = [], ...args) {
    super(arr, ...args);
    if (typeof arr === 'number') return this
    this.length = 0;
    this.push(...arr);
  }
}

extend([List], {
  each(fnOrMethodName, ...args) {
    if (typeof fnOrMethodName === 'function') {
      return this.map((el, i, arr) => {
        return fnOrMethodName.call(el, el, i, arr)
      })
    } else {
      return this.map((el) => {
        return el[fnOrMethodName](...args)
      })
    }
  },

  toArray() {
    return Array.prototype.concat.apply([], this)
  }
});

const reserved = ['toArray', 'constructor', 'each'];

List.extend = function (methods) {
  methods = methods.reduce((obj, name) => {
    // Don't overwrite own methods
    if (reserved.includes(name)) return obj

    // Don't add private methods
    if (name[0] === '_') return obj

    // Allow access to original Array methods through a prefix
    if (name in Array.prototype) {
      obj['$' + name] = Array.prototype[name];
    }

    // Relay every call to each()
    obj[name] = function (...attrs) {
      return this.each(name, ...attrs)
    };
    return obj
  }, {});

  extend([List], methods);
};

function baseFind(query, parent) {
  return new List(
    map((parent || globals.document).querySelectorAll(query), function (node) {
      return adopt(node)
    })
  )
}

// Scoped find method
function find(query) {
  return baseFind(query, this.node)
}

function findOne(query) {
  return adopt(this.node.querySelector(query))
}

let listenerId = 0;
const windowEvents = {};

function getEvents(instance) {
  let n = instance.getEventHolder();

  // We dont want to save events in global space
  if (n === globals.window) n = windowEvents;
  if (!n.events) n.events = {};
  return n.events
}

function getEventTarget(instance) {
  return instance.getEventTarget()
}

function clearEvents(instance) {
  let n = instance.getEventHolder();
  if (n === globals.window) n = windowEvents;
  if (n.events) n.events = {};
}

// Add event binder in the SVG namespace
function on(node, events, listener, binding, options) {
  const l = listener.bind(binding || node);
  const instance = makeInstance(node);
  const bag = getEvents(instance);
  const n = getEventTarget(instance);

  // events can be an array of events or a string of events
  events = Array.isArray(events) ? events : events.split(delimiter);

  // add id to listener
  if (!listener._svgjsListenerId) {
    listener._svgjsListenerId = ++listenerId;
  }

  events.forEach(function (event) {
    const ev = event.split('.')[0];
    const ns = event.split('.')[1] || '*';

    // ensure valid object
    bag[ev] = bag[ev] || {};
    bag[ev][ns] = bag[ev][ns] || {};

    // reference listener
    bag[ev][ns][listener._svgjsListenerId] = l;

    // add listener
    n.addEventListener(ev, l, options || false);
  });
}

// Add event unbinder in the SVG namespace
function off(node, events, listener, options) {
  const instance = makeInstance(node);
  const bag = getEvents(instance);
  const n = getEventTarget(instance);

  // listener can be a function or a number
  if (typeof listener === 'function') {
    listener = listener._svgjsListenerId;
    if (!listener) return
  }

  // events can be an array of events or a string or undefined
  events = Array.isArray(events) ? events : (events || '').split(delimiter);

  events.forEach(function (event) {
    const ev = event && event.split('.')[0];
    const ns = event && event.split('.')[1];
    let namespace, l;

    if (listener) {
      // remove listener reference
      if (bag[ev] && bag[ev][ns || '*']) {
        // removeListener
        n.removeEventListener(
          ev,
          bag[ev][ns || '*'][listener],
          options || false
        );

        delete bag[ev][ns || '*'][listener];
      }
    } else if (ev && ns) {
      // remove all listeners for a namespaced event
      if (bag[ev] && bag[ev][ns]) {
        for (l in bag[ev][ns]) {
          off(n, [ev, ns].join('.'), l);
        }

        delete bag[ev][ns];
      }
    } else if (ns) {
      // remove all listeners for a specific namespace
      for (event in bag) {
        for (namespace in bag[event]) {
          if (ns === namespace) {
            off(n, [event, ns].join('.'));
          }
        }
      }
    } else if (ev) {
      // remove all listeners for the event
      if (bag[ev]) {
        for (namespace in bag[ev]) {
          off(n, [ev, namespace].join('.'));
        }

        delete bag[ev];
      }
    } else {
      // remove all listeners on a given node
      for (event in bag) {
        off(n, event);
      }

      clearEvents(instance);
    }
  });
}

function dispatch(node, event, data, options) {
  const n = getEventTarget(node);

  // Dispatch event
  if (event instanceof globals.window.Event) {
    n.dispatchEvent(event);
  } else {
    event = new globals.window.CustomEvent(event, {
      detail: data,
      cancelable: true,
      ...options
    });
    n.dispatchEvent(event);
  }
  return event
}

class EventTarget extends Base {
  addEventListener() {}

  dispatch(event, data, options) {
    return dispatch(this, event, data, options)
  }

  dispatchEvent(event) {
    const bag = this.getEventHolder().events;
    if (!bag) return true

    const events = bag[event.type];

    for (const i in events) {
      for (const j in events[i]) {
        events[i][j](event);
      }
    }

    return !event.defaultPrevented
  }

  // Fire given event
  fire(event, data, options) {
    this.dispatch(event, data, options);
    return this
  }

  getEventHolder() {
    return this
  }

  getEventTarget() {
    return this
  }

  // Unbind event from listener
  off(event, listener, options) {
    off(this, event, listener, options);
    return this
  }

  // Bind given event to listener
  on(event, listener, binding, options) {
    on(this, event, listener, binding, options);
    return this
  }

  removeEventListener() {}
}

register(EventTarget, 'EventTarget');

function noop() {}

// Default animation values
const timeline = {
  duration: 400,
  ease: '>',
  delay: 0
};

// Default attribute values
const attrs = {
  // fill and stroke
  'fill-opacity': 1,
  'stroke-opacity': 1,
  'stroke-width': 0,
  'stroke-linejoin': 'miter',
  'stroke-linecap': 'butt',
  fill: '#000000',
  stroke: '#000000',
  opacity: 1,

  // position
  x: 0,
  y: 0,
  cx: 0,
  cy: 0,

  // size
  width: 0,
  height: 0,

  // radius
  r: 0,
  rx: 0,
  ry: 0,

  // gradient
  offset: 0,
  'stop-opacity': 1,
  'stop-color': '#000000',

  // text
  'text-anchor': 'start'
};

class SVGArray extends Array {
  constructor(...args) {
    super(...args);
    this.init(...args);
  }

  clone() {
    return new this.constructor(this)
  }

  init(arr) {
    // This catches the case, that native map tries to create an array with new Array(1)
    if (typeof arr === 'number') return this
    this.length = 0;
    this.push(...this.parse(arr));
    return this
  }

  // Parse whitespace separated string
  parse(array = []) {
    // If already is an array, no need to parse it
    if (array instanceof Array) return array

    return array.trim().split(delimiter).map(parseFloat)
  }

  toArray() {
    return Array.prototype.concat.apply([], this)
  }

  toSet() {
    return new Set(this)
  }

  toString() {
    return this.join(' ')
  }

  // Flattens the array if needed
  valueOf() {
    const ret = [];
    ret.push(...this);
    return ret
  }
}

// Module for unit conversions
class SVGNumber {
  // Initialize
  constructor(...args) {
    this.init(...args);
  }

  convert(unit) {
    return new SVGNumber(this.value, unit)
  }

  // Divide number
  divide(number) {
    number = new SVGNumber(number);
    return new SVGNumber(this / number, this.unit || number.unit)
  }

  init(value, unit) {
    unit = Array.isArray(value) ? value[1] : unit;
    value = Array.isArray(value) ? value[0] : value;

    // initialize defaults
    this.value = 0;
    this.unit = unit || '';

    // parse value
    if (typeof value === 'number') {
      // ensure a valid numeric value
      this.value = isNaN(value)
        ? 0
        : !isFinite(value)
          ? value < 0
            ? -34e37
            : 34e37
          : value;
    } else if (typeof value === 'string') {
      unit = value.match(numberAndUnit);

      if (unit) {
        // make value numeric
        this.value = parseFloat(unit[1]);

        // normalize
        if (unit[5] === '%') {
          this.value /= 100;
        } else if (unit[5] === 's') {
          this.value *= 1000;
        }

        // store unit
        this.unit = unit[5];
      }
    } else {
      if (value instanceof SVGNumber) {
        this.value = value.valueOf();
        this.unit = value.unit;
      }
    }

    return this
  }

  // Subtract number
  minus(number) {
    number = new SVGNumber(number);
    return new SVGNumber(this - number, this.unit || number.unit)
  }

  // Add number
  plus(number) {
    number = new SVGNumber(number);
    return new SVGNumber(this + number, this.unit || number.unit)
  }

  // Multiply number
  times(number) {
    number = new SVGNumber(number);
    return new SVGNumber(this * number, this.unit || number.unit)
  }

  toArray() {
    return [this.value, this.unit]
  }

  toJSON() {
    return this.toString()
  }

  toString() {
    return (
      (this.unit === '%'
        ? ~~(this.value * 1e8) / 1e6
        : this.unit === 's'
          ? this.value / 1e3
          : this.value) + this.unit
    )
  }

  valueOf() {
    return this.value
  }
}

const colorAttributes = new Set([
  'fill',
  'stroke',
  'color',
  'bgcolor',
  'stop-color',
  'flood-color',
  'lighting-color'
]);

const hooks = [];
function registerAttrHook(fn) {
  hooks.push(fn);
}

// Set svg element attribute
function attr(attr, val, ns) {
  // act as full getter
  if (attr == null) {
    // get an object of attributes
    attr = {};
    val = this.node.attributes;

    for (const node of val) {
      attr[node.nodeName] = isNumber.test(node.nodeValue)
        ? parseFloat(node.nodeValue)
        : node.nodeValue;
    }

    return attr
  } else if (attr instanceof Array) {
    // loop through array and get all values
    return attr.reduce((last, curr) => {
      last[curr] = this.attr(curr);
      return last
    }, {})
  } else if (typeof attr === 'object' && attr.constructor === Object) {
    // apply every attribute individually if an object is passed
    for (val in attr) this.attr(val, attr[val]);
  } else if (val === null) {
    // remove value
    this.node.removeAttribute(attr);
  } else if (val == null) {
    // act as a getter if the first and only argument is not an object
    val = this.node.getAttribute(attr);
    return val == null
      ? attrs[attr]
      : isNumber.test(val)
        ? parseFloat(val)
        : val
  } else {
    // Loop through hooks and execute them to convert value
    val = hooks.reduce((_val, hook) => {
      return hook(attr, _val, this)
    }, val);

    // ensure correct numeric values (also accepts NaN and Infinity)
    if (typeof val === 'number') {
      val = new SVGNumber(val);
    } else if (colorAttributes.has(attr) && Color.isColor(val)) {
      // ensure full hex color
      val = new Color(val);
    } else if (val.constructor === Array) {
      // Check for plain arrays and parse array values
      val = new SVGArray(val);
    }

    // if the passed attribute is leading...
    if (attr === 'leading') {
      // ... call the leading method instead
      if (this.leading) {
        this.leading(val);
      }
    } else {
      // set given attribute on node
      typeof ns === 'string'
        ? this.node.setAttributeNS(ns, attr, val.toString())
        : this.node.setAttribute(attr, val.toString());
    }

    // rebuild if required
    if (this.rebuild && (attr === 'font-size' || attr === 'x')) {
      this.rebuild();
    }
  }

  return this
}

class Dom extends EventTarget {
  constructor(node, attrs) {
    super();
    this.node = node;
    this.type = node.nodeName;

    if (attrs && node !== attrs) {
      this.attr(attrs);
    }
  }

  // Add given element at a position
  add(element, i) {
    element = makeInstance(element);

    // If non-root svg nodes are added we have to remove their namespaces
    if (
      element.removeNamespace &&
      this.node instanceof globals.window.SVGElement
    ) {
      element.removeNamespace();
    }

    if (i == null) {
      this.node.appendChild(element.node);
    } else if (element.node !== this.node.childNodes[i]) {
      this.node.insertBefore(element.node, this.node.childNodes[i]);
    }

    return this
  }

  // Add element to given container and return self
  addTo(parent, i) {
    return makeInstance(parent).put(this, i)
  }

  // Returns all child elements
  children() {
    return new List(
      map(this.node.children, function (node) {
        return adopt(node)
      })
    )
  }

  // Remove all elements in this container
  clear() {
    // remove children
    while (this.node.hasChildNodes()) {
      this.node.removeChild(this.node.lastChild);
    }

    return this
  }

  // Clone element
  clone(deep = true, assignNewIds = true) {
    // write dom data to the dom so the clone can pickup the data
    this.writeDataToDom();

    // clone element
    let nodeClone = this.node.cloneNode(deep);
    if (assignNewIds) {
      // assign new id
      nodeClone = assignNewId(nodeClone);
    }
    return new this.constructor(nodeClone)
  }

  // Iterates over all children and invokes a given block
  each(block, deep) {
    const children = this.children();
    let i, il;

    for (i = 0, il = children.length; i < il; i++) {
      block.apply(children[i], [i, children]);

      if (deep) {
        children[i].each(block, deep);
      }
    }

    return this
  }

  element(nodeName, attrs) {
    return this.put(new Dom(create(nodeName), attrs))
  }

  // Get first child
  first() {
    return adopt(this.node.firstChild)
  }

  // Get a element at the given index
  get(i) {
    return adopt(this.node.childNodes[i])
  }

  getEventHolder() {
    return this.node
  }

  getEventTarget() {
    return this.node
  }

  // Checks if the given element is a child
  has(element) {
    return this.index(element) >= 0
  }

  html(htmlOrFn, outerHTML) {
    return this.xml(htmlOrFn, outerHTML, html)
  }

  // Get / set id
  id(id) {
    // generate new id if no id set
    if (typeof id === 'undefined' && !this.node.id) {
      this.node.id = eid(this.type);
    }

    // don't set directly with this.node.id to make `null` work correctly
    return this.attr('id', id)
  }

  // Gets index of given element
  index(element) {
    return [].slice.call(this.node.childNodes).indexOf(element.node)
  }

  // Get the last child
  last() {
    return adopt(this.node.lastChild)
  }

  // matches the element vs a css selector
  matches(selector) {
    const el = this.node;
    const matcher =
      el.matches ||
      el.matchesSelector ||
      el.msMatchesSelector ||
      el.mozMatchesSelector ||
      el.webkitMatchesSelector ||
      el.oMatchesSelector ||
      null;
    return matcher && matcher.call(el, selector)
  }

  // Returns the parent element instance
  parent(type) {
    let parent = this;

    // check for parent
    if (!parent.node.parentNode) return null

    // get parent element
    parent = adopt(parent.node.parentNode);

    if (!type) return parent

    // loop through ancestors if type is given
    do {
      if (
        typeof type === 'string' ? parent.matches(type) : parent instanceof type
      )
        return parent
    } while ((parent = adopt(parent.node.parentNode)))

    return parent
  }

  // Basically does the same as `add()` but returns the added element instead
  put(element, i) {
    element = makeInstance(element);
    this.add(element, i);
    return element
  }

  // Add element to given container and return container
  putIn(parent, i) {
    return makeInstance(parent).add(this, i)
  }

  // Remove element
  remove() {
    if (this.parent()) {
      this.parent().removeElement(this);
    }

    return this
  }

  // Remove a given child
  removeElement(element) {
    this.node.removeChild(element.node);

    return this
  }

  // Replace this with element
  replace(element) {
    element = makeInstance(element);

    if (this.node.parentNode) {
      this.node.parentNode.replaceChild(element.node, this.node);
    }

    return element
  }

  round(precision = 2, map = null) {
    const factor = 10 ** precision;
    const attrs = this.attr(map);

    for (const i in attrs) {
      if (typeof attrs[i] === 'number') {
        attrs[i] = Math.round(attrs[i] * factor) / factor;
      }
    }

    this.attr(attrs);
    return this
  }

  // Import / Export raw svg
  svg(svgOrFn, outerSVG) {
    return this.xml(svgOrFn, outerSVG, svg)
  }

  // Return id on string conversion
  toString() {
    return this.id()
  }

  words(text) {
    // This is faster than removing all children and adding a new one
    this.node.textContent = text;
    return this
  }

  wrap(node) {
    const parent = this.parent();

    if (!parent) {
      return this.addTo(node)
    }

    const position = parent.index(this);
    return parent.put(node, position).put(this)
  }

  // write svgjs data to the dom
  writeDataToDom() {
    // dump variables recursively
    this.each(function () {
      this.writeDataToDom();
    });

    return this
  }

  // Import / Export raw svg
  xml(xmlOrFn, outerXML, ns) {
    if (typeof xmlOrFn === 'boolean') {
      ns = outerXML;
      outerXML = xmlOrFn;
      xmlOrFn = null;
    }

    // act as getter if no svg string is given
    if (xmlOrFn == null || typeof xmlOrFn === 'function') {
      // The default for exports is, that the outerNode is included
      outerXML = outerXML == null ? true : outerXML;

      // write svgjs data to the dom
      this.writeDataToDom();
      let current = this;

      // An export modifier was passed
      if (xmlOrFn != null) {
        current = adopt(current.node.cloneNode(true));

        // If the user wants outerHTML we need to process this node, too
        if (outerXML) {
          const result = xmlOrFn(current);
          current = result || current;

          // The user does not want this node? Well, then he gets nothing
          if (result === false) return ''
        }

        // Deep loop through all children and apply modifier
        current.each(function () {
          const result = xmlOrFn(this);
          const _this = result || this;

          // If modifier returns false, discard node
          if (result === false) {
            this.remove();

            // If modifier returns new node, use it
          } else if (result && this !== _this) {
            this.replace(_this);
          }
        }, true);
      }

      // Return outer or inner content
      return outerXML ? current.node.outerHTML : current.node.innerHTML
    }

    // Act as setter if we got a string

    // The default for import is, that the current node is not replaced
    outerXML = outerXML == null ? false : outerXML;

    // Create temporary holder
    const well = create('wrapper', ns);
    const fragment = globals.document.createDocumentFragment();

    // Dump raw svg
    well.innerHTML = xmlOrFn;

    // Transplant nodes into the fragment
    for (let len = well.children.length; len--; ) {
      fragment.appendChild(well.firstElementChild);
    }

    const parent = this.parent();

    // Add the whole fragment at once
    return outerXML ? this.replace(fragment) && parent : this.add(fragment)
  }
}

extend(Dom, { attr, find, findOne });
register(Dom, 'Dom');

let Element$1 = class Element extends Dom {
  constructor(node, attrs) {
    super(node, attrs);

    // initialize data object
    this.dom = {};

    // create circular reference
    this.node.instance = this;

    if (node.hasAttribute('data-svgjs') || node.hasAttribute('svgjs:data')) {
      // pull svgjs data from the dom (getAttributeNS doesn't work in html5)
      this.setData(
        JSON.parse(node.getAttribute('data-svgjs')) ??
          JSON.parse(node.getAttribute('svgjs:data')) ??
          {}
      );
    }
  }

  // Move element by its center
  center(x, y) {
    return this.cx(x).cy(y)
  }

  // Move by center over x-axis
  cx(x) {
    return x == null
      ? this.x() + this.width() / 2
      : this.x(x - this.width() / 2)
  }

  // Move by center over y-axis
  cy(y) {
    return y == null
      ? this.y() + this.height() / 2
      : this.y(y - this.height() / 2)
  }

  // Get defs
  defs() {
    const root = this.root();
    return root && root.defs()
  }

  // Relative move over x and y axes
  dmove(x, y) {
    return this.dx(x).dy(y)
  }

  // Relative move over x axis
  dx(x = 0) {
    return this.x(new SVGNumber(x).plus(this.x()))
  }

  // Relative move over y axis
  dy(y = 0) {
    return this.y(new SVGNumber(y).plus(this.y()))
  }

  getEventHolder() {
    return this
  }

  // Set height of element
  height(height) {
    return this.attr('height', height)
  }

  // Move element to given x and y values
  move(x, y) {
    return this.x(x).y(y)
  }

  // return array of all ancestors of given type up to the root svg
  parents(until = this.root()) {
    const isSelector = typeof until === 'string';
    if (!isSelector) {
      until = makeInstance(until);
    }
    const parents = new List();
    let parent = this;

    while (
      (parent = parent.parent()) &&
      parent.node !== globals.document &&
      parent.nodeName !== '#document-fragment'
    ) {
      parents.push(parent);

      if (!isSelector && parent.node === until.node) {
        break
      }
      if (isSelector && parent.matches(until)) {
        break
      }
      if (parent.node === this.root().node) {
        // We worked our way to the root and didn't match `until`
        return null
      }
    }

    return parents
  }

  // Get referenced element form attribute value
  reference(attr) {
    attr = this.attr(attr);
    if (!attr) return null

    const m = (attr + '').match(reference);
    return m ? makeInstance(m[1]) : null
  }

  // Get parent document
  root() {
    const p = this.parent(getClass(root));
    return p && p.root()
  }

  // set given data to the elements data property
  setData(o) {
    this.dom = o;
    return this
  }

  // Set element size to given width and height
  size(width, height) {
    const p = proportionalSize(this, width, height);

    return this.width(new SVGNumber(p.width)).height(new SVGNumber(p.height))
  }

  // Set width of element
  width(width) {
    return this.attr('width', width)
  }

  // write svgjs data to the dom
  writeDataToDom() {
    writeDataToDom(this, this.dom);
    return super.writeDataToDom()
  }

  // Move over x-axis
  x(x) {
    return this.attr('x', x)
  }

  // Move over y-axis
  y(y) {
    return this.attr('y', y)
  }
};

extend(Element$1, {
  bbox,
  rbox,
  inside,
  point,
  ctm,
  screenCTM
});

register(Element$1, 'Element');

// Define list of available attributes for stroke and fill
const sugar = {
  stroke: [
    'color',
    'width',
    'opacity',
    'linecap',
    'linejoin',
    'miterlimit',
    'dasharray',
    'dashoffset'
  ],
  fill: ['color', 'opacity', 'rule'],
  prefix: function (t, a) {
    return a === 'color' ? t : t + '-' + a
  }
}

// Add sugar for fill and stroke
;['fill', 'stroke'].forEach(function (m) {
  const extension = {};
  let i;

  extension[m] = function (o) {
    if (typeof o === 'undefined') {
      return this.attr(m)
    }
    if (
      typeof o === 'string' ||
      o instanceof Color ||
      Color.isRgb(o) ||
      o instanceof Element$1
    ) {
      this.attr(m, o);
    } else {
      // set all attributes from sugar.fill and sugar.stroke list
      for (i = sugar[m].length - 1; i >= 0; i--) {
        if (o[sugar[m][i]] != null) {
          this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]]);
        }
      }
    }

    return this
  };

  registerMethods(['Element', 'Runner'], extension);
});

registerMethods(['Element', 'Runner'], {
  // Let the user set the matrix directly
  matrix: function (mat, b, c, d, e, f) {
    // Act as a getter
    if (mat == null) {
      return new Matrix(this)
    }

    // Act as a setter, the user can pass a matrix or a set of numbers
    return this.attr('transform', new Matrix(mat, b, c, d, e, f))
  },

  // Map rotation to transform
  rotate: function (angle, cx, cy) {
    return this.transform({ rotate: angle, ox: cx, oy: cy }, true)
  },

  // Map skew to transform
  skew: function (x, y, cx, cy) {
    return arguments.length === 1 || arguments.length === 3
      ? this.transform({ skew: x, ox: y, oy: cx }, true)
      : this.transform({ skew: [x, y], ox: cx, oy: cy }, true)
  },

  shear: function (lam, cx, cy) {
    return this.transform({ shear: lam, ox: cx, oy: cy }, true)
  },

  // Map scale to transform
  scale: function (x, y, cx, cy) {
    return arguments.length === 1 || arguments.length === 3
      ? this.transform({ scale: x, ox: y, oy: cx }, true)
      : this.transform({ scale: [x, y], ox: cx, oy: cy }, true)
  },

  // Map translate to transform
  translate: function (x, y) {
    return this.transform({ translate: [x, y] }, true)
  },

  // Map relative translations to transform
  relative: function (x, y) {
    return this.transform({ relative: [x, y] }, true)
  },

  // Map flip to transform
  flip: function (direction = 'both', origin = 'center') {
    if ('xybothtrue'.indexOf(direction) === -1) {
      origin = direction;
      direction = 'both';
    }

    return this.transform({ flip: direction, origin: origin }, true)
  },

  // Opacity
  opacity: function (value) {
    return this.attr('opacity', value)
  }
});

registerMethods('radius', {
  // Add x and y radius
  radius: function (x, y = x) {
    const type = (this._element || this).type;
    return type === 'radialGradient'
      ? this.attr('r', new SVGNumber(x))
      : this.rx(x).ry(y)
  }
});

registerMethods('Path', {
  // Get path length
  length: function () {
    return this.node.getTotalLength()
  },
  // Get point at length
  pointAt: function (length) {
    return new Point(this.node.getPointAtLength(length))
  }
});

registerMethods(['Element', 'Runner'], {
  // Set font
  font: function (a, v) {
    if (typeof a === 'object') {
      for (v in a) this.font(v, a[v]);
      return this
    }

    return a === 'leading'
      ? this.leading(v)
      : a === 'anchor'
        ? this.attr('text-anchor', v)
        : a === 'size' ||
            a === 'family' ||
            a === 'weight' ||
            a === 'stretch' ||
            a === 'variant' ||
            a === 'style'
          ? this.attr('font-' + a, v)
          : this.attr(a, v)
  }
});

// Add events to elements
const methods = [
  'click',
  'dblclick',
  'mousedown',
  'mouseup',
  'mouseover',
  'mouseout',
  'mousemove',
  'mouseenter',
  'mouseleave',
  'touchstart',
  'touchmove',
  'touchleave',
  'touchend',
  'touchcancel',
  'contextmenu',
  'wheel',
  'pointerdown',
  'pointermove',
  'pointerup',
  'pointerleave',
  'pointercancel'
].reduce(function (last, event) {
  // add event to Element
  const fn = function (f) {
    if (f === null) {
      this.off(event);
    } else {
      this.on(event, f);
    }
    return this
  };

  last[event] = fn;
  return last
}, {});

registerMethods('Element', methods);

// Reset all transformations
function untransform() {
  return this.attr('transform', null)
}

// merge the whole transformation chain into one matrix and returns it
function matrixify() {
  const matrix = (this.attr('transform') || '')
    // split transformations
    .split(transforms)
    .slice(0, -1)
    .map(function (str) {
      // generate key => value pairs
      const kv = str.trim().split('(');
      return [
        kv[0],
        kv[1].split(delimiter).map(function (str) {
          return parseFloat(str)
        })
      ]
    })
    .reverse()
    // merge every transformation into one matrix
    .reduce(function (matrix, transform) {
      if (transform[0] === 'matrix') {
        return matrix.lmultiply(Matrix.fromArray(transform[1]))
      }
      return matrix[transform[0]].apply(matrix, transform[1])
    }, new Matrix());

  return matrix
}

// add an element to another parent without changing the visual representation on the screen
function toParent(parent, i) {
  if (this === parent) return this

  if (isDescriptive(this.node)) return this.addTo(parent, i)

  const ctm = this.screenCTM();
  const pCtm = parent.screenCTM().inverse();

  this.addTo(parent, i).untransform().transform(pCtm.multiply(ctm));

  return this
}

// same as above with parent equals root-svg
function toRoot(i) {
  return this.toParent(this.root(), i)
}

// Add transformations
function transform(o, relative) {
  // Act as a getter if no object was passed
  if (o == null || typeof o === 'string') {
    const decomposed = new Matrix(this).decompose();
    return o == null ? decomposed : decomposed[o]
  }

  if (!Matrix.isMatrixLike(o)) {
    // Set the origin according to the defined transform
    o = { ...o, origin: getOrigin(o, this) };
  }

  // The user can pass a boolean, an Element or an Matrix or nothing
  const cleanRelative = relative === true ? this : relative || false;
  const result = new Matrix(cleanRelative).transform(o);
  return this.attr('transform', result)
}

registerMethods('Element', {
  untransform,
  matrixify,
  toParent,
  toRoot,
  transform
});

class Container extends Element$1 {
  flatten() {
    this.each(function () {
      if (this instanceof Container) {
        return this.flatten().ungroup()
      }
    });

    return this
  }

  ungroup(parent = this.parent(), index = parent.index(this)) {
    // when parent != this, we want append all elements to the end
    index = index === -1 ? parent.children().length : index;

    this.each(function (i, children) {
      // reverse each
      return children[children.length - i - 1].toParent(parent, index)
    });

    return this.remove()
  }
}

register(Container, 'Container');

class Defs extends Container {
  constructor(node, attrs = node) {
    super(nodeOrNew('defs', node), attrs);
  }

  flatten() {
    return this
  }

  ungroup() {
    return this
  }
}

register(Defs, 'Defs');

class Shape extends Element$1 {}

register(Shape, 'Shape');

// Radius x value
function rx(rx) {
  return this.attr('rx', rx)
}

// Radius y value
function ry(ry) {
  return this.attr('ry', ry)
}

// Move over x-axis
function x$3(x) {
  return x == null ? this.cx() - this.rx() : this.cx(x + this.rx())
}

// Move over y-axis
function y$3(y) {
  return y == null ? this.cy() - this.ry() : this.cy(y + this.ry())
}

// Move by center over x-axis
function cx$1(x) {
  return this.attr('cx', x)
}

// Move by center over y-axis
function cy$1(y) {
  return this.attr('cy', y)
}

// Set width of element
function width$2(width) {
  return width == null ? this.rx() * 2 : this.rx(new SVGNumber(width).divide(2))
}

// Set height of element
function height$2(height) {
  return height == null
    ? this.ry() * 2
    : this.ry(new SVGNumber(height).divide(2))
}

var circled = /*#__PURE__*/Object.freeze({
  __proto__: null,
  cx: cx$1,
  cy: cy$1,
  height: height$2,
  rx: rx,
  ry: ry,
  width: width$2,
  x: x$3,
  y: y$3
});

class Ellipse extends Shape {
  constructor(node, attrs = node) {
    super(nodeOrNew('ellipse', node), attrs);
  }

  size(width, height) {
    const p = proportionalSize(this, width, height);

    return this.rx(new SVGNumber(p.width).divide(2)).ry(
      new SVGNumber(p.height).divide(2)
    )
  }
}

extend(Ellipse, circled);

registerMethods('Container', {
  // Create an ellipse
  ellipse: wrapWithAttrCheck(function (width = 0, height = width) {
    return this.put(new Ellipse()).size(width, height).move(0, 0)
  })
});

register(Ellipse, 'Ellipse');

class Fragment extends Dom {
  constructor(node = globals.document.createDocumentFragment()) {
    super(node);
  }

  // Import / Export raw xml
  xml(xmlOrFn, outerXML, ns) {
    if (typeof xmlOrFn === 'boolean') {
      ns = outerXML;
      outerXML = xmlOrFn;
      xmlOrFn = null;
    }

    // because this is a fragment we have to put all elements into a wrapper first
    // before we can get the innerXML from it
    if (xmlOrFn == null || typeof xmlOrFn === 'function') {
      const wrapper = new Dom(create('wrapper', ns));
      wrapper.add(this.node.cloneNode(true));

      return wrapper.xml(false, ns)
    }

    // Act as setter if we got a string
    return super.xml(xmlOrFn, false, ns)
  }
}

register(Fragment, 'Fragment');

function from(x, y) {
  return (this._element || this).type === 'radialGradient'
    ? this.attr({ fx: new SVGNumber(x), fy: new SVGNumber(y) })
    : this.attr({ x1: new SVGNumber(x), y1: new SVGNumber(y) })
}

function to(x, y) {
  return (this._element || this).type === 'radialGradient'
    ? this.attr({ cx: new SVGNumber(x), cy: new SVGNumber(y) })
    : this.attr({ x2: new SVGNumber(x), y2: new SVGNumber(y) })
}

var gradiented = /*#__PURE__*/Object.freeze({
  __proto__: null,
  from: from,
  to: to
});

class Gradient extends Container {
  constructor(type, attrs) {
    super(
      nodeOrNew(type + 'Gradient', typeof type === 'string' ? null : type),
      attrs
    );
  }

  // custom attr to handle transform
  attr(a, b, c) {
    if (a === 'transform') a = 'gradientTransform';
    return super.attr(a, b, c)
  }

  bbox() {
    return new Box()
  }

  targets() {
    return baseFind('svg [fill*=' + this.id() + ']')
  }

  // Alias string conversion to fill
  toString() {
    return this.url()
  }

  // Update gradient
  update(block) {
    // remove all stops
    this.clear();

    // invoke passed block
    if (typeof block === 'function') {
      block.call(this, this);
    }

    return this
  }

  // Return the fill id
  url() {
    return 'url(#' + this.id() + ')'
  }
}

extend(Gradient, gradiented);

registerMethods({
  Container: {
    // Create gradient element in defs
    gradient(...args) {
      return this.defs().gradient(...args)
    }
  },
  // define gradient
  Defs: {
    gradient: wrapWithAttrCheck(function (type, block) {
      return this.put(new Gradient(type)).update(block)
    })
  }
});

register(Gradient, 'Gradient');

class Pattern extends Container {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('pattern', node), attrs);
  }

  // custom attr to handle transform
  attr(a, b, c) {
    if (a === 'transform') a = 'patternTransform';
    return super.attr(a, b, c)
  }

  bbox() {
    return new Box()
  }

  targets() {
    return baseFind('svg [fill*=' + this.id() + ']')
  }

  // Alias string conversion to fill
  toString() {
    return this.url()
  }

  // Update pattern by rebuilding
  update(block) {
    // remove content
    this.clear();

    // invoke passed block
    if (typeof block === 'function') {
      block.call(this, this);
    }

    return this
  }

  // Return the fill id
  url() {
    return 'url(#' + this.id() + ')'
  }
}

registerMethods({
  Container: {
    // Create pattern element in defs
    pattern(...args) {
      return this.defs().pattern(...args)
    }
  },
  Defs: {
    pattern: wrapWithAttrCheck(function (width, height, block) {
      return this.put(new Pattern()).update(block).attr({
        x: 0,
        y: 0,
        width: width,
        height: height,
        patternUnits: 'userSpaceOnUse'
      })
    })
  }
});

register(Pattern, 'Pattern');

class Image extends Shape {
  constructor(node, attrs = node) {
    super(nodeOrNew('image', node), attrs);
  }

  // (re)load image
  load(url, callback) {
    if (!url) return this

    const img = new globals.window.Image();

    on(
      img,
      'load',
      function (e) {
        const p = this.parent(Pattern);

        // ensure image size
        if (this.width() === 0 && this.height() === 0) {
          this.size(img.width, img.height);
        }

        if (p instanceof Pattern) {
          // ensure pattern size if not set
          if (p.width() === 0 && p.height() === 0) {
            p.size(this.width(), this.height());
          }
        }

        if (typeof callback === 'function') {
          callback.call(this, e);
        }
      },
      this
    );

    on(img, 'load error', function () {
      // dont forget to unbind memory leaking events
      off(img);
    });

    return this.attr('href', (img.src = url), xlink)
  }
}

registerAttrHook(function (attr, val, _this) {
  // convert image fill and stroke to patterns
  if (attr === 'fill' || attr === 'stroke') {
    if (isImage.test(val)) {
      val = _this.root().defs().image(val);
    }
  }

  if (val instanceof Image) {
    val = _this
      .root()
      .defs()
      .pattern(0, 0, (pattern) => {
        pattern.add(val);
      });
  }

  return val
});

registerMethods({
  Container: {
    // create image element, load image and set its size
    image: wrapWithAttrCheck(function (source, callback) {
      return this.put(new Image()).size(0, 0).load(source, callback)
    })
  }
});

register(Image, 'Image');

class PointArray extends SVGArray {
  // Get bounding box of points
  bbox() {
    let maxX = -Infinity;
    let maxY = -Infinity;
    let minX = Infinity;
    let minY = Infinity;
    this.forEach(function (el) {
      maxX = Math.max(el[0], maxX);
      maxY = Math.max(el[1], maxY);
      minX = Math.min(el[0], minX);
      minY = Math.min(el[1], minY);
    });
    return new Box(minX, minY, maxX - minX, maxY - minY)
  }

  // Move point string
  move(x, y) {
    const box = this.bbox();

    // get relative offset
    x -= box.x;
    y -= box.y;

    // move every point
    if (!isNaN(x) && !isNaN(y)) {
      for (let i = this.length - 1; i >= 0; i--) {
        this[i] = [this[i][0] + x, this[i][1] + y];
      }
    }

    return this
  }

  // Parse point string and flat array
  parse(array = [0, 0]) {
    const points = [];

    // if it is an array, we flatten it and therefore clone it to 1 depths
    if (array instanceof Array) {
      array = Array.prototype.concat.apply([], array);
    } else {
      // Else, it is considered as a string
      // parse points
      array = array.trim().split(delimiter).map(parseFloat);
    }

    // validate points - https://svgwg.org/svg2-draft/shapes.html#DataTypePoints
    // Odd number of coordinates is an error. In such cases, drop the last odd coordinate.
    if (array.length % 2 !== 0) array.pop();

    // wrap points in two-tuples
    for (let i = 0, len = array.length; i < len; i = i + 2) {
      points.push([array[i], array[i + 1]]);
    }

    return points
  }

  // Resize poly string
  size(width, height) {
    let i;
    const box = this.bbox();

    // recalculate position of all points according to new size
    for (i = this.length - 1; i >= 0; i--) {
      if (box.width)
        this[i][0] = ((this[i][0] - box.x) * width) / box.width + box.x;
      if (box.height)
        this[i][1] = ((this[i][1] - box.y) * height) / box.height + box.y;
    }

    return this
  }

  // Convert array to line object
  toLine() {
    return {
      x1: this[0][0],
      y1: this[0][1],
      x2: this[1][0],
      y2: this[1][1]
    }
  }

  // Convert array to string
  toString() {
    const array = [];
    // convert to a poly point string
    for (let i = 0, il = this.length; i < il; i++) {
      array.push(this[i].join(','));
    }

    return array.join(' ')
  }

  transform(m) {
    return this.clone().transformO(m)
  }

  // transform points with matrix (similar to Point.transform)
  transformO(m) {
    if (!Matrix.isMatrixLike(m)) {
      m = new Matrix(m);
    }

    for (let i = this.length; i--; ) {
      // Perform the matrix multiplication
      const [x, y] = this[i];
      this[i][0] = m.a * x + m.c * y + m.e;
      this[i][1] = m.b * x + m.d * y + m.f;
    }

    return this
  }
}

const MorphArray = PointArray;

// Move by left top corner over x-axis
function x$2(x) {
  return x == null ? this.bbox().x : this.move(x, this.bbox().y)
}

// Move by left top corner over y-axis
function y$2(y) {
  return y == null ? this.bbox().y : this.move(this.bbox().x, y)
}

// Set width of element
function width$1(width) {
  const b = this.bbox();
  return width == null ? b.width : this.size(width, b.height)
}

// Set height of element
function height$1(height) {
  const b = this.bbox();
  return height == null ? b.height : this.size(b.width, height)
}

var pointed = /*#__PURE__*/Object.freeze({
  __proto__: null,
  MorphArray: MorphArray,
  height: height$1,
  width: width$1,
  x: x$2,
  y: y$2
});

class Line extends Shape {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('line', node), attrs);
  }

  // Get array
  array() {
    return new PointArray([
      [this.attr('x1'), this.attr('y1')],
      [this.attr('x2'), this.attr('y2')]
    ])
  }

  // Move by left top corner
  move(x, y) {
    return this.attr(this.array().move(x, y).toLine())
  }

  // Overwrite native plot() method
  plot(x1, y1, x2, y2) {
    if (x1 == null) {
      return this.array()
    } else if (typeof y1 !== 'undefined') {
      x1 = { x1, y1, x2, y2 };
    } else {
      x1 = new PointArray(x1).toLine();
    }

    return this.attr(x1)
  }

  // Set element size to given width and height
  size(width, height) {
    const p = proportionalSize(this, width, height);
    return this.attr(this.array().size(p.width, p.height).toLine())
  }
}

extend(Line, pointed);

registerMethods({
  Container: {
    // Create a line element
    line: wrapWithAttrCheck(function (...args) {
      // make sure plot is called as a setter
      // x1 is not necessarily a number, it can also be an array, a string and a PointArray
      return Line.prototype.plot.apply(
        this.put(new Line()),
        args[0] != null ? args : [0, 0, 0, 0]
      )
    })
  }
});

register(Line, 'Line');

class Marker extends Container {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('marker', node), attrs);
  }

  // Set height of element
  height(height) {
    return this.attr('markerHeight', height)
  }

  orient(orient) {
    return this.attr('orient', orient)
  }

  // Set marker refX and refY
  ref(x, y) {
    return this.attr('refX', x).attr('refY', y)
  }

  // Return the fill id
  toString() {
    return 'url(#' + this.id() + ')'
  }

  // Update marker
  update(block) {
    // remove all content
    this.clear();

    // invoke passed block
    if (typeof block === 'function') {
      block.call(this, this);
    }

    return this
  }

  // Set width of element
  width(width) {
    return this.attr('markerWidth', width)
  }
}

registerMethods({
  Container: {
    marker(...args) {
      // Create marker element in defs
      return this.defs().marker(...args)
    }
  },
  Defs: {
    // Create marker
    marker: wrapWithAttrCheck(function (width, height, block) {
      // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
      return this.put(new Marker())
        .size(width, height)
        .ref(width / 2, height / 2)
        .viewbox(0, 0, width, height)
        .attr('orient', 'auto')
        .update(block)
    })
  },
  marker: {
    // Create and attach markers
    marker(marker, width, height, block) {
      let attr = ['marker'];

      // Build attribute name
      if (marker !== 'all') attr.push(marker);
      attr = attr.join('-');

      // Set marker attribute
      marker =
        arguments[1] instanceof Marker
          ? arguments[1]
          : this.defs().marker(width, height, block);

      return this.attr(attr, marker)
    }
  }
});

register(Marker, 'Marker');

/***
Base Class
==========
The base stepper class that will be
***/

function makeSetterGetter(k, f) {
  return function (v) {
    if (v == null) return this[k]
    this[k] = v;
    if (f) f.call(this);
    return this
  }
}

const easing = {
  '-': function (pos) {
    return pos
  },
  '<>': function (pos) {
    return -Math.cos(pos * Math.PI) / 2 + 0.5
  },
  '>': function (pos) {
    return Math.sin((pos * Math.PI) / 2)
  },
  '<': function (pos) {
    return -Math.cos((pos * Math.PI) / 2) + 1
  },
  bezier: function (x1, y1, x2, y2) {
    // see https://www.w3.org/TR/css-easing-1/#cubic-bezier-algo
    return function (t) {
      if (t < 0) {
        if (x1 > 0) {
          return (y1 / x1) * t
        } else if (x2 > 0) {
          return (y2 / x2) * t
        } else {
          return 0
        }
      } else if (t > 1) {
        if (x2 < 1) {
          return ((1 - y2) / (1 - x2)) * t + (y2 - x2) / (1 - x2)
        } else if (x1 < 1) {
          return ((1 - y1) / (1 - x1)) * t + (y1 - x1) / (1 - x1)
        } else {
          return 1
        }
      } else {
        return 3 * t * (1 - t) ** 2 * y1 + 3 * t ** 2 * (1 - t) * y2 + t ** 3
      }
    }
  },
  // see https://www.w3.org/TR/css-easing-1/#step-timing-function-algo
  steps: function (steps, stepPosition = 'end') {
    // deal with "jump-" prefix
    stepPosition = stepPosition.split('-').reverse()[0];

    let jumps = steps;
    if (stepPosition === 'none') {
      --jumps;
    } else if (stepPosition === 'both') {
      ++jumps;
    }

    // The beforeFlag is essentially useless
    return (t, beforeFlag = false) => {
      // Step is called currentStep in referenced url
      let step = Math.floor(t * steps);
      const jumping = (t * step) % 1 === 0;

      if (stepPosition === 'start' || stepPosition === 'both') {
        ++step;
      }

      if (beforeFlag && jumping) {
        --step;
      }

      if (t >= 0 && step < 0) {
        step = 0;
      }

      if (t <= 1 && step > jumps) {
        step = jumps;
      }

      return step / jumps
    }
  }
};

class Stepper {
  done() {
    return false
  }
}

/***
Easing Functions
================
***/

class Ease extends Stepper {
  constructor(fn = timeline.ease) {
    super();
    this.ease = easing[fn] || fn;
  }

  step(from, to, pos) {
    if (typeof from !== 'number') {
      return pos < 1 ? from : to
    }
    return from + (to - from) * this.ease(pos)
  }
}

/***
Controller Types
================
***/

class Controller extends Stepper {
  constructor(fn) {
    super();
    this.stepper = fn;
  }

  done(c) {
    return c.done
  }

  step(current, target, dt, c) {
    return this.stepper(current, target, dt, c)
  }
}

function recalculate() {
  // Apply the default parameters
  const duration = (this._duration || 500) / 1000;
  const overshoot = this._overshoot || 0;

  // Calculate the PID natural response
  const eps = 1e-10;
  const pi = Math.PI;
  const os = Math.log(overshoot / 100 + eps);
  const zeta = -os / Math.sqrt(pi * pi + os * os);
  const wn = 3.9 / (zeta * duration);

  // Calculate the Spring values
  this.d = 2 * zeta * wn;
  this.k = wn * wn;
}

class Spring extends Controller {
  constructor(duration = 500, overshoot = 0) {
    super();
    this.duration(duration).overshoot(overshoot);
  }

  step(current, target, dt, c) {
    if (typeof current === 'string') return current
    c.done = dt === Infinity;
    if (dt === Infinity) return target
    if (dt === 0) return current

    if (dt > 100) dt = 16;

    dt /= 1000;

    // Get the previous velocity
    const velocity = c.velocity || 0;

    // Apply the control to get the new position and store it
    const acceleration = -this.d * velocity - this.k * (current - target);
    const newPosition = current + velocity * dt + (acceleration * dt * dt) / 2;

    // Store the velocity
    c.velocity = velocity + acceleration * dt;

    // Figure out if we have converged, and if so, pass the value
    c.done = Math.abs(target - newPosition) + Math.abs(velocity) < 0.002;
    return c.done ? target : newPosition
  }
}

extend(Spring, {
  duration: makeSetterGetter('_duration', recalculate),
  overshoot: makeSetterGetter('_overshoot', recalculate)
});

class PID extends Controller {
  constructor(p = 0.1, i = 0.01, d = 0, windup = 1000) {
    super();
    this.p(p).i(i).d(d).windup(windup);
  }

  step(current, target, dt, c) {
    if (typeof current === 'string') return current
    c.done = dt === Infinity;

    if (dt === Infinity) return target
    if (dt === 0) return current

    const p = target - current;
    let i = (c.integral || 0) + p * dt;
    const d = (p - (c.error || 0)) / dt;
    const windup = this._windup;

    // antiwindup
    if (windup !== false) {
      i = Math.max(-windup, Math.min(i, windup));
    }

    c.error = p;
    c.integral = i;

    c.done = Math.abs(p) < 0.001;

    return c.done ? target : current + (this.P * p + this.I * i + this.D * d)
  }
}

extend(PID, {
  windup: makeSetterGetter('_windup'),
  p: makeSetterGetter('P'),
  i: makeSetterGetter('I'),
  d: makeSetterGetter('D')
});

const segmentParameters = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0
};

const pathHandlers = {
  M: function (c, p, p0) {
    p.x = p0.x = c[0];
    p.y = p0.y = c[1];

    return ['M', p.x, p.y]
  },
  L: function (c, p) {
    p.x = c[0];
    p.y = c[1];
    return ['L', c[0], c[1]]
  },
  H: function (c, p) {
    p.x = c[0];
    return ['H', c[0]]
  },
  V: function (c, p) {
    p.y = c[0];
    return ['V', c[0]]
  },
  C: function (c, p) {
    p.x = c[4];
    p.y = c[5];
    return ['C', c[0], c[1], c[2], c[3], c[4], c[5]]
  },
  S: function (c, p) {
    p.x = c[2];
    p.y = c[3];
    return ['S', c[0], c[1], c[2], c[3]]
  },
  Q: function (c, p) {
    p.x = c[2];
    p.y = c[3];
    return ['Q', c[0], c[1], c[2], c[3]]
  },
  T: function (c, p) {
    p.x = c[0];
    p.y = c[1];
    return ['T', c[0], c[1]]
  },
  Z: function (c, p, p0) {
    p.x = p0.x;
    p.y = p0.y;
    return ['Z']
  },
  A: function (c, p) {
    p.x = c[5];
    p.y = c[6];
    return ['A', c[0], c[1], c[2], c[3], c[4], c[5], c[6]]
  }
};

const mlhvqtcsaz = 'mlhvqtcsaz'.split('');

for (let i = 0, il = mlhvqtcsaz.length; i < il; ++i) {
  pathHandlers[mlhvqtcsaz[i]] = (function (i) {
    return function (c, p, p0) {
      if (i === 'H') c[0] = c[0] + p.x;
      else if (i === 'V') c[0] = c[0] + p.y;
      else if (i === 'A') {
        c[5] = c[5] + p.x;
        c[6] = c[6] + p.y;
      } else {
        for (let j = 0, jl = c.length; j < jl; ++j) {
          c[j] = c[j] + (j % 2 ? p.y : p.x);
        }
      }

      return pathHandlers[i](c, p, p0)
    }
  })(mlhvqtcsaz[i].toUpperCase());
}

function makeAbsolut(parser) {
  const command = parser.segment[0];
  return pathHandlers[command](parser.segment.slice(1), parser.p, parser.p0)
}

function segmentComplete(parser) {
  return (
    parser.segment.length &&
    parser.segment.length - 1 ===
      segmentParameters[parser.segment[0].toUpperCase()]
  )
}

function startNewSegment(parser, token) {
  parser.inNumber && finalizeNumber(parser, false);
  const pathLetter = isPathLetter.test(token);

  if (pathLetter) {
    parser.segment = [token];
  } else {
    const lastCommand = parser.lastCommand;
    const small = lastCommand.toLowerCase();
    const isSmall = lastCommand === small;
    parser.segment = [small === 'm' ? (isSmall ? 'l' : 'L') : lastCommand];
  }

  parser.inSegment = true;
  parser.lastCommand = parser.segment[0];

  return pathLetter
}

function finalizeNumber(parser, inNumber) {
  if (!parser.inNumber) throw new Error('Parser Error')
  parser.number && parser.segment.push(parseFloat(parser.number));
  parser.inNumber = inNumber;
  parser.number = '';
  parser.pointSeen = false;
  parser.hasExponent = false;

  if (segmentComplete(parser)) {
    finalizeSegment(parser);
  }
}

function finalizeSegment(parser) {
  parser.inSegment = false;
  if (parser.absolute) {
    parser.segment = makeAbsolut(parser);
  }
  parser.segments.push(parser.segment);
}

function isArcFlag(parser) {
  if (!parser.segment.length) return false
  const isArc = parser.segment[0].toUpperCase() === 'A';
  const length = parser.segment.length;

  return isArc && (length === 4 || length === 5)
}

function isExponential(parser) {
  return parser.lastToken.toUpperCase() === 'E'
}

const pathDelimiters = new Set([' ', ',', '\t', '\n', '\r', '\f']);
function pathParser(d, toAbsolute = true) {
  let index = 0;
  let token = '';
  const parser = {
    segment: [],
    inNumber: false,
    number: '',
    lastToken: '',
    inSegment: false,
    segments: [],
    pointSeen: false,
    hasExponent: false,
    absolute: toAbsolute,
    p0: new Point(),
    p: new Point()
  };

  while (((parser.lastToken = token), (token = d.charAt(index++)))) {
    if (!parser.inSegment) {
      if (startNewSegment(parser, token)) {
        continue
      }
    }

    if (token === '.') {
      if (parser.pointSeen || parser.hasExponent) {
        finalizeNumber(parser, false);
        --index;
        continue
      }
      parser.inNumber = true;
      parser.pointSeen = true;
      parser.number += token;
      continue
    }

    if (!isNaN(parseInt(token))) {
      if (parser.number === '0' || isArcFlag(parser)) {
        parser.inNumber = true;
        parser.number = token;
        finalizeNumber(parser, true);
        continue
      }

      parser.inNumber = true;
      parser.number += token;
      continue
    }

    if (pathDelimiters.has(token)) {
      if (parser.inNumber) {
        finalizeNumber(parser, false);
      }
      continue
    }

    if (token === '-' || token === '+') {
      if (parser.inNumber && !isExponential(parser)) {
        finalizeNumber(parser, false);
        --index;
        continue
      }
      parser.number += token;
      parser.inNumber = true;
      continue
    }

    if (token.toUpperCase() === 'E') {
      parser.number += token;
      parser.hasExponent = true;
      continue
    }

    if (isPathLetter.test(token)) {
      if (parser.inNumber) {
        finalizeNumber(parser, false);
      } else if (!segmentComplete(parser)) {
        throw new Error('parser Error')
      } else {
        finalizeSegment(parser);
      }
      --index;
    }
  }

  if (parser.inNumber) {
    finalizeNumber(parser, false);
  }

  if (parser.inSegment && segmentComplete(parser)) {
    finalizeSegment(parser);
  }

  return parser.segments
}

function arrayToString(a) {
  let s = '';
  for (let i = 0, il = a.length; i < il; i++) {
    s += a[i][0];

    if (a[i][1] != null) {
      s += a[i][1];

      if (a[i][2] != null) {
        s += ' ';
        s += a[i][2];

        if (a[i][3] != null) {
          s += ' ';
          s += a[i][3];
          s += ' ';
          s += a[i][4];

          if (a[i][5] != null) {
            s += ' ';
            s += a[i][5];
            s += ' ';
            s += a[i][6];

            if (a[i][7] != null) {
              s += ' ';
              s += a[i][7];
            }
          }
        }
      }
    }
  }

  return s + ' '
}

class PathArray extends SVGArray {
  // Get bounding box of path
  bbox() {
    parser().path.setAttribute('d', this.toString());
    return new Box(parser.nodes.path.getBBox())
  }

  // Move path string
  move(x, y) {
    // get bounding box of current situation
    const box = this.bbox();

    // get relative offset
    x -= box.x;
    y -= box.y;

    if (!isNaN(x) && !isNaN(y)) {
      // move every point
      for (let l, i = this.length - 1; i >= 0; i--) {
        l = this[i][0];

        if (l === 'M' || l === 'L' || l === 'T') {
          this[i][1] += x;
          this[i][2] += y;
        } else if (l === 'H') {
          this[i][1] += x;
        } else if (l === 'V') {
          this[i][1] += y;
        } else if (l === 'C' || l === 'S' || l === 'Q') {
          this[i][1] += x;
          this[i][2] += y;
          this[i][3] += x;
          this[i][4] += y;

          if (l === 'C') {
            this[i][5] += x;
            this[i][6] += y;
          }
        } else if (l === 'A') {
          this[i][6] += x;
          this[i][7] += y;
        }
      }
    }

    return this
  }

  // Absolutize and parse path to array
  parse(d = 'M0 0') {
    if (Array.isArray(d)) {
      d = Array.prototype.concat.apply([], d).toString();
    }

    return pathParser(d)
  }

  // Resize path string
  size(width, height) {
    // get bounding box of current situation
    const box = this.bbox();
    let i, l;

    // If the box width or height is 0 then we ignore
    // transformations on the respective axis
    box.width = box.width === 0 ? 1 : box.width;
    box.height = box.height === 0 ? 1 : box.height;

    // recalculate position of all points according to new size
    for (i = this.length - 1; i >= 0; i--) {
      l = this[i][0];

      if (l === 'M' || l === 'L' || l === 'T') {
        this[i][1] = ((this[i][1] - box.x) * width) / box.width + box.x;
        this[i][2] = ((this[i][2] - box.y) * height) / box.height + box.y;
      } else if (l === 'H') {
        this[i][1] = ((this[i][1] - box.x) * width) / box.width + box.x;
      } else if (l === 'V') {
        this[i][1] = ((this[i][1] - box.y) * height) / box.height + box.y;
      } else if (l === 'C' || l === 'S' || l === 'Q') {
        this[i][1] = ((this[i][1] - box.x) * width) / box.width + box.x;
        this[i][2] = ((this[i][2] - box.y) * height) / box.height + box.y;
        this[i][3] = ((this[i][3] - box.x) * width) / box.width + box.x;
        this[i][4] = ((this[i][4] - box.y) * height) / box.height + box.y;

        if (l === 'C') {
          this[i][5] = ((this[i][5] - box.x) * width) / box.width + box.x;
          this[i][6] = ((this[i][6] - box.y) * height) / box.height + box.y;
        }
      } else if (l === 'A') {
        // resize radii
        this[i][1] = (this[i][1] * width) / box.width;
        this[i][2] = (this[i][2] * height) / box.height;

        // move position values
        this[i][6] = ((this[i][6] - box.x) * width) / box.width + box.x;
        this[i][7] = ((this[i][7] - box.y) * height) / box.height + box.y;
      }
    }

    return this
  }

  // Convert array to string
  toString() {
    return arrayToString(this)
  }
}

const getClassForType = (value) => {
  const type = typeof value;

  if (type === 'number') {
    return SVGNumber
  } else if (type === 'string') {
    if (Color.isColor(value)) {
      return Color
    } else if (delimiter.test(value)) {
      return isPathLetter.test(value) ? PathArray : SVGArray
    } else if (numberAndUnit.test(value)) {
      return SVGNumber
    } else {
      return NonMorphable
    }
  } else if (morphableTypes.indexOf(value.constructor) > -1) {
    return value.constructor
  } else if (Array.isArray(value)) {
    return SVGArray
  } else if (type === 'object') {
    return ObjectBag
  } else {
    return NonMorphable
  }
};

class Morphable {
  constructor(stepper) {
    this._stepper = stepper || new Ease('-');

    this._from = null;
    this._to = null;
    this._type = null;
    this._context = null;
    this._morphObj = null;
  }

  at(pos) {
    return this._morphObj.morph(
      this._from,
      this._to,
      pos,
      this._stepper,
      this._context
    )
  }

  done() {
    const complete = this._context.map(this._stepper.done).reduce(function (
      last,
      curr
    ) {
      return last && curr
    }, true);
    return complete
  }

  from(val) {
    if (val == null) {
      return this._from
    }

    this._from = this._set(val);
    return this
  }

  stepper(stepper) {
    if (stepper == null) return this._stepper
    this._stepper = stepper;
    return this
  }

  to(val) {
    if (val == null) {
      return this._to
    }

    this._to = this._set(val);
    return this
  }

  type(type) {
    // getter
    if (type == null) {
      return this._type
    }

    // setter
    this._type = type;
    return this
  }

  _set(value) {
    if (!this._type) {
      this.type(getClassForType(value));
    }

    let result = new this._type(value);
    if (this._type === Color) {
      result = this._to
        ? result[this._to[4]]()
        : this._from
          ? result[this._from[4]]()
          : result;
    }

    if (this._type === ObjectBag) {
      result = this._to
        ? result.align(this._to)
        : this._from
          ? result.align(this._from)
          : result;
    }

    result = result.toConsumable();

    this._morphObj = this._morphObj || new this._type();
    this._context =
      this._context ||
      Array.apply(null, Array(result.length))
        .map(Object)
        .map(function (o) {
          o.done = true;
          return o
        });
    return result
  }
}

class NonMorphable {
  constructor(...args) {
    this.init(...args);
  }

  init(val) {
    val = Array.isArray(val) ? val[0] : val;
    this.value = val;
    return this
  }

  toArray() {
    return [this.value]
  }

  valueOf() {
    return this.value
  }
}

class TransformBag {
  constructor(...args) {
    this.init(...args);
  }

  init(obj) {
    if (Array.isArray(obj)) {
      obj = {
        scaleX: obj[0],
        scaleY: obj[1],
        shear: obj[2],
        rotate: obj[3],
        translateX: obj[4],
        translateY: obj[5],
        originX: obj[6],
        originY: obj[7]
      };
    }

    Object.assign(this, TransformBag.defaults, obj);
    return this
  }

  toArray() {
    const v = this;

    return [
      v.scaleX,
      v.scaleY,
      v.shear,
      v.rotate,
      v.translateX,
      v.translateY,
      v.originX,
      v.originY
    ]
  }
}

TransformBag.defaults = {
  scaleX: 1,
  scaleY: 1,
  shear: 0,
  rotate: 0,
  translateX: 0,
  translateY: 0,
  originX: 0,
  originY: 0
};

const sortByKey = (a, b) => {
  return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0
};

class ObjectBag {
  constructor(...args) {
    this.init(...args);
  }

  align(other) {
    const values = this.values;
    for (let i = 0, il = values.length; i < il; ++i) {
      // If the type is the same we only need to check if the color is in the correct format
      if (values[i + 1] === other[i + 1]) {
        if (values[i + 1] === Color && other[i + 7] !== values[i + 7]) {
          const space = other[i + 7];
          const color = new Color(this.values.splice(i + 3, 5))
            [space]()
            .toArray();
          this.values.splice(i + 3, 0, ...color);
        }

        i += values[i + 2] + 2;
        continue
      }

      if (!other[i + 1]) {
        return this
      }

      // The types differ, so we overwrite the new type with the old one
      // And initialize it with the types default (e.g. black for color or 0 for number)
      const defaultObject = new other[i + 1]().toArray();

      // Than we fix the values array
      const toDelete = values[i + 2] + 3;

      values.splice(
        i,
        toDelete,
        other[i],
        other[i + 1],
        other[i + 2],
        ...defaultObject
      );

      i += values[i + 2] + 2;
    }
    return this
  }

  init(objOrArr) {
    this.values = [];

    if (Array.isArray(objOrArr)) {
      this.values = objOrArr.slice();
      return
    }

    objOrArr = objOrArr || {};
    const entries = [];

    for (const i in objOrArr) {
      const Type = getClassForType(objOrArr[i]);
      const val = new Type(objOrArr[i]).toArray();
      entries.push([i, Type, val.length, ...val]);
    }

    entries.sort(sortByKey);

    this.values = entries.reduce((last, curr) => last.concat(curr), []);
    return this
  }

  toArray() {
    return this.values
  }

  valueOf() {
    const obj = {};
    const arr = this.values;

    // for (var i = 0, len = arr.length; i < len; i += 2) {
    while (arr.length) {
      const key = arr.shift();
      const Type = arr.shift();
      const num = arr.shift();
      const values = arr.splice(0, num);
      obj[key] = new Type(values); // .valueOf()
    }

    return obj
  }
}

const morphableTypes = [NonMorphable, TransformBag, ObjectBag];

function registerMorphableType(type = []) {
  morphableTypes.push(...[].concat(type));
}

function makeMorphable() {
  extend(morphableTypes, {
    to(val) {
      return new Morphable()
        .type(this.constructor)
        .from(this.toArray()) // this.valueOf())
        .to(val)
    },
    fromArray(arr) {
      this.init(arr);
      return this
    },
    toConsumable() {
      return this.toArray()
    },
    morph(from, to, pos, stepper, context) {
      const mapper = function (i, index) {
        return stepper.step(i, to[index], pos, context[index], context)
      };

      return this.fromArray(from.map(mapper))
    }
  });
}

let Path$1 = class Path extends Shape {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('path', node), attrs);
  }

  // Get array
  array() {
    return this._array || (this._array = new PathArray(this.attr('d')))
  }

  // Clear array cache
  clear() {
    delete this._array;
    return this
  }

  // Set height of element
  height(height) {
    return height == null
      ? this.bbox().height
      : this.size(this.bbox().width, height)
  }

  // Move by left top corner
  move(x, y) {
    return this.attr('d', this.array().move(x, y))
  }

  // Plot new path
  plot(d) {
    return d == null
      ? this.array()
      : this.clear().attr(
          'd',
          typeof d === 'string' ? d : (this._array = new PathArray(d))
        )
  }

  // Set element size to given width and height
  size(width, height) {
    const p = proportionalSize(this, width, height);
    return this.attr('d', this.array().size(p.width, p.height))
  }

  // Set width of element
  width(width) {
    return width == null
      ? this.bbox().width
      : this.size(width, this.bbox().height)
  }

  // Move by left top corner over x-axis
  x(x) {
    return x == null ? this.bbox().x : this.move(x, this.bbox().y)
  }

  // Move by left top corner over y-axis
  y(y) {
    return y == null ? this.bbox().y : this.move(this.bbox().x, y)
  }
};

// Define morphable array
Path$1.prototype.MorphArray = PathArray;

// Add parent method
registerMethods({
  Container: {
    // Create a wrapped path element
    path: wrapWithAttrCheck(function (d) {
      // make sure plot is called as a setter
      return this.put(new Path$1()).plot(d || new PathArray())
    })
  }
});

register(Path$1, 'Path');

// Get array
function array() {
  return this._array || (this._array = new PointArray(this.attr('points')))
}

// Clear array cache
function clear() {
  delete this._array;
  return this
}

// Move by left top corner
function move$2(x, y) {
  return this.attr('points', this.array().move(x, y))
}

// Plot new path
function plot(p) {
  return p == null
    ? this.array()
    : this.clear().attr(
        'points',
        typeof p === 'string' ? p : (this._array = new PointArray(p))
      )
}

// Set element size to given width and height
function size$1(width, height) {
  const p = proportionalSize(this, width, height);
  return this.attr('points', this.array().size(p.width, p.height))
}

var poly = /*#__PURE__*/Object.freeze({
  __proto__: null,
  array: array,
  clear: clear,
  move: move$2,
  plot: plot,
  size: size$1
});

class Polygon extends Shape {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('polygon', node), attrs);
  }
}

registerMethods({
  Container: {
    // Create a wrapped polygon element
    polygon: wrapWithAttrCheck(function (p) {
      // make sure plot is called as a setter
      return this.put(new Polygon()).plot(p || new PointArray())
    })
  }
});

extend(Polygon, pointed);
extend(Polygon, poly);
register(Polygon, 'Polygon');

class Polyline extends Shape {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('polyline', node), attrs);
  }
}

registerMethods({
  Container: {
    // Create a wrapped polygon element
    polyline: wrapWithAttrCheck(function (p) {
      // make sure plot is called as a setter
      return this.put(new Polyline()).plot(p || new PointArray())
    })
  }
});

extend(Polyline, pointed);
extend(Polyline, poly);
register(Polyline, 'Polyline');

class Rect extends Shape {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('rect', node), attrs);
  }
}

extend(Rect, { rx, ry });

registerMethods({
  Container: {
    // Create a rect element
    rect: wrapWithAttrCheck(function (width, height) {
      return this.put(new Rect()).size(width, height)
    })
  }
});

register(Rect, 'Rect');

class Queue {
  constructor() {
    this._first = null;
    this._last = null;
  }

  // Shows us the first item in the list
  first() {
    return this._first && this._first.value
  }

  // Shows us the last item in the list
  last() {
    return this._last && this._last.value
  }

  push(value) {
    // An item stores an id and the provided value
    const item =
      typeof value.next !== 'undefined'
        ? value
        : { value: value, next: null, prev: null };

    // Deal with the queue being empty or populated
    if (this._last) {
      item.prev = this._last;
      this._last.next = item;
      this._last = item;
    } else {
      this._last = item;
      this._first = item;
    }

    // Return the current item
    return item
  }

  // Removes the item that was returned from the push
  remove(item) {
    // Relink the previous item
    if (item.prev) item.prev.next = item.next;
    if (item.next) item.next.prev = item.prev;
    if (item === this._last) this._last = item.prev;
    if (item === this._first) this._first = item.next;

    // Invalidate item
    item.prev = null;
    item.next = null;
  }

  shift() {
    // Check if we have a value
    const remove = this._first;
    if (!remove) return null

    // If we do, remove it and relink things
    this._first = remove.next;
    if (this._first) this._first.prev = null;
    this._last = this._first ? this._last : null;
    return remove.value
  }
}

const Animator = {
  nextDraw: null,
  frames: new Queue(),
  timeouts: new Queue(),
  immediates: new Queue(),
  timer: () => globals.window.performance || globals.window.Date,
  transforms: [],

  frame(fn) {
    // Store the node
    const node = Animator.frames.push({ run: fn });

    // Request an animation frame if we don't have one
    if (Animator.nextDraw === null) {
      Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
    }

    // Return the node so we can remove it easily
    return node
  },

  timeout(fn, delay) {
    delay = delay || 0;

    // Work out when the event should fire
    const time = Animator.timer().now() + delay;

    // Add the timeout to the end of the queue
    const node = Animator.timeouts.push({ run: fn, time: time });

    // Request another animation frame if we need one
    if (Animator.nextDraw === null) {
      Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
    }

    return node
  },

  immediate(fn) {
    // Add the immediate fn to the end of the queue
    const node = Animator.immediates.push(fn);
    // Request another animation frame if we need one
    if (Animator.nextDraw === null) {
      Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
    }

    return node
  },

  cancelFrame(node) {
    node != null && Animator.frames.remove(node);
  },

  clearTimeout(node) {
    node != null && Animator.timeouts.remove(node);
  },

  cancelImmediate(node) {
    node != null && Animator.immediates.remove(node);
  },

  _draw(now) {
    // Run all the timeouts we can run, if they are not ready yet, add them
    // to the end of the queue immediately! (bad timeouts!!! [sarcasm])
    let nextTimeout = null;
    const lastTimeout = Animator.timeouts.last();
    while ((nextTimeout = Animator.timeouts.shift())) {
      // Run the timeout if its time, or push it to the end
      if (now >= nextTimeout.time) {
        nextTimeout.run();
      } else {
        Animator.timeouts.push(nextTimeout);
      }

      // If we hit the last item, we should stop shifting out more items
      if (nextTimeout === lastTimeout) break
    }

    // Run all of the animation frames
    let nextFrame = null;
    const lastFrame = Animator.frames.last();
    while (nextFrame !== lastFrame && (nextFrame = Animator.frames.shift())) {
      nextFrame.run(now);
    }

    let nextImmediate = null;
    while ((nextImmediate = Animator.immediates.shift())) {
      nextImmediate();
    }

    // If we have remaining timeouts or frames, draw until we don't anymore
    Animator.nextDraw =
      Animator.timeouts.first() || Animator.frames.first()
        ? globals.window.requestAnimationFrame(Animator._draw)
        : null;
  }
};

const makeSchedule = function (runnerInfo) {
  const start = runnerInfo.start;
  const duration = runnerInfo.runner.duration();
  const end = start + duration;
  return {
    start: start,
    duration: duration,
    end: end,
    runner: runnerInfo.runner
  }
};

const defaultSource = function () {
  const w = globals.window;
  return (w.performance || w.Date).now()
};

class Timeline extends EventTarget {
  // Construct a new timeline on the given element
  constructor(timeSource = defaultSource) {
    super();

    this._timeSource = timeSource;

    // terminate resets all variables to their initial state
    this.terminate();
  }

  active() {
    return !!this._nextFrame
  }

  finish() {
    // Go to end and pause
    this.time(this.getEndTimeOfTimeline() + 1);
    return this.pause()
  }

  // Calculates the end of the timeline
  getEndTime() {
    const lastRunnerInfo = this.getLastRunnerInfo();
    const lastDuration = lastRunnerInfo ? lastRunnerInfo.runner.duration() : 0;
    const lastStartTime = lastRunnerInfo ? lastRunnerInfo.start : this._time;
    return lastStartTime + lastDuration
  }

  getEndTimeOfTimeline() {
    const endTimes = this._runners.map((i) => i.start + i.runner.duration());
    return Math.max(0, ...endTimes)
  }

  getLastRunnerInfo() {
    return this.getRunnerInfoById(this._lastRunnerId)
  }

  getRunnerInfoById(id) {
    return this._runners[this._runnerIds.indexOf(id)] || null
  }

  pause() {
    this._paused = true;
    return this._continue()
  }

  persist(dtOrForever) {
    if (dtOrForever == null) return this._persist
    this._persist = dtOrForever;
    return this
  }

  play() {
    // Now make sure we are not paused and continue the animation
    this._paused = false;
    return this.updateTime()._continue()
  }

  reverse(yes) {
    const currentSpeed = this.speed();
    if (yes == null) return this.speed(-currentSpeed)

    const positive = Math.abs(currentSpeed);
    return this.speed(yes ? -positive : positive)
  }

  // schedules a runner on the timeline
  schedule(runner, delay, when) {
    if (runner == null) {
      return this._runners.map(makeSchedule)
    }

    // The start time for the next animation can either be given explicitly,
    // derived from the current timeline time or it can be relative to the
    // last start time to chain animations directly

    let absoluteStartTime = 0;
    const endTime = this.getEndTime();
    delay = delay || 0;

    // Work out when to start the animation
    if (when == null || when === 'last' || when === 'after') {
      // Take the last time and increment
      absoluteStartTime = endTime;
    } else if (when === 'absolute' || when === 'start') {
      absoluteStartTime = delay;
      delay = 0;
    } else if (when === 'now') {
      absoluteStartTime = this._time;
    } else if (when === 'relative') {
      const runnerInfo = this.getRunnerInfoById(runner.id);
      if (runnerInfo) {
        absoluteStartTime = runnerInfo.start + delay;
        delay = 0;
      }
    } else if (when === 'with-last') {
      const lastRunnerInfo = this.getLastRunnerInfo();
      const lastStartTime = lastRunnerInfo ? lastRunnerInfo.start : this._time;
      absoluteStartTime = lastStartTime;
    } else {
      throw new Error('Invalid value for the "when" parameter')
    }

    // Manage runner
    runner.unschedule();
    runner.timeline(this);

    const persist = runner.persist();
    const runnerInfo = {
      persist: persist === null ? this._persist : persist,
      start: absoluteStartTime + delay,
      runner
    };

    this._lastRunnerId = runner.id;

    this._runners.push(runnerInfo);
    this._runners.sort((a, b) => a.start - b.start);
    this._runnerIds = this._runners.map((info) => info.runner.id);

    this.updateTime()._continue();
    return this
  }

  seek(dt) {
    return this.time(this._time + dt)
  }

  source(fn) {
    if (fn == null) return this._timeSource
    this._timeSource = fn;
    return this
  }

  speed(speed) {
    if (speed == null) return this._speed
    this._speed = speed;
    return this
  }

  stop() {
    // Go to start and pause
    this.time(0);
    return this.pause()
  }

  time(time) {
    if (time == null) return this._time
    this._time = time;
    return this._continue(true)
  }

  // Remove the runner from this timeline
  unschedule(runner) {
    const index = this._runnerIds.indexOf(runner.id);
    if (index < 0) return this

    this._runners.splice(index, 1);
    this._runnerIds.splice(index, 1);

    runner.timeline(null);
    return this
  }

  // Makes sure, that after pausing the time doesn't jump
  updateTime() {
    if (!this.active()) {
      this._lastSourceTime = this._timeSource();
    }
    return this
  }

  // Checks if we are running and continues the animation
  _continue(immediateStep = false) {
    Animator.cancelFrame(this._nextFrame);
    this._nextFrame = null;

    if (immediateStep) return this._stepImmediate()
    if (this._paused) return this

    this._nextFrame = Animator.frame(this._step);
    return this
  }

  _stepFn(immediateStep = false) {
    // Get the time delta from the last time and update the time
    const time = this._timeSource();
    let dtSource = time - this._lastSourceTime;

    if (immediateStep) dtSource = 0;

    const dtTime = this._speed * dtSource + (this._time - this._lastStepTime);
    this._lastSourceTime = time;

    // Only update the time if we use the timeSource.
    // Otherwise use the current time
    if (!immediateStep) {
      // Update the time
      this._time += dtTime;
      this._time = this._time < 0 ? 0 : this._time;
    }
    this._lastStepTime = this._time;
    this.fire('time', this._time);

    // This is for the case that the timeline was seeked so that the time
    // is now before the startTime of the runner. That is why we need to set
    // the runner to position 0

    // FIXME:
    // However, resetting in insertion order leads to bugs. Considering the case,
    // where 2 runners change the same attribute but in different times,
    // resetting both of them will lead to the case where the later defined
    // runner always wins the reset even if the other runner started earlier
    // and therefore should win the attribute battle
    // this can be solved by resetting them backwards
    for (let k = this._runners.length; k--; ) {
      // Get and run the current runner and ignore it if its inactive
      const runnerInfo = this._runners[k];
      const runner = runnerInfo.runner;

      // Make sure that we give the actual difference
      // between runner start time and now
      const dtToStart = this._time - runnerInfo.start;

      // Dont run runner if not started yet
      // and try to reset it
      if (dtToStart <= 0) {
        runner.reset();
      }
    }

    // Run all of the runners directly
    let runnersLeft = false;
    for (let i = 0, len = this._runners.length; i < len; i++) {
      // Get and run the current runner and ignore it if its inactive
      const runnerInfo = this._runners[i];
      const runner = runnerInfo.runner;
      let dt = dtTime;

      // Make sure that we give the actual difference
      // between runner start time and now
      const dtToStart = this._time - runnerInfo.start;

      // Dont run runner if not started yet
      if (dtToStart <= 0) {
        runnersLeft = true;
        continue
      } else if (dtToStart < dt) {
        // Adjust dt to make sure that animation is on point
        dt = dtToStart;
      }

      if (!runner.active()) continue

      // If this runner is still going, signal that we need another animation
      // frame, otherwise, remove the completed runner
      const finished = runner.step(dt).done;
      if (!finished) {
        runnersLeft = true;
        // continue
      } else if (runnerInfo.persist !== true) {
        // runner is finished. And runner might get removed
        const endTime = runner.duration() - runner.time() + this._time;

        if (endTime + runnerInfo.persist < this._time) {
          // Delete runner and correct index
          runner.unschedule();
          --i;
          --len;
        }
      }
    }

    // Basically: we continue when there are runners right from us in time
    // when -->, and when runners are left from us when <--
    if (
      (runnersLeft && !(this._speed < 0 && this._time === 0)) ||
      (this._runnerIds.length && this._speed < 0 && this._time > 0)
    ) {
      this._continue();
    } else {
      this.pause();
      this.fire('finished');
    }

    return this
  }

  terminate() {
    // cleanup memory

    // Store the timing variables
    this._startTime = 0;
    this._speed = 1.0;

    // Determines how long a runner is hold in memory. Can be a dt or true/false
    this._persist = 0;

    // Keep track of the running animations and their starting parameters
    this._nextFrame = null;
    this._paused = true;
    this._runners = [];
    this._runnerIds = [];
    this._lastRunnerId = -1;
    this._time = 0;
    this._lastSourceTime = 0;
    this._lastStepTime = 0;

    // Make sure that step is always called in class context
    this._step = this._stepFn.bind(this, false);
    this._stepImmediate = this._stepFn.bind(this, true);
  }
}

registerMethods({
  Element: {
    timeline: function (timeline) {
      if (timeline == null) {
        this._timeline = this._timeline || new Timeline();
        return this._timeline
      } else {
        this._timeline = timeline;
        return this
      }
    }
  }
});

class Runner extends EventTarget {
  constructor(options) {
    super();

    // Store a unique id on the runner, so that we can identify it later
    this.id = Runner.id++;

    // Ensure a default value
    options = options == null ? timeline.duration : options;

    // Ensure that we get a controller
    options = typeof options === 'function' ? new Controller(options) : options;

    // Declare all of the variables
    this._element = null;
    this._timeline = null;
    this.done = false;
    this._queue = [];

    // Work out the stepper and the duration
    this._duration = typeof options === 'number' && options;
    this._isDeclarative = options instanceof Controller;
    this._stepper = this._isDeclarative ? options : new Ease();

    // We copy the current values from the timeline because they can change
    this._history = {};

    // Store the state of the runner
    this.enabled = true;
    this._time = 0;
    this._lastTime = 0;

    // At creation, the runner is in reset state
    this._reseted = true;

    // Save transforms applied to this runner
    this.transforms = new Matrix();
    this.transformId = 1;

    // Looping variables
    this._haveReversed = false;
    this._reverse = false;
    this._loopsDone = 0;
    this._swing = false;
    this._wait = 0;
    this._times = 1;

    this._frameId = null;

    // Stores how long a runner is stored after being done
    this._persist = this._isDeclarative ? true : null;
  }

  static sanitise(duration, delay, when) {
    // Initialise the default parameters
    let times = 1;
    let swing = false;
    let wait = 0;
    duration = duration ?? timeline.duration;
    delay = delay ?? timeline.delay;
    when = when || 'last';

    // If we have an object, unpack the values
    if (typeof duration === 'object' && !(duration instanceof Stepper)) {
      delay = duration.delay ?? delay;
      when = duration.when ?? when;
      swing = duration.swing || swing;
      times = duration.times ?? times;
      wait = duration.wait ?? wait;
      duration = duration.duration ?? timeline.duration;
    }

    return {
      duration: duration,
      delay: delay,
      swing: swing,
      times: times,
      wait: wait,
      when: when
    }
  }

  active(enabled) {
    if (enabled == null) return this.enabled
    this.enabled = enabled;
    return this
  }

  /*
  Private Methods
  ===============
  Methods that shouldn't be used externally
  */
  addTransform(transform) {
    this.transforms.lmultiplyO(transform);
    return this
  }

  after(fn) {
    return this.on('finished', fn)
  }

  animate(duration, delay, when) {
    const o = Runner.sanitise(duration, delay, when);
    const runner = new Runner(o.duration);
    if (this._timeline) runner.timeline(this._timeline);
    if (this._element) runner.element(this._element);
    return runner.loop(o).schedule(o.delay, o.when)
  }

  clearTransform() {
    this.transforms = new Matrix();
    return this
  }

  // TODO: Keep track of all transformations so that deletion is faster
  clearTransformsFromQueue() {
    if (
      !this.done ||
      !this._timeline ||
      !this._timeline._runnerIds.includes(this.id)
    ) {
      this._queue = this._queue.filter((item) => {
        return !item.isTransform
      });
    }
  }

  delay(delay) {
    return this.animate(0, delay)
  }

  duration() {
    return this._times * (this._wait + this._duration) - this._wait
  }

  during(fn) {
    return this.queue(null, fn)
  }

  ease(fn) {
    this._stepper = new Ease(fn);
    return this
  }
  /*
  Runner Definitions
  ==================
  These methods help us define the runtime behaviour of the Runner or they
  help us make new runners from the current runner
  */

  element(element) {
    if (element == null) return this._element
    this._element = element;
    element._prepareRunner();
    return this
  }

  finish() {
    return this.step(Infinity)
  }

  loop(times, swing, wait) {
    // Deal with the user passing in an object
    if (typeof times === 'object') {
      swing = times.swing;
      wait = times.wait;
      times = times.times;
    }

    // Sanitise the values and store them
    this._times = times || Infinity;
    this._swing = swing || false;
    this._wait = wait || 0;

    // Allow true to be passed
    if (this._times === true) {
      this._times = Infinity;
    }

    return this
  }

  loops(p) {
    const loopDuration = this._duration + this._wait;
    if (p == null) {
      const loopsDone = Math.floor(this._time / loopDuration);
      const relativeTime = this._time - loopsDone * loopDuration;
      const position = relativeTime / this._duration;
      return Math.min(loopsDone + position, this._times)
    }
    const whole = Math.floor(p);
    const partial = p % 1;
    const time = loopDuration * whole + this._duration * partial;
    return this.time(time)
  }

  persist(dtOrForever) {
    if (dtOrForever == null) return this._persist
    this._persist = dtOrForever;
    return this
  }

  position(p) {
    // Get all of the variables we need
    const x = this._time;
    const d = this._duration;
    const w = this._wait;
    const t = this._times;
    const s = this._swing;
    const r = this._reverse;
    let position;

    if (p == null) {
      /*
      This function converts a time to a position in the range [0, 1]
      The full explanation can be found in this desmos demonstration
        https://www.desmos.com/calculator/u4fbavgche
      The logic is slightly simplified here because we can use booleans
      */

      // Figure out the value without thinking about the start or end time
      const f = function (x) {
        const swinging = s * Math.floor((x % (2 * (w + d))) / (w + d));
        const backwards = (swinging && !r) || (!swinging && r);
        const uncliped =
          (Math.pow(-1, backwards) * (x % (w + d))) / d + backwards;
        const clipped = Math.max(Math.min(uncliped, 1), 0);
        return clipped
      };

      // Figure out the value by incorporating the start time
      const endTime = t * (w + d) - w;
      position =
        x <= 0
          ? Math.round(f(1e-5))
          : x < endTime
            ? f(x)
            : Math.round(f(endTime - 1e-5));
      return position
    }

    // Work out the loops done and add the position to the loops done
    const loopsDone = Math.floor(this.loops());
    const swingForward = s && loopsDone % 2 === 0;
    const forwards = (swingForward && !r) || (r && swingForward);
    position = loopsDone + (forwards ? p : 1 - p);
    return this.loops(position)
  }

  progress(p) {
    if (p == null) {
      return Math.min(1, this._time / this.duration())
    }
    return this.time(p * this.duration())
  }

  /*
  Basic Functionality
  ===================
  These methods allow us to attach basic functions to the runner directly
  */
  queue(initFn, runFn, retargetFn, isTransform) {
    this._queue.push({
      initialiser: initFn || noop,
      runner: runFn || noop,
      retarget: retargetFn,
      isTransform: isTransform,
      initialised: false,
      finished: false
    });
    const timeline = this.timeline();
    timeline && this.timeline()._continue();
    return this
  }

  reset() {
    if (this._reseted) return this
    this.time(0);
    this._reseted = true;
    return this
  }

  reverse(reverse) {
    this._reverse = reverse == null ? !this._reverse : reverse;
    return this
  }

  schedule(timeline, delay, when) {
    // The user doesn't need to pass a timeline if we already have one
    if (!(timeline instanceof Timeline)) {
      when = delay;
      delay = timeline;
      timeline = this.timeline();
    }

    // If there is no timeline, yell at the user...
    if (!timeline) {
      throw Error('Runner cannot be scheduled without timeline')
    }

    // Schedule the runner on the timeline provided
    timeline.schedule(this, delay, when);
    return this
  }

  step(dt) {
    // If we are inactive, this stepper just gets skipped
    if (!this.enabled) return this

    // Update the time and get the new position
    dt = dt == null ? 16 : dt;
    this._time += dt;
    const position = this.position();

    // Figure out if we need to run the stepper in this frame
    const running = this._lastPosition !== position && this._time >= 0;
    this._lastPosition = position;

    // Figure out if we just started
    const duration = this.duration();
    const justStarted = this._lastTime <= 0 && this._time > 0;
    const justFinished = this._lastTime < duration && this._time >= duration;

    this._lastTime = this._time;
    if (justStarted) {
      this.fire('start', this);
    }

    // Work out if the runner is finished set the done flag here so animations
    // know, that they are running in the last step (this is good for
    // transformations which can be merged)
    const declarative = this._isDeclarative;
    this.done = !declarative && !justFinished && this._time >= duration;

    // Runner is running. So its not in reset state anymore
    this._reseted = false;

    let converged = false;
    // Call initialise and the run function
    if (running || declarative) {
      this._initialise(running);

      // clear the transforms on this runner so they dont get added again and again
      this.transforms = new Matrix();
      converged = this._run(declarative ? dt : position);

      this.fire('step', this);
    }
    // correct the done flag here
    // declarative animations itself know when they converged
    this.done = this.done || (converged && declarative);
    if (justFinished) {
      this.fire('finished', this);
    }
    return this
  }

  /*
  Runner animation methods
  ========================
  Control how the animation plays
  */
  time(time) {
    if (time == null) {
      return this._time
    }
    const dt = time - this._time;
    this.step(dt);
    return this
  }

  timeline(timeline) {
    // check explicitly for undefined so we can set the timeline to null
    if (typeof timeline === 'undefined') return this._timeline
    this._timeline = timeline;
    return this
  }

  unschedule() {
    const timeline = this.timeline();
    timeline && timeline.unschedule(this);
    return this
  }

  // Run each initialise function in the runner if required
  _initialise(running) {
    // If we aren't running, we shouldn't initialise when not declarative
    if (!running && !this._isDeclarative) return

    // Loop through all of the initialisers
    for (let i = 0, len = this._queue.length; i < len; ++i) {
      // Get the current initialiser
      const current = this._queue[i];

      // Determine whether we need to initialise
      const needsIt = this._isDeclarative || (!current.initialised && running);
      running = !current.finished;

      // Call the initialiser if we need to
      if (needsIt && running) {
        current.initialiser.call(this);
        current.initialised = true;
      }
    }
  }

  // Save a morpher to the morpher list so that we can retarget it later
  _rememberMorpher(method, morpher) {
    this._history[method] = {
      morpher: morpher,
      caller: this._queue[this._queue.length - 1]
    };

    // We have to resume the timeline in case a controller
    // is already done without being ever run
    // This can happen when e.g. this is done:
    //    anim = el.animate(new SVG.Spring)
    // and later
    //    anim.move(...)
    if (this._isDeclarative) {
      const timeline = this.timeline();
      timeline && timeline.play();
    }
  }

  // Try to set the target for a morpher if the morpher exists, otherwise
  // Run each run function for the position or dt given
  _run(positionOrDt) {
    // Run all of the _queue directly
    let allfinished = true;
    for (let i = 0, len = this._queue.length; i < len; ++i) {
      // Get the current function to run
      const current = this._queue[i];

      // Run the function if its not finished, we keep track of the finished
      // flag for the sake of declarative _queue
      const converged = current.runner.call(this, positionOrDt);
      current.finished = current.finished || converged === true;
      allfinished = allfinished && current.finished;
    }

    // We report when all of the constructors are finished
    return allfinished
  }

  // do nothing and return false
  _tryRetarget(method, target, extra) {
    if (this._history[method]) {
      // if the last method wasn't even initialised, throw it away
      if (!this._history[method].caller.initialised) {
        const index = this._queue.indexOf(this._history[method].caller);
        this._queue.splice(index, 1);
        return false
      }

      // for the case of transformations, we use the special retarget function
      // which has access to the outer scope
      if (this._history[method].caller.retarget) {
        this._history[method].caller.retarget.call(this, target, extra);
        // for everything else a simple morpher change is sufficient
      } else {
        this._history[method].morpher.to(target);
      }

      this._history[method].caller.finished = false;
      const timeline = this.timeline();
      timeline && timeline.play();
      return true
    }
    return false
  }
}

Runner.id = 0;

class FakeRunner {
  constructor(transforms = new Matrix(), id = -1, done = true) {
    this.transforms = transforms;
    this.id = id;
    this.done = done;
  }

  clearTransformsFromQueue() {}
}

extend([Runner, FakeRunner], {
  mergeWith(runner) {
    return new FakeRunner(
      runner.transforms.lmultiply(this.transforms),
      runner.id
    )
  }
});

// FakeRunner.emptyRunner = new FakeRunner()

const lmultiply = (last, curr) => last.lmultiplyO(curr);
const getRunnerTransform = (runner) => runner.transforms;

function mergeTransforms() {
  // Find the matrix to apply to the element and apply it
  const runners = this._transformationRunners.runners;
  const netTransform = runners
    .map(getRunnerTransform)
    .reduce(lmultiply, new Matrix());

  this.transform(netTransform);

  this._transformationRunners.merge();

  if (this._transformationRunners.length() === 1) {
    this._frameId = null;
  }
}

class RunnerArray {
  constructor() {
    this.runners = [];
    this.ids = [];
  }

  add(runner) {
    if (this.runners.includes(runner)) return
    const id = runner.id + 1;

    this.runners.push(runner);
    this.ids.push(id);

    return this
  }

  clearBefore(id) {
    const deleteCnt = this.ids.indexOf(id + 1) || 1;
    this.ids.splice(0, deleteCnt, 0);
    this.runners
      .splice(0, deleteCnt, new FakeRunner())
      .forEach((r) => r.clearTransformsFromQueue());
    return this
  }

  edit(id, newRunner) {
    const index = this.ids.indexOf(id + 1);
    this.ids.splice(index, 1, id + 1);
    this.runners.splice(index, 1, newRunner);
    return this
  }

  getByID(id) {
    return this.runners[this.ids.indexOf(id + 1)]
  }

  length() {
    return this.ids.length
  }

  merge() {
    let lastRunner = null;
    for (let i = 0; i < this.runners.length; ++i) {
      const runner = this.runners[i];

      const condition =
        lastRunner &&
        runner.done &&
        lastRunner.done &&
        // don't merge runner when persisted on timeline
        (!runner._timeline ||
          !runner._timeline._runnerIds.includes(runner.id)) &&
        (!lastRunner._timeline ||
          !lastRunner._timeline._runnerIds.includes(lastRunner.id));

      if (condition) {
        // the +1 happens in the function
        this.remove(runner.id);
        const newRunner = runner.mergeWith(lastRunner);
        this.edit(lastRunner.id, newRunner);
        lastRunner = newRunner;
        --i;
      } else {
        lastRunner = runner;
      }
    }

    return this
  }

  remove(id) {
    const index = this.ids.indexOf(id + 1);
    this.ids.splice(index, 1);
    this.runners.splice(index, 1);
    return this
  }
}

registerMethods({
  Element: {
    animate(duration, delay, when) {
      const o = Runner.sanitise(duration, delay, when);
      const timeline = this.timeline();
      return new Runner(o.duration)
        .loop(o)
        .element(this)
        .timeline(timeline.play())
        .schedule(o.delay, o.when)
    },

    delay(by, when) {
      return this.animate(0, by, when)
    },

    // this function searches for all runners on the element and deletes the ones
    // which run before the current one. This is because absolute transformations
    // overwrite anything anyway so there is no need to waste time computing
    // other runners
    _clearTransformRunnersBefore(currentRunner) {
      this._transformationRunners.clearBefore(currentRunner.id);
    },

    _currentTransform(current) {
      return (
        this._transformationRunners.runners
          // we need the equal sign here to make sure, that also transformations
          // on the same runner which execute before the current transformation are
          // taken into account
          .filter((runner) => runner.id <= current.id)
          .map(getRunnerTransform)
          .reduce(lmultiply, new Matrix())
      )
    },

    _addRunner(runner) {
      this._transformationRunners.add(runner);

      // Make sure that the runner merge is executed at the very end of
      // all Animator functions. That is why we use immediate here to execute
      // the merge right after all frames are run
      Animator.cancelImmediate(this._frameId);
      this._frameId = Animator.immediate(mergeTransforms.bind(this));
    },

    _prepareRunner() {
      if (this._frameId == null) {
        this._transformationRunners = new RunnerArray().add(
          new FakeRunner(new Matrix(this))
        );
      }
    }
  }
});

// Will output the elements from array A that are not in the array B
const difference = (a, b) => a.filter((x) => !b.includes(x));

extend(Runner, {
  attr(a, v) {
    return this.styleAttr('attr', a, v)
  },

  // Add animatable styles
  css(s, v) {
    return this.styleAttr('css', s, v)
  },

  styleAttr(type, nameOrAttrs, val) {
    if (typeof nameOrAttrs === 'string') {
      return this.styleAttr(type, { [nameOrAttrs]: val })
    }

    let attrs = nameOrAttrs;
    if (this._tryRetarget(type, attrs)) return this

    let morpher = new Morphable(this._stepper).to(attrs);
    let keys = Object.keys(attrs);

    this.queue(
      function () {
        morpher = morpher.from(this.element()[type](keys));
      },
      function (pos) {
        this.element()[type](morpher.at(pos).valueOf());
        return morpher.done()
      },
      function (newToAttrs) {
        // Check if any new keys were added
        const newKeys = Object.keys(newToAttrs);
        const differences = difference(newKeys, keys);

        // If their are new keys, initialize them and add them to morpher
        if (differences.length) {
          // Get the values
          const addedFromAttrs = this.element()[type](differences);

          // Get the already initialized values
          const oldFromAttrs = new ObjectBag(morpher.from()).valueOf();

          // Merge old and new
          Object.assign(oldFromAttrs, addedFromAttrs);
          morpher.from(oldFromAttrs);
        }

        // Get the object from the morpher
        const oldToAttrs = new ObjectBag(morpher.to()).valueOf();

        // Merge in new attributes
        Object.assign(oldToAttrs, newToAttrs);

        // Change morpher target
        morpher.to(oldToAttrs);

        // Make sure that we save the work we did so we don't need it to do again
        keys = newKeys;
        attrs = newToAttrs;
      }
    );

    this._rememberMorpher(type, morpher);
    return this
  },

  zoom(level, point) {
    if (this._tryRetarget('zoom', level, point)) return this

    let morpher = new Morphable(this._stepper).to(new SVGNumber(level));

    this.queue(
      function () {
        morpher = morpher.from(this.element().zoom());
      },
      function (pos) {
        this.element().zoom(morpher.at(pos), point);
        return morpher.done()
      },
      function (newLevel, newPoint) {
        point = newPoint;
        morpher.to(newLevel);
      }
    );

    this._rememberMorpher('zoom', morpher);
    return this
  },

  /**
   ** absolute transformations
   **/

  //
  // M v -----|-----(D M v = F v)------|----->  T v
  //
  // 1. define the final state (T) and decompose it (once)
  //    t = [tx, ty, the, lam, sy, sx]
  // 2. on every frame: pull the current state of all previous transforms
  //    (M - m can change)
  //   and then write this as m = [tx0, ty0, the0, lam0, sy0, sx0]
  // 3. Find the interpolated matrix F(pos) = m + pos * (t - m)
  //   - Note F(0) = M
  //   - Note F(1) = T
  // 4. Now you get the delta matrix as a result: D = F * inv(M)

  transform(transforms, relative, affine) {
    // If we have a declarative function, we should retarget it if possible
    relative = transforms.relative || relative;
    if (
      this._isDeclarative &&
      !relative &&
      this._tryRetarget('transform', transforms)
    ) {
      return this
    }

    // Parse the parameters
    const isMatrix = Matrix.isMatrixLike(transforms);
    affine =
      transforms.affine != null
        ? transforms.affine
        : affine != null
          ? affine
          : !isMatrix;

    // Create a morpher and set its type
    const morpher = new Morphable(this._stepper).type(
      affine ? TransformBag : Matrix
    );

    let origin;
    let element;
    let current;
    let currentAngle;
    let startTransform;

    function setup() {
      // make sure element and origin is defined
      element = element || this.element();
      origin = origin || getOrigin(transforms, element);

      startTransform = new Matrix(relative ? undefined : element);

      // add the runner to the element so it can merge transformations
      element._addRunner(this);

      // Deactivate all transforms that have run so far if we are absolute
      if (!relative) {
        element._clearTransformRunnersBefore(this);
      }
    }

    function run(pos) {
      // clear all other transforms before this in case something is saved
      // on this runner. We are absolute. We dont need these!
      if (!relative) this.clearTransform();

      const { x, y } = new Point(origin).transform(
        element._currentTransform(this)
      );

      let target = new Matrix({ ...transforms, origin: [x, y] });
      let start = this._isDeclarative && current ? current : startTransform;

      if (affine) {
        target = target.decompose(x, y);
        start = start.decompose(x, y);

        // Get the current and target angle as it was set
        const rTarget = target.rotate;
        const rCurrent = start.rotate;

        // Figure out the shortest path to rotate directly
        const possibilities = [rTarget - 360, rTarget, rTarget + 360];
        const distances = possibilities.map((a) => Math.abs(a - rCurrent));
        const shortest = Math.min(...distances);
        const index = distances.indexOf(shortest);
        target.rotate = possibilities[index];
      }

      if (relative) {
        // we have to be careful here not to overwrite the rotation
        // with the rotate method of Matrix
        if (!isMatrix) {
          target.rotate = transforms.rotate || 0;
        }
        if (this._isDeclarative && currentAngle) {
          start.rotate = currentAngle;
        }
      }

      morpher.from(start);
      morpher.to(target);

      const affineParameters = morpher.at(pos);
      currentAngle = affineParameters.rotate;
      current = new Matrix(affineParameters);

      this.addTransform(current);
      element._addRunner(this);
      return morpher.done()
    }

    function retarget(newTransforms) {
      // only get a new origin if it changed since the last call
      if (
        (newTransforms.origin || 'center').toString() !==
        (transforms.origin || 'center').toString()
      ) {
        origin = getOrigin(newTransforms, element);
      }

      // overwrite the old transformations with the new ones
      transforms = { ...newTransforms, origin };
    }

    this.queue(setup, run, retarget, true);
    this._isDeclarative && this._rememberMorpher('transform', morpher);
    return this
  },

  // Animatable x-axis
  x(x) {
    return this._queueNumber('x', x)
  },

  // Animatable y-axis
  y(y) {
    return this._queueNumber('y', y)
  },

  ax(x) {
    return this._queueNumber('ax', x)
  },

  ay(y) {
    return this._queueNumber('ay', y)
  },

  dx(x = 0) {
    return this._queueNumberDelta('x', x)
  },

  dy(y = 0) {
    return this._queueNumberDelta('y', y)
  },

  dmove(x, y) {
    return this.dx(x).dy(y)
  },

  _queueNumberDelta(method, to) {
    to = new SVGNumber(to);

    // Try to change the target if we have this method already registered
    if (this._tryRetarget(method, to)) return this

    // Make a morpher and queue the animation
    const morpher = new Morphable(this._stepper).to(to);
    let from = null;
    this.queue(
      function () {
        from = this.element()[method]();
        morpher.from(from);
        morpher.to(from + to);
      },
      function (pos) {
        this.element()[method](morpher.at(pos));
        return morpher.done()
      },
      function (newTo) {
        morpher.to(from + new SVGNumber(newTo));
      }
    );

    // Register the morpher so that if it is changed again, we can retarget it
    this._rememberMorpher(method, morpher);
    return this
  },

  _queueObject(method, to) {
    // Try to change the target if we have this method already registered
    if (this._tryRetarget(method, to)) return this

    // Make a morpher and queue the animation
    const morpher = new Morphable(this._stepper).to(to);
    this.queue(
      function () {
        morpher.from(this.element()[method]());
      },
      function (pos) {
        this.element()[method](morpher.at(pos));
        return morpher.done()
      }
    );

    // Register the morpher so that if it is changed again, we can retarget it
    this._rememberMorpher(method, morpher);
    return this
  },

  _queueNumber(method, value) {
    return this._queueObject(method, new SVGNumber(value))
  },

  // Animatable center x-axis
  cx(x) {
    return this._queueNumber('cx', x)
  },

  // Animatable center y-axis
  cy(y) {
    return this._queueNumber('cy', y)
  },

  // Add animatable move
  move(x, y) {
    return this.x(x).y(y)
  },

  amove(x, y) {
    return this.ax(x).ay(y)
  },

  // Add animatable center
  center(x, y) {
    return this.cx(x).cy(y)
  },

  // Add animatable size
  size(width, height) {
    // animate bbox based size for all other elements
    let box;

    if (!width || !height) {
      box = this._element.bbox();
    }

    if (!width) {
      width = (box.width / box.height) * height;
    }

    if (!height) {
      height = (box.height / box.width) * width;
    }

    return this.width(width).height(height)
  },

  // Add animatable width
  width(width) {
    return this._queueNumber('width', width)
  },

  // Add animatable height
  height(height) {
    return this._queueNumber('height', height)
  },

  // Add animatable plot
  plot(a, b, c, d) {
    // Lines can be plotted with 4 arguments
    if (arguments.length === 4) {
      return this.plot([a, b, c, d])
    }

    if (this._tryRetarget('plot', a)) return this

    const morpher = new Morphable(this._stepper)
      .type(this._element.MorphArray)
      .to(a);

    this.queue(
      function () {
        morpher.from(this._element.array());
      },
      function (pos) {
        this._element.plot(morpher.at(pos));
        return morpher.done()
      }
    );

    this._rememberMorpher('plot', morpher);
    return this
  },

  // Add leading method
  leading(value) {
    return this._queueNumber('leading', value)
  },

  // Add animatable viewbox
  viewbox(x, y, width, height) {
    return this._queueObject('viewbox', new Box(x, y, width, height))
  },

  update(o) {
    if (typeof o !== 'object') {
      return this.update({
        offset: arguments[0],
        color: arguments[1],
        opacity: arguments[2]
      })
    }

    if (o.opacity != null) this.attr('stop-opacity', o.opacity);
    if (o.color != null) this.attr('stop-color', o.color);
    if (o.offset != null) this.attr('offset', o.offset);

    return this
  }
});

extend(Runner, { rx, ry, from, to });
register(Runner, 'Runner');

class Svg extends Container {
  constructor(node, attrs = node) {
    super(nodeOrNew('svg', node), attrs);
    this.namespace();
  }

  // Creates and returns defs element
  defs() {
    if (!this.isRoot()) return this.root().defs()

    return adopt(this.node.querySelector('defs')) || this.put(new Defs())
  }

  isRoot() {
    return (
      !this.node.parentNode ||
      (!(this.node.parentNode instanceof globals.window.SVGElement) &&
        this.node.parentNode.nodeName !== '#document-fragment')
    )
  }

  // Add namespaces
  namespace() {
    if (!this.isRoot()) return this.root().namespace()
    return this.attr({ xmlns: svg, version: '1.1' }).attr(
      'xmlns:xlink',
      xlink,
      xmlns
    )
  }

  removeNamespace() {
    return this.attr({ xmlns: null, version: null })
      .attr('xmlns:xlink', null, xmlns)
      .attr('xmlns:svgjs', null, xmlns)
  }

  // Check if this is a root svg
  // If not, call root() from this element
  root() {
    if (this.isRoot()) return this
    return super.root()
  }
}

registerMethods({
  Container: {
    // Create nested svg document
    nested: wrapWithAttrCheck(function () {
      return this.put(new Svg())
    })
  }
});

register(Svg, 'Svg', true);

class Symbol extends Container {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('symbol', node), attrs);
  }
}

registerMethods({
  Container: {
    symbol: wrapWithAttrCheck(function () {
      return this.put(new Symbol())
    })
  }
});

register(Symbol, 'Symbol');

// Create plain text node
function plain(text) {
  // clear if build mode is disabled
  if (this._build === false) {
    this.clear();
  }

  // create text node
  this.node.appendChild(globals.document.createTextNode(text));

  return this
}

// Get length of text element
function length() {
  return this.node.getComputedTextLength()
}

// Move over x-axis
// Text is moved by its bounding box
// text-anchor does NOT matter
function x$1(x, box = this.bbox()) {
  if (x == null) {
    return box.x
  }

  return this.attr('x', this.attr('x') + x - box.x)
}

// Move over y-axis
function y$1(y, box = this.bbox()) {
  if (y == null) {
    return box.y
  }

  return this.attr('y', this.attr('y') + y - box.y)
}

function move$1(x, y, box = this.bbox()) {
  return this.x(x, box).y(y, box)
}

// Move center over x-axis
function cx(x, box = this.bbox()) {
  if (x == null) {
    return box.cx
  }

  return this.attr('x', this.attr('x') + x - box.cx)
}

// Move center over y-axis
function cy(y, box = this.bbox()) {
  if (y == null) {
    return box.cy
  }

  return this.attr('y', this.attr('y') + y - box.cy)
}

function center(x, y, box = this.bbox()) {
  return this.cx(x, box).cy(y, box)
}

function ax(x) {
  return this.attr('x', x)
}

function ay(y) {
  return this.attr('y', y)
}

function amove(x, y) {
  return this.ax(x).ay(y)
}

// Enable / disable build mode
function build(build) {
  this._build = !!build;
  return this
}

var textable = /*#__PURE__*/Object.freeze({
  __proto__: null,
  amove: amove,
  ax: ax,
  ay: ay,
  build: build,
  center: center,
  cx: cx,
  cy: cy,
  length: length,
  move: move$1,
  plain: plain,
  x: x$1,
  y: y$1
});

class Text extends Shape {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('text', node), attrs);

    this.dom.leading = this.dom.leading ?? new SVGNumber(1.3); // store leading value for rebuilding
    this._rebuild = true; // enable automatic updating of dy values
    this._build = false; // disable build mode for adding multiple lines
  }

  // Set / get leading
  leading(value) {
    // act as getter
    if (value == null) {
      return this.dom.leading
    }

    // act as setter
    this.dom.leading = new SVGNumber(value);

    return this.rebuild()
  }

  // Rebuild appearance type
  rebuild(rebuild) {
    // store new rebuild flag if given
    if (typeof rebuild === 'boolean') {
      this._rebuild = rebuild;
    }

    // define position of all lines
    if (this._rebuild) {
      const self = this;
      let blankLineOffset = 0;
      const leading = this.dom.leading;

      this.each(function (i) {
        if (isDescriptive(this.node)) return

        const fontSize = globals.window
          .getComputedStyle(this.node)
          .getPropertyValue('font-size');

        const dy = leading * new SVGNumber(fontSize);

        if (this.dom.newLined) {
          this.attr('x', self.attr('x'));

          if (this.text() === '\n') {
            blankLineOffset += dy;
          } else {
            this.attr('dy', i ? dy + blankLineOffset : 0);
            blankLineOffset = 0;
          }
        }
      });

      this.fire('rebuild');
    }

    return this
  }

  // overwrite method from parent to set data properly
  setData(o) {
    this.dom = o;
    this.dom.leading = new SVGNumber(o.leading || 1.3);
    return this
  }

  writeDataToDom() {
    writeDataToDom(this, this.dom, { leading: 1.3 });
    return this
  }

  // Set the text content
  text(text) {
    // act as getter
    if (text === undefined) {
      const children = this.node.childNodes;
      let firstLine = 0;
      text = '';

      for (let i = 0, len = children.length; i < len; ++i) {
        // skip textPaths - they are no lines
        if (children[i].nodeName === 'textPath' || isDescriptive(children[i])) {
          if (i === 0) firstLine = i + 1;
          continue
        }

        // add newline if its not the first child and newLined is set to true
        if (
          i !== firstLine &&
          children[i].nodeType !== 3 &&
          adopt(children[i]).dom.newLined === true
        ) {
          text += '\n';
        }

        // add content of this node
        text += children[i].textContent;
      }

      return text
    }

    // remove existing content
    this.clear().build(true);

    if (typeof text === 'function') {
      // call block
      text.call(this, this);
    } else {
      // store text and make sure text is not blank
      text = (text + '').split('\n');

      // build new lines
      for (let j = 0, jl = text.length; j < jl; j++) {
        this.newLine(text[j]);
      }
    }

    // disable build mode and rebuild lines
    return this.build(false).rebuild()
  }
}

extend(Text, textable);

registerMethods({
  Container: {
    // Create text element
    text: wrapWithAttrCheck(function (text = '') {
      return this.put(new Text()).text(text)
    }),

    // Create plain text element
    plain: wrapWithAttrCheck(function (text = '') {
      return this.put(new Text()).plain(text)
    })
  }
});

register(Text, 'Text');

class Tspan extends Shape {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('tspan', node), attrs);
    this._build = false; // disable build mode for adding multiple lines
  }

  // Shortcut dx
  dx(dx) {
    return this.attr('dx', dx)
  }

  // Shortcut dy
  dy(dy) {
    return this.attr('dy', dy)
  }

  // Create new line
  newLine() {
    // mark new line
    this.dom.newLined = true;

    // fetch parent
    const text = this.parent();

    // early return in case we are not in a text element
    if (!(text instanceof Text)) {
      return this
    }

    const i = text.index(this);

    const fontSize = globals.window
      .getComputedStyle(this.node)
      .getPropertyValue('font-size');
    const dy = text.dom.leading * new SVGNumber(fontSize);

    // apply new position
    return this.dy(i ? dy : 0).attr('x', text.x())
  }

  // Set text content
  text(text) {
    if (text == null)
      return this.node.textContent + (this.dom.newLined ? '\n' : '')

    if (typeof text === 'function') {
      this.clear().build(true);
      text.call(this, this);
      this.build(false);
    } else {
      this.plain(text);
    }

    return this
  }
}

extend(Tspan, textable);

registerMethods({
  Tspan: {
    tspan: wrapWithAttrCheck(function (text = '') {
      const tspan = new Tspan();

      // clear if build mode is disabled
      if (!this._build) {
        this.clear();
      }

      // add new tspan
      return this.put(tspan).text(text)
    })
  },
  Text: {
    newLine: function (text = '') {
      return this.tspan(text).newLine()
    }
  }
});

register(Tspan, 'Tspan');

class Circle extends Shape {
  constructor(node, attrs = node) {
    super(nodeOrNew('circle', node), attrs);
  }

  radius(r) {
    return this.attr('r', r)
  }

  // Radius x value
  rx(rx) {
    return this.attr('r', rx)
  }

  // Alias radius x value
  ry(ry) {
    return this.rx(ry)
  }

  size(size) {
    return this.radius(new SVGNumber(size).divide(2))
  }
}

extend(Circle, { x: x$3, y: y$3, cx: cx$1, cy: cy$1, width: width$2, height: height$2 });

registerMethods({
  Container: {
    // Create circle element
    circle: wrapWithAttrCheck(function (size = 0) {
      return this.put(new Circle()).size(size).move(0, 0)
    })
  }
});

register(Circle, 'Circle');

class ClipPath extends Container {
  constructor(node, attrs = node) {
    super(nodeOrNew('clipPath', node), attrs);
  }

  // Unclip all clipped elements and remove itself
  remove() {
    // unclip all targets
    this.targets().forEach(function (el) {
      el.unclip();
    });

    // remove clipPath from parent
    return super.remove()
  }

  targets() {
    return baseFind('svg [clip-path*=' + this.id() + ']')
  }
}

registerMethods({
  Container: {
    // Create clipping element
    clip: wrapWithAttrCheck(function () {
      return this.defs().put(new ClipPath())
    })
  },
  Element: {
    // Distribute clipPath to svg element
    clipper() {
      return this.reference('clip-path')
    },

    clipWith(element) {
      // use given clip or create a new one
      const clipper =
        element instanceof ClipPath
          ? element
          : this.parent().clip().add(element);

      // apply mask
      return this.attr('clip-path', 'url(#' + clipper.id() + ')')
    },

    // Unclip element
    unclip() {
      return this.attr('clip-path', null)
    }
  }
});

register(ClipPath, 'ClipPath');

class ForeignObject extends Element$1 {
  constructor(node, attrs = node) {
    super(nodeOrNew('foreignObject', node), attrs);
  }
}

registerMethods({
  Container: {
    foreignObject: wrapWithAttrCheck(function (width, height) {
      return this.put(new ForeignObject()).size(width, height)
    })
  }
});

register(ForeignObject, 'ForeignObject');

function dmove(dx, dy) {
  this.children().forEach((child) => {
    let bbox;

    // We have to wrap this for elements that dont have a bbox
    // e.g. title and other descriptive elements
    try {
      // Get the childs bbox
      // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1905039
      // Because bbox for nested svgs returns the contents bbox in the coordinate space of the svg itself (weird!), we cant use bbox for svgs
      // Therefore we have to use getBoundingClientRect. But THAT is broken (as explained in the bug).
      // Funnily enough the broken behavior would work for us but that breaks it in chrome
      // So we have to replicate the broken behavior of FF by just reading the attributes of the svg itself
      bbox =
        child.node instanceof getWindow().SVGSVGElement
          ? new Box(child.attr(['x', 'y', 'width', 'height']))
          : child.bbox();
    } catch (e) {
      return
    }

    // Get childs matrix
    const m = new Matrix(child);
    // Translate childs matrix by amount and
    // transform it back into parents space
    const matrix = m.translate(dx, dy).transform(m.inverse());
    // Calculate new x and y from old box
    const p = new Point(bbox.x, bbox.y).transform(matrix);
    // Move element
    child.move(p.x, p.y);
  });

  return this
}

function dx(dx) {
  return this.dmove(dx, 0)
}

function dy(dy) {
  return this.dmove(0, dy)
}

function height(height, box = this.bbox()) {
  if (height == null) return box.height
  return this.size(box.width, height, box)
}

function move(x = 0, y = 0, box = this.bbox()) {
  const dx = x - box.x;
  const dy = y - box.y;

  return this.dmove(dx, dy)
}

function size(width, height, box = this.bbox()) {
  const p = proportionalSize(this, width, height, box);
  const scaleX = p.width / box.width;
  const scaleY = p.height / box.height;

  this.children().forEach((child) => {
    const o = new Point(box).transform(new Matrix(child).inverse());
    child.scale(scaleX, scaleY, o.x, o.y);
  });

  return this
}

function width(width, box = this.bbox()) {
  if (width == null) return box.width
  return this.size(width, box.height, box)
}

function x(x, box = this.bbox()) {
  if (x == null) return box.x
  return this.move(x, box.y, box)
}

function y(y, box = this.bbox()) {
  if (y == null) return box.y
  return this.move(box.x, y, box)
}

var containerGeometry = /*#__PURE__*/Object.freeze({
  __proto__: null,
  dmove: dmove,
  dx: dx,
  dy: dy,
  height: height,
  move: move,
  size: size,
  width: width,
  x: x,
  y: y
});

class G extends Container {
  constructor(node, attrs = node) {
    super(nodeOrNew('g', node), attrs);
  }
}

extend(G, containerGeometry);

registerMethods({
  Container: {
    // Create a group element
    group: wrapWithAttrCheck(function () {
      return this.put(new G())
    })
  }
});

register(G, 'G');

class A extends Container {
  constructor(node, attrs = node) {
    super(nodeOrNew('a', node), attrs);
  }

  // Link target attribute
  target(target) {
    return this.attr('target', target)
  }

  // Link url
  to(url) {
    return this.attr('href', url, xlink)
  }
}

extend(A, containerGeometry);

registerMethods({
  Container: {
    // Create a hyperlink element
    link: wrapWithAttrCheck(function (url) {
      return this.put(new A()).to(url)
    })
  },
  Element: {
    unlink() {
      const link = this.linker();

      if (!link) return this

      const parent = link.parent();

      if (!parent) {
        return this.remove()
      }

      const index = parent.index(link);
      parent.add(this, index);

      link.remove();
      return this
    },
    linkTo(url) {
      // reuse old link if possible
      let link = this.linker();

      if (!link) {
        link = new A();
        this.wrap(link);
      }

      if (typeof url === 'function') {
        url.call(link, link);
      } else {
        link.to(url);
      }

      return this
    },
    linker() {
      const link = this.parent();
      if (link && link.node.nodeName.toLowerCase() === 'a') {
        return link
      }

      return null
    }
  }
});

register(A, 'A');

class Mask extends Container {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('mask', node), attrs);
  }

  // Unmask all masked elements and remove itself
  remove() {
    // unmask all targets
    this.targets().forEach(function (el) {
      el.unmask();
    });

    // remove mask from parent
    return super.remove()
  }

  targets() {
    return baseFind('svg [mask*=' + this.id() + ']')
  }
}

registerMethods({
  Container: {
    mask: wrapWithAttrCheck(function () {
      return this.defs().put(new Mask())
    })
  },
  Element: {
    // Distribute mask to svg element
    masker() {
      return this.reference('mask')
    },

    maskWith(element) {
      // use given mask or create a new one
      const masker =
        element instanceof Mask ? element : this.parent().mask().add(element);

      // apply mask
      return this.attr('mask', 'url(#' + masker.id() + ')')
    },

    // Unmask element
    unmask() {
      return this.attr('mask', null)
    }
  }
});

register(Mask, 'Mask');

class Stop extends Element$1 {
  constructor(node, attrs = node) {
    super(nodeOrNew('stop', node), attrs);
  }

  // add color stops
  update(o) {
    if (typeof o === 'number' || o instanceof SVGNumber) {
      o = {
        offset: arguments[0],
        color: arguments[1],
        opacity: arguments[2]
      };
    }

    // set attributes
    if (o.opacity != null) this.attr('stop-opacity', o.opacity);
    if (o.color != null) this.attr('stop-color', o.color);
    if (o.offset != null) this.attr('offset', new SVGNumber(o.offset));

    return this
  }
}

registerMethods({
  Gradient: {
    // Add a color stop
    stop: function (offset, color, opacity) {
      return this.put(new Stop()).update(offset, color, opacity)
    }
  }
});

register(Stop, 'Stop');

function cssRule(selector, rule) {
  if (!selector) return ''
  if (!rule) return selector

  let ret = selector + '{';

  for (const i in rule) {
    ret += unCamelCase(i) + ':' + rule[i] + ';';
  }

  ret += '}';

  return ret
}

class Style extends Element$1 {
  constructor(node, attrs = node) {
    super(nodeOrNew('style', node), attrs);
  }

  addText(w = '') {
    this.node.textContent += w;
    return this
  }

  font(name, src, params = {}) {
    return this.rule('@font-face', {
      fontFamily: name,
      src: src,
      ...params
    })
  }

  rule(selector, obj) {
    return this.addText(cssRule(selector, obj))
  }
}

registerMethods('Dom', {
  style(selector, obj) {
    return this.put(new Style()).rule(selector, obj)
  },
  fontface(name, src, params) {
    return this.put(new Style()).font(name, src, params)
  }
});

register(Style, 'Style');

class TextPath extends Text {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('textPath', node), attrs);
  }

  // return the array of the path track element
  array() {
    const track = this.track();

    return track ? track.array() : null
  }

  // Plot path if any
  plot(d) {
    const track = this.track();
    let pathArray = null;

    if (track) {
      pathArray = track.plot(d);
    }

    return d == null ? pathArray : this
  }

  // Get the path element
  track() {
    return this.reference('href')
  }
}

registerMethods({
  Container: {
    textPath: wrapWithAttrCheck(function (text, path) {
      // Convert text to instance if needed
      if (!(text instanceof Text)) {
        text = this.text(text);
      }

      return text.path(path)
    })
  },
  Text: {
    // Create path for text to run on
    path: wrapWithAttrCheck(function (track, importNodes = true) {
      const textPath = new TextPath();

      // if track is a path, reuse it
      if (!(track instanceof Path$1)) {
        // create path element
        track = this.defs().path(track);
      }

      // link textPath to path and add content
      textPath.attr('href', '#' + track, xlink);

      // Transplant all nodes from text to textPath
      let node;
      if (importNodes) {
        while ((node = this.node.firstChild)) {
          textPath.node.appendChild(node);
        }
      }

      // add textPath element as child node and return textPath
      return this.put(textPath)
    }),

    // Get the textPath children
    textPath() {
      return this.findOne('textPath')
    }
  },
  Path: {
    // creates a textPath from this path
    text: wrapWithAttrCheck(function (text) {
      // Convert text to instance if needed
      if (!(text instanceof Text)) {
        text = new Text().addTo(this.parent()).text(text);
      }

      // Create textPath from text and path and return
      return text.path(this)
    }),

    targets() {
      return baseFind('svg textPath').filter((node) => {
        return (node.attr('href') || '').includes(this.id())
      })

      // Does not work in IE11. Use when IE support is dropped
      // return baseFind('svg textPath[*|href*=' + this.id() + ']')
    }
  }
});

TextPath.prototype.MorphArray = PathArray;
register(TextPath, 'TextPath');

class Use extends Shape {
  constructor(node, attrs = node) {
    super(nodeOrNew('use', node), attrs);
  }

  // Use element as a reference
  use(element, file) {
    // Set lined element
    return this.attr('href', (file || '') + '#' + element, xlink)
  }
}

registerMethods({
  Container: {
    // Create a use element
    use: wrapWithAttrCheck(function (element, file) {
      return this.put(new Use()).use(element, file)
    })
  }
});

register(Use, 'Use');

/* Optional Modules */
const SVG = makeInstance;

extend([Svg, Symbol, Image, Pattern, Marker], getMethodsFor('viewbox'));

extend([Line, Polyline, Polygon, Path$1], getMethodsFor('marker'));

extend(Text, getMethodsFor('Text'));
extend(Path$1, getMethodsFor('Path'));

extend(Defs, getMethodsFor('Defs'));

extend([Text, Tspan], getMethodsFor('Tspan'));

extend([Rect, Ellipse, Gradient, Runner], getMethodsFor('radius'));

extend(EventTarget, getMethodsFor('EventTarget'));
extend(Dom, getMethodsFor('Dom'));
extend(Element$1, getMethodsFor('Element'));
extend(Shape, getMethodsFor('Shape'));
extend([Container, Fragment], getMethodsFor('Container'));
extend(Gradient, getMethodsFor('Gradient'));

extend(Runner, getMethodsFor('Runner'));

List.extend(getMethodNames());

registerMorphableType([
  SVGNumber,
  Color,
  Box,
  Matrix,
  SVGArray,
  PointArray,
  PathArray,
  Point
]);

makeMorphable();

function createSvgCanvas(container) {

  try {

    if(!container) {
      throw 'Missing container';
    }

    const svgCanvas = SVG().addTo(container);
    return svgCanvas;

  } catch(e) {
    console.error( 'Charts → createSvgCanvas', e ); // eslint-disable-line
  }

}

function chart_init(customUtils = {}) {

  chartUtils.defaults??= {};

  chartUtils.defaults.colors = customUtils.defaults?.colors?? Object.values(default_colors);
  chartUtils.defaults.font = {

    // pattern per defaults.font
    // i valori commentati sono quelli di default
    // se non vanno modificati, non serve impostarli
    ...{
      // family: 'sans-serif',
      // size: 14,
      // stretch: 'normal',
      // style: 'normal',
      // variant: 'normal',
      // weight: 400
    },
    ...(customUtils.defaults?.font?? {})
  };


  chartUtils.createSvgCanvas = customUtils.createSvgCanvas?? createSvgCanvas;


  // console.log(chartUtils);

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

// horizontal bars


function bars({

  /**
    variabili e funzioni condivise importate da '../utils/init.js' (vedi)
    Può essere parzialmente o completamente integrata con funzioni specifiche
    (ad esempio per cambiare la modailità di implemntazione di svg.js, vedi demo).
    Lasciare come oggetto vuoto se non è necessario modificarlo
  */
  chartUtils = {},

  /** container (selettore o elemento DOM), se null viene restituito il codice SVG */
  container = null,

  /** svuota il container prima del rendering */
  emptyContainer = true,

  /**
    larghezza e altezza del grafico (px),
    Se il container è presente e i parametro `width` e `height` sono `null`,
    vengono utilizzate le dimensioni  del container.
    Se uno dei due valori non è impostato o ricavabile, viene generato un errore.
    NB: il padding del container viene considerato nelle dimensioni del grafico,
    è preferibile non impostarlo.
    Il valore 'auto' di height fa sì che l'altezza dell'svg sia calcolata sulla base
    del numero di barre e dei valori `barsGap` e `barsHeight`
  */
  width = null, // null || <value>
  height = 300, // <value> || null || 'auto'

  /** valori numerici da associare alle barre del grafico */
  values = [],

  /** etichette delle varie barre, l'indice di ogni elemento corrisponde a quello di `values` a cui si riferisce */
  labels = [],


  // TODO
  /**
    se true, gli elementi di `labels` vengono interpretati come elementi svg
    Le icone devono essere predisposte autonomamente dal grafico in termini di dimensioni, colori ecc.
    Verranno semplicemente posizionate secondo il valore a cui si riferiscono
  */
  // labelsAreIcons = false,

  /** Indica se mostrare o no i valori delle barre (mostrati dopo la barra) */
  showValues = true,

  /**
    Modalità di rappresentazione del valore mostrato.
    Se 'percent', il valore mostrato è la percentuale rispetto al totale dei valori
  */
  showValuesAs = 'number', // number, numbers, percent, euro

  /** In caso di visualizzazione dei valori (showValues === true), numero di decimali da mostrare */
  showValuesFractionDigits = 2,

  /** In caso di visualizzazione dei valori (showValues === true), formattazione locale da utilizzare */
  showValuesLocale =  'it-IT',

  /**
    Impostazioni font per le etichette e i valori
    Impostare solo se non si vogliono usare i colori di default
    se impostato è un oggetto analogo a quello definito in src/utils/init.js
    Possono essere impostati solo i valori che si vogliono modificare
  */
  labelsFont = null,
  valuesFont = null,

  /** text fill color */
  labelsFill = '#000',
  valuesFill = '#000',

  /** direzione della barra */
  barsDirection = 'right', // right || left

  /** larghezza minima labels */
  minLabelslWidth = 0,

  /** spazio tra un'etichetta di testo e il grafico */
  textBarsGap = 8,

  /** spazio tra una barra e la successiva */
  barsGap = 10,

  /** altezza barre */
  barsHeight = 40,

  /** corner radius */
  barsCornerRadius = 5,

  /** spessore e colore traccia (0 per non visualizzare) */
  barsStrokeWidth = 0,
  barsStrokeColor = '#000',

  /**
    array dei colori di riempimento da associare ai corrispondenti valori in base al loro indice.
    Impostare solo se non si vogliono usare i colori di default
    se il numero degli elementi supera il numero dei colri disponibili, viene utilizzato il grigio #ccc
  */
  colors = null,

  /** se false le classi vengono ignorate */
  useClasses = false,

  /** array di eventuali classi da associare ai corrispondenti valori in base al loro indice */
  valClasses = null,

  // TODO animazione
  /** se true, attiva l'animazione */ // NB non attivo
  // animazione      = false, // non implementato

  /** frame per secondo dell'animazione */ // NB non attivo
  // fps = 60
}) {

  try {

    chartUtils = chart_init(chartUtils);


    if(values.filter(v => isNaN(v)).length) {
      throw 'There are non-numeric values';
    }

    if(!values.length) {
      throw 'At least one value is needed';
    }

    if(isNaN(barsStrokeWidth)) {
      throw '`barsStrokeWidth` must be a number';
    } else {
      barsStrokeWidth = +barsStrokeWidth;
    }

    // container element
    const  containerElement = chartUtils.getElementFromContainer(container),
      toRight = barsDirection === 'right';

    if(containerElement && emptyContainer) {
      containerElement.innerHTML = '';
    }

    // dimensioni del grafico
    width = width || (containerElement? containerElement.clientWidth : null);
    height = height || (containerElement? containerElement.clientHeight : null);


    if(barsGap == null) {
      throw '`barsGap` must be set';
    }

    if(height === 'auto') {
      height = (values.length * barsHeight) +
        ((values.length - 1) * barsGap) +
        // la traccia insiste per metà sulla parte interna della barra, quindi va calcolata una sola volta
        (values.length * barsStrokeWidth);

      if(!barsHeight) {
        throw 'With `height = \'auto\'`, `barsHeight` must be set';
      }

    } else { // determinazione altezza barre
      barsHeight = (
        height -
        ((values.length - 1) * barsGap)
      ) / values.length - barsStrokeWidth;
    }


    if(!width || !height) {
      throw `Missing width and/or height: width: ${width}, height: ${height}`;
    }

    // colori forniti o di default
    colors??= chartUtils.defaults.colors;

    // fonts
    labelsFont = {...chartUtils.defaults.font, ...(labelsFont??{}) };
    valuesFont = {...chartUtils.defaults.font, ...(valuesFont??{}) };

    // somma di tutti i valori per calcolo persentuale
    const totValues = values.reduce((tot, current) => tot + current, 0);

    // definizione etichette valori
    let valueLabels = [];
    if(showValues) {
      valueLabels = values.map(v => {

        if(showValuesAs === 'percent') {
          v = v / totValues;
        }

        let labelStyle;
        switch (showValuesAs) {
          case 'number':
          case 'numbers':
            labelStyle =  {
              style: 'decimal'
            };
            break;

          case 'percent':
            labelStyle =  {
              style: 'percent'
            };
            break;

          case 'euro':
            labelStyle =  {
              currency: 'EUR',
              style: 'currency'
            };
            break;

          // no default
        }

        return v.toLocaleString(showValuesLocale, {
          minimumFractionDigits: showValuesFractionDigits,
          maximumFractionDigits: showValuesFractionDigits,
          ...labelStyle
        });
      });
    }

    const svgCanvas = chartUtils.createSvgCanvas(container); //.size(width, height);
    svgCanvas.viewbox(0, 0, width, height);

    // =>> etichette (labels) & etichette valori (valueLabels)
    // calcolo dimensioni del testo per ricavare lo spazio utile per le barre
    // e posizionamento delle etichette

    // valori per il calcolo dellìingombro massimo
    let max_labels_width = 0, max_value_labels_width = 0;

    // posizionamento iniziale, dopo il rendering verrà ridefinito in base all'altezza del testo
    let labelY = (barsHeight + barsStrokeWidth) / 2;
    // valore provvisorio, verrà reimpostato a fine ciclo (deve tenere conto di tutte le etichette)
    const labelX = toRight? 0 : width;

    const labels_elements = [], value_labels_elements = [], // per allineamenti successivi

      setText = (thisLabel, fontAttr) => {
        const labelEl = svgCanvas.plain(thisLabel)
          .font(fontAttr);

        const bbox = labelEl.bbox();

        labelEl.move(labelX, labelY - (bbox.height/2))
          .attr({textLength: bbox.width, lengthAdjust:'spacingAndGlyphs'});

        return [bbox, labelEl];
      };

    values.forEach((_ ,idx) => {

      // svgCanvas.line(0, labelY, width, labelY).stroke({ width: 1, color: '#f06'}); // linea di riferimento per allineamento

      const thisLabel = labels[idx],
        thisValueLabel = valueLabels[idx];

      if(thisLabel) {

        let bbox, labelEl;

        [bbox, labelEl] = setText(thisLabel, {
          fill: labelsFill,
          ...labelsFont,
          'text-anchor': toRight? 'end' : null
        });

        max_labels_width = Math.max(max_labels_width, bbox.width, minLabelslWidth);


        labels_elements.push(labelEl); // per il riposizionamento X successivo

      }

      if(thisValueLabel) {

        const [bbox, labelEl] = setText(thisValueLabel, {
          fill: valuesFill,
          ...valuesFont,
          'text-anchor': toRight? null : 'end'
        });

        max_value_labels_width = Math.max(max_value_labels_width, bbox.width);
        value_labels_elements.push(labelEl);
      }


      labelY += barsHeight + barsStrokeWidth + barsGap;
    });

    // svgCanvas.line(max_labels_width, 0, max_labels_width, height).stroke({ width: 2, color: '#4faa0d'}); // linea di riferimento per allineamento


    // =>> riposizionamento `labels_elements` (prima dell'aggiunta di `textBarsGap`)
    labels_elements.forEach(l => {
      l.ax(toRight? max_labels_width : width - max_labels_width);
    });


    // =>> aggiunta `textBarsGap` a `max_labels_width` e `max_value_labels_width`
    if(max_labels_width) {
      max_labels_width += textBarsGap;
    }
    if(max_value_labels_width) {
      max_value_labels_width += textBarsGap;
    }

    // =>> costruzione barre
    const maxBarsWidth = width - max_labels_width - max_value_labels_width,
      maxBarsValue = values.reduce((max, current) => max > current? max : current, 0)
    ;

    let barY = barsStrokeWidth / 2;
    values.forEach((v, idx) => {

      const barWidth = (v / maxBarsValue * maxBarsWidth) - barsStrokeWidth,
        barX = toRight? max_labels_width : width - barWidth - max_labels_width,
        bar = svgCanvas.rect({
          x: barX,
          y: barY,
          width: barWidth,
          height: barsHeight,
          fill: colors[idx]?? '#ccc',
        })
          .radius(barsCornerRadius);

      if( barsStrokeWidth > 0 && barsStrokeColor) {
        bar.stroke({ color: barsStrokeColor, width: barsStrokeWidth });
      }

      if(useClasses && valClasses[idx]) {
        bar.addClass(valClasses[idx]);
      }

      // =>> riposizionamento value_labels_elements
      const thisValueLabel = value_labels_elements[idx];
      if(thisValueLabel) {
        thisValueLabel.ax(chartUtils.truncateDecimal(toRight
          ? max_labels_width + barWidth + textBarsGap
          : barX - textBarsGap
        ));
      }


      barY += barsHeight + barsGap + barsStrokeWidth;
    });

    if(!container) {
      return svgCanvas.svg();
    }


  } catch(e) {
    console.error( 'Charts → bars', e ); // eslint-disable-line
  }

}

function pie({

  /**
    variabili e funzioni condivise importate da '../utils/init.js' (vedi)
    Può essere parzialmente o completamente integrata con funzioni specifiche
    (ad esempio per cambiare la modailità di implemntazione di svg.js, vedi demo).
    Lasciare come oggetto vuoto se non è necessario modificarlo
  */
  chartUtils = {},

  /** container (selettore o elementio DOM), se null viene restituito il codice SVG */
  container = null,

  /** raggio del cerchio */
  radius = 60,

  /** raggio cerchio interno, da impostare nel caso si voglia creare un grafico a ciambella */
  innerRadius = null,

  /** valori da associare alle "fette" del grafico */
  values = [],

  /**
    array dei colori delle fette da associare ai corrispondenti valori in base al loro indice.
    Impostare solo se non si vogliono usare i colori di default
  */
  colors = null,

  /** se false le classi vengono ignorate */
  useClasses = false,

  /** array di eventuali classi da associare ai corrispondenti valori in base al loro indice */
  valClasses = null,

  /** valore angolo (in gradi) da cui avviare il disegno */
  startAt = 90,

  /** verso del grafico */
  clockwise = true,

  /** se true, attiva l'animazione */ // NB non attivo
  // animazione      = false, // non implementato

  /** frame per secondo dell'animazione */ // NB non attivo
  // fps = 60
} = {}) {

  chartUtils = chart_init(chartUtils);

  // colori forniti o di default
  colors??= chartUtils.defaults.colors;

  const svgCanvas = chartUtils.createSvgCanvas(container);


  const isDonut = innerRadius != null
    ,donutWidth = radius - innerRadius
    ,baseColor = '#ccc' // colore neutro per gli elementi di sfondo
    ,circleCenter = { x: radius, y: radius }

    // restituisce l'attributo `d` dell'arco di cerchio descritto dall'angolo
    // corrispondente alla percentuale data e alle percentuali del punto finale
    ,generateAttrD = (params) => {

      let d = [
        `M${params.start.x},${params.start.y}`,
        `A${radius},${radius}`,
        0, //xAxisRotation,
        (params.arcAngle <= 180 ? 0 : 1), // largeArcFlag
        clockwise && params.arcAngle < 360? 1 : 0, // sweepFlag
        `${params.end.x},${params.end.y}`,
        ...(isDonut? [] : [
          `L${circleCenter.x},${circleCenter.y}`,
          'Z'
        ])
      ].join(' ');

      return d;
    }

    // CALCOLO PARAMETRI
    ,calcolaParametri = (perc, angolo_inizio) => {

      let parametri = {};

      // angolo corrispondente alla percentuale indicata
      parametri.arcAngle = 360/100 * perc;

      parametri.angolo_fine = clockwise? angolo_inizio - parametri.arcAngle :
        angolo_inizio + parametri.arcAngle;

      // questo non dovrebbe servire mai,
      // ma potrebbe verificarsi per somma di arrotondamenti
      angolo_inizio = angolo_inizio >= 360? Math.abs(360 - angolo_inizio) : angolo_inizio;
      parametri.angolo_fine = parametri.angolo_fine >= 360? Math.abs(360 - parametri.angolo_fine) : parametri.angolo_fine;

      if(perc === 100) {
        angolo_inizio = 0;
        parametri.angolo_fine = 359.9999;

      } else if(perc === 0) {
        parametri.angolo_fine = angolo_inizio;
      }

      // coordinate inizio e fine
      parametri.start = chartUtils.polarToCartesian(angolo_inizio, circleCenter, radius);
      parametri.end = chartUtils.polarToCartesian(parametri.angolo_fine, circleCenter, radius);

      parametri.perc = perc; // serve per eliminare eventuali valori nulli
      parametri.angolo_inizio = angolo_inizio; // per debug

      // console.log(parametri);

      return parametri;
    }
  ;



  // determinazione sezioni della torta
  let angolo_inizio = startAt; // angolo di partenza del grafico (viene aggiornato per ogni arco)
  const totale = values.reduce((a,b) => a + b, 0),
    pieSlices = values.map( (val, idx) => {
      let params= calcolaParametri(val / totale * 100, angolo_inizio);
      angolo_inizio = params.angolo_fine;


      // associazione colore e classe
      params.color = colors? colors[idx] : null;
      params.className = (valClasses != null && useClasses)? valClasses[idx]?? null : null;

      return params;
    }).filter(item => item.perc > 0);


  if(isDonut) {
    svgCanvas.viewbox(-donutWidth/2, -donutWidth/2, radius * 2 + donutWidth, radius * 2 + donutWidth);
  } else {
    svgCanvas.viewbox(0, 0, radius * 2, radius * 2);
  }

  svgCanvas.circle({
    ...(isDonut
      ? {'stroke-width': donutWidth, stroke: baseColor,  fill: 'none'}
      : {fill: baseColor}
    ),
    cx: radius,
    cy: radius,
    r: radius
  });

  const sectionsGroup = svgCanvas.group(useClasses? {class: 'mChart-pie-sections-wrapper'}: {});

  {

    pieSlices.forEach(params => {
      sectionsGroup.path(generateAttrD(params))
        .attr({
          ...(useClasses? {class: chartUtils.classnames('mChart-pie-section', params.className)} : {}),
          ...(isDonut
            ? {'stroke-width': donutWidth, stroke: params.color, fill: 'none'}
            : {fill: params.color}
          )
        });
    });
  }

  if(!container) {
    return svgCanvas.svg();
  }
}



// TODO animazione
// if(animazione) {

//   let idx = 0;

//   const animazione_arco = () => {

//     let animationRequest,
//       parametri_arco=pieSlices[idx],
//       arco, d, arco_path,
//       this_perc = 0,
//       start_timestamp = Date.now(),
//       fine_animazione = false,
//       elapsed, now,
//       fps = fps,
//       fpsInterval = 1000/fps;


//     const step = () => {
//       now = Date.now();
//       elapsed = now - start_timestamp;

//       if((this_perc >= parametri_arco.perc) ) {
//         this_perc = parametri_arco.perc;
//         fine_animazione = true;
//       }

//       // request another frame
//       animationRequest = window.requestAnimationFrame(step);

//       // if enough time has elapsed, draw the next frame
//       if (elapsed > fpsInterval) {

//         // Get ready for next frame by setting start_timestamp=now, but...
//         // Also, adjust for fpsInterval not being multiple of 16.67
//         start_timestamp = now - (elapsed % fpsInterval);

//         if( this_perc === 0 ) {
//           arco = generateArcPathTag(
//             calcolaParametri(0, parametri_arco.angolo_inizio),
//             colors[idx]
//           );
//           chart_container.insertAdjacentHTML('afterbegin', arco.chart_segment );
//           arco_path = chart_container.querySelector(`.chart-arc.item-${idx}`);

//         } else {
//           arco = calcolaParametri(this_perc, parametri_arco.angolo_inizio);
//           d = generateAttrD(arco);
//           arco_path.setAttribute('d', d);
//         }

//         if(fine_animazione) {
//           window.cancelAnimationFrame(animationRequest);
//           idx++;
//           if(idx < pieSlices.length) {
//             animazione_arco();
//           }
//         } else {
//           this_perc++;
//         }
//       }

//     };// end step

//     step();
//   }; // end animazione_arco

//   animazione_arco();

// } // end if animazione

/**
 * https://opentype.js.org v1.3.4 | (c) Frederik De Bleser and other contributors | MIT License | Uses tiny-inflate by Devon Govett and string.prototype.codepointat polyfill by Mathias Bynens
 */

/*! https://mths.be/codepointat v0.2.0 by @mathias */
if (!String.prototype.codePointAt) {
	(function() {
		var defineProperty = (function() {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch(error) {}
			return result;
		}());
		var codePointAt = function(position) {
			if (this == null) {
				throw TypeError();
			}
			var string = String(this);
			var size = string.length;
			// `ToInteger`
			var index = position ? Number(position) : 0;
			if (index != index) { // better `isNaN`
				index = 0;
			}
			// Account for out-of-bounds indices:
			if (index < 0 || index >= size) {
				return undefined;
			}
			// Get the first code unit
			var first = string.charCodeAt(index);
			var second;
			if ( // check if it’s the start of a surrogate pair
				first >= 0xD800 && first <= 0xDBFF && // high surrogate
				size > index + 1 // there is a next code unit
			) {
				second = string.charCodeAt(index + 1);
				if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
					// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
					return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
				}
			}
			return first;
		};
		if (defineProperty) {
			defineProperty(String.prototype, 'codePointAt', {
				'value': codePointAt,
				'configurable': true,
				'writable': true
			});
		} else {
			String.prototype.codePointAt = codePointAt;
		}
	}());
}

var TINF_OK = 0;
var TINF_DATA_ERROR = -3;

function Tree() {
  this.table = new Uint16Array(16);   /* table of code length counts */
  this.trans = new Uint16Array(288);  /* code -> symbol translation table */
}

function Data(source, dest) {
  this.source = source;
  this.sourceIndex = 0;
  this.tag = 0;
  this.bitcount = 0;
  
  this.dest = dest;
  this.destLen = 0;
  
  this.ltree = new Tree();  /* dynamic length/symbol tree */
  this.dtree = new Tree();  /* dynamic distance tree */
}

/* --------------------------------------------------- *
 * -- uninitialized global data (static structures) -- *
 * --------------------------------------------------- */

var sltree = new Tree();
var sdtree = new Tree();

/* extra bits and base tables for length codes */
var length_bits = new Uint8Array(30);
var length_base = new Uint16Array(30);

/* extra bits and base tables for distance codes */
var dist_bits = new Uint8Array(30);
var dist_base = new Uint16Array(30);

/* special ordering of code length codes */
var clcidx = new Uint8Array([
  16, 17, 18, 0, 8, 7, 9, 6,
  10, 5, 11, 4, 12, 3, 13, 2,
  14, 1, 15
]);

/* used by tinf_decode_trees, avoids allocations every call */
var code_tree = new Tree();
var lengths = new Uint8Array(288 + 32);

/* ----------------------- *
 * -- utility functions -- *
 * ----------------------- */

/* build extra bits and base tables */
function tinf_build_bits_base(bits, base, delta, first) {
  var i, sum;

  /* build bits table */
  for (i = 0; i < delta; ++i) { bits[i] = 0; }
  for (i = 0; i < 30 - delta; ++i) { bits[i + delta] = i / delta | 0; }

  /* build base table */
  for (sum = first, i = 0; i < 30; ++i) {
    base[i] = sum;
    sum += 1 << bits[i];
  }
}

/* build the fixed huffman trees */
function tinf_build_fixed_trees(lt, dt) {
  var i;

  /* build fixed length tree */
  for (i = 0; i < 7; ++i) { lt.table[i] = 0; }

  lt.table[7] = 24;
  lt.table[8] = 152;
  lt.table[9] = 112;

  for (i = 0; i < 24; ++i) { lt.trans[i] = 256 + i; }
  for (i = 0; i < 144; ++i) { lt.trans[24 + i] = i; }
  for (i = 0; i < 8; ++i) { lt.trans[24 + 144 + i] = 280 + i; }
  for (i = 0; i < 112; ++i) { lt.trans[24 + 144 + 8 + i] = 144 + i; }

  /* build fixed distance tree */
  for (i = 0; i < 5; ++i) { dt.table[i] = 0; }

  dt.table[5] = 32;

  for (i = 0; i < 32; ++i) { dt.trans[i] = i; }
}

/* given an array of code lengths, build a tree */
var offs = new Uint16Array(16);

function tinf_build_tree(t, lengths, off, num) {
  var i, sum;

  /* clear code length count table */
  for (i = 0; i < 16; ++i) { t.table[i] = 0; }

  /* scan symbol lengths, and sum code length counts */
  for (i = 0; i < num; ++i) { t.table[lengths[off + i]]++; }

  t.table[0] = 0;

  /* compute offset table for distribution sort */
  for (sum = 0, i = 0; i < 16; ++i) {
    offs[i] = sum;
    sum += t.table[i];
  }

  /* create code->symbol translation table (symbols sorted by code) */
  for (i = 0; i < num; ++i) {
    if (lengths[off + i]) { t.trans[offs[lengths[off + i]]++] = i; }
  }
}

/* ---------------------- *
 * -- decode functions -- *
 * ---------------------- */

/* get one bit from source stream */
function tinf_getbit(d) {
  /* check if tag is empty */
  if (!d.bitcount--) {
    /* load next tag */
    d.tag = d.source[d.sourceIndex++];
    d.bitcount = 7;
  }

  /* shift bit out of tag */
  var bit = d.tag & 1;
  d.tag >>>= 1;

  return bit;
}

/* read a num bit value from a stream and add base */
function tinf_read_bits(d, num, base) {
  if (!num)
    { return base; }

  while (d.bitcount < 24) {
    d.tag |= d.source[d.sourceIndex++] << d.bitcount;
    d.bitcount += 8;
  }

  var val = d.tag & (0xffff >>> (16 - num));
  d.tag >>>= num;
  d.bitcount -= num;
  return val + base;
}

/* given a data stream and a tree, decode a symbol */
function tinf_decode_symbol(d, t) {
  while (d.bitcount < 24) {
    d.tag |= d.source[d.sourceIndex++] << d.bitcount;
    d.bitcount += 8;
  }
  
  var sum = 0, cur = 0, len = 0;
  var tag = d.tag;

  /* get more bits while code value is above sum */
  do {
    cur = 2 * cur + (tag & 1);
    tag >>>= 1;
    ++len;

    sum += t.table[len];
    cur -= t.table[len];
  } while (cur >= 0);
  
  d.tag = tag;
  d.bitcount -= len;

  return t.trans[sum + cur];
}

/* given a data stream, decode dynamic trees from it */
function tinf_decode_trees(d, lt, dt) {
  var hlit, hdist, hclen;
  var i, num, length;

  /* get 5 bits HLIT (257-286) */
  hlit = tinf_read_bits(d, 5, 257);

  /* get 5 bits HDIST (1-32) */
  hdist = tinf_read_bits(d, 5, 1);

  /* get 4 bits HCLEN (4-19) */
  hclen = tinf_read_bits(d, 4, 4);

  for (i = 0; i < 19; ++i) { lengths[i] = 0; }

  /* read code lengths for code length alphabet */
  for (i = 0; i < hclen; ++i) {
    /* get 3 bits code length (0-7) */
    var clen = tinf_read_bits(d, 3, 0);
    lengths[clcidx[i]] = clen;
  }

  /* build code length tree */
  tinf_build_tree(code_tree, lengths, 0, 19);

  /* decode code lengths for the dynamic trees */
  for (num = 0; num < hlit + hdist;) {
    var sym = tinf_decode_symbol(d, code_tree);

    switch (sym) {
      case 16:
        /* copy previous code length 3-6 times (read 2 bits) */
        var prev = lengths[num - 1];
        for (length = tinf_read_bits(d, 2, 3); length; --length) {
          lengths[num++] = prev;
        }
        break;
      case 17:
        /* repeat code length 0 for 3-10 times (read 3 bits) */
        for (length = tinf_read_bits(d, 3, 3); length; --length) {
          lengths[num++] = 0;
        }
        break;
      case 18:
        /* repeat code length 0 for 11-138 times (read 7 bits) */
        for (length = tinf_read_bits(d, 7, 11); length; --length) {
          lengths[num++] = 0;
        }
        break;
      default:
        /* values 0-15 represent the actual code lengths */
        lengths[num++] = sym;
        break;
    }
  }

  /* build dynamic trees */
  tinf_build_tree(lt, lengths, 0, hlit);
  tinf_build_tree(dt, lengths, hlit, hdist);
}

/* ----------------------------- *
 * -- block inflate functions -- *
 * ----------------------------- */

/* given a stream and two trees, inflate a block of data */
function tinf_inflate_block_data(d, lt, dt) {
  while (1) {
    var sym = tinf_decode_symbol(d, lt);

    /* check for end of block */
    if (sym === 256) {
      return TINF_OK;
    }

    if (sym < 256) {
      d.dest[d.destLen++] = sym;
    } else {
      var length, dist, offs;
      var i;

      sym -= 257;

      /* possibly get more bits from length code */
      length = tinf_read_bits(d, length_bits[sym], length_base[sym]);

      dist = tinf_decode_symbol(d, dt);

      /* possibly get more bits from distance code */
      offs = d.destLen - tinf_read_bits(d, dist_bits[dist], dist_base[dist]);

      /* copy match */
      for (i = offs; i < offs + length; ++i) {
        d.dest[d.destLen++] = d.dest[i];
      }
    }
  }
}

/* inflate an uncompressed block of data */
function tinf_inflate_uncompressed_block(d) {
  var length, invlength;
  var i;
  
  /* unread from bitbuffer */
  while (d.bitcount > 8) {
    d.sourceIndex--;
    d.bitcount -= 8;
  }

  /* get length */
  length = d.source[d.sourceIndex + 1];
  length = 256 * length + d.source[d.sourceIndex];

  /* get one's complement of length */
  invlength = d.source[d.sourceIndex + 3];
  invlength = 256 * invlength + d.source[d.sourceIndex + 2];

  /* check length */
  if (length !== (~invlength & 0x0000ffff))
    { return TINF_DATA_ERROR; }

  d.sourceIndex += 4;

  /* copy block */
  for (i = length; i; --i)
    { d.dest[d.destLen++] = d.source[d.sourceIndex++]; }

  /* make sure we start next block on a byte boundary */
  d.bitcount = 0;

  return TINF_OK;
}

/* inflate stream from source to dest */
function tinf_uncompress(source, dest) {
  var d = new Data(source, dest);
  var bfinal, btype, res;

  do {
    /* read final block flag */
    bfinal = tinf_getbit(d);

    /* read block type (2 bits) */
    btype = tinf_read_bits(d, 2, 0);

    /* decompress block */
    switch (btype) {
      case 0:
        /* decompress uncompressed block */
        res = tinf_inflate_uncompressed_block(d);
        break;
      case 1:
        /* decompress block with fixed huffman trees */
        res = tinf_inflate_block_data(d, sltree, sdtree);
        break;
      case 2:
        /* decompress block with dynamic huffman trees */
        tinf_decode_trees(d, d.ltree, d.dtree);
        res = tinf_inflate_block_data(d, d.ltree, d.dtree);
        break;
      default:
        res = TINF_DATA_ERROR;
    }

    if (res !== TINF_OK)
      { throw new Error('Data error'); }

  } while (!bfinal);

  if (d.destLen < d.dest.length) {
    if (typeof d.dest.slice === 'function')
      { return d.dest.slice(0, d.destLen); }
    else
      { return d.dest.subarray(0, d.destLen); }
  }
  
  return d.dest;
}

/* -------------------- *
 * -- initialization -- *
 * -------------------- */

/* build fixed huffman trees */
tinf_build_fixed_trees(sltree, sdtree);

/* build extra bits and base tables */
tinf_build_bits_base(length_bits, length_base, 4, 3);
tinf_build_bits_base(dist_bits, dist_base, 2, 1);

/* fix a special case */
length_bits[28] = 0;
length_base[28] = 258;

var tinyInflate = tinf_uncompress;

// The Bounding Box object

function derive(v0, v1, v2, v3, t) {
    return Math.pow(1 - t, 3) * v0 +
        3 * Math.pow(1 - t, 2) * t * v1 +
        3 * (1 - t) * Math.pow(t, 2) * v2 +
        Math.pow(t, 3) * v3;
}
/**
 * A bounding box is an enclosing box that describes the smallest measure within which all the points lie.
 * It is used to calculate the bounding box of a glyph or text path.
 *
 * On initialization, x1/y1/x2/y2 will be NaN. Check if the bounding box is empty using `isEmpty()`.
 *
 * @exports opentype.BoundingBox
 * @class
 * @constructor
 */
function BoundingBox() {
    this.x1 = Number.NaN;
    this.y1 = Number.NaN;
    this.x2 = Number.NaN;
    this.y2 = Number.NaN;
}

/**
 * Returns true if the bounding box is empty, that is, no points have been added to the box yet.
 */
BoundingBox.prototype.isEmpty = function() {
    return isNaN(this.x1) || isNaN(this.y1) || isNaN(this.x2) || isNaN(this.y2);
};

/**
 * Add the point to the bounding box.
 * The x1/y1/x2/y2 coordinates of the bounding box will now encompass the given point.
 * @param {number} x - The X coordinate of the point.
 * @param {number} y - The Y coordinate of the point.
 */
BoundingBox.prototype.addPoint = function(x, y) {
    if (typeof x === 'number') {
        if (isNaN(this.x1) || isNaN(this.x2)) {
            this.x1 = x;
            this.x2 = x;
        }
        if (x < this.x1) {
            this.x1 = x;
        }
        if (x > this.x2) {
            this.x2 = x;
        }
    }
    if (typeof y === 'number') {
        if (isNaN(this.y1) || isNaN(this.y2)) {
            this.y1 = y;
            this.y2 = y;
        }
        if (y < this.y1) {
            this.y1 = y;
        }
        if (y > this.y2) {
            this.y2 = y;
        }
    }
};

/**
 * Add a X coordinate to the bounding box.
 * This extends the bounding box to include the X coordinate.
 * This function is used internally inside of addBezier.
 * @param {number} x - The X coordinate of the point.
 */
BoundingBox.prototype.addX = function(x) {
    this.addPoint(x, null);
};

/**
 * Add a Y coordinate to the bounding box.
 * This extends the bounding box to include the Y coordinate.
 * This function is used internally inside of addBezier.
 * @param {number} y - The Y coordinate of the point.
 */
BoundingBox.prototype.addY = function(y) {
    this.addPoint(null, y);
};

/**
 * Add a Bézier curve to the bounding box.
 * This extends the bounding box to include the entire Bézier.
 * @param {number} x0 - The starting X coordinate.
 * @param {number} y0 - The starting Y coordinate.
 * @param {number} x1 - The X coordinate of the first control point.
 * @param {number} y1 - The Y coordinate of the first control point.
 * @param {number} x2 - The X coordinate of the second control point.
 * @param {number} y2 - The Y coordinate of the second control point.
 * @param {number} x - The ending X coordinate.
 * @param {number} y - The ending Y coordinate.
 */
BoundingBox.prototype.addBezier = function(x0, y0, x1, y1, x2, y2, x, y) {
    // This code is based on http://nishiohirokazu.blogspot.com/2009/06/how-to-calculate-bezier-curves-bounding.html
    // and https://github.com/icons8/svg-path-bounding-box

    var p0 = [x0, y0];
    var p1 = [x1, y1];
    var p2 = [x2, y2];
    var p3 = [x, y];

    this.addPoint(x0, y0);
    this.addPoint(x, y);

    for (var i = 0; i <= 1; i++) {
        var b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
        var a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
        var c = 3 * p1[i] - 3 * p0[i];

        if (a === 0) {
            if (b === 0) { continue; }
            var t = -c / b;
            if (0 < t && t < 1) {
                if (i === 0) { this.addX(derive(p0[i], p1[i], p2[i], p3[i], t)); }
                if (i === 1) { this.addY(derive(p0[i], p1[i], p2[i], p3[i], t)); }
            }
            continue;
        }

        var b2ac = Math.pow(b, 2) - 4 * c * a;
        if (b2ac < 0) { continue; }
        var t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
        if (0 < t1 && t1 < 1) {
            if (i === 0) { this.addX(derive(p0[i], p1[i], p2[i], p3[i], t1)); }
            if (i === 1) { this.addY(derive(p0[i], p1[i], p2[i], p3[i], t1)); }
        }
        var t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
        if (0 < t2 && t2 < 1) {
            if (i === 0) { this.addX(derive(p0[i], p1[i], p2[i], p3[i], t2)); }
            if (i === 1) { this.addY(derive(p0[i], p1[i], p2[i], p3[i], t2)); }
        }
    }
};

/**
 * Add a quadratic curve to the bounding box.
 * This extends the bounding box to include the entire quadratic curve.
 * @param {number} x0 - The starting X coordinate.
 * @param {number} y0 - The starting Y coordinate.
 * @param {number} x1 - The X coordinate of the control point.
 * @param {number} y1 - The Y coordinate of the control point.
 * @param {number} x - The ending X coordinate.
 * @param {number} y - The ending Y coordinate.
 */
BoundingBox.prototype.addQuad = function(x0, y0, x1, y1, x, y) {
    var cp1x = x0 + 2 / 3 * (x1 - x0);
    var cp1y = y0 + 2 / 3 * (y1 - y0);
    var cp2x = cp1x + 1 / 3 * (x - x0);
    var cp2y = cp1y + 1 / 3 * (y - y0);
    this.addBezier(x0, y0, cp1x, cp1y, cp2x, cp2y, x, y);
};

// Geometric objects

/**
 * A bézier path containing a set of path commands similar to a SVG path.
 * Paths can be drawn on a context using `draw`.
 * @exports opentype.Path
 * @class
 * @constructor
 */
function Path() {
    this.commands = [];
    this.fill = 'black';
    this.stroke = null;
    this.strokeWidth = 1;
}

/**
 * @param  {number} x
 * @param  {number} y
 */
Path.prototype.moveTo = function(x, y) {
    this.commands.push({
        type: 'M',
        x: x,
        y: y
    });
};

/**
 * @param  {number} x
 * @param  {number} y
 */
Path.prototype.lineTo = function(x, y) {
    this.commands.push({
        type: 'L',
        x: x,
        y: y
    });
};

/**
 * Draws cubic curve
 * @function
 * curveTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control 1
 * @param  {number} y1 - y of control 1
 * @param  {number} x2 - x of control 2
 * @param  {number} y2 - y of control 2
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 */

/**
 * Draws cubic curve
 * @function
 * bezierCurveTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control 1
 * @param  {number} y1 - y of control 1
 * @param  {number} x2 - x of control 2
 * @param  {number} y2 - y of control 2
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 * @see curveTo
 */
Path.prototype.curveTo = Path.prototype.bezierCurveTo = function(x1, y1, x2, y2, x, y) {
    this.commands.push({
        type: 'C',
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        x: x,
        y: y
    });
};

/**
 * Draws quadratic curve
 * @function
 * quadraticCurveTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control
 * @param  {number} y1 - y of control
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 */

/**
 * Draws quadratic curve
 * @function
 * quadTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control
 * @param  {number} y1 - y of control
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 */
Path.prototype.quadTo = Path.prototype.quadraticCurveTo = function(x1, y1, x, y) {
    this.commands.push({
        type: 'Q',
        x1: x1,
        y1: y1,
        x: x,
        y: y
    });
};

/**
 * Closes the path
 * @function closePath
 * @memberof opentype.Path.prototype
 */

/**
 * Close the path
 * @function close
 * @memberof opentype.Path.prototype
 */
Path.prototype.close = Path.prototype.closePath = function() {
    this.commands.push({
        type: 'Z'
    });
};

/**
 * Add the given path or list of commands to the commands of this path.
 * @param  {Array} pathOrCommands - another opentype.Path, an opentype.BoundingBox, or an array of commands.
 */
Path.prototype.extend = function(pathOrCommands) {
    if (pathOrCommands.commands) {
        pathOrCommands = pathOrCommands.commands;
    } else if (pathOrCommands instanceof BoundingBox) {
        var box = pathOrCommands;
        this.moveTo(box.x1, box.y1);
        this.lineTo(box.x2, box.y1);
        this.lineTo(box.x2, box.y2);
        this.lineTo(box.x1, box.y2);
        this.close();
        return;
    }

    Array.prototype.push.apply(this.commands, pathOrCommands);
};

/**
 * Calculate the bounding box of the path.
 * @returns {opentype.BoundingBox}
 */
Path.prototype.getBoundingBox = function() {
    var box = new BoundingBox();

    var startX = 0;
    var startY = 0;
    var prevX = 0;
    var prevY = 0;
    for (var i = 0; i < this.commands.length; i++) {
        var cmd = this.commands[i];
        switch (cmd.type) {
            case 'M':
                box.addPoint(cmd.x, cmd.y);
                startX = prevX = cmd.x;
                startY = prevY = cmd.y;
                break;
            case 'L':
                box.addPoint(cmd.x, cmd.y);
                prevX = cmd.x;
                prevY = cmd.y;
                break;
            case 'Q':
                box.addQuad(prevX, prevY, cmd.x1, cmd.y1, cmd.x, cmd.y);
                prevX = cmd.x;
                prevY = cmd.y;
                break;
            case 'C':
                box.addBezier(prevX, prevY, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
                prevX = cmd.x;
                prevY = cmd.y;
                break;
            case 'Z':
                prevX = startX;
                prevY = startY;
                break;
            default:
                throw new Error('Unexpected path command ' + cmd.type);
        }
    }
    if (box.isEmpty()) {
        box.addPoint(0, 0);
    }
    return box;
};

/**
 * Draw the path to a 2D context.
 * @param {CanvasRenderingContext2D} ctx - A 2D drawing context.
 */
Path.prototype.draw = function(ctx) {
    ctx.beginPath();
    for (var i = 0; i < this.commands.length; i += 1) {
        var cmd = this.commands[i];
        if (cmd.type === 'M') {
            ctx.moveTo(cmd.x, cmd.y);
        } else if (cmd.type === 'L') {
            ctx.lineTo(cmd.x, cmd.y);
        } else if (cmd.type === 'C') {
            ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
        } else if (cmd.type === 'Q') {
            ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
        } else if (cmd.type === 'Z') {
            ctx.closePath();
        }
    }

    if (this.fill) {
        ctx.fillStyle = this.fill;
        ctx.fill();
    }

    if (this.stroke) {
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.strokeWidth;
        ctx.stroke();
    }
};

/**
 * Convert the Path to a string of path data instructions
 * See http://www.w3.org/TR/SVG/paths.html#PathData
 * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
 * @return {string}
 */
Path.prototype.toPathData = function(decimalPlaces) {
    decimalPlaces = decimalPlaces !== undefined ? decimalPlaces : 2;

    function floatToString(v) {
        if (Math.round(v) === v) {
            return '' + Math.round(v);
        } else {
            return v.toFixed(decimalPlaces);
        }
    }

    function packValues() {
        var arguments$1 = arguments;

        var s = '';
        for (var i = 0; i < arguments.length; i += 1) {
            var v = arguments$1[i];
            if (v >= 0 && i > 0) {
                s += ' ';
            }

            s += floatToString(v);
        }

        return s;
    }

    var d = '';
    for (var i = 0; i < this.commands.length; i += 1) {
        var cmd = this.commands[i];
        if (cmd.type === 'M') {
            d += 'M' + packValues(cmd.x, cmd.y);
        } else if (cmd.type === 'L') {
            d += 'L' + packValues(cmd.x, cmd.y);
        } else if (cmd.type === 'C') {
            d += 'C' + packValues(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
        } else if (cmd.type === 'Q') {
            d += 'Q' + packValues(cmd.x1, cmd.y1, cmd.x, cmd.y);
        } else if (cmd.type === 'Z') {
            d += 'Z';
        }
    }

    return d;
};

/**
 * Convert the path to an SVG <path> element, as a string.
 * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
 * @return {string}
 */
Path.prototype.toSVG = function(decimalPlaces) {
    var svg = '<path d="';
    svg += this.toPathData(decimalPlaces);
    svg += '"';
    if (this.fill && this.fill !== 'black') {
        if (this.fill === null) {
            svg += ' fill="none"';
        } else {
            svg += ' fill="' + this.fill + '"';
        }
    }

    if (this.stroke) {
        svg += ' stroke="' + this.stroke + '" stroke-width="' + this.strokeWidth + '"';
    }

    svg += '/>';
    return svg;
};

/**
 * Convert the path to a DOM element.
 * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
 * @return {SVGPathElement}
 */
Path.prototype.toDOMElement = function(decimalPlaces) {
    var temporaryPath = this.toPathData(decimalPlaces);
    var newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    newPath.setAttribute('d', temporaryPath);

    return newPath;
};

// Run-time checking of preconditions.

function fail(message) {
    throw new Error(message);
}

// Precondition function that checks if the given predicate is true.
// If not, it will throw an error.
function argument(predicate, message) {
    if (!predicate) {
        fail(message);
    }
}
var check = { fail: fail, argument: argument, assert: argument };

// Data types used in the OpenType font file.

var LIMIT16 = 32768; // The limit at which a 16-bit number switches signs == 2^15
var LIMIT32 = 2147483648; // The limit at which a 32-bit number switches signs == 2 ^ 31

/**
 * @exports opentype.decode
 * @class
 */
var decode = {};
/**
 * @exports opentype.encode
 * @class
 */
var encode = {};
/**
 * @exports opentype.sizeOf
 * @class
 */
var sizeOf = {};

// Return a function that always returns the same value.
function constant(v) {
    return function() {
        return v;
    };
}

// OpenType data types //////////////////////////////////////////////////////

/**
 * Convert an 8-bit unsigned integer to a list of 1 byte.
 * @param {number}
 * @returns {Array}
 */
encode.BYTE = function(v) {
    check.argument(v >= 0 && v <= 255, 'Byte value should be between 0 and 255.');
    return [v];
};
/**
 * @constant
 * @type {number}
 */
sizeOf.BYTE = constant(1);

/**
 * Convert a 8-bit signed integer to a list of 1 byte.
 * @param {string}
 * @returns {Array}
 */
encode.CHAR = function(v) {
    return [v.charCodeAt(0)];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.CHAR = constant(1);

/**
 * Convert an ASCII string to a list of bytes.
 * @param {string}
 * @returns {Array}
 */
encode.CHARARRAY = function(v) {
    if (typeof v === 'undefined') {
        v = '';
        console.warn('Undefined CHARARRAY encountered and treated as an empty string. This is probably caused by a missing glyph name.');
    }
    var b = [];
    for (var i = 0; i < v.length; i += 1) {
        b[i] = v.charCodeAt(i);
    }

    return b;
};

/**
 * @param {Array}
 * @returns {number}
 */
sizeOf.CHARARRAY = function(v) {
    if (typeof v === 'undefined') {
        return 0;
    }
    return v.length;
};

/**
 * Convert a 16-bit unsigned integer to a list of 2 bytes.
 * @param {number}
 * @returns {Array}
 */
encode.USHORT = function(v) {
    return [(v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.USHORT = constant(2);

/**
 * Convert a 16-bit signed integer to a list of 2 bytes.
 * @param {number}
 * @returns {Array}
 */
encode.SHORT = function(v) {
    // Two's complement
    if (v >= LIMIT16) {
        v = -(2 * LIMIT16 - v);
    }

    return [(v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.SHORT = constant(2);

/**
 * Convert a 24-bit unsigned integer to a list of 3 bytes.
 * @param {number}
 * @returns {Array}
 */
encode.UINT24 = function(v) {
    return [(v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.UINT24 = constant(3);

/**
 * Convert a 32-bit unsigned integer to a list of 4 bytes.
 * @param {number}
 * @returns {Array}
 */
encode.ULONG = function(v) {
    return [(v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.ULONG = constant(4);

/**
 * Convert a 32-bit unsigned integer to a list of 4 bytes.
 * @param {number}
 * @returns {Array}
 */
encode.LONG = function(v) {
    // Two's complement
    if (v >= LIMIT32) {
        v = -(2 * LIMIT32 - v);
    }

    return [(v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.LONG = constant(4);

encode.FIXED = encode.ULONG;
sizeOf.FIXED = sizeOf.ULONG;

encode.FWORD = encode.SHORT;
sizeOf.FWORD = sizeOf.SHORT;

encode.UFWORD = encode.USHORT;
sizeOf.UFWORD = sizeOf.USHORT;

/**
 * Convert a 32-bit Apple Mac timestamp integer to a list of 8 bytes, 64-bit timestamp.
 * @param {number}
 * @returns {Array}
 */
encode.LONGDATETIME = function(v) {
    return [0, 0, 0, 0, (v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.LONGDATETIME = constant(8);

/**
 * Convert a 4-char tag to a list of 4 bytes.
 * @param {string}
 * @returns {Array}
 */
encode.TAG = function(v) {
    check.argument(v.length === 4, 'Tag should be exactly 4 ASCII characters.');
    return [v.charCodeAt(0),
            v.charCodeAt(1),
            v.charCodeAt(2),
            v.charCodeAt(3)];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.TAG = constant(4);

// CFF data types ///////////////////////////////////////////////////////////

encode.Card8 = encode.BYTE;
sizeOf.Card8 = sizeOf.BYTE;

encode.Card16 = encode.USHORT;
sizeOf.Card16 = sizeOf.USHORT;

encode.OffSize = encode.BYTE;
sizeOf.OffSize = sizeOf.BYTE;

encode.SID = encode.USHORT;
sizeOf.SID = sizeOf.USHORT;

// Convert a numeric operand or charstring number to a variable-size list of bytes.
/**
 * Convert a numeric operand or charstring number to a variable-size list of bytes.
 * @param {number}
 * @returns {Array}
 */
encode.NUMBER = function(v) {
    if (v >= -107 && v <= 107) {
        return [v + 139];
    } else if (v >= 108 && v <= 1131) {
        v = v - 108;
        return [(v >> 8) + 247, v & 0xFF];
    } else if (v >= -1131 && v <= -108) {
        v = -v - 108;
        return [(v >> 8) + 251, v & 0xFF];
    } else if (v >= -32768 && v <= 32767) {
        return encode.NUMBER16(v);
    } else {
        return encode.NUMBER32(v);
    }
};

/**
 * @param {number}
 * @returns {number}
 */
sizeOf.NUMBER = function(v) {
    return encode.NUMBER(v).length;
};

/**
 * Convert a signed number between -32768 and +32767 to a three-byte value.
 * This ensures we always use three bytes, but is not the most compact format.
 * @param {number}
 * @returns {Array}
 */
encode.NUMBER16 = function(v) {
    return [28, (v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.NUMBER16 = constant(3);

/**
 * Convert a signed number between -(2^31) and +(2^31-1) to a five-byte value.
 * This is useful if you want to be sure you always use four bytes,
 * at the expense of wasting a few bytes for smaller numbers.
 * @param {number}
 * @returns {Array}
 */
encode.NUMBER32 = function(v) {
    return [29, (v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.NUMBER32 = constant(5);

/**
 * @param {number}
 * @returns {Array}
 */
encode.REAL = function(v) {
    var value = v.toString();

    // Some numbers use an epsilon to encode the value. (e.g. JavaScript will store 0.0000001 as 1e-7)
    // This code converts it back to a number without the epsilon.
    var m = /\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/.exec(value);
    if (m) {
        var epsilon = parseFloat('1e' + ((m[2] ? +m[2] : 0) + m[1].length));
        value = (Math.round(v * epsilon) / epsilon).toString();
    }

    var nibbles = '';
    for (var i = 0, ii = value.length; i < ii; i += 1) {
        var c = value[i];
        if (c === 'e') {
            nibbles += value[++i] === '-' ? 'c' : 'b';
        } else if (c === '.') {
            nibbles += 'a';
        } else if (c === '-') {
            nibbles += 'e';
        } else {
            nibbles += c;
        }
    }

    nibbles += (nibbles.length & 1) ? 'f' : 'ff';
    var out = [30];
    for (var i$1 = 0, ii$1 = nibbles.length; i$1 < ii$1; i$1 += 2) {
        out.push(parseInt(nibbles.substr(i$1, 2), 16));
    }

    return out;
};

/**
 * @param {number}
 * @returns {number}
 */
sizeOf.REAL = function(v) {
    return encode.REAL(v).length;
};

encode.NAME = encode.CHARARRAY;
sizeOf.NAME = sizeOf.CHARARRAY;

encode.STRING = encode.CHARARRAY;
sizeOf.STRING = sizeOf.CHARARRAY;

/**
 * @param {DataView} data
 * @param {number} offset
 * @param {number} numBytes
 * @returns {string}
 */
decode.UTF8 = function(data, offset, numBytes) {
    var codePoints = [];
    var numChars = numBytes;
    for (var j = 0; j < numChars; j++, offset += 1) {
        codePoints[j] = data.getUint8(offset);
    }

    return String.fromCharCode.apply(null, codePoints);
};

/**
 * @param {DataView} data
 * @param {number} offset
 * @param {number} numBytes
 * @returns {string}
 */
decode.UTF16 = function(data, offset, numBytes) {
    var codePoints = [];
    var numChars = numBytes / 2;
    for (var j = 0; j < numChars; j++, offset += 2) {
        codePoints[j] = data.getUint16(offset);
    }

    return String.fromCharCode.apply(null, codePoints);
};

/**
 * Convert a JavaScript string to UTF16-BE.
 * @param {string}
 * @returns {Array}
 */
encode.UTF16 = function(v) {
    var b = [];
    for (var i = 0; i < v.length; i += 1) {
        var codepoint = v.charCodeAt(i);
        b[b.length] = (codepoint >> 8) & 0xFF;
        b[b.length] = codepoint & 0xFF;
    }

    return b;
};

/**
 * @param {string}
 * @returns {number}
 */
sizeOf.UTF16 = function(v) {
    return v.length * 2;
};

// Data for converting old eight-bit Macintosh encodings to Unicode.
// This representation is optimized for decoding; encoding is slower
// and needs more memory. The assumption is that all opentype.js users
// want to open fonts, but saving a font will be comparatively rare
// so it can be more expensive. Keyed by IANA character set name.
//
// Python script for generating these strings:
//
//     s = u''.join([chr(c).decode('mac_greek') for c in range(128, 256)])
//     print(s.encode('utf-8'))
/**
 * @private
 */
var eightBitMacEncodings = {
    'x-mac-croatian':  // Python: 'mac_croatian'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø' +
    '¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊©⁄€‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ',
    'x-mac-cyrillic':  // Python: 'mac_cyrillic'
    'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњ' +
    'јЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю',
    'x-mac-gaelic': // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/GAELIC.TXT
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØḂ±≤≥ḃĊċḊḋḞḟĠġṀæø' +
    'ṁṖṗɼƒſṠ«»… ÀÃÕŒœ–—“”‘’ṡẛÿŸṪ€‹›Ŷŷṫ·Ỳỳ⁊ÂÊÁËÈÍÎÏÌÓÔ♣ÒÚÛÙıÝýŴŵẄẅẀẁẂẃ',
    'x-mac-greek':  // Python: 'mac_greek'
    'Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦€ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩ' +
    'άΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ\u00AD',
    'x-mac-icelandic':  // Python: 'mac_iceland'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
    'x-mac-inuit': // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/INUIT.TXT
    'ᐃᐄᐅᐆᐊᐋᐱᐲᐳᐴᐸᐹᑉᑎᑏᑐᑑᑕᑖᑦᑭᑮᑯᑰᑲᑳᒃᒋᒌᒍᒎᒐᒑ°ᒡᒥᒦ•¶ᒧ®©™ᒨᒪᒫᒻᓂᓃᓄᓅᓇᓈᓐᓯᓰᓱᓲᓴᓵᔅᓕᓖᓗ' +
    'ᓘᓚᓛᓪᔨᔩᔪᔫᔭ… ᔮᔾᕕᕖᕗ–—“”‘’ᕘᕙᕚᕝᕆᕇᕈᕉᕋᕌᕐᕿᖀᖁᖂᖃᖄᖅᖏᖐᖑᖒᖓᖔᖕᙱᙲᙳᙴᙵᙶᖖᖠᖡᖢᖣᖤᖥᖦᕼŁł',
    'x-mac-ce':  // Python: 'mac_latin2'
    'ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅ' +
    'ņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ',
    macintosh:  // Python: 'mac_roman'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
    'x-mac-romanian':  // Python: 'mac_romanian'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂȘ∞±≤≥¥µ∂∑∏π∫ªºΩăș' +
    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›Țț‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
    'x-mac-turkish':  // Python: 'mac_turkish'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙˆ˜¯˘˙˚¸˝˛ˇ'
};

/**
 * Decodes an old-style Macintosh string. Returns either a Unicode JavaScript
 * string, or 'undefined' if the encoding is unsupported. For example, we do
 * not support Chinese, Japanese or Korean because these would need large
 * mapping tables.
 * @param {DataView} dataView
 * @param {number} offset
 * @param {number} dataLength
 * @param {string} encoding
 * @returns {string}
 */
decode.MACSTRING = function(dataView, offset, dataLength, encoding) {
    var table = eightBitMacEncodings[encoding];
    if (table === undefined) {
        return undefined;
    }

    var result = '';
    for (var i = 0; i < dataLength; i++) {
        var c = dataView.getUint8(offset + i);
        // In all eight-bit Mac encodings, the characters 0x00..0x7F are
        // mapped to U+0000..U+007F; we only need to look up the others.
        if (c <= 0x7F) {
            result += String.fromCharCode(c);
        } else {
            result += table[c & 0x7F];
        }
    }

    return result;
};

// Helper function for encode.MACSTRING. Returns a dictionary for mapping
// Unicode character codes to their 8-bit MacOS equivalent. This table
// is not exactly a super cheap data structure, but we do not care because
// encoding Macintosh strings is only rarely needed in typical applications.
var macEncodingTableCache = typeof WeakMap === 'function' && new WeakMap();
var macEncodingCacheKeys;
var getMacEncodingTable = function (encoding) {
    // Since we use encoding as a cache key for WeakMap, it has to be
    // a String object and not a literal. And at least on NodeJS 2.10.1,
    // WeakMap requires that the same String instance is passed for cache hits.
    if (!macEncodingCacheKeys) {
        macEncodingCacheKeys = {};
        for (var e in eightBitMacEncodings) {
            /*jshint -W053 */  // Suppress "Do not use String as a constructor."
            macEncodingCacheKeys[e] = new String(e);
        }
    }

    var cacheKey = macEncodingCacheKeys[encoding];
    if (cacheKey === undefined) {
        return undefined;
    }

    // We can't do "if (cache.has(key)) {return cache.get(key)}" here:
    // since garbage collection may run at any time, it could also kick in
    // between the calls to cache.has() and cache.get(). In that case,
    // we would return 'undefined' even though we do support the encoding.
    if (macEncodingTableCache) {
        var cachedTable = macEncodingTableCache.get(cacheKey);
        if (cachedTable !== undefined) {
            return cachedTable;
        }
    }

    var decodingTable = eightBitMacEncodings[encoding];
    if (decodingTable === undefined) {
        return undefined;
    }

    var encodingTable = {};
    for (var i = 0; i < decodingTable.length; i++) {
        encodingTable[decodingTable.charCodeAt(i)] = i + 0x80;
    }

    if (macEncodingTableCache) {
        macEncodingTableCache.set(cacheKey, encodingTable);
    }

    return encodingTable;
};

/**
 * Encodes an old-style Macintosh string. Returns a byte array upon success.
 * If the requested encoding is unsupported, or if the input string contains
 * a character that cannot be expressed in the encoding, the function returns
 * 'undefined'.
 * @param {string} str
 * @param {string} encoding
 * @returns {Array}
 */
encode.MACSTRING = function(str, encoding) {
    var table = getMacEncodingTable(encoding);
    if (table === undefined) {
        return undefined;
    }

    var result = [];
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);

        // In all eight-bit Mac encodings, the characters 0x00..0x7F are
        // mapped to U+0000..U+007F; we only need to look up the others.
        if (c >= 0x80) {
            c = table[c];
            if (c === undefined) {
                // str contains a Unicode character that cannot be encoded
                // in the requested encoding.
                return undefined;
            }
        }
        result[i] = c;
        // result.push(c);
    }

    return result;
};

/**
 * @param {string} str
 * @param {string} encoding
 * @returns {number}
 */
sizeOf.MACSTRING = function(str, encoding) {
    var b = encode.MACSTRING(str, encoding);
    if (b !== undefined) {
        return b.length;
    } else {
        return 0;
    }
};

// Helper for encode.VARDELTAS
function isByteEncodable(value) {
    return value >= -128 && value <= 127;
}

// Helper for encode.VARDELTAS
function encodeVarDeltaRunAsZeroes(deltas, pos, result) {
    var runLength = 0;
    var numDeltas = deltas.length;
    while (pos < numDeltas && runLength < 64 && deltas[pos] === 0) {
        ++pos;
        ++runLength;
    }
    result.push(0x80 | (runLength - 1));
    return pos;
}

// Helper for encode.VARDELTAS
function encodeVarDeltaRunAsBytes(deltas, offset, result) {
    var runLength = 0;
    var numDeltas = deltas.length;
    var pos = offset;
    while (pos < numDeltas && runLength < 64) {
        var value = deltas[pos];
        if (!isByteEncodable(value)) {
            break;
        }

        // Within a byte-encoded run of deltas, a single zero is best
        // stored literally as 0x00 value. However, if we have two or
        // more zeroes in a sequence, it is better to start a new run.
        // Fore example, the sequence of deltas [15, 15, 0, 15, 15]
        // becomes 6 bytes (04 0F 0F 00 0F 0F) when storing the zero
        // within the current run, but 7 bytes (01 0F 0F 80 01 0F 0F)
        // when starting a new run.
        if (value === 0 && pos + 1 < numDeltas && deltas[pos + 1] === 0) {
            break;
        }

        ++pos;
        ++runLength;
    }
    result.push(runLength - 1);
    for (var i = offset; i < pos; ++i) {
        result.push((deltas[i] + 256) & 0xff);
    }
    return pos;
}

// Helper for encode.VARDELTAS
function encodeVarDeltaRunAsWords(deltas, offset, result) {
    var runLength = 0;
    var numDeltas = deltas.length;
    var pos = offset;
    while (pos < numDeltas && runLength < 64) {
        var value = deltas[pos];

        // Within a word-encoded run of deltas, it is easiest to start
        // a new run (with a different encoding) whenever we encounter
        // a zero value. For example, the sequence [0x6666, 0, 0x7777]
        // needs 7 bytes when storing the zero inside the current run
        // (42 66 66 00 00 77 77), and equally 7 bytes when starting a
        // new run (40 66 66 80 40 77 77).
        if (value === 0) {
            break;
        }

        // Within a word-encoded run of deltas, a single value in the
        // range (-128..127) should be encoded within the current run
        // because it is more compact. For example, the sequence
        // [0x6666, 2, 0x7777] becomes 7 bytes when storing the value
        // literally (42 66 66 00 02 77 77), but 8 bytes when starting
        // a new run (40 66 66 00 02 40 77 77).
        if (isByteEncodable(value) && pos + 1 < numDeltas && isByteEncodable(deltas[pos + 1])) {
            break;
        }

        ++pos;
        ++runLength;
    }
    result.push(0x40 | (runLength - 1));
    for (var i = offset; i < pos; ++i) {
        var val = deltas[i];
        result.push(((val + 0x10000) >> 8) & 0xff, (val + 0x100) & 0xff);
    }
    return pos;
}

/**
 * Encode a list of variation adjustment deltas.
 *
 * Variation adjustment deltas are used in ‘gvar’ and ‘cvar’ tables.
 * They indicate how points (in ‘gvar’) or values (in ‘cvar’) get adjusted
 * when generating instances of variation fonts.
 *
 * @see https://www.microsoft.com/typography/otspec/gvar.htm
 * @see https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6gvar.html
 * @param {Array}
 * @return {Array}
 */
encode.VARDELTAS = function(deltas) {
    var pos = 0;
    var result = [];
    while (pos < deltas.length) {
        var value = deltas[pos];
        if (value === 0) {
            pos = encodeVarDeltaRunAsZeroes(deltas, pos, result);
        } else if (value >= -128 && value <= 127) {
            pos = encodeVarDeltaRunAsBytes(deltas, pos, result);
        } else {
            pos = encodeVarDeltaRunAsWords(deltas, pos, result);
        }
    }
    return result;
};

// Convert a list of values to a CFF INDEX structure.
// The values should be objects containing name / type / value.
/**
 * @param {Array} l
 * @returns {Array}
 */
encode.INDEX = function(l) {
    //var offset, offsets, offsetEncoder, encodedOffsets, encodedOffset, data,
    //    i, v;
    // Because we have to know which data type to use to encode the offsets,
    // we have to go through the values twice: once to encode the data and
    // calculate the offsets, then again to encode the offsets using the fitting data type.
    var offset = 1; // First offset is always 1.
    var offsets = [offset];
    var data = [];
    for (var i = 0; i < l.length; i += 1) {
        var v = encode.OBJECT(l[i]);
        Array.prototype.push.apply(data, v);
        offset += v.length;
        offsets.push(offset);
    }

    if (data.length === 0) {
        return [0, 0];
    }

    var encodedOffsets = [];
    var offSize = (1 + Math.floor(Math.log(offset) / Math.log(2)) / 8) | 0;
    var offsetEncoder = [undefined, encode.BYTE, encode.USHORT, encode.UINT24, encode.ULONG][offSize];
    for (var i$1 = 0; i$1 < offsets.length; i$1 += 1) {
        var encodedOffset = offsetEncoder(offsets[i$1]);
        Array.prototype.push.apply(encodedOffsets, encodedOffset);
    }

    return Array.prototype.concat(encode.Card16(l.length),
                           encode.OffSize(offSize),
                           encodedOffsets,
                           data);
};

/**
 * @param {Array}
 * @returns {number}
 */
sizeOf.INDEX = function(v) {
    return encode.INDEX(v).length;
};

/**
 * Convert an object to a CFF DICT structure.
 * The keys should be numeric.
 * The values should be objects containing name / type / value.
 * @param {Object} m
 * @returns {Array}
 */
encode.DICT = function(m) {
    var d = [];
    var keys = Object.keys(m);
    var length = keys.length;

    for (var i = 0; i < length; i += 1) {
        // Object.keys() return string keys, but our keys are always numeric.
        var k = parseInt(keys[i], 0);
        var v = m[k];
        // Value comes before the key.
        d = d.concat(encode.OPERAND(v.value, v.type));
        d = d.concat(encode.OPERATOR(k));
    }

    return d;
};

/**
 * @param {Object}
 * @returns {number}
 */
sizeOf.DICT = function(m) {
    return encode.DICT(m).length;
};

/**
 * @param {number}
 * @returns {Array}
 */
encode.OPERATOR = function(v) {
    if (v < 1200) {
        return [v];
    } else {
        return [12, v - 1200];
    }
};

/**
 * @param {Array} v
 * @param {string}
 * @returns {Array}
 */
encode.OPERAND = function(v, type) {
    var d = [];
    if (Array.isArray(type)) {
        for (var i = 0; i < type.length; i += 1) {
            check.argument(v.length === type.length, 'Not enough arguments given for type' + type);
            d = d.concat(encode.OPERAND(v[i], type[i]));
        }
    } else {
        if (type === 'SID') {
            d = d.concat(encode.NUMBER(v));
        } else if (type === 'offset') {
            // We make it easy for ourselves and always encode offsets as
            // 4 bytes. This makes offset calculation for the top dict easier.
            d = d.concat(encode.NUMBER32(v));
        } else if (type === 'number') {
            d = d.concat(encode.NUMBER(v));
        } else if (type === 'real') {
            d = d.concat(encode.REAL(v));
        } else {
            throw new Error('Unknown operand type ' + type);
            // FIXME Add support for booleans
        }
    }

    return d;
};

encode.OP = encode.BYTE;
sizeOf.OP = sizeOf.BYTE;

// memoize charstring encoding using WeakMap if available
var wmm = typeof WeakMap === 'function' && new WeakMap();

/**
 * Convert a list of CharString operations to bytes.
 * @param {Array}
 * @returns {Array}
 */
encode.CHARSTRING = function(ops) {
    // See encode.MACSTRING for why we don't do "if (wmm && wmm.has(ops))".
    if (wmm) {
        var cachedValue = wmm.get(ops);
        if (cachedValue !== undefined) {
            return cachedValue;
        }
    }

    var d = [];
    var length = ops.length;

    for (var i = 0; i < length; i += 1) {
        var op = ops[i];
        d = d.concat(encode[op.type](op.value));
    }

    if (wmm) {
        wmm.set(ops, d);
    }

    return d;
};

/**
 * @param {Array}
 * @returns {number}
 */
sizeOf.CHARSTRING = function(ops) {
    return encode.CHARSTRING(ops).length;
};

// Utility functions ////////////////////////////////////////////////////////

/**
 * Convert an object containing name / type / value to bytes.
 * @param {Object}
 * @returns {Array}
 */
encode.OBJECT = function(v) {
    var encodingFunction = encode[v.type];
    check.argument(encodingFunction !== undefined, 'No encoding function for type ' + v.type);
    return encodingFunction(v.value);
};

/**
 * @param {Object}
 * @returns {number}
 */
sizeOf.OBJECT = function(v) {
    var sizeOfFunction = sizeOf[v.type];
    check.argument(sizeOfFunction !== undefined, 'No sizeOf function for type ' + v.type);
    return sizeOfFunction(v.value);
};

/**
 * Convert a table object to bytes.
 * A table contains a list of fields containing the metadata (name, type and default value).
 * The table itself has the field values set as attributes.
 * @param {opentype.Table}
 * @returns {Array}
 */
encode.TABLE = function(table) {
    var d = [];
    var length = table.fields.length;
    var subtables = [];
    var subtableOffsets = [];

    for (var i = 0; i < length; i += 1) {
        var field = table.fields[i];
        var encodingFunction = encode[field.type];
        check.argument(encodingFunction !== undefined, 'No encoding function for field type ' + field.type + ' (' + field.name + ')');
        var value = table[field.name];
        if (value === undefined) {
            value = field.value;
        }

        var bytes = encodingFunction(value);

        if (field.type === 'TABLE') {
            subtableOffsets.push(d.length);
            d = d.concat([0, 0]);
            subtables.push(bytes);
        } else {
            d = d.concat(bytes);
        }
    }

    for (var i$1 = 0; i$1 < subtables.length; i$1 += 1) {
        var o = subtableOffsets[i$1];
        var offset = d.length;
        check.argument(offset < 65536, 'Table ' + table.tableName + ' too big.');
        d[o] = offset >> 8;
        d[o + 1] = offset & 0xff;
        d = d.concat(subtables[i$1]);
    }

    return d;
};

/**
 * @param {opentype.Table}
 * @returns {number}
 */
sizeOf.TABLE = function(table) {
    var numBytes = 0;
    var length = table.fields.length;

    for (var i = 0; i < length; i += 1) {
        var field = table.fields[i];
        var sizeOfFunction = sizeOf[field.type];
        check.argument(sizeOfFunction !== undefined, 'No sizeOf function for field type ' + field.type + ' (' + field.name + ')');
        var value = table[field.name];
        if (value === undefined) {
            value = field.value;
        }

        numBytes += sizeOfFunction(value);

        // Subtables take 2 more bytes for offsets.
        if (field.type === 'TABLE') {
            numBytes += 2;
        }
    }

    return numBytes;
};

encode.RECORD = encode.TABLE;
sizeOf.RECORD = sizeOf.TABLE;

// Merge in a list of bytes.
encode.LITERAL = function(v) {
    return v;
};

sizeOf.LITERAL = function(v) {
    return v.length;
};

// Table metadata

/**
 * @exports opentype.Table
 * @class
 * @param {string} tableName
 * @param {Array} fields
 * @param {Object} options
 * @constructor
 */
function Table(tableName, fields, options) {
    // For coverage tables with coverage format 2, we do not want to add the coverage data directly to the table object,
    // as this will result in wrong encoding order of the coverage data on serialization to bytes.
    // The fallback of using the field values directly when not present on the table is handled in types.encode.TABLE() already.
    if (fields.length && (fields[0].name !== 'coverageFormat' || fields[0].value === 1)) {
        for (var i = 0; i < fields.length; i += 1) {
            var field = fields[i];
            this[field.name] = field.value;
        }
    }

    this.tableName = tableName;
    this.fields = fields;
    if (options) {
        var optionKeys = Object.keys(options);
        for (var i$1 = 0; i$1 < optionKeys.length; i$1 += 1) {
            var k = optionKeys[i$1];
            var v = options[k];
            if (this[k] !== undefined) {
                this[k] = v;
            }
        }
    }
}

/**
 * Encodes the table and returns an array of bytes
 * @return {Array}
 */
Table.prototype.encode = function() {
    return encode.TABLE(this);
};

/**
 * Get the size of the table.
 * @return {number}
 */
Table.prototype.sizeOf = function() {
    return sizeOf.TABLE(this);
};

/**
 * @private
 */
function ushortList(itemName, list, count) {
    if (count === undefined) {
        count = list.length;
    }
    var fields = new Array(list.length + 1);
    fields[0] = {name: itemName + 'Count', type: 'USHORT', value: count};
    for (var i = 0; i < list.length; i++) {
        fields[i + 1] = {name: itemName + i, type: 'USHORT', value: list[i]};
    }
    return fields;
}

/**
 * @private
 */
function tableList(itemName, records, itemCallback) {
    var count = records.length;
    var fields = new Array(count + 1);
    fields[0] = {name: itemName + 'Count', type: 'USHORT', value: count};
    for (var i = 0; i < count; i++) {
        fields[i + 1] = {name: itemName + i, type: 'TABLE', value: itemCallback(records[i], i)};
    }
    return fields;
}

/**
 * @private
 */
function recordList(itemName, records, itemCallback) {
    var count = records.length;
    var fields = [];
    fields[0] = {name: itemName + 'Count', type: 'USHORT', value: count};
    for (var i = 0; i < count; i++) {
        fields = fields.concat(itemCallback(records[i], i));
    }
    return fields;
}

// Common Layout Tables

/**
 * @exports opentype.Coverage
 * @class
 * @param {opentype.Table}
 * @constructor
 * @extends opentype.Table
 */
function Coverage(coverageTable) {
    if (coverageTable.format === 1) {
        Table.call(this, 'coverageTable',
            [{name: 'coverageFormat', type: 'USHORT', value: 1}]
            .concat(ushortList('glyph', coverageTable.glyphs))
        );
    } else if (coverageTable.format === 2) {
        Table.call(this, 'coverageTable',
            [{name: 'coverageFormat', type: 'USHORT', value: 2}]
            .concat(recordList('rangeRecord', coverageTable.ranges, function(RangeRecord) {
                return [
                    {name: 'startGlyphID', type: 'USHORT', value: RangeRecord.start},
                    {name: 'endGlyphID', type: 'USHORT', value: RangeRecord.end},
                    {name: 'startCoverageIndex', type: 'USHORT', value: RangeRecord.index} ];
            }))
        );
    } else {
        check.assert(false, 'Coverage format must be 1 or 2.');
    }
}
Coverage.prototype = Object.create(Table.prototype);
Coverage.prototype.constructor = Coverage;

function ScriptList(scriptListTable) {
    Table.call(this, 'scriptListTable',
        recordList('scriptRecord', scriptListTable, function(scriptRecord, i) {
            var script = scriptRecord.script;
            var defaultLangSys = script.defaultLangSys;
            check.assert(!!defaultLangSys, 'Unable to write GSUB: script ' + scriptRecord.tag + ' has no default language system.');
            return [
                {name: 'scriptTag' + i, type: 'TAG', value: scriptRecord.tag},
                {name: 'script' + i, type: 'TABLE', value: new Table('scriptTable', [
                    {name: 'defaultLangSys', type: 'TABLE', value: new Table('defaultLangSys', [
                        {name: 'lookupOrder', type: 'USHORT', value: 0},
                        {name: 'reqFeatureIndex', type: 'USHORT', value: defaultLangSys.reqFeatureIndex}]
                        .concat(ushortList('featureIndex', defaultLangSys.featureIndexes)))}
                    ].concat(recordList('langSys', script.langSysRecords, function(langSysRecord, i) {
                        var langSys = langSysRecord.langSys;
                        return [
                            {name: 'langSysTag' + i, type: 'TAG', value: langSysRecord.tag},
                            {name: 'langSys' + i, type: 'TABLE', value: new Table('langSys', [
                                {name: 'lookupOrder', type: 'USHORT', value: 0},
                                {name: 'reqFeatureIndex', type: 'USHORT', value: langSys.reqFeatureIndex}
                                ].concat(ushortList('featureIndex', langSys.featureIndexes)))}
                        ];
                    })))}
            ];
        })
    );
}
ScriptList.prototype = Object.create(Table.prototype);
ScriptList.prototype.constructor = ScriptList;

/**
 * @exports opentype.FeatureList
 * @class
 * @param {opentype.Table}
 * @constructor
 * @extends opentype.Table
 */
function FeatureList(featureListTable) {
    Table.call(this, 'featureListTable',
        recordList('featureRecord', featureListTable, function(featureRecord, i) {
            var feature = featureRecord.feature;
            return [
                {name: 'featureTag' + i, type: 'TAG', value: featureRecord.tag},
                {name: 'feature' + i, type: 'TABLE', value: new Table('featureTable', [
                    {name: 'featureParams', type: 'USHORT', value: feature.featureParams} ].concat(ushortList('lookupListIndex', feature.lookupListIndexes)))}
            ];
        })
    );
}
FeatureList.prototype = Object.create(Table.prototype);
FeatureList.prototype.constructor = FeatureList;

/**
 * @exports opentype.LookupList
 * @class
 * @param {opentype.Table}
 * @param {Object}
 * @constructor
 * @extends opentype.Table
 */
function LookupList(lookupListTable, subtableMakers) {
    Table.call(this, 'lookupListTable', tableList('lookup', lookupListTable, function(lookupTable) {
        var subtableCallback = subtableMakers[lookupTable.lookupType];
        check.assert(!!subtableCallback, 'Unable to write GSUB lookup type ' + lookupTable.lookupType + ' tables.');
        return new Table('lookupTable', [
            {name: 'lookupType', type: 'USHORT', value: lookupTable.lookupType},
            {name: 'lookupFlag', type: 'USHORT', value: lookupTable.lookupFlag}
        ].concat(tableList('subtable', lookupTable.subtables, subtableCallback)));
    }));
}
LookupList.prototype = Object.create(Table.prototype);
LookupList.prototype.constructor = LookupList;

// Record = same as Table, but inlined (a Table has an offset and its data is further in the stream)
// Don't use offsets inside Records (probable bug), only in Tables.
var table = {
    Table: Table,
    Record: Table,
    Coverage: Coverage,
    ScriptList: ScriptList,
    FeatureList: FeatureList,
    LookupList: LookupList,
    ushortList: ushortList,
    tableList: tableList,
    recordList: recordList,
};

// Parsing utility functions

// Retrieve an unsigned byte from the DataView.
function getByte(dataView, offset) {
    return dataView.getUint8(offset);
}

// Retrieve an unsigned 16-bit short from the DataView.
// The value is stored in big endian.
function getUShort(dataView, offset) {
    return dataView.getUint16(offset, false);
}

// Retrieve a signed 16-bit short from the DataView.
// The value is stored in big endian.
function getShort(dataView, offset) {
    return dataView.getInt16(offset, false);
}

// Retrieve an unsigned 32-bit long from the DataView.
// The value is stored in big endian.
function getULong(dataView, offset) {
    return dataView.getUint32(offset, false);
}

// Retrieve a 32-bit signed fixed-point number (16.16) from the DataView.
// The value is stored in big endian.
function getFixed(dataView, offset) {
    var decimal = dataView.getInt16(offset, false);
    var fraction = dataView.getUint16(offset + 2, false);
    return decimal + fraction / 65535;
}

// Retrieve a 4-character tag from the DataView.
// Tags are used to identify tables.
function getTag(dataView, offset) {
    var tag = '';
    for (var i = offset; i < offset + 4; i += 1) {
        tag += String.fromCharCode(dataView.getInt8(i));
    }

    return tag;
}

// Retrieve an offset from the DataView.
// Offsets are 1 to 4 bytes in length, depending on the offSize argument.
function getOffset(dataView, offset, offSize) {
    var v = 0;
    for (var i = 0; i < offSize; i += 1) {
        v <<= 8;
        v += dataView.getUint8(offset + i);
    }

    return v;
}

// Retrieve a number of bytes from start offset to the end offset from the DataView.
function getBytes(dataView, startOffset, endOffset) {
    var bytes = [];
    for (var i = startOffset; i < endOffset; i += 1) {
        bytes.push(dataView.getUint8(i));
    }

    return bytes;
}

// Convert the list of bytes to a string.
function bytesToString(bytes) {
    var s = '';
    for (var i = 0; i < bytes.length; i += 1) {
        s += String.fromCharCode(bytes[i]);
    }

    return s;
}

var typeOffsets = {
    byte: 1,
    uShort: 2,
    short: 2,
    uLong: 4,
    fixed: 4,
    longDateTime: 8,
    tag: 4
};

// A stateful parser that changes the offset whenever a value is retrieved.
// The data is a DataView.
function Parser(data, offset) {
    this.data = data;
    this.offset = offset;
    this.relativeOffset = 0;
}

Parser.prototype.parseByte = function() {
    var v = this.data.getUint8(this.offset + this.relativeOffset);
    this.relativeOffset += 1;
    return v;
};

Parser.prototype.parseChar = function() {
    var v = this.data.getInt8(this.offset + this.relativeOffset);
    this.relativeOffset += 1;
    return v;
};

Parser.prototype.parseCard8 = Parser.prototype.parseByte;

Parser.prototype.parseUShort = function() {
    var v = this.data.getUint16(this.offset + this.relativeOffset);
    this.relativeOffset += 2;
    return v;
};

Parser.prototype.parseCard16 = Parser.prototype.parseUShort;
Parser.prototype.parseSID = Parser.prototype.parseUShort;
Parser.prototype.parseOffset16 = Parser.prototype.parseUShort;

Parser.prototype.parseShort = function() {
    var v = this.data.getInt16(this.offset + this.relativeOffset);
    this.relativeOffset += 2;
    return v;
};

Parser.prototype.parseF2Dot14 = function() {
    var v = this.data.getInt16(this.offset + this.relativeOffset) / 16384;
    this.relativeOffset += 2;
    return v;
};

Parser.prototype.parseULong = function() {
    var v = getULong(this.data, this.offset + this.relativeOffset);
    this.relativeOffset += 4;
    return v;
};

Parser.prototype.parseOffset32 = Parser.prototype.parseULong;

Parser.prototype.parseFixed = function() {
    var v = getFixed(this.data, this.offset + this.relativeOffset);
    this.relativeOffset += 4;
    return v;
};

Parser.prototype.parseString = function(length) {
    var dataView = this.data;
    var offset = this.offset + this.relativeOffset;
    var string = '';
    this.relativeOffset += length;
    for (var i = 0; i < length; i++) {
        string += String.fromCharCode(dataView.getUint8(offset + i));
    }

    return string;
};

Parser.prototype.parseTag = function() {
    return this.parseString(4);
};

// LONGDATETIME is a 64-bit integer.
// JavaScript and unix timestamps traditionally use 32 bits, so we
// only take the last 32 bits.
// + Since until 2038 those bits will be filled by zeros we can ignore them.
Parser.prototype.parseLongDateTime = function() {
    var v = getULong(this.data, this.offset + this.relativeOffset + 4);
    // Subtract seconds between 01/01/1904 and 01/01/1970
    // to convert Apple Mac timestamp to Standard Unix timestamp
    v -= 2082844800;
    this.relativeOffset += 8;
    return v;
};

Parser.prototype.parseVersion = function(minorBase) {
    var major = getUShort(this.data, this.offset + this.relativeOffset);

    // How to interpret the minor version is very vague in the spec. 0x5000 is 5, 0x1000 is 1
    // Default returns the correct number if minor = 0xN000 where N is 0-9
    // Set minorBase to 1 for tables that use minor = N where N is 0-9
    var minor = getUShort(this.data, this.offset + this.relativeOffset + 2);
    this.relativeOffset += 4;
    if (minorBase === undefined) { minorBase = 0x1000; }
    return major + minor / minorBase / 10;
};

Parser.prototype.skip = function(type, amount) {
    if (amount === undefined) {
        amount = 1;
    }

    this.relativeOffset += typeOffsets[type] * amount;
};

///// Parsing lists and records ///////////////////////////////

// Parse a list of 32 bit unsigned integers.
Parser.prototype.parseULongList = function(count) {
    if (count === undefined) { count = this.parseULong(); }
    var offsets = new Array(count);
    var dataView = this.data;
    var offset = this.offset + this.relativeOffset;
    for (var i = 0; i < count; i++) {
        offsets[i] = dataView.getUint32(offset);
        offset += 4;
    }

    this.relativeOffset += count * 4;
    return offsets;
};

// Parse a list of 16 bit unsigned integers. The length of the list can be read on the stream
// or provided as an argument.
Parser.prototype.parseOffset16List =
Parser.prototype.parseUShortList = function(count) {
    if (count === undefined) { count = this.parseUShort(); }
    var offsets = new Array(count);
    var dataView = this.data;
    var offset = this.offset + this.relativeOffset;
    for (var i = 0; i < count; i++) {
        offsets[i] = dataView.getUint16(offset);
        offset += 2;
    }

    this.relativeOffset += count * 2;
    return offsets;
};

// Parses a list of 16 bit signed integers.
Parser.prototype.parseShortList = function(count) {
    var list = new Array(count);
    var dataView = this.data;
    var offset = this.offset + this.relativeOffset;
    for (var i = 0; i < count; i++) {
        list[i] = dataView.getInt16(offset);
        offset += 2;
    }

    this.relativeOffset += count * 2;
    return list;
};

// Parses a list of bytes.
Parser.prototype.parseByteList = function(count) {
    var list = new Array(count);
    var dataView = this.data;
    var offset = this.offset + this.relativeOffset;
    for (var i = 0; i < count; i++) {
        list[i] = dataView.getUint8(offset++);
    }

    this.relativeOffset += count;
    return list;
};

/**
 * Parse a list of items.
 * Record count is optional, if omitted it is read from the stream.
 * itemCallback is one of the Parser methods.
 */
Parser.prototype.parseList = function(count, itemCallback) {
    if (!itemCallback) {
        itemCallback = count;
        count = this.parseUShort();
    }
    var list = new Array(count);
    for (var i = 0; i < count; i++) {
        list[i] = itemCallback.call(this);
    }
    return list;
};

Parser.prototype.parseList32 = function(count, itemCallback) {
    if (!itemCallback) {
        itemCallback = count;
        count = this.parseULong();
    }
    var list = new Array(count);
    for (var i = 0; i < count; i++) {
        list[i] = itemCallback.call(this);
    }
    return list;
};

/**
 * Parse a list of records.
 * Record count is optional, if omitted it is read from the stream.
 * Example of recordDescription: { sequenceIndex: Parser.uShort, lookupListIndex: Parser.uShort }
 */
Parser.prototype.parseRecordList = function(count, recordDescription) {
    // If the count argument is absent, read it in the stream.
    if (!recordDescription) {
        recordDescription = count;
        count = this.parseUShort();
    }
    var records = new Array(count);
    var fields = Object.keys(recordDescription);
    for (var i = 0; i < count; i++) {
        var rec = {};
        for (var j = 0; j < fields.length; j++) {
            var fieldName = fields[j];
            var fieldType = recordDescription[fieldName];
            rec[fieldName] = fieldType.call(this);
        }
        records[i] = rec;
    }
    return records;
};

Parser.prototype.parseRecordList32 = function(count, recordDescription) {
    // If the count argument is absent, read it in the stream.
    if (!recordDescription) {
        recordDescription = count;
        count = this.parseULong();
    }
    var records = new Array(count);
    var fields = Object.keys(recordDescription);
    for (var i = 0; i < count; i++) {
        var rec = {};
        for (var j = 0; j < fields.length; j++) {
            var fieldName = fields[j];
            var fieldType = recordDescription[fieldName];
            rec[fieldName] = fieldType.call(this);
        }
        records[i] = rec;
    }
    return records;
};

// Parse a data structure into an object
// Example of description: { sequenceIndex: Parser.uShort, lookupListIndex: Parser.uShort }
Parser.prototype.parseStruct = function(description) {
    if (typeof description === 'function') {
        return description.call(this);
    } else {
        var fields = Object.keys(description);
        var struct = {};
        for (var j = 0; j < fields.length; j++) {
            var fieldName = fields[j];
            var fieldType = description[fieldName];
            struct[fieldName] = fieldType.call(this);
        }
        return struct;
    }
};

/**
 * Parse a GPOS valueRecord
 * https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#value-record
 * valueFormat is optional, if omitted it is read from the stream.
 */
Parser.prototype.parseValueRecord = function(valueFormat) {
    if (valueFormat === undefined) {
        valueFormat = this.parseUShort();
    }
    if (valueFormat === 0) {
        // valueFormat2 in kerning pairs is most often 0
        // in this case return undefined instead of an empty object, to save space
        return;
    }
    var valueRecord = {};

    if (valueFormat & 0x0001) { valueRecord.xPlacement = this.parseShort(); }
    if (valueFormat & 0x0002) { valueRecord.yPlacement = this.parseShort(); }
    if (valueFormat & 0x0004) { valueRecord.xAdvance = this.parseShort(); }
    if (valueFormat & 0x0008) { valueRecord.yAdvance = this.parseShort(); }

    // Device table (non-variable font) / VariationIndex table (variable font) not supported
    // https://docs.microsoft.com/fr-fr/typography/opentype/spec/chapter2#devVarIdxTbls
    if (valueFormat & 0x0010) { valueRecord.xPlaDevice = undefined; this.parseShort(); }
    if (valueFormat & 0x0020) { valueRecord.yPlaDevice = undefined; this.parseShort(); }
    if (valueFormat & 0x0040) { valueRecord.xAdvDevice = undefined; this.parseShort(); }
    if (valueFormat & 0x0080) { valueRecord.yAdvDevice = undefined; this.parseShort(); }

    return valueRecord;
};

/**
 * Parse a list of GPOS valueRecords
 * https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#value-record
 * valueFormat and valueCount are read from the stream.
 */
Parser.prototype.parseValueRecordList = function() {
    var valueFormat = this.parseUShort();
    var valueCount = this.parseUShort();
    var values = new Array(valueCount);
    for (var i = 0; i < valueCount; i++) {
        values[i] = this.parseValueRecord(valueFormat);
    }
    return values;
};

Parser.prototype.parsePointer = function(description) {
    var structOffset = this.parseOffset16();
    if (structOffset > 0) {
        // NULL offset => return undefined
        return new Parser(this.data, this.offset + structOffset).parseStruct(description);
    }
    return undefined;
};

Parser.prototype.parsePointer32 = function(description) {
    var structOffset = this.parseOffset32();
    if (structOffset > 0) {
        // NULL offset => return undefined
        return new Parser(this.data, this.offset + structOffset).parseStruct(description);
    }
    return undefined;
};

/**
 * Parse a list of offsets to lists of 16-bit integers,
 * or a list of offsets to lists of offsets to any kind of items.
 * If itemCallback is not provided, a list of list of UShort is assumed.
 * If provided, itemCallback is called on each item and must parse the item.
 * See examples in tables/gsub.js
 */
Parser.prototype.parseListOfLists = function(itemCallback) {
    var offsets = this.parseOffset16List();
    var count = offsets.length;
    var relativeOffset = this.relativeOffset;
    var list = new Array(count);
    for (var i = 0; i < count; i++) {
        var start = offsets[i];
        if (start === 0) {
            // NULL offset
            // Add i as owned property to list. Convenient with assert.
            list[i] = undefined;
            continue;
        }
        this.relativeOffset = start;
        if (itemCallback) {
            var subOffsets = this.parseOffset16List();
            var subList = new Array(subOffsets.length);
            for (var j = 0; j < subOffsets.length; j++) {
                this.relativeOffset = start + subOffsets[j];
                subList[j] = itemCallback.call(this);
            }
            list[i] = subList;
        } else {
            list[i] = this.parseUShortList();
        }
    }
    this.relativeOffset = relativeOffset;
    return list;
};

///// Complex tables parsing //////////////////////////////////

// Parse a coverage table in a GSUB, GPOS or GDEF table.
// https://www.microsoft.com/typography/OTSPEC/chapter2.htm
// parser.offset must point to the start of the table containing the coverage.
Parser.prototype.parseCoverage = function() {
    var startOffset = this.offset + this.relativeOffset;
    var format = this.parseUShort();
    var count = this.parseUShort();
    if (format === 1) {
        return {
            format: 1,
            glyphs: this.parseUShortList(count)
        };
    } else if (format === 2) {
        var ranges = new Array(count);
        for (var i = 0; i < count; i++) {
            ranges[i] = {
                start: this.parseUShort(),
                end: this.parseUShort(),
                index: this.parseUShort()
            };
        }
        return {
            format: 2,
            ranges: ranges
        };
    }
    throw new Error('0x' + startOffset.toString(16) + ': Coverage format must be 1 or 2.');
};

// Parse a Class Definition Table in a GSUB, GPOS or GDEF table.
// https://www.microsoft.com/typography/OTSPEC/chapter2.htm
Parser.prototype.parseClassDef = function() {
    var startOffset = this.offset + this.relativeOffset;
    var format = this.parseUShort();
    if (format === 1) {
        return {
            format: 1,
            startGlyph: this.parseUShort(),
            classes: this.parseUShortList()
        };
    } else if (format === 2) {
        return {
            format: 2,
            ranges: this.parseRecordList({
                start: Parser.uShort,
                end: Parser.uShort,
                classId: Parser.uShort
            })
        };
    }
    throw new Error('0x' + startOffset.toString(16) + ': ClassDef format must be 1 or 2.');
};

///// Static methods ///////////////////////////////////
// These convenience methods can be used as callbacks and should be called with "this" context set to a Parser instance.

Parser.list = function(count, itemCallback) {
    return function() {
        return this.parseList(count, itemCallback);
    };
};

Parser.list32 = function(count, itemCallback) {
    return function() {
        return this.parseList32(count, itemCallback);
    };
};

Parser.recordList = function(count, recordDescription) {
    return function() {
        return this.parseRecordList(count, recordDescription);
    };
};

Parser.recordList32 = function(count, recordDescription) {
    return function() {
        return this.parseRecordList32(count, recordDescription);
    };
};

Parser.pointer = function(description) {
    return function() {
        return this.parsePointer(description);
    };
};

Parser.pointer32 = function(description) {
    return function() {
        return this.parsePointer32(description);
    };
};

Parser.tag = Parser.prototype.parseTag;
Parser.byte = Parser.prototype.parseByte;
Parser.uShort = Parser.offset16 = Parser.prototype.parseUShort;
Parser.uShortList = Parser.prototype.parseUShortList;
Parser.uLong = Parser.offset32 = Parser.prototype.parseULong;
Parser.uLongList = Parser.prototype.parseULongList;
Parser.struct = Parser.prototype.parseStruct;
Parser.coverage = Parser.prototype.parseCoverage;
Parser.classDef = Parser.prototype.parseClassDef;

///// Script, Feature, Lookup lists ///////////////////////////////////////////////
// https://www.microsoft.com/typography/OTSPEC/chapter2.htm

var langSysTable = {
    reserved: Parser.uShort,
    reqFeatureIndex: Parser.uShort,
    featureIndexes: Parser.uShortList
};

Parser.prototype.parseScriptList = function() {
    return this.parsePointer(Parser.recordList({
        tag: Parser.tag,
        script: Parser.pointer({
            defaultLangSys: Parser.pointer(langSysTable),
            langSysRecords: Parser.recordList({
                tag: Parser.tag,
                langSys: Parser.pointer(langSysTable)
            })
        })
    })) || [];
};

Parser.prototype.parseFeatureList = function() {
    return this.parsePointer(Parser.recordList({
        tag: Parser.tag,
        feature: Parser.pointer({
            featureParams: Parser.offset16,
            lookupListIndexes: Parser.uShortList
        })
    })) || [];
};

Parser.prototype.parseLookupList = function(lookupTableParsers) {
    return this.parsePointer(Parser.list(Parser.pointer(function() {
        var lookupType = this.parseUShort();
        check.argument(1 <= lookupType && lookupType <= 9, 'GPOS/GSUB lookup type ' + lookupType + ' unknown.');
        var lookupFlag = this.parseUShort();
        var useMarkFilteringSet = lookupFlag & 0x10;
        return {
            lookupType: lookupType,
            lookupFlag: lookupFlag,
            subtables: this.parseList(Parser.pointer(lookupTableParsers[lookupType])),
            markFilteringSet: useMarkFilteringSet ? this.parseUShort() : undefined
        };
    }))) || [];
};

Parser.prototype.parseFeatureVariationsList = function() {
    return this.parsePointer32(function() {
        var majorVersion = this.parseUShort();
        var minorVersion = this.parseUShort();
        check.argument(majorVersion === 1 && minorVersion < 1, 'GPOS/GSUB feature variations table unknown.');
        var featureVariations = this.parseRecordList32({
            conditionSetOffset: Parser.offset32,
            featureTableSubstitutionOffset: Parser.offset32
        });
        return featureVariations;
    }) || [];
};

var parse = {
    getByte: getByte,
    getCard8: getByte,
    getUShort: getUShort,
    getCard16: getUShort,
    getShort: getShort,
    getULong: getULong,
    getFixed: getFixed,
    getTag: getTag,
    getOffset: getOffset,
    getBytes: getBytes,
    bytesToString: bytesToString,
    Parser: Parser,
};

// The `cmap` table stores the mappings from characters to glyphs.

function parseCmapTableFormat12(cmap, p) {
    //Skip reserved.
    p.parseUShort();

    // Length in bytes of the sub-tables.
    cmap.length = p.parseULong();
    cmap.language = p.parseULong();

    var groupCount;
    cmap.groupCount = groupCount = p.parseULong();
    cmap.glyphIndexMap = {};

    for (var i = 0; i < groupCount; i += 1) {
        var startCharCode = p.parseULong();
        var endCharCode = p.parseULong();
        var startGlyphId = p.parseULong();

        for (var c = startCharCode; c <= endCharCode; c += 1) {
            cmap.glyphIndexMap[c] = startGlyphId;
            startGlyphId++;
        }
    }
}

function parseCmapTableFormat4(cmap, p, data, start, offset) {
    // Length in bytes of the sub-tables.
    cmap.length = p.parseUShort();
    cmap.language = p.parseUShort();

    // segCount is stored x 2.
    var segCount;
    cmap.segCount = segCount = p.parseUShort() >> 1;

    // Skip searchRange, entrySelector, rangeShift.
    p.skip('uShort', 3);

    // The "unrolled" mapping from character codes to glyph indices.
    cmap.glyphIndexMap = {};
    var endCountParser = new parse.Parser(data, start + offset + 14);
    var startCountParser = new parse.Parser(data, start + offset + 16 + segCount * 2);
    var idDeltaParser = new parse.Parser(data, start + offset + 16 + segCount * 4);
    var idRangeOffsetParser = new parse.Parser(data, start + offset + 16 + segCount * 6);
    var glyphIndexOffset = start + offset + 16 + segCount * 8;
    for (var i = 0; i < segCount - 1; i += 1) {
        var glyphIndex = (void 0);
        var endCount = endCountParser.parseUShort();
        var startCount = startCountParser.parseUShort();
        var idDelta = idDeltaParser.parseShort();
        var idRangeOffset = idRangeOffsetParser.parseUShort();
        for (var c = startCount; c <= endCount; c += 1) {
            if (idRangeOffset !== 0) {
                // The idRangeOffset is relative to the current position in the idRangeOffset array.
                // Take the current offset in the idRangeOffset array.
                glyphIndexOffset = (idRangeOffsetParser.offset + idRangeOffsetParser.relativeOffset - 2);

                // Add the value of the idRangeOffset, which will move us into the glyphIndex array.
                glyphIndexOffset += idRangeOffset;

                // Then add the character index of the current segment, multiplied by 2 for USHORTs.
                glyphIndexOffset += (c - startCount) * 2;
                glyphIndex = parse.getUShort(data, glyphIndexOffset);
                if (glyphIndex !== 0) {
                    glyphIndex = (glyphIndex + idDelta) & 0xFFFF;
                }
            } else {
                glyphIndex = (c + idDelta) & 0xFFFF;
            }

            cmap.glyphIndexMap[c] = glyphIndex;
        }
    }
}

// Parse the `cmap` table. This table stores the mappings from characters to glyphs.
// There are many available formats, but we only support the Windows format 4 and 12.
// This function returns a `CmapEncoding` object or null if no supported format could be found.
function parseCmapTable(data, start) {
    var cmap = {};
    cmap.version = parse.getUShort(data, start);
    check.argument(cmap.version === 0, 'cmap table version should be 0.');

    // The cmap table can contain many sub-tables, each with their own format.
    // We're only interested in a "platform 0" (Unicode format) and "platform 3" (Windows format) table.
    cmap.numTables = parse.getUShort(data, start + 2);
    var offset = -1;
    for (var i = cmap.numTables - 1; i >= 0; i -= 1) {
        var platformId = parse.getUShort(data, start + 4 + (i * 8));
        var encodingId = parse.getUShort(data, start + 4 + (i * 8) + 2);
        if ((platformId === 3 && (encodingId === 0 || encodingId === 1 || encodingId === 10)) ||
            (platformId === 0 && (encodingId === 0 || encodingId === 1 || encodingId === 2 || encodingId === 3 || encodingId === 4))) {
            offset = parse.getULong(data, start + 4 + (i * 8) + 4);
            break;
        }
    }

    if (offset === -1) {
        // There is no cmap table in the font that we support.
        throw new Error('No valid cmap sub-tables found.');
    }

    var p = new parse.Parser(data, start + offset);
    cmap.format = p.parseUShort();

    if (cmap.format === 12) {
        parseCmapTableFormat12(cmap, p);
    } else if (cmap.format === 4) {
        parseCmapTableFormat4(cmap, p, data, start, offset);
    } else {
        throw new Error('Only format 4 and 12 cmap tables are supported (found format ' + cmap.format + ').');
    }

    return cmap;
}

function addSegment(t, code, glyphIndex) {
    t.segments.push({
        end: code,
        start: code,
        delta: -(code - glyphIndex),
        offset: 0,
        glyphIndex: glyphIndex
    });
}

function addTerminatorSegment(t) {
    t.segments.push({
        end: 0xFFFF,
        start: 0xFFFF,
        delta: 1,
        offset: 0
    });
}

// Make cmap table, format 4 by default, 12 if needed only
function makeCmapTable(glyphs) {
    // Plan 0 is the base Unicode Plan but emojis, for example are on another plan, and needs cmap 12 format (with 32bit)
    var isPlan0Only = true;
    var i;

    // Check if we need to add cmap format 12 or if format 4 only is fine
    for (i = glyphs.length - 1; i > 0; i -= 1) {
        var g = glyphs.get(i);
        if (g.unicode > 65535) {
            console.log('Adding CMAP format 12 (needed!)');
            isPlan0Only = false;
            break;
        }
    }

    var cmapTable = [
        {name: 'version', type: 'USHORT', value: 0},
        {name: 'numTables', type: 'USHORT', value: isPlan0Only ? 1 : 2},

        // CMAP 4 header
        {name: 'platformID', type: 'USHORT', value: 3},
        {name: 'encodingID', type: 'USHORT', value: 1},
        {name: 'offset', type: 'ULONG', value: isPlan0Only ? 12 : (12 + 8)}
    ];

    if (!isPlan0Only)
        { cmapTable = cmapTable.concat([
            // CMAP 12 header
            {name: 'cmap12PlatformID', type: 'USHORT', value: 3}, // We encode only for PlatformID = 3 (Windows) because it is supported everywhere
            {name: 'cmap12EncodingID', type: 'USHORT', value: 10},
            {name: 'cmap12Offset', type: 'ULONG', value: 0}
        ]); }

    cmapTable = cmapTable.concat([
        // CMAP 4 Subtable
        {name: 'format', type: 'USHORT', value: 4},
        {name: 'cmap4Length', type: 'USHORT', value: 0},
        {name: 'language', type: 'USHORT', value: 0},
        {name: 'segCountX2', type: 'USHORT', value: 0},
        {name: 'searchRange', type: 'USHORT', value: 0},
        {name: 'entrySelector', type: 'USHORT', value: 0},
        {name: 'rangeShift', type: 'USHORT', value: 0}
    ]);

    var t = new table.Table('cmap', cmapTable);

    t.segments = [];
    for (i = 0; i < glyphs.length; i += 1) {
        var glyph = glyphs.get(i);
        for (var j = 0; j < glyph.unicodes.length; j += 1) {
            addSegment(t, glyph.unicodes[j], i);
        }

        t.segments = t.segments.sort(function (a, b) {
            return a.start - b.start;
        });
    }

    addTerminatorSegment(t);

    var segCount = t.segments.length;
    var segCountToRemove = 0;

    // CMAP 4
    // Set up parallel segment arrays.
    var endCounts = [];
    var startCounts = [];
    var idDeltas = [];
    var idRangeOffsets = [];
    var glyphIds = [];

    // CMAP 12
    var cmap12Groups = [];

    // Reminder this loop is not following the specification at 100%
    // The specification -> find suites of characters and make a group
    // Here we're doing one group for each letter
    // Doing as the spec can save 8 times (or more) space
    for (i = 0; i < segCount; i += 1) {
        var segment = t.segments[i];

        // CMAP 4
        if (segment.end <= 65535 && segment.start <= 65535) {
            endCounts = endCounts.concat({name: 'end_' + i, type: 'USHORT', value: segment.end});
            startCounts = startCounts.concat({name: 'start_' + i, type: 'USHORT', value: segment.start});
            idDeltas = idDeltas.concat({name: 'idDelta_' + i, type: 'SHORT', value: segment.delta});
            idRangeOffsets = idRangeOffsets.concat({name: 'idRangeOffset_' + i, type: 'USHORT', value: segment.offset});
            if (segment.glyphId !== undefined) {
                glyphIds = glyphIds.concat({name: 'glyph_' + i, type: 'USHORT', value: segment.glyphId});
            }
        } else {
            // Skip Unicode > 65535 (16bit unsigned max) for CMAP 4, will be added in CMAP 12
            segCountToRemove += 1;
        }

        // CMAP 12
        // Skip Terminator Segment
        if (!isPlan0Only && segment.glyphIndex !== undefined) {
            cmap12Groups = cmap12Groups.concat({name: 'cmap12Start_' + i, type: 'ULONG', value: segment.start});
            cmap12Groups = cmap12Groups.concat({name: 'cmap12End_' + i, type: 'ULONG', value: segment.end});
            cmap12Groups = cmap12Groups.concat({name: 'cmap12Glyph_' + i, type: 'ULONG', value: segment.glyphIndex});
        }
    }

    // CMAP 4 Subtable
    t.segCountX2 = (segCount - segCountToRemove) * 2;
    t.searchRange = Math.pow(2, Math.floor(Math.log((segCount - segCountToRemove)) / Math.log(2))) * 2;
    t.entrySelector = Math.log(t.searchRange / 2) / Math.log(2);
    t.rangeShift = t.segCountX2 - t.searchRange;

    t.fields = t.fields.concat(endCounts);
    t.fields.push({name: 'reservedPad', type: 'USHORT', value: 0});
    t.fields = t.fields.concat(startCounts);
    t.fields = t.fields.concat(idDeltas);
    t.fields = t.fields.concat(idRangeOffsets);
    t.fields = t.fields.concat(glyphIds);

    t.cmap4Length = 14 + // Subtable header
        endCounts.length * 2 +
        2 + // reservedPad
        startCounts.length * 2 +
        idDeltas.length * 2 +
        idRangeOffsets.length * 2 +
        glyphIds.length * 2;

    if (!isPlan0Only) {
        // CMAP 12 Subtable
        var cmap12Length = 16 + // Subtable header
            cmap12Groups.length * 4;

        t.cmap12Offset = 12 + (2 * 2) + 4 + t.cmap4Length;
        t.fields = t.fields.concat([
            {name: 'cmap12Format', type: 'USHORT', value: 12},
            {name: 'cmap12Reserved', type: 'USHORT', value: 0},
            {name: 'cmap12Length', type: 'ULONG', value: cmap12Length},
            {name: 'cmap12Language', type: 'ULONG', value: 0},
            {name: 'cmap12nGroups', type: 'ULONG', value: cmap12Groups.length / 3}
        ]);

        t.fields = t.fields.concat(cmap12Groups);
    }

    return t;
}

var cmap = { parse: parseCmapTable, make: makeCmapTable };

// Glyph encoding

var cffStandardStrings = [
    '.notdef', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quoteright',
    'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two',
    'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater',
    'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore',
    'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', 'exclamdown', 'cent', 'sterling',
    'fraction', 'yen', 'florin', 'section', 'currency', 'quotesingle', 'quotedblleft', 'guillemotleft',
    'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'endash', 'dagger', 'daggerdbl', 'periodcentered', 'paragraph',
    'bullet', 'quotesinglbase', 'quotedblbase', 'quotedblright', 'guillemotright', 'ellipsis', 'perthousand',
    'questiondown', 'grave', 'acute', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'dieresis', 'ring',
    'cedilla', 'hungarumlaut', 'ogonek', 'caron', 'emdash', 'AE', 'ordfeminine', 'Lslash', 'Oslash', 'OE',
    'ordmasculine', 'ae', 'dotlessi', 'lslash', 'oslash', 'oe', 'germandbls', 'onesuperior', 'logicalnot', 'mu',
    'trademark', 'Eth', 'onehalf', 'plusminus', 'Thorn', 'onequarter', 'divide', 'brokenbar', 'degree', 'thorn',
    'threequarters', 'twosuperior', 'registered', 'minus', 'eth', 'multiply', 'threesuperior', 'copyright',
    'Aacute', 'Acircumflex', 'Adieresis', 'Agrave', 'Aring', 'Atilde', 'Ccedilla', 'Eacute', 'Ecircumflex',
    'Edieresis', 'Egrave', 'Iacute', 'Icircumflex', 'Idieresis', 'Igrave', 'Ntilde', 'Oacute', 'Ocircumflex',
    'Odieresis', 'Ograve', 'Otilde', 'Scaron', 'Uacute', 'Ucircumflex', 'Udieresis', 'Ugrave', 'Yacute',
    'Ydieresis', 'Zcaron', 'aacute', 'acircumflex', 'adieresis', 'agrave', 'aring', 'atilde', 'ccedilla', 'eacute',
    'ecircumflex', 'edieresis', 'egrave', 'iacute', 'icircumflex', 'idieresis', 'igrave', 'ntilde', 'oacute',
    'ocircumflex', 'odieresis', 'ograve', 'otilde', 'scaron', 'uacute', 'ucircumflex', 'udieresis', 'ugrave',
    'yacute', 'ydieresis', 'zcaron', 'exclamsmall', 'Hungarumlautsmall', 'dollaroldstyle', 'dollarsuperior',
    'ampersandsmall', 'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', '266 ff', 'onedotenleader',
    'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle', 'fouroldstyle', 'fiveoldstyle', 'sixoldstyle',
    'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'commasuperior', 'threequartersemdash', 'periodsuperior',
    'questionsmall', 'asuperior', 'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', 'isuperior', 'lsuperior',
    'msuperior', 'nsuperior', 'osuperior', 'rsuperior', 'ssuperior', 'tsuperior', 'ff', 'ffi', 'ffl',
    'parenleftinferior', 'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall',
    'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall',
    'Msmall', 'Nsmall', 'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall',
    'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah', 'Tildesmall', 'exclamdownsmall',
    'centoldstyle', 'Lslashsmall', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall', 'Brevesmall', 'Caronsmall',
    'Dotaccentsmall', 'Macronsmall', 'figuredash', 'hypheninferior', 'Ogoneksmall', 'Ringsmall', 'Cedillasmall',
    'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds',
    'zerosuperior', 'foursuperior', 'fivesuperior', 'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior',
    'zeroinferior', 'oneinferior', 'twoinferior', 'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior',
    'seveninferior', 'eightinferior', 'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior',
    'commainferior', 'Agravesmall', 'Aacutesmall', 'Acircumflexsmall', 'Atildesmall', 'Adieresissmall',
    'Aringsmall', 'AEsmall', 'Ccedillasmall', 'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall',
    'Igravesmall', 'Iacutesmall', 'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall', 'Ogravesmall',
    'Oacutesmall', 'Ocircumflexsmall', 'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall',
    'Uacutesmall', 'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall', 'Ydieresissmall', '001.000',
    '001.001', '001.002', '001.003', 'Black', 'Bold', 'Book', 'Light', 'Medium', 'Regular', 'Roman', 'Semibold'];

var cffStandardEncoding = [
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quoteright',
    'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two',
    'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater',
    'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore',
    'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    'exclamdown', 'cent', 'sterling', 'fraction', 'yen', 'florin', 'section', 'currency', 'quotesingle',
    'quotedblleft', 'guillemotleft', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', '', 'endash', 'dagger',
    'daggerdbl', 'periodcentered', '', 'paragraph', 'bullet', 'quotesinglbase', 'quotedblbase', 'quotedblright',
    'guillemotright', 'ellipsis', 'perthousand', '', 'questiondown', '', 'grave', 'acute', 'circumflex', 'tilde',
    'macron', 'breve', 'dotaccent', 'dieresis', '', 'ring', 'cedilla', '', 'hungarumlaut', 'ogonek', 'caron',
    'emdash', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'AE', '', 'ordfeminine', '', '', '',
    '', 'Lslash', 'Oslash', 'OE', 'ordmasculine', '', '', '', '', '', 'ae', '', '', '', 'dotlessi', '', '',
    'lslash', 'oslash', 'oe', 'germandbls'];

var cffExpertEncoding = [
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', 'space', 'exclamsmall', 'Hungarumlautsmall', '', 'dollaroldstyle', 'dollarsuperior',
    'ampersandsmall', 'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', 'twodotenleader', 'onedotenleader',
    'comma', 'hyphen', 'period', 'fraction', 'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle',
    'fouroldstyle', 'fiveoldstyle', 'sixoldstyle', 'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'colon',
    'semicolon', 'commasuperior', 'threequartersemdash', 'periodsuperior', 'questionsmall', '', 'asuperior',
    'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', '', '', 'isuperior', '', '', 'lsuperior', 'msuperior',
    'nsuperior', 'osuperior', '', '', 'rsuperior', 'ssuperior', 'tsuperior', '', 'ff', 'fi', 'fl', 'ffi', 'ffl',
    'parenleftinferior', '', 'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall',
    'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall',
    'Msmall', 'Nsmall', 'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall',
    'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah', 'Tildesmall', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    'exclamdownsmall', 'centoldstyle', 'Lslashsmall', '', '', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall',
    'Brevesmall', 'Caronsmall', '', 'Dotaccentsmall', '', '', 'Macronsmall', '', '', 'figuredash', 'hypheninferior',
    '', '', 'Ogoneksmall', 'Ringsmall', 'Cedillasmall', '', '', '', 'onequarter', 'onehalf', 'threequarters',
    'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds', '',
    '', 'zerosuperior', 'onesuperior', 'twosuperior', 'threesuperior', 'foursuperior', 'fivesuperior',
    'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior', 'zeroinferior', 'oneinferior', 'twoinferior',
    'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior', 'seveninferior', 'eightinferior',
    'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior', 'commainferior', 'Agravesmall',
    'Aacutesmall', 'Acircumflexsmall', 'Atildesmall', 'Adieresissmall', 'Aringsmall', 'AEsmall', 'Ccedillasmall',
    'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall', 'Igravesmall', 'Iacutesmall',
    'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall', 'Ogravesmall', 'Oacutesmall',
    'Ocircumflexsmall', 'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall', 'Uacutesmall',
    'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall', 'Ydieresissmall'];

var standardNames = [
    '.notdef', '.null', 'nonmarkingreturn', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent',
    'ampersand', 'quotesingle', 'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash',
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less',
    'equal', 'greater', 'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright',
    'asciicircum', 'underscore', 'grave', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde',
    'Adieresis', 'Aring', 'Ccedilla', 'Eacute', 'Ntilde', 'Odieresis', 'Udieresis', 'aacute', 'agrave',
    'acircumflex', 'adieresis', 'atilde', 'aring', 'ccedilla', 'eacute', 'egrave', 'ecircumflex', 'edieresis',
    'iacute', 'igrave', 'icircumflex', 'idieresis', 'ntilde', 'oacute', 'ograve', 'ocircumflex', 'odieresis',
    'otilde', 'uacute', 'ugrave', 'ucircumflex', 'udieresis', 'dagger', 'degree', 'cent', 'sterling', 'section',
    'bullet', 'paragraph', 'germandbls', 'registered', 'copyright', 'trademark', 'acute', 'dieresis', 'notequal',
    'AE', 'Oslash', 'infinity', 'plusminus', 'lessequal', 'greaterequal', 'yen', 'mu', 'partialdiff', 'summation',
    'product', 'pi', 'integral', 'ordfeminine', 'ordmasculine', 'Omega', 'ae', 'oslash', 'questiondown',
    'exclamdown', 'logicalnot', 'radical', 'florin', 'approxequal', 'Delta', 'guillemotleft', 'guillemotright',
    'ellipsis', 'nonbreakingspace', 'Agrave', 'Atilde', 'Otilde', 'OE', 'oe', 'endash', 'emdash', 'quotedblleft',
    'quotedblright', 'quoteleft', 'quoteright', 'divide', 'lozenge', 'ydieresis', 'Ydieresis', 'fraction',
    'currency', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'daggerdbl', 'periodcentered', 'quotesinglbase',
    'quotedblbase', 'perthousand', 'Acircumflex', 'Ecircumflex', 'Aacute', 'Edieresis', 'Egrave', 'Iacute',
    'Icircumflex', 'Idieresis', 'Igrave', 'Oacute', 'Ocircumflex', 'apple', 'Ograve', 'Uacute', 'Ucircumflex',
    'Ugrave', 'dotlessi', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'ring', 'cedilla', 'hungarumlaut',
    'ogonek', 'caron', 'Lslash', 'lslash', 'Scaron', 'scaron', 'Zcaron', 'zcaron', 'brokenbar', 'Eth', 'eth',
    'Yacute', 'yacute', 'Thorn', 'thorn', 'minus', 'multiply', 'onesuperior', 'twosuperior', 'threesuperior',
    'onehalf', 'onequarter', 'threequarters', 'franc', 'Gbreve', 'gbreve', 'Idotaccent', 'Scedilla', 'scedilla',
    'Cacute', 'cacute', 'Ccaron', 'ccaron', 'dcroat'];

/**
 * This is the encoding used for fonts created from scratch.
 * It loops through all glyphs and finds the appropriate unicode value.
 * Since it's linear time, other encodings will be faster.
 * @exports opentype.DefaultEncoding
 * @class
 * @constructor
 * @param {opentype.Font}
 */
function DefaultEncoding(font) {
    this.font = font;
}

DefaultEncoding.prototype.charToGlyphIndex = function(c) {
    var code = c.codePointAt(0);
    var glyphs = this.font.glyphs;
    if (glyphs) {
        for (var i = 0; i < glyphs.length; i += 1) {
            var glyph = glyphs.get(i);
            for (var j = 0; j < glyph.unicodes.length; j += 1) {
                if (glyph.unicodes[j] === code) {
                    return i;
                }
            }
        }
    }
    return null;
};

/**
 * @exports opentype.CmapEncoding
 * @class
 * @constructor
 * @param {Object} cmap - a object with the cmap encoded data
 */
function CmapEncoding(cmap) {
    this.cmap = cmap;
}

/**
 * @param  {string} c - the character
 * @return {number} The glyph index.
 */
CmapEncoding.prototype.charToGlyphIndex = function(c) {
    return this.cmap.glyphIndexMap[c.codePointAt(0)] || 0;
};

/**
 * @exports opentype.CffEncoding
 * @class
 * @constructor
 * @param {string} encoding - The encoding
 * @param {Array} charset - The character set.
 */
function CffEncoding(encoding, charset) {
    this.encoding = encoding;
    this.charset = charset;
}

/**
 * @param  {string} s - The character
 * @return {number} The index.
 */
CffEncoding.prototype.charToGlyphIndex = function(s) {
    var code = s.codePointAt(0);
    var charName = this.encoding[code];
    return this.charset.indexOf(charName);
};

/**
 * @exports opentype.GlyphNames
 * @class
 * @constructor
 * @param {Object} post
 */
function GlyphNames(post) {
    switch (post.version) {
        case 1:
            this.names = standardNames.slice();
            break;
        case 2:
            this.names = new Array(post.numberOfGlyphs);
            for (var i = 0; i < post.numberOfGlyphs; i++) {
                if (post.glyphNameIndex[i] < standardNames.length) {
                    this.names[i] = standardNames[post.glyphNameIndex[i]];
                } else {
                    this.names[i] = post.names[post.glyphNameIndex[i] - standardNames.length];
                }
            }

            break;
        case 2.5:
            this.names = new Array(post.numberOfGlyphs);
            for (var i$1 = 0; i$1 < post.numberOfGlyphs; i$1++) {
                this.names[i$1] = standardNames[i$1 + post.glyphNameIndex[i$1]];
            }

            break;
        case 3:
            this.names = [];
            break;
        default:
            this.names = [];
            break;
    }
}

/**
 * Gets the index of a glyph by name.
 * @param  {string} name - The glyph name
 * @return {number} The index
 */
GlyphNames.prototype.nameToGlyphIndex = function(name) {
    return this.names.indexOf(name);
};

/**
 * @param  {number} gid
 * @return {string}
 */
GlyphNames.prototype.glyphIndexToName = function(gid) {
    return this.names[gid];
};

function addGlyphNamesAll(font) {
    var glyph;
    var glyphIndexMap = font.tables.cmap.glyphIndexMap;
    var charCodes = Object.keys(glyphIndexMap);

    for (var i = 0; i < charCodes.length; i += 1) {
        var c = charCodes[i];
        var glyphIndex = glyphIndexMap[c];
        glyph = font.glyphs.get(glyphIndex);
        glyph.addUnicode(parseInt(c));
    }

    for (var i$1 = 0; i$1 < font.glyphs.length; i$1 += 1) {
        glyph = font.glyphs.get(i$1);
        if (font.cffEncoding) {
            if (font.isCIDFont) {
                glyph.name = 'gid' + i$1;
            } else {
                glyph.name = font.cffEncoding.charset[i$1];
            }
        } else if (font.glyphNames.names) {
            glyph.name = font.glyphNames.glyphIndexToName(i$1);
        }
    }
}

function addGlyphNamesToUnicodeMap(font) {
    font._IndexToUnicodeMap = {};

    var glyphIndexMap = font.tables.cmap.glyphIndexMap;
    var charCodes = Object.keys(glyphIndexMap);

    for (var i = 0; i < charCodes.length; i += 1) {
        var c = charCodes[i];
        var glyphIndex = glyphIndexMap[c];
        if (font._IndexToUnicodeMap[glyphIndex] === undefined) {
            font._IndexToUnicodeMap[glyphIndex] = {
                unicodes: [parseInt(c)]
            };
        } else {
            font._IndexToUnicodeMap[glyphIndex].unicodes.push(parseInt(c));
        }
    }
}

/**
 * @alias opentype.addGlyphNames
 * @param {opentype.Font}
 * @param {Object}
 */
function addGlyphNames(font, opt) {
    if (opt.lowMemory) {
        addGlyphNamesToUnicodeMap(font);
    } else {
        addGlyphNamesAll(font);
    }
}

// Drawing utility functions.

// Draw a line on the given context from point `x1,y1` to point `x2,y2`.
function line(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

var draw = { line: line };

// The Glyph object
// import glyf from './tables/glyf' Can't be imported here, because it's a circular dependency

function getPathDefinition(glyph, path) {
    var _path = path || new Path();
    return {
        configurable: true,

        get: function() {
            if (typeof _path === 'function') {
                _path = _path();
            }

            return _path;
        },

        set: function(p) {
            _path = p;
        }
    };
}
/**
 * @typedef GlyphOptions
 * @type Object
 * @property {string} [name] - The glyph name
 * @property {number} [unicode]
 * @property {Array} [unicodes]
 * @property {number} [xMin]
 * @property {number} [yMin]
 * @property {number} [xMax]
 * @property {number} [yMax]
 * @property {number} [advanceWidth]
 */

// A Glyph is an individual mark that often corresponds to a character.
// Some glyphs, such as ligatures, are a combination of many characters.
// Glyphs are the basic building blocks of a font.
//
// The `Glyph` class contains utility methods for drawing the path and its points.
/**
 * @exports opentype.Glyph
 * @class
 * @param {GlyphOptions}
 * @constructor
 */
function Glyph(options) {
    // By putting all the code on a prototype function (which is only declared once)
    // we reduce the memory requirements for larger fonts by some 2%
    this.bindConstructorValues(options);
}

/**
 * @param  {GlyphOptions}
 */
Glyph.prototype.bindConstructorValues = function(options) {
    this.index = options.index || 0;

    // These three values cannot be deferred for memory optimization:
    this.name = options.name || null;
    this.unicode = options.unicode || undefined;
    this.unicodes = options.unicodes || options.unicode !== undefined ? [options.unicode] : [];

    // But by binding these values only when necessary, we reduce can
    // the memory requirements by almost 3% for larger fonts.
    if ('xMin' in options) {
        this.xMin = options.xMin;
    }

    if ('yMin' in options) {
        this.yMin = options.yMin;
    }

    if ('xMax' in options) {
        this.xMax = options.xMax;
    }

    if ('yMax' in options) {
        this.yMax = options.yMax;
    }

    if ('advanceWidth' in options) {
        this.advanceWidth = options.advanceWidth;
    }

    // The path for a glyph is the most memory intensive, and is bound as a value
    // with a getter/setter to ensure we actually do path parsing only once the
    // path is actually needed by anything.
    Object.defineProperty(this, 'path', getPathDefinition(this, options.path));
};

/**
 * @param {number}
 */
Glyph.prototype.addUnicode = function(unicode) {
    if (this.unicodes.length === 0) {
        this.unicode = unicode;
    }

    this.unicodes.push(unicode);
};

/**
 * Calculate the minimum bounding box for this glyph.
 * @return {opentype.BoundingBox}
 */
Glyph.prototype.getBoundingBox = function() {
    return this.path.getBoundingBox();
};

/**
 * Convert the glyph to a Path we can draw on a drawing context.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {Object=} options - xScale, yScale to stretch the glyph.
 * @param  {opentype.Font} if hinting is to be used, the font
 * @return {opentype.Path}
 */
Glyph.prototype.getPath = function(x, y, fontSize, options, font) {
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize !== undefined ? fontSize : 72;
    var commands;
    var hPoints;
    if (!options) { options = { }; }
    var xScale = options.xScale;
    var yScale = options.yScale;

    if (options.hinting && font && font.hinting) {
        // in case of hinting, the hinting engine takes care
        // of scaling the points (not the path) before hinting.
        hPoints = this.path && font.hinting.exec(this, fontSize);
        // in case the hinting engine failed hPoints is undefined
        // and thus reverts to plain rending
    }

    if (hPoints) {
        // Call font.hinting.getCommands instead of `glyf.getPath(hPoints).commands` to avoid a circular dependency
        commands = font.hinting.getCommands(hPoints);
        x = Math.round(x);
        y = Math.round(y);
        // TODO in case of hinting xyScaling is not yet supported
        xScale = yScale = 1;
    } else {
        commands = this.path.commands;
        var scale = 1 / (this.path.unitsPerEm || 1000) * fontSize;
        if (xScale === undefined) { xScale = scale; }
        if (yScale === undefined) { yScale = scale; }
    }

    var p = new Path();
    for (var i = 0; i < commands.length; i += 1) {
        var cmd = commands[i];
        if (cmd.type === 'M') {
            p.moveTo(x + (cmd.x * xScale), y + (-cmd.y * yScale));
        } else if (cmd.type === 'L') {
            p.lineTo(x + (cmd.x * xScale), y + (-cmd.y * yScale));
        } else if (cmd.type === 'Q') {
            p.quadraticCurveTo(x + (cmd.x1 * xScale), y + (-cmd.y1 * yScale),
                               x + (cmd.x * xScale), y + (-cmd.y * yScale));
        } else if (cmd.type === 'C') {
            p.curveTo(x + (cmd.x1 * xScale), y + (-cmd.y1 * yScale),
                      x + (cmd.x2 * xScale), y + (-cmd.y2 * yScale),
                      x + (cmd.x * xScale), y + (-cmd.y * yScale));
        } else if (cmd.type === 'Z') {
            p.closePath();
        }
    }

    return p;
};

/**
 * Split the glyph into contours.
 * This function is here for backwards compatibility, and to
 * provide raw access to the TrueType glyph outlines.
 * @return {Array}
 */
Glyph.prototype.getContours = function() {
    if (this.points === undefined) {
        return [];
    }

    var contours = [];
    var currentContour = [];
    for (var i = 0; i < this.points.length; i += 1) {
        var pt = this.points[i];
        currentContour.push(pt);
        if (pt.lastPointOfContour) {
            contours.push(currentContour);
            currentContour = [];
        }
    }

    check.argument(currentContour.length === 0, 'There are still points left in the current contour.');
    return contours;
};

/**
 * Calculate the xMin/yMin/xMax/yMax/lsb/rsb for a Glyph.
 * @return {Object}
 */
Glyph.prototype.getMetrics = function() {
    var commands = this.path.commands;
    var xCoords = [];
    var yCoords = [];
    for (var i = 0; i < commands.length; i += 1) {
        var cmd = commands[i];
        if (cmd.type !== 'Z') {
            xCoords.push(cmd.x);
            yCoords.push(cmd.y);
        }

        if (cmd.type === 'Q' || cmd.type === 'C') {
            xCoords.push(cmd.x1);
            yCoords.push(cmd.y1);
        }

        if (cmd.type === 'C') {
            xCoords.push(cmd.x2);
            yCoords.push(cmd.y2);
        }
    }

    var metrics = {
        xMin: Math.min.apply(null, xCoords),
        yMin: Math.min.apply(null, yCoords),
        xMax: Math.max.apply(null, xCoords),
        yMax: Math.max.apply(null, yCoords),
        leftSideBearing: this.leftSideBearing
    };

    if (!isFinite(metrics.xMin)) {
        metrics.xMin = 0;
    }

    if (!isFinite(metrics.xMax)) {
        metrics.xMax = this.advanceWidth;
    }

    if (!isFinite(metrics.yMin)) {
        metrics.yMin = 0;
    }

    if (!isFinite(metrics.yMax)) {
        metrics.yMax = 0;
    }

    metrics.rightSideBearing = this.advanceWidth - metrics.leftSideBearing - (metrics.xMax - metrics.xMin);
    return metrics;
};

/**
 * Draw the glyph on the given context.
 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {Object=} options - xScale, yScale to stretch the glyph.
 */
Glyph.prototype.draw = function(ctx, x, y, fontSize, options) {
    this.getPath(x, y, fontSize, options).draw(ctx);
};

/**
 * Draw the points of the glyph.
 * On-curve points will be drawn in blue, off-curve points will be drawn in red.
 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 */
Glyph.prototype.drawPoints = function(ctx, x, y, fontSize) {
    function drawCircles(l, x, y, scale) {
        ctx.beginPath();
        for (var j = 0; j < l.length; j += 1) {
            ctx.moveTo(x + (l[j].x * scale), y + (l[j].y * scale));
            ctx.arc(x + (l[j].x * scale), y + (l[j].y * scale), 2, 0, Math.PI * 2, false);
        }

        ctx.closePath();
        ctx.fill();
    }

    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize !== undefined ? fontSize : 24;
    var scale = 1 / this.path.unitsPerEm * fontSize;

    var blueCircles = [];
    var redCircles = [];
    var path = this.path;
    for (var i = 0; i < path.commands.length; i += 1) {
        var cmd = path.commands[i];
        if (cmd.x !== undefined) {
            blueCircles.push({x: cmd.x, y: -cmd.y});
        }

        if (cmd.x1 !== undefined) {
            redCircles.push({x: cmd.x1, y: -cmd.y1});
        }

        if (cmd.x2 !== undefined) {
            redCircles.push({x: cmd.x2, y: -cmd.y2});
        }
    }

    ctx.fillStyle = 'blue';
    drawCircles(blueCircles, x, y, scale);
    ctx.fillStyle = 'red';
    drawCircles(redCircles, x, y, scale);
};

/**
 * Draw lines indicating important font measurements.
 * Black lines indicate the origin of the coordinate system (point 0,0).
 * Blue lines indicate the glyph bounding box.
 * Green line indicates the advance width of the glyph.
 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 */
Glyph.prototype.drawMetrics = function(ctx, x, y, fontSize) {
    var scale;
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize !== undefined ? fontSize : 24;
    scale = 1 / this.path.unitsPerEm * fontSize;
    ctx.lineWidth = 1;

    // Draw the origin
    ctx.strokeStyle = 'black';
    draw.line(ctx, x, -1e4, x, 10000);
    draw.line(ctx, -1e4, y, 10000, y);

    // This code is here due to memory optimization: by not using
    // defaults in the constructor, we save a notable amount of memory.
    var xMin = this.xMin || 0;
    var yMin = this.yMin || 0;
    var xMax = this.xMax || 0;
    var yMax = this.yMax || 0;
    var advanceWidth = this.advanceWidth || 0;

    // Draw the glyph box
    ctx.strokeStyle = 'blue';
    draw.line(ctx, x + (xMin * scale), -1e4, x + (xMin * scale), 10000);
    draw.line(ctx, x + (xMax * scale), -1e4, x + (xMax * scale), 10000);
    draw.line(ctx, -1e4, y + (-yMin * scale), 10000, y + (-yMin * scale));
    draw.line(ctx, -1e4, y + (-yMax * scale), 10000, y + (-yMax * scale));

    // Draw the advance width
    ctx.strokeStyle = 'green';
    draw.line(ctx, x + (advanceWidth * scale), -1e4, x + (advanceWidth * scale), 10000);
};

// The GlyphSet object

// Define a property on the glyph that depends on the path being loaded.
function defineDependentProperty(glyph, externalName, internalName) {
    Object.defineProperty(glyph, externalName, {
        get: function() {
            // Request the path property to make sure the path is loaded.
            glyph.path; // jshint ignore:line
            return glyph[internalName];
        },
        set: function(newValue) {
            glyph[internalName] = newValue;
        },
        enumerable: true,
        configurable: true
    });
}

/**
 * A GlyphSet represents all glyphs available in the font, but modelled using
 * a deferred glyph loader, for retrieving glyphs only once they are absolutely
 * necessary, to keep the memory footprint down.
 * @exports opentype.GlyphSet
 * @class
 * @param {opentype.Font}
 * @param {Array}
 */
function GlyphSet(font, glyphs) {
    this.font = font;
    this.glyphs = {};
    if (Array.isArray(glyphs)) {
        for (var i = 0; i < glyphs.length; i++) {
            var glyph = glyphs[i];
            glyph.path.unitsPerEm = font.unitsPerEm;
            this.glyphs[i] = glyph;
        }
    }

    this.length = (glyphs && glyphs.length) || 0;
}

/**
 * @param  {number} index
 * @return {opentype.Glyph}
 */
GlyphSet.prototype.get = function(index) {
    // this.glyphs[index] is 'undefined' when low memory mode is on. glyph is pushed on request only.
    if (this.glyphs[index] === undefined) {
        this.font._push(index);
        if (typeof this.glyphs[index] === 'function') {
            this.glyphs[index] = this.glyphs[index]();
        }

        var glyph = this.glyphs[index];
        var unicodeObj = this.font._IndexToUnicodeMap[index];

        if (unicodeObj) {
            for (var j = 0; j < unicodeObj.unicodes.length; j++)
                { glyph.addUnicode(unicodeObj.unicodes[j]); }
        }

        if (this.font.cffEncoding) {
            if (this.font.isCIDFont) {
                glyph.name = 'gid' + index;
            } else {
                glyph.name = this.font.cffEncoding.charset[index];
            }
        } else if (this.font.glyphNames.names) {
            glyph.name = this.font.glyphNames.glyphIndexToName(index);
        }

        this.glyphs[index].advanceWidth = this.font._hmtxTableData[index].advanceWidth;
        this.glyphs[index].leftSideBearing = this.font._hmtxTableData[index].leftSideBearing;
    } else {
        if (typeof this.glyphs[index] === 'function') {
            this.glyphs[index] = this.glyphs[index]();
        }
    }

    return this.glyphs[index];
};

/**
 * @param  {number} index
 * @param  {Object}
 */
GlyphSet.prototype.push = function(index, loader) {
    this.glyphs[index] = loader;
    this.length++;
};

/**
 * @alias opentype.glyphLoader
 * @param  {opentype.Font} font
 * @param  {number} index
 * @return {opentype.Glyph}
 */
function glyphLoader(font, index) {
    return new Glyph({index: index, font: font});
}

/**
 * Generate a stub glyph that can be filled with all metadata *except*
 * the "points" and "path" properties, which must be loaded only once
 * the glyph's path is actually requested for text shaping.
 * @alias opentype.ttfGlyphLoader
 * @param  {opentype.Font} font
 * @param  {number} index
 * @param  {Function} parseGlyph
 * @param  {Object} data
 * @param  {number} position
 * @param  {Function} buildPath
 * @return {opentype.Glyph}
 */
function ttfGlyphLoader(font, index, parseGlyph, data, position, buildPath) {
    return function() {
        var glyph = new Glyph({index: index, font: font});

        glyph.path = function() {
            parseGlyph(glyph, data, position);
            var path = buildPath(font.glyphs, glyph);
            path.unitsPerEm = font.unitsPerEm;
            return path;
        };

        defineDependentProperty(glyph, 'xMin', '_xMin');
        defineDependentProperty(glyph, 'xMax', '_xMax');
        defineDependentProperty(glyph, 'yMin', '_yMin');
        defineDependentProperty(glyph, 'yMax', '_yMax');

        return glyph;
    };
}
/**
 * @alias opentype.cffGlyphLoader
 * @param  {opentype.Font} font
 * @param  {number} index
 * @param  {Function} parseCFFCharstring
 * @param  {string} charstring
 * @return {opentype.Glyph}
 */
function cffGlyphLoader(font, index, parseCFFCharstring, charstring) {
    return function() {
        var glyph = new Glyph({index: index, font: font});

        glyph.path = function() {
            var path = parseCFFCharstring(font, glyph, charstring);
            path.unitsPerEm = font.unitsPerEm;
            return path;
        };

        return glyph;
    };
}

var glyphset = { GlyphSet: GlyphSet, glyphLoader: glyphLoader, ttfGlyphLoader: ttfGlyphLoader, cffGlyphLoader: cffGlyphLoader };

// The `CFF` table contains the glyph outlines in PostScript format.

// Custom equals function that can also check lists.
function equals(a, b) {
    if (a === b) {
        return true;
    } else if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }

        for (var i = 0; i < a.length; i += 1) {
            if (!equals(a[i], b[i])) {
                return false;
            }
        }

        return true;
    } else {
        return false;
    }
}

// Subroutines are encoded using the negative half of the number space.
// See type 2 chapter 4.7 "Subroutine operators".
function calcCFFSubroutineBias(subrs) {
    var bias;
    if (subrs.length < 1240) {
        bias = 107;
    } else if (subrs.length < 33900) {
        bias = 1131;
    } else {
        bias = 32768;
    }

    return bias;
}

// Parse a `CFF` INDEX array.
// An index array consists of a list of offsets, then a list of objects at those offsets.
function parseCFFIndex(data, start, conversionFn) {
    var offsets = [];
    var objects = [];
    var count = parse.getCard16(data, start);
    var objectOffset;
    var endOffset;
    if (count !== 0) {
        var offsetSize = parse.getByte(data, start + 2);
        objectOffset = start + ((count + 1) * offsetSize) + 2;
        var pos = start + 3;
        for (var i = 0; i < count + 1; i += 1) {
            offsets.push(parse.getOffset(data, pos, offsetSize));
            pos += offsetSize;
        }

        // The total size of the index array is 4 header bytes + the value of the last offset.
        endOffset = objectOffset + offsets[count];
    } else {
        endOffset = start + 2;
    }

    for (var i$1 = 0; i$1 < offsets.length - 1; i$1 += 1) {
        var value = parse.getBytes(data, objectOffset + offsets[i$1], objectOffset + offsets[i$1 + 1]);
        if (conversionFn) {
            value = conversionFn(value);
        }

        objects.push(value);
    }

    return {objects: objects, startOffset: start, endOffset: endOffset};
}

function parseCFFIndexLowMemory(data, start) {
    var offsets = [];
    var count = parse.getCard16(data, start);
    var objectOffset;
    var endOffset;
    if (count !== 0) {
        var offsetSize = parse.getByte(data, start + 2);
        objectOffset = start + ((count + 1) * offsetSize) + 2;
        var pos = start + 3;
        for (var i = 0; i < count + 1; i += 1) {
            offsets.push(parse.getOffset(data, pos, offsetSize));
            pos += offsetSize;
        }

        // The total size of the index array is 4 header bytes + the value of the last offset.
        endOffset = objectOffset + offsets[count];
    } else {
        endOffset = start + 2;
    }

    return {offsets: offsets, startOffset: start, endOffset: endOffset};
}
function getCffIndexObject(i, offsets, data, start, conversionFn) {
    var count = parse.getCard16(data, start);
    var objectOffset = 0;
    if (count !== 0) {
        var offsetSize = parse.getByte(data, start + 2);
        objectOffset = start + ((count + 1) * offsetSize) + 2;
    }

    var value = parse.getBytes(data, objectOffset + offsets[i], objectOffset + offsets[i + 1]);
    return value;
}

// Parse a `CFF` DICT real value.
function parseFloatOperand(parser) {
    var s = '';
    var eof = 15;
    var lookup = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'E', 'E-', null, '-'];
    while (true) {
        var b = parser.parseByte();
        var n1 = b >> 4;
        var n2 = b & 15;

        if (n1 === eof) {
            break;
        }

        s += lookup[n1];

        if (n2 === eof) {
            break;
        }

        s += lookup[n2];
    }

    return parseFloat(s);
}

// Parse a `CFF` DICT operand.
function parseOperand(parser, b0) {
    var b1;
    var b2;
    var b3;
    var b4;
    if (b0 === 28) {
        b1 = parser.parseByte();
        b2 = parser.parseByte();
        return b1 << 8 | b2;
    }

    if (b0 === 29) {
        b1 = parser.parseByte();
        b2 = parser.parseByte();
        b3 = parser.parseByte();
        b4 = parser.parseByte();
        return b1 << 24 | b2 << 16 | b3 << 8 | b4;
    }

    if (b0 === 30) {
        return parseFloatOperand(parser);
    }

    if (b0 >= 32 && b0 <= 246) {
        return b0 - 139;
    }

    if (b0 >= 247 && b0 <= 250) {
        b1 = parser.parseByte();
        return (b0 - 247) * 256 + b1 + 108;
    }

    if (b0 >= 251 && b0 <= 254) {
        b1 = parser.parseByte();
        return -(b0 - 251) * 256 - b1 - 108;
    }

    throw new Error('Invalid b0 ' + b0);
}

// Convert the entries returned by `parseDict` to a proper dictionary.
// If a value is a list of one, it is unpacked.
function entriesToObject(entries) {
    var o = {};
    for (var i = 0; i < entries.length; i += 1) {
        var key = entries[i][0];
        var values = entries[i][1];
        var value = (void 0);
        if (values.length === 1) {
            value = values[0];
        } else {
            value = values;
        }

        if (o.hasOwnProperty(key) && !isNaN(o[key])) {
            throw new Error('Object ' + o + ' already has key ' + key);
        }

        o[key] = value;
    }

    return o;
}

// Parse a `CFF` DICT object.
// A dictionary contains key-value pairs in a compact tokenized format.
function parseCFFDict(data, start, size) {
    start = start !== undefined ? start : 0;
    var parser = new parse.Parser(data, start);
    var entries = [];
    var operands = [];
    size = size !== undefined ? size : data.length;

    while (parser.relativeOffset < size) {
        var op = parser.parseByte();

        // The first byte for each dict item distinguishes between operator (key) and operand (value).
        // Values <= 21 are operators.
        if (op <= 21) {
            // Two-byte operators have an initial escape byte of 12.
            if (op === 12) {
                op = 1200 + parser.parseByte();
            }

            entries.push([op, operands]);
            operands = [];
        } else {
            // Since the operands (values) come before the operators (keys), we store all operands in a list
            // until we encounter an operator.
            operands.push(parseOperand(parser, op));
        }
    }

    return entriesToObject(entries);
}

// Given a String Index (SID), return the value of the string.
// Strings below index 392 are standard CFF strings and are not encoded in the font.
function getCFFString(strings, index) {
    if (index <= 390) {
        index = cffStandardStrings[index];
    } else {
        index = strings[index - 391];
    }

    return index;
}

// Interpret a dictionary and return a new dictionary with readable keys and values for missing entries.
// This function takes `meta` which is a list of objects containing `operand`, `name` and `default`.
function interpretDict(dict, meta, strings) {
    var newDict = {};
    var value;

    // Because we also want to include missing values, we start out from the meta list
    // and lookup values in the dict.
    for (var i = 0; i < meta.length; i += 1) {
        var m = meta[i];

        if (Array.isArray(m.type)) {
            var values = [];
            values.length = m.type.length;
            for (var j = 0; j < m.type.length; j++) {
                value = dict[m.op] !== undefined ? dict[m.op][j] : undefined;
                if (value === undefined) {
                    value = m.value !== undefined && m.value[j] !== undefined ? m.value[j] : null;
                }
                if (m.type[j] === 'SID') {
                    value = getCFFString(strings, value);
                }
                values[j] = value;
            }
            newDict[m.name] = values;
        } else {
            value = dict[m.op];
            if (value === undefined) {
                value = m.value !== undefined ? m.value : null;
            }

            if (m.type === 'SID') {
                value = getCFFString(strings, value);
            }
            newDict[m.name] = value;
        }
    }

    return newDict;
}

// Parse the CFF header.
function parseCFFHeader(data, start) {
    var header = {};
    header.formatMajor = parse.getCard8(data, start);
    header.formatMinor = parse.getCard8(data, start + 1);
    header.size = parse.getCard8(data, start + 2);
    header.offsetSize = parse.getCard8(data, start + 3);
    header.startOffset = start;
    header.endOffset = start + 4;
    return header;
}

var TOP_DICT_META = [
    {name: 'version', op: 0, type: 'SID'},
    {name: 'notice', op: 1, type: 'SID'},
    {name: 'copyright', op: 1200, type: 'SID'},
    {name: 'fullName', op: 2, type: 'SID'},
    {name: 'familyName', op: 3, type: 'SID'},
    {name: 'weight', op: 4, type: 'SID'},
    {name: 'isFixedPitch', op: 1201, type: 'number', value: 0},
    {name: 'italicAngle', op: 1202, type: 'number', value: 0},
    {name: 'underlinePosition', op: 1203, type: 'number', value: -100},
    {name: 'underlineThickness', op: 1204, type: 'number', value: 50},
    {name: 'paintType', op: 1205, type: 'number', value: 0},
    {name: 'charstringType', op: 1206, type: 'number', value: 2},
    {
        name: 'fontMatrix',
        op: 1207,
        type: ['real', 'real', 'real', 'real', 'real', 'real'],
        value: [0.001, 0, 0, 0.001, 0, 0]
    },
    {name: 'uniqueId', op: 13, type: 'number'},
    {name: 'fontBBox', op: 5, type: ['number', 'number', 'number', 'number'], value: [0, 0, 0, 0]},
    {name: 'strokeWidth', op: 1208, type: 'number', value: 0},
    {name: 'xuid', op: 14, type: [], value: null},
    {name: 'charset', op: 15, type: 'offset', value: 0},
    {name: 'encoding', op: 16, type: 'offset', value: 0},
    {name: 'charStrings', op: 17, type: 'offset', value: 0},
    {name: 'private', op: 18, type: ['number', 'offset'], value: [0, 0]},
    {name: 'ros', op: 1230, type: ['SID', 'SID', 'number']},
    {name: 'cidFontVersion', op: 1231, type: 'number', value: 0},
    {name: 'cidFontRevision', op: 1232, type: 'number', value: 0},
    {name: 'cidFontType', op: 1233, type: 'number', value: 0},
    {name: 'cidCount', op: 1234, type: 'number', value: 8720},
    {name: 'uidBase', op: 1235, type: 'number'},
    {name: 'fdArray', op: 1236, type: 'offset'},
    {name: 'fdSelect', op: 1237, type: 'offset'},
    {name: 'fontName', op: 1238, type: 'SID'}
];

var PRIVATE_DICT_META = [
    {name: 'subrs', op: 19, type: 'offset', value: 0},
    {name: 'defaultWidthX', op: 20, type: 'number', value: 0},
    {name: 'nominalWidthX', op: 21, type: 'number', value: 0}
];

// Parse the CFF top dictionary. A CFF table can contain multiple fonts, each with their own top dictionary.
// The top dictionary contains the essential metadata for the font, together with the private dictionary.
function parseCFFTopDict(data, strings) {
    var dict = parseCFFDict(data, 0, data.byteLength);
    return interpretDict(dict, TOP_DICT_META, strings);
}

// Parse the CFF private dictionary. We don't fully parse out all the values, only the ones we need.
function parseCFFPrivateDict(data, start, size, strings) {
    var dict = parseCFFDict(data, start, size);
    return interpretDict(dict, PRIVATE_DICT_META, strings);
}

// Returns a list of "Top DICT"s found using an INDEX list.
// Used to read both the usual high-level Top DICTs and also the FDArray
// discovered inside CID-keyed fonts.  When a Top DICT has a reference to
// a Private DICT that is read and saved into the Top DICT.
//
// In addition to the expected/optional values as outlined in TOP_DICT_META
// the following values might be saved into the Top DICT.
//
//    _subrs []        array of local CFF subroutines from Private DICT
//    _subrsBias       bias value computed from number of subroutines
//                      (see calcCFFSubroutineBias() and parseCFFCharstring())
//    _defaultWidthX   default widths for CFF characters
//    _nominalWidthX   bias added to width embedded within glyph description
//
//    _privateDict     saved copy of parsed Private DICT from Top DICT
function gatherCFFTopDicts(data, start, cffIndex, strings) {
    var topDictArray = [];
    for (var iTopDict = 0; iTopDict < cffIndex.length; iTopDict += 1) {
        var topDictData = new DataView(new Uint8Array(cffIndex[iTopDict]).buffer);
        var topDict = parseCFFTopDict(topDictData, strings);
        topDict._subrs = [];
        topDict._subrsBias = 0;
        topDict._defaultWidthX = 0;
        topDict._nominalWidthX = 0;
        var privateSize = topDict.private[0];
        var privateOffset = topDict.private[1];
        if (privateSize !== 0 && privateOffset !== 0) {
            var privateDict = parseCFFPrivateDict(data, privateOffset + start, privateSize, strings);
            topDict._defaultWidthX = privateDict.defaultWidthX;
            topDict._nominalWidthX = privateDict.nominalWidthX;
            if (privateDict.subrs !== 0) {
                var subrOffset = privateOffset + privateDict.subrs;
                var subrIndex = parseCFFIndex(data, subrOffset + start);
                topDict._subrs = subrIndex.objects;
                topDict._subrsBias = calcCFFSubroutineBias(topDict._subrs);
            }
            topDict._privateDict = privateDict;
        }
        topDictArray.push(topDict);
    }
    return topDictArray;
}

// Parse the CFF charset table, which contains internal names for all the glyphs.
// This function will return a list of glyph names.
// See Adobe TN #5176 chapter 13, "Charsets".
function parseCFFCharset(data, start, nGlyphs, strings) {
    var sid;
    var count;
    var parser = new parse.Parser(data, start);

    // The .notdef glyph is not included, so subtract 1.
    nGlyphs -= 1;
    var charset = ['.notdef'];

    var format = parser.parseCard8();
    if (format === 0) {
        for (var i = 0; i < nGlyphs; i += 1) {
            sid = parser.parseSID();
            charset.push(getCFFString(strings, sid));
        }
    } else if (format === 1) {
        while (charset.length <= nGlyphs) {
            sid = parser.parseSID();
            count = parser.parseCard8();
            for (var i$1 = 0; i$1 <= count; i$1 += 1) {
                charset.push(getCFFString(strings, sid));
                sid += 1;
            }
        }
    } else if (format === 2) {
        while (charset.length <= nGlyphs) {
            sid = parser.parseSID();
            count = parser.parseCard16();
            for (var i$2 = 0; i$2 <= count; i$2 += 1) {
                charset.push(getCFFString(strings, sid));
                sid += 1;
            }
        }
    } else {
        throw new Error('Unknown charset format ' + format);
    }

    return charset;
}

// Parse the CFF encoding data. Only one encoding can be specified per font.
// See Adobe TN #5176 chapter 12, "Encodings".
function parseCFFEncoding(data, start, charset) {
    var code;
    var enc = {};
    var parser = new parse.Parser(data, start);
    var format = parser.parseCard8();
    if (format === 0) {
        var nCodes = parser.parseCard8();
        for (var i = 0; i < nCodes; i += 1) {
            code = parser.parseCard8();
            enc[code] = i;
        }
    } else if (format === 1) {
        var nRanges = parser.parseCard8();
        code = 1;
        for (var i$1 = 0; i$1 < nRanges; i$1 += 1) {
            var first = parser.parseCard8();
            var nLeft = parser.parseCard8();
            for (var j = first; j <= first + nLeft; j += 1) {
                enc[j] = code;
                code += 1;
            }
        }
    } else {
        throw new Error('Unknown encoding format ' + format);
    }

    return new CffEncoding(enc, charset);
}

// Take in charstring code and return a Glyph object.
// The encoding is described in the Type 2 Charstring Format
// https://www.microsoft.com/typography/OTSPEC/charstr2.htm
function parseCFFCharstring(font, glyph, code) {
    var c1x;
    var c1y;
    var c2x;
    var c2y;
    var p = new Path();
    var stack = [];
    var nStems = 0;
    var haveWidth = false;
    var open = false;
    var x = 0;
    var y = 0;
    var subrs;
    var subrsBias;
    var defaultWidthX;
    var nominalWidthX;
    if (font.isCIDFont) {
        var fdIndex = font.tables.cff.topDict._fdSelect[glyph.index];
        var fdDict = font.tables.cff.topDict._fdArray[fdIndex];
        subrs = fdDict._subrs;
        subrsBias = fdDict._subrsBias;
        defaultWidthX = fdDict._defaultWidthX;
        nominalWidthX = fdDict._nominalWidthX;
    } else {
        subrs = font.tables.cff.topDict._subrs;
        subrsBias = font.tables.cff.topDict._subrsBias;
        defaultWidthX = font.tables.cff.topDict._defaultWidthX;
        nominalWidthX = font.tables.cff.topDict._nominalWidthX;
    }
    var width = defaultWidthX;

    function newContour(x, y) {
        if (open) {
            p.closePath();
        }

        p.moveTo(x, y);
        open = true;
    }

    function parseStems() {
        var hasWidthArg;

        // The number of stem operators on the stack is always even.
        // If the value is uneven, that means a width is specified.
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
            width = stack.shift() + nominalWidthX;
        }

        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
    }

    function parse(code) {
        var b1;
        var b2;
        var b3;
        var b4;
        var codeIndex;
        var subrCode;
        var jpx;
        var jpy;
        var c3x;
        var c3y;
        var c4x;
        var c4y;

        var i = 0;
        while (i < code.length) {
            var v = code[i];
            i += 1;
            switch (v) {
                case 1: // hstem
                    parseStems();
                    break;
                case 3: // vstem
                    parseStems();
                    break;
                case 4: // vmoveto
                    if (stack.length > 1 && !haveWidth) {
                        width = stack.shift() + nominalWidthX;
                        haveWidth = true;
                    }

                    y += stack.pop();
                    newContour(x, y);
                    break;
                case 5: // rlineto
                    while (stack.length > 0) {
                        x += stack.shift();
                        y += stack.shift();
                        p.lineTo(x, y);
                    }

                    break;
                case 6: // hlineto
                    while (stack.length > 0) {
                        x += stack.shift();
                        p.lineTo(x, y);
                        if (stack.length === 0) {
                            break;
                        }

                        y += stack.shift();
                        p.lineTo(x, y);
                    }

                    break;
                case 7: // vlineto
                    while (stack.length > 0) {
                        y += stack.shift();
                        p.lineTo(x, y);
                        if (stack.length === 0) {
                            break;
                        }

                        x += stack.shift();
                        p.lineTo(x, y);
                    }

                    break;
                case 8: // rrcurveto
                    while (stack.length > 0) {
                        c1x = x + stack.shift();
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y + stack.shift();
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                case 10: // callsubr
                    codeIndex = stack.pop() + subrsBias;
                    subrCode = subrs[codeIndex];
                    if (subrCode) {
                        parse(subrCode);
                    }

                    break;
                case 11: // return
                    return;
                case 12: // flex operators
                    v = code[i];
                    i += 1;
                    switch (v) {
                        case 35: // flex
                            // |- dx1 dy1 dx2 dy2 dx3 dy3 dx4 dy4 dx5 dy5 dx6 dy6 fd flex (12 35) |-
                            c1x = x   + stack.shift();    // dx1
                            c1y = y   + stack.shift();    // dy1
                            c2x = c1x + stack.shift();    // dx2
                            c2y = c1y + stack.shift();    // dy2
                            jpx = c2x + stack.shift();    // dx3
                            jpy = c2y + stack.shift();    // dy3
                            c3x = jpx + stack.shift();    // dx4
                            c3y = jpy + stack.shift();    // dy4
                            c4x = c3x + stack.shift();    // dx5
                            c4y = c3y + stack.shift();    // dy5
                            x = c4x   + stack.shift();    // dx6
                            y = c4y   + stack.shift();    // dy6
                            stack.shift();                // flex depth
                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
                            break;
                        case 34: // hflex
                            // |- dx1 dx2 dy2 dx3 dx4 dx5 dx6 hflex (12 34) |-
                            c1x = x   + stack.shift();    // dx1
                            c1y = y;                      // dy1
                            c2x = c1x + stack.shift();    // dx2
                            c2y = c1y + stack.shift();    // dy2
                            jpx = c2x + stack.shift();    // dx3
                            jpy = c2y;                    // dy3
                            c3x = jpx + stack.shift();    // dx4
                            c3y = c2y;                    // dy4
                            c4x = c3x + stack.shift();    // dx5
                            c4y = y;                      // dy5
                            x = c4x + stack.shift();      // dx6
                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
                            break;
                        case 36: // hflex1
                            // |- dx1 dy1 dx2 dy2 dx3 dx4 dx5 dy5 dx6 hflex1 (12 36) |-
                            c1x = x   + stack.shift();    // dx1
                            c1y = y   + stack.shift();    // dy1
                            c2x = c1x + stack.shift();    // dx2
                            c2y = c1y + stack.shift();    // dy2
                            jpx = c2x + stack.shift();    // dx3
                            jpy = c2y;                    // dy3
                            c3x = jpx + stack.shift();    // dx4
                            c3y = c2y;                    // dy4
                            c4x = c3x + stack.shift();    // dx5
                            c4y = c3y + stack.shift();    // dy5
                            x = c4x + stack.shift();      // dx6
                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
                            break;
                        case 37: // flex1
                            // |- dx1 dy1 dx2 dy2 dx3 dy3 dx4 dy4 dx5 dy5 d6 flex1 (12 37) |-
                            c1x = x   + stack.shift();    // dx1
                            c1y = y   + stack.shift();    // dy1
                            c2x = c1x + stack.shift();    // dx2
                            c2y = c1y + stack.shift();    // dy2
                            jpx = c2x + stack.shift();    // dx3
                            jpy = c2y + stack.shift();    // dy3
                            c3x = jpx + stack.shift();    // dx4
                            c3y = jpy + stack.shift();    // dy4
                            c4x = c3x + stack.shift();    // dx5
                            c4y = c3y + stack.shift();    // dy5
                            if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
                                x = c4x + stack.shift();
                            } else {
                                y = c4y + stack.shift();
                            }

                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
                            break;
                        default:
                            console.log('Glyph ' + glyph.index + ': unknown operator ' + 1200 + v);
                            stack.length = 0;
                    }
                    break;
                case 14: // endchar
                    if (stack.length > 0 && !haveWidth) {
                        width = stack.shift() + nominalWidthX;
                        haveWidth = true;
                    }

                    if (open) {
                        p.closePath();
                        open = false;
                    }

                    break;
                case 18: // hstemhm
                    parseStems();
                    break;
                case 19: // hintmask
                case 20: // cntrmask
                    parseStems();
                    i += (nStems + 7) >> 3;
                    break;
                case 21: // rmoveto
                    if (stack.length > 2 && !haveWidth) {
                        width = stack.shift() + nominalWidthX;
                        haveWidth = true;
                    }

                    y += stack.pop();
                    x += stack.pop();
                    newContour(x, y);
                    break;
                case 22: // hmoveto
                    if (stack.length > 1 && !haveWidth) {
                        width = stack.shift() + nominalWidthX;
                        haveWidth = true;
                    }

                    x += stack.pop();
                    newContour(x, y);
                    break;
                case 23: // vstemhm
                    parseStems();
                    break;
                case 24: // rcurveline
                    while (stack.length > 2) {
                        c1x = x + stack.shift();
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y + stack.shift();
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    x += stack.shift();
                    y += stack.shift();
                    p.lineTo(x, y);
                    break;
                case 25: // rlinecurve
                    while (stack.length > 6) {
                        x += stack.shift();
                        y += stack.shift();
                        p.lineTo(x, y);
                    }

                    c1x = x + stack.shift();
                    c1y = y + stack.shift();
                    c2x = c1x + stack.shift();
                    c2y = c1y + stack.shift();
                    x = c2x + stack.shift();
                    y = c2y + stack.shift();
                    p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    break;
                case 26: // vvcurveto
                    if (stack.length % 2) {
                        x += stack.shift();
                    }

                    while (stack.length > 0) {
                        c1x = x;
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x;
                        y = c2y + stack.shift();
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                case 27: // hhcurveto
                    if (stack.length % 2) {
                        y += stack.shift();
                    }

                    while (stack.length > 0) {
                        c1x = x + stack.shift();
                        c1y = y;
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y;
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                case 28: // shortint
                    b1 = code[i];
                    b2 = code[i + 1];
                    stack.push(((b1 << 24) | (b2 << 16)) >> 16);
                    i += 2;
                    break;
                case 29: // callgsubr
                    codeIndex = stack.pop() + font.gsubrsBias;
                    subrCode = font.gsubrs[codeIndex];
                    if (subrCode) {
                        parse(subrCode);
                    }

                    break;
                case 30: // vhcurveto
                    while (stack.length > 0) {
                        c1x = x;
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y + (stack.length === 1 ? stack.shift() : 0);
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                        if (stack.length === 0) {
                            break;
                        }

                        c1x = x + stack.shift();
                        c1y = y;
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        y = c2y + stack.shift();
                        x = c2x + (stack.length === 1 ? stack.shift() : 0);
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                case 31: // hvcurveto
                    while (stack.length > 0) {
                        c1x = x + stack.shift();
                        c1y = y;
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        y = c2y + stack.shift();
                        x = c2x + (stack.length === 1 ? stack.shift() : 0);
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                        if (stack.length === 0) {
                            break;
                        }

                        c1x = x;
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y + (stack.length === 1 ? stack.shift() : 0);
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                default:
                    if (v < 32) {
                        console.log('Glyph ' + glyph.index + ': unknown operator ' + v);
                    } else if (v < 247) {
                        stack.push(v - 139);
                    } else if (v < 251) {
                        b1 = code[i];
                        i += 1;
                        stack.push((v - 247) * 256 + b1 + 108);
                    } else if (v < 255) {
                        b1 = code[i];
                        i += 1;
                        stack.push(-(v - 251) * 256 - b1 - 108);
                    } else {
                        b1 = code[i];
                        b2 = code[i + 1];
                        b3 = code[i + 2];
                        b4 = code[i + 3];
                        i += 4;
                        stack.push(((b1 << 24) | (b2 << 16) | (b3 << 8) | b4) / 65536);
                    }
            }
        }
    }

    parse(code);

    glyph.advanceWidth = width;
    return p;
}

function parseCFFFDSelect(data, start, nGlyphs, fdArrayCount) {
    var fdSelect = [];
    var fdIndex;
    var parser = new parse.Parser(data, start);
    var format = parser.parseCard8();
    if (format === 0) {
        // Simple list of nGlyphs elements
        for (var iGid = 0; iGid < nGlyphs; iGid++) {
            fdIndex = parser.parseCard8();
            if (fdIndex >= fdArrayCount) {
                throw new Error('CFF table CID Font FDSelect has bad FD index value ' + fdIndex + ' (FD count ' + fdArrayCount + ')');
            }
            fdSelect.push(fdIndex);
        }
    } else if (format === 3) {
        // Ranges
        var nRanges = parser.parseCard16();
        var first = parser.parseCard16();
        if (first !== 0) {
            throw new Error('CFF Table CID Font FDSelect format 3 range has bad initial GID ' + first);
        }
        var next;
        for (var iRange = 0; iRange < nRanges; iRange++) {
            fdIndex = parser.parseCard8();
            next = parser.parseCard16();
            if (fdIndex >= fdArrayCount) {
                throw new Error('CFF table CID Font FDSelect has bad FD index value ' + fdIndex + ' (FD count ' + fdArrayCount + ')');
            }
            if (next > nGlyphs) {
                throw new Error('CFF Table CID Font FDSelect format 3 range has bad GID ' + next);
            }
            for (; first < next; first++) {
                fdSelect.push(fdIndex);
            }
            first = next;
        }
        if (next !== nGlyphs) {
            throw new Error('CFF Table CID Font FDSelect format 3 range has bad final GID ' + next);
        }
    } else {
        throw new Error('CFF Table CID Font FDSelect table has unsupported format ' + format);
    }
    return fdSelect;
}

// Parse the `CFF` table, which contains the glyph outlines in PostScript format.
function parseCFFTable(data, start, font, opt) {
    font.tables.cff = {};
    var header = parseCFFHeader(data, start);
    var nameIndex = parseCFFIndex(data, header.endOffset, parse.bytesToString);
    var topDictIndex = parseCFFIndex(data, nameIndex.endOffset);
    var stringIndex = parseCFFIndex(data, topDictIndex.endOffset, parse.bytesToString);
    var globalSubrIndex = parseCFFIndex(data, stringIndex.endOffset);
    font.gsubrs = globalSubrIndex.objects;
    font.gsubrsBias = calcCFFSubroutineBias(font.gsubrs);

    var topDictArray = gatherCFFTopDicts(data, start, topDictIndex.objects, stringIndex.objects);
    if (topDictArray.length !== 1) {
        throw new Error('CFF table has too many fonts in \'FontSet\' - count of fonts NameIndex.length = ' + topDictArray.length);
    }

    var topDict = topDictArray[0];
    font.tables.cff.topDict = topDict;

    if (topDict._privateDict) {
        font.defaultWidthX = topDict._privateDict.defaultWidthX;
        font.nominalWidthX = topDict._privateDict.nominalWidthX;
    }

    if (topDict.ros[0] !== undefined && topDict.ros[1] !== undefined) {
        font.isCIDFont = true;
    }

    if (font.isCIDFont) {
        var fdArrayOffset = topDict.fdArray;
        var fdSelectOffset = topDict.fdSelect;
        if (fdArrayOffset === 0 || fdSelectOffset === 0) {
            throw new Error('Font is marked as a CID font, but FDArray and/or FDSelect information is missing');
        }
        fdArrayOffset += start;
        var fdArrayIndex = parseCFFIndex(data, fdArrayOffset);
        var fdArray = gatherCFFTopDicts(data, start, fdArrayIndex.objects, stringIndex.objects);
        topDict._fdArray = fdArray;
        fdSelectOffset += start;
        topDict._fdSelect = parseCFFFDSelect(data, fdSelectOffset, font.numGlyphs, fdArray.length);
    }

    var privateDictOffset = start + topDict.private[1];
    var privateDict = parseCFFPrivateDict(data, privateDictOffset, topDict.private[0], stringIndex.objects);
    font.defaultWidthX = privateDict.defaultWidthX;
    font.nominalWidthX = privateDict.nominalWidthX;

    if (privateDict.subrs !== 0) {
        var subrOffset = privateDictOffset + privateDict.subrs;
        var subrIndex = parseCFFIndex(data, subrOffset);
        font.subrs = subrIndex.objects;
        font.subrsBias = calcCFFSubroutineBias(font.subrs);
    } else {
        font.subrs = [];
        font.subrsBias = 0;
    }

    // Offsets in the top dict are relative to the beginning of the CFF data, so add the CFF start offset.
    var charStringsIndex;
    if (opt.lowMemory) {
        charStringsIndex = parseCFFIndexLowMemory(data, start + topDict.charStrings);
        font.nGlyphs = charStringsIndex.offsets.length;
    } else {
        charStringsIndex = parseCFFIndex(data, start + topDict.charStrings);
        font.nGlyphs = charStringsIndex.objects.length;
    }

    var charset = parseCFFCharset(data, start + topDict.charset, font.nGlyphs, stringIndex.objects);
    if (topDict.encoding === 0) {
        // Standard encoding
        font.cffEncoding = new CffEncoding(cffStandardEncoding, charset);
    } else if (topDict.encoding === 1) {
        // Expert encoding
        font.cffEncoding = new CffEncoding(cffExpertEncoding, charset);
    } else {
        font.cffEncoding = parseCFFEncoding(data, start + topDict.encoding, charset);
    }

    // Prefer the CMAP encoding to the CFF encoding.
    font.encoding = font.encoding || font.cffEncoding;

    font.glyphs = new glyphset.GlyphSet(font);
    if (opt.lowMemory) {
        font._push = function(i) {
            var charString = getCffIndexObject(i, charStringsIndex.offsets, data, start + topDict.charStrings);
            font.glyphs.push(i, glyphset.cffGlyphLoader(font, i, parseCFFCharstring, charString));
        };
    } else {
        for (var i = 0; i < font.nGlyphs; i += 1) {
            var charString = charStringsIndex.objects[i];
            font.glyphs.push(i, glyphset.cffGlyphLoader(font, i, parseCFFCharstring, charString));
        }
    }
}

// Convert a string to a String ID (SID).
// The list of strings is modified in place.
function encodeString(s, strings) {
    var sid;

    // Is the string in the CFF standard strings?
    var i = cffStandardStrings.indexOf(s);
    if (i >= 0) {
        sid = i;
    }

    // Is the string already in the string index?
    i = strings.indexOf(s);
    if (i >= 0) {
        sid = i + cffStandardStrings.length;
    } else {
        sid = cffStandardStrings.length + strings.length;
        strings.push(s);
    }

    return sid;
}

function makeHeader() {
    return new table.Record('Header', [
        {name: 'major', type: 'Card8', value: 1},
        {name: 'minor', type: 'Card8', value: 0},
        {name: 'hdrSize', type: 'Card8', value: 4},
        {name: 'major', type: 'Card8', value: 1}
    ]);
}

function makeNameIndex(fontNames) {
    var t = new table.Record('Name INDEX', [
        {name: 'names', type: 'INDEX', value: []}
    ]);
    t.names = [];
    for (var i = 0; i < fontNames.length; i += 1) {
        t.names.push({name: 'name_' + i, type: 'NAME', value: fontNames[i]});
    }

    return t;
}

// Given a dictionary's metadata, create a DICT structure.
function makeDict(meta, attrs, strings) {
    var m = {};
    for (var i = 0; i < meta.length; i += 1) {
        var entry = meta[i];
        var value = attrs[entry.name];
        if (value !== undefined && !equals(value, entry.value)) {
            if (entry.type === 'SID') {
                value = encodeString(value, strings);
            }

            m[entry.op] = {name: entry.name, type: entry.type, value: value};
        }
    }

    return m;
}

// The Top DICT houses the global font attributes.
function makeTopDict(attrs, strings) {
    var t = new table.Record('Top DICT', [
        {name: 'dict', type: 'DICT', value: {}}
    ]);
    t.dict = makeDict(TOP_DICT_META, attrs, strings);
    return t;
}

function makeTopDictIndex(topDict) {
    var t = new table.Record('Top DICT INDEX', [
        {name: 'topDicts', type: 'INDEX', value: []}
    ]);
    t.topDicts = [{name: 'topDict_0', type: 'TABLE', value: topDict}];
    return t;
}

function makeStringIndex(strings) {
    var t = new table.Record('String INDEX', [
        {name: 'strings', type: 'INDEX', value: []}
    ]);
    t.strings = [];
    for (var i = 0; i < strings.length; i += 1) {
        t.strings.push({name: 'string_' + i, type: 'STRING', value: strings[i]});
    }

    return t;
}

function makeGlobalSubrIndex() {
    // Currently we don't use subroutines.
    return new table.Record('Global Subr INDEX', [
        {name: 'subrs', type: 'INDEX', value: []}
    ]);
}

function makeCharsets(glyphNames, strings) {
    var t = new table.Record('Charsets', [
        {name: 'format', type: 'Card8', value: 0}
    ]);
    for (var i = 0; i < glyphNames.length; i += 1) {
        var glyphName = glyphNames[i];
        var glyphSID = encodeString(glyphName, strings);
        t.fields.push({name: 'glyph_' + i, type: 'SID', value: glyphSID});
    }

    return t;
}

function glyphToOps(glyph) {
    var ops = [];
    var path = glyph.path;
    ops.push({name: 'width', type: 'NUMBER', value: glyph.advanceWidth});
    var x = 0;
    var y = 0;
    for (var i = 0; i < path.commands.length; i += 1) {
        var dx = (void 0);
        var dy = (void 0);
        var cmd = path.commands[i];
        if (cmd.type === 'Q') {
            // CFF only supports bézier curves, so convert the quad to a bézier.
            var _13 = 1 / 3;
            var _23 = 2 / 3;

            // We're going to create a new command so we don't change the original path.
            // Since all coordinates are relative, we round() them ASAP to avoid propagating errors.
            cmd = {
                type: 'C',
                x: cmd.x,
                y: cmd.y,
                x1: Math.round(_13 * x + _23 * cmd.x1),
                y1: Math.round(_13 * y + _23 * cmd.y1),
                x2: Math.round(_13 * cmd.x + _23 * cmd.x1),
                y2: Math.round(_13 * cmd.y + _23 * cmd.y1)
            };
        }

        if (cmd.type === 'M') {
            dx = Math.round(cmd.x - x);
            dy = Math.round(cmd.y - y);
            ops.push({name: 'dx', type: 'NUMBER', value: dx});
            ops.push({name: 'dy', type: 'NUMBER', value: dy});
            ops.push({name: 'rmoveto', type: 'OP', value: 21});
            x = Math.round(cmd.x);
            y = Math.round(cmd.y);
        } else if (cmd.type === 'L') {
            dx = Math.round(cmd.x - x);
            dy = Math.round(cmd.y - y);
            ops.push({name: 'dx', type: 'NUMBER', value: dx});
            ops.push({name: 'dy', type: 'NUMBER', value: dy});
            ops.push({name: 'rlineto', type: 'OP', value: 5});
            x = Math.round(cmd.x);
            y = Math.round(cmd.y);
        } else if (cmd.type === 'C') {
            var dx1 = Math.round(cmd.x1 - x);
            var dy1 = Math.round(cmd.y1 - y);
            var dx2 = Math.round(cmd.x2 - cmd.x1);
            var dy2 = Math.round(cmd.y2 - cmd.y1);
            dx = Math.round(cmd.x - cmd.x2);
            dy = Math.round(cmd.y - cmd.y2);
            ops.push({name: 'dx1', type: 'NUMBER', value: dx1});
            ops.push({name: 'dy1', type: 'NUMBER', value: dy1});
            ops.push({name: 'dx2', type: 'NUMBER', value: dx2});
            ops.push({name: 'dy2', type: 'NUMBER', value: dy2});
            ops.push({name: 'dx', type: 'NUMBER', value: dx});
            ops.push({name: 'dy', type: 'NUMBER', value: dy});
            ops.push({name: 'rrcurveto', type: 'OP', value: 8});
            x = Math.round(cmd.x);
            y = Math.round(cmd.y);
        }

        // Contours are closed automatically.
    }

    ops.push({name: 'endchar', type: 'OP', value: 14});
    return ops;
}

function makeCharStringsIndex(glyphs) {
    var t = new table.Record('CharStrings INDEX', [
        {name: 'charStrings', type: 'INDEX', value: []}
    ]);

    for (var i = 0; i < glyphs.length; i += 1) {
        var glyph = glyphs.get(i);
        var ops = glyphToOps(glyph);
        t.charStrings.push({name: glyph.name, type: 'CHARSTRING', value: ops});
    }

    return t;
}

function makePrivateDict(attrs, strings) {
    var t = new table.Record('Private DICT', [
        {name: 'dict', type: 'DICT', value: {}}
    ]);
    t.dict = makeDict(PRIVATE_DICT_META, attrs, strings);
    return t;
}

function makeCFFTable(glyphs, options) {
    var t = new table.Table('CFF ', [
        {name: 'header', type: 'RECORD'},
        {name: 'nameIndex', type: 'RECORD'},
        {name: 'topDictIndex', type: 'RECORD'},
        {name: 'stringIndex', type: 'RECORD'},
        {name: 'globalSubrIndex', type: 'RECORD'},
        {name: 'charsets', type: 'RECORD'},
        {name: 'charStringsIndex', type: 'RECORD'},
        {name: 'privateDict', type: 'RECORD'}
    ]);

    var fontScale = 1 / options.unitsPerEm;
    // We use non-zero values for the offsets so that the DICT encodes them.
    // This is important because the size of the Top DICT plays a role in offset calculation,
    // and the size shouldn't change after we've written correct offsets.
    var attrs = {
        version: options.version,
        fullName: options.fullName,
        familyName: options.familyName,
        weight: options.weightName,
        fontBBox: options.fontBBox || [0, 0, 0, 0],
        fontMatrix: [fontScale, 0, 0, fontScale, 0, 0],
        charset: 999,
        encoding: 0,
        charStrings: 999,
        private: [0, 999]
    };

    var privateAttrs = {};

    var glyphNames = [];
    var glyph;

    // Skip first glyph (.notdef)
    for (var i = 1; i < glyphs.length; i += 1) {
        glyph = glyphs.get(i);
        glyphNames.push(glyph.name);
    }

    var strings = [];

    t.header = makeHeader();
    t.nameIndex = makeNameIndex([options.postScriptName]);
    var topDict = makeTopDict(attrs, strings);
    t.topDictIndex = makeTopDictIndex(topDict);
    t.globalSubrIndex = makeGlobalSubrIndex();
    t.charsets = makeCharsets(glyphNames, strings);
    t.charStringsIndex = makeCharStringsIndex(glyphs);
    t.privateDict = makePrivateDict(privateAttrs, strings);

    // Needs to come at the end, to encode all custom strings used in the font.
    t.stringIndex = makeStringIndex(strings);

    var startOffset = t.header.sizeOf() +
        t.nameIndex.sizeOf() +
        t.topDictIndex.sizeOf() +
        t.stringIndex.sizeOf() +
        t.globalSubrIndex.sizeOf();
    attrs.charset = startOffset;

    // We use the CFF standard encoding; proper encoding will be handled in cmap.
    attrs.encoding = 0;
    attrs.charStrings = attrs.charset + t.charsets.sizeOf();
    attrs.private[1] = attrs.charStrings + t.charStringsIndex.sizeOf();

    // Recreate the Top DICT INDEX with the correct offsets.
    topDict = makeTopDict(attrs, strings);
    t.topDictIndex = makeTopDictIndex(topDict);

    return t;
}

var cff = { parse: parseCFFTable, make: makeCFFTable };

// The `head` table contains global information about the font.

// Parse the header `head` table
function parseHeadTable(data, start) {
    var head = {};
    var p = new parse.Parser(data, start);
    head.version = p.parseVersion();
    head.fontRevision = Math.round(p.parseFixed() * 1000) / 1000;
    head.checkSumAdjustment = p.parseULong();
    head.magicNumber = p.parseULong();
    check.argument(head.magicNumber === 0x5F0F3CF5, 'Font header has wrong magic number.');
    head.flags = p.parseUShort();
    head.unitsPerEm = p.parseUShort();
    head.created = p.parseLongDateTime();
    head.modified = p.parseLongDateTime();
    head.xMin = p.parseShort();
    head.yMin = p.parseShort();
    head.xMax = p.parseShort();
    head.yMax = p.parseShort();
    head.macStyle = p.parseUShort();
    head.lowestRecPPEM = p.parseUShort();
    head.fontDirectionHint = p.parseShort();
    head.indexToLocFormat = p.parseShort();
    head.glyphDataFormat = p.parseShort();
    return head;
}

function makeHeadTable(options) {
    // Apple Mac timestamp epoch is 01/01/1904 not 01/01/1970
    var timestamp = Math.round(new Date().getTime() / 1000) + 2082844800;
    var createdTimestamp = timestamp;

    if (options.createdTimestamp) {
        createdTimestamp = options.createdTimestamp + 2082844800;
    }

    return new table.Table('head', [
        {name: 'version', type: 'FIXED', value: 0x00010000},
        {name: 'fontRevision', type: 'FIXED', value: 0x00010000},
        {name: 'checkSumAdjustment', type: 'ULONG', value: 0},
        {name: 'magicNumber', type: 'ULONG', value: 0x5F0F3CF5},
        {name: 'flags', type: 'USHORT', value: 0},
        {name: 'unitsPerEm', type: 'USHORT', value: 1000},
        {name: 'created', type: 'LONGDATETIME', value: createdTimestamp},
        {name: 'modified', type: 'LONGDATETIME', value: timestamp},
        {name: 'xMin', type: 'SHORT', value: 0},
        {name: 'yMin', type: 'SHORT', value: 0},
        {name: 'xMax', type: 'SHORT', value: 0},
        {name: 'yMax', type: 'SHORT', value: 0},
        {name: 'macStyle', type: 'USHORT', value: 0},
        {name: 'lowestRecPPEM', type: 'USHORT', value: 0},
        {name: 'fontDirectionHint', type: 'SHORT', value: 2},
        {name: 'indexToLocFormat', type: 'SHORT', value: 0},
        {name: 'glyphDataFormat', type: 'SHORT', value: 0}
    ], options);
}

var head = { parse: parseHeadTable, make: makeHeadTable };

// The `hhea` table contains information for horizontal layout.

// Parse the horizontal header `hhea` table
function parseHheaTable(data, start) {
    var hhea = {};
    var p = new parse.Parser(data, start);
    hhea.version = p.parseVersion();
    hhea.ascender = p.parseShort();
    hhea.descender = p.parseShort();
    hhea.lineGap = p.parseShort();
    hhea.advanceWidthMax = p.parseUShort();
    hhea.minLeftSideBearing = p.parseShort();
    hhea.minRightSideBearing = p.parseShort();
    hhea.xMaxExtent = p.parseShort();
    hhea.caretSlopeRise = p.parseShort();
    hhea.caretSlopeRun = p.parseShort();
    hhea.caretOffset = p.parseShort();
    p.relativeOffset += 8;
    hhea.metricDataFormat = p.parseShort();
    hhea.numberOfHMetrics = p.parseUShort();
    return hhea;
}

function makeHheaTable(options) {
    return new table.Table('hhea', [
        {name: 'version', type: 'FIXED', value: 0x00010000},
        {name: 'ascender', type: 'FWORD', value: 0},
        {name: 'descender', type: 'FWORD', value: 0},
        {name: 'lineGap', type: 'FWORD', value: 0},
        {name: 'advanceWidthMax', type: 'UFWORD', value: 0},
        {name: 'minLeftSideBearing', type: 'FWORD', value: 0},
        {name: 'minRightSideBearing', type: 'FWORD', value: 0},
        {name: 'xMaxExtent', type: 'FWORD', value: 0},
        {name: 'caretSlopeRise', type: 'SHORT', value: 1},
        {name: 'caretSlopeRun', type: 'SHORT', value: 0},
        {name: 'caretOffset', type: 'SHORT', value: 0},
        {name: 'reserved1', type: 'SHORT', value: 0},
        {name: 'reserved2', type: 'SHORT', value: 0},
        {name: 'reserved3', type: 'SHORT', value: 0},
        {name: 'reserved4', type: 'SHORT', value: 0},
        {name: 'metricDataFormat', type: 'SHORT', value: 0},
        {name: 'numberOfHMetrics', type: 'USHORT', value: 0}
    ], options);
}

var hhea = { parse: parseHheaTable, make: makeHheaTable };

// The `hmtx` table contains the horizontal metrics for all glyphs.

function parseHmtxTableAll(data, start, numMetrics, numGlyphs, glyphs) {
    var advanceWidth;
    var leftSideBearing;
    var p = new parse.Parser(data, start);
    for (var i = 0; i < numGlyphs; i += 1) {
        // If the font is monospaced, only one entry is needed. This last entry applies to all subsequent glyphs.
        if (i < numMetrics) {
            advanceWidth = p.parseUShort();
            leftSideBearing = p.parseShort();
        }

        var glyph = glyphs.get(i);
        glyph.advanceWidth = advanceWidth;
        glyph.leftSideBearing = leftSideBearing;
    }
}

function parseHmtxTableOnLowMemory(font, data, start, numMetrics, numGlyphs) {
    font._hmtxTableData = {};

    var advanceWidth;
    var leftSideBearing;
    var p = new parse.Parser(data, start);
    for (var i = 0; i < numGlyphs; i += 1) {
        // If the font is monospaced, only one entry is needed. This last entry applies to all subsequent glyphs.
        if (i < numMetrics) {
            advanceWidth = p.parseUShort();
            leftSideBearing = p.parseShort();
        }

        font._hmtxTableData[i] = {
            advanceWidth: advanceWidth,
            leftSideBearing: leftSideBearing
        };
    }
}

// Parse the `hmtx` table, which contains the horizontal metrics for all glyphs.
// This function augments the glyph array, adding the advanceWidth and leftSideBearing to each glyph.
function parseHmtxTable(font, data, start, numMetrics, numGlyphs, glyphs, opt) {
    if (opt.lowMemory)
        { parseHmtxTableOnLowMemory(font, data, start, numMetrics, numGlyphs); }
    else
        { parseHmtxTableAll(data, start, numMetrics, numGlyphs, glyphs); }
}

function makeHmtxTable(glyphs) {
    var t = new table.Table('hmtx', []);
    for (var i = 0; i < glyphs.length; i += 1) {
        var glyph = glyphs.get(i);
        var advanceWidth = glyph.advanceWidth || 0;
        var leftSideBearing = glyph.leftSideBearing || 0;
        t.fields.push({name: 'advanceWidth_' + i, type: 'USHORT', value: advanceWidth});
        t.fields.push({name: 'leftSideBearing_' + i, type: 'SHORT', value: leftSideBearing});
    }

    return t;
}

var hmtx = { parse: parseHmtxTable, make: makeHmtxTable };

// The `ltag` table stores IETF BCP-47 language tags. It allows supporting

function makeLtagTable(tags) {
    var result = new table.Table('ltag', [
        {name: 'version', type: 'ULONG', value: 1},
        {name: 'flags', type: 'ULONG', value: 0},
        {name: 'numTags', type: 'ULONG', value: tags.length}
    ]);

    var stringPool = '';
    var stringPoolOffset = 12 + tags.length * 4;
    for (var i = 0; i < tags.length; ++i) {
        var pos = stringPool.indexOf(tags[i]);
        if (pos < 0) {
            pos = stringPool.length;
            stringPool += tags[i];
        }

        result.fields.push({name: 'offset ' + i, type: 'USHORT', value: stringPoolOffset + pos});
        result.fields.push({name: 'length ' + i, type: 'USHORT', value: tags[i].length});
    }

    result.fields.push({name: 'stringPool', type: 'CHARARRAY', value: stringPool});
    return result;
}

function parseLtagTable(data, start) {
    var p = new parse.Parser(data, start);
    var tableVersion = p.parseULong();
    check.argument(tableVersion === 1, 'Unsupported ltag table version.');
    // The 'ltag' specification does not define any flags; skip the field.
    p.skip('uLong', 1);
    var numTags = p.parseULong();

    var tags = [];
    for (var i = 0; i < numTags; i++) {
        var tag = '';
        var offset = start + p.parseUShort();
        var length = p.parseUShort();
        for (var j = offset; j < offset + length; ++j) {
            tag += String.fromCharCode(data.getInt8(j));
        }

        tags.push(tag);
    }

    return tags;
}

var ltag = { make: makeLtagTable, parse: parseLtagTable };

// The `maxp` table establishes the memory requirements for the font.

// Parse the maximum profile `maxp` table.
function parseMaxpTable(data, start) {
    var maxp = {};
    var p = new parse.Parser(data, start);
    maxp.version = p.parseVersion();
    maxp.numGlyphs = p.parseUShort();
    if (maxp.version === 1.0) {
        maxp.maxPoints = p.parseUShort();
        maxp.maxContours = p.parseUShort();
        maxp.maxCompositePoints = p.parseUShort();
        maxp.maxCompositeContours = p.parseUShort();
        maxp.maxZones = p.parseUShort();
        maxp.maxTwilightPoints = p.parseUShort();
        maxp.maxStorage = p.parseUShort();
        maxp.maxFunctionDefs = p.parseUShort();
        maxp.maxInstructionDefs = p.parseUShort();
        maxp.maxStackElements = p.parseUShort();
        maxp.maxSizeOfInstructions = p.parseUShort();
        maxp.maxComponentElements = p.parseUShort();
        maxp.maxComponentDepth = p.parseUShort();
    }

    return maxp;
}

function makeMaxpTable(numGlyphs) {
    return new table.Table('maxp', [
        {name: 'version', type: 'FIXED', value: 0x00005000},
        {name: 'numGlyphs', type: 'USHORT', value: numGlyphs}
    ]);
}

var maxp = { parse: parseMaxpTable, make: makeMaxpTable };

// The `name` naming table.

// NameIDs for the name table.
var nameTableNames = [
    'copyright',              // 0
    'fontFamily',             // 1
    'fontSubfamily',          // 2
    'uniqueID',               // 3
    'fullName',               // 4
    'version',                // 5
    'postScriptName',         // 6
    'trademark',              // 7
    'manufacturer',           // 8
    'designer',               // 9
    'description',            // 10
    'manufacturerURL',        // 11
    'designerURL',            // 12
    'license',                // 13
    'licenseURL',             // 14
    'reserved',               // 15
    'preferredFamily',        // 16
    'preferredSubfamily',     // 17
    'compatibleFullName',     // 18
    'sampleText',             // 19
    'postScriptFindFontName', // 20
    'wwsFamily',              // 21
    'wwsSubfamily'            // 22
];

var macLanguages = {
    0: 'en',
    1: 'fr',
    2: 'de',
    3: 'it',
    4: 'nl',
    5: 'sv',
    6: 'es',
    7: 'da',
    8: 'pt',
    9: 'no',
    10: 'he',
    11: 'ja',
    12: 'ar',
    13: 'fi',
    14: 'el',
    15: 'is',
    16: 'mt',
    17: 'tr',
    18: 'hr',
    19: 'zh-Hant',
    20: 'ur',
    21: 'hi',
    22: 'th',
    23: 'ko',
    24: 'lt',
    25: 'pl',
    26: 'hu',
    27: 'es',
    28: 'lv',
    29: 'se',
    30: 'fo',
    31: 'fa',
    32: 'ru',
    33: 'zh',
    34: 'nl-BE',
    35: 'ga',
    36: 'sq',
    37: 'ro',
    38: 'cz',
    39: 'sk',
    40: 'si',
    41: 'yi',
    42: 'sr',
    43: 'mk',
    44: 'bg',
    45: 'uk',
    46: 'be',
    47: 'uz',
    48: 'kk',
    49: 'az-Cyrl',
    50: 'az-Arab',
    51: 'hy',
    52: 'ka',
    53: 'mo',
    54: 'ky',
    55: 'tg',
    56: 'tk',
    57: 'mn-CN',
    58: 'mn',
    59: 'ps',
    60: 'ks',
    61: 'ku',
    62: 'sd',
    63: 'bo',
    64: 'ne',
    65: 'sa',
    66: 'mr',
    67: 'bn',
    68: 'as',
    69: 'gu',
    70: 'pa',
    71: 'or',
    72: 'ml',
    73: 'kn',
    74: 'ta',
    75: 'te',
    76: 'si',
    77: 'my',
    78: 'km',
    79: 'lo',
    80: 'vi',
    81: 'id',
    82: 'tl',
    83: 'ms',
    84: 'ms-Arab',
    85: 'am',
    86: 'ti',
    87: 'om',
    88: 'so',
    89: 'sw',
    90: 'rw',
    91: 'rn',
    92: 'ny',
    93: 'mg',
    94: 'eo',
    128: 'cy',
    129: 'eu',
    130: 'ca',
    131: 'la',
    132: 'qu',
    133: 'gn',
    134: 'ay',
    135: 'tt',
    136: 'ug',
    137: 'dz',
    138: 'jv',
    139: 'su',
    140: 'gl',
    141: 'af',
    142: 'br',
    143: 'iu',
    144: 'gd',
    145: 'gv',
    146: 'ga',
    147: 'to',
    148: 'el-polyton',
    149: 'kl',
    150: 'az',
    151: 'nn'
};

// MacOS language ID → MacOS script ID
//
// Note that the script ID is not sufficient to determine what encoding
// to use in TrueType files. For some languages, MacOS used a modification
// of a mainstream script. For example, an Icelandic name would be stored
// with smRoman in the TrueType naming table, but the actual encoding
// is a special Icelandic version of the normal Macintosh Roman encoding.
// As another example, Inuktitut uses an 8-bit encoding for Canadian Aboriginal
// Syllables but MacOS had run out of available script codes, so this was
// done as a (pretty radical) "modification" of Ethiopic.
//
// http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/Readme.txt
var macLanguageToScript = {
    0: 0,  // langEnglish → smRoman
    1: 0,  // langFrench → smRoman
    2: 0,  // langGerman → smRoman
    3: 0,  // langItalian → smRoman
    4: 0,  // langDutch → smRoman
    5: 0,  // langSwedish → smRoman
    6: 0,  // langSpanish → smRoman
    7: 0,  // langDanish → smRoman
    8: 0,  // langPortuguese → smRoman
    9: 0,  // langNorwegian → smRoman
    10: 5,  // langHebrew → smHebrew
    11: 1,  // langJapanese → smJapanese
    12: 4,  // langArabic → smArabic
    13: 0,  // langFinnish → smRoman
    14: 6,  // langGreek → smGreek
    15: 0,  // langIcelandic → smRoman (modified)
    16: 0,  // langMaltese → smRoman
    17: 0,  // langTurkish → smRoman (modified)
    18: 0,  // langCroatian → smRoman (modified)
    19: 2,  // langTradChinese → smTradChinese
    20: 4,  // langUrdu → smArabic
    21: 9,  // langHindi → smDevanagari
    22: 21,  // langThai → smThai
    23: 3,  // langKorean → smKorean
    24: 29,  // langLithuanian → smCentralEuroRoman
    25: 29,  // langPolish → smCentralEuroRoman
    26: 29,  // langHungarian → smCentralEuroRoman
    27: 29,  // langEstonian → smCentralEuroRoman
    28: 29,  // langLatvian → smCentralEuroRoman
    29: 0,  // langSami → smRoman
    30: 0,  // langFaroese → smRoman (modified)
    31: 4,  // langFarsi → smArabic (modified)
    32: 7,  // langRussian → smCyrillic
    33: 25,  // langSimpChinese → smSimpChinese
    34: 0,  // langFlemish → smRoman
    35: 0,  // langIrishGaelic → smRoman (modified)
    36: 0,  // langAlbanian → smRoman
    37: 0,  // langRomanian → smRoman (modified)
    38: 29,  // langCzech → smCentralEuroRoman
    39: 29,  // langSlovak → smCentralEuroRoman
    40: 0,  // langSlovenian → smRoman (modified)
    41: 5,  // langYiddish → smHebrew
    42: 7,  // langSerbian → smCyrillic
    43: 7,  // langMacedonian → smCyrillic
    44: 7,  // langBulgarian → smCyrillic
    45: 7,  // langUkrainian → smCyrillic (modified)
    46: 7,  // langByelorussian → smCyrillic
    47: 7,  // langUzbek → smCyrillic
    48: 7,  // langKazakh → smCyrillic
    49: 7,  // langAzerbaijani → smCyrillic
    50: 4,  // langAzerbaijanAr → smArabic
    51: 24,  // langArmenian → smArmenian
    52: 23,  // langGeorgian → smGeorgian
    53: 7,  // langMoldavian → smCyrillic
    54: 7,  // langKirghiz → smCyrillic
    55: 7,  // langTajiki → smCyrillic
    56: 7,  // langTurkmen → smCyrillic
    57: 27,  // langMongolian → smMongolian
    58: 7,  // langMongolianCyr → smCyrillic
    59: 4,  // langPashto → smArabic
    60: 4,  // langKurdish → smArabic
    61: 4,  // langKashmiri → smArabic
    62: 4,  // langSindhi → smArabic
    63: 26,  // langTibetan → smTibetan
    64: 9,  // langNepali → smDevanagari
    65: 9,  // langSanskrit → smDevanagari
    66: 9,  // langMarathi → smDevanagari
    67: 13,  // langBengali → smBengali
    68: 13,  // langAssamese → smBengali
    69: 11,  // langGujarati → smGujarati
    70: 10,  // langPunjabi → smGurmukhi
    71: 12,  // langOriya → smOriya
    72: 17,  // langMalayalam → smMalayalam
    73: 16,  // langKannada → smKannada
    74: 14,  // langTamil → smTamil
    75: 15,  // langTelugu → smTelugu
    76: 18,  // langSinhalese → smSinhalese
    77: 19,  // langBurmese → smBurmese
    78: 20,  // langKhmer → smKhmer
    79: 22,  // langLao → smLao
    80: 30,  // langVietnamese → smVietnamese
    81: 0,  // langIndonesian → smRoman
    82: 0,  // langTagalog → smRoman
    83: 0,  // langMalayRoman → smRoman
    84: 4,  // langMalayArabic → smArabic
    85: 28,  // langAmharic → smEthiopic
    86: 28,  // langTigrinya → smEthiopic
    87: 28,  // langOromo → smEthiopic
    88: 0,  // langSomali → smRoman
    89: 0,  // langSwahili → smRoman
    90: 0,  // langKinyarwanda → smRoman
    91: 0,  // langRundi → smRoman
    92: 0,  // langNyanja → smRoman
    93: 0,  // langMalagasy → smRoman
    94: 0,  // langEsperanto → smRoman
    128: 0,  // langWelsh → smRoman (modified)
    129: 0,  // langBasque → smRoman
    130: 0,  // langCatalan → smRoman
    131: 0,  // langLatin → smRoman
    132: 0,  // langQuechua → smRoman
    133: 0,  // langGuarani → smRoman
    134: 0,  // langAymara → smRoman
    135: 7,  // langTatar → smCyrillic
    136: 4,  // langUighur → smArabic
    137: 26,  // langDzongkha → smTibetan
    138: 0,  // langJavaneseRom → smRoman
    139: 0,  // langSundaneseRom → smRoman
    140: 0,  // langGalician → smRoman
    141: 0,  // langAfrikaans → smRoman
    142: 0,  // langBreton → smRoman (modified)
    143: 28,  // langInuktitut → smEthiopic (modified)
    144: 0,  // langScottishGaelic → smRoman (modified)
    145: 0,  // langManxGaelic → smRoman (modified)
    146: 0,  // langIrishGaelicScript → smRoman (modified)
    147: 0,  // langTongan → smRoman
    148: 6,  // langGreekAncient → smRoman
    149: 0,  // langGreenlandic → smRoman
    150: 0,  // langAzerbaijanRoman → smRoman
    151: 0   // langNynorsk → smRoman
};

// While Microsoft indicates a region/country for all its language
// IDs, we omit the region code if it's equal to the "most likely
// region subtag" according to Unicode CLDR. For scripts, we omit
// the subtag if it is equal to the Suppress-Script entry in the
// IANA language subtag registry for IETF BCP 47.
//
// For example, Microsoft states that its language code 0x041A is
// Croatian in Croatia. We transform this to the BCP 47 language code 'hr'
// and not 'hr-HR' because Croatia is the default country for Croatian,
// according to Unicode CLDR. As another example, Microsoft states
// that 0x101A is Croatian (Latin) in Bosnia-Herzegovina. We transform
// this to 'hr-BA' and not 'hr-Latn-BA' because Latin is the default script
// for the Croatian language, according to IANA.
//
// http://www.unicode.org/cldr/charts/latest/supplemental/likely_subtags.html
// http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
var windowsLanguages = {
    0x0436: 'af',
    0x041C: 'sq',
    0x0484: 'gsw',
    0x045E: 'am',
    0x1401: 'ar-DZ',
    0x3C01: 'ar-BH',
    0x0C01: 'ar',
    0x0801: 'ar-IQ',
    0x2C01: 'ar-JO',
    0x3401: 'ar-KW',
    0x3001: 'ar-LB',
    0x1001: 'ar-LY',
    0x1801: 'ary',
    0x2001: 'ar-OM',
    0x4001: 'ar-QA',
    0x0401: 'ar-SA',
    0x2801: 'ar-SY',
    0x1C01: 'aeb',
    0x3801: 'ar-AE',
    0x2401: 'ar-YE',
    0x042B: 'hy',
    0x044D: 'as',
    0x082C: 'az-Cyrl',
    0x042C: 'az',
    0x046D: 'ba',
    0x042D: 'eu',
    0x0423: 'be',
    0x0845: 'bn',
    0x0445: 'bn-IN',
    0x201A: 'bs-Cyrl',
    0x141A: 'bs',
    0x047E: 'br',
    0x0402: 'bg',
    0x0403: 'ca',
    0x0C04: 'zh-HK',
    0x1404: 'zh-MO',
    0x0804: 'zh',
    0x1004: 'zh-SG',
    0x0404: 'zh-TW',
    0x0483: 'co',
    0x041A: 'hr',
    0x101A: 'hr-BA',
    0x0405: 'cs',
    0x0406: 'da',
    0x048C: 'prs',
    0x0465: 'dv',
    0x0813: 'nl-BE',
    0x0413: 'nl',
    0x0C09: 'en-AU',
    0x2809: 'en-BZ',
    0x1009: 'en-CA',
    0x2409: 'en-029',
    0x4009: 'en-IN',
    0x1809: 'en-IE',
    0x2009: 'en-JM',
    0x4409: 'en-MY',
    0x1409: 'en-NZ',
    0x3409: 'en-PH',
    0x4809: 'en-SG',
    0x1C09: 'en-ZA',
    0x2C09: 'en-TT',
    0x0809: 'en-GB',
    0x0409: 'en',
    0x3009: 'en-ZW',
    0x0425: 'et',
    0x0438: 'fo',
    0x0464: 'fil',
    0x040B: 'fi',
    0x080C: 'fr-BE',
    0x0C0C: 'fr-CA',
    0x040C: 'fr',
    0x140C: 'fr-LU',
    0x180C: 'fr-MC',
    0x100C: 'fr-CH',
    0x0462: 'fy',
    0x0456: 'gl',
    0x0437: 'ka',
    0x0C07: 'de-AT',
    0x0407: 'de',
    0x1407: 'de-LI',
    0x1007: 'de-LU',
    0x0807: 'de-CH',
    0x0408: 'el',
    0x046F: 'kl',
    0x0447: 'gu',
    0x0468: 'ha',
    0x040D: 'he',
    0x0439: 'hi',
    0x040E: 'hu',
    0x040F: 'is',
    0x0470: 'ig',
    0x0421: 'id',
    0x045D: 'iu',
    0x085D: 'iu-Latn',
    0x083C: 'ga',
    0x0434: 'xh',
    0x0435: 'zu',
    0x0410: 'it',
    0x0810: 'it-CH',
    0x0411: 'ja',
    0x044B: 'kn',
    0x043F: 'kk',
    0x0453: 'km',
    0x0486: 'quc',
    0x0487: 'rw',
    0x0441: 'sw',
    0x0457: 'kok',
    0x0412: 'ko',
    0x0440: 'ky',
    0x0454: 'lo',
    0x0426: 'lv',
    0x0427: 'lt',
    0x082E: 'dsb',
    0x046E: 'lb',
    0x042F: 'mk',
    0x083E: 'ms-BN',
    0x043E: 'ms',
    0x044C: 'ml',
    0x043A: 'mt',
    0x0481: 'mi',
    0x047A: 'arn',
    0x044E: 'mr',
    0x047C: 'moh',
    0x0450: 'mn',
    0x0850: 'mn-CN',
    0x0461: 'ne',
    0x0414: 'nb',
    0x0814: 'nn',
    0x0482: 'oc',
    0x0448: 'or',
    0x0463: 'ps',
    0x0415: 'pl',
    0x0416: 'pt',
    0x0816: 'pt-PT',
    0x0446: 'pa',
    0x046B: 'qu-BO',
    0x086B: 'qu-EC',
    0x0C6B: 'qu',
    0x0418: 'ro',
    0x0417: 'rm',
    0x0419: 'ru',
    0x243B: 'smn',
    0x103B: 'smj-NO',
    0x143B: 'smj',
    0x0C3B: 'se-FI',
    0x043B: 'se',
    0x083B: 'se-SE',
    0x203B: 'sms',
    0x183B: 'sma-NO',
    0x1C3B: 'sms',
    0x044F: 'sa',
    0x1C1A: 'sr-Cyrl-BA',
    0x0C1A: 'sr',
    0x181A: 'sr-Latn-BA',
    0x081A: 'sr-Latn',
    0x046C: 'nso',
    0x0432: 'tn',
    0x045B: 'si',
    0x041B: 'sk',
    0x0424: 'sl',
    0x2C0A: 'es-AR',
    0x400A: 'es-BO',
    0x340A: 'es-CL',
    0x240A: 'es-CO',
    0x140A: 'es-CR',
    0x1C0A: 'es-DO',
    0x300A: 'es-EC',
    0x440A: 'es-SV',
    0x100A: 'es-GT',
    0x480A: 'es-HN',
    0x080A: 'es-MX',
    0x4C0A: 'es-NI',
    0x180A: 'es-PA',
    0x3C0A: 'es-PY',
    0x280A: 'es-PE',
    0x500A: 'es-PR',

    // Microsoft has defined two different language codes for
    // “Spanish with modern sorting” and “Spanish with traditional
    // sorting”. This makes sense for collation APIs, and it would be
    // possible to express this in BCP 47 language tags via Unicode
    // extensions (eg., es-u-co-trad is Spanish with traditional
    // sorting). However, for storing names in fonts, the distinction
    // does not make sense, so we give “es” in both cases.
    0x0C0A: 'es',
    0x040A: 'es',

    0x540A: 'es-US',
    0x380A: 'es-UY',
    0x200A: 'es-VE',
    0x081D: 'sv-FI',
    0x041D: 'sv',
    0x045A: 'syr',
    0x0428: 'tg',
    0x085F: 'tzm',
    0x0449: 'ta',
    0x0444: 'tt',
    0x044A: 'te',
    0x041E: 'th',
    0x0451: 'bo',
    0x041F: 'tr',
    0x0442: 'tk',
    0x0480: 'ug',
    0x0422: 'uk',
    0x042E: 'hsb',
    0x0420: 'ur',
    0x0843: 'uz-Cyrl',
    0x0443: 'uz',
    0x042A: 'vi',
    0x0452: 'cy',
    0x0488: 'wo',
    0x0485: 'sah',
    0x0478: 'ii',
    0x046A: 'yo'
};

// Returns a IETF BCP 47 language code, for example 'zh-Hant'
// for 'Chinese in the traditional script'.
function getLanguageCode(platformID, languageID, ltag) {
    switch (platformID) {
        case 0:  // Unicode
            if (languageID === 0xFFFF) {
                return 'und';
            } else if (ltag) {
                return ltag[languageID];
            }

            break;

        case 1:  // Macintosh
            return macLanguages[languageID];

        case 3:  // Windows
            return windowsLanguages[languageID];
    }

    return undefined;
}

var utf16 = 'utf-16';

// MacOS script ID → encoding. This table stores the default case,
// which can be overridden by macLanguageEncodings.
var macScriptEncodings = {
    0: 'macintosh',           // smRoman
    1: 'x-mac-japanese',      // smJapanese
    2: 'x-mac-chinesetrad',   // smTradChinese
    3: 'x-mac-korean',        // smKorean
    6: 'x-mac-greek',         // smGreek
    7: 'x-mac-cyrillic',      // smCyrillic
    9: 'x-mac-devanagai',     // smDevanagari
    10: 'x-mac-gurmukhi',     // smGurmukhi
    11: 'x-mac-gujarati',     // smGujarati
    12: 'x-mac-oriya',        // smOriya
    13: 'x-mac-bengali',      // smBengali
    14: 'x-mac-tamil',        // smTamil
    15: 'x-mac-telugu',       // smTelugu
    16: 'x-mac-kannada',      // smKannada
    17: 'x-mac-malayalam',    // smMalayalam
    18: 'x-mac-sinhalese',    // smSinhalese
    19: 'x-mac-burmese',      // smBurmese
    20: 'x-mac-khmer',        // smKhmer
    21: 'x-mac-thai',         // smThai
    22: 'x-mac-lao',          // smLao
    23: 'x-mac-georgian',     // smGeorgian
    24: 'x-mac-armenian',     // smArmenian
    25: 'x-mac-chinesesimp',  // smSimpChinese
    26: 'x-mac-tibetan',      // smTibetan
    27: 'x-mac-mongolian',    // smMongolian
    28: 'x-mac-ethiopic',     // smEthiopic
    29: 'x-mac-ce',           // smCentralEuroRoman
    30: 'x-mac-vietnamese',   // smVietnamese
    31: 'x-mac-extarabic'     // smExtArabic
};

// MacOS language ID → encoding. This table stores the exceptional
// cases, which override macScriptEncodings. For writing MacOS naming
// tables, we need to emit a MacOS script ID. Therefore, we cannot
// merge macScriptEncodings into macLanguageEncodings.
//
// http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/Readme.txt
var macLanguageEncodings = {
    15: 'x-mac-icelandic',    // langIcelandic
    17: 'x-mac-turkish',      // langTurkish
    18: 'x-mac-croatian',     // langCroatian
    24: 'x-mac-ce',           // langLithuanian
    25: 'x-mac-ce',           // langPolish
    26: 'x-mac-ce',           // langHungarian
    27: 'x-mac-ce',           // langEstonian
    28: 'x-mac-ce',           // langLatvian
    30: 'x-mac-icelandic',    // langFaroese
    37: 'x-mac-romanian',     // langRomanian
    38: 'x-mac-ce',           // langCzech
    39: 'x-mac-ce',           // langSlovak
    40: 'x-mac-ce',           // langSlovenian
    143: 'x-mac-inuit',       // langInuktitut
    146: 'x-mac-gaelic'       // langIrishGaelicScript
};

function getEncoding(platformID, encodingID, languageID) {
    switch (platformID) {
        case 0:  // Unicode
            return utf16;

        case 1:  // Apple Macintosh
            return macLanguageEncodings[languageID] || macScriptEncodings[encodingID];

        case 3:  // Microsoft Windows
            if (encodingID === 1 || encodingID === 10) {
                return utf16;
            }

            break;
    }

    return undefined;
}

// Parse the naming `name` table.
// FIXME: Format 1 additional fields are not supported yet.
// ltag is the content of the `ltag' table, such as ['en', 'zh-Hans', 'de-CH-1904'].
function parseNameTable(data, start, ltag) {
    var name = {};
    var p = new parse.Parser(data, start);
    var format = p.parseUShort();
    var count = p.parseUShort();
    var stringOffset = p.offset + p.parseUShort();
    for (var i = 0; i < count; i++) {
        var platformID = p.parseUShort();
        var encodingID = p.parseUShort();
        var languageID = p.parseUShort();
        var nameID = p.parseUShort();
        var property = nameTableNames[nameID] || nameID;
        var byteLength = p.parseUShort();
        var offset = p.parseUShort();
        var language = getLanguageCode(platformID, languageID, ltag);
        var encoding = getEncoding(platformID, encodingID, languageID);
        if (encoding !== undefined && language !== undefined) {
            var text = (void 0);
            if (encoding === utf16) {
                text = decode.UTF16(data, stringOffset + offset, byteLength);
            } else {
                text = decode.MACSTRING(data, stringOffset + offset, byteLength, encoding);
            }

            if (text) {
                var translations = name[property];
                if (translations === undefined) {
                    translations = name[property] = {};
                }

                translations[language] = text;
            }
        }
    }
    if (format === 1) {
        // FIXME: Also handle Microsoft's 'name' table 1.
        p.parseUShort();
    }

    return name;
}

// {23: 'foo'} → {'foo': 23}
// ['bar', 'baz'] → {'bar': 0, 'baz': 1}
function reverseDict(dict) {
    var result = {};
    for (var key in dict) {
        result[dict[key]] = parseInt(key);
    }

    return result;
}

function makeNameRecord(platformID, encodingID, languageID, nameID, length, offset) {
    return new table.Record('NameRecord', [
        {name: 'platformID', type: 'USHORT', value: platformID},
        {name: 'encodingID', type: 'USHORT', value: encodingID},
        {name: 'languageID', type: 'USHORT', value: languageID},
        {name: 'nameID', type: 'USHORT', value: nameID},
        {name: 'length', type: 'USHORT', value: length},
        {name: 'offset', type: 'USHORT', value: offset}
    ]);
}

// Finds the position of needle in haystack, or -1 if not there.
// Like String.indexOf(), but for arrays.
function findSubArray(needle, haystack) {
    var needleLength = needle.length;
    var limit = haystack.length - needleLength + 1;

    loop:
    for (var pos = 0; pos < limit; pos++) {
        for (; pos < limit; pos++) {
            for (var k = 0; k < needleLength; k++) {
                if (haystack[pos + k] !== needle[k]) {
                    continue loop;
                }
            }

            return pos;
        }
    }

    return -1;
}

function addStringToPool(s, pool) {
    var offset = findSubArray(s, pool);
    if (offset < 0) {
        offset = pool.length;
        var i = 0;
        var len = s.length;
        for (; i < len; ++i) {
            pool.push(s[i]);
        }

    }

    return offset;
}

function makeNameTable(names, ltag) {
    var nameID;
    var nameIDs = [];

    var namesWithNumericKeys = {};
    var nameTableIds = reverseDict(nameTableNames);
    for (var key in names) {
        var id = nameTableIds[key];
        if (id === undefined) {
            id = key;
        }

        nameID = parseInt(id);

        if (isNaN(nameID)) {
            throw new Error('Name table entry "' + key + '" does not exist, see nameTableNames for complete list.');
        }

        namesWithNumericKeys[nameID] = names[key];
        nameIDs.push(nameID);
    }

    var macLanguageIds = reverseDict(macLanguages);
    var windowsLanguageIds = reverseDict(windowsLanguages);

    var nameRecords = [];
    var stringPool = [];

    for (var i = 0; i < nameIDs.length; i++) {
        nameID = nameIDs[i];
        var translations = namesWithNumericKeys[nameID];
        for (var lang in translations) {
            var text = translations[lang];

            // For MacOS, we try to emit the name in the form that was introduced
            // in the initial version of the TrueType spec (in the late 1980s).
            // However, this can fail for various reasons: the requested BCP 47
            // language code might not have an old-style Mac equivalent;
            // we might not have a codec for the needed character encoding;
            // or the name might contain characters that cannot be expressed
            // in the old-style Macintosh encoding. In case of failure, we emit
            // the name in a more modern fashion (Unicode encoding with BCP 47
            // language tags) that is recognized by MacOS 10.5, released in 2009.
            // If fonts were only read by operating systems, we could simply
            // emit all names in the modern form; this would be much easier.
            // However, there are many applications and libraries that read
            // 'name' tables directly, and these will usually only recognize
            // the ancient form (silently skipping the unrecognized names).
            var macPlatform = 1;  // Macintosh
            var macLanguage = macLanguageIds[lang];
            var macScript = macLanguageToScript[macLanguage];
            var macEncoding = getEncoding(macPlatform, macScript, macLanguage);
            var macName = encode.MACSTRING(text, macEncoding);
            if (macName === undefined) {
                macPlatform = 0;  // Unicode
                macLanguage = ltag.indexOf(lang);
                if (macLanguage < 0) {
                    macLanguage = ltag.length;
                    ltag.push(lang);
                }

                macScript = 4;  // Unicode 2.0 and later
                macName = encode.UTF16(text);
            }

            var macNameOffset = addStringToPool(macName, stringPool);
            nameRecords.push(makeNameRecord(macPlatform, macScript, macLanguage,
                                            nameID, macName.length, macNameOffset));

            var winLanguage = windowsLanguageIds[lang];
            if (winLanguage !== undefined) {
                var winName = encode.UTF16(text);
                var winNameOffset = addStringToPool(winName, stringPool);
                nameRecords.push(makeNameRecord(3, 1, winLanguage,
                                                nameID, winName.length, winNameOffset));
            }
        }
    }

    nameRecords.sort(function(a, b) {
        return ((a.platformID - b.platformID) ||
                (a.encodingID - b.encodingID) ||
                (a.languageID - b.languageID) ||
                (a.nameID - b.nameID));
    });

    var t = new table.Table('name', [
        {name: 'format', type: 'USHORT', value: 0},
        {name: 'count', type: 'USHORT', value: nameRecords.length},
        {name: 'stringOffset', type: 'USHORT', value: 6 + nameRecords.length * 12}
    ]);

    for (var r = 0; r < nameRecords.length; r++) {
        t.fields.push({name: 'record_' + r, type: 'RECORD', value: nameRecords[r]});
    }

    t.fields.push({name: 'strings', type: 'LITERAL', value: stringPool});
    return t;
}

var _name = { parse: parseNameTable, make: makeNameTable };

// The `OS/2` table contains metrics required in OpenType fonts.

var unicodeRanges = [
    {begin: 0x0000, end: 0x007F}, // Basic Latin
    {begin: 0x0080, end: 0x00FF}, // Latin-1 Supplement
    {begin: 0x0100, end: 0x017F}, // Latin Extended-A
    {begin: 0x0180, end: 0x024F}, // Latin Extended-B
    {begin: 0x0250, end: 0x02AF}, // IPA Extensions
    {begin: 0x02B0, end: 0x02FF}, // Spacing Modifier Letters
    {begin: 0x0300, end: 0x036F}, // Combining Diacritical Marks
    {begin: 0x0370, end: 0x03FF}, // Greek and Coptic
    {begin: 0x2C80, end: 0x2CFF}, // Coptic
    {begin: 0x0400, end: 0x04FF}, // Cyrillic
    {begin: 0x0530, end: 0x058F}, // Armenian
    {begin: 0x0590, end: 0x05FF}, // Hebrew
    {begin: 0xA500, end: 0xA63F}, // Vai
    {begin: 0x0600, end: 0x06FF}, // Arabic
    {begin: 0x07C0, end: 0x07FF}, // NKo
    {begin: 0x0900, end: 0x097F}, // Devanagari
    {begin: 0x0980, end: 0x09FF}, // Bengali
    {begin: 0x0A00, end: 0x0A7F}, // Gurmukhi
    {begin: 0x0A80, end: 0x0AFF}, // Gujarati
    {begin: 0x0B00, end: 0x0B7F}, // Oriya
    {begin: 0x0B80, end: 0x0BFF}, // Tamil
    {begin: 0x0C00, end: 0x0C7F}, // Telugu
    {begin: 0x0C80, end: 0x0CFF}, // Kannada
    {begin: 0x0D00, end: 0x0D7F}, // Malayalam
    {begin: 0x0E00, end: 0x0E7F}, // Thai
    {begin: 0x0E80, end: 0x0EFF}, // Lao
    {begin: 0x10A0, end: 0x10FF}, // Georgian
    {begin: 0x1B00, end: 0x1B7F}, // Balinese
    {begin: 0x1100, end: 0x11FF}, // Hangul Jamo
    {begin: 0x1E00, end: 0x1EFF}, // Latin Extended Additional
    {begin: 0x1F00, end: 0x1FFF}, // Greek Extended
    {begin: 0x2000, end: 0x206F}, // General Punctuation
    {begin: 0x2070, end: 0x209F}, // Superscripts And Subscripts
    {begin: 0x20A0, end: 0x20CF}, // Currency Symbol
    {begin: 0x20D0, end: 0x20FF}, // Combining Diacritical Marks For Symbols
    {begin: 0x2100, end: 0x214F}, // Letterlike Symbols
    {begin: 0x2150, end: 0x218F}, // Number Forms
    {begin: 0x2190, end: 0x21FF}, // Arrows
    {begin: 0x2200, end: 0x22FF}, // Mathematical Operators
    {begin: 0x2300, end: 0x23FF}, // Miscellaneous Technical
    {begin: 0x2400, end: 0x243F}, // Control Pictures
    {begin: 0x2440, end: 0x245F}, // Optical Character Recognition
    {begin: 0x2460, end: 0x24FF}, // Enclosed Alphanumerics
    {begin: 0x2500, end: 0x257F}, // Box Drawing
    {begin: 0x2580, end: 0x259F}, // Block Elements
    {begin: 0x25A0, end: 0x25FF}, // Geometric Shapes
    {begin: 0x2600, end: 0x26FF}, // Miscellaneous Symbols
    {begin: 0x2700, end: 0x27BF}, // Dingbats
    {begin: 0x3000, end: 0x303F}, // CJK Symbols And Punctuation
    {begin: 0x3040, end: 0x309F}, // Hiragana
    {begin: 0x30A0, end: 0x30FF}, // Katakana
    {begin: 0x3100, end: 0x312F}, // Bopomofo
    {begin: 0x3130, end: 0x318F}, // Hangul Compatibility Jamo
    {begin: 0xA840, end: 0xA87F}, // Phags-pa
    {begin: 0x3200, end: 0x32FF}, // Enclosed CJK Letters And Months
    {begin: 0x3300, end: 0x33FF}, // CJK Compatibility
    {begin: 0xAC00, end: 0xD7AF}, // Hangul Syllables
    {begin: 0xD800, end: 0xDFFF}, // Non-Plane 0 *
    {begin: 0x10900, end: 0x1091F}, // Phoenicia
    {begin: 0x4E00, end: 0x9FFF}, // CJK Unified Ideographs
    {begin: 0xE000, end: 0xF8FF}, // Private Use Area (plane 0)
    {begin: 0x31C0, end: 0x31EF}, // CJK Strokes
    {begin: 0xFB00, end: 0xFB4F}, // Alphabetic Presentation Forms
    {begin: 0xFB50, end: 0xFDFF}, // Arabic Presentation Forms-A
    {begin: 0xFE20, end: 0xFE2F}, // Combining Half Marks
    {begin: 0xFE10, end: 0xFE1F}, // Vertical Forms
    {begin: 0xFE50, end: 0xFE6F}, // Small Form Variants
    {begin: 0xFE70, end: 0xFEFF}, // Arabic Presentation Forms-B
    {begin: 0xFF00, end: 0xFFEF}, // Halfwidth And Fullwidth Forms
    {begin: 0xFFF0, end: 0xFFFF}, // Specials
    {begin: 0x0F00, end: 0x0FFF}, // Tibetan
    {begin: 0x0700, end: 0x074F}, // Syriac
    {begin: 0x0780, end: 0x07BF}, // Thaana
    {begin: 0x0D80, end: 0x0DFF}, // Sinhala
    {begin: 0x1000, end: 0x109F}, // Myanmar
    {begin: 0x1200, end: 0x137F}, // Ethiopic
    {begin: 0x13A0, end: 0x13FF}, // Cherokee
    {begin: 0x1400, end: 0x167F}, // Unified Canadian Aboriginal Syllabics
    {begin: 0x1680, end: 0x169F}, // Ogham
    {begin: 0x16A0, end: 0x16FF}, // Runic
    {begin: 0x1780, end: 0x17FF}, // Khmer
    {begin: 0x1800, end: 0x18AF}, // Mongolian
    {begin: 0x2800, end: 0x28FF}, // Braille Patterns
    {begin: 0xA000, end: 0xA48F}, // Yi Syllables
    {begin: 0x1700, end: 0x171F}, // Tagalog
    {begin: 0x10300, end: 0x1032F}, // Old Italic
    {begin: 0x10330, end: 0x1034F}, // Gothic
    {begin: 0x10400, end: 0x1044F}, // Deseret
    {begin: 0x1D000, end: 0x1D0FF}, // Byzantine Musical Symbols
    {begin: 0x1D400, end: 0x1D7FF}, // Mathematical Alphanumeric Symbols
    {begin: 0xFF000, end: 0xFFFFD}, // Private Use (plane 15)
    {begin: 0xFE00, end: 0xFE0F}, // Variation Selectors
    {begin: 0xE0000, end: 0xE007F}, // Tags
    {begin: 0x1900, end: 0x194F}, // Limbu
    {begin: 0x1950, end: 0x197F}, // Tai Le
    {begin: 0x1980, end: 0x19DF}, // New Tai Lue
    {begin: 0x1A00, end: 0x1A1F}, // Buginese
    {begin: 0x2C00, end: 0x2C5F}, // Glagolitic
    {begin: 0x2D30, end: 0x2D7F}, // Tifinagh
    {begin: 0x4DC0, end: 0x4DFF}, // Yijing Hexagram Symbols
    {begin: 0xA800, end: 0xA82F}, // Syloti Nagri
    {begin: 0x10000, end: 0x1007F}, // Linear B Syllabary
    {begin: 0x10140, end: 0x1018F}, // Ancient Greek Numbers
    {begin: 0x10380, end: 0x1039F}, // Ugaritic
    {begin: 0x103A0, end: 0x103DF}, // Old Persian
    {begin: 0x10450, end: 0x1047F}, // Shavian
    {begin: 0x10480, end: 0x104AF}, // Osmanya
    {begin: 0x10800, end: 0x1083F}, // Cypriot Syllabary
    {begin: 0x10A00, end: 0x10A5F}, // Kharoshthi
    {begin: 0x1D300, end: 0x1D35F}, // Tai Xuan Jing Symbols
    {begin: 0x12000, end: 0x123FF}, // Cuneiform
    {begin: 0x1D360, end: 0x1D37F}, // Counting Rod Numerals
    {begin: 0x1B80, end: 0x1BBF}, // Sundanese
    {begin: 0x1C00, end: 0x1C4F}, // Lepcha
    {begin: 0x1C50, end: 0x1C7F}, // Ol Chiki
    {begin: 0xA880, end: 0xA8DF}, // Saurashtra
    {begin: 0xA900, end: 0xA92F}, // Kayah Li
    {begin: 0xA930, end: 0xA95F}, // Rejang
    {begin: 0xAA00, end: 0xAA5F}, // Cham
    {begin: 0x10190, end: 0x101CF}, // Ancient Symbols
    {begin: 0x101D0, end: 0x101FF}, // Phaistos Disc
    {begin: 0x102A0, end: 0x102DF}, // Carian
    {begin: 0x1F030, end: 0x1F09F}  // Domino Tiles
];

function getUnicodeRange(unicode) {
    for (var i = 0; i < unicodeRanges.length; i += 1) {
        var range = unicodeRanges[i];
        if (unicode >= range.begin && unicode < range.end) {
            return i;
        }
    }

    return -1;
}

// Parse the OS/2 and Windows metrics `OS/2` table
function parseOS2Table(data, start) {
    var os2 = {};
    var p = new parse.Parser(data, start);
    os2.version = p.parseUShort();
    os2.xAvgCharWidth = p.parseShort();
    os2.usWeightClass = p.parseUShort();
    os2.usWidthClass = p.parseUShort();
    os2.fsType = p.parseUShort();
    os2.ySubscriptXSize = p.parseShort();
    os2.ySubscriptYSize = p.parseShort();
    os2.ySubscriptXOffset = p.parseShort();
    os2.ySubscriptYOffset = p.parseShort();
    os2.ySuperscriptXSize = p.parseShort();
    os2.ySuperscriptYSize = p.parseShort();
    os2.ySuperscriptXOffset = p.parseShort();
    os2.ySuperscriptYOffset = p.parseShort();
    os2.yStrikeoutSize = p.parseShort();
    os2.yStrikeoutPosition = p.parseShort();
    os2.sFamilyClass = p.parseShort();
    os2.panose = [];
    for (var i = 0; i < 10; i++) {
        os2.panose[i] = p.parseByte();
    }

    os2.ulUnicodeRange1 = p.parseULong();
    os2.ulUnicodeRange2 = p.parseULong();
    os2.ulUnicodeRange3 = p.parseULong();
    os2.ulUnicodeRange4 = p.parseULong();
    os2.achVendID = String.fromCharCode(p.parseByte(), p.parseByte(), p.parseByte(), p.parseByte());
    os2.fsSelection = p.parseUShort();
    os2.usFirstCharIndex = p.parseUShort();
    os2.usLastCharIndex = p.parseUShort();
    os2.sTypoAscender = p.parseShort();
    os2.sTypoDescender = p.parseShort();
    os2.sTypoLineGap = p.parseShort();
    os2.usWinAscent = p.parseUShort();
    os2.usWinDescent = p.parseUShort();
    if (os2.version >= 1) {
        os2.ulCodePageRange1 = p.parseULong();
        os2.ulCodePageRange2 = p.parseULong();
    }

    if (os2.version >= 2) {
        os2.sxHeight = p.parseShort();
        os2.sCapHeight = p.parseShort();
        os2.usDefaultChar = p.parseUShort();
        os2.usBreakChar = p.parseUShort();
        os2.usMaxContent = p.parseUShort();
    }

    return os2;
}

function makeOS2Table(options) {
    return new table.Table('OS/2', [
        {name: 'version', type: 'USHORT', value: 0x0003},
        {name: 'xAvgCharWidth', type: 'SHORT', value: 0},
        {name: 'usWeightClass', type: 'USHORT', value: 0},
        {name: 'usWidthClass', type: 'USHORT', value: 0},
        {name: 'fsType', type: 'USHORT', value: 0},
        {name: 'ySubscriptXSize', type: 'SHORT', value: 650},
        {name: 'ySubscriptYSize', type: 'SHORT', value: 699},
        {name: 'ySubscriptXOffset', type: 'SHORT', value: 0},
        {name: 'ySubscriptYOffset', type: 'SHORT', value: 140},
        {name: 'ySuperscriptXSize', type: 'SHORT', value: 650},
        {name: 'ySuperscriptYSize', type: 'SHORT', value: 699},
        {name: 'ySuperscriptXOffset', type: 'SHORT', value: 0},
        {name: 'ySuperscriptYOffset', type: 'SHORT', value: 479},
        {name: 'yStrikeoutSize', type: 'SHORT', value: 49},
        {name: 'yStrikeoutPosition', type: 'SHORT', value: 258},
        {name: 'sFamilyClass', type: 'SHORT', value: 0},
        {name: 'bFamilyType', type: 'BYTE', value: 0},
        {name: 'bSerifStyle', type: 'BYTE', value: 0},
        {name: 'bWeight', type: 'BYTE', value: 0},
        {name: 'bProportion', type: 'BYTE', value: 0},
        {name: 'bContrast', type: 'BYTE', value: 0},
        {name: 'bStrokeVariation', type: 'BYTE', value: 0},
        {name: 'bArmStyle', type: 'BYTE', value: 0},
        {name: 'bLetterform', type: 'BYTE', value: 0},
        {name: 'bMidline', type: 'BYTE', value: 0},
        {name: 'bXHeight', type: 'BYTE', value: 0},
        {name: 'ulUnicodeRange1', type: 'ULONG', value: 0},
        {name: 'ulUnicodeRange2', type: 'ULONG', value: 0},
        {name: 'ulUnicodeRange3', type: 'ULONG', value: 0},
        {name: 'ulUnicodeRange4', type: 'ULONG', value: 0},
        {name: 'achVendID', type: 'CHARARRAY', value: 'XXXX'},
        {name: 'fsSelection', type: 'USHORT', value: 0},
        {name: 'usFirstCharIndex', type: 'USHORT', value: 0},
        {name: 'usLastCharIndex', type: 'USHORT', value: 0},
        {name: 'sTypoAscender', type: 'SHORT', value: 0},
        {name: 'sTypoDescender', type: 'SHORT', value: 0},
        {name: 'sTypoLineGap', type: 'SHORT', value: 0},
        {name: 'usWinAscent', type: 'USHORT', value: 0},
        {name: 'usWinDescent', type: 'USHORT', value: 0},
        {name: 'ulCodePageRange1', type: 'ULONG', value: 0},
        {name: 'ulCodePageRange2', type: 'ULONG', value: 0},
        {name: 'sxHeight', type: 'SHORT', value: 0},
        {name: 'sCapHeight', type: 'SHORT', value: 0},
        {name: 'usDefaultChar', type: 'USHORT', value: 0},
        {name: 'usBreakChar', type: 'USHORT', value: 0},
        {name: 'usMaxContext', type: 'USHORT', value: 0}
    ], options);
}

var os2 = { parse: parseOS2Table, make: makeOS2Table, unicodeRanges: unicodeRanges, getUnicodeRange: getUnicodeRange };

// The `post` table stores additional PostScript information, such as glyph names.

// Parse the PostScript `post` table
function parsePostTable(data, start) {
    var post = {};
    var p = new parse.Parser(data, start);
    post.version = p.parseVersion();
    post.italicAngle = p.parseFixed();
    post.underlinePosition = p.parseShort();
    post.underlineThickness = p.parseShort();
    post.isFixedPitch = p.parseULong();
    post.minMemType42 = p.parseULong();
    post.maxMemType42 = p.parseULong();
    post.minMemType1 = p.parseULong();
    post.maxMemType1 = p.parseULong();
    switch (post.version) {
        case 1:
            post.names = standardNames.slice();
            break;
        case 2:
            post.numberOfGlyphs = p.parseUShort();
            post.glyphNameIndex = new Array(post.numberOfGlyphs);
            for (var i = 0; i < post.numberOfGlyphs; i++) {
                post.glyphNameIndex[i] = p.parseUShort();
            }

            post.names = [];
            for (var i$1 = 0; i$1 < post.numberOfGlyphs; i$1++) {
                if (post.glyphNameIndex[i$1] >= standardNames.length) {
                    var nameLength = p.parseChar();
                    post.names.push(p.parseString(nameLength));
                }
            }

            break;
        case 2.5:
            post.numberOfGlyphs = p.parseUShort();
            post.offset = new Array(post.numberOfGlyphs);
            for (var i$2 = 0; i$2 < post.numberOfGlyphs; i$2++) {
                post.offset[i$2] = p.parseChar();
            }

            break;
    }
    return post;
}

function makePostTable() {
    return new table.Table('post', [
        {name: 'version', type: 'FIXED', value: 0x00030000},
        {name: 'italicAngle', type: 'FIXED', value: 0},
        {name: 'underlinePosition', type: 'FWORD', value: 0},
        {name: 'underlineThickness', type: 'FWORD', value: 0},
        {name: 'isFixedPitch', type: 'ULONG', value: 0},
        {name: 'minMemType42', type: 'ULONG', value: 0},
        {name: 'maxMemType42', type: 'ULONG', value: 0},
        {name: 'minMemType1', type: 'ULONG', value: 0},
        {name: 'maxMemType1', type: 'ULONG', value: 0}
    ]);
}

var post = { parse: parsePostTable, make: makePostTable };

// The `GSUB` table contains ligatures, among other things.

var subtableParsers = new Array(9);         // subtableParsers[0] is unused

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#SS
subtableParsers[1] = function parseLookup1() {
    var start = this.offset + this.relativeOffset;
    var substFormat = this.parseUShort();
    if (substFormat === 1) {
        return {
            substFormat: 1,
            coverage: this.parsePointer(Parser.coverage),
            deltaGlyphId: this.parseUShort()
        };
    } else if (substFormat === 2) {
        return {
            substFormat: 2,
            coverage: this.parsePointer(Parser.coverage),
            substitute: this.parseOffset16List()
        };
    }
    check.assert(false, '0x' + start.toString(16) + ': lookup type 1 format must be 1 or 2.');
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#MS
subtableParsers[2] = function parseLookup2() {
    var substFormat = this.parseUShort();
    check.argument(substFormat === 1, 'GSUB Multiple Substitution Subtable identifier-format must be 1');
    return {
        substFormat: substFormat,
        coverage: this.parsePointer(Parser.coverage),
        sequences: this.parseListOfLists()
    };
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#AS
subtableParsers[3] = function parseLookup3() {
    var substFormat = this.parseUShort();
    check.argument(substFormat === 1, 'GSUB Alternate Substitution Subtable identifier-format must be 1');
    return {
        substFormat: substFormat,
        coverage: this.parsePointer(Parser.coverage),
        alternateSets: this.parseListOfLists()
    };
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#LS
subtableParsers[4] = function parseLookup4() {
    var substFormat = this.parseUShort();
    check.argument(substFormat === 1, 'GSUB ligature table identifier-format must be 1');
    return {
        substFormat: substFormat,
        coverage: this.parsePointer(Parser.coverage),
        ligatureSets: this.parseListOfLists(function() {
            return {
                ligGlyph: this.parseUShort(),
                components: this.parseUShortList(this.parseUShort() - 1)
            };
        })
    };
};

var lookupRecordDesc = {
    sequenceIndex: Parser.uShort,
    lookupListIndex: Parser.uShort
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#CSF
subtableParsers[5] = function parseLookup5() {
    var start = this.offset + this.relativeOffset;
    var substFormat = this.parseUShort();

    if (substFormat === 1) {
        return {
            substFormat: substFormat,
            coverage: this.parsePointer(Parser.coverage),
            ruleSets: this.parseListOfLists(function() {
                var glyphCount = this.parseUShort();
                var substCount = this.parseUShort();
                return {
                    input: this.parseUShortList(glyphCount - 1),
                    lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
                };
            })
        };
    } else if (substFormat === 2) {
        return {
            substFormat: substFormat,
            coverage: this.parsePointer(Parser.coverage),
            classDef: this.parsePointer(Parser.classDef),
            classSets: this.parseListOfLists(function() {
                var glyphCount = this.parseUShort();
                var substCount = this.parseUShort();
                return {
                    classes: this.parseUShortList(glyphCount - 1),
                    lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
                };
            })
        };
    } else if (substFormat === 3) {
        var glyphCount = this.parseUShort();
        var substCount = this.parseUShort();
        return {
            substFormat: substFormat,
            coverages: this.parseList(glyphCount, Parser.pointer(Parser.coverage)),
            lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
        };
    }
    check.assert(false, '0x' + start.toString(16) + ': lookup type 5 format must be 1, 2 or 3.');
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#CC
subtableParsers[6] = function parseLookup6() {
    var start = this.offset + this.relativeOffset;
    var substFormat = this.parseUShort();
    if (substFormat === 1) {
        return {
            substFormat: 1,
            coverage: this.parsePointer(Parser.coverage),
            chainRuleSets: this.parseListOfLists(function() {
                return {
                    backtrack: this.parseUShortList(),
                    input: this.parseUShortList(this.parseShort() - 1),
                    lookahead: this.parseUShortList(),
                    lookupRecords: this.parseRecordList(lookupRecordDesc)
                };
            })
        };
    } else if (substFormat === 2) {
        return {
            substFormat: 2,
            coverage: this.parsePointer(Parser.coverage),
            backtrackClassDef: this.parsePointer(Parser.classDef),
            inputClassDef: this.parsePointer(Parser.classDef),
            lookaheadClassDef: this.parsePointer(Parser.classDef),
            chainClassSet: this.parseListOfLists(function() {
                return {
                    backtrack: this.parseUShortList(),
                    input: this.parseUShortList(this.parseShort() - 1),
                    lookahead: this.parseUShortList(),
                    lookupRecords: this.parseRecordList(lookupRecordDesc)
                };
            })
        };
    } else if (substFormat === 3) {
        return {
            substFormat: 3,
            backtrackCoverage: this.parseList(Parser.pointer(Parser.coverage)),
            inputCoverage: this.parseList(Parser.pointer(Parser.coverage)),
            lookaheadCoverage: this.parseList(Parser.pointer(Parser.coverage)),
            lookupRecords: this.parseRecordList(lookupRecordDesc)
        };
    }
    check.assert(false, '0x' + start.toString(16) + ': lookup type 6 format must be 1, 2 or 3.');
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#ES
subtableParsers[7] = function parseLookup7() {
    // Extension Substitution subtable
    var substFormat = this.parseUShort();
    check.argument(substFormat === 1, 'GSUB Extension Substitution subtable identifier-format must be 1');
    var extensionLookupType = this.parseUShort();
    var extensionParser = new Parser(this.data, this.offset + this.parseULong());
    return {
        substFormat: 1,
        lookupType: extensionLookupType,
        extension: subtableParsers[extensionLookupType].call(extensionParser)
    };
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#RCCS
subtableParsers[8] = function parseLookup8() {
    var substFormat = this.parseUShort();
    check.argument(substFormat === 1, 'GSUB Reverse Chaining Contextual Single Substitution Subtable identifier-format must be 1');
    return {
        substFormat: substFormat,
        coverage: this.parsePointer(Parser.coverage),
        backtrackCoverage: this.parseList(Parser.pointer(Parser.coverage)),
        lookaheadCoverage: this.parseList(Parser.pointer(Parser.coverage)),
        substitutes: this.parseUShortList()
    };
};

// https://www.microsoft.com/typography/OTSPEC/gsub.htm
function parseGsubTable(data, start) {
    start = start || 0;
    var p = new Parser(data, start);
    var tableVersion = p.parseVersion(1);
    check.argument(tableVersion === 1 || tableVersion === 1.1, 'Unsupported GSUB table version.');
    if (tableVersion === 1) {
        return {
            version: tableVersion,
            scripts: p.parseScriptList(),
            features: p.parseFeatureList(),
            lookups: p.parseLookupList(subtableParsers)
        };
    } else {
        return {
            version: tableVersion,
            scripts: p.parseScriptList(),
            features: p.parseFeatureList(),
            lookups: p.parseLookupList(subtableParsers),
            variations: p.parseFeatureVariationsList()
        };
    }

}

// GSUB Writing //////////////////////////////////////////////
var subtableMakers = new Array(9);

subtableMakers[1] = function makeLookup1(subtable) {
    if (subtable.substFormat === 1) {
        return new table.Table('substitutionTable', [
            {name: 'substFormat', type: 'USHORT', value: 1},
            {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)},
            {name: 'deltaGlyphID', type: 'USHORT', value: subtable.deltaGlyphId}
        ]);
    } else {
        return new table.Table('substitutionTable', [
            {name: 'substFormat', type: 'USHORT', value: 2},
            {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)}
        ].concat(table.ushortList('substitute', subtable.substitute)));
    }
};

subtableMakers[2] = function makeLookup2(subtable) {
    check.assert(subtable.substFormat === 1, 'Lookup type 2 substFormat must be 1.');
    return new table.Table('substitutionTable', [
        {name: 'substFormat', type: 'USHORT', value: 1},
        {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)}
    ].concat(table.tableList('seqSet', subtable.sequences, function(sequenceSet) {
        return new table.Table('sequenceSetTable', table.ushortList('sequence', sequenceSet));
    })));
};

subtableMakers[3] = function makeLookup3(subtable) {
    check.assert(subtable.substFormat === 1, 'Lookup type 3 substFormat must be 1.');
    return new table.Table('substitutionTable', [
        {name: 'substFormat', type: 'USHORT', value: 1},
        {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)}
    ].concat(table.tableList('altSet', subtable.alternateSets, function(alternateSet) {
        return new table.Table('alternateSetTable', table.ushortList('alternate', alternateSet));
    })));
};

subtableMakers[4] = function makeLookup4(subtable) {
    check.assert(subtable.substFormat === 1, 'Lookup type 4 substFormat must be 1.');
    return new table.Table('substitutionTable', [
        {name: 'substFormat', type: 'USHORT', value: 1},
        {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)}
    ].concat(table.tableList('ligSet', subtable.ligatureSets, function(ligatureSet) {
        return new table.Table('ligatureSetTable', table.tableList('ligature', ligatureSet, function(ligature) {
            return new table.Table('ligatureTable',
                [{name: 'ligGlyph', type: 'USHORT', value: ligature.ligGlyph}]
                .concat(table.ushortList('component', ligature.components, ligature.components.length + 1))
            );
        }));
    })));
};

subtableMakers[6] = function makeLookup6(subtable) {
    if (subtable.substFormat === 1) {
        var returnTable = new table.Table('chainContextTable', [
            {name: 'substFormat', type: 'USHORT', value: subtable.substFormat},
            {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)}
        ].concat(table.tableList('chainRuleSet', subtable.chainRuleSets, function(chainRuleSet) {
            return new table.Table('chainRuleSetTable', table.tableList('chainRule', chainRuleSet, function(chainRule) {
                var tableData = table.ushortList('backtrackGlyph', chainRule.backtrack, chainRule.backtrack.length)
                    .concat(table.ushortList('inputGlyph', chainRule.input, chainRule.input.length + 1))
                    .concat(table.ushortList('lookaheadGlyph', chainRule.lookahead, chainRule.lookahead.length))
                    .concat(table.ushortList('substitution', [], chainRule.lookupRecords.length));

                chainRule.lookupRecords.forEach(function (record, i) {
                    tableData = tableData
                        .concat({name: 'sequenceIndex' + i, type: 'USHORT', value: record.sequenceIndex})
                        .concat({name: 'lookupListIndex' + i, type: 'USHORT', value: record.lookupListIndex});
                });
                return new table.Table('chainRuleTable', tableData);
            }));
        })));
        return returnTable;
    } else if (subtable.substFormat === 2) {
        check.assert(false, 'lookup type 6 format 2 is not yet supported.');
    } else if (subtable.substFormat === 3) {
        var tableData = [
            {name: 'substFormat', type: 'USHORT', value: subtable.substFormat} ];

        tableData.push({name: 'backtrackGlyphCount', type: 'USHORT', value: subtable.backtrackCoverage.length});
        subtable.backtrackCoverage.forEach(function (coverage, i) {
            tableData.push({name: 'backtrackCoverage' + i, type: 'TABLE', value: new table.Coverage(coverage)});
        });
        tableData.push({name: 'inputGlyphCount', type: 'USHORT', value: subtable.inputCoverage.length});
        subtable.inputCoverage.forEach(function (coverage, i) {
            tableData.push({name: 'inputCoverage' + i, type: 'TABLE', value: new table.Coverage(coverage)});
        });
        tableData.push({name: 'lookaheadGlyphCount', type: 'USHORT', value: subtable.lookaheadCoverage.length});
        subtable.lookaheadCoverage.forEach(function (coverage, i) {
            tableData.push({name: 'lookaheadCoverage' + i, type: 'TABLE', value: new table.Coverage(coverage)});
        });

        tableData.push({name: 'substitutionCount', type: 'USHORT', value: subtable.lookupRecords.length});
        subtable.lookupRecords.forEach(function (record, i) {
            tableData = tableData
                .concat({name: 'sequenceIndex' + i, type: 'USHORT', value: record.sequenceIndex})
                .concat({name: 'lookupListIndex' + i, type: 'USHORT', value: record.lookupListIndex});
        });

        var returnTable$1 = new table.Table('chainContextTable', tableData);

        return returnTable$1;
    }

    check.assert(false, 'lookup type 6 format must be 1, 2 or 3.');
};

function makeGsubTable(gsub) {
    return new table.Table('GSUB', [
        {name: 'version', type: 'ULONG', value: 0x10000},
        {name: 'scripts', type: 'TABLE', value: new table.ScriptList(gsub.scripts)},
        {name: 'features', type: 'TABLE', value: new table.FeatureList(gsub.features)},
        {name: 'lookups', type: 'TABLE', value: new table.LookupList(gsub.lookups, subtableMakers)}
    ]);
}

var gsub = { parse: parseGsubTable, make: makeGsubTable };

// The `GPOS` table contains kerning pairs, among other things.

// Parse the metadata `meta` table.
// https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6meta.html
function parseMetaTable(data, start) {
    var p = new parse.Parser(data, start);
    var tableVersion = p.parseULong();
    check.argument(tableVersion === 1, 'Unsupported META table version.');
    p.parseULong(); // flags - currently unused and set to 0
    p.parseULong(); // tableOffset
    var numDataMaps = p.parseULong();

    var tags = {};
    for (var i = 0; i < numDataMaps; i++) {
        var tag = p.parseTag();
        var dataOffset = p.parseULong();
        var dataLength = p.parseULong();
        var text = decode.UTF8(data, start + dataOffset, dataLength);

        tags[tag] = text;
    }
    return tags;
}

function makeMetaTable(tags) {
    var numTags = Object.keys(tags).length;
    var stringPool = '';
    var stringPoolOffset = 16 + numTags * 12;

    var result = new table.Table('meta', [
        {name: 'version', type: 'ULONG', value: 1},
        {name: 'flags', type: 'ULONG', value: 0},
        {name: 'offset', type: 'ULONG', value: stringPoolOffset},
        {name: 'numTags', type: 'ULONG', value: numTags}
    ]);

    for (var tag in tags) {
        var pos = stringPool.length;
        stringPool += tags[tag];

        result.fields.push({name: 'tag ' + tag, type: 'TAG', value: tag});
        result.fields.push({name: 'offset ' + tag, type: 'ULONG', value: stringPoolOffset + pos});
        result.fields.push({name: 'length ' + tag, type: 'ULONG', value: tags[tag].length});
    }

    result.fields.push({name: 'stringPool', type: 'CHARARRAY', value: stringPool});

    return result;
}

var meta = { parse: parseMetaTable, make: makeMetaTable };

// The `sfnt` wrapper provides organization for the tables in the font.

function log2(v) {
    return Math.log(v) / Math.log(2) | 0;
}

function computeCheckSum(bytes) {
    while (bytes.length % 4 !== 0) {
        bytes.push(0);
    }

    var sum = 0;
    for (var i = 0; i < bytes.length; i += 4) {
        sum += (bytes[i] << 24) +
            (bytes[i + 1] << 16) +
            (bytes[i + 2] << 8) +
            (bytes[i + 3]);
    }

    sum %= Math.pow(2, 32);
    return sum;
}

function makeTableRecord(tag, checkSum, offset, length) {
    return new table.Record('Table Record', [
        {name: 'tag', type: 'TAG', value: tag !== undefined ? tag : ''},
        {name: 'checkSum', type: 'ULONG', value: checkSum !== undefined ? checkSum : 0},
        {name: 'offset', type: 'ULONG', value: offset !== undefined ? offset : 0},
        {name: 'length', type: 'ULONG', value: length !== undefined ? length : 0}
    ]);
}

function makeSfntTable(tables) {
    var sfnt = new table.Table('sfnt', [
        {name: 'version', type: 'TAG', value: 'OTTO'},
        {name: 'numTables', type: 'USHORT', value: 0},
        {name: 'searchRange', type: 'USHORT', value: 0},
        {name: 'entrySelector', type: 'USHORT', value: 0},
        {name: 'rangeShift', type: 'USHORT', value: 0}
    ]);
    sfnt.tables = tables;
    sfnt.numTables = tables.length;
    var highestPowerOf2 = Math.pow(2, log2(sfnt.numTables));
    sfnt.searchRange = 16 * highestPowerOf2;
    sfnt.entrySelector = log2(highestPowerOf2);
    sfnt.rangeShift = sfnt.numTables * 16 - sfnt.searchRange;

    var recordFields = [];
    var tableFields = [];

    var offset = sfnt.sizeOf() + (makeTableRecord().sizeOf() * sfnt.numTables);
    while (offset % 4 !== 0) {
        offset += 1;
        tableFields.push({name: 'padding', type: 'BYTE', value: 0});
    }

    for (var i = 0; i < tables.length; i += 1) {
        var t = tables[i];
        check.argument(t.tableName.length === 4, 'Table name' + t.tableName + ' is invalid.');
        var tableLength = t.sizeOf();
        var tableRecord = makeTableRecord(t.tableName, computeCheckSum(t.encode()), offset, tableLength);
        recordFields.push({name: tableRecord.tag + ' Table Record', type: 'RECORD', value: tableRecord});
        tableFields.push({name: t.tableName + ' table', type: 'RECORD', value: t});
        offset += tableLength;
        check.argument(!isNaN(offset), 'Something went wrong calculating the offset.');
        while (offset % 4 !== 0) {
            offset += 1;
            tableFields.push({name: 'padding', type: 'BYTE', value: 0});
        }
    }

    // Table records need to be sorted alphabetically.
    recordFields.sort(function(r1, r2) {
        if (r1.value.tag > r2.value.tag) {
            return 1;
        } else {
            return -1;
        }
    });

    sfnt.fields = sfnt.fields.concat(recordFields);
    sfnt.fields = sfnt.fields.concat(tableFields);
    return sfnt;
}

// Get the metrics for a character. If the string has more than one character
// this function returns metrics for the first available character.
// You can provide optional fallback metrics if no characters are available.
function metricsForChar(font, chars, notFoundMetrics) {
    for (var i = 0; i < chars.length; i += 1) {
        var glyphIndex = font.charToGlyphIndex(chars[i]);
        if (glyphIndex > 0) {
            var glyph = font.glyphs.get(glyphIndex);
            return glyph.getMetrics();
        }
    }

    return notFoundMetrics;
}

function average(vs) {
    var sum = 0;
    for (var i = 0; i < vs.length; i += 1) {
        sum += vs[i];
    }

    return sum / vs.length;
}

// Convert the font object to a SFNT data structure.
// This structure contains all the necessary tables and metadata to create a binary OTF file.
function fontToSfntTable(font) {
    var xMins = [];
    var yMins = [];
    var xMaxs = [];
    var yMaxs = [];
    var advanceWidths = [];
    var leftSideBearings = [];
    var rightSideBearings = [];
    var firstCharIndex;
    var lastCharIndex = 0;
    var ulUnicodeRange1 = 0;
    var ulUnicodeRange2 = 0;
    var ulUnicodeRange3 = 0;
    var ulUnicodeRange4 = 0;

    for (var i = 0; i < font.glyphs.length; i += 1) {
        var glyph = font.glyphs.get(i);
        var unicode = glyph.unicode | 0;

        if (isNaN(glyph.advanceWidth)) {
            throw new Error('Glyph ' + glyph.name + ' (' + i + '): advanceWidth is not a number.');
        }

        if (firstCharIndex > unicode || firstCharIndex === undefined) {
            // ignore .notdef char
            if (unicode > 0) {
                firstCharIndex = unicode;
            }
        }

        if (lastCharIndex < unicode) {
            lastCharIndex = unicode;
        }

        var position = os2.getUnicodeRange(unicode);
        if (position < 32) {
            ulUnicodeRange1 |= 1 << position;
        } else if (position < 64) {
            ulUnicodeRange2 |= 1 << position - 32;
        } else if (position < 96) {
            ulUnicodeRange3 |= 1 << position - 64;
        } else if (position < 123) {
            ulUnicodeRange4 |= 1 << position - 96;
        } else {
            throw new Error('Unicode ranges bits > 123 are reserved for internal usage');
        }
        // Skip non-important characters.
        if (glyph.name === '.notdef') { continue; }
        var metrics = glyph.getMetrics();
        xMins.push(metrics.xMin);
        yMins.push(metrics.yMin);
        xMaxs.push(metrics.xMax);
        yMaxs.push(metrics.yMax);
        leftSideBearings.push(metrics.leftSideBearing);
        rightSideBearings.push(metrics.rightSideBearing);
        advanceWidths.push(glyph.advanceWidth);
    }

    var globals = {
        xMin: Math.min.apply(null, xMins),
        yMin: Math.min.apply(null, yMins),
        xMax: Math.max.apply(null, xMaxs),
        yMax: Math.max.apply(null, yMaxs),
        advanceWidthMax: Math.max.apply(null, advanceWidths),
        advanceWidthAvg: average(advanceWidths),
        minLeftSideBearing: Math.min.apply(null, leftSideBearings),
        maxLeftSideBearing: Math.max.apply(null, leftSideBearings),
        minRightSideBearing: Math.min.apply(null, rightSideBearings)
    };
    globals.ascender = font.ascender;
    globals.descender = font.descender;

    var headTable = head.make({
        flags: 3, // 00000011 (baseline for font at y=0; left sidebearing point at x=0)
        unitsPerEm: font.unitsPerEm,
        xMin: globals.xMin,
        yMin: globals.yMin,
        xMax: globals.xMax,
        yMax: globals.yMax,
        lowestRecPPEM: 3,
        createdTimestamp: font.createdTimestamp
    });

    var hheaTable = hhea.make({
        ascender: globals.ascender,
        descender: globals.descender,
        advanceWidthMax: globals.advanceWidthMax,
        minLeftSideBearing: globals.minLeftSideBearing,
        minRightSideBearing: globals.minRightSideBearing,
        xMaxExtent: globals.maxLeftSideBearing + (globals.xMax - globals.xMin),
        numberOfHMetrics: font.glyphs.length
    });

    var maxpTable = maxp.make(font.glyphs.length);

    var os2Table = os2.make(Object.assign({
        xAvgCharWidth: Math.round(globals.advanceWidthAvg),
        usFirstCharIndex: firstCharIndex,
        usLastCharIndex: lastCharIndex,
        ulUnicodeRange1: ulUnicodeRange1,
        ulUnicodeRange2: ulUnicodeRange2,
        ulUnicodeRange3: ulUnicodeRange3,
        ulUnicodeRange4: ulUnicodeRange4,
        // See http://typophile.com/node/13081 for more info on vertical metrics.
        // We get metrics for typical characters (such as "x" for xHeight).
        // We provide some fallback characters if characters are unavailable: their
        // ordering was chosen experimentally.
        sTypoAscender: globals.ascender,
        sTypoDescender: globals.descender,
        sTypoLineGap: 0,
        usWinAscent: globals.yMax,
        usWinDescent: Math.abs(globals.yMin),
        ulCodePageRange1: 1, // FIXME: hard-code Latin 1 support for now
        sxHeight: metricsForChar(font, 'xyvw', {yMax: Math.round(globals.ascender / 2)}).yMax,
        sCapHeight: metricsForChar(font, 'HIKLEFJMNTZBDPRAGOQSUVWXY', globals).yMax,
        usDefaultChar: font.hasChar(' ') ? 32 : 0, // Use space as the default character, if available.
        usBreakChar: font.hasChar(' ') ? 32 : 0, // Use space as the break character, if available.
    }, font.tables.os2));

    var hmtxTable = hmtx.make(font.glyphs);
    var cmapTable = cmap.make(font.glyphs);

    var englishFamilyName = font.getEnglishName('fontFamily');
    var englishStyleName = font.getEnglishName('fontSubfamily');
    var englishFullName = englishFamilyName + ' ' + englishStyleName;
    var postScriptName = font.getEnglishName('postScriptName');
    if (!postScriptName) {
        postScriptName = englishFamilyName.replace(/\s/g, '') + '-' + englishStyleName;
    }

    var names = {};
    for (var n in font.names) {
        names[n] = font.names[n];
    }

    if (!names.uniqueID) {
        names.uniqueID = {en: font.getEnglishName('manufacturer') + ':' + englishFullName};
    }

    if (!names.postScriptName) {
        names.postScriptName = {en: postScriptName};
    }

    if (!names.preferredFamily) {
        names.preferredFamily = font.names.fontFamily;
    }

    if (!names.preferredSubfamily) {
        names.preferredSubfamily = font.names.fontSubfamily;
    }

    var languageTags = [];
    var nameTable = _name.make(names, languageTags);
    var ltagTable = (languageTags.length > 0 ? ltag.make(languageTags) : undefined);

    var postTable = post.make();
    var cffTable = cff.make(font.glyphs, {
        version: font.getEnglishName('version'),
        fullName: englishFullName,
        familyName: englishFamilyName,
        weightName: englishStyleName,
        postScriptName: postScriptName,
        unitsPerEm: font.unitsPerEm,
        fontBBox: [0, globals.yMin, globals.ascender, globals.advanceWidthMax]
    });

    var metaTable = (font.metas && Object.keys(font.metas).length > 0) ? meta.make(font.metas) : undefined;

    // The order does not matter because makeSfntTable() will sort them.
    var tables = [headTable, hheaTable, maxpTable, os2Table, nameTable, cmapTable, postTable, cffTable, hmtxTable];
    if (ltagTable) {
        tables.push(ltagTable);
    }
    // Optional tables
    if (font.tables.gsub) {
        tables.push(gsub.make(font.tables.gsub));
    }
    if (metaTable) {
        tables.push(metaTable);
    }

    var sfntTable = makeSfntTable(tables);

    // Compute the font's checkSum and store it in head.checkSumAdjustment.
    var bytes = sfntTable.encode();
    var checkSum = computeCheckSum(bytes);
    var tableFields = sfntTable.fields;
    var checkSumAdjusted = false;
    for (var i$1 = 0; i$1 < tableFields.length; i$1 += 1) {
        if (tableFields[i$1].name === 'head table') {
            tableFields[i$1].value.checkSumAdjustment = 0xB1B0AFBA - checkSum;
            checkSumAdjusted = true;
            break;
        }
    }

    if (!checkSumAdjusted) {
        throw new Error('Could not find head table with checkSum to adjust.');
    }

    return sfntTable;
}

var sfnt = { make: makeSfntTable, fontToTable: fontToSfntTable, computeCheckSum: computeCheckSum };

// The Layout object is the prototype of Substitution objects, and provides

function searchTag(arr, tag) {
    /* jshint bitwise: false */
    var imin = 0;
    var imax = arr.length - 1;
    while (imin <= imax) {
        var imid = (imin + imax) >>> 1;
        var val = arr[imid].tag;
        if (val === tag) {
            return imid;
        } else if (val < tag) {
            imin = imid + 1;
        } else { imax = imid - 1; }
    }
    // Not found: return -1-insertion point
    return -imin - 1;
}

function binSearch(arr, value) {
    /* jshint bitwise: false */
    var imin = 0;
    var imax = arr.length - 1;
    while (imin <= imax) {
        var imid = (imin + imax) >>> 1;
        var val = arr[imid];
        if (val === value) {
            return imid;
        } else if (val < value) {
            imin = imid + 1;
        } else { imax = imid - 1; }
    }
    // Not found: return -1-insertion point
    return -imin - 1;
}

// binary search in a list of ranges (coverage, class definition)
function searchRange(ranges, value) {
    // jshint bitwise: false
    var range;
    var imin = 0;
    var imax = ranges.length - 1;
    while (imin <= imax) {
        var imid = (imin + imax) >>> 1;
        range = ranges[imid];
        var start = range.start;
        if (start === value) {
            return range;
        } else if (start < value) {
            imin = imid + 1;
        } else { imax = imid - 1; }
    }
    if (imin > 0) {
        range = ranges[imin - 1];
        if (value > range.end) { return 0; }
        return range;
    }
}

/**
 * @exports opentype.Layout
 * @class
 */
function Layout(font, tableName) {
    this.font = font;
    this.tableName = tableName;
}

Layout.prototype = {

    /**
     * Binary search an object by "tag" property
     * @instance
     * @function searchTag
     * @memberof opentype.Layout
     * @param  {Array} arr
     * @param  {string} tag
     * @return {number}
     */
    searchTag: searchTag,

    /**
     * Binary search in a list of numbers
     * @instance
     * @function binSearch
     * @memberof opentype.Layout
     * @param  {Array} arr
     * @param  {number} value
     * @return {number}
     */
    binSearch: binSearch,

    /**
     * Get or create the Layout table (GSUB, GPOS etc).
     * @param  {boolean} create - Whether to create a new one.
     * @return {Object} The GSUB or GPOS table.
     */
    getTable: function(create) {
        var layout = this.font.tables[this.tableName];
        if (!layout && create) {
            layout = this.font.tables[this.tableName] = this.createDefaultTable();
        }
        return layout;
    },

    /**
     * Returns all scripts in the substitution table.
     * @instance
     * @return {Array}
     */
    getScriptNames: function() {
        var layout = this.getTable();
        if (!layout) { return []; }
        return layout.scripts.map(function(script) {
            return script.tag;
        });
    },

    /**
     * Returns the best bet for a script name.
     * Returns 'DFLT' if it exists.
     * If not, returns 'latn' if it exists.
     * If neither exist, returns undefined.
     */
    getDefaultScriptName: function() {
        var layout = this.getTable();
        if (!layout) { return; }
        var hasLatn = false;
        for (var i = 0; i < layout.scripts.length; i++) {
            var name = layout.scripts[i].tag;
            if (name === 'DFLT') { return name; }
            if (name === 'latn') { hasLatn = true; }
        }
        if (hasLatn) { return 'latn'; }
    },

    /**
     * Returns all LangSysRecords in the given script.
     * @instance
     * @param {string} [script='DFLT']
     * @param {boolean} create - forces the creation of this script table if it doesn't exist.
     * @return {Object} An object with tag and script properties.
     */
    getScriptTable: function(script, create) {
        var layout = this.getTable(create);
        if (layout) {
            script = script || 'DFLT';
            var scripts = layout.scripts;
            var pos = searchTag(layout.scripts, script);
            if (pos >= 0) {
                return scripts[pos].script;
            } else if (create) {
                var scr = {
                    tag: script,
                    script: {
                        defaultLangSys: {reserved: 0, reqFeatureIndex: 0xffff, featureIndexes: []},
                        langSysRecords: []
                    }
                };
                scripts.splice(-1 - pos, 0, scr);
                return scr.script;
            }
        }
    },

    /**
     * Returns a language system table
     * @instance
     * @param {string} [script='DFLT']
     * @param {string} [language='dlft']
     * @param {boolean} create - forces the creation of this langSysTable if it doesn't exist.
     * @return {Object}
     */
    getLangSysTable: function(script, language, create) {
        var scriptTable = this.getScriptTable(script, create);
        if (scriptTable) {
            if (!language || language === 'dflt' || language === 'DFLT') {
                return scriptTable.defaultLangSys;
            }
            var pos = searchTag(scriptTable.langSysRecords, language);
            if (pos >= 0) {
                return scriptTable.langSysRecords[pos].langSys;
            } else if (create) {
                var langSysRecord = {
                    tag: language,
                    langSys: {reserved: 0, reqFeatureIndex: 0xffff, featureIndexes: []}
                };
                scriptTable.langSysRecords.splice(-1 - pos, 0, langSysRecord);
                return langSysRecord.langSys;
            }
        }
    },

    /**
     * Get a specific feature table.
     * @instance
     * @param {string} [script='DFLT']
     * @param {string} [language='dlft']
     * @param {string} feature - One of the codes listed at https://www.microsoft.com/typography/OTSPEC/featurelist.htm
     * @param {boolean} create - forces the creation of the feature table if it doesn't exist.
     * @return {Object}
     */
    getFeatureTable: function(script, language, feature, create) {
        var langSysTable = this.getLangSysTable(script, language, create);
        if (langSysTable) {
            var featureRecord;
            var featIndexes = langSysTable.featureIndexes;
            var allFeatures = this.font.tables[this.tableName].features;
            // The FeatureIndex array of indices is in arbitrary order,
            // even if allFeatures is sorted alphabetically by feature tag.
            for (var i = 0; i < featIndexes.length; i++) {
                featureRecord = allFeatures[featIndexes[i]];
                if (featureRecord.tag === feature) {
                    return featureRecord.feature;
                }
            }
            if (create) {
                var index = allFeatures.length;
                // Automatic ordering of features would require to shift feature indexes in the script list.
                check.assert(index === 0 || feature >= allFeatures[index - 1].tag, 'Features must be added in alphabetical order.');
                featureRecord = {
                    tag: feature,
                    feature: { params: 0, lookupListIndexes: [] }
                };
                allFeatures.push(featureRecord);
                featIndexes.push(index);
                return featureRecord.feature;
            }
        }
    },

    /**
     * Get the lookup tables of a given type for a script/language/feature.
     * @instance
     * @param {string} [script='DFLT']
     * @param {string} [language='dlft']
     * @param {string} feature - 4-letter feature code
     * @param {number} lookupType - 1 to 9
     * @param {boolean} create - forces the creation of the lookup table if it doesn't exist, with no subtables.
     * @return {Object[]}
     */
    getLookupTables: function(script, language, feature, lookupType, create) {
        var featureTable = this.getFeatureTable(script, language, feature, create);
        var tables = [];
        if (featureTable) {
            var lookupTable;
            var lookupListIndexes = featureTable.lookupListIndexes;
            var allLookups = this.font.tables[this.tableName].lookups;
            // lookupListIndexes are in no particular order, so use naive search.
            for (var i = 0; i < lookupListIndexes.length; i++) {
                lookupTable = allLookups[lookupListIndexes[i]];
                if (lookupTable.lookupType === lookupType) {
                    tables.push(lookupTable);
                }
            }
            if (tables.length === 0 && create) {
                lookupTable = {
                    lookupType: lookupType,
                    lookupFlag: 0,
                    subtables: [],
                    markFilteringSet: undefined
                };
                var index = allLookups.length;
                allLookups.push(lookupTable);
                lookupListIndexes.push(index);
                return [lookupTable];
            }
        }
        return tables;
    },

    /**
     * Find a glyph in a class definition table
     * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#class-definition-table
     * @param {object} classDefTable - an OpenType Layout class definition table
     * @param {number} glyphIndex - the index of the glyph to find
     * @returns {number} -1 if not found
     */
    getGlyphClass: function(classDefTable, glyphIndex) {
        switch (classDefTable.format) {
            case 1:
                if (classDefTable.startGlyph <= glyphIndex && glyphIndex < classDefTable.startGlyph + classDefTable.classes.length) {
                    return classDefTable.classes[glyphIndex - classDefTable.startGlyph];
                }
                return 0;
            case 2:
                var range = searchRange(classDefTable.ranges, glyphIndex);
                return range ? range.classId : 0;
        }
    },

    /**
     * Find a glyph in a coverage table
     * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#coverage-table
     * @param {object} coverageTable - an OpenType Layout coverage table
     * @param {number} glyphIndex - the index of the glyph to find
     * @returns {number} -1 if not found
     */
    getCoverageIndex: function(coverageTable, glyphIndex) {
        switch (coverageTable.format) {
            case 1:
                var index = binSearch(coverageTable.glyphs, glyphIndex);
                return index >= 0 ? index : -1;
            case 2:
                var range = searchRange(coverageTable.ranges, glyphIndex);
                return range ? range.index + glyphIndex - range.start : -1;
        }
    },

    /**
     * Returns the list of glyph indexes of a coverage table.
     * Format 1: the list is stored raw
     * Format 2: compact list as range records.
     * @instance
     * @param  {Object} coverageTable
     * @return {Array}
     */
    expandCoverage: function(coverageTable) {
        if (coverageTable.format === 1) {
            return coverageTable.glyphs;
        } else {
            var glyphs = [];
            var ranges = coverageTable.ranges;
            for (var i = 0; i < ranges.length; i++) {
                var range = ranges[i];
                var start = range.start;
                var end = range.end;
                for (var j = start; j <= end; j++) {
                    glyphs.push(j);
                }
            }
            return glyphs;
        }
    }

};

// The Position object provides utility methods to manipulate

/**
 * @exports opentype.Position
 * @class
 * @extends opentype.Layout
 * @param {opentype.Font}
 * @constructor
 */
function Position(font) {
    Layout.call(this, font, 'gpos');
}

Position.prototype = Layout.prototype;

/**
 * Init some data for faster and easier access later.
 */
Position.prototype.init = function() {
    var script = this.getDefaultScriptName();
    this.defaultKerningTables = this.getKerningTables(script);
};

/**
 * Find a glyph pair in a list of lookup tables of type 2 and retrieve the xAdvance kerning value.
 *
 * @param {integer} leftIndex - left glyph index
 * @param {integer} rightIndex - right glyph index
 * @returns {integer}
 */
Position.prototype.getKerningValue = function(kerningLookups, leftIndex, rightIndex) {
    for (var i = 0; i < kerningLookups.length; i++) {
        var subtables = kerningLookups[i].subtables;
        for (var j = 0; j < subtables.length; j++) {
            var subtable = subtables[j];
            var covIndex = this.getCoverageIndex(subtable.coverage, leftIndex);
            if (covIndex < 0) { continue; }
            switch (subtable.posFormat) {
                case 1:
                    // Search Pair Adjustment Positioning Format 1
                    var pairSet = subtable.pairSets[covIndex];
                    for (var k = 0; k < pairSet.length; k++) {
                        var pair = pairSet[k];
                        if (pair.secondGlyph === rightIndex) {
                            return pair.value1 && pair.value1.xAdvance || 0;
                        }
                    }
                    break;      // left glyph found, not right glyph - try next subtable
                case 2:
                    // Search Pair Adjustment Positioning Format 2
                    var class1 = this.getGlyphClass(subtable.classDef1, leftIndex);
                    var class2 = this.getGlyphClass(subtable.classDef2, rightIndex);
                    var pair$1 = subtable.classRecords[class1][class2];
                    return pair$1.value1 && pair$1.value1.xAdvance || 0;
            }
        }
    }
    return 0;
};

/**
 * List all kerning lookup tables.
 *
 * @param {string} [script='DFLT'] - use font.position.getDefaultScriptName() for a better default value
 * @param {string} [language='dflt']
 * @return {object[]} The list of kerning lookup tables (may be empty), or undefined if there is no GPOS table (and we should use the kern table)
 */
Position.prototype.getKerningTables = function(script, language) {
    if (this.font.tables.gpos) {
        return this.getLookupTables(script, language, 'kern', 2);
    }
};

// The Substitution object provides utility methods to manipulate

/**
 * @exports opentype.Substitution
 * @class
 * @extends opentype.Layout
 * @param {opentype.Font}
 * @constructor
 */
function Substitution(font) {
    Layout.call(this, font, 'gsub');
}

// Check if 2 arrays of primitives are equal.
function arraysEqual(ar1, ar2) {
    var n = ar1.length;
    if (n !== ar2.length) { return false; }
    for (var i = 0; i < n; i++) {
        if (ar1[i] !== ar2[i]) { return false; }
    }
    return true;
}

// Find the first subtable of a lookup table in a particular format.
function getSubstFormat(lookupTable, format, defaultSubtable) {
    var subtables = lookupTable.subtables;
    for (var i = 0; i < subtables.length; i++) {
        var subtable = subtables[i];
        if (subtable.substFormat === format) {
            return subtable;
        }
    }
    if (defaultSubtable) {
        subtables.push(defaultSubtable);
        return defaultSubtable;
    }
    return undefined;
}

Substitution.prototype = Layout.prototype;

/**
 * Create a default GSUB table.
 * @return {Object} gsub - The GSUB table.
 */
Substitution.prototype.createDefaultTable = function() {
    // Generate a default empty GSUB table with just a DFLT script and dflt lang sys.
    return {
        version: 1,
        scripts: [{
            tag: 'DFLT',
            script: {
                defaultLangSys: { reserved: 0, reqFeatureIndex: 0xffff, featureIndexes: [] },
                langSysRecords: []
            }
        }],
        features: [],
        lookups: []
    };
};

/**
 * List all single substitutions (lookup type 1) for a given script, language, and feature.
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @param {string} feature - 4-character feature name ('aalt', 'salt', 'ss01'...)
 * @return {Array} substitutions - The list of substitutions.
 */
Substitution.prototype.getSingle = function(feature, script, language) {
    var substitutions = [];
    var lookupTables = this.getLookupTables(script, language, feature, 1);
    for (var idx = 0; idx < lookupTables.length; idx++) {
        var subtables = lookupTables[idx].subtables;
        for (var i = 0; i < subtables.length; i++) {
            var subtable = subtables[i];
            var glyphs = this.expandCoverage(subtable.coverage);
            var j = (void 0);
            if (subtable.substFormat === 1) {
                var delta = subtable.deltaGlyphId;
                for (j = 0; j < glyphs.length; j++) {
                    var glyph = glyphs[j];
                    substitutions.push({ sub: glyph, by: glyph + delta });
                }
            } else {
                var substitute = subtable.substitute;
                for (j = 0; j < glyphs.length; j++) {
                    substitutions.push({ sub: glyphs[j], by: substitute[j] });
                }
            }
        }
    }
    return substitutions;
};

/**
 * List all multiple substitutions (lookup type 2) for a given script, language, and feature.
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @param {string} feature - 4-character feature name ('ccmp', 'stch')
 * @return {Array} substitutions - The list of substitutions.
 */
Substitution.prototype.getMultiple = function(feature, script, language) {
    var substitutions = [];
    var lookupTables = this.getLookupTables(script, language, feature, 2);
    for (var idx = 0; idx < lookupTables.length; idx++) {
        var subtables = lookupTables[idx].subtables;
        for (var i = 0; i < subtables.length; i++) {
            var subtable = subtables[i];
            var glyphs = this.expandCoverage(subtable.coverage);
            var j = (void 0);

            for (j = 0; j < glyphs.length; j++) {
                var glyph = glyphs[j];
                var replacements = subtable.sequences[j];
                substitutions.push({ sub: glyph, by: replacements });
            }
        }
    }
    return substitutions;
};

/**
 * List all alternates (lookup type 3) for a given script, language, and feature.
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @param {string} feature - 4-character feature name ('aalt', 'salt'...)
 * @return {Array} alternates - The list of alternates
 */
Substitution.prototype.getAlternates = function(feature, script, language) {
    var alternates = [];
    var lookupTables = this.getLookupTables(script, language, feature, 3);
    for (var idx = 0; idx < lookupTables.length; idx++) {
        var subtables = lookupTables[idx].subtables;
        for (var i = 0; i < subtables.length; i++) {
            var subtable = subtables[i];
            var glyphs = this.expandCoverage(subtable.coverage);
            var alternateSets = subtable.alternateSets;
            for (var j = 0; j < glyphs.length; j++) {
                alternates.push({ sub: glyphs[j], by: alternateSets[j] });
            }
        }
    }
    return alternates;
};

/**
 * List all ligatures (lookup type 4) for a given script, language, and feature.
 * The result is an array of ligature objects like { sub: [ids], by: id }
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @return {Array} ligatures - The list of ligatures.
 */
Substitution.prototype.getLigatures = function(feature, script, language) {
    var ligatures = [];
    var lookupTables = this.getLookupTables(script, language, feature, 4);
    for (var idx = 0; idx < lookupTables.length; idx++) {
        var subtables = lookupTables[idx].subtables;
        for (var i = 0; i < subtables.length; i++) {
            var subtable = subtables[i];
            var glyphs = this.expandCoverage(subtable.coverage);
            var ligatureSets = subtable.ligatureSets;
            for (var j = 0; j < glyphs.length; j++) {
                var startGlyph = glyphs[j];
                var ligSet = ligatureSets[j];
                for (var k = 0; k < ligSet.length; k++) {
                    var lig = ligSet[k];
                    ligatures.push({
                        sub: [startGlyph].concat(lig.components),
                        by: lig.ligGlyph
                    });
                }
            }
        }
    }
    return ligatures;
};

/**
 * Add or modify a single substitution (lookup type 1)
 * Format 2, more flexible, is always used.
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {Object} substitution - { sub: id, by: id } (format 1 is not supported)
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */
Substitution.prototype.addSingle = function(feature, substitution, script, language) {
    var lookupTable = this.getLookupTables(script, language, feature, 1, true)[0];
    var subtable = getSubstFormat(lookupTable, 2, {                // lookup type 1 subtable, format 2, coverage format 1
        substFormat: 2,
        coverage: {format: 1, glyphs: []},
        substitute: []
    });
    check.assert(subtable.coverage.format === 1, 'Single: unable to modify coverage table format ' + subtable.coverage.format);
    var coverageGlyph = substitution.sub;
    var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
    if (pos < 0) {
        pos = -1 - pos;
        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
        subtable.substitute.splice(pos, 0, 0);
    }
    subtable.substitute[pos] = substitution.by;
};

/**
 * Add or modify a multiple substitution (lookup type 2)
 * @param {string} feature - 4-letter feature name ('ccmp', 'stch')
 * @param {Object} substitution - { sub: id, by: [id] } for format 2.
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */
Substitution.prototype.addMultiple = function(feature, substitution, script, language) {
    check.assert(substitution.by instanceof Array && substitution.by.length > 1, 'Multiple: "by" must be an array of two or more ids');
    var lookupTable = this.getLookupTables(script, language, feature, 2, true)[0];
    var subtable = getSubstFormat(lookupTable, 1, {                // lookup type 2 subtable, format 1, coverage format 1
        substFormat: 1,
        coverage: {format: 1, glyphs: []},
        sequences: []
    });
    check.assert(subtable.coverage.format === 1, 'Multiple: unable to modify coverage table format ' + subtable.coverage.format);
    var coverageGlyph = substitution.sub;
    var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
    if (pos < 0) {
        pos = -1 - pos;
        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
        subtable.sequences.splice(pos, 0, 0);
    }
    subtable.sequences[pos] = substitution.by;
};

/**
 * Add or modify an alternate substitution (lookup type 3)
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {Object} substitution - { sub: id, by: [ids] }
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */
Substitution.prototype.addAlternate = function(feature, substitution, script, language) {
    var lookupTable = this.getLookupTables(script, language, feature, 3, true)[0];
    var subtable = getSubstFormat(lookupTable, 1, {                // lookup type 3 subtable, format 1, coverage format 1
        substFormat: 1,
        coverage: {format: 1, glyphs: []},
        alternateSets: []
    });
    check.assert(subtable.coverage.format === 1, 'Alternate: unable to modify coverage table format ' + subtable.coverage.format);
    var coverageGlyph = substitution.sub;
    var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
    if (pos < 0) {
        pos = -1 - pos;
        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
        subtable.alternateSets.splice(pos, 0, 0);
    }
    subtable.alternateSets[pos] = substitution.by;
};

/**
 * Add a ligature (lookup type 4)
 * Ligatures with more components must be stored ahead of those with fewer components in order to be found
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {Object} ligature - { sub: [ids], by: id }
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */
Substitution.prototype.addLigature = function(feature, ligature, script, language) {
    var lookupTable = this.getLookupTables(script, language, feature, 4, true)[0];
    var subtable = lookupTable.subtables[0];
    if (!subtable) {
        subtable = {                // lookup type 4 subtable, format 1, coverage format 1
            substFormat: 1,
            coverage: { format: 1, glyphs: [] },
            ligatureSets: []
        };
        lookupTable.subtables[0] = subtable;
    }
    check.assert(subtable.coverage.format === 1, 'Ligature: unable to modify coverage table format ' + subtable.coverage.format);
    var coverageGlyph = ligature.sub[0];
    var ligComponents = ligature.sub.slice(1);
    var ligatureTable = {
        ligGlyph: ligature.by,
        components: ligComponents
    };
    var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
    if (pos >= 0) {
        // ligatureSet already exists
        var ligatureSet = subtable.ligatureSets[pos];
        for (var i = 0; i < ligatureSet.length; i++) {
            // If ligature already exists, return.
            if (arraysEqual(ligatureSet[i].components, ligComponents)) {
                return;
            }
        }
        // ligature does not exist: add it.
        ligatureSet.push(ligatureTable);
    } else {
        // Create a new ligatureSet and add coverage for the first glyph.
        pos = -1 - pos;
        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
        subtable.ligatureSets.splice(pos, 0, [ligatureTable]);
    }
};

/**
 * List all feature data for a given script and language.
 * @param {string} feature - 4-letter feature name
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @return {Array} substitutions - The list of substitutions.
 */
Substitution.prototype.getFeature = function(feature, script, language) {
    if (/ss\d\d/.test(feature)) {
        // ss01 - ss20
        return this.getSingle(feature, script, language);
    }
    switch (feature) {
        case 'aalt':
        case 'salt':
            return this.getSingle(feature, script, language)
                    .concat(this.getAlternates(feature, script, language));
        case 'dlig':
        case 'liga':
        case 'rlig':
            return this.getLigatures(feature, script, language);
        case 'ccmp':
            return this.getMultiple(feature, script, language)
                .concat(this.getLigatures(feature, script, language));
        case 'stch':
            return this.getMultiple(feature, script, language);
    }
    return undefined;
};

/**
 * Add a substitution to a feature for a given script and language.
 * @param {string} feature - 4-letter feature name
 * @param {Object} sub - the substitution to add (an object like { sub: id or [ids], by: id or [ids] })
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */
Substitution.prototype.add = function(feature, sub, script, language) {
    if (/ss\d\d/.test(feature)) {
        // ss01 - ss20
        return this.addSingle(feature, sub, script, language);
    }
    switch (feature) {
        case 'aalt':
        case 'salt':
            if (typeof sub.by === 'number') {
                return this.addSingle(feature, sub, script, language);
            }
            return this.addAlternate(feature, sub, script, language);
        case 'dlig':
        case 'liga':
        case 'rlig':
            return this.addLigature(feature, sub, script, language);
        case 'ccmp':
            if (sub.by instanceof Array) {
                return this.addMultiple(feature, sub, script, language);
            }
            return this.addLigature(feature, sub, script, language);
    }
    return undefined;
};

function isBrowser() {
    return typeof window !== 'undefined';
}

function nodeBufferToArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }

    return ab;
}

function arrayBufferToNodeBuffer(ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }

    return buffer;
}

function checkArgument(expression, message) {
    if (!expression) {
        throw message;
    }
}

// The `glyf` table describes the glyphs in TrueType outline format.

// Parse the coordinate data for a glyph.
function parseGlyphCoordinate(p, flag, previousValue, shortVectorBitMask, sameBitMask) {
    var v;
    if ((flag & shortVectorBitMask) > 0) {
        // The coordinate is 1 byte long.
        v = p.parseByte();
        // The `same` bit is re-used for short values to signify the sign of the value.
        if ((flag & sameBitMask) === 0) {
            v = -v;
        }

        v = previousValue + v;
    } else {
        //  The coordinate is 2 bytes long.
        // If the `same` bit is set, the coordinate is the same as the previous coordinate.
        if ((flag & sameBitMask) > 0) {
            v = previousValue;
        } else {
            // Parse the coordinate as a signed 16-bit delta value.
            v = previousValue + p.parseShort();
        }
    }

    return v;
}

// Parse a TrueType glyph.
function parseGlyph(glyph, data, start) {
    var p = new parse.Parser(data, start);
    glyph.numberOfContours = p.parseShort();
    glyph._xMin = p.parseShort();
    glyph._yMin = p.parseShort();
    glyph._xMax = p.parseShort();
    glyph._yMax = p.parseShort();
    var flags;
    var flag;

    if (glyph.numberOfContours > 0) {
        // This glyph is not a composite.
        var endPointIndices = glyph.endPointIndices = [];
        for (var i = 0; i < glyph.numberOfContours; i += 1) {
            endPointIndices.push(p.parseUShort());
        }

        glyph.instructionLength = p.parseUShort();
        glyph.instructions = [];
        for (var i$1 = 0; i$1 < glyph.instructionLength; i$1 += 1) {
            glyph.instructions.push(p.parseByte());
        }

        var numberOfCoordinates = endPointIndices[endPointIndices.length - 1] + 1;
        flags = [];
        for (var i$2 = 0; i$2 < numberOfCoordinates; i$2 += 1) {
            flag = p.parseByte();
            flags.push(flag);
            // If bit 3 is set, we repeat this flag n times, where n is the next byte.
            if ((flag & 8) > 0) {
                var repeatCount = p.parseByte();
                for (var j = 0; j < repeatCount; j += 1) {
                    flags.push(flag);
                    i$2 += 1;
                }
            }
        }

        check.argument(flags.length === numberOfCoordinates, 'Bad flags.');

        if (endPointIndices.length > 0) {
            var points = [];
            var point;
            // X/Y coordinates are relative to the previous point, except for the first point which is relative to 0,0.
            if (numberOfCoordinates > 0) {
                for (var i$3 = 0; i$3 < numberOfCoordinates; i$3 += 1) {
                    flag = flags[i$3];
                    point = {};
                    point.onCurve = !!(flag & 1);
                    point.lastPointOfContour = endPointIndices.indexOf(i$3) >= 0;
                    points.push(point);
                }

                var px = 0;
                for (var i$4 = 0; i$4 < numberOfCoordinates; i$4 += 1) {
                    flag = flags[i$4];
                    point = points[i$4];
                    point.x = parseGlyphCoordinate(p, flag, px, 2, 16);
                    px = point.x;
                }

                var py = 0;
                for (var i$5 = 0; i$5 < numberOfCoordinates; i$5 += 1) {
                    flag = flags[i$5];
                    point = points[i$5];
                    point.y = parseGlyphCoordinate(p, flag, py, 4, 32);
                    py = point.y;
                }
            }

            glyph.points = points;
        } else {
            glyph.points = [];
        }
    } else if (glyph.numberOfContours === 0) {
        glyph.points = [];
    } else {
        glyph.isComposite = true;
        glyph.points = [];
        glyph.components = [];
        var moreComponents = true;
        while (moreComponents) {
            flags = p.parseUShort();
            var component = {
                glyphIndex: p.parseUShort(),
                xScale: 1,
                scale01: 0,
                scale10: 0,
                yScale: 1,
                dx: 0,
                dy: 0
            };
            if ((flags & 1) > 0) {
                // The arguments are words
                if ((flags & 2) > 0) {
                    // values are offset
                    component.dx = p.parseShort();
                    component.dy = p.parseShort();
                } else {
                    // values are matched points
                    component.matchedPoints = [p.parseUShort(), p.parseUShort()];
                }

            } else {
                // The arguments are bytes
                if ((flags & 2) > 0) {
                    // values are offset
                    component.dx = p.parseChar();
                    component.dy = p.parseChar();
                } else {
                    // values are matched points
                    component.matchedPoints = [p.parseByte(), p.parseByte()];
                }
            }

            if ((flags & 8) > 0) {
                // We have a scale
                component.xScale = component.yScale = p.parseF2Dot14();
            } else if ((flags & 64) > 0) {
                // We have an X / Y scale
                component.xScale = p.parseF2Dot14();
                component.yScale = p.parseF2Dot14();
            } else if ((flags & 128) > 0) {
                // We have a 2x2 transformation
                component.xScale = p.parseF2Dot14();
                component.scale01 = p.parseF2Dot14();
                component.scale10 = p.parseF2Dot14();
                component.yScale = p.parseF2Dot14();
            }

            glyph.components.push(component);
            moreComponents = !!(flags & 32);
        }
        if (flags & 0x100) {
            // We have instructions
            glyph.instructionLength = p.parseUShort();
            glyph.instructions = [];
            for (var i$6 = 0; i$6 < glyph.instructionLength; i$6 += 1) {
                glyph.instructions.push(p.parseByte());
            }
        }
    }
}

// Transform an array of points and return a new array.
function transformPoints(points, transform) {
    var newPoints = [];
    for (var i = 0; i < points.length; i += 1) {
        var pt = points[i];
        var newPt = {
            x: transform.xScale * pt.x + transform.scale01 * pt.y + transform.dx,
            y: transform.scale10 * pt.x + transform.yScale * pt.y + transform.dy,
            onCurve: pt.onCurve,
            lastPointOfContour: pt.lastPointOfContour
        };
        newPoints.push(newPt);
    }

    return newPoints;
}

function getContours(points) {
    var contours = [];
    var currentContour = [];
    for (var i = 0; i < points.length; i += 1) {
        var pt = points[i];
        currentContour.push(pt);
        if (pt.lastPointOfContour) {
            contours.push(currentContour);
            currentContour = [];
        }
    }

    check.argument(currentContour.length === 0, 'There are still points left in the current contour.');
    return contours;
}

// Convert the TrueType glyph outline to a Path.
function getPath(points) {
    var p = new Path();
    if (!points) {
        return p;
    }

    var contours = getContours(points);

    for (var contourIndex = 0; contourIndex < contours.length; ++contourIndex) {
        var contour = contours[contourIndex];

        var prev = null;
        var curr = contour[contour.length - 1];
        var next = contour[0];

        if (curr.onCurve) {
            p.moveTo(curr.x, curr.y);
        } else {
            if (next.onCurve) {
                p.moveTo(next.x, next.y);
            } else {
                // If both first and last points are off-curve, start at their middle.
                var start = {x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5};
                p.moveTo(start.x, start.y);
            }
        }

        for (var i = 0; i < contour.length; ++i) {
            prev = curr;
            curr = next;
            next = contour[(i + 1) % contour.length];

            if (curr.onCurve) {
                // This is a straight line.
                p.lineTo(curr.x, curr.y);
            } else {
                var next2 = next;

                if (!prev.onCurve) {
                    ({ x: (curr.x + prev.x) * 0.5, y: (curr.y + prev.y) * 0.5 });
                }

                if (!next.onCurve) {
                    next2 = { x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5 };
                }

                p.quadraticCurveTo(curr.x, curr.y, next2.x, next2.y);
            }
        }

        p.closePath();
    }
    return p;
}

function buildPath(glyphs, glyph) {
    if (glyph.isComposite) {
        for (var j = 0; j < glyph.components.length; j += 1) {
            var component = glyph.components[j];
            var componentGlyph = glyphs.get(component.glyphIndex);
            // Force the ttfGlyphLoader to parse the glyph.
            componentGlyph.getPath();
            if (componentGlyph.points) {
                var transformedPoints = (void 0);
                if (component.matchedPoints === undefined) {
                    // component positioned by offset
                    transformedPoints = transformPoints(componentGlyph.points, component);
                } else {
                    // component positioned by matched points
                    if ((component.matchedPoints[0] > glyph.points.length - 1) ||
                        (component.matchedPoints[1] > componentGlyph.points.length - 1)) {
                        throw Error('Matched points out of range in ' + glyph.name);
                    }
                    var firstPt = glyph.points[component.matchedPoints[0]];
                    var secondPt = componentGlyph.points[component.matchedPoints[1]];
                    var transform = {
                        xScale: component.xScale, scale01: component.scale01,
                        scale10: component.scale10, yScale: component.yScale,
                        dx: 0, dy: 0
                    };
                    secondPt = transformPoints([secondPt], transform)[0];
                    transform.dx = firstPt.x - secondPt.x;
                    transform.dy = firstPt.y - secondPt.y;
                    transformedPoints = transformPoints(componentGlyph.points, transform);
                }
                glyph.points = glyph.points.concat(transformedPoints);
            }
        }
    }

    return getPath(glyph.points);
}

function parseGlyfTableAll(data, start, loca, font) {
    var glyphs = new glyphset.GlyphSet(font);

    // The last element of the loca table is invalid.
    for (var i = 0; i < loca.length - 1; i += 1) {
        var offset = loca[i];
        var nextOffset = loca[i + 1];
        if (offset !== nextOffset) {
            glyphs.push(i, glyphset.ttfGlyphLoader(font, i, parseGlyph, data, start + offset, buildPath));
        } else {
            glyphs.push(i, glyphset.glyphLoader(font, i));
        }
    }

    return glyphs;
}

function parseGlyfTableOnLowMemory(data, start, loca, font) {
    var glyphs = new glyphset.GlyphSet(font);

    font._push = function(i) {
        var offset = loca[i];
        var nextOffset = loca[i + 1];
        if (offset !== nextOffset) {
            glyphs.push(i, glyphset.ttfGlyphLoader(font, i, parseGlyph, data, start + offset, buildPath));
        } else {
            glyphs.push(i, glyphset.glyphLoader(font, i));
        }
    };

    return glyphs;
}

// Parse all the glyphs according to the offsets from the `loca` table.
function parseGlyfTable(data, start, loca, font, opt) {
    if (opt.lowMemory)
        { return parseGlyfTableOnLowMemory(data, start, loca, font); }
    else
        { return parseGlyfTableAll(data, start, loca, font); }
}

var glyf = { getPath: getPath, parse: parseGlyfTable};

/* A TrueType font hinting interpreter.
*
* (c) 2017 Axel Kittenberger
*
* This interpreter has been implemented according to this documentation:
* https://developer.apple.com/fonts/TrueType-Reference-Manual/RM05/Chap5.html
*
* According to the documentation F24DOT6 values are used for pixels.
* That means calculation is 1/64 pixel accurate and uses integer operations.
* However, Javascript has floating point operations by default and only
* those are available. One could make a case to simulate the 1/64 accuracy
* exactly by truncating after every division operation
* (for example with << 0) to get pixel exactly results as other TrueType
* implementations. It may make sense since some fonts are pixel optimized
* by hand using DELTAP instructions. The current implementation doesn't
* and rather uses full floating point precision.
*
* xScale, yScale and rotation is currently ignored.
*
* A few non-trivial instructions are missing as I didn't encounter yet
* a font that used them to test a possible implementation.
*
* Some fonts seem to use undocumented features regarding the twilight zone.
* Only some of them are implemented as they were encountered.
*
* The exports.DEBUG statements are removed on the minified distribution file.
*/

var instructionTable;
var exec;
var execGlyph;
var execComponent;

/*
* Creates a hinting object.
*
* There ought to be exactly one
* for each truetype font that is used for hinting.
*/
function Hinting(font) {
    // the font this hinting object is for
    this.font = font;

    this.getCommands = function (hPoints) {
        return glyf.getPath(hPoints).commands;
    };

    // cached states
    this._fpgmState  =
    this._prepState  =
        undefined;

    // errorState
    // 0 ... all okay
    // 1 ... had an error in a glyf,
    //       continue working but stop spamming
    //       the console
    // 2 ... error at prep, stop hinting at this ppem
    // 3 ... error at fpeg, stop hinting for this font at all
    this._errorState = 0;
}

/*
* Not rounding.
*/
function roundOff(v) {
    return v;
}

/*
* Rounding to grid.
*/
function roundToGrid(v) {
    //Rounding in TT is supposed to "symmetrical around zero"
    return Math.sign(v) * Math.round(Math.abs(v));
}

/*
* Rounding to double grid.
*/
function roundToDoubleGrid(v) {
    return Math.sign(v) * Math.round(Math.abs(v * 2)) / 2;
}

/*
* Rounding to half grid.
*/
function roundToHalfGrid(v) {
    return Math.sign(v) * (Math.round(Math.abs(v) + 0.5) - 0.5);
}

/*
* Rounding to up to grid.
*/
function roundUpToGrid(v) {
    return Math.sign(v) * Math.ceil(Math.abs(v));
}

/*
* Rounding to down to grid.
*/
function roundDownToGrid(v) {
    return Math.sign(v) * Math.floor(Math.abs(v));
}

/*
* Super rounding.
*/
var roundSuper = function (v) {
    var period = this.srPeriod;
    var phase = this.srPhase;
    var threshold = this.srThreshold;
    var sign = 1;

    if (v < 0) {
        v = -v;
        sign = -1;
    }

    v += threshold - phase;

    v = Math.trunc(v / period) * period;

    v += phase;

    // according to http://xgridfit.sourceforge.net/round.html
    if (v < 0) { return phase * sign; }

    return v * sign;
};

/*
* Unit vector of x-axis.
*/
var xUnitVector = {
    x: 1,

    y: 0,

    axis: 'x',

    // Gets the projected distance between two points.
    // o1/o2 ... if true, respective original position is used.
    distance: function (p1, p2, o1, o2) {
        return (o1 ? p1.xo : p1.x) - (o2 ? p2.xo : p2.x);
    },

    // Moves point p so the moved position has the same relative
    // position to the moved positions of rp1 and rp2 than the
    // original positions had.
    //
    // See APPENDIX on INTERPOLATE at the bottom of this file.
    interpolate: function (p, rp1, rp2, pv) {
        var do1;
        var do2;
        var doa1;
        var doa2;
        var dm1;
        var dm2;
        var dt;

        if (!pv || pv === this) {
            do1 = p.xo - rp1.xo;
            do2 = p.xo - rp2.xo;
            dm1 = rp1.x - rp1.xo;
            dm2 = rp2.x - rp2.xo;
            doa1 = Math.abs(do1);
            doa2 = Math.abs(do2);
            dt = doa1 + doa2;

            if (dt === 0) {
                p.x = p.xo + (dm1 + dm2) / 2;
                return;
            }

            p.x = p.xo + (dm1 * doa2 + dm2 * doa1) / dt;
            return;
        }

        do1 = pv.distance(p, rp1, true, true);
        do2 = pv.distance(p, rp2, true, true);
        dm1 = pv.distance(rp1, rp1, false, true);
        dm2 = pv.distance(rp2, rp2, false, true);
        doa1 = Math.abs(do1);
        doa2 = Math.abs(do2);
        dt = doa1 + doa2;

        if (dt === 0) {
            xUnitVector.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
            return;
        }

        xUnitVector.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
    },

    // Slope of line normal to this
    normalSlope: Number.NEGATIVE_INFINITY,

    // Sets the point 'p' relative to point 'rp'
    // by the distance 'd'.
    //
    // See APPENDIX on SETRELATIVE at the bottom of this file.
    //
    // p   ... point to set
    // rp  ... reference point
    // d   ... distance on projection vector
    // pv  ... projection vector (undefined = this)
    // org ... if true, uses the original position of rp as reference.
    setRelative: function (p, rp, d, pv, org) {
        if (!pv || pv === this) {
            p.x = (org ? rp.xo : rp.x) + d;
            return;
        }

        var rpx = org ? rp.xo : rp.x;
        var rpy = org ? rp.yo : rp.y;
        var rpdx = rpx + d * pv.x;
        var rpdy = rpy + d * pv.y;

        p.x = rpdx + (p.y - rpdy) / pv.normalSlope;
    },

    // Slope of vector line.
    slope: 0,

    // Touches the point p.
    touch: function (p) {
        p.xTouched = true;
    },

    // Tests if a point p is touched.
    touched: function (p) {
        return p.xTouched;
    },

    // Untouches the point p.
    untouch: function (p) {
        p.xTouched = false;
    }
};

/*
* Unit vector of y-axis.
*/
var yUnitVector = {
    x: 0,

    y: 1,

    axis: 'y',

    // Gets the projected distance between two points.
    // o1/o2 ... if true, respective original position is used.
    distance: function (p1, p2, o1, o2) {
        return (o1 ? p1.yo : p1.y) - (o2 ? p2.yo : p2.y);
    },

    // Moves point p so the moved position has the same relative
    // position to the moved positions of rp1 and rp2 than the
    // original positions had.
    //
    // See APPENDIX on INTERPOLATE at the bottom of this file.
    interpolate: function (p, rp1, rp2, pv) {
        var do1;
        var do2;
        var doa1;
        var doa2;
        var dm1;
        var dm2;
        var dt;

        if (!pv || pv === this) {
            do1 = p.yo - rp1.yo;
            do2 = p.yo - rp2.yo;
            dm1 = rp1.y - rp1.yo;
            dm2 = rp2.y - rp2.yo;
            doa1 = Math.abs(do1);
            doa2 = Math.abs(do2);
            dt = doa1 + doa2;

            if (dt === 0) {
                p.y = p.yo + (dm1 + dm2) / 2;
                return;
            }

            p.y = p.yo + (dm1 * doa2 + dm2 * doa1) / dt;
            return;
        }

        do1 = pv.distance(p, rp1, true, true);
        do2 = pv.distance(p, rp2, true, true);
        dm1 = pv.distance(rp1, rp1, false, true);
        dm2 = pv.distance(rp2, rp2, false, true);
        doa1 = Math.abs(do1);
        doa2 = Math.abs(do2);
        dt = doa1 + doa2;

        if (dt === 0) {
            yUnitVector.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
            return;
        }

        yUnitVector.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
    },

    // Slope of line normal to this.
    normalSlope: 0,

    // Sets the point 'p' relative to point 'rp'
    // by the distance 'd'
    //
    // See APPENDIX on SETRELATIVE at the bottom of this file.
    //
    // p   ... point to set
    // rp  ... reference point
    // d   ... distance on projection vector
    // pv  ... projection vector (undefined = this)
    // org ... if true, uses the original position of rp as reference.
    setRelative: function (p, rp, d, pv, org) {
        if (!pv || pv === this) {
            p.y = (org ? rp.yo : rp.y) + d;
            return;
        }

        var rpx = org ? rp.xo : rp.x;
        var rpy = org ? rp.yo : rp.y;
        var rpdx = rpx + d * pv.x;
        var rpdy = rpy + d * pv.y;

        p.y = rpdy + pv.normalSlope * (p.x - rpdx);
    },

    // Slope of vector line.
    slope: Number.POSITIVE_INFINITY,

    // Touches the point p.
    touch: function (p) {
        p.yTouched = true;
    },

    // Tests if a point p is touched.
    touched: function (p) {
        return p.yTouched;
    },

    // Untouches the point p.
    untouch: function (p) {
        p.yTouched = false;
    }
};

Object.freeze(xUnitVector);
Object.freeze(yUnitVector);

/*
* Creates a unit vector that is not x- or y-axis.
*/
function UnitVector(x, y) {
    this.x = x;
    this.y = y;
    this.axis = undefined;
    this.slope = y / x;
    this.normalSlope = -x / y;
    Object.freeze(this);
}

/*
* Gets the projected distance between two points.
* o1/o2 ... if true, respective original position is used.
*/
UnitVector.prototype.distance = function(p1, p2, o1, o2) {
    return (
        this.x * xUnitVector.distance(p1, p2, o1, o2) +
        this.y * yUnitVector.distance(p1, p2, o1, o2)
    );
};

/*
* Moves point p so the moved position has the same relative
* position to the moved positions of rp1 and rp2 than the
* original positions had.
*
* See APPENDIX on INTERPOLATE at the bottom of this file.
*/
UnitVector.prototype.interpolate = function(p, rp1, rp2, pv) {
    var dm1;
    var dm2;
    var do1;
    var do2;
    var doa1;
    var doa2;
    var dt;

    do1 = pv.distance(p, rp1, true, true);
    do2 = pv.distance(p, rp2, true, true);
    dm1 = pv.distance(rp1, rp1, false, true);
    dm2 = pv.distance(rp2, rp2, false, true);
    doa1 = Math.abs(do1);
    doa2 = Math.abs(do2);
    dt = doa1 + doa2;

    if (dt === 0) {
        this.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
        return;
    }

    this.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
};

/*
* Sets the point 'p' relative to point 'rp'
* by the distance 'd'
*
* See APPENDIX on SETRELATIVE at the bottom of this file.
*
* p   ...  point to set
* rp  ... reference point
* d   ... distance on projection vector
* pv  ... projection vector (undefined = this)
* org ... if true, uses the original position of rp as reference.
*/
UnitVector.prototype.setRelative = function(p, rp, d, pv, org) {
    pv = pv || this;

    var rpx = org ? rp.xo : rp.x;
    var rpy = org ? rp.yo : rp.y;
    var rpdx = rpx + d * pv.x;
    var rpdy = rpy + d * pv.y;

    var pvns = pv.normalSlope;
    var fvs = this.slope;

    var px = p.x;
    var py = p.y;

    p.x = (fvs * px - pvns * rpdx + rpdy - py) / (fvs - pvns);
    p.y = fvs * (p.x - px) + py;
};

/*
* Touches the point p.
*/
UnitVector.prototype.touch = function(p) {
    p.xTouched = true;
    p.yTouched = true;
};

/*
* Returns a unit vector with x/y coordinates.
*/
function getUnitVector(x, y) {
    var d = Math.sqrt(x * x + y * y);

    x /= d;
    y /= d;

    if (x === 1 && y === 0) { return xUnitVector; }
    else if (x === 0 && y === 1) { return yUnitVector; }
    else { return new UnitVector(x, y); }
}

/*
* Creates a point in the hinting engine.
*/
function HPoint(
    x,
    y,
    lastPointOfContour,
    onCurve
) {
    this.x = this.xo = Math.round(x * 64) / 64; // hinted x value and original x-value
    this.y = this.yo = Math.round(y * 64) / 64; // hinted y value and original y-value

    this.lastPointOfContour = lastPointOfContour;
    this.onCurve = onCurve;
    this.prevPointOnContour = undefined;
    this.nextPointOnContour = undefined;
    this.xTouched = false;
    this.yTouched = false;

    Object.preventExtensions(this);
}

/*
* Returns the next touched point on the contour.
*
* v  ... unit vector to test touch axis.
*/
HPoint.prototype.nextTouched = function(v) {
    var p = this.nextPointOnContour;

    while (!v.touched(p) && p !== this) { p = p.nextPointOnContour; }

    return p;
};

/*
* Returns the previous touched point on the contour
*
* v  ... unit vector to test touch axis.
*/
HPoint.prototype.prevTouched = function(v) {
    var p = this.prevPointOnContour;

    while (!v.touched(p) && p !== this) { p = p.prevPointOnContour; }

    return p;
};

/*
* The zero point.
*/
var HPZero = Object.freeze(new HPoint(0, 0));

/*
* The default state of the interpreter.
*
* Note: Freezing the defaultState and then deriving from it
* makes the V8 Javascript engine going awkward,
* so this is avoided, albeit the defaultState shouldn't
* ever change.
*/
var defaultState = {
    cvCutIn: 17 / 16,    // control value cut in
    deltaBase: 9,
    deltaShift: 0.125,
    loop: 1,             // loops some instructions
    minDis: 1,           // minimum distance
    autoFlip: true
};

/*
* The current state of the interpreter.
*
* env  ... 'fpgm' or 'prep' or 'glyf'
* prog ... the program
*/
function State(env, prog) {
    this.env = env;
    this.stack = [];
    this.prog = prog;

    switch (env) {
        case 'glyf' :
            this.zp0 = this.zp1 = this.zp2 = 1;
            this.rp0 = this.rp1 = this.rp2 = 0;
            /* fall through */
        case 'prep' :
            this.fv = this.pv = this.dpv = xUnitVector;
            this.round = roundToGrid;
    }
}

/*
* Executes a glyph program.
*
* This does the hinting for each glyph.
*
* Returns an array of moved points.
*
* glyph: the glyph to hint
* ppem: the size the glyph is rendered for
*/
Hinting.prototype.exec = function(glyph, ppem) {
    if (typeof ppem !== 'number') {
        throw new Error('Point size is not a number!');
    }

    // Received a fatal error, don't do any hinting anymore.
    if (this._errorState > 2) { return; }

    var font = this.font;
    var prepState = this._prepState;

    if (!prepState || prepState.ppem !== ppem) {
        var fpgmState = this._fpgmState;

        if (!fpgmState) {
            // Executes the fpgm state.
            // This is used by fonts to define functions.
            State.prototype = defaultState;

            fpgmState =
            this._fpgmState =
                new State('fpgm', font.tables.fpgm);

            fpgmState.funcs = [ ];
            fpgmState.font = font;

            if (exports.DEBUG) {
                console.log('---EXEC FPGM---');
                fpgmState.step = -1;
            }

            try {
                exec(fpgmState);
            } catch (e) {
                console.log('Hinting error in FPGM:' + e);
                this._errorState = 3;
                return;
            }
        }

        // Executes the prep program for this ppem setting.
        // This is used by fonts to set cvt values
        // depending on to be rendered font size.

        State.prototype = fpgmState;
        prepState =
        this._prepState =
            new State('prep', font.tables.prep);

        prepState.ppem = ppem;

        // Creates a copy of the cvt table
        // and scales it to the current ppem setting.
        var oCvt = font.tables.cvt;
        if (oCvt) {
            var cvt = prepState.cvt = new Array(oCvt.length);
            var scale = ppem / font.unitsPerEm;
            for (var c = 0; c < oCvt.length; c++) {
                cvt[c] = oCvt[c] * scale;
            }
        } else {
            prepState.cvt = [];
        }

        if (exports.DEBUG) {
            console.log('---EXEC PREP---');
            prepState.step = -1;
        }

        try {
            exec(prepState);
        } catch (e) {
            if (this._errorState < 2) {
                console.log('Hinting error in PREP:' + e);
            }
            this._errorState = 2;
        }
    }

    if (this._errorState > 1) { return; }

    try {
        return execGlyph(glyph, prepState);
    } catch (e) {
        if (this._errorState < 1) {
            console.log('Hinting error:' + e);
            console.log('Note: further hinting errors are silenced');
        }
        this._errorState = 1;
        return undefined;
    }
};

/*
* Executes the hinting program for a glyph.
*/
execGlyph = function(glyph, prepState) {
    // original point positions
    var xScale = prepState.ppem / prepState.font.unitsPerEm;
    var yScale = xScale;
    var components = glyph.components;
    var contours;
    var gZone;
    var state;

    State.prototype = prepState;
    if (!components) {
        state = new State('glyf', glyph.instructions);
        if (exports.DEBUG) {
            console.log('---EXEC GLYPH---');
            state.step = -1;
        }
        execComponent(glyph, state, xScale, yScale);
        gZone = state.gZone;
    } else {
        var font = prepState.font;
        gZone = [];
        contours = [];
        for (var i = 0; i < components.length; i++) {
            var c = components[i];
            var cg = font.glyphs.get(c.glyphIndex);

            state = new State('glyf', cg.instructions);

            if (exports.DEBUG) {
                console.log('---EXEC COMP ' + i + '---');
                state.step = -1;
            }

            execComponent(cg, state, xScale, yScale);
            // appends the computed points to the result array
            // post processes the component points
            var dx = Math.round(c.dx * xScale);
            var dy = Math.round(c.dy * yScale);
            var gz = state.gZone;
            var cc = state.contours;
            for (var pi = 0; pi < gz.length; pi++) {
                var p = gz[pi];
                p.xTouched = p.yTouched = false;
                p.xo = p.x = p.x + dx;
                p.yo = p.y = p.y + dy;
            }

            var gLen = gZone.length;
            gZone.push.apply(gZone, gz);
            for (var j = 0; j < cc.length; j++) {
                contours.push(cc[j] + gLen);
            }
        }

        if (glyph.instructions && !state.inhibitGridFit) {
            // the composite has instructions on its own
            state = new State('glyf', glyph.instructions);

            state.gZone = state.z0 = state.z1 = state.z2 = gZone;

            state.contours = contours;

            // note: HPZero cannot be used here, since
            //       the point might be modified
            gZone.push(
                new HPoint(0, 0),
                new HPoint(Math.round(glyph.advanceWidth * xScale), 0)
            );

            if (exports.DEBUG) {
                console.log('---EXEC COMPOSITE---');
                state.step = -1;
            }

            exec(state);

            gZone.length -= 2;
        }
    }

    return gZone;
};

/*
* Executes the hinting program for a component of a multi-component glyph
* or of the glyph itself for a non-component glyph.
*/
execComponent = function(glyph, state, xScale, yScale)
{
    var points = glyph.points || [];
    var pLen = points.length;
    var gZone = state.gZone = state.z0 = state.z1 = state.z2 = [];
    var contours = state.contours = [];

    // Scales the original points and
    // makes copies for the hinted points.
    var cp; // current point
    for (var i = 0; i < pLen; i++) {
        cp = points[i];

        gZone[i] = new HPoint(
            cp.x * xScale,
            cp.y * yScale,
            cp.lastPointOfContour,
            cp.onCurve
        );
    }

    // Chain links the contours.
    var sp; // start point
    var np; // next point

    for (var i$1 = 0; i$1 < pLen; i$1++) {
        cp = gZone[i$1];

        if (!sp) {
            sp = cp;
            contours.push(i$1);
        }

        if (cp.lastPointOfContour) {
            cp.nextPointOnContour = sp;
            sp.prevPointOnContour = cp;
            sp = undefined;
        } else {
            np = gZone[i$1 + 1];
            cp.nextPointOnContour = np;
            np.prevPointOnContour = cp;
        }
    }

    if (state.inhibitGridFit) { return; }

    if (exports.DEBUG) {
        console.log('PROCESSING GLYPH', state.stack);
        for (var i$2 = 0; i$2 < pLen; i$2++) {
            console.log(i$2, gZone[i$2].x, gZone[i$2].y);
        }
    }

    gZone.push(
        new HPoint(0, 0),
        new HPoint(Math.round(glyph.advanceWidth * xScale), 0)
    );

    exec(state);

    // Removes the extra points.
    gZone.length -= 2;

    if (exports.DEBUG) {
        console.log('FINISHED GLYPH', state.stack);
        for (var i$3 = 0; i$3 < pLen; i$3++) {
            console.log(i$3, gZone[i$3].x, gZone[i$3].y);
        }
    }
};

/*
* Executes the program loaded in state.
*/
exec = function(state) {
    var prog = state.prog;

    if (!prog) { return; }

    var pLen = prog.length;
    var ins;

    for (state.ip = 0; state.ip < pLen; state.ip++) {
        if (exports.DEBUG) { state.step++; }
        ins = instructionTable[prog[state.ip]];

        if (!ins) {
            throw new Error(
                'unknown instruction: 0x' +
                Number(prog[state.ip]).toString(16)
            );
        }

        ins(state);

        // very extensive debugging for each step
        /*
        if (exports.DEBUG) {
            var da;
            if (state.gZone) {
                da = [];
                for (let i = 0; i < state.gZone.length; i++)
                {
                    da.push(i + ' ' +
                        state.gZone[i].x * 64 + ' ' +
                        state.gZone[i].y * 64 + ' ' +
                        (state.gZone[i].xTouched ? 'x' : '') +
                        (state.gZone[i].yTouched ? 'y' : '')
                    );
                }
                console.log('GZ', da);
            }

            if (state.tZone) {
                da = [];
                for (let i = 0; i < state.tZone.length; i++) {
                    da.push(i + ' ' +
                        state.tZone[i].x * 64 + ' ' +
                        state.tZone[i].y * 64 + ' ' +
                        (state.tZone[i].xTouched ? 'x' : '') +
                        (state.tZone[i].yTouched ? 'y' : '')
                    );
                }
                console.log('TZ', da);
            }

            if (state.stack.length > 10) {
                console.log(
                    state.stack.length,
                    '...', state.stack.slice(state.stack.length - 10)
                );
            } else {
                console.log(state.stack.length, state.stack);
            }
        }
        */
    }
};

/*
* Initializes the twilight zone.
*
* This is only done if a SZPx instruction
* refers to the twilight zone.
*/
function initTZone(state)
{
    var tZone = state.tZone = new Array(state.gZone.length);

    // no idea if this is actually correct...
    for (var i = 0; i < tZone.length; i++)
    {
        tZone[i] = new HPoint(0, 0);
    }
}

/*
* Skips the instruction pointer ahead over an IF/ELSE block.
* handleElse .. if true breaks on matching ELSE
*/
function skip(state, handleElse)
{
    var prog = state.prog;
    var ip = state.ip;
    var nesting = 1;
    var ins;

    do {
        ins = prog[++ip];
        if (ins === 0x58) // IF
            { nesting++; }
        else if (ins === 0x59) // EIF
            { nesting--; }
        else if (ins === 0x40) // NPUSHB
            { ip += prog[ip + 1] + 1; }
        else if (ins === 0x41) // NPUSHW
            { ip += 2 * prog[ip + 1] + 1; }
        else if (ins >= 0xB0 && ins <= 0xB7) // PUSHB
            { ip += ins - 0xB0 + 1; }
        else if (ins >= 0xB8 && ins <= 0xBF) // PUSHW
            { ip += (ins - 0xB8 + 1) * 2; }
        else if (handleElse && nesting === 1 && ins === 0x1B) // ELSE
            { break; }
    } while (nesting > 0);

    state.ip = ip;
}

/*----------------------------------------------------------*
*          And then a lot of instructions...                *
*----------------------------------------------------------*/

// SVTCA[a] Set freedom and projection Vectors To Coordinate Axis
// 0x00-0x01
function SVTCA(v, state) {
    if (exports.DEBUG) { console.log(state.step, 'SVTCA[' + v.axis + ']'); }

    state.fv = state.pv = state.dpv = v;
}

// SPVTCA[a] Set Projection Vector to Coordinate Axis
// 0x02-0x03
function SPVTCA(v, state) {
    if (exports.DEBUG) { console.log(state.step, 'SPVTCA[' + v.axis + ']'); }

    state.pv = state.dpv = v;
}

// SFVTCA[a] Set Freedom Vector to Coordinate Axis
// 0x04-0x05
function SFVTCA(v, state) {
    if (exports.DEBUG) { console.log(state.step, 'SFVTCA[' + v.axis + ']'); }

    state.fv = v;
}

// SPVTL[a] Set Projection Vector To Line
// 0x06-0x07
function SPVTL(a, state) {
    var stack = state.stack;
    var p2i = stack.pop();
    var p1i = stack.pop();
    var p2 = state.z2[p2i];
    var p1 = state.z1[p1i];

    if (exports.DEBUG) { console.log('SPVTL[' + a + ']', p2i, p1i); }

    var dx;
    var dy;

    if (!a) {
        dx = p1.x - p2.x;
        dy = p1.y - p2.y;
    } else {
        dx = p2.y - p1.y;
        dy = p1.x - p2.x;
    }

    state.pv = state.dpv = getUnitVector(dx, dy);
}

// SFVTL[a] Set Freedom Vector To Line
// 0x08-0x09
function SFVTL(a, state) {
    var stack = state.stack;
    var p2i = stack.pop();
    var p1i = stack.pop();
    var p2 = state.z2[p2i];
    var p1 = state.z1[p1i];

    if (exports.DEBUG) { console.log('SFVTL[' + a + ']', p2i, p1i); }

    var dx;
    var dy;

    if (!a) {
        dx = p1.x - p2.x;
        dy = p1.y - p2.y;
    } else {
        dx = p2.y - p1.y;
        dy = p1.x - p2.x;
    }

    state.fv = getUnitVector(dx, dy);
}

// SPVFS[] Set Projection Vector From Stack
// 0x0A
function SPVFS(state) {
    var stack = state.stack;
    var y = stack.pop();
    var x = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SPVFS[]', y, x); }

    state.pv = state.dpv = getUnitVector(x, y);
}

// SFVFS[] Set Freedom Vector From Stack
// 0x0B
function SFVFS(state) {
    var stack = state.stack;
    var y = stack.pop();
    var x = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SPVFS[]', y, x); }

    state.fv = getUnitVector(x, y);
}

// GPV[] Get Projection Vector
// 0x0C
function GPV(state) {
    var stack = state.stack;
    var pv = state.pv;

    if (exports.DEBUG) { console.log(state.step, 'GPV[]'); }

    stack.push(pv.x * 0x4000);
    stack.push(pv.y * 0x4000);
}

// GFV[] Get Freedom Vector
// 0x0C
function GFV(state) {
    var stack = state.stack;
    var fv = state.fv;

    if (exports.DEBUG) { console.log(state.step, 'GFV[]'); }

    stack.push(fv.x * 0x4000);
    stack.push(fv.y * 0x4000);
}

// SFVTPV[] Set Freedom Vector To Projection Vector
// 0x0E
function SFVTPV(state) {
    state.fv = state.pv;

    if (exports.DEBUG) { console.log(state.step, 'SFVTPV[]'); }
}

// ISECT[] moves point p to the InterSECTion of two lines
// 0x0F
function ISECT(state)
{
    var stack = state.stack;
    var pa0i = stack.pop();
    var pa1i = stack.pop();
    var pb0i = stack.pop();
    var pb1i = stack.pop();
    var pi = stack.pop();
    var z0 = state.z0;
    var z1 = state.z1;
    var pa0 = z0[pa0i];
    var pa1 = z0[pa1i];
    var pb0 = z1[pb0i];
    var pb1 = z1[pb1i];
    var p = state.z2[pi];

    if (exports.DEBUG) { console.log('ISECT[], ', pa0i, pa1i, pb0i, pb1i, pi); }

    // math from
    // en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line

    var x1 = pa0.x;
    var y1 = pa0.y;
    var x2 = pa1.x;
    var y2 = pa1.y;
    var x3 = pb0.x;
    var y3 = pb0.y;
    var x4 = pb1.x;
    var y4 = pb1.y;

    var div = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    var f1 = x1 * y2 - y1 * x2;
    var f2 = x3 * y4 - y3 * x4;

    p.x = (f1 * (x3 - x4) - f2 * (x1 - x2)) / div;
    p.y = (f1 * (y3 - y4) - f2 * (y1 - y2)) / div;
}

// SRP0[] Set Reference Point 0
// 0x10
function SRP0(state) {
    state.rp0 = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SRP0[]', state.rp0); }
}

// SRP1[] Set Reference Point 1
// 0x11
function SRP1(state) {
    state.rp1 = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SRP1[]', state.rp1); }
}

// SRP1[] Set Reference Point 2
// 0x12
function SRP2(state) {
    state.rp2 = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SRP2[]', state.rp2); }
}

// SZP0[] Set Zone Pointer 0
// 0x13
function SZP0(state) {
    var n = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SZP0[]', n); }

    state.zp0 = n;

    switch (n) {
        case 0:
            if (!state.tZone) { initTZone(state); }
            state.z0 = state.tZone;
            break;
        case 1 :
            state.z0 = state.gZone;
            break;
        default :
            throw new Error('Invalid zone pointer');
    }
}

// SZP1[] Set Zone Pointer 1
// 0x14
function SZP1(state) {
    var n = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SZP1[]', n); }

    state.zp1 = n;

    switch (n) {
        case 0:
            if (!state.tZone) { initTZone(state); }
            state.z1 = state.tZone;
            break;
        case 1 :
            state.z1 = state.gZone;
            break;
        default :
            throw new Error('Invalid zone pointer');
    }
}

// SZP2[] Set Zone Pointer 2
// 0x15
function SZP2(state) {
    var n = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SZP2[]', n); }

    state.zp2 = n;

    switch (n) {
        case 0:
            if (!state.tZone) { initTZone(state); }
            state.z2 = state.tZone;
            break;
        case 1 :
            state.z2 = state.gZone;
            break;
        default :
            throw new Error('Invalid zone pointer');
    }
}

// SZPS[] Set Zone PointerS
// 0x16
function SZPS(state) {
    var n = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SZPS[]', n); }

    state.zp0 = state.zp1 = state.zp2 = n;

    switch (n) {
        case 0:
            if (!state.tZone) { initTZone(state); }
            state.z0 = state.z1 = state.z2 = state.tZone;
            break;
        case 1 :
            state.z0 = state.z1 = state.z2 = state.gZone;
            break;
        default :
            throw new Error('Invalid zone pointer');
    }
}

// SLOOP[] Set LOOP variable
// 0x17
function SLOOP(state) {
    state.loop = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SLOOP[]', state.loop); }
}

// RTG[] Round To Grid
// 0x18
function RTG(state) {
    if (exports.DEBUG) { console.log(state.step, 'RTG[]'); }

    state.round = roundToGrid;
}

// RTHG[] Round To Half Grid
// 0x19
function RTHG(state) {
    if (exports.DEBUG) { console.log(state.step, 'RTHG[]'); }

    state.round = roundToHalfGrid;
}

// SMD[] Set Minimum Distance
// 0x1A
function SMD(state) {
    var d = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SMD[]', d); }

    state.minDis = d / 0x40;
}

// ELSE[] ELSE clause
// 0x1B
function ELSE(state) {
    // This instruction has been reached by executing a then branch
    // so it just skips ahead until matching EIF.
    //
    // In case the IF was negative the IF[] instruction already
    // skipped forward over the ELSE[]

    if (exports.DEBUG) { console.log(state.step, 'ELSE[]'); }

    skip(state, false);
}

// JMPR[] JuMP Relative
// 0x1C
function JMPR(state) {
    var o = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'JMPR[]', o); }

    // A jump by 1 would do nothing.
    state.ip += o - 1;
}

// SCVTCI[] Set Control Value Table Cut-In
// 0x1D
function SCVTCI(state) {
    var n = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SCVTCI[]', n); }

    state.cvCutIn = n / 0x40;
}

// DUP[] DUPlicate top stack element
// 0x20
function DUP(state) {
    var stack = state.stack;

    if (exports.DEBUG) { console.log(state.step, 'DUP[]'); }

    stack.push(stack[stack.length - 1]);
}

// POP[] POP top stack element
// 0x21
function POP(state) {
    if (exports.DEBUG) { console.log(state.step, 'POP[]'); }

    state.stack.pop();
}

// CLEAR[] CLEAR the stack
// 0x22
function CLEAR(state) {
    if (exports.DEBUG) { console.log(state.step, 'CLEAR[]'); }

    state.stack.length = 0;
}

// SWAP[] SWAP the top two elements on the stack
// 0x23
function SWAP(state) {
    var stack = state.stack;

    var a = stack.pop();
    var b = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SWAP[]'); }

    stack.push(a);
    stack.push(b);
}

// DEPTH[] DEPTH of the stack
// 0x24
function DEPTH(state) {
    var stack = state.stack;

    if (exports.DEBUG) { console.log(state.step, 'DEPTH[]'); }

    stack.push(stack.length);
}

// LOOPCALL[] LOOPCALL function
// 0x2A
function LOOPCALL(state) {
    var stack = state.stack;
    var fn = stack.pop();
    var c = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'LOOPCALL[]', fn, c); }

    // saves callers program
    var cip = state.ip;
    var cprog = state.prog;

    state.prog = state.funcs[fn];

    // executes the function
    for (var i = 0; i < c; i++) {
        exec(state);

        if (exports.DEBUG) { console.log(
            ++state.step,
            i + 1 < c ? 'next loopcall' : 'done loopcall',
            i
        ); }
    }

    // restores the callers program
    state.ip = cip;
    state.prog = cprog;
}

// CALL[] CALL function
// 0x2B
function CALL(state) {
    var fn = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'CALL[]', fn); }

    // saves callers program
    var cip = state.ip;
    var cprog = state.prog;

    state.prog = state.funcs[fn];

    // executes the function
    exec(state);

    // restores the callers program
    state.ip = cip;
    state.prog = cprog;

    if (exports.DEBUG) { console.log(++state.step, 'returning from', fn); }
}

// CINDEX[] Copy the INDEXed element to the top of the stack
// 0x25
function CINDEX(state) {
    var stack = state.stack;
    var k = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'CINDEX[]', k); }

    // In case of k == 1, it copies the last element after popping
    // thus stack.length - k.
    stack.push(stack[stack.length - k]);
}

// MINDEX[] Move the INDEXed element to the top of the stack
// 0x26
function MINDEX(state) {
    var stack = state.stack;
    var k = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'MINDEX[]', k); }

    stack.push(stack.splice(stack.length - k, 1)[0]);
}

// FDEF[] Function DEFinition
// 0x2C
function FDEF(state) {
    if (state.env !== 'fpgm') { throw new Error('FDEF not allowed here'); }
    var stack = state.stack;
    var prog = state.prog;
    var ip = state.ip;

    var fn = stack.pop();
    var ipBegin = ip;

    if (exports.DEBUG) { console.log(state.step, 'FDEF[]', fn); }

    while (prog[++ip] !== 0x2D){ }

    state.ip = ip;
    state.funcs[fn] = prog.slice(ipBegin + 1, ip);
}

// MDAP[a] Move Direct Absolute Point
// 0x2E-0x2F
function MDAP(round, state) {
    var pi = state.stack.pop();
    var p = state.z0[pi];
    var fv = state.fv;
    var pv = state.pv;

    if (exports.DEBUG) { console.log(state.step, 'MDAP[' + round + ']', pi); }

    var d = pv.distance(p, HPZero);

    if (round) { d = state.round(d); }

    fv.setRelative(p, HPZero, d, pv);
    fv.touch(p);

    state.rp0 = state.rp1 = pi;
}

// IUP[a] Interpolate Untouched Points through the outline
// 0x30
function IUP(v, state) {
    var z2 = state.z2;
    var pLen = z2.length - 2;
    var cp;
    var pp;
    var np;

    if (exports.DEBUG) { console.log(state.step, 'IUP[' + v.axis + ']'); }

    for (var i = 0; i < pLen; i++) {
        cp = z2[i]; // current point

        // if this point has been touched go on
        if (v.touched(cp)) { continue; }

        pp = cp.prevTouched(v);

        // no point on the contour has been touched?
        if (pp === cp) { continue; }

        np = cp.nextTouched(v);

        if (pp === np) {
            // only one point on the contour has been touched
            // so simply moves the point like that

            v.setRelative(cp, cp, v.distance(pp, pp, false, true), v, true);
        }

        v.interpolate(cp, pp, np, v);
    }
}

// SHP[] SHift Point using reference point
// 0x32-0x33
function SHP(a, state) {
    var stack = state.stack;
    var rpi = a ? state.rp1 : state.rp2;
    var rp = (a ? state.z0 : state.z1)[rpi];
    var fv = state.fv;
    var pv = state.pv;
    var loop = state.loop;
    var z2 = state.z2;

    while (loop--)
    {
        var pi = stack.pop();
        var p = z2[pi];

        var d = pv.distance(rp, rp, false, true);
        fv.setRelative(p, p, d, pv);
        fv.touch(p);

        if (exports.DEBUG) {
            console.log(
                state.step,
                (state.loop > 1 ?
                   'loop ' + (state.loop - loop) + ': ' :
                   ''
                ) +
                'SHP[' + (a ? 'rp1' : 'rp2') + ']', pi
            );
        }
    }

    state.loop = 1;
}

// SHC[] SHift Contour using reference point
// 0x36-0x37
function SHC(a, state) {
    var stack = state.stack;
    var rpi = a ? state.rp1 : state.rp2;
    var rp = (a ? state.z0 : state.z1)[rpi];
    var fv = state.fv;
    var pv = state.pv;
    var ci = stack.pop();
    var sp = state.z2[state.contours[ci]];
    var p = sp;

    if (exports.DEBUG) { console.log(state.step, 'SHC[' + a + ']', ci); }

    var d = pv.distance(rp, rp, false, true);

    do {
        if (p !== rp) { fv.setRelative(p, p, d, pv); }
        p = p.nextPointOnContour;
    } while (p !== sp);
}

// SHZ[] SHift Zone using reference point
// 0x36-0x37
function SHZ(a, state) {
    var stack = state.stack;
    var rpi = a ? state.rp1 : state.rp2;
    var rp = (a ? state.z0 : state.z1)[rpi];
    var fv = state.fv;
    var pv = state.pv;

    var e = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SHZ[' + a + ']', e); }

    var z;
    switch (e) {
        case 0 : z = state.tZone; break;
        case 1 : z = state.gZone; break;
        default : throw new Error('Invalid zone');
    }

    var p;
    var d = pv.distance(rp, rp, false, true);
    var pLen = z.length - 2;
    for (var i = 0; i < pLen; i++)
    {
        p = z[i];
        fv.setRelative(p, p, d, pv);
        //if (p !== rp) fv.setRelative(p, p, d, pv);
    }
}

// SHPIX[] SHift point by a PIXel amount
// 0x38
function SHPIX(state) {
    var stack = state.stack;
    var loop = state.loop;
    var fv = state.fv;
    var d = stack.pop() / 0x40;
    var z2 = state.z2;

    while (loop--) {
        var pi = stack.pop();
        var p = z2[pi];

        if (exports.DEBUG) {
            console.log(
                state.step,
                (state.loop > 1 ? 'loop ' + (state.loop - loop) + ': ' : '') +
                'SHPIX[]', pi, d
            );
        }

        fv.setRelative(p, p, d);
        fv.touch(p);
    }

    state.loop = 1;
}

// IP[] Interpolate Point
// 0x39
function IP(state) {
    var stack = state.stack;
    var rp1i = state.rp1;
    var rp2i = state.rp2;
    var loop = state.loop;
    var rp1 = state.z0[rp1i];
    var rp2 = state.z1[rp2i];
    var fv = state.fv;
    var pv = state.dpv;
    var z2 = state.z2;

    while (loop--) {
        var pi = stack.pop();
        var p = z2[pi];

        if (exports.DEBUG) {
            console.log(
                state.step,
                (state.loop > 1 ? 'loop ' + (state.loop - loop) + ': ' : '') +
                'IP[]', pi, rp1i, '<->', rp2i
            );
        }

        fv.interpolate(p, rp1, rp2, pv);

        fv.touch(p);
    }

    state.loop = 1;
}

// MSIRP[a] Move Stack Indirect Relative Point
// 0x3A-0x3B
function MSIRP(a, state) {
    var stack = state.stack;
    var d = stack.pop() / 64;
    var pi = stack.pop();
    var p = state.z1[pi];
    var rp0 = state.z0[state.rp0];
    var fv = state.fv;
    var pv = state.pv;

    fv.setRelative(p, rp0, d, pv);
    fv.touch(p);

    if (exports.DEBUG) { console.log(state.step, 'MSIRP[' + a + ']', d, pi); }

    state.rp1 = state.rp0;
    state.rp2 = pi;
    if (a) { state.rp0 = pi; }
}

// ALIGNRP[] Align to reference point.
// 0x3C
function ALIGNRP(state) {
    var stack = state.stack;
    var rp0i = state.rp0;
    var rp0 = state.z0[rp0i];
    var loop = state.loop;
    var fv = state.fv;
    var pv = state.pv;
    var z1 = state.z1;

    while (loop--) {
        var pi = stack.pop();
        var p = z1[pi];

        if (exports.DEBUG) {
            console.log(
                state.step,
                (state.loop > 1 ? 'loop ' + (state.loop - loop) + ': ' : '') +
                'ALIGNRP[]', pi
            );
        }

        fv.setRelative(p, rp0, 0, pv);
        fv.touch(p);
    }

    state.loop = 1;
}

// RTG[] Round To Double Grid
// 0x3D
function RTDG(state) {
    if (exports.DEBUG) { console.log(state.step, 'RTDG[]'); }

    state.round = roundToDoubleGrid;
}

// MIAP[a] Move Indirect Absolute Point
// 0x3E-0x3F
function MIAP(round, state) {
    var stack = state.stack;
    var n = stack.pop();
    var pi = stack.pop();
    var p = state.z0[pi];
    var fv = state.fv;
    var pv = state.pv;
    var cv = state.cvt[n];

    if (exports.DEBUG) {
        console.log(
            state.step,
            'MIAP[' + round + ']',
            n, '(', cv, ')', pi
        );
    }

    var d = pv.distance(p, HPZero);

    if (round) {
        if (Math.abs(d - cv) < state.cvCutIn) { d = cv; }

        d = state.round(d);
    }

    fv.setRelative(p, HPZero, d, pv);

    if (state.zp0 === 0) {
        p.xo = p.x;
        p.yo = p.y;
    }

    fv.touch(p);

    state.rp0 = state.rp1 = pi;
}

// NPUSB[] PUSH N Bytes
// 0x40
function NPUSHB(state) {
    var prog = state.prog;
    var ip = state.ip;
    var stack = state.stack;

    var n = prog[++ip];

    if (exports.DEBUG) { console.log(state.step, 'NPUSHB[]', n); }

    for (var i = 0; i < n; i++) { stack.push(prog[++ip]); }

    state.ip = ip;
}

// NPUSHW[] PUSH N Words
// 0x41
function NPUSHW(state) {
    var ip = state.ip;
    var prog = state.prog;
    var stack = state.stack;
    var n = prog[++ip];

    if (exports.DEBUG) { console.log(state.step, 'NPUSHW[]', n); }

    for (var i = 0; i < n; i++) {
        var w = (prog[++ip] << 8) | prog[++ip];
        if (w & 0x8000) { w = -((w ^ 0xffff) + 1); }
        stack.push(w);
    }

    state.ip = ip;
}

// WS[] Write Store
// 0x42
function WS(state) {
    var stack = state.stack;
    var store = state.store;

    if (!store) { store = state.store = []; }

    var v = stack.pop();
    var l = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'WS', v, l); }

    store[l] = v;
}

// RS[] Read Store
// 0x43
function RS(state) {
    var stack = state.stack;
    var store = state.store;

    var l = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'RS', l); }

    var v = (store && store[l]) || 0;

    stack.push(v);
}

// WCVTP[] Write Control Value Table in Pixel units
// 0x44
function WCVTP(state) {
    var stack = state.stack;

    var v = stack.pop();
    var l = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'WCVTP', v, l); }

    state.cvt[l] = v / 0x40;
}

// RCVT[] Read Control Value Table entry
// 0x45
function RCVT(state) {
    var stack = state.stack;
    var cvte = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'RCVT', cvte); }

    stack.push(state.cvt[cvte] * 0x40);
}

// GC[] Get Coordinate projected onto the projection vector
// 0x46-0x47
function GC(a, state) {
    var stack = state.stack;
    var pi = stack.pop();
    var p = state.z2[pi];

    if (exports.DEBUG) { console.log(state.step, 'GC[' + a + ']', pi); }

    stack.push(state.dpv.distance(p, HPZero, a, false) * 0x40);
}

// MD[a] Measure Distance
// 0x49-0x4A
function MD(a, state) {
    var stack = state.stack;
    var pi2 = stack.pop();
    var pi1 = stack.pop();
    var p2 = state.z1[pi2];
    var p1 = state.z0[pi1];
    var d = state.dpv.distance(p1, p2, a, a);

    if (exports.DEBUG) { console.log(state.step, 'MD[' + a + ']', pi2, pi1, '->', d); }

    state.stack.push(Math.round(d * 64));
}

// MPPEM[] Measure Pixels Per EM
// 0x4B
function MPPEM(state) {
    if (exports.DEBUG) { console.log(state.step, 'MPPEM[]'); }
    state.stack.push(state.ppem);
}

// FLIPON[] set the auto FLIP Boolean to ON
// 0x4D
function FLIPON(state) {
    if (exports.DEBUG) { console.log(state.step, 'FLIPON[]'); }
    state.autoFlip = true;
}

// LT[] Less Than
// 0x50
function LT(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'LT[]', e2, e1); }

    stack.push(e1 < e2 ? 1 : 0);
}

// LTEQ[] Less Than or EQual
// 0x53
function LTEQ(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'LTEQ[]', e2, e1); }

    stack.push(e1 <= e2 ? 1 : 0);
}

// GTEQ[] Greater Than
// 0x52
function GT(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'GT[]', e2, e1); }

    stack.push(e1 > e2 ? 1 : 0);
}

// GTEQ[] Greater Than or EQual
// 0x53
function GTEQ(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'GTEQ[]', e2, e1); }

    stack.push(e1 >= e2 ? 1 : 0);
}

// EQ[] EQual
// 0x54
function EQ(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'EQ[]', e2, e1); }

    stack.push(e2 === e1 ? 1 : 0);
}

// NEQ[] Not EQual
// 0x55
function NEQ(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'NEQ[]', e2, e1); }

    stack.push(e2 !== e1 ? 1 : 0);
}

// ODD[] ODD
// 0x56
function ODD(state) {
    var stack = state.stack;
    var n = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'ODD[]', n); }

    stack.push(Math.trunc(n) % 2 ? 1 : 0);
}

// EVEN[] EVEN
// 0x57
function EVEN(state) {
    var stack = state.stack;
    var n = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'EVEN[]', n); }

    stack.push(Math.trunc(n) % 2 ? 0 : 1);
}

// IF[] IF test
// 0x58
function IF(state) {
    var test = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'IF[]', test); }

    // if test is true it just continues
    // if not the ip is skipped until matching ELSE or EIF
    if (!test) {
        skip(state, true);

        if (exports.DEBUG) { console.log(state.step,  'EIF[]'); }
    }
}

// EIF[] End IF
// 0x59
function EIF(state) {
    // this can be reached normally when
    // executing an else branch.
    // -> just ignore it

    if (exports.DEBUG) { console.log(state.step, 'EIF[]'); }
}

// AND[] logical AND
// 0x5A
function AND(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'AND[]', e2, e1); }

    stack.push(e2 && e1 ? 1 : 0);
}

// OR[] logical OR
// 0x5B
function OR(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'OR[]', e2, e1); }

    stack.push(e2 || e1 ? 1 : 0);
}

// NOT[] logical NOT
// 0x5C
function NOT(state) {
    var stack = state.stack;
    var e = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'NOT[]', e); }

    stack.push(e ? 0 : 1);
}

// DELTAP1[] DELTA exception P1
// DELTAP2[] DELTA exception P2
// DELTAP3[] DELTA exception P3
// 0x5D, 0x71, 0x72
function DELTAP123(b, state) {
    var stack = state.stack;
    var n = stack.pop();
    var fv = state.fv;
    var pv = state.pv;
    var ppem = state.ppem;
    var base = state.deltaBase + (b - 1) * 16;
    var ds = state.deltaShift;
    var z0 = state.z0;

    if (exports.DEBUG) { console.log(state.step, 'DELTAP[' + b + ']', n, stack); }

    for (var i = 0; i < n; i++) {
        var pi = stack.pop();
        var arg = stack.pop();
        var appem = base + ((arg & 0xF0) >> 4);
        if (appem !== ppem) { continue; }

        var mag = (arg & 0x0F) - 8;
        if (mag >= 0) { mag++; }
        if (exports.DEBUG) { console.log(state.step, 'DELTAPFIX', pi, 'by', mag * ds); }

        var p = z0[pi];
        fv.setRelative(p, p, mag * ds, pv);
    }
}

// SDB[] Set Delta Base in the graphics state
// 0x5E
function SDB(state) {
    var stack = state.stack;
    var n = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SDB[]', n); }

    state.deltaBase = n;
}

// SDS[] Set Delta Shift in the graphics state
// 0x5F
function SDS(state) {
    var stack = state.stack;
    var n = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SDS[]', n); }

    state.deltaShift = Math.pow(0.5, n);
}

// ADD[] ADD
// 0x60
function ADD(state) {
    var stack = state.stack;
    var n2 = stack.pop();
    var n1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'ADD[]', n2, n1); }

    stack.push(n1 + n2);
}

// SUB[] SUB
// 0x61
function SUB(state) {
    var stack = state.stack;
    var n2 = stack.pop();
    var n1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SUB[]', n2, n1); }

    stack.push(n1 - n2);
}

// DIV[] DIV
// 0x62
function DIV(state) {
    var stack = state.stack;
    var n2 = stack.pop();
    var n1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'DIV[]', n2, n1); }

    stack.push(n1 * 64 / n2);
}

// MUL[] MUL
// 0x63
function MUL(state) {
    var stack = state.stack;
    var n2 = stack.pop();
    var n1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'MUL[]', n2, n1); }

    stack.push(n1 * n2 / 64);
}

// ABS[] ABSolute value
// 0x64
function ABS(state) {
    var stack = state.stack;
    var n = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'ABS[]', n); }

    stack.push(Math.abs(n));
}

// NEG[] NEGate
// 0x65
function NEG(state) {
    var stack = state.stack;
    var n = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'NEG[]', n); }

    stack.push(-n);
}

// FLOOR[] FLOOR
// 0x66
function FLOOR(state) {
    var stack = state.stack;
    var n = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'FLOOR[]', n); }

    stack.push(Math.floor(n / 0x40) * 0x40);
}

// CEILING[] CEILING
// 0x67
function CEILING(state) {
    var stack = state.stack;
    var n = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'CEILING[]', n); }

    stack.push(Math.ceil(n / 0x40) * 0x40);
}

// ROUND[ab] ROUND value
// 0x68-0x6B
function ROUND(dt, state) {
    var stack = state.stack;
    var n = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'ROUND[]'); }

    stack.push(state.round(n / 0x40) * 0x40);
}

// WCVTF[] Write Control Value Table in Funits
// 0x70
function WCVTF(state) {
    var stack = state.stack;
    var v = stack.pop();
    var l = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'WCVTF[]', v, l); }

    state.cvt[l] = v * state.ppem / state.font.unitsPerEm;
}

// DELTAC1[] DELTA exception C1
// DELTAC2[] DELTA exception C2
// DELTAC3[] DELTA exception C3
// 0x73, 0x74, 0x75
function DELTAC123(b, state) {
    var stack = state.stack;
    var n = stack.pop();
    var ppem = state.ppem;
    var base = state.deltaBase + (b - 1) * 16;
    var ds = state.deltaShift;

    if (exports.DEBUG) { console.log(state.step, 'DELTAC[' + b + ']', n, stack); }

    for (var i = 0; i < n; i++) {
        var c = stack.pop();
        var arg = stack.pop();
        var appem = base + ((arg & 0xF0) >> 4);
        if (appem !== ppem) { continue; }

        var mag = (arg & 0x0F) - 8;
        if (mag >= 0) { mag++; }

        var delta = mag * ds;

        if (exports.DEBUG) { console.log(state.step, 'DELTACFIX', c, 'by', delta); }

        state.cvt[c] += delta;
    }
}

// SROUND[] Super ROUND
// 0x76
function SROUND(state) {
    var n = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'SROUND[]', n); }

    state.round = roundSuper;

    var period;

    switch (n & 0xC0) {
        case 0x00:
            period = 0.5;
            break;
        case 0x40:
            period = 1;
            break;
        case 0x80:
            period = 2;
            break;
        default:
            throw new Error('invalid SROUND value');
    }

    state.srPeriod = period;

    switch (n & 0x30) {
        case 0x00:
            state.srPhase = 0;
            break;
        case 0x10:
            state.srPhase = 0.25 * period;
            break;
        case 0x20:
            state.srPhase = 0.5  * period;
            break;
        case 0x30:
            state.srPhase = 0.75 * period;
            break;
        default: throw new Error('invalid SROUND value');
    }

    n &= 0x0F;

    if (n === 0) { state.srThreshold = 0; }
    else { state.srThreshold = (n / 8 - 0.5) * period; }
}

// S45ROUND[] Super ROUND 45 degrees
// 0x77
function S45ROUND(state) {
    var n = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'S45ROUND[]', n); }

    state.round = roundSuper;

    var period;

    switch (n & 0xC0) {
        case 0x00:
            period = Math.sqrt(2) / 2;
            break;
        case 0x40:
            period = Math.sqrt(2);
            break;
        case 0x80:
            period = 2 * Math.sqrt(2);
            break;
        default:
            throw new Error('invalid S45ROUND value');
    }

    state.srPeriod = period;

    switch (n & 0x30) {
        case 0x00:
            state.srPhase = 0;
            break;
        case 0x10:
            state.srPhase = 0.25 * period;
            break;
        case 0x20:
            state.srPhase = 0.5  * period;
            break;
        case 0x30:
            state.srPhase = 0.75 * period;
            break;
        default:
            throw new Error('invalid S45ROUND value');
    }

    n &= 0x0F;

    if (n === 0) { state.srThreshold = 0; }
    else { state.srThreshold = (n / 8 - 0.5) * period; }
}

// ROFF[] Round Off
// 0x7A
function ROFF(state) {
    if (exports.DEBUG) { console.log(state.step, 'ROFF[]'); }

    state.round = roundOff;
}

// RUTG[] Round Up To Grid
// 0x7C
function RUTG(state) {
    if (exports.DEBUG) { console.log(state.step, 'RUTG[]'); }

    state.round = roundUpToGrid;
}

// RDTG[] Round Down To Grid
// 0x7D
function RDTG(state) {
    if (exports.DEBUG) { console.log(state.step, 'RDTG[]'); }

    state.round = roundDownToGrid;
}

// SCANCTRL[] SCAN conversion ConTRoL
// 0x85
function SCANCTRL(state) {
    var n = state.stack.pop();

    // ignored by opentype.js

    if (exports.DEBUG) { console.log(state.step, 'SCANCTRL[]', n); }
}

// SDPVTL[a] Set Dual Projection Vector To Line
// 0x86-0x87
function SDPVTL(a, state) {
    var stack = state.stack;
    var p2i = stack.pop();
    var p1i = stack.pop();
    var p2 = state.z2[p2i];
    var p1 = state.z1[p1i];

    if (exports.DEBUG) { console.log(state.step, 'SDPVTL[' + a + ']', p2i, p1i); }

    var dx;
    var dy;

    if (!a) {
        dx = p1.x - p2.x;
        dy = p1.y - p2.y;
    } else {
        dx = p2.y - p1.y;
        dy = p1.x - p2.x;
    }

    state.dpv = getUnitVector(dx, dy);
}

// GETINFO[] GET INFOrmation
// 0x88
function GETINFO(state) {
    var stack = state.stack;
    var sel = stack.pop();
    var r = 0;

    if (exports.DEBUG) { console.log(state.step, 'GETINFO[]', sel); }

    // v35 as in no subpixel hinting
    if (sel & 0x01) { r = 35; }

    // TODO rotation and stretch currently not supported
    // and thus those GETINFO are always 0.

    // opentype.js is always gray scaling
    if (sel & 0x20) { r |= 0x1000; }

    stack.push(r);
}

// ROLL[] ROLL the top three stack elements
// 0x8A
function ROLL(state) {
    var stack = state.stack;
    var a = stack.pop();
    var b = stack.pop();
    var c = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'ROLL[]'); }

    stack.push(b);
    stack.push(a);
    stack.push(c);
}

// MAX[] MAXimum of top two stack elements
// 0x8B
function MAX(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'MAX[]', e2, e1); }

    stack.push(Math.max(e1, e2));
}

// MIN[] MINimum of top two stack elements
// 0x8C
function MIN(state) {
    var stack = state.stack;
    var e2 = stack.pop();
    var e1 = stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'MIN[]', e2, e1); }

    stack.push(Math.min(e1, e2));
}

// SCANTYPE[] SCANTYPE
// 0x8D
function SCANTYPE(state) {
    var n = state.stack.pop();
    // ignored by opentype.js
    if (exports.DEBUG) { console.log(state.step, 'SCANTYPE[]', n); }
}

// INSTCTRL[] INSTCTRL
// 0x8D
function INSTCTRL(state) {
    var s = state.stack.pop();
    var v = state.stack.pop();

    if (exports.DEBUG) { console.log(state.step, 'INSTCTRL[]', s, v); }

    switch (s) {
        case 1 : state.inhibitGridFit = !!v; return;
        case 2 : state.ignoreCvt = !!v; return;
        default: throw new Error('invalid INSTCTRL[] selector');
    }
}

// PUSHB[abc] PUSH Bytes
// 0xB0-0xB7
function PUSHB(n, state) {
    var stack = state.stack;
    var prog = state.prog;
    var ip = state.ip;

    if (exports.DEBUG) { console.log(state.step, 'PUSHB[' + n + ']'); }

    for (var i = 0; i < n; i++) { stack.push(prog[++ip]); }

    state.ip = ip;
}

// PUSHW[abc] PUSH Words
// 0xB8-0xBF
function PUSHW(n, state) {
    var ip = state.ip;
    var prog = state.prog;
    var stack = state.stack;

    if (exports.DEBUG) { console.log(state.ip, 'PUSHW[' + n + ']'); }

    for (var i = 0; i < n; i++) {
        var w = (prog[++ip] << 8) | prog[++ip];
        if (w & 0x8000) { w = -((w ^ 0xffff) + 1); }
        stack.push(w);
    }

    state.ip = ip;
}

// MDRP[abcde] Move Direct Relative Point
// 0xD0-0xEF
// (if indirect is 0)
//
// and
//
// MIRP[abcde] Move Indirect Relative Point
// 0xE0-0xFF
// (if indirect is 1)

function MDRP_MIRP(indirect, setRp0, keepD, ro, dt, state) {
    var stack = state.stack;
    var cvte = indirect && stack.pop();
    var pi = stack.pop();
    var rp0i = state.rp0;
    var rp = state.z0[rp0i];
    var p = state.z1[pi];

    var md = state.minDis;
    var fv = state.fv;
    var pv = state.dpv;
    var od; // original distance
    var d; // moving distance
    var sign; // sign of distance
    var cv;

    d = od = pv.distance(p, rp, true, true);
    sign = d >= 0 ? 1 : -1; // Math.sign would be 0 in case of 0

    // TODO consider autoFlip
    d = Math.abs(d);

    if (indirect) {
        cv = state.cvt[cvte];

        if (ro && Math.abs(d - cv) < state.cvCutIn) { d = cv; }
    }

    if (keepD && d < md) { d = md; }

    if (ro) { d = state.round(d); }

    fv.setRelative(p, rp, sign * d, pv);
    fv.touch(p);

    if (exports.DEBUG) {
        console.log(
            state.step,
            (indirect ? 'MIRP[' : 'MDRP[') +
            (setRp0 ? 'M' : 'm') +
            (keepD ? '>' : '_') +
            (ro ? 'R' : '_') +
            (dt === 0 ? 'Gr' : (dt === 1 ? 'Bl' : (dt === 2 ? 'Wh' : ''))) +
            ']',
            indirect ?
                cvte + '(' + state.cvt[cvte] + ',' +  cv + ')' :
                '',
            pi,
            '(d =', od, '->', sign * d, ')'
        );
    }

    state.rp1 = state.rp0;
    state.rp2 = pi;
    if (setRp0) { state.rp0 = pi; }
}

/*
* The instruction table.
*/
instructionTable = [
    /* 0x00 */ SVTCA.bind(undefined, yUnitVector),
    /* 0x01 */ SVTCA.bind(undefined, xUnitVector),
    /* 0x02 */ SPVTCA.bind(undefined, yUnitVector),
    /* 0x03 */ SPVTCA.bind(undefined, xUnitVector),
    /* 0x04 */ SFVTCA.bind(undefined, yUnitVector),
    /* 0x05 */ SFVTCA.bind(undefined, xUnitVector),
    /* 0x06 */ SPVTL.bind(undefined, 0),
    /* 0x07 */ SPVTL.bind(undefined, 1),
    /* 0x08 */ SFVTL.bind(undefined, 0),
    /* 0x09 */ SFVTL.bind(undefined, 1),
    /* 0x0A */ SPVFS,
    /* 0x0B */ SFVFS,
    /* 0x0C */ GPV,
    /* 0x0D */ GFV,
    /* 0x0E */ SFVTPV,
    /* 0x0F */ ISECT,
    /* 0x10 */ SRP0,
    /* 0x11 */ SRP1,
    /* 0x12 */ SRP2,
    /* 0x13 */ SZP0,
    /* 0x14 */ SZP1,
    /* 0x15 */ SZP2,
    /* 0x16 */ SZPS,
    /* 0x17 */ SLOOP,
    /* 0x18 */ RTG,
    /* 0x19 */ RTHG,
    /* 0x1A */ SMD,
    /* 0x1B */ ELSE,
    /* 0x1C */ JMPR,
    /* 0x1D */ SCVTCI,
    /* 0x1E */ undefined,   // TODO SSWCI
    /* 0x1F */ undefined,   // TODO SSW
    /* 0x20 */ DUP,
    /* 0x21 */ POP,
    /* 0x22 */ CLEAR,
    /* 0x23 */ SWAP,
    /* 0x24 */ DEPTH,
    /* 0x25 */ CINDEX,
    /* 0x26 */ MINDEX,
    /* 0x27 */ undefined,   // TODO ALIGNPTS
    /* 0x28 */ undefined,
    /* 0x29 */ undefined,   // TODO UTP
    /* 0x2A */ LOOPCALL,
    /* 0x2B */ CALL,
    /* 0x2C */ FDEF,
    /* 0x2D */ undefined,   // ENDF (eaten by FDEF)
    /* 0x2E */ MDAP.bind(undefined, 0),
    /* 0x2F */ MDAP.bind(undefined, 1),
    /* 0x30 */ IUP.bind(undefined, yUnitVector),
    /* 0x31 */ IUP.bind(undefined, xUnitVector),
    /* 0x32 */ SHP.bind(undefined, 0),
    /* 0x33 */ SHP.bind(undefined, 1),
    /* 0x34 */ SHC.bind(undefined, 0),
    /* 0x35 */ SHC.bind(undefined, 1),
    /* 0x36 */ SHZ.bind(undefined, 0),
    /* 0x37 */ SHZ.bind(undefined, 1),
    /* 0x38 */ SHPIX,
    /* 0x39 */ IP,
    /* 0x3A */ MSIRP.bind(undefined, 0),
    /* 0x3B */ MSIRP.bind(undefined, 1),
    /* 0x3C */ ALIGNRP,
    /* 0x3D */ RTDG,
    /* 0x3E */ MIAP.bind(undefined, 0),
    /* 0x3F */ MIAP.bind(undefined, 1),
    /* 0x40 */ NPUSHB,
    /* 0x41 */ NPUSHW,
    /* 0x42 */ WS,
    /* 0x43 */ RS,
    /* 0x44 */ WCVTP,
    /* 0x45 */ RCVT,
    /* 0x46 */ GC.bind(undefined, 0),
    /* 0x47 */ GC.bind(undefined, 1),
    /* 0x48 */ undefined,   // TODO SCFS
    /* 0x49 */ MD.bind(undefined, 0),
    /* 0x4A */ MD.bind(undefined, 1),
    /* 0x4B */ MPPEM,
    /* 0x4C */ undefined,   // TODO MPS
    /* 0x4D */ FLIPON,
    /* 0x4E */ undefined,   // TODO FLIPOFF
    /* 0x4F */ undefined,   // TODO DEBUG
    /* 0x50 */ LT,
    /* 0x51 */ LTEQ,
    /* 0x52 */ GT,
    /* 0x53 */ GTEQ,
    /* 0x54 */ EQ,
    /* 0x55 */ NEQ,
    /* 0x56 */ ODD,
    /* 0x57 */ EVEN,
    /* 0x58 */ IF,
    /* 0x59 */ EIF,
    /* 0x5A */ AND,
    /* 0x5B */ OR,
    /* 0x5C */ NOT,
    /* 0x5D */ DELTAP123.bind(undefined, 1),
    /* 0x5E */ SDB,
    /* 0x5F */ SDS,
    /* 0x60 */ ADD,
    /* 0x61 */ SUB,
    /* 0x62 */ DIV,
    /* 0x63 */ MUL,
    /* 0x64 */ ABS,
    /* 0x65 */ NEG,
    /* 0x66 */ FLOOR,
    /* 0x67 */ CEILING,
    /* 0x68 */ ROUND.bind(undefined, 0),
    /* 0x69 */ ROUND.bind(undefined, 1),
    /* 0x6A */ ROUND.bind(undefined, 2),
    /* 0x6B */ ROUND.bind(undefined, 3),
    /* 0x6C */ undefined,   // TODO NROUND[ab]
    /* 0x6D */ undefined,   // TODO NROUND[ab]
    /* 0x6E */ undefined,   // TODO NROUND[ab]
    /* 0x6F */ undefined,   // TODO NROUND[ab]
    /* 0x70 */ WCVTF,
    /* 0x71 */ DELTAP123.bind(undefined, 2),
    /* 0x72 */ DELTAP123.bind(undefined, 3),
    /* 0x73 */ DELTAC123.bind(undefined, 1),
    /* 0x74 */ DELTAC123.bind(undefined, 2),
    /* 0x75 */ DELTAC123.bind(undefined, 3),
    /* 0x76 */ SROUND,
    /* 0x77 */ S45ROUND,
    /* 0x78 */ undefined,   // TODO JROT[]
    /* 0x79 */ undefined,   // TODO JROF[]
    /* 0x7A */ ROFF,
    /* 0x7B */ undefined,
    /* 0x7C */ RUTG,
    /* 0x7D */ RDTG,
    /* 0x7E */ POP, // actually SANGW, supposed to do only a pop though
    /* 0x7F */ POP, // actually AA, supposed to do only a pop though
    /* 0x80 */ undefined,   // TODO FLIPPT
    /* 0x81 */ undefined,   // TODO FLIPRGON
    /* 0x82 */ undefined,   // TODO FLIPRGOFF
    /* 0x83 */ undefined,
    /* 0x84 */ undefined,
    /* 0x85 */ SCANCTRL,
    /* 0x86 */ SDPVTL.bind(undefined, 0),
    /* 0x87 */ SDPVTL.bind(undefined, 1),
    /* 0x88 */ GETINFO,
    /* 0x89 */ undefined,   // TODO IDEF
    /* 0x8A */ ROLL,
    /* 0x8B */ MAX,
    /* 0x8C */ MIN,
    /* 0x8D */ SCANTYPE,
    /* 0x8E */ INSTCTRL,
    /* 0x8F */ undefined,
    /* 0x90 */ undefined,
    /* 0x91 */ undefined,
    /* 0x92 */ undefined,
    /* 0x93 */ undefined,
    /* 0x94 */ undefined,
    /* 0x95 */ undefined,
    /* 0x96 */ undefined,
    /* 0x97 */ undefined,
    /* 0x98 */ undefined,
    /* 0x99 */ undefined,
    /* 0x9A */ undefined,
    /* 0x9B */ undefined,
    /* 0x9C */ undefined,
    /* 0x9D */ undefined,
    /* 0x9E */ undefined,
    /* 0x9F */ undefined,
    /* 0xA0 */ undefined,
    /* 0xA1 */ undefined,
    /* 0xA2 */ undefined,
    /* 0xA3 */ undefined,
    /* 0xA4 */ undefined,
    /* 0xA5 */ undefined,
    /* 0xA6 */ undefined,
    /* 0xA7 */ undefined,
    /* 0xA8 */ undefined,
    /* 0xA9 */ undefined,
    /* 0xAA */ undefined,
    /* 0xAB */ undefined,
    /* 0xAC */ undefined,
    /* 0xAD */ undefined,
    /* 0xAE */ undefined,
    /* 0xAF */ undefined,
    /* 0xB0 */ PUSHB.bind(undefined, 1),
    /* 0xB1 */ PUSHB.bind(undefined, 2),
    /* 0xB2 */ PUSHB.bind(undefined, 3),
    /* 0xB3 */ PUSHB.bind(undefined, 4),
    /* 0xB4 */ PUSHB.bind(undefined, 5),
    /* 0xB5 */ PUSHB.bind(undefined, 6),
    /* 0xB6 */ PUSHB.bind(undefined, 7),
    /* 0xB7 */ PUSHB.bind(undefined, 8),
    /* 0xB8 */ PUSHW.bind(undefined, 1),
    /* 0xB9 */ PUSHW.bind(undefined, 2),
    /* 0xBA */ PUSHW.bind(undefined, 3),
    /* 0xBB */ PUSHW.bind(undefined, 4),
    /* 0xBC */ PUSHW.bind(undefined, 5),
    /* 0xBD */ PUSHW.bind(undefined, 6),
    /* 0xBE */ PUSHW.bind(undefined, 7),
    /* 0xBF */ PUSHW.bind(undefined, 8),
    /* 0xC0 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 0),
    /* 0xC1 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 1),
    /* 0xC2 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 2),
    /* 0xC3 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 3),
    /* 0xC4 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 0),
    /* 0xC5 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 1),
    /* 0xC6 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 2),
    /* 0xC7 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 3),
    /* 0xC8 */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 0),
    /* 0xC9 */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 1),
    /* 0xCA */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 2),
    /* 0xCB */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 3),
    /* 0xCC */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 0),
    /* 0xCD */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 1),
    /* 0xCE */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 2),
    /* 0xCF */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 3),
    /* 0xD0 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 0),
    /* 0xD1 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 1),
    /* 0xD2 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 2),
    /* 0xD3 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 3),
    /* 0xD4 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 0),
    /* 0xD5 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 1),
    /* 0xD6 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 2),
    /* 0xD7 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 3),
    /* 0xD8 */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 0),
    /* 0xD9 */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 1),
    /* 0xDA */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 2),
    /* 0xDB */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 3),
    /* 0xDC */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 0),
    /* 0xDD */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 1),
    /* 0xDE */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 2),
    /* 0xDF */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 3),
    /* 0xE0 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 0),
    /* 0xE1 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 1),
    /* 0xE2 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 2),
    /* 0xE3 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 3),
    /* 0xE4 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 0),
    /* 0xE5 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 1),
    /* 0xE6 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 2),
    /* 0xE7 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 3),
    /* 0xE8 */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 0),
    /* 0xE9 */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 1),
    /* 0xEA */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 2),
    /* 0xEB */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 3),
    /* 0xEC */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 0),
    /* 0xED */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 1),
    /* 0xEE */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 2),
    /* 0xEF */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 3),
    /* 0xF0 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 0),
    /* 0xF1 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 1),
    /* 0xF2 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 2),
    /* 0xF3 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 3),
    /* 0xF4 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 0),
    /* 0xF5 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 1),
    /* 0xF6 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 2),
    /* 0xF7 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 3),
    /* 0xF8 */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 0),
    /* 0xF9 */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 1),
    /* 0xFA */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 2),
    /* 0xFB */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 3),
    /* 0xFC */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 0),
    /* 0xFD */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 1),
    /* 0xFE */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 2),
    /* 0xFF */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 3)
];

/*****************************
  Mathematical Considerations
******************************

fv ... refers to freedom vector
pv ... refers to projection vector
rp ... refers to reference point
p  ... refers to to point being operated on
d  ... refers to distance

SETRELATIVE:
============

case freedom vector == x-axis:
------------------------------

                        (pv)
                     .-'
              rpd .-'
               .-*
          d .-'90°'
         .-'       '
      .-'           '
   *-'               ' b
  rp                  '
                       '
                        '
            p *----------*-------------- (fv)
                          pm

  rpdx = rpx + d * pv.x
  rpdy = rpy + d * pv.y

  equation of line b

   y - rpdy = pvns * (x- rpdx)

   y = p.y

   x = rpdx + ( p.y - rpdy ) / pvns


case freedom vector == y-axis:
------------------------------

    * pm
    |\
    | \
    |  \
    |   \
    |    \
    |     \
    |      \
    |       \
    |        \
    |         \ b
    |          \
    |           \
    |            \    .-' (pv)
    |         90° \.-'
    |           .-'* rpd
    |        .-'
    *     *-'  d
    p     rp

  rpdx = rpx + d * pv.x
  rpdy = rpy + d * pv.y

  equation of line b:
           pvns ... normal slope to pv

   y - rpdy = pvns * (x - rpdx)

   x = p.x

   y = rpdy +  pvns * (p.x - rpdx)



generic case:
-------------


                              .'(fv)
                            .'
                          .* pm
                        .' !
                      .'    .
                    .'      !
                  .'         . b
                .'           !
               *              .
              p               !
                         90°   .    ... (pv)
                           ...-*-'''
                  ...---'''    rpd
         ...---'''   d
   *--'''
  rp

    rpdx = rpx + d * pv.x
    rpdy = rpy + d * pv.y

 equation of line b:
    pvns... normal slope to pv

    y - rpdy = pvns * (x - rpdx)

 equation of freedom vector line:
    fvs ... slope of freedom vector (=fy/fx)

    y - py = fvs * (x - px)


  on pm both equations are true for same x/y

    y - rpdy = pvns * (x - rpdx)

    y - py = fvs * (x - px)

  form to y and set equal:

    pvns * (x - rpdx) + rpdy = fvs * (x - px) + py

  expand:

    pvns * x - pvns * rpdx + rpdy = fvs * x - fvs * px + py

  switch:

    fvs * x - fvs * px + py = pvns * x - pvns * rpdx + rpdy

  solve for x:

    fvs * x - pvns * x = fvs * px - pvns * rpdx - py + rpdy



          fvs * px - pvns * rpdx + rpdy - py
    x =  -----------------------------------
                 fvs - pvns

  and:

    y = fvs * (x - px) + py



INTERPOLATE:
============

Examples of point interpolation.

The weight of the movement of the reference point gets bigger
the further the other reference point is away, thus the safest
option (that is avoiding 0/0 divisions) is to weight the
original distance of the other point by the sum of both distances.

If the sum of both distances is 0, then move the point by the
arithmetic average of the movement of both reference points.




           (+6)
    rp1o *---->*rp1
         .     .                          (+12)
         .     .                  rp2o *---------->* rp2
         .     .                       .           .
         .     .                       .           .
         .    10          20           .           .
         |.........|...................|           .
               .   .                               .
               .   . (+8)                          .
                po *------>*p                      .
               .           .                       .
               .    12     .          24           .
               |...........|.......................|
                                  36


-------



           (+10)
    rp1o *-------->*rp1
         .         .                      (-10)
         .         .              rp2 *<---------* rpo2
         .         .                   .         .
         .         .                   .         .
         .    10   .          30       .         .
         |.........|.............................|
                   .                   .
                   . (+5)              .
                po *--->* p            .
                   .    .              .
                   .    .   20         .
                   |....|..............|
                     5        15


-------


           (+10)
    rp1o *-------->*rp1
         .         .
         .         .
    rp2o *-------->*rp2


                               (+10)
                          po *-------->* p

-------


           (+10)
    rp1o *-------->*rp1
         .         .
         .         .(+30)
    rp2o *---------------------------->*rp2


                                        (+25)
                          po *----------------------->* p



vim: set ts=4 sw=4 expandtab:
*****/

/**
 * Converts a string into a list of tokens.
 */

/**
 * Create a new token
 * @param {string} char a single char
 */
function Token(char) {
    this.char = char;
    this.state = {};
    this.activeState = null;
}

/**
 * Create a new context range
 * @param {number} startIndex range start index
 * @param {number} endOffset range end index offset
 * @param {string} contextName owner context name
 */
function ContextRange(startIndex, endOffset, contextName) {
    this.contextName = contextName;
    this.startIndex = startIndex;
    this.endOffset = endOffset;
}

/**
 * Check context start and end
 * @param {string} contextName a unique context name
 * @param {function} checkStart a predicate function the indicates a context's start
 * @param {function} checkEnd a predicate function the indicates a context's end
 */
function ContextChecker(contextName, checkStart, checkEnd) {
    this.contextName = contextName;
    this.openRange = null;
    this.ranges = [];
    this.checkStart = checkStart;
    this.checkEnd = checkEnd;
}

/**
 * @typedef ContextParams
 * @type Object
 * @property {array} context context items
 * @property {number} currentIndex current item index
 */

/**
 * Create a context params
 * @param {array} context a list of items
 * @param {number} currentIndex current item index
 */
function ContextParams(context, currentIndex) {
    this.context = context;
    this.index = currentIndex;
    this.length = context.length;
    this.current = context[currentIndex];
    this.backtrack = context.slice(0, currentIndex);
    this.lookahead = context.slice(currentIndex + 1);
}

/**
 * Create an event instance
 * @param {string} eventId event unique id
 */
function Event(eventId) {
    this.eventId = eventId;
    this.subscribers = [];
}

/**
 * Initialize a core events and auto subscribe required event handlers
 * @param {any} events an object that enlists core events handlers
 */
function initializeCoreEvents(events) {
    var this$1$1 = this;

    var coreEvents = [
        'start', 'end', 'next', 'newToken', 'contextStart',
        'contextEnd', 'insertToken', 'removeToken', 'removeRange',
        'replaceToken', 'replaceRange', 'composeRUD', 'updateContextsRanges'
    ];

    coreEvents.forEach(function (eventId) {
        Object.defineProperty(this$1$1.events, eventId, {
            value: new Event(eventId)
        });
    });

    if (!!events) {
        coreEvents.forEach(function (eventId) {
            var event = events[eventId];
            if (typeof event === 'function') {
                this$1$1.events[eventId].subscribe(event);
            }
        });
    }
    var requiresContextUpdate = [
        'insertToken', 'removeToken', 'removeRange',
        'replaceToken', 'replaceRange', 'composeRUD'
    ];
    requiresContextUpdate.forEach(function (eventId) {
        this$1$1.events[eventId].subscribe(
            this$1$1.updateContextsRanges
        );
    });
}

/**
 * Converts a string into a list of tokens
 * @param {any} events tokenizer core events
 */
function Tokenizer(events) {
    this.tokens = [];
    this.registeredContexts = {};
    this.contextCheckers = [];
    this.events = {};
    this.registeredModifiers = [];

    initializeCoreEvents.call(this, events);
}

/**
 * Sets the state of a token, usually called by a state modifier.
 * @param {string} key state item key
 * @param {any} value state item value
 */
Token.prototype.setState = function(key, value) {
    this.state[key] = value;
    this.activeState = { key: key, value: this.state[key] };
    return this.activeState;
};

Token.prototype.getState = function (stateId) {
    return this.state[stateId] || null;
};

/**
 * Checks if an index exists in the tokens list.
 * @param {number} index token index
 */
Tokenizer.prototype.inboundIndex = function(index) {
    return index >= 0 && index < this.tokens.length;
};

/**
 * Compose and apply a list of operations (replace, update, delete)
 * @param {array} RUDs replace, update and delete operations
 * TODO: Perf. Optimization (lengthBefore === lengthAfter ? dispatch once)
 */
Tokenizer.prototype.composeRUD = function (RUDs) {
    var this$1$1 = this;

    var silent = true;
    var state = RUDs.map(function (RUD) { return (
        this$1$1[RUD[0]].apply(this$1$1, RUD.slice(1).concat(silent))
    ); });
    var hasFAILObject = function (obj) { return (
        typeof obj === 'object' &&
        obj.hasOwnProperty('FAIL')
    ); };
    if (state.every(hasFAILObject)) {
        return {
            FAIL: "composeRUD: one or more operations hasn't completed successfully",
            report: state.filter(hasFAILObject)
        };
    }
    this.dispatch('composeRUD', [state.filter(function (op) { return !hasFAILObject(op); })]);
};

/**
 * Replace a range of tokens with a list of tokens
 * @param {number} startIndex range start index
 * @param {number} offset range offset
 * @param {token} tokens a list of tokens to replace
 * @param {boolean} silent dispatch events and update context ranges
 */
Tokenizer.prototype.replaceRange = function (startIndex, offset, tokens, silent) {
    offset = offset !== null ? offset : this.tokens.length;
    var isTokenType = tokens.every(function (token) { return token instanceof Token; });
    if (!isNaN(startIndex) && this.inboundIndex(startIndex) && isTokenType) {
        var replaced = this.tokens.splice.apply(
            this.tokens, [startIndex, offset].concat(tokens)
        );
        if (!silent) { this.dispatch('replaceToken', [startIndex, offset, tokens]); }
        return [replaced, tokens];
    } else {
        return { FAIL: 'replaceRange: invalid tokens or startIndex.' };
    }
};

/**
 * Replace a token with another token
 * @param {number} index token index
 * @param {token} token a token to replace
 * @param {boolean} silent dispatch events and update context ranges
 */
Tokenizer.prototype.replaceToken = function (index, token, silent) {
    if (!isNaN(index) && this.inboundIndex(index) && token instanceof Token) {
        var replaced = this.tokens.splice(index, 1, token);
        if (!silent) { this.dispatch('replaceToken', [index, token]); }
        return [replaced[0], token];
    } else {
        return { FAIL: 'replaceToken: invalid token or index.' };
    }
};

/**
 * Removes a range of tokens
 * @param {number} startIndex range start index
 * @param {number} offset range offset
 * @param {boolean} silent dispatch events and update context ranges
 */
Tokenizer.prototype.removeRange = function(startIndex, offset, silent) {
    offset = !isNaN(offset) ? offset : this.tokens.length;
    var tokens = this.tokens.splice(startIndex, offset);
    if (!silent) { this.dispatch('removeRange', [tokens, startIndex, offset]); }
    return tokens;
};

/**
 * Remove a token at a certain index
 * @param {number} index token index
 * @param {boolean} silent dispatch events and update context ranges
 */
Tokenizer.prototype.removeToken = function(index, silent) {
    if (!isNaN(index) && this.inboundIndex(index)) {
        var token = this.tokens.splice(index, 1);
        if (!silent) { this.dispatch('removeToken', [token, index]); }
        return token;
    } else {
        return { FAIL: 'removeToken: invalid token index.' };
    }
};

/**
 * Insert a list of tokens at a certain index
 * @param {array} tokens a list of tokens to insert
 * @param {number} index insert the list of tokens at index
 * @param {boolean} silent dispatch events and update context ranges
 */
Tokenizer.prototype.insertToken = function (tokens, index, silent) {
    var tokenType = tokens.every(
        function (token) { return token instanceof Token; }
    );
    if (tokenType) {
        this.tokens.splice.apply(
            this.tokens, [index, 0].concat(tokens)
        );
        if (!silent) { this.dispatch('insertToken', [tokens, index]); }
        return tokens;
    } else {
        return { FAIL: 'insertToken: invalid token(s).' };
    }
};

/**
 * A state modifier that is called on 'newToken' event
 * @param {string} modifierId state modifier id
 * @param {function} condition a predicate function that returns true or false
 * @param {function} modifier a function to update token state
 */
Tokenizer.prototype.registerModifier = function(modifierId, condition, modifier) {
    this.events.newToken.subscribe(function(token, contextParams) {
        var conditionParams = [token, contextParams];
        var canApplyModifier = (
            condition === null ||
            condition.apply(this, conditionParams) === true
        );
        var modifierParams = [token, contextParams];
        if (canApplyModifier) {
            var newStateValue = modifier.apply(this, modifierParams);
            token.setState(modifierId, newStateValue);
        }
    });
    this.registeredModifiers.push(modifierId);
};

/**
 * Subscribe a handler to an event
 * @param {function} eventHandler an event handler function
 */
Event.prototype.subscribe = function (eventHandler) {
    if (typeof eventHandler === 'function') {
        return ((this.subscribers.push(eventHandler)) - 1);
    } else {
        return { FAIL: ("invalid '" + (this.eventId) + "' event handler")};
    }
};

/**
 * Unsubscribe an event handler
 * @param {string} subsId subscription id
 */
Event.prototype.unsubscribe = function (subsId) {
    this.subscribers.splice(subsId, 1);
};

/**
 * Sets context params current value index
 * @param {number} index context params current value index
 */
ContextParams.prototype.setCurrentIndex = function(index) {
    this.index = index;
    this.current = this.context[index];
    this.backtrack = this.context.slice(0, index);
    this.lookahead = this.context.slice(index + 1);
};

/**
 * Get an item at an offset from the current value
 * example (current value is 3):
 *  1    2   [3]   4    5   |   items values
 * -2   -1    0    1    2   |   offset values
 * @param {number} offset an offset from current value index
 */
ContextParams.prototype.get = function (offset) {
    switch (true) {
        case (offset === 0):
            return this.current;
        case (offset < 0 && Math.abs(offset) <= this.backtrack.length):
            return this.backtrack.slice(offset)[0];
        case (offset > 0 && offset <= this.lookahead.length):
            return this.lookahead[offset - 1];
        default:
            return null;
    }
};

/**
 * Converts a context range into a string value
 * @param {contextRange} range a context range
 */
Tokenizer.prototype.rangeToText = function (range) {
    if (range instanceof ContextRange) {
        return (
            this.getRangeTokens(range)
                .map(function (token) { return token.char; }).join('')
        );
    }
};

/**
 * Converts all tokens into a string
 */
Tokenizer.prototype.getText = function () {
    return this.tokens.map(function (token) { return token.char; }).join('');
};

/**
 * Get a context by name
 * @param {string} contextName context name to get
 */
Tokenizer.prototype.getContext = function (contextName) {
    var context = this.registeredContexts[contextName];
    return !!context ? context : null;
};

/**
 * Subscribes a new event handler to an event
 * @param {string} eventName event name to subscribe to
 * @param {function} eventHandler a function to be invoked on event
 */
Tokenizer.prototype.on = function(eventName, eventHandler) {
    var event = this.events[eventName];
    if (!!event) {
        return event.subscribe(eventHandler);
    } else {
        return null;
    }
};

/**
 * Dispatches an event
 * @param {string} eventName event name
 * @param {any} args event handler arguments
 */
Tokenizer.prototype.dispatch = function(eventName, args) {
    var this$1$1 = this;

    var event = this.events[eventName];
    if (event instanceof Event) {
        event.subscribers.forEach(function (subscriber) {
            subscriber.apply(this$1$1, args || []);
        });
    }
};

/**
 * Register a new context checker
 * @param {string} contextName a unique context name
 * @param {function} contextStartCheck a predicate function that returns true on context start
 * @param {function} contextEndCheck  a predicate function that returns true on context end
 * TODO: call tokenize on registration to update context ranges with the new context.
 */
Tokenizer.prototype.registerContextChecker = function(contextName, contextStartCheck, contextEndCheck) {
    if (!!this.getContext(contextName)) { return {
        FAIL:
        ("context name '" + contextName + "' is already registered.")
    }; }
    if (typeof contextStartCheck !== 'function') { return {
        FAIL:
        "missing context start check."
    }; }
    if (typeof contextEndCheck !== 'function') { return {
        FAIL:
        "missing context end check."
    }; }
    var contextCheckers = new ContextChecker(
        contextName, contextStartCheck, contextEndCheck
    );
    this.registeredContexts[contextName] = contextCheckers;
    this.contextCheckers.push(contextCheckers);
    return contextCheckers;
};

/**
 * Gets a context range tokens
 * @param {contextRange} range a context range
 */
Tokenizer.prototype.getRangeTokens = function(range) {
    var endIndex = range.startIndex + range.endOffset;
    return [].concat(
        this.tokens
            .slice(range.startIndex, endIndex)
    );
};

/**
 * Gets the ranges of a context
 * @param {string} contextName context name
 */
Tokenizer.prototype.getContextRanges = function(contextName) {
    var context = this.getContext(contextName);
    if (!!context) {
        return context.ranges;
    } else {
        return { FAIL: ("context checker '" + contextName + "' is not registered.") };
    }
};

/**
 * Resets context ranges to run context update
 */
Tokenizer.prototype.resetContextsRanges = function () {
    var registeredContexts = this.registeredContexts;
    for (var contextName in registeredContexts) {
        if (registeredContexts.hasOwnProperty(contextName)) {
            var context = registeredContexts[contextName];
            context.ranges = [];
        }
    }
};

/**
 * Updates context ranges
 */
Tokenizer.prototype.updateContextsRanges = function () {
    this.resetContextsRanges();
    var chars = this.tokens.map(function (token) { return token.char; });
    for (var i = 0; i < chars.length; i++) {
        var contextParams = new ContextParams(chars, i);
        this.runContextCheck(contextParams);
    }
    this.dispatch('updateContextsRanges', [this.registeredContexts]);
};

/**
 * Sets the end offset of an open range
 * @param {number} offset range end offset
 * @param {string} contextName context name
 */
Tokenizer.prototype.setEndOffset = function (offset, contextName) {
    var startIndex = this.getContext(contextName).openRange.startIndex;
    var range = new ContextRange(startIndex, offset, contextName);
    var ranges = this.getContext(contextName).ranges;
    range.rangeId = contextName + "." + (ranges.length);
    ranges.push(range);
    this.getContext(contextName).openRange = null;
    return range;
};

/**
 * Runs a context check on the current context
 * @param {contextParams} contextParams current context params
 */
Tokenizer.prototype.runContextCheck = function(contextParams) {
    var this$1$1 = this;

    var index = contextParams.index;
    this.contextCheckers.forEach(function (contextChecker) {
        var contextName = contextChecker.contextName;
        var openRange = this$1$1.getContext(contextName).openRange;
        if (!openRange && contextChecker.checkStart(contextParams)) {
            openRange = new ContextRange(index, null, contextName);
            this$1$1.getContext(contextName).openRange = openRange;
            this$1$1.dispatch('contextStart', [contextName, index]);
        }
        if (!!openRange && contextChecker.checkEnd(contextParams)) {
            var offset = (index - openRange.startIndex) + 1;
            var range = this$1$1.setEndOffset(offset, contextName);
            this$1$1.dispatch('contextEnd', [contextName, range]);
        }
    });
};

/**
 * Converts a text into a list of tokens
 * @param {string} text a text to tokenize
 */
Tokenizer.prototype.tokenize = function (text) {
    this.tokens = [];
    this.resetContextsRanges();
    var chars = Array.from(text);
    this.dispatch('start');
    for (var i = 0; i < chars.length; i++) {
        var char = chars[i];
        var contextParams = new ContextParams(chars, i);
        this.dispatch('next', [contextParams]);
        this.runContextCheck(contextParams);
        var token = new Token(char);
        this.tokens.push(token);
        this.dispatch('newToken', [token, contextParams]);
    }
    this.dispatch('end', [this.tokens]);
    return this.tokens;
};

// ╭─┄┄┄────────────────────────┄─────────────────────────────────────────────╮
// ┊ Character Class Assertions ┊ Checks if a char belongs to a certain class ┊
// ╰─╾──────────────────────────┄─────────────────────────────────────────────╯
// jscs:disable maximumLineLength
/**
 * Check if a char is Arabic
 * @param {string} c a single char
 */
function isArabicChar(c) {
    return /[\u0600-\u065F\u066A-\u06D2\u06FA-\u06FF]/.test(c);
}

/**
 * Check if a char is an isolated arabic char
 * @param {string} c a single char
 */
function isIsolatedArabicChar(char) {
    return /[\u0630\u0690\u0621\u0631\u0661\u0671\u0622\u0632\u0672\u0692\u06C2\u0623\u0673\u0693\u06C3\u0624\u0694\u06C4\u0625\u0675\u0695\u06C5\u06E5\u0676\u0696\u06C6\u0627\u0677\u0697\u06C7\u0648\u0688\u0698\u06C8\u0689\u0699\u06C9\u068A\u06CA\u066B\u068B\u06CB\u068C\u068D\u06CD\u06FD\u068E\u06EE\u06FE\u062F\u068F\u06CF\u06EF]/.test(char);
}

/**
 * Check if a char is an Arabic Tashkeel char
 * @param {string} c a single char
 */
function isTashkeelArabicChar(char) {
    return /[\u0600-\u0605\u060C-\u060E\u0610-\u061B\u061E\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/.test(char);
}

/**
 * Check if a char is Latin
 * @param {string} c a single char
 */
function isLatinChar(c) {
    return /[A-z]/.test(c);
}

/**
 * Check if a char is whitespace char
 * @param {string} c a single char
 */
function isWhiteSpace(c) {
    return /\s/.test(c);
}

/**
 * Query a feature by some of it's properties to lookup a glyph substitution.
 */

/**
 * Create feature query instance
 * @param {Font} font opentype font instance
 */
function FeatureQuery(font) {
    this.font = font;
    this.features = {};
}

/**
 * @typedef SubstitutionAction
 * @type Object
 * @property {number} id substitution type
 * @property {string} tag feature tag
 * @property {any} substitution substitution value(s)
 */

/**
 * Create a substitution action instance
 * @param {SubstitutionAction} action
 */
function SubstitutionAction(action) {
    this.id = action.id;
    this.tag = action.tag;
    this.substitution = action.substitution;
}

/**
 * Lookup a coverage table
 * @param {number} glyphIndex glyph index
 * @param {CoverageTable} coverage coverage table
 */
function lookupCoverage(glyphIndex, coverage) {
    if (!glyphIndex) { return -1; }
    switch (coverage.format) {
        case 1:
            return coverage.glyphs.indexOf(glyphIndex);

        case 2:
            var ranges = coverage.ranges;
            for (var i = 0; i < ranges.length; i++) {
                var range = ranges[i];
                if (glyphIndex >= range.start && glyphIndex <= range.end) {
                    var offset = glyphIndex - range.start;
                    return range.index + offset;
                }
            }
            break;
        default:
            return -1; // not found
    }
    return -1;
}

/**
 * Handle a single substitution - format 1
 * @param {ContextParams} contextParams context params to lookup
 */
function singleSubstitutionFormat1(glyphIndex, subtable) {
    var substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
    if (substituteIndex === -1) { return null; }
    return glyphIndex + subtable.deltaGlyphId;
}

/**
 * Handle a single substitution - format 2
 * @param {ContextParams} contextParams context params to lookup
 */
function singleSubstitutionFormat2(glyphIndex, subtable) {
    var substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
    if (substituteIndex === -1) { return null; }
    return subtable.substitute[substituteIndex];
}

/**
 * Lookup a list of coverage tables
 * @param {any} coverageList a list of coverage tables
 * @param {ContextParams} contextParams context params to lookup
 */
function lookupCoverageList(coverageList, contextParams) {
    var lookupList = [];
    for (var i = 0; i < coverageList.length; i++) {
        var coverage = coverageList[i];
        var glyphIndex = contextParams.current;
        glyphIndex = Array.isArray(glyphIndex) ? glyphIndex[0] : glyphIndex;
        var lookupIndex = lookupCoverage(glyphIndex, coverage);
        if (lookupIndex !== -1) {
            lookupList.push(lookupIndex);
        }
    }
    if (lookupList.length !== coverageList.length) { return -1; }
    return lookupList;
}

/**
 * Handle chaining context substitution - format 3
 * @param {ContextParams} contextParams context params to lookup
 */
function chainingSubstitutionFormat3(contextParams, subtable) {
    var lookupsCount = (
        subtable.inputCoverage.length +
        subtable.lookaheadCoverage.length +
        subtable.backtrackCoverage.length
    );
    if (contextParams.context.length < lookupsCount) { return []; }
    // INPUT LOOKUP //
    var inputLookups = lookupCoverageList(
        subtable.inputCoverage, contextParams
    );
    if (inputLookups === -1) { return []; }
    // LOOKAHEAD LOOKUP //
    var lookaheadOffset = subtable.inputCoverage.length - 1;
    if (contextParams.lookahead.length < subtable.lookaheadCoverage.length) { return []; }
    var lookaheadContext = contextParams.lookahead.slice(lookaheadOffset);
    while (lookaheadContext.length && isTashkeelArabicChar(lookaheadContext[0].char)) {
        lookaheadContext.shift();
    }
    var lookaheadParams = new ContextParams(lookaheadContext, 0);
    var lookaheadLookups = lookupCoverageList(
        subtable.lookaheadCoverage, lookaheadParams
    );
    // BACKTRACK LOOKUP //
    var backtrackContext = [].concat(contextParams.backtrack);
    backtrackContext.reverse();
    while (backtrackContext.length && isTashkeelArabicChar(backtrackContext[0].char)) {
        backtrackContext.shift();
    }
    if (backtrackContext.length < subtable.backtrackCoverage.length) { return []; }
    var backtrackParams = new ContextParams(backtrackContext, 0);
    var backtrackLookups = lookupCoverageList(
        subtable.backtrackCoverage, backtrackParams
    );
    var contextRulesMatch = (
        inputLookups.length === subtable.inputCoverage.length &&
        lookaheadLookups.length === subtable.lookaheadCoverage.length &&
        backtrackLookups.length === subtable.backtrackCoverage.length
    );
    var substitutions = [];
    if (contextRulesMatch) {
        for (var i = 0; i < subtable.lookupRecords.length; i++) {
            var lookupRecord = subtable.lookupRecords[i];
            var lookupListIndex = lookupRecord.lookupListIndex;
            var lookupTable = this.getLookupByIndex(lookupListIndex);
            for (var s = 0; s < lookupTable.subtables.length; s++) {
                var subtable$1 = lookupTable.subtables[s];
                var lookup = this.getLookupMethod(lookupTable, subtable$1);
                var substitutionType = this.getSubstitutionType(lookupTable, subtable$1);
                if (substitutionType === '12') {
                    for (var n = 0; n < inputLookups.length; n++) {
                        var glyphIndex = contextParams.get(n);
                        var substitution = lookup(glyphIndex);
                        if (substitution) { substitutions.push(substitution); }
                    }
                }
            }
        }
    }
    return substitutions;
}

/**
 * Handle ligature substitution - format 1
 * @param {ContextParams} contextParams context params to lookup
 */
function ligatureSubstitutionFormat1(contextParams, subtable) {
    // COVERAGE LOOKUP //
    var glyphIndex = contextParams.current;
    var ligSetIndex = lookupCoverage(glyphIndex, subtable.coverage);
    if (ligSetIndex === -1) { return null; }
    // COMPONENTS LOOKUP
    // (!) note, components are ordered in the written direction.
    var ligature;
    var ligatureSet = subtable.ligatureSets[ligSetIndex];
    for (var s = 0; s < ligatureSet.length; s++) {
        ligature = ligatureSet[s];
        for (var l = 0; l < ligature.components.length; l++) {
            var lookaheadItem = contextParams.lookahead[l];
            var component = ligature.components[l];
            if (lookaheadItem !== component) { break; }
            if (l === ligature.components.length - 1) { return ligature; }
        }
    }
    return null;
}

/**
 * Handle decomposition substitution - format 1
 * @param {number} glyphIndex glyph index
 * @param {any} subtable subtable
 */
function decompositionSubstitutionFormat1(glyphIndex, subtable) {
    var substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
    if (substituteIndex === -1) { return null; }
    return subtable.sequences[substituteIndex];
}

/**
 * Get default script features indexes
 */
FeatureQuery.prototype.getDefaultScriptFeaturesIndexes = function () {
    var scripts = this.font.tables.gsub.scripts;
    for (var s = 0; s < scripts.length; s++) {
        var script = scripts[s];
        if (script.tag === 'DFLT') { return (
            script.script.defaultLangSys.featureIndexes
        ); }
    }
    return [];
};

/**
 * Get feature indexes of a specific script
 * @param {string} scriptTag script tag
 */
FeatureQuery.prototype.getScriptFeaturesIndexes = function(scriptTag) {
    var tables = this.font.tables;
    if (!tables.gsub) { return []; }
    if (!scriptTag) { return this.getDefaultScriptFeaturesIndexes(); }
    var scripts = this.font.tables.gsub.scripts;
    for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];
        if (script.tag === scriptTag && script.script.defaultLangSys) {
            return script.script.defaultLangSys.featureIndexes;
        } else {
            var langSysRecords = script.langSysRecords;
            if (!!langSysRecords) {
                for (var j = 0; j < langSysRecords.length; j++) {
                    var langSysRecord = langSysRecords[j];
                    if (langSysRecord.tag === scriptTag) {
                        var langSys = langSysRecord.langSys;
                        return langSys.featureIndexes;
                    }
                }
            }
        }
    }
    return this.getDefaultScriptFeaturesIndexes();
};

/**
 * Map a feature tag to a gsub feature
 * @param {any} features gsub features
 * @param {string} scriptTag script tag
 */
FeatureQuery.prototype.mapTagsToFeatures = function (features, scriptTag) {
    var tags = {};
    for (var i = 0; i < features.length; i++) {
        var tag = features[i].tag;
        var feature = features[i].feature;
        tags[tag] = feature;
    }
    this.features[scriptTag].tags = tags;
};

/**
 * Get features of a specific script
 * @param {string} scriptTag script tag
 */
FeatureQuery.prototype.getScriptFeatures = function (scriptTag) {
    var features = this.features[scriptTag];
    if (this.features.hasOwnProperty(scriptTag)) { return features; }
    var featuresIndexes = this.getScriptFeaturesIndexes(scriptTag);
    if (!featuresIndexes) { return null; }
    var gsub = this.font.tables.gsub;
    features = featuresIndexes.map(function (index) { return gsub.features[index]; });
    this.features[scriptTag] = features;
    this.mapTagsToFeatures(features, scriptTag);
    return features;
};

/**
 * Get substitution type
 * @param {any} lookupTable lookup table
 * @param {any} subtable subtable
 */
FeatureQuery.prototype.getSubstitutionType = function(lookupTable, subtable) {
    var lookupType = lookupTable.lookupType.toString();
    var substFormat = subtable.substFormat.toString();
    return lookupType + substFormat;
};

/**
 * Get lookup method
 * @param {any} lookupTable lookup table
 * @param {any} subtable subtable
 */
FeatureQuery.prototype.getLookupMethod = function(lookupTable, subtable) {
    var this$1$1 = this;

    var substitutionType = this.getSubstitutionType(lookupTable, subtable);
    switch (substitutionType) {
        case '11':
            return function (glyphIndex) { return singleSubstitutionFormat1.apply(
                this$1$1, [glyphIndex, subtable]
            ); };
        case '12':
            return function (glyphIndex) { return singleSubstitutionFormat2.apply(
                this$1$1, [glyphIndex, subtable]
            ); };
        case '63':
            return function (contextParams) { return chainingSubstitutionFormat3.apply(
                this$1$1, [contextParams, subtable]
            ); };
        case '41':
            return function (contextParams) { return ligatureSubstitutionFormat1.apply(
                this$1$1, [contextParams, subtable]
            ); };
        case '21':
            return function (glyphIndex) { return decompositionSubstitutionFormat1.apply(
                this$1$1, [glyphIndex, subtable]
            ); };
        default:
            throw new Error(
                "lookupType: " + (lookupTable.lookupType) + " - " +
                "substFormat: " + (subtable.substFormat) + " " +
                "is not yet supported"
            );
    }
};

/**
 * [ LOOKUP TYPES ]
 * -------------------------------
 * Single                        1;
 * Multiple                      2;
 * Alternate                     3;
 * Ligature                      4;
 * Context                       5;
 * ChainingContext               6;
 * ExtensionSubstitution         7;
 * ReverseChainingContext        8;
 * -------------------------------
 *
 */

/**
 * @typedef FQuery
 * @type Object
 * @param {string} tag feature tag
 * @param {string} script feature script
 * @param {ContextParams} contextParams context params
 */

/**
 * Lookup a feature using a query parameters
 * @param {FQuery} query feature query
 */
FeatureQuery.prototype.lookupFeature = function (query) {
    var contextParams = query.contextParams;
    var currentIndex = contextParams.index;
    var feature = this.getFeature({
        tag: query.tag, script: query.script
    });
    if (!feature) { return new Error(
        "font '" + (this.font.names.fullName.en) + "' " +
        "doesn't support feature '" + (query.tag) + "' " +
        "for script '" + (query.script) + "'."
    ); }
    var lookups = this.getFeatureLookups(feature);
    var substitutions = [].concat(contextParams.context);
    for (var l = 0; l < lookups.length; l++) {
        var lookupTable = lookups[l];
        var subtables = this.getLookupSubtables(lookupTable);
        for (var s = 0; s < subtables.length; s++) {
            var subtable = subtables[s];
            var substType = this.getSubstitutionType(lookupTable, subtable);
            var lookup = this.getLookupMethod(lookupTable, subtable);
            var substitution = (void 0);
            switch (substType) {
                case '11':
                    substitution = lookup(contextParams.current);
                    if (substitution) {
                        substitutions.splice(currentIndex, 1, new SubstitutionAction({
                            id: 11, tag: query.tag, substitution: substitution
                        }));
                    }
                    break;
                case '12':
                    substitution = lookup(contextParams.current);
                    if (substitution) {
                        substitutions.splice(currentIndex, 1, new SubstitutionAction({
                            id: 12, tag: query.tag, substitution: substitution
                        }));
                    }
                    break;
                case '63':
                    substitution = lookup(contextParams);
                    if (Array.isArray(substitution) && substitution.length) {
                        substitutions.splice(currentIndex, 1, new SubstitutionAction({
                            id: 63, tag: query.tag, substitution: substitution
                        }));
                    }
                    break;
                case '41':
                    substitution = lookup(contextParams);
                    if (substitution) {
                        substitutions.splice(currentIndex, 1, new SubstitutionAction({
                            id: 41, tag: query.tag, substitution: substitution
                        }));
                    }
                    break;
                case '21':
                    substitution = lookup(contextParams.current);
                    if (substitution) {
                        substitutions.splice(currentIndex, 1, new SubstitutionAction({
                            id: 21, tag: query.tag, substitution: substitution
                        }));
                    }
                    break;
            }
            contextParams = new ContextParams(substitutions, currentIndex);
            if (Array.isArray(substitution) && !substitution.length) { continue; }
            substitution = null;
        }
    }
    return substitutions.length ? substitutions : null;
};

/**
 * Checks if a font supports a specific features
 * @param {FQuery} query feature query object
 */
FeatureQuery.prototype.supports = function (query) {
    if (!query.script) { return false; }
    this.getScriptFeatures(query.script);
    var supportedScript = this.features.hasOwnProperty(query.script);
    if (!query.tag) { return supportedScript; }
    var supportedFeature = (
        this.features[query.script].some(function (feature) { return feature.tag === query.tag; })
    );
    return supportedScript && supportedFeature;
};

/**
 * Get lookup table subtables
 * @param {any} lookupTable lookup table
 */
FeatureQuery.prototype.getLookupSubtables = function (lookupTable) {
    return lookupTable.subtables || null;
};

/**
 * Get lookup table by index
 * @param {number} index lookup table index
 */
FeatureQuery.prototype.getLookupByIndex = function (index) {
    var lookups = this.font.tables.gsub.lookups;
    return lookups[index] || null;
};

/**
 * Get lookup tables for a feature
 * @param {string} feature
 */
FeatureQuery.prototype.getFeatureLookups = function (feature) {
    // TODO: memoize
    return feature.lookupListIndexes.map(this.getLookupByIndex.bind(this));
};

/**
 * Query a feature by it's properties
 * @param {any} query an object that describes the properties of a query
 */
FeatureQuery.prototype.getFeature = function getFeature(query) {
    if (!this.font) { return { FAIL: "No font was found"}; }
    if (!this.features.hasOwnProperty(query.script)) {
        this.getScriptFeatures(query.script);
    }
    var scriptFeatures = this.features[query.script];
    if (!scriptFeatures) { return (
        { FAIL: ("No feature for script " + (query.script))}
    ); }
    if (!scriptFeatures.tags[query.tag]) { return null; }
    return this.features[query.script].tags[query.tag];
};

/**
 * Arabic word context checkers
 */

function arabicWordStartCheck(contextParams) {
    var char = contextParams.current;
    var prevChar = contextParams.get(-1);
    return (
        // ? arabic first char
        (prevChar === null && isArabicChar(char)) ||
        // ? arabic char preceded with a non arabic char
        (!isArabicChar(prevChar) && isArabicChar(char))
    );
}

function arabicWordEndCheck(contextParams) {
    var nextChar = contextParams.get(1);
    return (
        // ? last arabic char
        (nextChar === null) ||
        // ? next char is not arabic
        (!isArabicChar(nextChar))
    );
}

var arabicWordCheck = {
    startCheck: arabicWordStartCheck,
    endCheck: arabicWordEndCheck
};

/**
 * Arabic sentence context checkers
 */

function arabicSentenceStartCheck(contextParams) {
    var char = contextParams.current;
    var prevChar = contextParams.get(-1);
    return (
        // ? an arabic char preceded with a non arabic char
        (isArabicChar(char) || isTashkeelArabicChar(char)) &&
        !isArabicChar(prevChar)
    );
}

function arabicSentenceEndCheck(contextParams) {
    var nextChar = contextParams.get(1);
    switch (true) {
        case nextChar === null:
            return true;
        case (!isArabicChar(nextChar) && !isTashkeelArabicChar(nextChar)):
            var nextIsWhitespace = isWhiteSpace(nextChar);
            if (!nextIsWhitespace) { return true; }
            if (nextIsWhitespace) {
                var arabicCharAhead = false;
                arabicCharAhead = (
                    contextParams.lookahead.some(
                        function (c) { return isArabicChar(c) || isTashkeelArabicChar(c); }
                    )
                );
                if (!arabicCharAhead) { return true; }
            }
            break;
        default:
            return false;
    }
}

var arabicSentenceCheck = {
    startCheck: arabicSentenceStartCheck,
    endCheck: arabicSentenceEndCheck
};

/**
 * Apply single substitution format 1
 * @param {Array} substitutions substitutions
 * @param {any} tokens a list of tokens
 * @param {number} index token index
 */
function singleSubstitutionFormat1$1(action, tokens, index) {
    tokens[index].setState(action.tag, action.substitution);
}

/**
 * Apply single substitution format 2
 * @param {Array} substitutions substitutions
 * @param {any} tokens a list of tokens
 * @param {number} index token index
 */
function singleSubstitutionFormat2$1(action, tokens, index) {
    tokens[index].setState(action.tag, action.substitution);
}

/**
 * Apply chaining context substitution format 3
 * @param {Array} substitutions substitutions
 * @param {any} tokens a list of tokens
 * @param {number} index token index
 */
function chainingSubstitutionFormat3$1(action, tokens, index) {
    action.substitution.forEach(function (subst, offset) {
        var token = tokens[index + offset];
        token.setState(action.tag, subst);
    });
}

/**
 * Apply ligature substitution format 1
 * @param {Array} substitutions substitutions
 * @param {any} tokens a list of tokens
 * @param {number} index token index
 */
function ligatureSubstitutionFormat1$1(action, tokens, index) {
    var token = tokens[index];
    token.setState(action.tag, action.substitution.ligGlyph);
    var compsCount = action.substitution.components.length;
    for (var i = 0; i < compsCount; i++) {
        token = tokens[index + i + 1];
        token.setState('deleted', true);
    }
}

/**
 * Supported substitutions
 */
var SUBSTITUTIONS = {
    11: singleSubstitutionFormat1$1,
    12: singleSubstitutionFormat2$1,
    63: chainingSubstitutionFormat3$1,
    41: ligatureSubstitutionFormat1$1
};

/**
 * Apply substitutions to a list of tokens
 * @param {Array} substitutions substitutions
 * @param {any} tokens a list of tokens
 * @param {number} index token index
 */
function applySubstitution(action, tokens, index) {
    if (action instanceof SubstitutionAction && SUBSTITUTIONS[action.id]) {
        SUBSTITUTIONS[action.id](action, tokens, index);
    }
}

/**
 * Apply Arabic presentation forms to a range of tokens
 */

/**
 * Check if a char can be connected to it's preceding char
 * @param {ContextParams} charContextParams context params of a char
 */
function willConnectPrev(charContextParams) {
    var backtrack = [].concat(charContextParams.backtrack);
    for (var i = backtrack.length - 1; i >= 0; i--) {
        var prevChar = backtrack[i];
        var isolated = isIsolatedArabicChar(prevChar);
        var tashkeel = isTashkeelArabicChar(prevChar);
        if (!isolated && !tashkeel) { return true; }
        if (isolated) { return false; }
    }
    return false;
}

/**
 * Check if a char can be connected to it's proceeding char
 * @param {ContextParams} charContextParams context params of a char
 */
function willConnectNext(charContextParams) {
    if (isIsolatedArabicChar(charContextParams.current)) { return false; }
    for (var i = 0; i < charContextParams.lookahead.length; i++) {
        var nextChar = charContextParams.lookahead[i];
        var tashkeel = isTashkeelArabicChar(nextChar);
        if (!tashkeel) { return true; }
    }
    return false;
}

/**
 * Apply arabic presentation forms to a list of tokens
 * @param {ContextRange} range a range of tokens
 */
function arabicPresentationForms(range) {
    var this$1$1 = this;

    var script = 'arab';
    var tags = this.featuresTags[script];
    var tokens = this.tokenizer.getRangeTokens(range);
    if (tokens.length === 1) { return; }
    var contextParams = new ContextParams(
        tokens.map(function (token) { return token.getState('glyphIndex'); }
    ), 0);
    var charContextParams = new ContextParams(
        tokens.map(function (token) { return token.char; }
    ), 0);
    tokens.forEach(function (token, index) {
        if (isTashkeelArabicChar(token.char)) { return; }
        contextParams.setCurrentIndex(index);
        charContextParams.setCurrentIndex(index);
        var CONNECT = 0; // 2 bits 00 (10: can connect next) (01: can connect prev)
        if (willConnectPrev(charContextParams)) { CONNECT |= 1; }
        if (willConnectNext(charContextParams)) { CONNECT |= 2; }
        var tag;
        switch (CONNECT) {
            case 1: (tag = 'fina'); break;
            case 2: (tag = 'init'); break;
            case 3: (tag = 'medi'); break;
        }
        if (tags.indexOf(tag) === -1) { return; }
        var substitutions = this$1$1.query.lookupFeature({
            tag: tag, script: script, contextParams: contextParams
        });
        if (substitutions instanceof Error) { return console.info(substitutions.message); }
        substitutions.forEach(function (action, index) {
            if (action instanceof SubstitutionAction) {
                applySubstitution(action, tokens, index);
                contextParams.context[index] = action.substitution;
            }
        });
    });
}

/**
 * Apply Arabic required ligatures feature to a range of tokens
 */

/**
 * Update context params
 * @param {any} tokens a list of tokens
 * @param {number} index current item index
 */
function getContextParams(tokens, index) {
    var context = tokens.map(function (token) { return token.activeState.value; });
    return new ContextParams(context, 0);
}

/**
 * Apply Arabic required ligatures to a context range
 * @param {ContextRange} range a range of tokens
 */
function arabicRequiredLigatures(range) {
    var this$1$1 = this;

    var script = 'arab';
    var tokens = this.tokenizer.getRangeTokens(range);
    var contextParams = getContextParams(tokens);
    contextParams.context.forEach(function (glyphIndex, index) {
        contextParams.setCurrentIndex(index);
        var substitutions = this$1$1.query.lookupFeature({
            tag: 'rlig', script: script, contextParams: contextParams
        });
        if (substitutions.length) {
            substitutions.forEach(
                function (action) { return applySubstitution(action, tokens, index); }
            );
            contextParams = getContextParams(tokens);
        }
    });
}

/**
 * Latin word context checkers
 */

function latinWordStartCheck(contextParams) {
    var char = contextParams.current;
    var prevChar = contextParams.get(-1);
    return (
        // ? latin first char
        (prevChar === null && isLatinChar(char)) ||
        // ? latin char preceded with a non latin char
        (!isLatinChar(prevChar) && isLatinChar(char))
    );
}

function latinWordEndCheck(contextParams) {
    var nextChar = contextParams.get(1);
    return (
        // ? last latin char
        (nextChar === null) ||
        // ? next char is not latin
        (!isLatinChar(nextChar))
    );
}

var latinWordCheck = {
    startCheck: latinWordStartCheck,
    endCheck: latinWordEndCheck
};

/**
 * Apply Latin ligature feature to a range of tokens
 */

/**
 * Update context params
 * @param {any} tokens a list of tokens
 * @param {number} index current item index
 */
function getContextParams$1(tokens, index) {
    var context = tokens.map(function (token) { return token.activeState.value; });
    return new ContextParams(context, 0);
}

/**
 * Apply Arabic required ligatures to a context range
 * @param {ContextRange} range a range of tokens
 */
function latinLigature(range) {
    var this$1$1 = this;

    var script = 'latn';
    var tokens = this.tokenizer.getRangeTokens(range);
    var contextParams = getContextParams$1(tokens);
    contextParams.context.forEach(function (glyphIndex, index) {
        contextParams.setCurrentIndex(index);
        var substitutions = this$1$1.query.lookupFeature({
            tag: 'liga', script: script, contextParams: contextParams
        });
        if (substitutions.length) {
            substitutions.forEach(
                function (action) { return applySubstitution(action, tokens, index); }
            );
            contextParams = getContextParams$1(tokens);
        }
    });
}

/**
 * Infer bidirectional properties for a given text and apply
 * the corresponding layout rules.
 */

/**
 * Create Bidi. features
 * @param {string} baseDir text base direction. value either 'ltr' or 'rtl'
 */
function Bidi(baseDir) {
    this.baseDir = baseDir || 'ltr';
    this.tokenizer = new Tokenizer();
    this.featuresTags = {};
}

/**
 * Sets Bidi text
 * @param {string} text a text input
 */
Bidi.prototype.setText = function (text) {
    this.text = text;
};

/**
 * Store essential context checks:
 * arabic word check for applying gsub features
 * arabic sentence check for adjusting arabic layout
 */
Bidi.prototype.contextChecks = ({
    latinWordCheck: latinWordCheck,
    arabicWordCheck: arabicWordCheck,
    arabicSentenceCheck: arabicSentenceCheck
});

/**
 * Register arabic word check
 */
function registerContextChecker(checkId) {
    var check = this.contextChecks[(checkId + "Check")];
    return this.tokenizer.registerContextChecker(
        checkId, check.startCheck, check.endCheck
    );
}

/**
 * Perform pre tokenization procedure then
 * tokenize text input
 */
function tokenizeText() {
    registerContextChecker.call(this, 'latinWord');
    registerContextChecker.call(this, 'arabicWord');
    registerContextChecker.call(this, 'arabicSentence');
    return this.tokenizer.tokenize(this.text);
}

/**
 * Reverse arabic sentence layout
 * TODO: check base dir before applying adjustments - priority low
 */
function reverseArabicSentences() {
    var this$1$1 = this;

    var ranges = this.tokenizer.getContextRanges('arabicSentence');
    ranges.forEach(function (range) {
        var rangeTokens = this$1$1.tokenizer.getRangeTokens(range);
        this$1$1.tokenizer.replaceRange(
            range.startIndex,
            range.endOffset,
            rangeTokens.reverse()
        );
    });
}

/**
 * Register supported features tags
 * @param {script} script script tag
 * @param {Array} tags features tags list
 */
Bidi.prototype.registerFeatures = function (script, tags) {
    var this$1$1 = this;

    var supportedTags = tags.filter(
        function (tag) { return this$1$1.query.supports({script: script, tag: tag}); }
    );
    if (!this.featuresTags.hasOwnProperty(script)) {
        this.featuresTags[script] = supportedTags;
    } else {
        this.featuresTags[script] =
        this.featuresTags[script].concat(supportedTags);
    }
};

/**
 * Apply GSUB features
 * @param {Array} tagsList a list of features tags
 * @param {string} script a script tag
 * @param {Font} font opentype font instance
 */
Bidi.prototype.applyFeatures = function (font, features) {
    if (!font) { throw new Error(
        'No valid font was provided to apply features'
    ); }
    if (!this.query) { this.query = new FeatureQuery(font); }
    for (var f = 0; f < features.length; f++) {
        var feature = features[f];
        if (!this.query.supports({script: feature.script})) { continue; }
        this.registerFeatures(feature.script, feature.tags);
    }
};

/**
 * Register a state modifier
 * @param {string} modifierId state modifier id
 * @param {function} condition a predicate function that returns true or false
 * @param {function} modifier a modifier function to set token state
 */
Bidi.prototype.registerModifier = function (modifierId, condition, modifier) {
    this.tokenizer.registerModifier(modifierId, condition, modifier);
};

/**
 * Check if 'glyphIndex' is registered
 */
function checkGlyphIndexStatus() {
    if (this.tokenizer.registeredModifiers.indexOf('glyphIndex') === -1) {
        throw new Error(
            'glyphIndex modifier is required to apply ' +
            'arabic presentation features.'
        );
    }
}

/**
 * Apply arabic presentation forms features
 */
function applyArabicPresentationForms() {
    var this$1$1 = this;

    var script = 'arab';
    if (!this.featuresTags.hasOwnProperty(script)) { return; }
    checkGlyphIndexStatus.call(this);
    var ranges = this.tokenizer.getContextRanges('arabicWord');
    ranges.forEach(function (range) {
        arabicPresentationForms.call(this$1$1, range);
    });
}

/**
 * Apply required arabic ligatures
 */
function applyArabicRequireLigatures() {
    var this$1$1 = this;

    var script = 'arab';
    if (!this.featuresTags.hasOwnProperty(script)) { return; }
    var tags = this.featuresTags[script];
    if (tags.indexOf('rlig') === -1) { return; }
    checkGlyphIndexStatus.call(this);
    var ranges = this.tokenizer.getContextRanges('arabicWord');
    ranges.forEach(function (range) {
        arabicRequiredLigatures.call(this$1$1, range);
    });
}

/**
 * Apply required arabic ligatures
 */
function applyLatinLigatures() {
    var this$1$1 = this;

    var script = 'latn';
    if (!this.featuresTags.hasOwnProperty(script)) { return; }
    var tags = this.featuresTags[script];
    if (tags.indexOf('liga') === -1) { return; }
    checkGlyphIndexStatus.call(this);
    var ranges = this.tokenizer.getContextRanges('latinWord');
    ranges.forEach(function (range) {
        latinLigature.call(this$1$1, range);
    });
}

/**
 * Check if a context is registered
 * @param {string} contextId context id
 */
Bidi.prototype.checkContextReady = function (contextId) {
    return !!this.tokenizer.getContext(contextId);
};

/**
 * Apply features to registered contexts
 */
Bidi.prototype.applyFeaturesToContexts = function () {
    if (this.checkContextReady('arabicWord')) {
        applyArabicPresentationForms.call(this);
        applyArabicRequireLigatures.call(this);
    }
    if (this.checkContextReady('latinWord')) {
        applyLatinLigatures.call(this);
    }
    if (this.checkContextReady('arabicSentence')) {
        reverseArabicSentences.call(this);
    }
};

/**
 * process text input
 * @param {string} text an input text
 */
Bidi.prototype.processText = function(text) {
    if (!this.text || this.text !== text) {
        this.setText(text);
        tokenizeText.call(this);
        this.applyFeaturesToContexts();
    }
};

/**
 * Process a string of text to identify and adjust
 * bidirectional text entities.
 * @param {string} text input text
 */
Bidi.prototype.getBidiText = function (text) {
    this.processText(text);
    return this.tokenizer.getText();
};

/**
 * Get the current state index of each token
 * @param {text} text an input text
 */
Bidi.prototype.getTextGlyphs = function (text) {
    this.processText(text);
    var indexes = [];
    for (var i = 0; i < this.tokenizer.tokens.length; i++) {
        var token = this.tokenizer.tokens[i];
        if (token.state.deleted) { continue; }
        var index = token.activeState.value;
        indexes.push(Array.isArray(index) ? index[0] : index);
    }
    return indexes;
};

// The Font object

/**
 * @typedef FontOptions
 * @type Object
 * @property {Boolean} empty - whether to create a new empty font
 * @property {string} familyName
 * @property {string} styleName
 * @property {string=} fullName
 * @property {string=} postScriptName
 * @property {string=} designer
 * @property {string=} designerURL
 * @property {string=} manufacturer
 * @property {string=} manufacturerURL
 * @property {string=} license
 * @property {string=} licenseURL
 * @property {string=} version
 * @property {string=} description
 * @property {string=} copyright
 * @property {string=} trademark
 * @property {Number} unitsPerEm
 * @property {Number} ascender
 * @property {Number} descender
 * @property {Number} createdTimestamp
 * @property {string=} weightClass
 * @property {string=} widthClass
 * @property {string=} fsSelection
 */

/**
 * A Font represents a loaded OpenType font file.
 * It contains a set of glyphs and methods to draw text on a drawing context,
 * or to get a path representing the text.
 * @exports opentype.Font
 * @class
 * @param {FontOptions}
 * @constructor
 */
function Font(options) {
    options = options || {};
    options.tables = options.tables || {};

    if (!options.empty) {
        // Check that we've provided the minimum set of names.
        checkArgument(options.familyName, 'When creating a new Font object, familyName is required.');
        checkArgument(options.styleName, 'When creating a new Font object, styleName is required.');
        checkArgument(options.unitsPerEm, 'When creating a new Font object, unitsPerEm is required.');
        checkArgument(options.ascender, 'When creating a new Font object, ascender is required.');
        checkArgument(options.descender <= 0, 'When creating a new Font object, negative descender value is required.');

        // OS X will complain if the names are empty, so we put a single space everywhere by default.
        this.names = {
            fontFamily: {en: options.familyName || ' '},
            fontSubfamily: {en: options.styleName || ' '},
            fullName: {en: options.fullName || options.familyName + ' ' + options.styleName},
            // postScriptName may not contain any whitespace
            postScriptName: {en: options.postScriptName || (options.familyName + options.styleName).replace(/\s/g, '')},
            designer: {en: options.designer || ' '},
            designerURL: {en: options.designerURL || ' '},
            manufacturer: {en: options.manufacturer || ' '},
            manufacturerURL: {en: options.manufacturerURL || ' '},
            license: {en: options.license || ' '},
            licenseURL: {en: options.licenseURL || ' '},
            version: {en: options.version || 'Version 0.1'},
            description: {en: options.description || ' '},
            copyright: {en: options.copyright || ' '},
            trademark: {en: options.trademark || ' '}
        };
        this.unitsPerEm = options.unitsPerEm || 1000;
        this.ascender = options.ascender;
        this.descender = options.descender;
        this.createdTimestamp = options.createdTimestamp;
        this.tables = Object.assign(options.tables, {
            os2: Object.assign({
                usWeightClass: options.weightClass || this.usWeightClasses.MEDIUM,
                usWidthClass: options.widthClass || this.usWidthClasses.MEDIUM,
                fsSelection: options.fsSelection || this.fsSelectionValues.REGULAR,
            }, options.tables.os2)
        });
    }

    this.supported = true; // Deprecated: parseBuffer will throw an error if font is not supported.
    this.glyphs = new glyphset.GlyphSet(this, options.glyphs || []);
    this.encoding = new DefaultEncoding(this);
    this.position = new Position(this);
    this.substitution = new Substitution(this);
    this.tables = this.tables || {};

    // needed for low memory mode only.
    this._push = null;
    this._hmtxTableData = {};

    Object.defineProperty(this, 'hinting', {
        get: function() {
            if (this._hinting) { return this._hinting; }
            if (this.outlinesFormat === 'truetype') {
                return (this._hinting = new Hinting(this));
            }
        }
    });
}

/**
 * Check if the font has a glyph for the given character.
 * @param  {string}
 * @return {Boolean}
 */
Font.prototype.hasChar = function(c) {
    return this.encoding.charToGlyphIndex(c) !== null;
};

/**
 * Convert the given character to a single glyph index.
 * Note that this function assumes that there is a one-to-one mapping between
 * the given character and a glyph; for complex scripts this might not be the case.
 * @param  {string}
 * @return {Number}
 */
Font.prototype.charToGlyphIndex = function(s) {
    return this.encoding.charToGlyphIndex(s);
};

/**
 * Convert the given character to a single Glyph object.
 * Note that this function assumes that there is a one-to-one mapping between
 * the given character and a glyph; for complex scripts this might not be the case.
 * @param  {string}
 * @return {opentype.Glyph}
 */
Font.prototype.charToGlyph = function(c) {
    var glyphIndex = this.charToGlyphIndex(c);
    var glyph = this.glyphs.get(glyphIndex);
    if (!glyph) {
        // .notdef
        glyph = this.glyphs.get(0);
    }

    return glyph;
};

/**
 * Update features
 * @param {any} options features options
 */
Font.prototype.updateFeatures = function (options) {
    // TODO: update all features options not only 'latn'.
    return this.defaultRenderOptions.features.map(function (feature) {
        if (feature.script === 'latn') {
            return {
                script: 'latn',
                tags: feature.tags.filter(function (tag) { return options[tag]; })
            };
        } else {
            return feature;
        }
    });
};

/**
 * Convert the given text to a list of Glyph objects.
 * Note that there is no strict one-to-one mapping between characters and
 * glyphs, so the list of returned glyphs can be larger or smaller than the
 * length of the given string.
 * @param  {string}
 * @param  {GlyphRenderOptions} [options]
 * @return {opentype.Glyph[]}
 */
Font.prototype.stringToGlyphs = function(s, options) {
    var this$1$1 = this;


    var bidi = new Bidi();

    // Create and register 'glyphIndex' state modifier
    var charToGlyphIndexMod = function (token) { return this$1$1.charToGlyphIndex(token.char); };
    bidi.registerModifier('glyphIndex', null, charToGlyphIndexMod);

    // roll-back to default features
    var features = options ?
    this.updateFeatures(options.features) :
    this.defaultRenderOptions.features;

    bidi.applyFeatures(this, features);

    var indexes = bidi.getTextGlyphs(s);

    var length = indexes.length;

    // convert glyph indexes to glyph objects
    var glyphs = new Array(length);
    var notdef = this.glyphs.get(0);
    for (var i = 0; i < length; i += 1) {
        glyphs[i] = this.glyphs.get(indexes[i]) || notdef;
    }
    return glyphs;
};

/**
 * @param  {string}
 * @return {Number}
 */
Font.prototype.nameToGlyphIndex = function(name) {
    return this.glyphNames.nameToGlyphIndex(name);
};

/**
 * @param  {string}
 * @return {opentype.Glyph}
 */
Font.prototype.nameToGlyph = function(name) {
    var glyphIndex = this.nameToGlyphIndex(name);
    var glyph = this.glyphs.get(glyphIndex);
    if (!glyph) {
        // .notdef
        glyph = this.glyphs.get(0);
    }

    return glyph;
};

/**
 * @param  {Number}
 * @return {String}
 */
Font.prototype.glyphIndexToName = function(gid) {
    if (!this.glyphNames.glyphIndexToName) {
        return '';
    }

    return this.glyphNames.glyphIndexToName(gid);
};

/**
 * Retrieve the value of the kerning pair between the left glyph (or its index)
 * and the right glyph (or its index). If no kerning pair is found, return 0.
 * The kerning value gets added to the advance width when calculating the spacing
 * between glyphs.
 * For GPOS kerning, this method uses the default script and language, which covers
 * most use cases. To have greater control, use font.position.getKerningValue .
 * @param  {opentype.Glyph} leftGlyph
 * @param  {opentype.Glyph} rightGlyph
 * @return {Number}
 */
Font.prototype.getKerningValue = function(leftGlyph, rightGlyph) {
    leftGlyph = leftGlyph.index || leftGlyph;
    rightGlyph = rightGlyph.index || rightGlyph;
    var gposKerning = this.position.defaultKerningTables;
    if (gposKerning) {
        return this.position.getKerningValue(gposKerning, leftGlyph, rightGlyph);
    }
    // "kern" table
    return this.kerningPairs[leftGlyph + ',' + rightGlyph] || 0;
};

/**
 * @typedef GlyphRenderOptions
 * @type Object
 * @property {string} [script] - script used to determine which features to apply. By default, 'DFLT' or 'latn' is used.
 *                               See https://www.microsoft.com/typography/otspec/scripttags.htm
 * @property {string} [language='dflt'] - language system used to determine which features to apply.
 *                                        See https://www.microsoft.com/typography/developers/opentype/languagetags.aspx
 * @property {boolean} [kerning=true] - whether to include kerning values
 * @property {object} [features] - OpenType Layout feature tags. Used to enable or disable the features of the given script/language system.
 *                                 See https://www.microsoft.com/typography/otspec/featuretags.htm
 */
Font.prototype.defaultRenderOptions = {
    kerning: true,
    features: [
        /**
         * these 4 features are required to render Arabic text properly
         * and shouldn't be turned off when rendering arabic text.
         */
        { script: 'arab', tags: ['init', 'medi', 'fina', 'rlig'] },
        { script: 'latn', tags: ['liga', 'rlig'] }
    ]
};

/**
 * Helper function that invokes the given callback for each glyph in the given text.
 * The callback gets `(glyph, x, y, fontSize, options)`.* @param  {string} text
 * @param {string} text - The text to apply.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 * @param  {Function} callback
 */
Font.prototype.forEachGlyph = function(text, x, y, fontSize, options, callback) {
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize !== undefined ? fontSize : 72;
    options = Object.assign({}, this.defaultRenderOptions, options);
    var fontScale = 1 / this.unitsPerEm * fontSize;
    var glyphs = this.stringToGlyphs(text, options);
    var kerningLookups;
    if (options.kerning) {
        var script = options.script || this.position.getDefaultScriptName();
        kerningLookups = this.position.getKerningTables(script, options.language);
    }
    for (var i = 0; i < glyphs.length; i += 1) {
        var glyph = glyphs[i];
        callback.call(this, glyph, x, y, fontSize, options);
        if (glyph.advanceWidth) {
            x += glyph.advanceWidth * fontScale;
        }

        if (options.kerning && i < glyphs.length - 1) {
            // We should apply position adjustment lookups in a more generic way.
            // Here we only use the xAdvance value.
            var kerningValue = kerningLookups ?
                  this.position.getKerningValue(kerningLookups, glyph.index, glyphs[i + 1].index) :
                  this.getKerningValue(glyph, glyphs[i + 1]);
            x += kerningValue * fontScale;
        }

        if (options.letterSpacing) {
            x += options.letterSpacing * fontSize;
        } else if (options.tracking) {
            x += (options.tracking / 1000) * fontSize;
        }
    }
    return x;
};

/**
 * Create a Path object that represents the given text.
 * @param  {string} text - The text to create.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 * @return {opentype.Path}
 */
Font.prototype.getPath = function(text, x, y, fontSize, options) {
    var fullPath = new Path();
    this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
        var glyphPath = glyph.getPath(gX, gY, gFontSize, options, this);
        fullPath.extend(glyphPath);
    });
    return fullPath;
};

/**
 * Create an array of Path objects that represent the glyphs of a given text.
 * @param  {string} text - The text to create.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 * @return {opentype.Path[]}
 */
Font.prototype.getPaths = function(text, x, y, fontSize, options) {
    var glyphPaths = [];
    this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
        var glyphPath = glyph.getPath(gX, gY, gFontSize, options, this);
        glyphPaths.push(glyphPath);
    });

    return glyphPaths;
};

/**
 * Returns the advance width of a text.
 *
 * This is something different than Path.getBoundingBox() as for example a
 * suffixed whitespace increases the advanceWidth but not the bounding box
 * or an overhanging letter like a calligraphic 'f' might have a quite larger
 * bounding box than its advance width.
 *
 * This corresponds to canvas2dContext.measureText(text).width
 *
 * @param  {string} text - The text to create.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 * @return advance width
 */
Font.prototype.getAdvanceWidth = function(text, fontSize, options) {
    return this.forEachGlyph(text, 0, 0, fontSize, options, function() {});
};

/**
 * Draw the text on the given drawing context.
 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param  {string} text - The text to create.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 */
Font.prototype.draw = function(ctx, text, x, y, fontSize, options) {
    this.getPath(text, x, y, fontSize, options).draw(ctx);
};

/**
 * Draw the points of all glyphs in the text.
 * On-curve points will be drawn in blue, off-curve points will be drawn in red.
 * @param {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param {string} text - The text to create.
 * @param {number} [x=0] - Horizontal position of the beginning of the text.
 * @param {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param {GlyphRenderOptions=} options
 */
Font.prototype.drawPoints = function(ctx, text, x, y, fontSize, options) {
    this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
        glyph.drawPoints(ctx, gX, gY, gFontSize);
    });
};

/**
 * Draw lines indicating important font measurements for all glyphs in the text.
 * Black lines indicate the origin of the coordinate system (point 0,0).
 * Blue lines indicate the glyph bounding box.
 * Green line indicates the advance width of the glyph.
 * @param {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param {string} text - The text to create.
 * @param {number} [x=0] - Horizontal position of the beginning of the text.
 * @param {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param {GlyphRenderOptions=} options
 */
Font.prototype.drawMetrics = function(ctx, text, x, y, fontSize, options) {
    this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
        glyph.drawMetrics(ctx, gX, gY, gFontSize);
    });
};

/**
 * @param  {string}
 * @return {string}
 */
Font.prototype.getEnglishName = function(name) {
    var translations = this.names[name];
    if (translations) {
        return translations.en;
    }
};

/**
 * Validate
 */
Font.prototype.validate = function() {
    var _this = this;

    function assert(predicate, message) {
    }

    function assertNamePresent(name) {
        var englishName = _this.getEnglishName(name);
        assert(englishName && englishName.trim().length > 0);
    }

    // Identification information
    assertNamePresent('fontFamily');
    assertNamePresent('weightName');
    assertNamePresent('manufacturer');
    assertNamePresent('copyright');
    assertNamePresent('version');

    // Dimension information
    assert(this.unitsPerEm > 0);
};

/**
 * Convert the font object to a SFNT data structure.
 * This structure contains all the necessary tables and metadata to create a binary OTF file.
 * @return {opentype.Table}
 */
Font.prototype.toTables = function() {
    return sfnt.fontToTable(this);
};
/**
 * @deprecated Font.toBuffer is deprecated. Use Font.toArrayBuffer instead.
 */
Font.prototype.toBuffer = function() {
    console.warn('Font.toBuffer is deprecated. Use Font.toArrayBuffer instead.');
    return this.toArrayBuffer();
};
/**
 * Converts a `opentype.Font` into an `ArrayBuffer`
 * @return {ArrayBuffer}
 */
Font.prototype.toArrayBuffer = function() {
    var sfntTable = this.toTables();
    var bytes = sfntTable.encode();
    var buffer = new ArrayBuffer(bytes.length);
    var intArray = new Uint8Array(buffer);
    for (var i = 0; i < bytes.length; i++) {
        intArray[i] = bytes[i];
    }

    return buffer;
};

/**
 * Initiate a download of the OpenType font.
 */
Font.prototype.download = function(fileName) {
    var familyName = this.getEnglishName('fontFamily');
    var styleName = this.getEnglishName('fontSubfamily');
    fileName = fileName || familyName.replace(/\s/g, '') + '-' + styleName + '.otf';
    var arrayBuffer = this.toArrayBuffer();

    if (isBrowser()) {
        window.URL = window.URL || window.webkitURL;

        if (window.URL) {
            var dataView = new DataView(arrayBuffer);
            var blob = new Blob([dataView], {type: 'font/opentype'});

            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;

            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, false);
            link.dispatchEvent(event);
        } else {
            console.warn('Font file could not be downloaded. Try using a different browser.');
        }
    } else {
        var fs = require('fs');
        var buffer = arrayBufferToNodeBuffer(arrayBuffer);
        fs.writeFileSync(fileName, buffer);
    }
};
/**
 * @private
 */
Font.prototype.fsSelectionValues = {
    ITALIC:              0x001, //1
    UNDERSCORE:          0x002, //2
    NEGATIVE:            0x004, //4
    OUTLINED:            0x008, //8
    STRIKEOUT:           0x010, //16
    BOLD:                0x020, //32
    REGULAR:             0x040, //64
    USER_TYPO_METRICS:   0x080, //128
    WWS:                 0x100, //256
    OBLIQUE:             0x200  //512
};

/**
 * @private
 */
Font.prototype.usWidthClasses = {
    ULTRA_CONDENSED: 1,
    EXTRA_CONDENSED: 2,
    CONDENSED: 3,
    SEMI_CONDENSED: 4,
    MEDIUM: 5,
    SEMI_EXPANDED: 6,
    EXPANDED: 7,
    EXTRA_EXPANDED: 8,
    ULTRA_EXPANDED: 9
};

/**
 * @private
 */
Font.prototype.usWeightClasses = {
    THIN: 100,
    EXTRA_LIGHT: 200,
    LIGHT: 300,
    NORMAL: 400,
    MEDIUM: 500,
    SEMI_BOLD: 600,
    BOLD: 700,
    EXTRA_BOLD: 800,
    BLACK:    900
};

// The `fvar` table stores font variation axes and instances.

function addName(name, names) {
    var nameString = JSON.stringify(name);
    var nameID = 256;
    for (var nameKey in names) {
        var n = parseInt(nameKey);
        if (!n || n < 256) {
            continue;
        }

        if (JSON.stringify(names[nameKey]) === nameString) {
            return n;
        }

        if (nameID <= n) {
            nameID = n + 1;
        }
    }

    names[nameID] = name;
    return nameID;
}

function makeFvarAxis(n, axis, names) {
    var nameID = addName(axis.name, names);
    return [
        {name: 'tag_' + n, type: 'TAG', value: axis.tag},
        {name: 'minValue_' + n, type: 'FIXED', value: axis.minValue << 16},
        {name: 'defaultValue_' + n, type: 'FIXED', value: axis.defaultValue << 16},
        {name: 'maxValue_' + n, type: 'FIXED', value: axis.maxValue << 16},
        {name: 'flags_' + n, type: 'USHORT', value: 0},
        {name: 'nameID_' + n, type: 'USHORT', value: nameID}
    ];
}

function parseFvarAxis(data, start, names) {
    var axis = {};
    var p = new parse.Parser(data, start);
    axis.tag = p.parseTag();
    axis.minValue = p.parseFixed();
    axis.defaultValue = p.parseFixed();
    axis.maxValue = p.parseFixed();
    p.skip('uShort', 1);  // reserved for flags; no values defined
    axis.name = names[p.parseUShort()] || {};
    return axis;
}

function makeFvarInstance(n, inst, axes, names) {
    var nameID = addName(inst.name, names);
    var fields = [
        {name: 'nameID_' + n, type: 'USHORT', value: nameID},
        {name: 'flags_' + n, type: 'USHORT', value: 0}
    ];

    for (var i = 0; i < axes.length; ++i) {
        var axisTag = axes[i].tag;
        fields.push({
            name: 'axis_' + n + ' ' + axisTag,
            type: 'FIXED',
            value: inst.coordinates[axisTag] << 16
        });
    }

    return fields;
}

function parseFvarInstance(data, start, axes, names) {
    var inst = {};
    var p = new parse.Parser(data, start);
    inst.name = names[p.parseUShort()] || {};
    p.skip('uShort', 1);  // reserved for flags; no values defined

    inst.coordinates = {};
    for (var i = 0; i < axes.length; ++i) {
        inst.coordinates[axes[i].tag] = p.parseFixed();
    }

    return inst;
}

function makeFvarTable(fvar, names) {
    var result = new table.Table('fvar', [
        {name: 'version', type: 'ULONG', value: 0x10000},
        {name: 'offsetToData', type: 'USHORT', value: 0},
        {name: 'countSizePairs', type: 'USHORT', value: 2},
        {name: 'axisCount', type: 'USHORT', value: fvar.axes.length},
        {name: 'axisSize', type: 'USHORT', value: 20},
        {name: 'instanceCount', type: 'USHORT', value: fvar.instances.length},
        {name: 'instanceSize', type: 'USHORT', value: 4 + fvar.axes.length * 4}
    ]);
    result.offsetToData = result.sizeOf();

    for (var i = 0; i < fvar.axes.length; i++) {
        result.fields = result.fields.concat(makeFvarAxis(i, fvar.axes[i], names));
    }

    for (var j = 0; j < fvar.instances.length; j++) {
        result.fields = result.fields.concat(makeFvarInstance(j, fvar.instances[j], fvar.axes, names));
    }

    return result;
}

function parseFvarTable(data, start, names) {
    var p = new parse.Parser(data, start);
    var tableVersion = p.parseULong();
    check.argument(tableVersion === 0x00010000, 'Unsupported fvar table version.');
    var offsetToData = p.parseOffset16();
    // Skip countSizePairs.
    p.skip('uShort', 1);
    var axisCount = p.parseUShort();
    var axisSize = p.parseUShort();
    var instanceCount = p.parseUShort();
    var instanceSize = p.parseUShort();

    var axes = [];
    for (var i = 0; i < axisCount; i++) {
        axes.push(parseFvarAxis(data, start + offsetToData + i * axisSize, names));
    }

    var instances = [];
    var instanceStart = start + offsetToData + axisCount * axisSize;
    for (var j = 0; j < instanceCount; j++) {
        instances.push(parseFvarInstance(data, instanceStart + j * instanceSize, axes, names));
    }

    return {axes: axes, instances: instances};
}

var fvar = { make: makeFvarTable, parse: parseFvarTable };

// The `GDEF` table contains various glyph properties

var attachList = function() {
    return {
        coverage: this.parsePointer(Parser.coverage),
        attachPoints: this.parseList(Parser.pointer(Parser.uShortList))
    };
};

var caretValue = function() {
    var format = this.parseUShort();
    check.argument(format === 1 || format === 2 || format === 3,
        'Unsupported CaretValue table version.');
    if (format === 1) {
        return { coordinate: this.parseShort() };
    } else if (format === 2) {
        return { pointindex: this.parseShort() };
    } else if (format === 3) {
        // Device / Variation Index tables unsupported
        return { coordinate: this.parseShort() };
    }
};

var ligGlyph = function() {
    return this.parseList(Parser.pointer(caretValue));
};

var ligCaretList = function() {
    return {
        coverage: this.parsePointer(Parser.coverage),
        ligGlyphs: this.parseList(Parser.pointer(ligGlyph))
    };
};

var markGlyphSets = function() {
    this.parseUShort(); // Version
    return this.parseList(Parser.pointer(Parser.coverage));
};

function parseGDEFTable(data, start) {
    start = start || 0;
    var p = new Parser(data, start);
    var tableVersion = p.parseVersion(1);
    check.argument(tableVersion === 1 || tableVersion === 1.2 || tableVersion === 1.3,
        'Unsupported GDEF table version.');
    var gdef = {
        version: tableVersion,
        classDef: p.parsePointer(Parser.classDef),
        attachList: p.parsePointer(attachList),
        ligCaretList: p.parsePointer(ligCaretList),
        markAttachClassDef: p.parsePointer(Parser.classDef)
    };
    if (tableVersion >= 1.2) {
        gdef.markGlyphSets = p.parsePointer(markGlyphSets);
    }
    return gdef;
}
var gdef = { parse: parseGDEFTable };

// The `GPOS` table contains kerning pairs, among other things.

var subtableParsers$1 = new Array(10);         // subtableParsers[0] is unused

// https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#lookup-type-1-single-adjustment-positioning-subtable
// this = Parser instance
subtableParsers$1[1] = function parseLookup1() {
    var start = this.offset + this.relativeOffset;
    var posformat = this.parseUShort();
    if (posformat === 1) {
        return {
            posFormat: 1,
            coverage: this.parsePointer(Parser.coverage),
            value: this.parseValueRecord()
        };
    } else if (posformat === 2) {
        return {
            posFormat: 2,
            coverage: this.parsePointer(Parser.coverage),
            values: this.parseValueRecordList()
        };
    }
    check.assert(false, '0x' + start.toString(16) + ': GPOS lookup type 1 format must be 1 or 2.');
};

// https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#lookup-type-2-pair-adjustment-positioning-subtable
subtableParsers$1[2] = function parseLookup2() {
    var start = this.offset + this.relativeOffset;
    var posFormat = this.parseUShort();
    check.assert(posFormat === 1 || posFormat === 2, '0x' + start.toString(16) + ': GPOS lookup type 2 format must be 1 or 2.');
    var coverage = this.parsePointer(Parser.coverage);
    var valueFormat1 = this.parseUShort();
    var valueFormat2 = this.parseUShort();
    if (posFormat === 1) {
        // Adjustments for Glyph Pairs
        return {
            posFormat: posFormat,
            coverage: coverage,
            valueFormat1: valueFormat1,
            valueFormat2: valueFormat2,
            pairSets: this.parseList(Parser.pointer(Parser.list(function() {
                return {        // pairValueRecord
                    secondGlyph: this.parseUShort(),
                    value1: this.parseValueRecord(valueFormat1),
                    value2: this.parseValueRecord(valueFormat2)
                };
            })))
        };
    } else if (posFormat === 2) {
        var classDef1 = this.parsePointer(Parser.classDef);
        var classDef2 = this.parsePointer(Parser.classDef);
        var class1Count = this.parseUShort();
        var class2Count = this.parseUShort();
        return {
            // Class Pair Adjustment
            posFormat: posFormat,
            coverage: coverage,
            valueFormat1: valueFormat1,
            valueFormat2: valueFormat2,
            classDef1: classDef1,
            classDef2: classDef2,
            class1Count: class1Count,
            class2Count: class2Count,
            classRecords: this.parseList(class1Count, Parser.list(class2Count, function() {
                return {
                    value1: this.parseValueRecord(valueFormat1),
                    value2: this.parseValueRecord(valueFormat2)
                };
            }))
        };
    }
};

subtableParsers$1[3] = function parseLookup3() { return { error: 'GPOS Lookup 3 not supported' }; };
subtableParsers$1[4] = function parseLookup4() { return { error: 'GPOS Lookup 4 not supported' }; };
subtableParsers$1[5] = function parseLookup5() { return { error: 'GPOS Lookup 5 not supported' }; };
subtableParsers$1[6] = function parseLookup6() { return { error: 'GPOS Lookup 6 not supported' }; };
subtableParsers$1[7] = function parseLookup7() { return { error: 'GPOS Lookup 7 not supported' }; };
subtableParsers$1[8] = function parseLookup8() { return { error: 'GPOS Lookup 8 not supported' }; };
subtableParsers$1[9] = function parseLookup9() { return { error: 'GPOS Lookup 9 not supported' }; };

// https://docs.microsoft.com/en-us/typography/opentype/spec/gpos
function parseGposTable(data, start) {
    start = start || 0;
    var p = new Parser(data, start);
    var tableVersion = p.parseVersion(1);
    check.argument(tableVersion === 1 || tableVersion === 1.1, 'Unsupported GPOS table version ' + tableVersion);

    if (tableVersion === 1) {
        return {
            version: tableVersion,
            scripts: p.parseScriptList(),
            features: p.parseFeatureList(),
            lookups: p.parseLookupList(subtableParsers$1)
        };
    } else {
        return {
            version: tableVersion,
            scripts: p.parseScriptList(),
            features: p.parseFeatureList(),
            lookups: p.parseLookupList(subtableParsers$1),
            variations: p.parseFeatureVariationsList()
        };
    }

}

// GPOS Writing //////////////////////////////////////////////
// NOT SUPPORTED
var subtableMakers$1 = new Array(10);

function makeGposTable(gpos) {
    return new table.Table('GPOS', [
        {name: 'version', type: 'ULONG', value: 0x10000},
        {name: 'scripts', type: 'TABLE', value: new table.ScriptList(gpos.scripts)},
        {name: 'features', type: 'TABLE', value: new table.FeatureList(gpos.features)},
        {name: 'lookups', type: 'TABLE', value: new table.LookupList(gpos.lookups, subtableMakers$1)}
    ]);
}

var gpos = { parse: parseGposTable, make: makeGposTable };

// The `kern` table contains kerning pairs.

function parseWindowsKernTable(p) {
    var pairs = {};
    // Skip nTables.
    p.skip('uShort');
    var subtableVersion = p.parseUShort();
    check.argument(subtableVersion === 0, 'Unsupported kern sub-table version.');
    // Skip subtableLength, subtableCoverage
    p.skip('uShort', 2);
    var nPairs = p.parseUShort();
    // Skip searchRange, entrySelector, rangeShift.
    p.skip('uShort', 3);
    for (var i = 0; i < nPairs; i += 1) {
        var leftIndex = p.parseUShort();
        var rightIndex = p.parseUShort();
        var value = p.parseShort();
        pairs[leftIndex + ',' + rightIndex] = value;
    }
    return pairs;
}

function parseMacKernTable(p) {
    var pairs = {};
    // The Mac kern table stores the version as a fixed (32 bits) but we only loaded the first 16 bits.
    // Skip the rest.
    p.skip('uShort');
    var nTables = p.parseULong();
    //check.argument(nTables === 1, 'Only 1 subtable is supported (got ' + nTables + ').');
    if (nTables > 1) {
        console.warn('Only the first kern subtable is supported.');
    }
    p.skip('uLong');
    var coverage = p.parseUShort();
    var subtableVersion = coverage & 0xFF;
    p.skip('uShort');
    if (subtableVersion === 0) {
        var nPairs = p.parseUShort();
        // Skip searchRange, entrySelector, rangeShift.
        p.skip('uShort', 3);
        for (var i = 0; i < nPairs; i += 1) {
            var leftIndex = p.parseUShort();
            var rightIndex = p.parseUShort();
            var value = p.parseShort();
            pairs[leftIndex + ',' + rightIndex] = value;
        }
    }
    return pairs;
}

// Parse the `kern` table which contains kerning pairs.
function parseKernTable(data, start) {
    var p = new parse.Parser(data, start);
    var tableVersion = p.parseUShort();
    if (tableVersion === 0) {
        return parseWindowsKernTable(p);
    } else if (tableVersion === 1) {
        return parseMacKernTable(p);
    } else {
        throw new Error('Unsupported kern table version (' + tableVersion + ').');
    }
}

var kern = { parse: parseKernTable };

// The `loca` table stores the offsets to the locations of the glyphs in the font.

// Parse the `loca` table. This table stores the offsets to the locations of the glyphs in the font,
// relative to the beginning of the glyphData table.
// The number of glyphs stored in the `loca` table is specified in the `maxp` table (under numGlyphs)
// The loca table has two versions: a short version where offsets are stored as uShorts, and a long
// version where offsets are stored as uLongs. The `head` table specifies which version to use
// (under indexToLocFormat).
function parseLocaTable(data, start, numGlyphs, shortVersion) {
    var p = new parse.Parser(data, start);
    var parseFn = shortVersion ? p.parseUShort : p.parseULong;
    // There is an extra entry after the last index element to compute the length of the last glyph.
    // That's why we use numGlyphs + 1.
    var glyphOffsets = [];
    for (var i = 0; i < numGlyphs + 1; i += 1) {
        var glyphOffset = parseFn.call(p);
        if (shortVersion) {
            // The short table version stores the actual offset divided by 2.
            glyphOffset *= 2;
        }

        glyphOffsets.push(glyphOffset);
    }

    return glyphOffsets;
}

var loca = { parse: parseLocaTable };

// opentype.js

/**
 * The opentype library.
 * @namespace opentype
 */

// File loaders /////////////////////////////////////////////////////////
/**
 * Loads a font from a file. The callback throws an error message as the first parameter if it fails
 * and the font as an ArrayBuffer in the second parameter if it succeeds.
 * @param  {string} path - The path of the file
 * @param  {Function} callback - The function to call when the font load completes
 */
function loadFromFile(path, callback) {
    var fs = require('fs');
    fs.readFile(path, function(err, buffer) {
        if (err) {
            return callback(err.message);
        }

        callback(null, nodeBufferToArrayBuffer(buffer));
    });
}
/**
 * Loads a font from a URL. The callback throws an error message as the first parameter if it fails
 * and the font as an ArrayBuffer in the second parameter if it succeeds.
 * @param  {string} url - The URL of the font file.
 * @param  {Function} callback - The function to call when the font load completes
 */
function loadFromUrl(url, callback) {
    var request = new XMLHttpRequest();
    request.open('get', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        if (request.response) {
            return callback(null, request.response);
        } else {
            return callback('Font could not be loaded: ' + request.statusText);
        }
    };

    request.onerror = function () {
        callback('Font could not be loaded');
    };

    request.send();
}

// Table Directory Entries //////////////////////////////////////////////
/**
 * Parses OpenType table entries.
 * @param  {DataView}
 * @param  {Number}
 * @return {Object[]}
 */
function parseOpenTypeTableEntries(data, numTables) {
    var tableEntries = [];
    var p = 12;
    for (var i = 0; i < numTables; i += 1) {
        var tag = parse.getTag(data, p);
        var checksum = parse.getULong(data, p + 4);
        var offset = parse.getULong(data, p + 8);
        var length = parse.getULong(data, p + 12);
        tableEntries.push({tag: tag, checksum: checksum, offset: offset, length: length, compression: false});
        p += 16;
    }

    return tableEntries;
}

/**
 * Parses WOFF table entries.
 * @param  {DataView}
 * @param  {Number}
 * @return {Object[]}
 */
function parseWOFFTableEntries(data, numTables) {
    var tableEntries = [];
    var p = 44; // offset to the first table directory entry.
    for (var i = 0; i < numTables; i += 1) {
        var tag = parse.getTag(data, p);
        var offset = parse.getULong(data, p + 4);
        var compLength = parse.getULong(data, p + 8);
        var origLength = parse.getULong(data, p + 12);
        var compression = (void 0);
        if (compLength < origLength) {
            compression = 'WOFF';
        } else {
            compression = false;
        }

        tableEntries.push({tag: tag, offset: offset, compression: compression,
            compressedLength: compLength, length: origLength});
        p += 20;
    }

    return tableEntries;
}

/**
 * @typedef TableData
 * @type Object
 * @property {DataView} data - The DataView
 * @property {number} offset - The data offset.
 */

/**
 * @param  {DataView}
 * @param  {Object}
 * @return {TableData}
 */
function uncompressTable(data, tableEntry) {
    if (tableEntry.compression === 'WOFF') {
        var inBuffer = new Uint8Array(data.buffer, tableEntry.offset + 2, tableEntry.compressedLength - 2);
        var outBuffer = new Uint8Array(tableEntry.length);
        tinyInflate(inBuffer, outBuffer);
        if (outBuffer.byteLength !== tableEntry.length) {
            throw new Error('Decompression error: ' + tableEntry.tag + ' decompressed length doesn\'t match recorded length');
        }

        var view = new DataView(outBuffer.buffer, 0);
        return {data: view, offset: 0};
    } else {
        return {data: data, offset: tableEntry.offset};
    }
}

// Public API ///////////////////////////////////////////////////////////

/**
 * Parse the OpenType file data (as an ArrayBuffer) and return a Font object.
 * Throws an error if the font could not be parsed.
 * @param  {ArrayBuffer}
 * @param  {Object} opt - options for parsing
 * @return {opentype.Font}
 */
function parseBuffer(buffer, opt) {
    opt = (opt === undefined || opt === null) ?  {} : opt;

    var indexToLocFormat;
    var ltagTable;

    // Since the constructor can also be called to create new fonts from scratch, we indicate this
    // should be an empty font that we'll fill with our own data.
    var font = new Font({empty: true});

    // OpenType fonts use big endian byte ordering.
    // We can't rely on typed array view types, because they operate with the endianness of the host computer.
    // Instead we use DataViews where we can specify endianness.
    var data = new DataView(buffer, 0);
    var numTables;
    var tableEntries = [];
    var signature = parse.getTag(data, 0);
    if (signature === String.fromCharCode(0, 1, 0, 0) || signature === 'true' || signature === 'typ1') {
        font.outlinesFormat = 'truetype';
        numTables = parse.getUShort(data, 4);
        tableEntries = parseOpenTypeTableEntries(data, numTables);
    } else if (signature === 'OTTO') {
        font.outlinesFormat = 'cff';
        numTables = parse.getUShort(data, 4);
        tableEntries = parseOpenTypeTableEntries(data, numTables);
    } else if (signature === 'wOFF') {
        var flavor = parse.getTag(data, 4);
        if (flavor === String.fromCharCode(0, 1, 0, 0)) {
            font.outlinesFormat = 'truetype';
        } else if (flavor === 'OTTO') {
            font.outlinesFormat = 'cff';
        } else {
            throw new Error('Unsupported OpenType flavor ' + signature);
        }

        numTables = parse.getUShort(data, 12);
        tableEntries = parseWOFFTableEntries(data, numTables);
    } else {
        throw new Error('Unsupported OpenType signature ' + signature);
    }

    var cffTableEntry;
    var fvarTableEntry;
    var glyfTableEntry;
    var gdefTableEntry;
    var gposTableEntry;
    var gsubTableEntry;
    var hmtxTableEntry;
    var kernTableEntry;
    var locaTableEntry;
    var nameTableEntry;
    var metaTableEntry;
    var p;

    for (var i = 0; i < numTables; i += 1) {
        var tableEntry = tableEntries[i];
        var table = (void 0);
        switch (tableEntry.tag) {
            case 'cmap':
                table = uncompressTable(data, tableEntry);
                font.tables.cmap = cmap.parse(table.data, table.offset);
                font.encoding = new CmapEncoding(font.tables.cmap);
                break;
            case 'cvt ' :
                table = uncompressTable(data, tableEntry);
                p = new parse.Parser(table.data, table.offset);
                font.tables.cvt = p.parseShortList(tableEntry.length / 2);
                break;
            case 'fvar':
                fvarTableEntry = tableEntry;
                break;
            case 'fpgm' :
                table = uncompressTable(data, tableEntry);
                p = new parse.Parser(table.data, table.offset);
                font.tables.fpgm = p.parseByteList(tableEntry.length);
                break;
            case 'head':
                table = uncompressTable(data, tableEntry);
                font.tables.head = head.parse(table.data, table.offset);
                font.unitsPerEm = font.tables.head.unitsPerEm;
                indexToLocFormat = font.tables.head.indexToLocFormat;
                break;
            case 'hhea':
                table = uncompressTable(data, tableEntry);
                font.tables.hhea = hhea.parse(table.data, table.offset);
                font.ascender = font.tables.hhea.ascender;
                font.descender = font.tables.hhea.descender;
                font.numberOfHMetrics = font.tables.hhea.numberOfHMetrics;
                break;
            case 'hmtx':
                hmtxTableEntry = tableEntry;
                break;
            case 'ltag':
                table = uncompressTable(data, tableEntry);
                ltagTable = ltag.parse(table.data, table.offset);
                break;
            case 'maxp':
                table = uncompressTable(data, tableEntry);
                font.tables.maxp = maxp.parse(table.data, table.offset);
                font.numGlyphs = font.tables.maxp.numGlyphs;
                break;
            case 'name':
                nameTableEntry = tableEntry;
                break;
            case 'OS/2':
                table = uncompressTable(data, tableEntry);
                font.tables.os2 = os2.parse(table.data, table.offset);
                break;
            case 'post':
                table = uncompressTable(data, tableEntry);
                font.tables.post = post.parse(table.data, table.offset);
                font.glyphNames = new GlyphNames(font.tables.post);
                break;
            case 'prep' :
                table = uncompressTable(data, tableEntry);
                p = new parse.Parser(table.data, table.offset);
                font.tables.prep = p.parseByteList(tableEntry.length);
                break;
            case 'glyf':
                glyfTableEntry = tableEntry;
                break;
            case 'loca':
                locaTableEntry = tableEntry;
                break;
            case 'CFF ':
                cffTableEntry = tableEntry;
                break;
            case 'kern':
                kernTableEntry = tableEntry;
                break;
            case 'GDEF':
                gdefTableEntry = tableEntry;
                break;
            case 'GPOS':
                gposTableEntry = tableEntry;
                break;
            case 'GSUB':
                gsubTableEntry = tableEntry;
                break;
            case 'meta':
                metaTableEntry = tableEntry;
                break;
        }
    }

    var nameTable = uncompressTable(data, nameTableEntry);
    font.tables.name = _name.parse(nameTable.data, nameTable.offset, ltagTable);
    font.names = font.tables.name;

    if (glyfTableEntry && locaTableEntry) {
        var shortVersion = indexToLocFormat === 0;
        var locaTable = uncompressTable(data, locaTableEntry);
        var locaOffsets = loca.parse(locaTable.data, locaTable.offset, font.numGlyphs, shortVersion);
        var glyfTable = uncompressTable(data, glyfTableEntry);
        font.glyphs = glyf.parse(glyfTable.data, glyfTable.offset, locaOffsets, font, opt);
    } else if (cffTableEntry) {
        var cffTable = uncompressTable(data, cffTableEntry);
        cff.parse(cffTable.data, cffTable.offset, font, opt);
    } else {
        throw new Error('Font doesn\'t contain TrueType or CFF outlines.');
    }

    var hmtxTable = uncompressTable(data, hmtxTableEntry);
    hmtx.parse(font, hmtxTable.data, hmtxTable.offset, font.numberOfHMetrics, font.numGlyphs, font.glyphs, opt);
    addGlyphNames(font, opt);

    if (kernTableEntry) {
        var kernTable = uncompressTable(data, kernTableEntry);
        font.kerningPairs = kern.parse(kernTable.data, kernTable.offset);
    } else {
        font.kerningPairs = {};
    }

    if (gdefTableEntry) {
        var gdefTable = uncompressTable(data, gdefTableEntry);
        font.tables.gdef = gdef.parse(gdefTable.data, gdefTable.offset);
    }

    if (gposTableEntry) {
        var gposTable = uncompressTable(data, gposTableEntry);
        font.tables.gpos = gpos.parse(gposTable.data, gposTable.offset);
        font.position.init();
    }

    if (gsubTableEntry) {
        var gsubTable = uncompressTable(data, gsubTableEntry);
        font.tables.gsub = gsub.parse(gsubTable.data, gsubTable.offset);
    }

    if (fvarTableEntry) {
        var fvarTable = uncompressTable(data, fvarTableEntry);
        font.tables.fvar = fvar.parse(fvarTable.data, fvarTable.offset, font.names);
    }

    if (metaTableEntry) {
        var metaTable = uncompressTable(data, metaTableEntry);
        font.tables.meta = meta.parse(metaTable.data, metaTable.offset);
        font.metas = font.tables.meta;
    }

    return font;
}

/**
 * Asynchronously load the font from a URL or a filesystem. When done, call the callback
 * with two arguments `(err, font)`. The `err` will be null on success,
 * the `font` is a Font object.
 * We use the node.js callback convention so that
 * opentype.js can integrate with frameworks like async.js.
 * @alias opentype.load
 * @param  {string} url - The URL of the font to load.
 * @param  {Function} callback - The callback.
 */
function load(url, callback, opt) {
    opt = (opt === undefined || opt === null) ?  {} : opt;
    var isNode = typeof window === 'undefined';
    var loadFn = isNode && !opt.isUrl ? loadFromFile : loadFromUrl;

    return new Promise(function (resolve, reject) {
        loadFn(url, function(err, arrayBuffer) {
            if (err) {
                if (callback) {
                    return callback(err);
                } else {
                    reject(err);
                }
            }
            var font;
            try {
                font = parseBuffer(arrayBuffer, opt);
            } catch (e) {
                if (callback) {
                    return callback(e, null);
                } else {
                    reject(e);
                }
            }
            if (callback) {
                return callback(null, font);
            } else {
                resolve(font);
            }
        });
    });
}

/**
 * Synchronously load the font from a URL or file.
 * When done, returns the font object or throws an error.
 * @alias opentype.loadSync
 * @param  {string} url - The URL of the font to load.
 * @param  {Object} opt - opt.lowMemory
 * @return {opentype.Font}
 */
function loadSync(url, opt) {
    var fs = require('fs');
    var buffer = fs.readFileSync(url);
    return parseBuffer(nodeBufferToArrayBuffer(buffer), opt);
}

var opentype = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Font: Font,
	Glyph: Glyph,
	Path: Path,
	BoundingBox: BoundingBox,
	_parse: parse,
	parse: parseBuffer,
	load: load,
	loadSync: loadSync
});

// https://stackblitz.com/edit/vitejs-vite-acphht?file=main.js


/*
// Example usage:
const fontUrl = './Rubik Moonrocks.ttf';
const text = 'Hello, World!';
const fontSize = 16; // in points
textToSvgPath(fontUrl, text, fontSize)
  .then(({ svgPathData, svg }) => {
    //console.log(svgPathData); // SVG path data string
    console.log(svg); // SVG element as a string
  })
  .catch((err) => console.error(err));
 */

// Function to load the font and convert text to SVG path
// vedi demo/textToPath-test.mjs

async function textToSvgPath(fontUrl, text, fontSize) {
  try {
    const font = await opentype.load(fontUrl);

    // Define the x and y coordinates where the text should start
    const x = 0;
    const y = 50;

    // Get a path representing the text
    const path = font.getPath(text, x, y, fontSize);

    // Convert the path to an SVG path data string
    const pathData = path.toPathData();

    // Alternatively, convert the path to an SVG
    const pathElementString = path.toSVG();

    return { pathData, pathElementString };

  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('textToSvgPath - font loading error:', err);
    throw err;
  }
}

/**
 * signal bars (grafico a tacche)
 *
 * Mostra una serie di barre analoghe a quelle del segnale dei cellulari
 * in cui le barre vengono mostrate attive se il valore di riferimento è maggiore o uguale
 * a uno degli indici del range dato e inferiore al successivo.
 * Di conseguenza, se il valore di riferimento è più basso del valore minimo del range
 */


async function signalBars({

  /**
    variabili e funzioni condivise importate da '../utils/init.js' (vedi)
    Può essere parzialmente o completamente integrata con funzioni specifiche
    (ad esempio per cambiare la modailità di implemntazione di svg.js, vedi demo).
    Lasciare come oggetto vuoto se non è necessario modificarlo
  */
  chartUtils = {},

  /** container (selettore o elemento DOM), se null viene restituito il codice SVG */
  container = null,

  /** svuota il container prima del rendering */
  emptyContainer = true,

  /**
    larghezza e altezza del grafico (px),
    Se il container è presente e i parametro `width` e `height` sono `null`,
    vengono utilizzate le dimensioni  del container.
    Se uno dei due valori non è impostato o ricavabile, viene generato un errore.
    NB: il padding del container viene considerato nelle dimensioni del grafico,
    è preferibile non impostarlo.
    Il valore 'auto' di height fa sì che l'altezza dell'svg sia calcolata sulla base
    del numero di barre e dei valori `barsGap` e `barsHeight`
  */
  width = null, // null || <value>
  height = 300, // <value> || null

  /**
    range di valori che corrispondono alle varie tacche,
    un valore inferiore al primo non "accende" nessuna tacca,
    tra il primo (incluso), e il secondo (escluso), una tacca e così via.
    Il numero di elementi determina il numero delle tacche
  */
  ranges = [1,2,3,4],

  /**
    se fornito, le barre 'accese' non vengono calcolate, ma si uutilizza questo valore
    corrisponde al numero di barre attivate da sinistra verso destra.
    Se presente, `value` può essere omesso ed è comunque ignorato
  */
  activeBars = null,

  /** Valore da rappresentare */
  value = null,

  /** etichetta da mostrare a destra o sotto le tacche. Stringa vuota per non avere etichetta */
  label = null,

  /** usa il valore come etichetta se label == null */
  labelUseValueIfNull = true,

  /** posizione dell'etichetta */
  labelPosition = 'right', // right o bottom

  /**
    Impostazioni font e colori per le etichette
    Impostare solo se non si vogliono usare i colori di default
    se impostato, è un oggetto analogo a quello definito in src/utils/init.js
  */
  labelFont = null,
  labelFill = '#000',


  /** Converte i font in tracciati NB: da testare per versioni web */
  textToPath = false,

  /** path del file font per la conversione in tracciati */
  labelFontFilePath = null,

  /** spazio tra l'etichetta e il grafico */
  textBarsGap = 8,

  /** spazio tra una barra e la successiva */
  barsGap = 10,

  /** corner radius */
  barsCornerRadius = 3,

  /**
    come il precedente, ma relatuvo alla larghezza della barra,
    ad esempio un valore di `.5' crea della barre dalle estremità tonde
    Se presente, il valore di `barsCornerRadius` viene ignorato
  */
  barsRelativeCornerRadius = null,

  /**
    attributi barre attive e disattive
    ad esclusione di `stroke-width` da gestire separatamente con barsStrokeWidth per esigenze di calcolo
    vedi https://svgjs.dev/docs/3.2/manipulating/#attributes
  */
  barsStrokeWidth = 3,
  barsOnAttr = {
    fill: '#000'
    // ,'fill-opacity': 0.5
    ,stroke: '#000'
    ,'stroke-width': 3
  },
  barsOffAttr = {
    fill: '#000'
    // ,'fill-opacity': 0.5
    ,stroke: '#fff'
    ,'stroke-width': 3
  },

  /** seimpostato, il valore massimo della larghezz delle barre */
  maxBarWidth = null,

  /** eventuali classi da aggiungere al grafico */
  svgClassName = null,
  labelClassName = null,
  barOnClassName = null,
  barOffClassName = null,


} = {}) {

  try {

    chartUtils = chart_init(chartUtils);

    if(ranges.filter(v => isNaN(v)).length) {
      throw 'There are non-numeric values';
    }

    if(ranges.length < 2) {
      throw 'At least two values are needed';
    }

    if(typeof barsStrokeWidth !== 'number') {
      throw '`barsStrokeWidth` must be a number';
    }

    if((value == null || typeof value !== 'number') && (activeBars == null || typeof activeBars !== 'number')) {
      throw 'At least one of `value` and `activeBarIndex` must be present and it must be a number';
    }

    if(!['right', 'bottom'].includes(labelPosition)) {
      throw '`labelPosition` must be `right` or `bottom`';
    }

    // container element
    const  containerElement = chartUtils.getElementFromContainer(container);

    if(containerElement && emptyContainer) {
      containerElement.innerHTML = '';
    }

    // dimensioni svg
    width = width || (containerElement? containerElement.clientWidth : null);
    height = height || (containerElement? containerElement.clientHeight : null);


    if(barsGap == null) {
      throw '`barsGap` must be set';
    }


    if(!width || !height) {
      throw `Missing width and/or height: width: ${width}, height: ${height}`;
    }

    const svgCanvas = chartUtils.createSvgCanvas(container); //.size(width, height);
    svgCanvas.viewbox(0, 0, width, height);

    if(svgClassName) {
      svgCanvas.addClass(svgClassName);
    }

    let labelX, labelY, barsAreaWidth, barWidth, barsAreaHeight, labelEl, label_bbox;
    const barsCount = ranges.length;

    if(label !== '') {

      if(label == null && labelUseValueIfNull) {
        label = value.toLocaleString('it-IT', { maximumFractionDigits: 2 });
      }

      // =>> calcolo dimensioni del testo per ricavare lo spazio utile per le barre
      // in base al posizionamento dell'etichetta

      // =>> text to path
      if(textToPath) {
        const { pathData/* , pathElementString */ } = await textToSvgPath(labelFontFilePath, label, labelFont.size?? 16);
        labelEl = svgCanvas.path(pathData).attr({fill: labelFill});

      } else {

        labelFont = {...chartUtils.defaults.font, ...(labelFont??{}) };
        // larghezza testo
        labelEl = svgCanvas.plain(label).font({
          fill: labelFill,
          ...labelFont,
          // 'text-anchor': labelPosition === 'right'? 'start' : 'middle'
        });

      }


      // label_bbox = labelEl.node.getBoundingClientRect();
      label_bbox = labelEl.bbox();

      if(labelPosition === 'right') {
        labelX = width - label_bbox.width;
        labelY = (height - label_bbox.height) / 2;
        barsAreaWidth = width - label_bbox.width - textBarsGap;
        barsAreaHeight = height;

      } else {
        labelX = (width - label_bbox.width) / 2;
        labelY = height - label_bbox.height;
        barsAreaWidth = width;
        barsAreaHeight = height - label_bbox.height - textBarsGap;
      }

      // posizionamento etichetta
      labelEl.move(labelX, labelY);

      if(!textToPath) {

        labelEl.attr({
          textLength: label_bbox.width,
          lengthAdjust:'spacingAndGlyphs',
          // 'dominant-baseline': labelPosition === 'right'? 'middle' : 'hanging'
        });
      }

      if(labelClassName) {
        labelEl.addClass(labelClassName);
      }


    } else {
      barsAreaWidth = width;
      barsAreaHeight = height;
    }

    barWidth = (
      barsAreaWidth -
      (barsGap * (barsCount - 1)) -
      ((barsStrokeWidth?? 0) * barsCount) // lo spessore della traccia è divisa tra interno ed esterno
    ) / barsCount;
    barWidth = Math.min(maxBarWidth?? Infinity, barWidth);

    const barsMaxHeight = barsAreaHeight - (barsStrokeWidth?? 0),
      barsModuleHeight = barsMaxHeight / barsCount;


    // coordinate x e y e altezza della prima barra
    let barX = (
        barsAreaWidth -
        (barWidth * barsCount) -
        (barsGap * (barsCount - 1)) -
        ((barsStrokeWidth?? 0) * barsCount)
      ) / 2 + ((barsStrokeWidth?? 0)/2),
      barHeight = barsModuleHeight,
      barY = barsAreaHeight - barHeight - ((barsStrokeWidth?? 0) / 2);


    // indice dell'ultima barra da rappresentare con riempimento attivo
    ranges.sort((a,b) => a - b);
    let lastActiveBarIndex;

    if(activeBars) {
      lastActiveBarIndex = activeBars - 1;

    } else {
      const closestRangeValue = ranges.reduce((prev, curr) => {
        return (Math.abs(Math.ceil(curr - value)) < Math.abs(Math.ceil(prev - value)) ? curr : prev);
      });
      lastActiveBarIndex = ranges.indexOf(closestRangeValue);
    }

    const bar_group = svgCanvas.group();

    ranges.forEach((val, idx) => {

      const barIsOn = idx <= lastActiveBarIndex;

      const bar = bar_group.rect({
        x: barX,
        y: barY,
        width: barWidth,
        height: barHeight,
        ...(barIsOn? barsOnAttr : barsOffAttr),
      });

      if(barsRelativeCornerRadius != null || barsCornerRadius != null) {

        barsCornerRadius= barsRelativeCornerRadius != null? barWidth/2 : barsCornerRadius;

        bar.radius(barsCornerRadius);
      }

      if( barsStrokeWidth > 0 ) {
        bar.stroke({ width: barsStrokeWidth });
      }

      if(barOnClassName && barIsOn) {
        bar.addClass(barOnClassName);
      }
      if(barOffClassName && !barIsOn) {
        bar.addClass(barOffClassName);
      }

      barHeight += barsModuleHeight;
      barX += barWidth + barsStrokeWidth + barsGap;
      barY -= barsModuleHeight;
    });

    if(!container) {
      return svgCanvas.svg();
    }


  } catch(e) {
    console.error( 'Charts → signalBars', e ); // eslint-disable-line
  }

}

/**
 * rating display
 *
 * Mostra un indicatore tipo contachilometri su una scala da 1 a 4 o 5
 */


async function ratingDisplay({

  // SECTION args
  /**
    variabili e funzioni condivise importate da '../utils/init.js' (vedi)
    Può essere parzialmente o completamente integrata con funzioni specifiche
    (ad esempio per cambiare la modailità di implemntazione di svg.js, vedi demo).
    Lasciare come oggetto vuoto se non è necessario modificarlo
  */
  chartUtils = {},

  /** container (selettore o elemento DOM), se null viene restituito il codice SVG */
  container = null,

  /** svuota il container prima del rendering */
  emptyContainer = true,

  /** Converte i font in tracciati NB: da testare per versioni web */
  textToPath = false,

  /** eventuali classi da aggiungere all'elemento svg */
  svgClassName = null,

  /** modailità debug, se attiva mostra dei riferimenti grafici */
  debug = false,

  /**
    valore da rappresentare
    in base a questo viene assegnato il posizionamento rispetto alla scala:
    1-1,99 : prima fascia
    2-2,99 : seconda ...
    La scala parte da 1
    L'ultima porzione rappresenta tutti i valori >= 4 per la versione a 4 porzioni
    e i valori >= 5 per l'altra
  */
  displayValue = null,

  /**
    se true, l'asticella viene posizionata al centro del colore corrispondente
    se false, viene posizionata in proporzione al valore effettivo
  */
  displayValueForceCenter = false,

  /**
    fill, traccia e classe dello sfondo del display principale
    oggetto analogo a
    {
      fill: null,
      strokeWidth: null,
      strokeColor: null,
      className: null,
    }
  */
  displayArc = null,

  /** numero di porzioni del tachimetro  */
  scale = 5, // 4 o 5

  /**
    colori da applicare alle porzioni del tachimetro. Se non impostati vengono usati quelli di base
    I colori vengono assegnati agli el,enti della scala secondo il loro ordine, a partire dal proimo a sinistra
    Se un colore non è presente viene usato il nero (#000)
  */
  scaleColors = null,

  /** eventuale classe da applicare agli elementi della scala */
  scaleClassName = null,

  /**
    segni di separazione degli elementi della scala
    vengono aggiunti anche `stroke-width="1" fill="none" stroke-linecap="butt"`
    se `scaleticksColor` è null, vengono usati gli stessi colori di `scaleColors`
  */
  scaleticksColor = null,
  scaleticksClassName = null,

  /**
    asticella
  */
  rodColor = '#000',
  rodClassName = null,

  /**
    etichetta principale
    se presente è un array in cui ogni elemento corrisponde ad una riga (max 2)
    dell'etichetta:

    displayLabel: [
      {
        label: <text> || null,
        font: obj || null, // oggetto analogo a quello definito in src/utils/init.js
        fill: <color>,
        fontFilePath: path // percorso al file del font, utilizzato se `textToPath === true`
      },
      {...}
    ]
  */
  displayLabel = null,

  /** distanza della prima riga di etichetta dalla base dell'asticella */
  displayLabelTopMargin = 4,


  // =>> minidisplay
  /**
    minidisplay
    se impostato è un array di uno o due elementi, in cui ognuno di questo
    è un oggetto così impostato:

    miniDisplay = [
      {
        position: 'sx' | 'dx' (aliases: left | right),
        value: number,
        type: 'gauge' || 'value'   // gauge = mini tachimetro, value: mostra il valore indicato in value
        typeLabelFont: obj || null // oggetto analogo a quelli definito in displayLabel per la rappresentazione
                                   //  di `type: value`. Se typeLabelFont.label non è presente, viene utilizzato
                                   //  `value` (arrotondato all'intero)
        mdLabel: array || null     // array di oggetti (uno per ogni riga di etichetta) analogo a quello
                                   // indicato nel display principale (displayLabel)
        mdArc: {                   // oggetto simile a displayArc
          fill: null,
          strokeWidth: null,
          strokeColor: null,
          className: null,
        }
      }
      ...
    ],

    se
  */
  miniDisplay = null,

  /** distanza dalla base del display principale */
  miniDisplayTopMargin = 0,


  animation = false,
  // animation_ms = 100, // number
  // animation_fps = 60, // number

  // !SECTION

}) {

  try {

    chartUtils = chart_init(chartUtils);
    scaleColors??= chartUtils.defaults.colors;

    // 30 gradi in radianti
    // ampiezza dell'angolo della parte eccedente il raggio della circonferenza che include l'arco di cerchio
    const rad30 = chartUtils.toRadians(30);

    // =>> sizes

    const sizes = {
      // display principale
      mainDisplay: {

        r: 110,

        get w() { return this.r * 2; },
        /*
          altezza dell'area del display
          è pari al raggio + la distanza corrispondente ad uno spostamento di 30°
          (l'arco di cerchio dell'area display è di 240°),
          distanza che corrisponde al centro di rotazione dell'asticella.
          La base dell'area del display principale è quindi la corda posizionata agli estremi dell'arco
        */
        get h() { return this.r + ( this.r * Math.sin(rad30) ); },

        /*
          centro di rotazione dell'asticella
          corrisponde al centro della circonferenza che include l'arco dell'area display
        */
        get cx() { return this.r; },
        get cy() { return this.r; }
      }
    };

    // =>> dimensione dell'intero svg
    sizes.mainSvg  = {
      w: sizes.mainDisplay.w,
      h: sizes.mainDisplay.h // altezza provvisoria, andrà ricalcolata dopo il rendering dei miniDisplay
    };


    // =>> verifiche e impostazioni di base
    if(displayValue == null || typeof displayValue !== 'number') {
      throw '`displayValue` is requested and must be a number';
    }
    if([4,5].indexOf(scale) === -1) {
      throw '`scale` must be 4 or 5';
    }

    displayValue = Math.min(displayValue, scale + .99);

    const displayScaleStart = 1 // valore iniziale del display. La scala parte da 1
      /*
        la scala parte da 1 e arriva a `scale` (viene tolta una piccola
        porzione finale per maggiore precisione)
      */
      ,parsedDisplayValue = displayValueForceCenter? Math.floor(displayValue) + .499 : displayValue
    ;


    // =>> animazione e posizione iniziale dell'asticella (rod)
    let rotazioneAsticella = 0;

    if(animation) {

      // TODO animazione
      // const display_animation = () => {
      //   const runAnimation = () => {

      //     const animationStepValue = parsedDisplayValue / animation_ms;

      //     let fpsInterval = animation_ms / animation_fps,
      //       currentDisplayValue = displayScaleStart, // valore iniziale. La scala parte da 1
      //       startTimestamp = Date.now(),
      //       animationEnd = false;

      //     const step = () => {
      //       let now = Date.now(),
      //         elapsed = now - startTimestamp;

      //       currentDisplayValue = Math.min(currentDisplayValue, parsedDisplayValue);

      //       if(currentDisplayValue >= parsedDisplayValue) {
      //         animationEnd = true;
      //       }

      //       // request another frame
      //       const animationRequest = window.requestAnimationFrame(step);

      //       // if enough time has elapsed, draw the next frame
      //       if (elapsed >= fpsInterval) {

      //         // Get ready for next frame by setting startTimestamp=now, but...
      //         // Also, adjust for fpsInterval not being multiple of 16.67
      //         startTimestamp = now - (elapsed % fpsInterval);

      //         svgElement.style.setProperty(
      //           '--rd-rot',
      //           Math.max(0, ((currentDisplayValue - displayScaleStart) * 240) / (scale - .001))
      //         );

      //         if(animationEnd) {
      //           window.cancelAnimationFrame(animationRequest);

      //         } else {
      //           currentDisplayValue += animationStepValue;
      //           // easing out a 2/3 del valore
      //           // if(currentDisplayValue >= parsedDisplayValue * 2/3) {
      //           //   fpsInterval += 1;
      //           // }

      //         }
      //       }

      //     };// end step

      //     step();
      //   }; // end animazione_arco

      //   runAnimation();

      // }; // end display_animation

      // // NB la mutazione non è rilevata se la card è già visibile nel viewport
      // // per questo è presente l'if iniziale
      // if(inViewport) {
      //   display_animation();
      // }

    } else {
      rotazioneAsticella = Math.max(0, ((parsedDisplayValue  - displayScaleStart) * 240) / (scale - .001));
    }

    // container element
    const  containerElement = chartUtils.getElementFromContainer(container);

    if(containerElement && emptyContainer) {
      containerElement.innerHTML = '';
    }

    // =>> definizione SVG
    const svgCanvas = chartUtils.createSvgCanvas(container);
    svgCanvas.viewbox(0, 0, sizes.mainSvg.w, sizes.mainSvg.h)
      .size(sizes.mainSvg.w, sizes.mainSvg.h)
      .fill('none');

    if(svgClassName) {
      svgCanvas.addClass(svgClassName);
    }


    // =>> gruppo Display Principale
    const mainDisplayGroup = svgCanvas.group()
      .attr({
        'data-debug-info': debug? 'Gruppo Display Principale' : null,
      });


    // =>> function getDisplayArcPath
    function getDisplayArcPath(radius, cx, cy) {

      const startPointX = cx - (radius * Math.cos(rad30)),
        startPointY = cy + (radius * Math.sin(rad30)),

        endPointX = cx + (radius * Math.cos(rad30)),
        endPointY = cy + (radius * Math.sin(rad30));

      return `M ${startPointX},${startPointY} ` +
        // rx ry angle large-arc-flag sweep-flag dx dy
        `A ${radius} ${radius} 0 1 1 ${endPointX} ${endPointY}`;
    }

    // =>> display principale
    mainDisplayGroup.path(
      // 'M14.5589,164.7274C5.2967,148.6096,0,129.9234,0,110,0,49.2487,49.2487,0,110,0s110,49.2487,110,110c0,20.0586-5.3689,38.8632-14.748,55.0552l-190.6931-.3278Z'
      getDisplayArcPath(sizes.mainDisplay.r, sizes.mainDisplay.cx, sizes.mainDisplay.cy)
    )
      .attr({
        'data-debug-info': debug? 'area display principale' : null,
        class: displayArc?.className, // se il valore è null o undefined l'attributo viene ignorato
        fill: displayArc?.fill?? 'none',
        stroke: displayArc?.strokeColor,
        'stroke-width': displayArc?.strokeWidth,
      });


    // =>> scale & ticks

    let ticks_paths, scale_paths;
    if(scale === 4) {
      ticks_paths = [
        'M31.8145,64.3924l-12.5627-7.253',
        'M110.2255,31.2336V4.6702',
        'M174.4747,72.6224l26.6597-15.3919'
      ];

      scale_paths = [
        'M25.1449,65.1604l-7.8217-4.5158C1.0679,91.4936,.5203,129.7554,19.2431,162.1841l-.0406-.3084c-14.0813-33.5175-11.9978-69.7327,5.9424-96.7153Z',
        'M106.2255,4.745c-16.5541,.6089-33.2051,5.1472-48.5497,14.0065-16.5527,9.5566-29.5166,22.9407-38.4241,38.3877l8.1965,4.7322c7.0425-9.5853,16.1881-17.8798,27.4637-24.2736,16.1538-9.16,33.9923-12.8843,51.3135-11.7545V4.745Z',
        'M199.0645,53.8066C179.2813,22.2909,145.2283,4.7195,110.2255,4.6702V26.1936c26.4244,2.8778,51.228,17.0771,66.4696,40.528l22.3694-12.915Z',
        'M201.1344,57.2305l-22.3293,12.8918c.0073,.0126,.0153,.0248,.0227,.0374,11.402,19.8312,12.2809,44.9971,.02,66.2336-1.9507,3.3787-4.1538,6.5209-6.5719,9.4163l28.9064,16.2815c18.0334-31.3837,19.3337-71.2517-.0479-104.8605Z'
      ];

    } else { // 5
      ticks_paths = [
        'M22.1717,81.0456l-11.8401-3.8471',
        'M76.5125,33.9593l-9.0032-20.2213',
        'M140.9257,40.7459l12.0048-26.963',
        'M180.4367,86.9106l29.6283-9.6269'
      ];

      scale_paths = [
        'M15.9428,83.2275l-6.7733-2.2007c-7.4723,26.3461-4.7006,55.5677,10.0736,81.1573l-.0406-.3084c-11.1296-26.4916-12.1697-54.674-3.2596-78.6482Z',
        'M63.8892,15.4414c-2.0916,1.0298-4.1652,2.1275-6.2134,3.3101-23.385,13.5013-39.6072,34.641-47.3442,58.447l7.0957,2.3055c7.2439-17.1207,19.7513-31.8504,37.4847-41.9061,5.0895-2.886,10.3474-5.2258,15.7025-7.0513l-6.7253-15.1052Z',
        'M149.2476,12.2204C123.5877,1.9537,94.1199,1.8658,67.5094,13.7379l6.9424,15.593c21.8262-6.3824,44.9893-4.3134,64.9426,5.0201l9.8533-22.1306Z',
        'M184.0155,81.542l24.7449-8.04c-2.0469-5.5565-4.5906-11.0154-7.6519-16.3178-11.5244-19.9607-28.6157-34.6992-48.178-43.4012l-9.9482,22.3439c14.4784,7.5615,27.0454,19.0628,35.8455,34.0328,2.0891,3.6336,3.8213,7.4476,5.1877,11.3823Z',
        'M185.2117,85.3591c4.668,16.5795,2.9308,34.935-6.364,51.0341-1.9507,3.3787-4.1538,6.5209-6.5719,9.4163l28.9064,16.2815c14.5532-25.327,18.2002-56.1781,8.8828-84.8073l-24.8533,8.0754Z'
      ];
    }

    const ticksGroup = mainDisplayGroup.group()
      .attr({
        'data-debug-info': debug? 'ticks' : null,
        class: scaleticksClassName,
        fill: 'none',
        'stroke-width': .5,
        'stroke-linecap': 'butt',

      });
    ticks_paths.forEach((p, idx) => {
      ticksGroup.path(p)
        .attr({
          stroke: scaleticksColor? scaleticksColor : scaleColors?.[idx + 1]?? '#000',
        });
    });

    const scaleGroup = mainDisplayGroup.group().attr({
      'data-debug-info': debug? 'scales' : null,
      class: scaleClassName,
      stroke: 'none',
    });
    scale_paths.forEach((p, idx) => {
      scaleGroup.path(p)
        .attr({
          fill: scaleColors?.[idx]?? '#000'
        });
    });


    // =>> asticella
    const rodGroup = mainDisplayGroup.group()
      .attr({
        'data-debug-info': debug? 'asticella' : null,
        fill: rodColor,
        class: rodClassName
      });

    // centro
    // rodGroup.path('M120.5713,103.6898c3.3137,5.7395,1.3472,13.0786-4.3923,16.3923-5.7395,3.3137-13.0786,1.3472-16.3923-4.3923s-1.3472-13.0786,4.3923-16.3923c5.7395-3.3137,13.0786-1.3472,16.3923,4.3923Zm-13.8923-.0622c-3.348,1.933-4.4952,6.2141-2.5622,9.5622s6.2141,4.4952,9.5622,2.5622,4.4952-6.2141,2.5622-9.5622-6.2141-4.4952-9.5622-2.5622Z');

    // versione con path calcolato
    // https://www.smashingmagazine.com/2019/03/svg-circle-decomposition-paths/
    const rodRingRadius = 24,
      rodInnerRingRadius = 14;
    rodGroup.path(
      `M ${sizes.mainDisplay.cx - rodRingRadius/2}, ${sizes.mainDisplay.cy}`+
      `a ${rodRingRadius/2},${rodRingRadius/2} 0 1,0 ${rodRingRadius},0 ` +
      `a ${rodRingRadius/2},${rodRingRadius/2} 0 1,0 -${rodRingRadius},0 ` +

      `M ${sizes.mainDisplay.cx - rodInnerRingRadius/2}, ${sizes.mainDisplay.cy} ` +
      `a ${rodInnerRingRadius/2},${rodInnerRingRadius/2} 0 1,0 ${rodInnerRingRadius},0 ` +
      `a ${rodInnerRingRadius/2},${rodInnerRingRadius/2} 0 1,0 -${rodInnerRingRadius},0`
    )
      .attr({'fill-rule': 'evenodd'});

    // bbox del solo anello di base dell'asticella
    // usato per il posizionamento delle etichette
    const rodGroupBaseBbox = rodGroup.bbox();

    // asta
    rodGroup.polygon('59.1813 139.0943 59.1813 139.0943 98.8572 108.491 105.5448 120.0899 59.1813 139.0943')
      .transform({

        origin: {
          x: sizes.mainDisplay.cx,
          y: sizes.mainDisplay.cy,
        },
        rotate: rotazioneAsticella
      });



    // =>> function setTextElement
    async function setTextElement(textObj, parentEl = svgCanvas) {
      /*
      {
        label: <text> || null,
        font: obj || null, // oggetto analogo a quello definito in src/utils/init.js
        fill: <color>,
        fontFilePath: path // percorso al file del font, utilizzato se `textToPath === true`
      }
      */

      let textEl;

      textObj.font = {...chartUtils.defaults.font, ...(textObj.font??{}) };

      textObj.fill??= '#000';

      if(textToPath) {

        if(!textEl.fontFilePath) {
          throw `Missing 'fontFilePath' for text ${textObj.label}`;
        }
        const { pathData/* , pathElementString */ } = await textToSvgPath(textObj.fontFilePath, textObj.label, textObj.font?.size??16);
        textEl = parentEl.path(pathData).attr({fill: textObj.fill});

      } else {
        // larghezza testo
        textEl = parentEl.plain(textObj.label).font({
          fill: textObj.fill,
          ...textObj.font,
        });
      }

      return [ textEl, textEl.bbox() ];
    }

    // =>> function setLabel
    async function setLabel({
      labelObj,
      islabelRow1,
      firstRowLabelY,
      parentEl = svgCanvas
    }) {
      if(labelObj?.label) {

        const [labelEl, label_bbox] = await setTextElement(labelObj, parentEl);


        // posizionamento, al centro sotto l'asticella
        const labelY = firstRowLabelY + (islabelRow1? 0 : prevLabelHeight + 2);

        labelEl.move(
          sizes.mainDisplay.cx - label_bbox.width / 2,
          labelY
        );

        prevLabelHeight = label_bbox.height;

        labelEl.attr({
          'data-debug-info': debug? `label “${labelObj.label}”` : null,
          textLength: textToPath? null : label_bbox.width,
          lengthAdjust: textToPath? null : 'spacingAndGlyphs',
        });

      }
    }

    // =>> displayLabel
    if(displayLabelTopMargin != null && typeof displayLabelTopMargin !== 'number') {
      throw '`displayLabelTopMargin` must be null or a number';
    }

    displayLabel??=[];
    if(displayLabel.length > 2) {
      throw 'No more than 2 `displayLabel` elements can be defined';
    }

    let labelIdx = 0, prevLabelHeight = 0;
    for await (const labelObj of displayLabel) {

      await setLabel({
        labelObj: labelObj,
        islabelRow1: labelIdx === 0,
        firstRowLabelY: rodGroupBaseBbox.y2 + (displayLabelTopMargin??0),
        parentEl: mainDisplayGroup
      });
      labelIdx++;
    }

    // =>> ricalcolo altezza gruppo principale
    const mainDisplayGroupBbox = mainDisplayGroup.bbox();
    sizes.mainSvg.h = mainDisplayGroupBbox.y + mainDisplayGroupBbox.y2;

    // SECTION miniDisplay
    if(miniDisplayTopMargin != null && typeof miniDisplayTopMargin !== 'number') {
      throw '`miniDisplayTopMargin` must be null or a number';
    }

    miniDisplay??=[];
    if(miniDisplay.length > 2) {
      throw 'No more than 2 `miniDisplay` elements can be defined';
    }


    let miniDisplayIdx = 1, miniDisplayMaxHeight = 0;
    for await (const md of miniDisplay) {


      const errorPrefix = `miniDisplay #${miniDisplayIdx}`;

      // =>> controlli
      ['position', 'type', 'value'].forEach(item => {
        if(md[item] == null) {
          throw `${errorPrefix}: '${item}' is requested`;
        }
      });

      if(['sx', 'dx', 'left', 'right'].indexOf(md.position) === -1) {
        throw `${errorPrefix}: 'position' must be one of 'sx', 'dx', 'left' or 'right'`;
      }

      if(typeof md.value !== 'number') {
        throw `${errorPrefix}: 'value' must be a number`;
      }

      if(['gauge', 'value'].indexOf(md.type) === -1) {
        throw `${errorPrefix}: 'type' must be one of 'gauge' or 'value'`;
      }

      // default
      md.mdArc ??= {};
      md.mdArc.strokeWidth ??= 0;


      // =>> dimensioni
      const
        // raggio circonferenza che include l'arco
        mdRadius = 26,

        mdWidrh = (mdRadius * 2) + (md.mdArc?.strokeWidth??0), // impegna sia la parte destra che la sinistra

        // margine orizzontale dal bordo esterno dell'SVG
        xMargin = 20,

        // coordinate dell'origine del miniDisplay
        mdOrigin = {
          y: sizes.mainSvg.h + (miniDisplayTopMargin?? 0),
          x: (md.position === 'sx' || md.position === 'left')
            ? xMargin
            : sizes.mainSvg.w - xMargin - mdWidrh
        }
      ;


      // =>> mdGroup
      const mdGroup = svgCanvas.group()
        .attr({
          'data-debug-info': debug? `miniDisplay #${miniDisplayIdx}` : null,
        });

      // =>> definizione arco
      const
        // altezza aggiuntiva dell'arco di cerchio oltre la lunghezza del raggio
        // extraHeight = mdRadius * Math.sin(rad30),

        // altezza complessiva dell'arco di cerchio, calcolata sulla base
        // della sua ampiezza totale di 240°
        // mdArcHeight = mdRadius + extraHeight +
        //   md.mdArc.strokeWidth / 2, // il bordo è applicato solo sull'arco e non sulla corda che lo sottende

        // coordinate del centro della circonferenza che include l'arco
        mdArcCx= mdOrigin.x + mdRadius, // + md.mdArc.strokeWidth / 2,
        mdArcCy= mdOrigin.y + mdRadius // + md.mdArc.strokeWidth / 2,
      ;


      mdGroup.path(getDisplayArcPath(mdRadius, mdArcCx, mdArcCy))
        .attr({
          'data-debug-info': debug? `miniDisplay #${miniDisplayIdx}: arco` : null,
          class: md.mdArc.className, // se il valore è null o undefined l'attributo viene ignorato
          fill: md.mdArc.fill?? 'none',
          stroke: md.mdArc.strokeWidth > 0? md.mdArc.strokeColor : null,
          'stroke-width': md.mdArc.strokeWidth > 0? md.mdArc.strokeWidth : null,
          'stroke-linecap': md.mdArc.strokeWidth > 0? 'round' : null,
        });

      // =>> modalità "value"
      if(md.type === 'value') {

        md.typeLabelFont ??= {};
        md.typeLabelFont.label ??= String(Math.round(md.value));

        const [valueEl, value_bbox] = await setTextElement(md.typeLabelFont, mdGroup);

        valueEl.move(
          mdArcCx - value_bbox.w/2,
          mdArcCy - value_bbox.h/2 - 2, // 2: spostamento basline verso l'alto
        );

      // =>> modalità "gauge"
      } else {

        // segmento indicatore colore
        const segmentStrokeWidth = 6
          ,segmentAngle = chartUtils.toRadians(240 / scale)
          ,segmentRadius = mdRadius - segmentStrokeWidth/2 - 1

          ,startPointX = mdArcCx - (segmentRadius * Math.cos(rad30))
          ,startPointY = mdArcCy + (segmentRadius * Math.sin(rad30))
          ,endPointX = mdArcCx - (segmentRadius * Math.cos(segmentAngle))
          ,endPointY = mdArcCy + (segmentRadius * Math.sin(segmentAngle))

          ,segmentPath = `M ${startPointX},${startPointY} ` +
          //   // rx ry angle large-arc-flag sweep-flag dx dy
          `A ${segmentRadius} ${segmentRadius} 0 0 0 ${endPointX} ${endPointY}`
        ;

        mdGroup.path(segmentPath)
          .attr({
            stroke: '#c00',
            'stroke-width': segmentStrokeWidth
          });


        // let ratingStrokePath;
        // if(scale === 4) {

        //   endPointX = cx + (radius * Math.cos(rad30)),
        //   endPointY = cy + (radius * Math.sin(rad30));

        //   // ratingStrokePath = 'M7.4197,30.2428c-1.4003-2.4246-2.2015-5.2387-2.2015-8.2398,0-3.0112,.8066-5.8339,2.2155-8.264';
        // } else {


        // ratingStrokePath = 'M7.4197,30.2428c-1.4003-2.4246-2.2015-5.2387-2.2015-8.2398,0-1.7807,.2821-3.4955,.804-5.1021';
        // }
        // return `M ${startPointX},${startPointY} ` +
        //   // rx ry angle large-arc-flag sweep-flag dx dy
        //   `A ${radius} ${radius} 0 1 1 ${endPointX} ${endPointY}`;

        // const ratingStroke = <path d={ratingStrokePath}
        //   className={classnames(styles.miniDisplayRatingStroke, styles[`strokeRating${props.rating}`])}
        //   transform={`rotate(${rotazione_colore},${sizes.miniDisplay.r},${sizes.miniDisplay.r})`}
        // />;

      }

      // =>> label
      // px di distanza tra il testo e il bordo inferiore del miniDisplay
// const textTopMargin = 16;

      // =>> indicatori per debug
      if(debug) {
        // centro mini display
        const gap = 10;
        const debug_group = mdGroup.group()
          .attr({
            'data-debug-info': 'centro mini display',
            stroke: '#05923e',
            fill: 'none',
            'stroke-width': .5,
            class: 'debug-info'
          });
        debug_group.line({x1: mdArcCx - gap, y1: mdArcCy, x2: mdArcCx + gap, y2: mdArcCy});
        debug_group.line({x1: mdArcCx, y1: mdArcCy - gap, x2: mdArcCx, y2: mdArcCy + gap});

        // origine mini display
        // debug_group.line({x1: mdOrigin.x - gap, y1: mdOrigin.y, x2: mdOrigin.x + gap, y2: mdOrigin.y});
        // debug_group.line({x1: mdOrigin.x, y1: mdOrigin.y - gap, x2: mdOrigin.x, y2: mdOrigin.y + gap});
      }

      // =>> ricalcolo miniDisplayMaxHeight
      miniDisplayMaxHeight = Math.max(
        miniDisplayMaxHeight,
        mdGroup.bbox().h + (miniDisplayTopMargin?? 0) + md.mdArc.strokeWidth // strokeWidth: spessore traccia nel caso non ci sia testo
      );
      miniDisplayIdx++;

    }



    /*



      // parametri per la rotazione dell'asticella e dell'indicatore del valore
      // gli angoli sono differenti tra colore-indicatore e asticella (posizionata la centro del primo)
      // e variano in base alle versioni a 4  o 5 porzioni
      // nella versione a 4 porzioni, ogni sezione ha un arco di 60°, in quella a 5 è di 48°
      // il valore di ogni rotazione è dato dal valore iniziale moltiplicato per `rating - 1`
      // il valore iniziale per i colori è 0, quello dell'asticella è `step_rotazioni/2`
      //
      // il centro di trasformazione è riferito al container svg
      // ma i miniDisplay sono traslati, quindi il riferimento iniziale
      // coincide quelle relative al miniDisplay, ovvero il raggio del bordo esterno (sizes.miniDisplay.r)
      const step_rotazioni = {
          p4: 60,
          p5: 48
        },
        rotazione_colore = step_rotazioni[`p${props.scale}`] * (props.rating - 1),
        rotazione_asticella = rotazione_colore + (step_rotazioni[`p${props.scale}`] / 2);

      // indicatore colore
      let ratingStrokePath;
      if(props.scale === 4) {
        ratingStrokePath = 'M7.4197,30.2428c-1.4003-2.4246-2.2015-5.2387-2.2015-8.2398,0-3.0112,.8066-5.8339,2.2155-8.264';
      } else {
        ratingStrokePath = 'M7.4197,30.2428c-1.4003-2.4246-2.2015-5.2387-2.2015-8.2398,0-1.7807,.2821-3.4955,.804-5.1021';
      }

      const ratingStroke = <path d={ratingStrokePath}
        className={classnames(styles.miniDisplayRatingStroke, styles[`strokeRating${props.rating}`])}
        transform={`rotate(${rotazione_colore},${sizes.miniDisplay.r},${sizes.miniDisplay.r})`}
      />;


      return (
        <g
          // className={styles.miniDisplayWrapper}
          transform={`translate(${config.xCoord} ${sizes.mainDisplay.h + sizes.miniDisplay.topOuterMargin})`}
        >
          <path
            d="M3.6009,32.3872c-1.7353-3.0673-2.7259-6.6116-2.7259-10.3872C.875,10.333,10.333,.875,22,.875s21.125,9.458,21.125,21.125c0,3.9226-1.0691,7.5954-2.9318,10.7431"
            className={config.borderClassName} />



          {props.type === 'currRating'?
            <text
              className={classnames(styles.miniDisplayRatingValue, styles[`fillTextRating${props.rating}`])}
              x={sizes.miniDisplay.w / 2}
              y={sizes.miniDisplay.w / 2}
            >
              {props.rating}
            </text>
            :
            <>
              // asticella
              <g className={styles.miniDisplayRod}
                transform={`rotate(${rotazione_asticella},${sizes.miniDisplay.r},${sizes.miniDisplay.r})`}>
                <path
                  d="M19.1531,23.484c.5194,.9398,1.5047,1.5266,2.5768,1.5343,1.072,.0077,2.0636-.5647,2.5929-1.497,.5293-.9323,.5139-2.079-.0404-2.9987-.835-1.3855-2.623-1.8487-4.0209-1.0416s-1.8908,2.5872-1.1084,4.003m.0736-5.7943c2.377-1.373,5.4195-.555,6.7955,1.8272,1.376,2.3822,.5646,5.4264-1.8125,6.7994-2.377,1.373-5.4195,.555-6.7955-1.8272-1.376-2.3822-.5646-5.4264,1.8125-6.7994" />
                <path
                  d="M20.5202,26.2963c-2.6999,.4226-8.2011,1.0997-8.2011,1.0997,0,0,3.39-4.5154,5.1153-6.6284-.1406,2.2876,1.3013,4.5861,3.0858,5.5287" />

              </g>

              // indicatore valore (colore)
              {ratingStroke}
            </>
          }



          {labels.map((label, idx) => {

            return <text
              x={sizes.miniDisplay.w / 2}
              y={config.textyCoord}
              width={sizes.miniDisplay.w}
              className={styles.minidisplayLabelRow}
              dy={`${label_dy_step * idx}px`}
              key={idx}
            >
              {label}
            </text>;
          })}

        </g>
      );
    }
    */

    // rating precedente
    // {prev_rating &&
    //   <MiniDisplay type='prevRating' scale={scale} {...prev_rating} />
    // }

    // // rating attuale
    // {curr_rating &&
    //   <MiniDisplay type='currRating' scale={scale} {...curr_rating} />
    // }

    // !SECTION end miniDisplay

    // =>> aggiornamento dimensioni SVG
    sizes.mainSvg.h += miniDisplayMaxHeight;
    // sizes.mainSvg.w = mainDisplayGroupBbox.w;

    svgCanvas
      .size(sizes.mainSvg.w, sizes.mainSvg.h)
      .viewbox(0, 0, sizes.mainSvg.w, sizes.mainSvg.h);


    // indicatori per debug
    if(debug) {
      // centro display e rotazione asticella
      const gap = sizes.mainDisplay.r;
      const debug_group1 = svgCanvas.group()
        .attr({
          'data-debug-info': 'centro rotazione asticella',
          stroke: '#e20613',
          fill: 'none',
          'stroke-width': .5,
          class: 'debug-info'
        });
      debug_group1.line({x1: sizes.mainDisplay.cx - gap, y1: sizes.mainDisplay.cy, x2: sizes.mainDisplay.cx + gap, y2: sizes.mainDisplay.cy});
      debug_group1.line({x1: sizes.mainDisplay.cx, y1: sizes.mainDisplay.cy - gap, x2: sizes.mainDisplay.cx, y2: sizes.mainDisplay.cy + gap});
    }

    if(!container) {
      return svgCanvas.svg();
    }

  } catch(e) {
    console.error( 'Charts → ratingDisplay', e ); // eslint-disable-line
  }
}

export { bars, pie, ratingDisplay, signalBars };
//# sourceMappingURL=charts-demo.js.map
