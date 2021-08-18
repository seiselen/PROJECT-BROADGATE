/*======================================================================
| Project: ZacTibEdit: Early PRIZE Map Editor / Procy-Gen Experiment
| Author:  Steven Eiselen, University of Arizona Computer Science 
+-----------------------------------------------------------------------
| Description: Simulates the growth of a Tiberium Field, based on the
| mineral of the same name as seen in the Command And Conquer video game
| series. Also allows painting dirt and water tiles; Tiberium cannot
| grow through or on water tiles - allowing for a barricade.
+-----------------------------------------------------------------------
| Implementation Notes:
|  > I will not be substantially updating/refactoring comments or code 
|    i.e. am keeping this largely as it was left in order to demonstrate
|    progression of the build during the CSC 533 grad presentation.
|  > That said, next time: refactor this into an editor/gameplay module.
|
| Old Notes kept for archival/demo purposes:
|  > One of the first implementations of playing with Delta Time
|  > One of the first experiments in implementing map editing
|
| Old Ideas to Consider: 
|
|  > Doing a Linear/Quantized Lerp Function for Color-ID's
|     o would correspond with the number of images of varying tiberium density
|     o though I could poor-man do a Linear scale for green along HSL maybe?
|
|  > Stopping/Halting Field Growth
|     o Can use (triggerGrowth == false) to halt growing field when max 
|       range happens or in general
|     o Also need to halt radius at some point, and can do hard reset on
|       radius to minimize successive field sizes once 1st fully mined
|     o triggerGrowth + radius can be used cooperatively to simulate the
|       aforementioned behavior as well as stuff like...
|        - Unit's special ability to increase a field radius
|        - Destroy plant results in frozen growth until blossom re-grows
+-----------------------------------------------------------------------
| Version Info:
|  > 04/19/17 - Refactored certain parts for CSC 533 Grad Project
*=====================================================================*/

//#####################################################################
//>>> Simulation Settings
//#####################################################################
int maxFPS = 60;
int simFPS = 12;
int deltaTime = maxFPS/simFPS;
int lastFrame = 0;

//#####################################################################
//>>> Map Globals and Data Structures
//#####################################################################
int cellSize         = 12;
int numCells         = 80; 
int[][] map          = new int[numCells][numCells];
int[][] updateTibMap = new int[numCells][numCells];
int TILE_WATER       = 1;

//#####################################################################
//>>> Settings that UI will change
//#####################################################################
boolean triggerGrowth = false;
boolean showGrid      = false;
int     drawCellSize  = 1;
int     drawWhat      = 1;
TiberiumBlossom myTree;
PImage tibTree;

void settings(){
    size(cellSize*numCells,cellSize*numCells);
} // Ends Function settings

void setup(){
  frameRate(maxFPS); // Set FPS to max
  noCursor();        // Hide mouse cursor, cool!
  tibTree = loadImage("tibTree.png");
  clearMap(); // Zero out the map
  myTree = new TiberiumBlossom(20,20);
} // Ends Function setup

void draw(){
  //>>> UI - Operates with max FPS
  if(mousePressed && mouseButton == LEFT){mouseDraw();}

  //>>> LOGIC - Operates by parameter FPS via Delta Time
  if(frameCount-lastFrame==deltaTime){
    // Update lastFrame
    lastFrame=frameCount;    
    // Grow Tiberium    
    if(triggerGrowth){myTree.growTiberium();}    
  }

  //>>> RENDER - Operates with max FPS
  drawCells();
  drawMouseCursor();
  myTree.drawTree();
} // Ends Function Draw