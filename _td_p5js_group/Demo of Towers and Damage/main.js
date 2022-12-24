/*======================================================================
| Project:  Simple Tower Defense - Comprehensive Demo
| Author:   Steven Eiselen, CFHS/UArizona Computer Science
| Language: Javascript with P5JS Library
*=====================================================================*/

//>>> GLOBAL VARIABLES
var worldWide = 1024;
var worldTall = 768;
var cellSize  = 64;
var cellHalf  = cellSize/2;
var cellsTall = worldTall/cellSize;
var cellsWide = worldWide/cellSize;

//>>> GLOBAL DATA STRUCTURES
var map;
var mapSP;
var agents;
var towers;

//>>> Grid and GFX Settings
var showTMap   = true;
var showBMap   = false;
var showSMap   = true;
var showGrid   = true;
var showCoords = false;


var gridXOff = cellSize;
var gridYOff = cellSize;
var bckrndCol;
var gridLnCol;

function setup() {
  createCanvas(worldWide,worldTall).parent(select("#viz"));
  bckrndCol = color(60);
  gridLnCol = color(255,255,255,60);

  // initialize data structures (NEEDS TO HAPPEN BEFORE ANY AGENT AND TOWER IS CREATED!)
  map   = new TDMap(cellsTall,cellsWide,cellSize);
  mapSP = new TDSPMap(cellsTall,cellsWide,cellSize);
  map.loadMap(MAP_EX1);

  agents = [];
  towers = [];
  
  // setup UI buttons
  initButtons();

  // start with creating a single agent of default length and tower at arbitrary cell
  createAgent();
  createTower([4,7]);

} // Ends p5js Function setup


function draw() {
  //>>> LOGIC CALLS
  agents.forEach(a => a.update());
  towers.forEach(t => t.update());  

  //>>> RENDER CALLS [REMEMBER - ORDER MATTERS!!!]
  background(bckrndCol);
  if(showTMap){map.renderTileMap();}
  if(showBMap){map.renderBldgMap();}
  if(showSMap){mapSP.render();}
  if(showGrid){drawGrid();}
  if(showCoords){drawCellCoords();}

  agents.forEach(a => a.render());
  towers.forEach(t => t.render());  

  QADshowKillCount();
  QADshowEnemyCount();
  QADshowTowerCount();

  QADshowFPS();
} // Ends p5js Function draw