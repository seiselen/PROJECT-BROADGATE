var canvDims = {init(wide,tall){this.wide=wide;this.tall=tall;this.wideH=this.wide/2;this.tallH=this.tall/2;}};
canvDims.init(1024,768)

var sheet;
var bgImg;
var MJ;

function preload(){
  sheet=loadImage('assets/spritesheet.png');
  bgImg=loadImage('assets/bgLunarSurface.png');
}


function setup(){
  createCanvas(canvDims.wide,canvDims.tall).parent("viz");
  angleMode(DEGREES);
  MJ = new KingOfPop(canvDims.wideH,canvDims.tallH);
}

function draw(){
  MJ.update();
  background(60);
  tint(255,180);
  image(bgImg,canvDims.wideH,canvDims.tallH);
  tint(255,255)
  MJ.render();
  noFill();
  drawCanvasBorder();
  dispFPSViaDOM();
}

var fpsPane = null;
function dispFPSViaDOM(dFrame=3){
  if(!fpsPane){fpsPane=document.getElementById("fpsPane");}
  if(frameCount%dFrame==0){fpsPane.textContent = `FPS: [${nf(frameRate(),2,2)}] (Updated Every [${dFrame}] Frames)`;}
}