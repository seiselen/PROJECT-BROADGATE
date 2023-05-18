//>>> VORONOI CODE SOURCE (and info/instructions!)
// https://github.com/gorhill/Javascript-Voronoi

var canvDims = [1200,840];

var canvDisp;
var voronoi;

function setup(){
  createCanvas(canvDims[0],canvDims[1]).parent("viz");
  noCursor();
  canvDisp = new CanvUtil(canvDims[0],canvDims[1]);
  voronoi = new VoronoiDiagram(new BBox(20,20,1180,800), 512, 32);

  VertGridSnapExpmt.init();
} // Ends P5JS Function setup

function draw(){
  //>>> RENDER CALLS
  background(255);
  canvDisp.render();
  voronoi.render();
  canvDisp.lateRender();

  //VertGridSnapExpmt.render();
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

function toggle_dispInstruct_DOM(){
  canvDisp.toggle_dispInstruct();
}





//# SUPER TEMP JUST TO COPY-VIZ-THEN-FUCK-WITH VD CELL VERTS
//  > OKAY SO THIS EXPERIMENT DOES PROVE THAT SNAPPING VIA 'ROUND-TO-INT-THEN-TO-INPUT-VAL'
//    DOES WORK AND IS CONSISTENT (OR AT LEAST NON-DEGENERATE) AS WAS EXPECTED...
var VertGridSnapExpmt = {
  verts: [],

  init: ()=>{
    VertGridSnapExpmt.strk = color(0);
    VertGridSnapExpmt.fillA = color(255,255,0);
    VertGridSnapExpmt.fillB = color(255,120,0);     
    VertGridSnapExpmt.sWgt = 1.5;
    VertGridSnapExpmt.diam = 6;
    VertGridSnapExpmt.sinCoTerm = (3*PI)/2;
    VertGridSnapExpmt.getCopyOfVDsVerts();
  },

  getCopyOfVDsVerts: ()=>{
    VertGridSnapExpmt.verts = [];
    voronoi.VD.vertices.forEach((v)=>VertGridSnapExpmt.verts.push(createVector(v.x,v.y)));
  },

  snapVertsToNearest: (val=1.0)=>{
    VertGridSnapExpmt.verts.forEach(v=>v.set(round(v.x/val)*val,round(v.y/val)*val));
  },

  setLazyStrobeFill: (speed=60)=>{
    fill(lerpColor(VertGridSnapExpmt.fillA, VertGridSnapExpmt.fillB, (sin(map(frameCount%speed,0,speed,0,TAU,true),VertGridSnapExpmt.sinCoTerm)+1)*0.5));
  },

  render: ()=>{
    stroke(VertGridSnapExpmt.strk);
    strokeWeight(VertGridSnapExpmt.sWgt);
    VertGridSnapExpmt.setLazyStrobeFill();
    VertGridSnapExpmt.verts.forEach(v=>ellipse(v.x,v.y,VertGridSnapExpmt.diam))
  },

}