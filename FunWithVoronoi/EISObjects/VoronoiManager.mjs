/*######################################################################
|> MODULE IMPORTS
+#####################################################################*/
import Voronoi from "../Voronoi/Voronoi.mjs";
import EisBBox from "./EisBBox.mjs";
import VDiagram from "../Voronoi/VDiagram.mjs";
import { truthy, distLessThan, vertsEqual, setStyle, falsy, distGreaterThan, distSq } from "../utils.mjs";
import VVertex from "../Voronoi/VVertex.mjs";
import VCell from "../Voronoi/VCell.mjs";

/*######################################################################
|> CONST PRIMITIVE VALS
+#####################################################################*/

/** Minimum allowed distance between sites of which a VD will be generated. */
const MIN_SITE_DIST = 4;

/** Maximum allowed distance between sites of which a VD will be generated. */
const MAX_SITE_DIST = 32;

/** Default Collision Radius e.g. s.t. dropping a site within this dist of another 'snaps' it back to pre-move position. */
const DEFAULT_COLLIDE_RADIUS = MAX_SITE_DIST;

/** Maximim number of attempts to locate a random position for a site, of min dist from existing sites, before giving up. */
const MAX_PLACEMENT_TRIES = 32768;

/** Default number of sites, assigned on creation of VoronoiManager object */
const DEFAULT_NUM_SITES = 256;

/*######################################################################
|> CONST STRING BLURBS
+#####################################################################*/
const WARN_PFIX      = ">>> WARNING: ";
const ERR_PFIX       = ">>> ERROR: ";
const WARN_MAX_TRIES = WARN_PFIX+"Max failed attempts to find valid site location! Returning sites which were able to be positioned.";
const ERR_SITES_MTCH = ERR_PFIX+"Mismatch between lengths of site/vertex/vector sets! Returning immediately.";
const ERR_NO_OBS_ARR = [ERR_PFIX+"No observer array currently exists of name specified by input (","); ergo returning immediately."];

/*######################################################################
|> CLASS DEFINITION / MODULE EXPORT
+#####################################################################*/

/**
 * @author Steven Eiselen <http://seiselen.github.io>
 */
export class VoronoiManager {
  /*====================================================================
  |> JSDOC (AT LEAST ASSOCIATE THE TYPE AS I'M FUCKING TIRED OF ':any')
  +===================================================================*/

  /**@type {PVector}*/    selectedSite;
  /**@type {number}*/     selectedSiteIdx;  
  /**@type {number}*/     numSitesReq;
  /**@type {number}*/     minDistBtwn;
  /**@type {number}*/     minDistBtwnDiam;  
  /**@type {VDiagram}*/   curDiagram;
  /**@type {Voronoi}*/    generator;
  /**@type {EisBBox}*/    bbox;
  /**@type {PVector[]}*/  inputSiteSet;
  /**@type {callback[]}*/ obs_numVDSites;

  /*====================================================================
  |> CONSTRUCTOR AND INIT/RESET METHODS
  +===================================================================*/

  /**
   * @param {EisBBox} in_bbox 
   * @param {number} in_numSitesReq
   * @param {number} in_minDistBtwn
   */
  constructor(in_bbox, in_numSitesReq, in_minDistBtwn, in_collideDist){
    this.bbox = in_bbox;
    this.inputSiteSet = [];
    this.outputVertSet = [];
    this.curDiagram = undefined;
    this.generator = new Voronoi();

    //> Props With Their Own [Re]Setter Methods
    this.setNumSitesRequested(in_numSitesReq);
    this.setMinDistanceBetween(in_minDistBtwn);
    this.setcolliderVals(in_collideDist)
    this.resetSelectedSite();

    //> BOOL FLAGS/TRIGGERS
    this.canAddNewSites = true;
    this.canRemoveSites = true;

    //> OBSERVER MANIFESTS
    this.obs_numVDSites = [];
    
    //> Init Calls
    this.resetMouseCell();
    this.initStyles();

    this.initSitesAndDiagram();
  }

