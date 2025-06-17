# Charts
A collections of charts scripts

**Charts** comes with three flavours: 

* Main mode (index.js): standard way, use imported svg.js module
* Node mode (index-node.js): for use within node script (to be imported as module)
* With svg.js imported as a standalone script (index-external-svgjs.js): if you need to import svg.js using the script tag, this implementation doesn't load svg.js but assumes that a global `SVG` function is available


## Radial bars chart
Oct 2022

Refs: 

* https://codepen.io/massimo-cassandro/pen/zYRBJyG?editors=1100
* https://datavizproject.com/data-type/circular-bar-chart/
* https://datavizcatalogue.com/methods/radial_bar_chart.html


## General references

* <https://levelup.gitconnected.com/publish-react-components-as-an-npm-package-7a671a2fb7f>
* <https://itnext.io/how-to-package-your-react-component-for-distribution-via-npm-d32d4bf71b4f>
