//>>> VORONOI CODE SOURCE (and info/instructions!)
// https://github.com/gorhill/Javascript-Voronoi


var canvDims = [1200,840];

var canvDisp;

var myBBox;
var myVerts;
var tempCol;
var voronoi;

var vorManager;

var bboxForVD;
var vertsForVD;
var vorDiagram;

var tempRandCell = 0;

function setup(){
  createCanvas(canvDims[0],canvDims[1]).parent("viz");
  noCursor();

  canvDisp = new CanvUtil(canvDims[0],canvDims[1]);

  vdManager = new VDManager(new BBox(20,20,1180,800), 40, 60);



  

} // Ends P5JS Function setup

function draw(){





  //>>> RENDER CALLS
  background(255);
  canvDisp.render();
  vdManager.render();

  CanvUtil.drawFPSSimple();
  canvDisp.drawCursor();
  canvDisp.drawMousePosTooltip();
} // Ends P5JS Function draw




function keyPressed(){

  //>>> Reserved for Canvas Util
  if(key=='b'){canvDisp.toggle_dispBorder();}
  if(key=='h'){canvDisp.toggle_dispCrossH();}
  if(key=='g'){canvDisp.toggle_dispGrid();}

  //>>> Reserved for [VD] Testbed Util
  if(key=='r'){vdManager.init();}
  if(key=='m'){vdManager.smoothCellsViaBBoxMidpt();}

}