  /**
   * @param {string} theme `L` ⮕ **Light** | 'D' ⮕ **Dark** (default: `L`)
   */
  initStyles(theme='L'){
    this.style = (theme=='D') ? this.theme_voronoi_dark() : this.theme_voronoi_light();
  }

  /** Clears existing input sites, creates new set thereof, then computes Voronoi Diagram. */
  initSitesAndDiagram(){
    this.clearSites();
    this.createMinDistSites();
    this.createDiagramFromSites();
  }
  
  /** Computes Voronoi Diagram from current set of input sites */  
  createDiagramFromSites(){
    this.curDiagram = this.generator.compute(this.inputSiteSet, this.bbox.getBoundsVD())
    this.broadcastAll('obs_numVDSites');
  }

  clearSites(){
    while(this.inputSiteSet.length>0){this.inputSiteSet.pop();}
  }

  resetSelectedSite(){
    this.selectedSite = undefined;
    this.selectedSiteIdx = -1;
    this.selectedSiteOrigPos = undefined;
  }

  resetMouseCell(){
    this.mouseCell = undefined;
    this.mouseCellIdx = -1;
  }


  setNumSitesRequested(in_numSitesReq){
    this.numSitesReq = in_numSitesReq ?? DEFAULT_NUM_SITES
  }

  setMinDistanceBetween(in_minDistBtwn){
    this.minDistBtwn = in_minDistBtwn ? constrain(in_minDistBtwn,MIN_SITE_DIST,MAX_SITE_DIST) : MAX_SITE_DIST
  }

  //> lazily reusing the same [MIN,MAX] constraints as site dist, as it's a fine enough range thereto
  setcolliderVals(in_collideDist){
    this.collideRadius = in_collideDist ? constrain(in_collideDist,MIN_SITE_DIST,MAX_SITE_DIST) : DEFAULT_COLLIDE_RADIUS;
    this.collideDiamtr = this.collideRadius*2;
    this.siteGlyphDiam = this.collideRadius/2;
  }



  /*====================================================================
  |> OBSERVER REALIZATION
  +===================================================================*/

  /**
   * 
   * @param {String} req thing to observe; which must match the name of
   * its corresponding observer array; e.g. `"obs_numVDSites"` 
   * @param {(number)=>{}} callback self-explanatory
   */
  addObserver(req,callback){
    let obsArray = this[req];
    if(falsy(obsArray)){console.error(`${ERR_NO_OBS_ARR[0]}${req}${ERR_NO_OBS_ARR[1]}`); return;}
    obsArray.push(callback);
    //> and init/seed the callback as this is technically it's first listen
    this.broadcastTo(req,callback);
  }

  broadcastAll(event){
    let obsArray = this[event];
    if(falsy(obsArray)){console.error(`${ERR_NO_OBS_ARR[0]}${event}${ERR_NO_OBS_ARR[1]}`); return;}    
    obsArray.forEach(callback=>this.broadcastTo(event,callback));
  }

  broadcastTo(event,observer){
    switch(event){
      case "obs_numVDSites" : observer(this.getNumDiagramSites()); return;
    }  
  }



  /*====================================================================
  |> (PER-FRAME) UPDATE METHODS
  +===================================================================*/

  update(){
    this.mouseCellIdx = this.getCellIdxAtMousePt();
    if(this.mouseCellIdx<0){this.resetMouseCell()}
    this.mouseCell = this.getCellAtMousePt();
  }

  /*====================================================================
  |> UI HANDLER FUNCTIONS
  +===================================================================*/

  onMousePressed(){
    this.resetSelectedSite()
    let mVec = mousePtToVec();
    this.selectSiteAtMouse(mVec);
    if(this.selectedSiteExists()){return;}
    this.addNewSite(mVec);
  }
  
  onMouseDragged(){
    this.moveSelectedSite();
  }
  
