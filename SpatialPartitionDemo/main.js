//######################################################################
//###[ Global Variables / Data-Structures ]#############################
//######################################################################
var MapDispMode = {
  cellPop:'mdmP', 
  heatMap:'mdmH', 
  none:'mdmX', 
  toString: function(mode){switch(mode){case this.cellPop: return "Cell Population"; case this.heatMap: return "Density Heatmap"; case this.none: return "Don't Display";}}
};

var AgtDispMode = {
  semiOpaque:'pdmT', 
  fullOpaque:'pdmO', 
  none:'pdmX', 
  toString: function(mode){switch(mode){case this.semiOpaque: return "Semi Opaque"; case this.fullOpaque: return "Fully Opaque"; case this.none: return "Don't Display";}}
};

var SpatPartMode = {
  gridViaObj:'spmO', 
  gridViaMap:'spmM', 
  none:'spmN', 
  toString: function(mode){switch(mode){case this.gridViaObj: return "[Grid] via JS Properties"; case this.gridViaMap: return "[Grid] via JS Map Object"; case this.none: return "[None] O(n^2) 'All-Pairs'";}}
};


var Config = {
  /*> Cell Size [32] Config: {CELLS_TALL: 24,  CELLS_WIDE: 32, CELL_SIZE: 32} */
  /*> Cell Size [64] Config: {CELLS_TALL: 12,  CELLS_WIDE: 16, CELL_SIZE: 64} */  
  CANV_WIDE: 1024, CANV_TALL: 768, CELLS_TALL: 12,  CELLS_WIDE: 16, CELL_SIZE: 64,
  FRAME_RATE:     60, 
  PAUSED:         false,
  MAP_DISP_MODE:  MapDispMode.heatMap,
  AGT_DISP_MODE:  AgtDispMode.semiOpaque,
  SPAT_PART_MODE: SpatPartMode.gridViaMap,  
  togglePauseVal: function(){this.PAUSED = !this.PAUSED;},
  isGridMode: function(){return this.SPAT_PART_MODE==SpatPartMode.gridViaObj || this.SPAT_PART_MODE==SpatPartMode.gridViaMap;},
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


//######################################################################
//###[ P5JS setup/draw Functions ]######################################
//######################################################################
function setup(){
  createCanvas(Config.CANV_WIDE, Config.CANV_TALL).parent("pane_viz");
  myMap = new SPMap(Config.CELLS_TALL, Config.CELLS_WIDE, Config.CELL_SIZE);
  createAgents(2);
  initUI(); 
  frameRate(Config.FRAME_RATE);
}

function draw(){
  //>>> UPDATE CALLS
  frameRate(Config.FRAME_RATE);  
  if(!Config.PAUSED){agents.forEach((a)=>a.update());}
  
  //>>> RENDER CALLS
  background("#3c3c3c"); // rgb(60,60,60) per usual
  drawCanvasBorder();
  myMap.render();
  agents.forEach((a)=>a.render());
  updateDOMLabels();
}


//######################################################################
//###[ P5JS UI I/O Handlers ]###########################################
//######################################################################
function keyPressed(){
  if(key=='p' || key=='P'){Config.togglePauseVal(); checkbox_pauseSim.elt.checked = Config.PAUSED;}
  //if(keyCode == UP_ARROW && Config.FRAME_RATE<60){Config.FRAME_RATE++;}
  //if(keyCode == DOWN_ARROW && Config.FRAME_RATE>0){Config.FRAME_RATE--;}
  //if(key=='x' || key=='X'){createAgents(10);}
}

function mousePressed(){
  for (var i=0; i<agents.length; i++) {
    if(agents[i].mouseOverMe()){console.log(agents[i].ID);}
  }
}


//######################################################################
//###[ QAD Agent Creation Functions ]###################################
//######################################################################
function createAgents(num){for(let i=0; i<num; i++){createAgentAtCanvRandPt(spawnRegion);}}
function createAgentAtCanvMidPt(){agents.push(new SPAgent(canvasMidpoint(),''+agents.length, myMap));}
function createAgentAtCanvRandPt(bounds=null){
  let startPos = (bounds==null) ? canvasMidpoint() : vec2( int(random(bounds.minX,bounds.maxX)), int(random(bounds.minY,bounds.maxY))); 
  agents.push(new SPAgent(startPos,''+agents.length, myMap));
}

//######################################################################
//###[ Display Stats Variables + Functions ]############################
//######################################################################
var label_nAgents, dropdown_addAgents, button_addAgents, radioGrp_agtDispMode; 
var checkbox_showGrid, radioGrp_mapDispMode, radioGrp_spatPartMode;
var label_FPS, dropdown_maxFPS, checkbox_pauseSim;
var label_mousePos, label_mouseCell;

function initUI(){
  label_FPS       = select("#labl_fps");
  label_nAgents   = select("#labl_nAgents");
  label_mousePos  = select("#labl_mousePos");
  label_mouseCell = select("#labl_mouseCell");

  dropdown_maxFPS = createSelect().parent("#ddown_maxFPS");  
  dropdown_maxFPS.option('3');
  dropdown_maxFPS.option('6');
  dropdown_maxFPS.option('12');
  dropdown_maxFPS.option('24');
  dropdown_maxFPS.option('30');
  dropdown_maxFPS.option('60');
  dropdown_maxFPS.selected('60');
  dropdown_maxFPS.changed( ()=>(Config.FRAME_RATE = int(dropdown_maxFPS.value())) );

  dropdown_addAgents = createSelect().parent("#ddown_addAgents");
  dropdown_addAgents.option('5');  
  dropdown_addAgents.option('10');
  dropdown_addAgents.option('25');
  dropdown_addAgents.option('50');
  dropdown_addAgents.option('100');
  dropdown_addAgents.option('250');
  dropdown_addAgents.selected('10');  

  button_addAgents = createButton('ADD').parent("#but_addAgents");
  button_addAgents.mousePressed( ()=>(createAgents(int(dropdown_addAgents.value()))) );

  checkbox_showGrid = select("#cBox_showGrid");
  checkbox_showGrid.elt.checked = myMap.showGrid;
  checkbox_showGrid.changed( ()=>myMap.toggleGrid() );

  checkbox_pauseSim = select("#cBox_pauseTog");
  checkbox_pauseSim.elt.checked = Config.PAUSED;
  checkbox_pauseSim.changed( ()=>Config.togglePauseVal() );

  radioGrp_mapDispMode = createRadio("mapDispMode").parent("#mapDispMode");
  radioGrp_mapDispMode.option(MapDispMode.cellPop, MapDispMode.toString(MapDispMode.cellPop));
  radioGrp_mapDispMode.option(MapDispMode.heatMap, MapDispMode.toString(MapDispMode.heatMap));
  radioGrp_mapDispMode.option(MapDispMode.none, MapDispMode.toString(MapDispMode.none));
  radioGrp_mapDispMode.selected(Config.MAP_DISP_MODE);
  radioGrp_mapDispMode.changed( ()=>(Config.MAP_DISP_MODE = radioGrp_mapDispMode.value()) );    
  appendBRsToRadioItems("#mapDispMode");

  radioGrp_agtDispMode = createRadio("agtDispMode").parent("#agtDispMode");
  radioGrp_agtDispMode.option(AgtDispMode.semiOpaque, AgtDispMode.toString(AgtDispMode.semiOpaque));
  radioGrp_agtDispMode.option(AgtDispMode.fullOpaque, AgtDispMode.toString(AgtDispMode.fullOpaque));
  radioGrp_agtDispMode.option(AgtDispMode.none, AgtDispMode.toString(AgtDispMode.none));
  radioGrp_agtDispMode.selected(Config.AGT_DISP_MODE);
  radioGrp_agtDispMode.changed( ()=>(Config.AGT_DISP_MODE = radioGrp_agtDispMode.value()) );   
  appendBRsToRadioItems("#agtDispMode");

  radioGrp_spatPartMode = createRadio("spatPartMode").parent("#spatPartMode");
  radioGrp_spatPartMode.option(SpatPartMode.gridViaObj, SpatPartMode.toString(SpatPartMode.gridViaObj));
  radioGrp_spatPartMode.option(SpatPartMode.gridViaMap, SpatPartMode.toString(SpatPartMode.gridViaMap));
  radioGrp_spatPartMode.option(SpatPartMode.none, SpatPartMode.toString(SpatPartMode.none));
  radioGrp_spatPartMode.selected(Config.SPAT_PART_MODE);
  radioGrp_spatPartMode.changed( ()=>onSPModeChanged() );  
  appendBRsToRadioItems("#spatPartMode");



}

function appendBRsToRadioItems(elmtID){
  let elmt = select(elmtID).child()[0].children;
  elmt[1].parentNode.insertBefore(createElement('br').elt,elmt[1].nextSibling);
  elmt[4].parentNode.insertBefore(createElement('br').elt,elmt[4].nextSibling);
  elmt[7].parentNode.insertBefore(createElement('br').elt,elmt[7].nextSibling);
}





function onSPModeChanged(){
  Config.SPAT_PART_MODE = radioGrp_spatPartMode.value();
  myMap.initSPGrid();
}




function updateDOMLabels(){
  label_FPS.html(round(frameRate()));
  label_nAgents.html(agents.length);

  switch(mouseInCanvas()){
    case true: label_mousePos.html("("+mouseX+","+mouseY+")"); label_mouseCell.html("["+myMap.cellViaPos(mousePtToVec())+"]"); break;
    case false: label_mousePos.html("N/A"); label_mouseCell.html("N/A"); break;
  }
} // Ends Function updateDOMLabels