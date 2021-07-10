
//######################################################################
//>>> GLOBAL VARIABLES
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
var bldgs = []; // Contains Towers in game
var projPool;   // Contains (and manages) Projectiles (Bullets and Missiles)
var spawnPool;  // Contains (and manages) [Unit] Spawn Requests
var waveManage; // Manages waves (of a level, in the form of a .js 'wave schedule')
var unitPool    // Contains (and manages) Units in game




/*--------------------------------------------------------------------
|>>> P5JS Function setup
+-------------------------------------------------------------------*/
function setup(){
  createCanvas(worldWide+menuWide,worldTall).parent("viz");

  map        = new GameMap(cellsTall, cellsWide, cellSize, m01);
  waveManage = new WaveManager(m01[m01[0][0]+2]);
  manager    = new GameManager();
  projPool   = new ProjectileManager();
  spawnPool  = new SpawnManager();
  unitPool   = new UnitManager();

  initUI();
} // Ends P5JS Function setup


/*--------------------------------------------------------------------
|>>> P5JS Function draw
+-------------------------------------------------------------------*/
function draw(){
  //>>> UPDATE CALLS (unit->bldg order COUNTS)
  mainUIPanel.update();
  unitPool.update();
  bldgs.forEach(b => b.update());
  projPool.update();
  spawnPool.update(); // try placing this before units pool's update?
  
  //>>> RENDER CALLS
  background(255);
  db_drawMenuSubCanv();
  map.render();
  bldgs.forEach(b => b.render());
  unitPool.render();
  projPool.render();
  dispMousePlaceCell();
  mainUIPanel.render();
} // Ends P5JS Function draw


/*--------------------------------------------------------------------
|>>> P5JS Function mousePressed
+-------------------------------------------------------------------*/
function mousePressed(){
  mainUIPanel.onMousePressed();
  manager.onMousePressed();
  return false;
} // Ends P5JS Function mousePressed