  onMouseReleased(){
    //> If no selected site: do nothing!
    if(!this.selectedSite){return}

    //> Delete selected site if it has been placed outside of the diagram bounding area
    if(this.canRemoveSites && !this.bbox.inBounds(this.selectedSite.x,this.selectedSite.y)){this.inputSiteSet.splice(this.selectedSiteIdx, 1);}

    //> 'Snap-Back' selected site to pre-selected position if it collides with an existing site
    if(this.pointCollidesWithSites(this.selectedSite)){this.selectedSite.set(this.selectedSiteOrigPos.x,this.selectedSiteOrigPos.y)}
    
    //> In all cases where truthy(selectedSite): reset it to falsy, then recompute diagram
    this.resetSelectedSite();
    this.createDiagramFromSites();
    
  }
  
  /*====================================================================
  |> BEHAVIORS (SELECTORS, [POST-]PROCESSORS, UTIL TOOLS, ETC.)
  +===================================================================*/

  selectSiteAtMouse(mVec){
    this.selectedSiteIdx = this.inputSiteSet.findIndex(site=>distLessThan(site,mVec,this.collideRadius));
    if(this.selectedSiteIdx>=0){
      this.selectedSite=this.inputSiteSet[this.selectedSiteIdx];
      this.selectedSiteOrigPos=createVector(this.selectedSite.x, this.selectedSite.y);
    }
  }

  moveSelectedSite(){
    if(!this.selectedSiteExists()){return;}
    this.selectedSite.set(mouseX,mouseY);
    this.createDiagramFromSites();
  }

  addNewSite(mVec){
    if (this.canAddNewSites && this.bbox.inBounds(mVec.x,mVec.y) && this.pointDoesntCollideWithMouseCellSite(mVec)){
      this.inputSiteSet.push(mVec);
      this.createDiagramFromSites();
    }
  }

  /*====================================================================
  |> STATE/SITU GETTERS (INCL 'STATE EXISTS?' BOOLS AND STATE COPIERS)
  +===================================================================*/

  /**
   * **Purpose:** Returns `true` if current computed diagram is truthy.
   * @returns {boolean}
   */  
  computedDiagramExists(){return truthy(this.curDiagram)}

  /**
   * **Purpose:** Returns `true` if current computed diagram is falsy.
   * @syntaxsugar returns the negation of {@link computedDiagramExists}
   * @returns {boolean}
   */
  noComputedDiagram(){return !this.computedDiagramExists()}

  /**
   * **Purpose:** Validates that a non-nullish diagram was computed and
   * assigned to this manager; s.t. if not: this does a `console.err` to
   * inform caller. Designed for use by getter/processor functions upon
   * computed diagram; s.t. this can be called within an `if` statement
   * on their first lines in a streamlined manner and with minimal code.
   * @returns {boolean} via value of {@link computedDiagramExists} call
   */
  valdiateComputedDiagam(){
    switch(this.computedDiagramExists()){
      case true: return true;
      case false: console.error("ERROR: Computed diagram is null xor undefined!"); return false;
    }
  }

  selectedSiteExists(){
    return truthy(this.selectedSite)
  }

  mouseCellExists(){
    return truthy(this.mouseCell)
  }


  pointDoesntCollideWithMouseCellSite(pos){
    return distGreaterThan(this.mouseCell.site,pos,this.collideRadius);
  }


  pointCollidesWithSites(pos){
    return this.inputSiteSet.some(site=>(!vertsEqual(pos,site)&&distLessThan(pos,site,this.collideRadius)))
  }



  /*====================================================================
  |> UTIL GETTERS/CREATORS
  +===================================================================*/

