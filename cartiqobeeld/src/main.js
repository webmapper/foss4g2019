
// Evil detect browser
// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]"
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 71
var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;


if (isIE || isEdge ) {
  document.write('<link rel="stylesheet" href="../css/skew.css" />');
}

var z = 16.78,
p = 10,
b = -25,
c = [5.127, 52.09];
//51.96402/5.20233/-49.8/47
// MAP OPTIONS
var tl = {
  hash: false,
  zoom: z,
  pitch: p,
  bearing: b,
  container:'tl',
  style: "./style/topography.json",
  center: c
};

// INITIALIZE MAP
var mtl = new mapboxgl.Map(tl);
// INITIALIZE MAP2

var wiebel = true;
var i = 0
var pi = Math.PI
var interval
var mapHeight = 400;
var mapWidth= mtl.getCanvasContainer().clientWidth;


mtl.on('resize',function(e){
  mapWidth = e.target._canvas.getAttribute('width')
})


if (isIE || isEdge ) {
  setTimeout(function() {
    mtl.resize();
  }, 200);

}

