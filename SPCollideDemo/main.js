p5.disableFriendlyErrors = true;

var Config = {
  CANV_WIDE: 1024, CANV_TALL: 768,
  //CELLS_TALL: 48,  CELLS_WIDE: 64, CELL_SIZE: 16, AGENT_DIAM: 16,
  CELLS_TALL: 24,  CELLS_WIDE: 32, CELL_SIZE: 32, AGENT_DIAM: 32,
  PAUSED:         false,
  togglePauseVal: function(){this.PAUSED = !this.PAUSED;}
};

var spawnRegion = {minX:Config.CELL_SIZE, maxX:Config.CANV_WIDE-Config.CELL_SIZE, minY:Config.CELL_SIZE, maxY:Config.CANV_TALL-Config.CELL_SIZE};

var lastMouseFrame = -1;
var cooldownFrames = 6;
var anyMouseAction = ()=>{if(frameCount>=lastMouseFrame+cooldownFrames){lastMouseFrame=frameCount; return true;}return false};


var myMap;
var objPool;
var agtPool;
var agents = [];

//######################################################################
//###[ P5JS setup/draw Functions ]######################################
//######################################################################
function setup(){
  createCanvas(Config.CANV_WIDE, Config.CANV_TALL).parent("pane_viz");
  ellipseMode(CENTER); // A/O 12/18: the only call needed as not using corners-based rendering
  myMap   = new SPMap(Config.CELLS_TALL, Config.CELLS_WIDE, Config.CELL_SIZE);
  objPool = new LazyObjectPool();
  agtPool = new LazyObjectPool();
  createAgents(2,'m');
  initUI();
}

function draw(){
  //>>> UPDATE CALLS
  if(!Config.PAUSED){
    agtPool.updateEntries();
    objPool.updateEntries();
  }
  //>>> RENDER CALLS
  background("#f0f0ff");
  myMap.render();
  agtPool.renderEntries();
  objPool.renderEntries();

  //>>> LATE UPDATE CALLS
  if(!Config.PAUSED){
    agtPool.lateUpdateEntries();
  }
  objPool.pruneKillList();
  agtPool.pruneKillList();
  updateDOMLabels();
}

//######################################################################
//###[ P5JS UI I/O Handlers ]###########################################
//######################################################################
function keyPressed(){if(key=='p' || key=='P'){Config.togglePauseVal();}}

function mousePressed(){
  if(!mouseInCanvas()){return;}

}

function mouseDragged(){
  agtPool.pool.forEach(a=>{if(a.mouseOverMe()){a.applyCollideDAM('z')}});
}


//######################################################################
//###[ QAD Agent Creation Functions ]###################################
//######################################################################
function createAgents(num,mode='r'){if(keyIsDown(77)){mode='m'}; for(let i=0; i<num; i++){switch(mode){case 'r':createAgentAtCanvRandPt(spawnRegion);break; case 'm':createAgentAtCanvMidPt(spawnRegion);break;}}}
function createAgent(where,map){
  agtPool.insert(new SPAgent(where,Math.floor(Math.random()*16384),map));
}
function createAgentAtCanvMidPt(){createAgent(canvasMidpoint(),myMap);}
function createAgentAtCanvRandPt(bounds=null){createAgent((bounds==null)?canvasMidpoint():vec2(int(random(bounds.minX,bounds.maxX)),int(random(bounds.minY,bounds.maxY))),myMap);}

//######################################################################
//###[ Display Stats Variables + Functions ]############################
//######################################################################
var dropdown_addAgents, button_addAgents; 
var chBox_showGrid;
var label_FPS, label_nAgents, label_mousePos, label_mouseCell;
function initUI(){
  label_FPS       = select("#labl_fps");
  label_nAgents   = select("#labl_nAgents");
  label_mousePos  = select("#labl_mousePos");
  label_mouseCell = select("#labl_mouseCell");
  dropdown_addAgents = createSelect().parent("#ddown_addAgents").style("font-size","18px");
  dropdown_addAgents.option('1');    
  dropdown_addAgents.option('2');
  dropdown_addAgents.option('4');
  dropdown_addAgents.option('16');
  dropdown_addAgents.option('64');
  dropdown_addAgents.option('128');
  dropdown_addAgents.option('256');  
  dropdown_addAgents.selected('10');  
  button_addAgents = createButton('ADD').parent("#but_addAgents").style("font-size","18px");
  button_addAgents.mousePressed(()=>(createAgents(int(dropdown_addAgents.value()))));
  chBox_showGrid = select("#cBox_showGrid");
  chBox_showGrid.elt.checked = myMap.showGrid;
  chBox_showGrid.changed(()=>myMap.toggleGrid());
}

function updateDOMLabels(){
  label_FPS.html(round(frameRate()));
  label_nAgents.html(agtPool.pool.size);
  switch(mouseInCanvas()){
    case true: label_mousePos.html("("+round(mouseX)+","+round(mouseY)+")"); label_mouseCell.html("["+myMap.cellViaPos(mousePtToVec())+"]"); break;
    case false: label_mousePos.html("N/A"); label_mouseCell.html("N/A"); break;
  }
} // Ends Function updateDOMLabels