/*======================================================================
|>>> PROJECT : 2D Cave Rooms
+-----------------------------------------------------------------------
|> Overview: Generates 2D Cave rooms via the method shown by Sebastian
|            Lague in one of his PCG videos. This version is refactored
|            from an original that I implemented via Processing3 back in
|            2017; with the usual extra features and code improvements.
|> Ref Note: Lague's Channel: www.youtube.com/user/Cercopithecan
+-----------------------------------------------------------------------
| TODOs / Future Implement Ideas (in roughly simple -> complex order):
|  # Swap dropdown with toggle for tile <vs> sector view modes
|  # Mouse highlight over non [NULL_SECT] cell causes brightness tint
|    (via low alpha white maybe) for all cells of that sector; can do
|    this via adding var 'mouseOverSector' and function <update> s.t.
|    mouse pos eval'd, (mouseOverSector = [x] IFF [x]>[NULL_SECT]), and
|    in <renderSectMap> any cell sector of 'mouseOverSector' gets tint.
|  # Higher-Quality DOM UI/UX improvements (e.g. sector-at-mouse label),
|    nicer-looking dropdowns, etc. stuff as-seen-in-other-BG/ZAC-projs).
|  # Implement room (sector) connections
+=====================================================================*/

// CONFIG Vals (i.e. glorified command line argzzz and global flagzzz)
var Config = {
  canvWide: 1280, 
  canvTall:  832,
  cellSize:   16,
  showGrid: true,
  getCellsWide : function(){return Math.floor(this.canvWide/this.cellSize);},
  getCellsTall : function(){return Math.floor(this.canvTall/this.cellSize);},
  toggleGrid   : function(){this.showGrid = !this.showGrid;}
};

// Var/Obj Declarations
var labl_fps;
var ddown_mode;
var ddown_view;
var mCursrPos;
var myCaveMap;


function setup() {
  createCanvas(Config.canvWide,Config.canvTall).parent('viz');
  textAlign(CENTER,CENTER);
  textSize(Config.cellSize-4);
  initDOMUI();

  myCaveMap = new CaveMap(Config.getCellsTall(),Config.getCellsWide(),Config.cellSize);
  myCaveMap.randPopTileMap();
  myCaveMap.doCASmoothOnce();
} // Ends P5JS Function setup


function draw() {
  //>>> UI/UX CALLS
  keyDown();
  mouseDown();
  //>>> RENDER CALLS
  background(24);
  myCaveMap.render();
  if(Config.showGrid){drawGrid(Config.cellSize,"#ffffff80",1);}
  cellCursor();
  drawCanvasBorder();
  updateDOMUI();
} // Ends P5JS Function draw


function keyDown(){

} // Ends Function keyDown


function keyPressed(){
  if(key=='g' || key=='G'){Config.toggleGrid();}
  if(key=='r' || key=='R'){myCaveMap.randPopTileMap();}
  if(key=='s' || key=='S'){myCaveMap.doCASmoothOnce();}  

  if(keyCode == UP_ARROW) {myCaveMap.changeFillPct('+');}
  if(keyCode == DOWN_ARROW){myCaveMap.changeFillPct('-');}
} // Ends P5JS Function keyPressed


function mouseDown(){
  if(mouseInCanvas()&&mouseIsPressed&&mouseButton==LEFT){myCaveMap.onMouseDown(mousePtToVec());}
} // Ends Function mouseDown


function mousePressed(){
  if(mouseInCanvas()&&mouseIsPressed&&mouseButton==LEFT){myCaveMap.onMousePressed(mousePtToVec());}
} // Ends P5JS Function mousePressed




//======================================================================
//>>> DEBUG UI/UX FUNCTIONS SPECIFIC TO THIS PROJECT
//======================================================================

function cellCursor(){
  if(mouseInCanvas()){
    noCursor();
    mCursrPos = myCaveMap.coordToTLPos(myCaveMap.posToCoord(mousePtToVec()));
    stroke(0,255,0); strokeWeight(2); noFill();
    rect(mCursrPos.x,mCursrPos.y,mCursrPos.z,mCursrPos.z);
  }
  else{
    cursor();
  }
  
} // Ends Function cellCursor

function initDOMUI(){
  labl_fps  = select("#labl_fps");

  //>>> DROPDOWN INIT CODE FOR PAINT (INTERACT) MODES
  ddown_mode = createSelect().parent("ddown_mode");
  ddown_mode.option('Paint Floor Tile',  CaveMap.PAINT_FLOOR);
  ddown_mode.option('Paint Wall Tile' ,  CaveMap.PAINT_WALL);  
  ddown_mode.option('Create Sector', CaveMap.PAINT_SECTOR);
  //ddown_mode.option('Remove Sector', CaveMap.CLEAR_SECTOR);  
  ddown_mode.selected('Paint Floor Tile');
  ddown_mode.changed(()=>myCaveMap.setDrawMode(ddown_mode.value()));

  //>>> DROPDOWN INIT CODE FOR VIEW MODES
  ddown_view = createSelect().parent("ddown_view");
  ddown_view.option('Show Tile Types', CaveMap.VIEW_TILE);
  ddown_view.option('Show Sector IDs', CaveMap.VIEW_SECT);
  ddown_view.selected('Color By Tile Type');
  ddown_view.changed(()=>myCaveMap.setViewMode(ddown_view.value()));
} // Ends Function initDOMUI


function updateDOMUI() {
  labl_fps.html("FPS: "+round(frameRate()));
} // Ends Function updateDOMUI