
/*--------------------------------------------------------------------
|>>> Global Variables/Objects
+-------------------------------------------------------------------*/
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
var titleUIPanel;
var bldgs       // Contains Towers in game
var projPool;   // Contains (and manages) Projectiles (Bullets and Missiles)
var spawnPool;  // Contains (and manages) [Unit] Spawn Requests
var waveManage; // Manages waves (of a level, in the form of a .js 'wave schedule')
var unitPool    // Contains (and manages) Units in game

// Last-Minute QAD crap code to get title screen and win/lose working
var frameGameQuit = -1;
var didInitGame = false;
var gameWon = false;
var gameLost = false;
var GameType = {REGULAR:1, SANDBOX:0};

/*--------------------------------------------------------------------
|>>> P5JS Function setup
+-------------------------------------------------------------------*/
function setup(){
  createCanvas(worldWide+menuWide,worldTall).parent("viz");
  initTitleScreenUI();
} // Ends P5JS Function setup

/*--------------------------------------------------------------------
|>>> P5JS Function draw
+-------------------------------------------------------------------*/
function draw(){
  background(255); // need this here as common to both modes
  (didInitGame) ? runGame() : runTitleScreen();
} // Ends P5JS Function draw

/*--------------------------------------------------------------------
|>>> P5JS I/O Function Interfaces
+-------------------------------------------------------------------*/
function mousePressed(){
  if(gameWon || gameLost){return;}

  switch(didInitGame){
    case true: mainUIPanel.onMousePressed(); manager.onMousePressed(); break;
    case false: titleUIPanel.onMousePressed(); break;
  }
  return false;
} // Ends P5JS Function mousePressed

function keyPressed(){
  if(gameWon || gameLost){onGameExit();}
} // Ends P5JS Function keyPressed