  /**
   * Creates set of random site points wherein each must be of min dist
   * from all others. Uses brute force method, but it works well enough!
   * @note this is now a method i.e. it directly sets {@link inputSiteSet}
   * @warning If the bounding box is too small and/or densely populated
   * with existing sites: the number of failed attempts to find new ones
   * will hit {@link MAX_PLACEMENT_TRIES}. This will effect:
   * 1) stopping any further searching; then
   * 2) a `console.warn` about the situation; then
   * 3) returning the sites which were able to be located
   */
  createMinDistSites(){
    let curTries = 0;

    /** @type {PVector[]} */
    let siteLocs = []; 

    let curPos   = createVector(-1,-1);
    let isValid  = false;

    /** @todo DO I NEED THIS LINE?!? */
    siteLocs.push(this.bbox.getRandomPoint()); // 'primes the pump'

    while(siteLocs.length<this.numSitesReq && curTries<MAX_PLACEMENT_TRIES){
      isValid = true;
      curPos = this.bbox.getRandomPoint();
      siteLocs.forEach((v)=>{isValid=(isValid&&(v.dist(curPos)>=this.minDistBtwn));});
      switch(isValid){case true: siteLocs.push(curPos); break; case false: curTries++; break;}
    }
    if(curTries>=MAX_PLACEMENT_TRIES){console.warn(`${WARN_MAX_TRIES} i.e.: (${siteLocs.length}/${this.numSitesReq}).`)}

    this.inputSiteSet = siteLocs;
  }

  /**
   * @todo REMOVE OR MODIFY THIS ONCE YOU'VE DECIDED ON USING p5.Vector XOR NOT...
   * @returns 
   */
  createSitesInputForComputeVD(){
    return this.inputSiteSet.map(site=>{return {x:site.x, y:site.y}});
  }



  getCellIdxAtMousePt(){
    if(!mouseInCanvas()||!this.computedDiagramExists()){return -1}
    let minIdx  = -1;
    let minDist = Number.POSITIVE_INFINITY;
    let curDist;
    for(let i=0; i<this.curDiagram.cells.length; i++){
      curDist = dist(this.curDiagram.cells[i].site.x,this.curDiagram.cells[i].site.y,mouseX,mouseY);
      if(curDist<minDist){minDist=curDist; minIdx=i;}
    }
    return minIdx;
  }


  getCellAtMousePt(){
    if(!mouseInCanvas()){return null}
    let idx = this.getCellIdxAtMousePt();
    if(idx<0){return null;}
    return this.curDiagram.cells[idx];
  }




  /**
   * @todo apparently the lib provides these ordered counterclockwise... when shit's working again: test for it!
   * @param {*} cell 
   * @param {*} q 
   * @returns 
   */
  findHEPair(cell,q){
    let i_edge;
    for(let i=1; i<cell.halfedges.length; i++){
      i_edge = cell.halfedges[i].edge;
      if(q.edge==i_edge){continue;}
      if(vertsEqual(q.edge[q.vID],i_edge.va)){return {edge: i_edge, vID: "vb"};}
      if(vertsEqual(q.edge[q.vID],i_edge.vb)){return {edge: i_edge, vID: "va"};}
    }
  }


  /**
   * Returns **copy** of input site set
   * @warning **NOTE:** Does **NOT** return copies as `p5.Vectors` but instead as primitive `{x:#,y:#}` obj.
   * @todo I'm planning on ditching `p5.Vectors` and using either my own primitive coord xor recycle `VVertex`. Whichever the case: change this to accordingly.
   * @returns {{x:number,y:number}}
   */
  copyInputSiteSet(){
    let copiedSet = []; 
    this.inputSiteSet.forEach((v)=> copiedSet.push({x: v.x, y: v.y})); 
    return copiedSet;
  }





  smoothCellsViaBBoxMidpt(){
    if(this.noComputedDiagram()){return -1}
    let cellMidpts = this.getAllCellBBoxMidpts();
    if(this.inputSiteSet.length != cellMidpts.length){console.log(ERR_SITES_MTCH); return;}
    cellMidpts.forEach((mpt, i)=>this.inputSiteSet[i].set(mpt.x,mpt.y)); 
    this.createDiagramFromSites();
  }

