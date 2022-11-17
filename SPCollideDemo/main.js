p5.disableFriendlyErrors = true;

//######################################################################
//###[ Global Variables / Data-Structures ]#############################
//######################################################################
var MapDispMode = {cellPop:'mdmP', heatMap:'mdmH'};
var AgtDispMode = {semiOpaque:'pdmT', fullOpaque:'pdmO'};
var ShapeDrawMode = {viaEllipse:'E', viaRect:'R'};

var GenDispMode = {
  cellPop:'cPop', heatMap:'hMap', 
  toString: function(mode){switch(mode){case this.cellPop: return "Cell Population Mode"; case this.heatMap: return "Cell Heatmap Mode";}}
};

var SPFrmOff = {
  spFrmOff: 1, //-1,
  canUpdate: function(agentID){return (this.spFrmOff<1) ? false : ((frameCount % this.spFrmOff) == (agentID % this.spFrmOff));}
}

var SpatPartMode = {
  gridViaObj:'spmO', gridViaMap:'spmM', none:'spmN',
  toString: function(mode){switch(mode){case this.gridViaObj: return "[Grid] via JS Properties"; case this.gridViaMap: return "[Grid] via JS Map Object"; case this.none: return "[None] O(n^2) 'All-Pairs'";}}
};

var Config = {
  CANV_WIDE: 1024, CANV_TALL: 768, 
  /*CELLS_TALL: 12,  CELLS_WIDE: 16, CELL_SIZE: 64,*/
  CELLS_TALL: 24,  CELLS_WIDE: 32, CELL_SIZE: 32,
  PAUSED:         false,
  AGT_SHAPE_MODE: ShapeDrawMode.viaEllipse,
  MAP_DISP_MODE:  MapDispMode.heatMap,
  AGT_DISP_MODE:  AgtDispMode.semiOpaque,
  SPAT_PART_MODE: SpatPartMode.gridViaMap,
  togglePauseVal: function(){this.PAUSED = !this.PAUSED;},
  isGridMode:     function(){return this.SPAT_PART_MODE==SpatPartMode.gridViaObj || this.SPAT_PART_MODE==SpatPartMode.gridViaMap;},
};

var spawnRegion = {minX:Config.CELL_SIZE, maxX:Config.CANV_WIDE-Config.CELL_SIZE, minY:Config.CELL_SIZE, maxY:Config.CANV_TALL-Config.CELL_SIZE};

var agents = [];
var myMap;

//######################################################################
//###[ P5JS setup/draw Functions ]######################################
//######################################################################
function setup(){
  createCanvas(Config.CANV_WIDE, Config.CANV_TALL).parent("pane_viz");
  ellipseMode(CENTER); // A/O 12/18: the only call needed as not using corners-based rendering
  myMap = new SPMap(Config.CELLS_TALL, Config.CELLS_WIDE, Config.CELL_SIZE);
  createAgents(2,'m');
  initUI();
}

function draw(){
  //>>> UPDATE CALLS
  if(!Config.PAUSED){agents.forEach((a)=>a.update());}
  //>>> RENDER CALLS
  background("#f0f0ff");
  myMap.render();
  agents.forEach((a)=>a.render());
  updateDOMLabels();
}

//######################################################################
//###[ P5JS UI I/O Handlers ]###########################################
//######################################################################
function keyPressed(){if(key=='p' || key=='P'){Config.togglePauseVal();}}
function mousePressed(){for (var i=0; i<agents.length; i++) {if(agents[i].mouseOverMe()){console.log("Agent ID @ mouse: ["+agents[i].ID+"]");}}}

//######################################################################
//###[ QAD Agent Creation Functions ]###################################
//######################################################################
function createAgents(num,mode='r'){if(keyIsDown(77)){mode='m'}; for(let i=0; i<num; i++){switch(mode){case 'r':createAgentAtCanvRandPt(spawnRegion);break; case 'm':createAgentAtCanvMidPt(spawnRegion);break;}}}
function createAgentAtCanvMidPt(){agents.push(new SPAgent(canvasMidpoint(),''+agents.length, myMap));}
function createAgentAtCanvRandPt(bounds=null){let startPos = (bounds==null) ? canvasMidpoint() : vec2( int(random(bounds.minX,bounds.maxX)), int(random(bounds.minY,bounds.maxY))); agents.push(new SPAgent(startPos,''+agents.length, myMap));}

//######################################################################
//###[ Display Stats Variables + Functions ]############################
//######################################################################
var dropdown_addAgents, button_addAgents; 
var chBox_showGrid, chBox_showAgents;
var label_FPS, label_nAgents, label_mousePos, label_mouseCell, label_frmOff;
function initUI(){
  label_FPS       = select("#labl_fps");
  label_nAgents   = select("#labl_nAgents");
  label_mousePos  = select("#labl_mousePos");
  label_mouseCell = select("#labl_mouseCell");
  label_frmOff    = select("#labl_frmOff");
  dropdown_addAgents = createSelect().parent("#ddown_addAgents").style("font-size","18px");
  dropdown_addAgents.option('1');    
  dropdown_addAgents.option('5');
  dropdown_addAgents.option('10');
  dropdown_addAgents.option('50');
  dropdown_addAgents.option('100');
  dropdown_addAgents.option('250');
  dropdown_addAgents.selected('10');  
  button_addAgents = createButton('ADD').parent("#but_addAgents").style("font-size","18px");
  button_addAgents.mousePressed(()=>(createAgents(int(dropdown_addAgents.value()))));
  chBox_showAgents = select("#cBox_showAgts");
  chBox_showAgents.elt.checked = Config.SHOW_AGENTS;
  chBox_showAgents.changed(()=>Config.toggleShowAgts());
  chBox_showGrid = select("#cBox_showGrid");
  chBox_showGrid.elt.checked = myMap.showGrid;
  chBox_showGrid.changed(()=>myMap.toggleGrid());
}

function updateDOMLabels(){
  label_FPS.html(round(frameRate()));
  label_frmOff.html("n/"+SPFrmOff.spFrmOff);
  label_nAgents.html(agents.length);
  switch(mouseInCanvas()){
    case true: label_mousePos.html("("+round(mouseX)+","+round(mouseY)+")"); label_mouseCell.html("["+myMap.cellViaPos(mousePtToVec())+"]"); break;
    case false: label_mousePos.html("N/A"); label_mouseCell.html("N/A"); break;
  }
} // Ends Function updateDOMLabels