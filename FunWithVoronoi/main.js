import EisBBox from "./EISObjects/EisBBox.mjs";
import CanvasUtil from "./EISObjects/CanvasUtil.mjs";
import VoronoiManager from "./EISObjects/VoronoiManager.mjs";
import PerlinManager from "./EISObjects/PerlinManager.mjs";

const canvDims = [1344,832];
const canvInOff = 32; // canvas inward offset defining actual VD rect bounds WRT canv bounds
const minDistBtwn = 32;
const collideDist = 12;
const numSitesReq = 512;

/** @type {CanvasUtil} */
var canvasDisp;

/** @type {VoronoiManager} */
var vorManager;

/** @type {PerlinManager} */
var perManager;

window.setup =()=> {
  createCanvas(canvDims[0],canvDims[1]).parent("viz");
  noCursor();
  let bbox = new EisBBox(canvInOff, canvInOff, canvDims[0]-canvInOff, canvDims[1]-canvInOff);
  canvasDisp = new CanvasUtil(canvDims[0],canvDims[1]);
  vorManager = new VoronoiManager(bbox, numSitesReq, minDistBtwn, collideDist);
  //perManager = new PerlinManager(bbox);
  vorManager.addObserver("obs_numVDSites",(v)=>{canvasDisp.callback_numVDSites(v)});
  console.log(vorManager);
}

window.draw =()=>{
//[IN-FRAME UI]=========================================================
  if(keyIsDown(77)){vorManager.smoothCellsViaBBoxMidpt()} //> 77==='m'
//[UPDATE]==============================================================
  vorManager.update();
//[RENDER]==============================================================
  background(255);
  //perManager.render();
  vorManager.render();
  canvasDisp.render();
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
  if(key=='r'){vorManager.initSitesAndDiagram()}
  if(key=='m'){vorManager.smoothCellsViaBBoxMidpt()}
  //if(key=='g'){perManager.generateNewImage()}
  if(key=='s'){vorManager.allCellsToObjFormat()}
}