p5.disableFriendlyErrors = true;

//######################################################################
//###[ Global Variables / Data-Structures ]#############################
//######################################################################
var MapDispMode = {cellPop:'mdmP', heatMap:'mdmH'};
var AgtDispMode = {semiOpaque:'pdmT', fullOpaque:'pdmO'};
var ShapeDrawMode = {viaEllipse:'E', viaRect:'R', viaImage:'I'};

var GenDispMode = {
  cellPop:'cPop', heatMap:'hMap', 
  toString: function(mode){switch(mode){case this.cellPop: return "Cell Population Mode"; case this.heatMap: return "Cell Heatmap Mode";}}
};

/*----------------------------------------------------------------------
|>>> SPECIAL NOTE (12/19/21): 'Spatial Partition Frame Offset'
+-----------------------------------------------------------------------
| > spFrmOff -> Spatial Partition Frame Offset. Disabled if set to any
|   value at/below 1 (by this and/or that definition). Otherwise: will
|   result in [1/spFrmOff] agents performing SP updates each frame <vs>
|   every agent; and IIRC: this is called 'staggered [agent] updates' 
|   in gamedev lingo. In any case: the purpose is to reduce the amount 
|   of computation done each frame, as agents don't [necessarily] need
|   to post their position to the SP map and get neighbor info on EACH
|   frame; though if-n-assumuing the FPS is good-enough for the player
|   not to notice the consequent delay. In any case, my algorithm is as
|   follows: if((frameCount % spFrmOff) == (agentID % spFrmOff)){...}
| > Implementing [Realizing] it as a global struct (D.B.A. a JS object) 
|   containing both the 'spFrmOff' value and a function for agents to
|   call which returns a bool indicating whether or not it's their turn
|   to update; as this is the most modular and least distruptive to the
|   public demo (yes I'm working with ergo modifying its code thereto,
|   as I'm too dumb and lazy to split the branch like the 'eXpErTs' do)
| > HOLY SHIT: IT WORKS! Homer Count up 25-50% (~1700 @ spFrmOff=[1],
|   ~2400 @ spFrmOff=[2], ~2900 @ spFrmOff=[3], ~3300 @ spFrmOff=[4])
+---------------------------------------------------------------------*/
var SPFrmOff = {
  spFrmOff: 2, //-1,
  canUpdate: function(agentID){return (this.spFrmOff<1) ? false : ((frameCount % this.spFrmOff) == (agentID % this.spFrmOff));}
}

var SpatPartMode = {
  gridViaObj:'spmO', gridViaMap:'spmM', none:'spmN',
  toString: function(mode){switch(mode){case this.gridViaObj: return "[Grid] via JS Properties"; case this.gridViaMap: return "[Grid] via JS Map Object"; case this.none: return "[None] O(n^2) 'All-Pairs'";}}
};

var Config = {
  CANV_WIDE: 1024, CANV_TALL: 768, 
  CELLS_TALL: 12,  CELLS_WIDE: 16, CELL_SIZE: 64,  
  /*CELLS_TALL: 24,  CELLS_WIDE: 32, CELL_SIZE: 32,*/
  FRAME_RATE:     60,
  PAUSED:         false,
  SHOW_AGENTS:    true,
  AGT_SHAPE_MODE: ShapeDrawMode.viaRect, //viaEllipse,
  MAP_DISP_MODE:  MapDispMode.heatMap,
  AGT_DISP_MODE:  AgtDispMode.semiOpaque,
  SPAT_PART_MODE: SpatPartMode.gridViaMap,
  togglePauseVal: function(){this.PAUSED = !this.PAUSED;},
  toggleShowAgts: function(){this.SHOW_AGENTS = !this.SHOW_AGENTS;},
  setGenDispMode: function(mode){switch(mode){
    case GenDispMode.cellPop: this.MAP_DISP_MODE = MapDispMode.cellPop; this.AGT_DISP_MODE = AgtDispMode.fullOpaque; return;
    case GenDispMode.heatMap: this.MAP_DISP_MODE = MapDispMode.heatMap; this.AGT_DISP_MODE = AgtDispMode.semiOpaque; return;
  }},
  isGridMode:     function(){return this.SPAT_PART_MODE==SpatPartMode.gridViaObj || this.SPAT_PART_MODE==SpatPartMode.gridViaMap;},
  dimsValidTest:  function(){console.log("Canvas/World Dimensions: "+((this.CELLS_WIDE*this.CELL_SIZE==this.CANV_WIDE && this.CELLS_TALL*this.CELL_SIZE==this.CANV_TALL) ? "MATCH!" : "MISMATCH!"));},
};
//Config.dimsValidTest(); //<-- QAD Test that space defined by canvas == space defined by gridworld

