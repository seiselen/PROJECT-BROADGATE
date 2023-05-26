
/*
ALGORITHM FOR PERLIN SAMPLING OF ELEV VALS WITHIN VORONOI CELLS:
  > Query-Get all the verts of the poly; which you already (know how to) do.
  > Compute {minX, minY, maxX, maxY} AABB via the verts; which you know how to do.
  > Write randomPtInBoundBox(pX,pY,qX,qY){return vec2(int(random(pX,qX)), int(random(pY,qY)))}
  > Pass values returned therefrom into your "isInPolygon" function xor that of the Voronoi lib.
  > Set a sentinel threshold on `numTries` to get a point within the polygon (512 should do it?)
  > Run it as many times as needed per the LOD and/or scale of the Perlin field
  > Speaking of Perlin-based elevations: mapping options of its [0,1] output:
    o Linear with [elevMIN,elevMAX] s.t. absdist(elevMIN) much less than absdist(elevMAX)
      * this should effect "have some shallow underwater areas but overall bias above water level"
      * ideas for [elevMIN,elevMAX] in feet: [0,1] => {[-60,320], [-12,240], [-12,96], etc.}
    o Logarithmic/Easing: meh... KISS for now
*/








import EisBBox from "./EISObjects/EisBBox.mjs";
import CanvasUtil from "./EISObjects/CanvasUtil.js";
import VoronoiUtil from "./EISObjects/VoronoiUtil.js";
import VertexUtil from "./EISObjects/VertexUtil.mjs";

import PerlinNoiseField from "./EISObjects/PerlinUtil.mjs";

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

  vertUtil = new VertexUtil(bbox,numDesVerts,minDesDist);

  canvDisp = new CanvasUtil(canvDims[0],canvDims[1],vertUtil);

  voronoi = new VoronoiUtil(bbox, vertUtil);

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