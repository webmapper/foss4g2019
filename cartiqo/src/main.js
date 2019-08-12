
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

var z = 13.18,
p = 47,
b = -49.8,
c = [5.20233, 51.96402];
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
var tr = {
  hash: false,
  zoom: z,
  pitch: p,
  bearing: b,
  container:'tr',
  style: "./style/data_lines.json",
  center: c
};

// INITIALIZE MAP
var mtl = new mapboxgl.Map(tl);
// INITIALIZE MAP2
var mtr = new mapboxgl.Map(tr);
var wiebel = true;
var i = 0
var pi = Math.PI
var interval
var mapHeight = 400;
var mapWidth= mtl.getCanvasContainer().clientWidth;
var setWiebel = function() {

  mtl.wiebel = true;

  var x = Math.sin(i/pi)
  var y = Math.cos(i/pi)
  mtl.setPitch(p+y,{wiebel:true})
  mtl.setBearing(b+x,{wiebel:true})
  mtl.wiebel = false;
  i++
}
interval = setInterval(setWiebel,100)
window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
 if(event.data === 'slide:stop') {
  clearInterval(interval)
 }
 else  if(event.data === 'slide:start'){
  interval = setInterval(setWiebel,100)
 }
}

mtl.on('resize',function(e){
  mapWidth = e.target._canvas.getAttribute('width')
})
var removeBlur = function() {
  if(document.getElementById('tl-blur')) {
    if(document.getElementById('tl-blur').remove) {
      document.getElementById('tl-blur').remove();
      document.getElementById('tr-blur').remove();
    }
    else {
      document.getElementById('tl-blur').removeNode();
      document.getElementById('tr-blur').removeNode();
    }
  }
}
window.setTimeout(removeBlur,1800)
mtl.on('load', removeBlur)
mtr.on('load', removeBlur)

// Sync map movement
syncMaps(mtl, mtr);



if (isIE || isEdge ) {
  setTimeout(function() {console.log('resize');
    mtl.resize();
    mtr.resize();
  }, 200);

}


if ('LinearAccelerationSensor' in window && 'Gyroscope' in window) {
  var accelerometer = new LinearAccelerationSensor();
  accelerometer.addEventListener('reading', function(e) {

    accelerationHandler(accelerometer);
  });
  accelerometer.start();

  if ('GravitySensor' in window) {
    var gravity = new GravitySensor();
    gravity.addEventListener('reading', function(e){ accelerationHandler(gravity)});
    gravity.start();
  }

  var gyroscope = new Gyroscope();
  gyroscope.addEventListener('reading', function(e){ rotationHandler({
    alpha: gyroscope.x,
    beta: gyroscope.y,
    gamma: gyroscope.z
  })});
  gyroscope.start();

} else if ('DeviceMotionEvent' in window) {

  var onDeviceMotion = function (eventData) {
    accelerationHandler(eventData.acceleration);
    accelerationHandler(eventData.accelerationIncludingGravity);
    }

  window.addEventListener('devicemotion', onDeviceMotion, false);
}

function accelerationHandler(acceleration) {
  if(!mtl.isMoving()&&!mtr.isMoving()&&wiebel) {
    mtl.wiebel = true;
    mtl.setPitch(p+Math.round(10*acceleration.y)/5)
    mtl.setBearing(b+Math.round(10*acceleration.x)/5)
    mtl.wiebel = false;
  }
}

console.log("\
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWO:...xWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\nMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWk,.  .kMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\nMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWNXNWMMMMMMMMMMMMNc.   ,0MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\nMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMKc';OMMMMMMMMMMMMWx'. .cXMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\nMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMO' .kMMMMMMMMMMMMMW0o:;xWMMMMMMMMMWWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\nMMMMMWXXKXNWMMMMMMMMMMWNXKKXWMMMMMMMMWNNWMMMNXKXNWMMMO' .xWMMMMMMMMMMWXK00O0NMMMMMWKxlc::cokXWXK00KWMMMMMMMWNXXKXXWMMMMM\nMWXxl;,''',;lkXMMMWKxl;,'''';lOWMMMMWO:,dX0l;'.'cKXdc;. .,cccccxNMMMMXl....:KMMMW0c..      .,:,...:KMMMMWKxc;,''',;lxXWM\nNd,..:oxkkdl;:OWMM0;.'cdxxxl'..oNMMMWx. ,:,,:llcdXXxo:. .;oooooOWMMMM0,   .cXMMWk'.   .:ool;..   .cXMMMXo'.'cdxkxd:..,dN\n\
l..,kNMMMMMMNNWMMMN0OXWMMMMWk' .kWMMWx. .,xXWMMMMMMMMO' .kMMMMMMMMMMMk.   .oWMMO,    'xNMMMXl.   .dWMMXc..:0WMMMMMWk,..o\n. .xWMMMMMMMMMMMMMMMMMMMMMMWK: .oWMMWx. 'kWMMMMMMMMMMO' .kMMMMMMMMMMWo.   .xWMNl.   .oNMMMMXc.   'kMMWd. ,OMMMMMMMMWx. .\n. ,0MMMMMMMMMMMMMMMWN0kdolcc;. .oWMMWx. ,0MMMMMMMMMMMO' .kMMMMMMMMMMXc.   ,0MMX:.   .kMMMMM0;    ;0MMNc. :XMMMMMMMMM0, .\n. ,OMMMMMMMMMMMMMW0l,',:lodxo, .oWMMWx. ,0MMMMMMMMMMMO' .kMMMMMMMMMM0;   .:XMMXc.   .kMMMMMk.   .cXMMNl. :KMMMMMMMMMO, .\n' .oNMMMMMMMMMMMWk'.'xXWMMMMX: .oWMMWx. ,0MMMMMMMMMMMO' .kMMMMMMMMMMk'   .oNMMWd.   .;kXXKk:.   .dWMMWk. 'kWMMMMMMMNo. '\nx' .oKWMMMWXkx0WWd. ;KMMMMWKd' .oWMMWx. ,0MMMMMMMMMMM0, .dNMWNXWMMMWd.   .xWMMMXo.   ..''...    'OMMMMNd..,xXWMMMWKo..'x\nWOc...;clc:'.,kWMK:..,loolc::,..oWMMWx. ,0MMMMMMMMMMMNo...;cc;,oNMMXc.   'OMMMMMNOc,....'::.   .;KMMMMMNO:..':clc;'.'l0W\nMMWKxoccccldOXWMMMNkoc:ccoxKN0oo0WMMM0olxXMMMMMMMMMMMMNOoc:ccld0WMMNkllllxNMMMMMMMWNK000XWO'   .lNMMMMMMMWKxolc:clokKWMM\n\
MMMMMMMMMMMMMMMMMMMMMMWWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWd.   .dWMMMMMMMMMMMMMWMMMMMMMM\nMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNl.   'OMMMMMMMMMMMMMMMMMMMMMMM\nMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNo.   ;0MMMMMMMMMMMMMMMMMMMMMMM\n\
\n\n\n\nWelcome by the preview of cartiqo\n\nfor more information: info@webmapper.net\n\n\n\n")