var spawnRegion = {
  minX:Config.CELL_SIZE,
  maxX:Config.CANV_WIDE-Config.CELL_SIZE,
  minY:Config.CELL_SIZE,
  maxY:Config.CANV_TALL-Config.CELL_SIZE
};

var agents = [];
var myMap;
var mySprite;


//######################################################################
//###[ P5JS setup/draw Functions ]######################################
//######################################################################
function preload(){
  /* NOTE: You MUST set agent shape mode to 'viaImage' IN CODE before 
    launch! QAD solution, yes, but this mode is only for an experiment,
    i.e. it [should] otherwise be set to 'viaEllipse' or 'viaRect' for 
    regular/public use which works without [known] issues (12/18/21) */
  if(Config.AGT_SHAPE_MODE == ShapeDrawMode.viaImage){
    mySprite = loadImage('assets/orbSprite.png');
    //mySprite = loadImage('assets/homSprite.png');
  };
}

function setup(){
  createCanvas(Config.CANV_WIDE, Config.CANV_TALL).parent("pane_viz");
  ellipseMode(CENTER); // A/O 12/18: the only call needed as not using corners-based rendering
  imageMode(CENTER); // A/O 12/18: the only call needed as not using corners-based rendering
  myMap = new SPMap(Config.CELLS_TALL, Config.CELLS_WIDE, Config.CELL_SIZE);
  createAgents(10,'m');
  initUI(); 
  frameRate(Config.FRAME_RATE);
}

function draw(){
  //>>> UPDATE CALLS
  frameRate(Config.FRAME_RATE);  
  if(!Config.PAUSED){agents.forEach((a)=>a.update());}
  
  //>>> RENDER CALLS
  background("#f0f0ff");
  drawCanvasBorder();
  myMap.render();
  if(Config.SHOW_AGENTS){agents.forEach((a)=>a.render());}
  updateDOMLabels();
}


//######################################################################
//###[ P5JS UI I/O Handlers ]###########################################
//######################################################################
function keyPressed(){
  if(key=='p' || key=='P'){Config.togglePauseVal(); checkbox_pauseSim.elt.checked = Config.PAUSED;}
}

function mousePressed(){
  for (var i=0; i<agents.length; i++) {
    if(agents[i].mouseOverMe()){console.log(agents[i].ID);}
  }
}


//######################################################################
//###[ QAD Agent Creation Functions ]###################################
//######################################################################
function createAgents(num,mode='r'){if(keyIsDown(77)){mode='m'}; for(let i=0; i<num; i++){switch(mode){case 'r':createAgentAtCanvRandPt(spawnRegion);break; case 'm':createAgentAtCanvMidPt(spawnRegion);break;}}}
function createAgentAtCanvMidPt(){agents.push(new SPAgent(canvasMidpoint(),''+agents.length, myMap));}
function createAgentAtCanvRandPt(bounds=null){
  let startPos = (bounds==null) ? canvasMidpoint() : vec2( int(random(bounds.minX,bounds.maxX)), int(random(bounds.minY,bounds.maxY))); 
  agents.push(new SPAgent(startPos,''+agents.length, myMap));
}


//######################################################################
//###[ Display Stats Variables + Functions ]############################
//######################################################################
var label_nAgents, dropdown_addAgents, button_addAgents; 
var checkbox_showGrid, checkbox_showCells, checkbox_showAgents;
var radioGrp_genDispMode, radioGrp_spatPartMode;
var label_FPS, dropdown_maxFPS, checkbox_pauseSim;
var label_mousePos, label_mouseCell;

