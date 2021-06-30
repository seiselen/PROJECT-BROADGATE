
//######################################################################
//>>> GLOBAL VARIABLES (CANVAS AND MAP/CELL CONFIG)
//######################################################################

var worldWide = 1024;
var worldTall = 768;
var menuWide  = 384;

// Note 1: Treat these like command line args. GameMap will absorb them on initialization and use ONLY their respective vars!
// Note 2: THIS IS A PROBLEM if map sizes are not 12x16! See external log note[s] for more info
var cellSize  = 64;
var cellHalf  = cellSize/2; // TODO: Possible deprecation (unused) as such info now in GameMap obj
var cellsTall = worldTall/cellSize;
var cellsWide = worldWide/cellSize;

var manager;
var map;
var mainUIPanel;
var units = [];
var bldgs = [];


function setup(){
  createCanvas(worldWide+menuWide,worldTall).parent("viz");
 
  map = new GameMap(cellsTall, cellsWide, cellSize, m01);//.set_showBldgMap().set_showUnitMap();

  manager = new GameManager();

  //manager.createUnit();
  manager.createTower([6,7]);

  initUI();

} // Ends p5js Function setup


function draw(){
  //>>> LOGIC CALLS
  mainUIPanel.update();


  //>>> UPDATE CALLS (unit->bldg order COUNTS)
  units.forEach(u => u.update());
  bldgs.forEach(b => b.update());

  //>>> RENDER CALLS
  background(255);
  db_drawMenuSubCanv();
  map.render();
  bldgs.forEach(b => b.render());
  units.forEach(u => u.render());

  dispMousePlaceCell();



  mainUIPanel.render();

  drawFPSSimple();


  //db_drawTextSimple(mouseInSidebar());

} // Ends p5js Function draw


// TEMP FOR CREATING AGENTS NIGHT/OF 6/16 ONLY! USE UI MANAGER FOR 'REAL-WORLD' ANALOG!
function keyPressed(){
  if(key=='u'){manager.createUnit();} 
  if(key=='b'){manager.createTower(map.posToCoord(mousePtToVec()));} 
}

function mousePressed(){
  mainUIPanel.onMousePressed();
  manager.onMousePressed();
  return false;
}



// TODO: PUT IN UTILS OR SOMEPLACE ELSE?
function dispMousePlaceCell(){
  if(!mouseInCanvas() || manager.gameMode == GameManager.MODES.IDLE){return;}

  let mPos = mousePtToVec();
  let cPos = map.coordToTopLeftPos(map.posToCoord(mPos));
  
  strokeWeight(2); noFill();
  switch (manager.gameMode){
    case GameManager.MODES.PLACE_BLDG: (map.isVacant2(map.posToCoord(mPos))) ? stroke(255) : stroke(255,0,0); break;
    case GameManager.MODES.PLACE_UNIT: (map.isEnemyPathCell2(map.posToCoord(mPos))) ? stroke(255) : stroke(255,0,0); break;
  }

  push();translate(cPos.x,cPos.y);line(0,32,32,0);line(0,16,16,0);line(0,64,64,0);line(0,48,48,0);line(16,64,64,16);line(32,64,64,32);line(48,64,64,48);pop();
} // Ends Function dispMousePlaceCell




