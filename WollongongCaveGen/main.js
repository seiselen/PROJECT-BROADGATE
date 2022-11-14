
var imageDim = {init(dim){this.dim=dim;this.dimH=this.dim/2;}};
var canvDims = {init(wide,tall){this.wide=wide;this.tall=tall;this.wideH=this.wide/2;this.tallH=this.tall/2;}};
var colorMap = {BLACK:"#000000FF",WHITE:"#FFFFFFFF"}

canvDims.init(1280,800);
imageDim.init(512);

var PNoise = { 
  scale  : 0.02,
  xOff   : 516,
  yOff   : 631,
  getVal : (r,c)=>{[r,c]=[r+PNoise.yOff,c+PNoise.xOff]; return noise(c*PNoise.scale,r*PNoise.scale);}
}

var imgWollongBias;
var imgPerlinNoise;


function setup(){
  createCanvas(canvDims.wide,canvDims.tall).parent("viz");

  imageMode(CENTER);
  WBias.init(0.05);

  imgWollongBias = new ShaderImage(lerp(0,canvDims.wide,.25),canvDims.tallH).generate(rule_circle_perlin);
  imgPerlinNoise = new ShaderImage(lerp(0,canvDims.wide,.75),canvDims.tallH).generate(rule_perlin_field);

}


function draw(){
  background(60,120,180);

  imgWollongBias.render();
  imgPerlinNoise.render();

  drawCanvasCrosshair('#00FF0080',2);

  dispFPSViaDOM();
}

/*----------------------------------------------------------------------
|>>> MOUSE INTERACTION FUNCTIONS
----------------------------------------------------------------------*/
function mousePressed(){
  console.log(imgWollongBias.mousePosToPixelCoord());
}

function mouseReleased(){}
function mouseDragged(){}
/*----------------------------------------------------------------------
|>>> MISC CANVAS AND/XOR UTIL FUNCTIONS
----------------------------------------------------------------------*/
var fpsPane = null;
function dispFPSViaDOM(dFrame=3){
  if(!fpsPane){fpsPane=document.getElementById("fpsPane");}
  if(frameCount%dFrame==0){fpsPane.textContent = `FPS: [${nf(frameRate(),2,2)}] (Updated Every [${dFrame}] Frames)`;}
}