function initUI(){
  label_FPS       = select("#labl_fps");
  label_nAgents   = select("#labl_nAgents");
  label_mousePos  = select("#labl_mousePos");
  label_mouseCell = select("#labl_mouseCell");

  dropdown_maxFPS = createSelect().parent("#ddown_maxFPS").style("font-size","18px");  
  dropdown_maxFPS.option('3');
  dropdown_maxFPS.option('6');
  dropdown_maxFPS.option('12');
  dropdown_maxFPS.option('24');
  dropdown_maxFPS.option('30');
  dropdown_maxFPS.option('60');
  dropdown_maxFPS.selected('60');
  dropdown_maxFPS.changed(()=>(Config.FRAME_RATE = int(dropdown_maxFPS.value())));

  dropdown_addAgents = createSelect().parent("#ddown_addAgents").style("font-size","18px");
  dropdown_addAgents.option('1');    
  dropdown_addAgents.option('5');  
  dropdown_addAgents.option('10');
  dropdown_addAgents.option('25');
  dropdown_addAgents.option('50');
  dropdown_addAgents.option('100');
  dropdown_addAgents.option('250');
  dropdown_addAgents.selected('10');  

  button_addAgents = createButton('ADD').parent("#but_addAgents").style("font-size","18px");
  button_addAgents.mousePressed(()=>(createAgents(int(dropdown_addAgents.value()))));

  checkbox_pauseSim = select("#cBox_pauseTog");
  checkbox_pauseSim.elt.checked = Config.PAUSED;
  checkbox_pauseSim.changed(()=>Config.togglePauseVal());

  checkbox_showAgents = select("#cBox_showAgts");
  checkbox_showAgents.elt.checked = Config.SHOW_AGENTS;
  checkbox_showAgents.changed(()=>Config.toggleShowAgts());

  checkbox_showGrid = select("#cBox_showGrid");
  checkbox_showGrid.elt.checked = myMap.showGrid;
  checkbox_showGrid.changed(()=>myMap.toggleGrid());

  checkbox_showCells = select("#cBox_showCell");
  checkbox_showCells.elt.checked = myMap.showCells;
  checkbox_showCells.changed(()=>myMap.toggleCells());

  radioGrp_genDispMode = createRadio("genDispMode").parent("#genDispMode");
  radioGrp_genDispMode.option(GenDispMode.cellPop, GenDispMode.toString(GenDispMode.cellPop));
  radioGrp_genDispMode.option(GenDispMode.heatMap, GenDispMode.toString(GenDispMode.heatMap));
  radioGrp_genDispMode.selected(Config.GEN_DISP_MODE);
  radioGrp_genDispMode.changed(()=>onDispModeChanged());    
  appendBRsToRadioItems("#genDispMode");

  radioGrp_spatPartMode = createRadio("spatPartMode").parent("#spatPartMode");
  radioGrp_spatPartMode.option(SpatPartMode.gridViaObj, SpatPartMode.toString(SpatPartMode.gridViaObj));
  radioGrp_spatPartMode.option(SpatPartMode.gridViaMap, SpatPartMode.toString(SpatPartMode.gridViaMap));
  radioGrp_spatPartMode.option(SpatPartMode.none, SpatPartMode.toString(SpatPartMode.none));
  radioGrp_spatPartMode.selected(Config.SPAT_PART_MODE);
  radioGrp_spatPartMode.changed(()=>onSPModeChanged());  
  appendBRsToRadioItems("#spatPartMode");
}

function appendBRsToRadioItems(elmtID){
  let elmt = select(elmtID).child()[0].children;
  elmt[1].parentNode.insertBefore(createElement('br').elt,elmt[1].nextSibling);
  elmt[4].parentNode.insertBefore(createElement('br').elt,elmt[4].nextSibling);
}

function onDispModeChanged(){
  Config.setGenDispMode(radioGrp_genDispMode.value());
}

function onSPModeChanged(){
  Config.SPAT_PART_MODE = radioGrp_spatPartMode.value();
  myMap.initSPGrid();
  if(!Config.isGridMode()){
    checkbox_showCells.elt.checked  = false;
    checkbox_showCells.elt.disabled = true;
    myMap.showCells = false;
  }
  else{
    checkbox_showCells.elt.checked  = true;
    checkbox_showCells.elt.disabled = false;
    myMap.showCells = true;
  }
}

function updateDOMLabels(){
  label_FPS.html(round(frameRate()));
  label_nAgents.html(agents.length);
  switch(mouseInCanvas()){
    case true: label_mousePos.html("("+round(mouseX)+","+round(mouseY)+")"); label_mouseCell.html("["+myMap.cellViaPos(mousePtToVec())+"]"); break;
    case false: label_mousePos.html("N/A"); label_mouseCell.html("N/A"); break;
  }
} // Ends Function updateDOMLabels