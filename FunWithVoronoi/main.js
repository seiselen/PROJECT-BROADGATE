
import EisBBox from "./EISObjects/EisBBox.mjs";
import CanvasUtil from "./EISObjects/CanvasUtil.mjs";
import VoronoiManager from "./EISObjects/VoronoiManager.mjs";
//import PerlinNoiseField from "./EISObjects/PerlinManager.mjs";

const canvDims = [1344,832];
const canvInOff = 32; // canvas inward offset defining actual VD rect bounds WRT canv bounds
const minDistBtwn = 32; // orig: 32
const numSitesReq = 512; // orig: 512

/** @type {CanvasUtil} */
var canvDisp;

/** @type {VoronoiManager} */
var vorManager;

window.setup =()=> {
  createCanvas(canvDims[0],canvDims[1]).parent("viz");
  noCursor();

  let bbox = new EisBBox(canvInOff, canvInOff, canvDims[0]-canvInOff, canvDims[1]-canvInOff);
  canvDisp = new CanvasUtil(canvDims[0],canvDims[1]);
  vorManager = new VoronoiManager(bbox, numSitesReq, minDistBtwn);

  vorManager.addObserver("obs_numVDSites",(v)=>{canvDisp.callback_numVDSites(v)});

  console.log(vorManager);
}

window.draw =()=>{
//[IN-FRAME UI]=========================================================
  if(keyIsDown(77)){vorManager.smoothCellsViaBBoxMidpt()} //> 77==='m'
//[UPDATE]==============================================================
  vorManager.update();
//[RENDER]==============================================================
  background(255);
  vorManager.render();
  canvDisp.render();
}

window.mousePressed =()=>{
  vorManager.onMousePressed();
  return false;
}

window.mouseDragged =()=>{
  vorManager.onMouseDragged();
  return false;
}

window.mouseReleased =()=>{
  vorManager.onMouseReleased();
  return false;
}

window.keyPressed =()=>{
  if(key=='r'){vorManager.resetVD()}
  if(key=='m'){vorManager.smoothCellsViaBBoxMidpt()}
  if(key=='s'){saveCanvas("generated_voronoi","png")}
}