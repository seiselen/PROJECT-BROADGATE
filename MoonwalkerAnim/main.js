var CanvDims = {
  init(wide,tall){this.wide=wide; this.wideH=this.wide/2; this.tall=tall; this.tallH=this.tall/2; this.cellSize=32; this.dispGrid=false;},
  getCellDims(){return [this.tall/this.cellSize, this.wide/this.cellSize];},
  toggleGrid(){this.dispGrid=!this.dispGrid;}
};

const GridMap = {
  init(cTall,cWide,cSize){this.cellsWide=cWide; this.cellsTall=cTall; this.cellSize=cSize; this.cellSizeH=this.cellSize/2;},
  isValidCell(r,c){return (r>=0 && r<this.cellsTall && c>= 0 && c<this.cellsWide)},
  posToCoord(x,y){return [floor(y/this.cellSize),floor(x/this.cellSize)]},
  coordToPos(r,c){return this.midPtAtCoord(r,c)},
  midPtAtCoord(r,c){return vec2((c*this.cellSize)+this.cellSizeH, (r*this.cellSize)+this.cellSizeH)},
}

var sheetWalkAnims;
var sheetIdleAnims;
var bgImg;
var mjSounds = [];
var MJ;

function preload(){
  sheetWalkAnims=loadImage('assets/spritesheet.png');
  sheetIdleAnims=loadImage('assets/spritesheet_idleAnims.png');
  bgImg=loadImage('assets/bgLunarSurface.png');
  rkLyr=loadImage('assets/bgLunarSurface_rocksLayer.png');
  mjSounds.push(loadSound('assets/aooo.wav'));
  mjSounds.push(loadSound('assets/hooo.wav'));
  mjSounds.push(loadSound('assets/oooh.wav'));
}

function setup(){
  CanvDims.init(1024,768)
  createCanvas(CanvDims.wide,CanvDims.tall).parent("viz");
  GridMap.init(...CanvDims.getCellDims(),CanvDims.cellSize);
  angleMode(DEGREES);
  imageMode(CENTER);
  MJ = new KingOfPop().setPositionViaCoord(4,3);
}

function draw(){
  MJ.update();
  background(30+(220*noise(frameCount*0.02)));
     
  tint(30+(64*noise(frameCount*0.02)),255);
  image(rkLyr,CanvDims.wideH,CanvDims.tallH);

  tint(255,180);
  image(bgImg,CanvDims.wideH,CanvDims.tallH);


  tint(255,255);
  MJ.render();
  noFill();
  if(CanvDims.dispGrid){drawGrid(32,'#FFFFFF80',1);}
  drawCanvasBorder();
  dispFPSViaDOM();
}

function keyPressed(){
  if(key==' '){MJ.anim_motion();}
  if(key=='g'){CanvDims.toggleGrid();}

}

var fpsPane = null;
function dispFPSViaDOM(dFrame=3){
  if(!fpsPane){fpsPane=document.getElementById("fpsPane");}
  if(frameCount%dFrame==0){fpsPane.textContent = `FPS: [${nf(frameRate(),2,2)}] (Updated Every [${dFrame}] Frames)`;}
}