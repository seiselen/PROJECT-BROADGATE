//>>> VORONOI CODE SOURCE (and info/instructions!)
// https://github.com/gorhill/Javascript-Voronoi

var canvDims = [1200,840];

var canvDisp;
var voronoi;

function setup(){
  createCanvas(canvDims[0],canvDims[1]).parent("viz");
  noCursor();
  canvDisp = new CanvUtil(canvDims[0],canvDims[1]);
  voronoi = new VoronoiDiagram(new BBox(20,20,1180,800), 100, 40);
} // Ends P5JS Function setup

function draw(){
  //>>> RENDER CALLS
  background(255);
  canvDisp.render();
  voronoi.render();
  canvDisp.renderFPSSimple();
  canvDisp.renderNumVerts();
  canvDisp.drawCursor();
  canvDisp.drawMousePosTooltip();
} // Ends P5JS Function draw

function mousePressed(){voronoi.onMousePressed();return false;}
function mouseDragged(){voronoi.onMouseDragged();return false;}
function mouseReleased(){voronoi.onMouseReleased();return false;}
function keyPressed(){
  //>>> Reserved for Canvas Util
  //if(key=='b'){canvDisp.toggle_dispBorder();}
  //if(key=='h'){canvDisp.toggle_dispCrossH();}
  if(key=='g'){canvDisp.toggle_dispGrid();}
  //>>> Reserved for [VD] Testbed Util
  if(key=='r'){voronoi.resetVD();}
  if(key=='m'){voronoi.smoothCellsViaBBoxMidpt();}
}