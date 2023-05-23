
import EisBBox from "./EISObjects/EisBBox.mjs";
import CanvasUtil from "./EISObjects/CanvasUtil.js";
import VoronoiUtil from "./EISObjects/VoronoiUtil.js";
import VertexUtil from "./EISObjects/VertexUtil.mjs";

const canvDims = [1280,800];
const canvInOff = 20; // canvas inward offset defining actual VD rect bounds WRT canv bounds
const canvInOff2x = canvInOff*2;
const minDesDist  = 32; // orig: 32
const numDesVerts = 256; // orig: 512

var canvDisp;
var vertUtil;
var voronoi;

window.setup =()=> {
  createCanvas(canvDims[0],canvDims[1]).parent("viz");

  noCursor();

  let bbox = new EisBBox(canvInOff, canvInOff, canvDims[0]-canvInOff2x, canvDims[1]-canvInOff2x);

  let vertUtil = new VertexUtil(bbox,numDesVerts,minDesDist);

  canvDisp = new CanvasUtil(canvDims[0],canvDims[1],vertUtil);

  voronoi = new VoronoiUtil(bbox, vertUtil);

  VertGridSnapExpmt.init();
} // Ends P5JS Function setup

window.draw =()=> {
  //>>> RENDER CALLS
  background(255);
  canvDisp.render();
  voronoi.render();
  canvDisp.lateRender();

  //VertGridSnapExpmt.render();
} // Ends P5JS Function draw

window.mousePressed =()=> {voronoi.onMousePressed();return false;}
window.mouseDragged =()=> {voronoi.onMouseDragged();return false;}
window.mouseReleased =()=> {voronoi.onMouseReleased();return false;}

window.keyPressed =()=> {
  if(key=='r'){voronoi.resetVD()}
  if(key=='m'){voronoi.smoothCellsViaBBoxMidpt()}
  if(key=='s'){saveCanvas("generated_voronoi","png")}
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