  /**
   * **Purpose:** Returns copy of 'loose' vertices of computed VD (if it exists), snapped to input precision.
   * @todo Returns snapped verts for now... but figure out how and where to realize vizzing it.
   * @todo As per other functions: when you make up your mind about ditching `p5.Vector` for `VVertex`, effect changes herein
   * @param {number} precision snapping precision i.e. "snap to nearest `number`"
   */
  snapVertsToNearest(precision=1.0){
    if(this.noComputedDiagram()){return}
    this.outputVertSet = this.curDiagram.vertices.map(v=>createVector(round(v.x/precision)*precision,round(v.y/precision)*precision));
  }


  //> HOLY SHIT HOLY SHIT THIS FUCKING WORKS!!!
  cellPolygonToOBJFormat(cellIdx){
    let retArr = [];
    let sp;

    this.curDiagram.cells[cellIdx].halfedges.forEach(hEdge=>{
      sp = hEdge.getStartpoint();
      retArr.push(`v ${sp.x} ${sp.y} 0.0`);    
    });

    let faceLine = 'f';
    for (let idx=0; idx<retArr.length; idx++){faceLine+=` -${idx+1}`}
    retArr.push(faceLine);
    return retArr;
  }

  cellPolygonSubsetToOBJFormat(cellIdxs){
    let bigStrArr = [];
    cellIdxs.forEach(idx=> bigStrArr = bigStrArr.concat(this.cellPolygonToOBJFormat(idx)));
    return bigStrArr;
  }

  //> AND THIS FUCKING WORKS SO MUCH THAT IT SUCCESSFULLY IMPORTED INTO BLENDER (NEXT TIME... SKETCHUP)
  allCellsToObjFormat(){
    let bigStrArr = [];
    for(let idx=0; idx<this.curDiagram.cells.length; idx++){
      bigStrArr = bigStrArr.concat(...this.cellPolygonToOBJFormat(idx))
    }
    saveStrings(bigStrArr, 'cells.obj');
  }



  /*====================================================================
  |> COMPUTED DIAGRAM UTILS (VS MODIFYING LIBRARY'S OBJ/CLASS DEFS)
  +===================================================================*/

  getNumDiagramSites(){
    return this.computedDiagramExists() ? this.curDiagram.cells.length : undefined
  }

  /**
   * 
   * @param {VCell} cell 
   * @returns 
   */
  getCellBBoxMidpt(cell){
    let bounds = cell.getBbox();
    return {x:bounds.x+(bounds.width/2), y:bounds.y+(bounds.height/2)}
  }

  /**
   * 
   * @param {VCell} cell 
   * @returns {[number,number]} `[xCoord,yCoord]`
   */
   getCellBBoxMidptAsArray(cell){
    let mptCoord = this.getCellBBoxMidpt(cell);
    return [mptCoord.x,mptCoord.y]
  } 

  getAllCellBBoxMidpts(){
    return this.curDiagram.cells.map((c)=>this.getCellBBoxMidpt(c)); 
  }




  /**
   * Return **COPY** of this diagram's vertices.
   * @note This does **NOT** return the VD's sites... but {@link copySites} **DOES**!
   * @returns {VVertex[]|null}
   */
  copyVertices(){
    switch(this.valdiateComputedDiagam()){
      case true: return this.curDiagram.vertices.map((v)=>new VVertex(v.x,v.y));
      case false: return null;
    }
  }

  /**
   * Return **COPY** of the sites encompassing this diagram's cells.
   * @returns {VVertex[]|null}
   */
  copySites(){
    switch(this.valdiateComputedDiagam()){
      case true: return this.curDiagram.cells.map((c)=>new VVertex(c.site.x, c.site.y));
      case false: return null;
    }
  }








  /*====================================================================
  |> RENDER SECTION
  +===================================================================*/
  
