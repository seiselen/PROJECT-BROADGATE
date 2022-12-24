/*======================================================================
| Project:  Simple Tower Defense Map and Pathwalk Demo 01
| Author:   Steven Eiselen, CFHS/UArizona Computer Science
| Language: Javascript with P5JS Library
+-----------------------------------------------------------------------
| Description:  Demonstrates a simple map representation and agent path
|               walking implementation for a 2D tower defense game, as
|               well as a means to create and 'load' map definitions via
|               a JS array (as an alternative to reading a text file).
| Instructions: For UI, should be self-explanatory via the button labels
| Dependencies: p5js libraries as specified in the index.html file
+-----------------------------------------------------------------------
| Version Info: > 03/10/2021: Original Release for FH-4710/4750 demo
*=====================================================================*/

//>>> GLOBAL VARIABLES
var worldWide = 1024;
var worldTall = 768;
var cellSize  = 64;
var cellsTall = worldTall/cellSize;
var cellsWide = worldWide/cellSize;

//>>> GLOBAL DATA STRUCTURES
var map;
var agents;

function setup() {
  createCanvas(worldWide,worldTall).parent(select("#viz"));

  // initialize data structures
  map = new TDMap(cellsTall,cellsWide,cellSize)
  map.loadMap(MAP_EX1);

  agents = [];
  
  // setup UI buttons
  initButtons();

  // start with creating a single agent of default length
  createAgent();
} // Ends p5js Function setup


function draw() {
  //>>> LOGIC CALLS
  for (var i = 0; i < agents.length; i++) {agents[i].gotoPath();}
 
  //>>> RENDER CALLS
  map.render();
  for (var i = 0; i < agents.length; i++) {agents[i].render();}
} // Ends p5js Function draw


function createAgent(randomLen = false){
  let agt = new TDAgent(map.entCoord[0], map.entCoord[1]);
  if(randomLen){agt.setBodyLenRand(16,32);}
  agt.givePath(map.mapPath);
  agents.push(agt);
} // Ends Function createAgent