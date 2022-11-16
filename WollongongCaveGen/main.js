
var imageDim = {init(dim){this.dim=dim;this.dimH=this.dim/2;}};
var canvDims = {init(wide,tall){this.wide=wide;this.tall=tall;this.wideH=this.wide/2;this.tallH=this.tall/2;}};

var ColorMap = {WHITE:"#FFFFFF",BLACK:"#000000",PURPLE:"#FF00FF"}

canvDims.init(1280,800);
imageDim.init(400);

var PNoise = { 
  scale  : 0.02,
  xOff   : 516,
  yOff   : 631,
  setOffsets : (nX,nY)=>{PNoise.xOff=nX;PNoise.yOff=nY;},
  scrambleOffsets: ()=>{PNoise.setOffsets(Math.floor(Date.now()*random()),Math.floor(Date.now()*random()))},
  getVal : (r,c)=>{[r,c]=[r+PNoise.yOff,c+PNoise.xOff]; return noise(c*PNoise.scale,r*PNoise.scale);}
}

var imgWollongBias;
var imgPerlinNoise;
var imgWollonBlend;

function setup(){
  createCanvas(canvDims.wide,canvDims.tall).parent("viz");
  Object.keys(ColorMap).map(k=>ColorMap[k]=color(ColorMap[k]));

  imageMode(CENTER);
  WBias.init(0.05);

  generateAllMaps();
}


function draw(){
  background(60,120,180);

  imgWollongBias.render();
  imgPerlinNoise.render();
  imgWollonBlend.render();

  //drawCanvasCrosshair('#00FF0080',2);

  dispFPSViaDOM();
}


function generateAllMaps(){
  PNoise.scrambleOffsets();
  
  imgWollongBias = new ShaderImage(240-20,canvDims.tallH).generate(rule_circle_biased);
  imgPerlinNoise = new ShaderImage(1040+20,canvDims.tallH).generate(rule_perlin_field);
  imgWollonBlend = new ShaderImage(640,canvDims.tallH).generate(rule_wollon_blend);
}


/*----------------------------------------------------------------------
|>>> MOUSE/KEYBOARD INTERACTION FUNCTIONS
+---------------------------------------------------------------------*/


function mousePressed(){
  if(imgWollongBias.mouseOverMe()){
    console.log("yep");
  }
}

function keyPressed(){
  if(key==='r'||key==='R'){generateAllMaps();}
}

/*----------------------------------------------------------------------
|>>> MISC CANVAS AND/XOR UTIL FUNCTIONS
+---------------------------------------------------------------------*/
var fpsPane = null;
function dispFPSViaDOM(dFrame=3){
  if(!fpsPane){fpsPane=document.getElementById("fpsPane");}
  if(frameCount%dFrame==0){fpsPane.textContent = `FPS: [${nf(frameRate(),2,2)}] (Updated Every [${dFrame}] Frames)`;}
}