  render(){
    this.renderBounds();
    this.renderDiagramSites();
    this.renderEdges();
    this.renderCellAtMousePt();
    this.renderSelectedSite();
  }

  renderBounds(){
    this.bbox.render();
  }
  
  renderDiagramSites(){
    if(this.noComputedDiagram()){return}
    this.curDiagram.cells.forEach(cell=>{
      setStyle(this.style.fill_sites_all,this.style.strk_sites_all,this.style.swgt_general);
      circle(cell.site.x,cell.site.y,this.siteGlyphDiam);
      setStyle(this.style.fill_site_circ,this.style.strk_site_circ,this.style.swgt_general);
      circle(cell.site.x,cell.site.y,this.collideDiamtr);  
    });
  }

  renderSelectedSite(){
    if(!this.selectedSiteExists()){return}
    setStyle(this.style.fill_sites_sel,this.style.strk_sites_sel,this.style.swgt_general);
    circle(this.selectedSite.x,this.selectedSite.y,this.siteGlyphDiam)
  }
  
  renderEdges(){
    if(this.noComputedDiagram()){return}    
    setStyle(null,this.style.strk_edges_all,this.style.swgt_general)
    this.curDiagram.edges.forEach((e)=>line(e.va.x,e.va.y,e.vb.x,e.vb.y));
  }
  
  renderCellOfIndex(idx){
    if(this.noComputedDiagram()){return}    
    if(idx<0 || idx>=this.curDiagram.cells.length){return}
    this.renderCellNgon(this.curDiagram.cells[idx]);
  }
  
  renderCellAtMousePt(){
    if(!this.mouseCellExists()||this.mouseCell.halfedges.length==0){return}
    this.renderCellNgon(this.mouseCell);    
  }
  
  renderCellNgon(cell){
    if(cell.halfedges.length==0){return;} // still kinda no clue how/when/why this happens
    setStyle(this.style.fill_edges_sel, this.style.strk_edges_sel, this.style.swgt_edges_sel);
    beginShape();
    let cur = {edge:cell.halfedges[0].edge, vID:"vb"}
    vertex(cur.edge.va.x, cur.edge.va.y);
    vertex(cur.edge.vb.x, cur.edge.vb.y);
    for(let i=1; i<cell.halfedges.length; i++){cur=this.findHEPair(cell,cur); vertex(cur.edge[cur.vID].x, cur.edge[cur.vID].y);}
    endShape(CLOSE);  
  }
  
  renderCellMidpoint(cell){
    setStyle(this.style.fill_sites_mpt, this.style.strk_sites_mpt, this.style.swgt_general);
    circle(...this.getCellBBoxMidptAsArray(cell),this.siteGlyphDiam);
  }

  theme_voronoi_light(){return{
    swgt_general:   1,
    strk_edges_all: color(0,120,36),
    fill_edges_sel: color(0,216,0,64),
    strk_edges_sel: color(0,216,0,128),
    swgt_edges_sel: 4,
    fill_sites_all: color(240,128,0),
    strk_sites_all: color(0,128),
    fill_sites_sel: color(255,120,0),
    strk_sites_sel: color(0),
    fill_sites_mpt: color(0,255,0),
    strk_sites_mpt: color(0,72,0),
    fill_site_circ: color(240,128,0,32),
    strk_site_circ: null
  }}
  
  theme_voronoi_dark(){return{
    swgt_general:   1,
    strk_edges_all: color(0,255,255),
    fill_edges_sel: null,
    strk_edges_sel: color(0,255,255,128),
    swgt_edges_sel: 8,
    fill_sites_all: color(0,128),
    strk_sites_all: color(0,255,255),
    fill_sites_sel: color(228,96,0),
    strk_sites_sel: color(255),
    fill_sites_mpt: color(0,255,0),
    strk_sites_mpt: color(0,72,0),
    fill_site_circ: color(0,255,255,32),
    strk_site_circ: null
  }}
  
} // Ends Class Def # # #

export default VoronoiManager;