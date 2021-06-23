
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

var map;
var units = [];
var bldgs = [];


function setup(){
  createCanvas(worldWide+menuWide,worldTall).parent("viz");
 
  map = new GameMap(cellsTall, cellsWide, cellSize, m01)
  .set_showBldgMap().set_showUnitMap(); // using setters for map displays for now

  createUnit();
  createTower([6,7]);

} // Ends p5js Function setup


function draw(){
  //>>> UPDATE CALLS (unit->bldg order COUNTS)
  units.forEach(u => u.update());
  bldgs.forEach(b => b.update());

  //>>> RENDER CALLS
  background(255);
  db_drawMenuSubCanv();
  map.render();
  bldgs.forEach(b => b.render());
  units.forEach(u => u.render());


  drawFPSSimple();
} // Ends p5js Function draw


// TEMP FOR CREATING AGENTS NIGHT/OF 6/16 ONLY! USE UI MANAGER FOR 'REAL-WORLD' ANALOG!
function keyPressed(){
  if(key=='u'){createUnit();} 
  if(key=='b'){createTower(map.posToCoord(mousePtToVec()));} 
}




