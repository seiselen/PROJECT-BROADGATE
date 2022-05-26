/*======================================================================
|>>> PROJECT : 2D Cave Rooms
+-----------------------------------------------------------------------
|> Overview: Generates 2D Cave rooms via the method shown by Sebastian
|            Lague in one of his PCG videos. This version is refactored
|            from an original that I implemented via Processing3 back in
|            2017; with the usual extra features and code improvements.
|> Ref Note: Lague's Channel: www.youtube.com/user/Cercopithecan
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
var mCursrPos;
var myCaveMap;


function setup() {
  createCanvas(Config.canvWide,Config.canvTall).parent('viz');
  labl_fps  = select("#labl_fps");
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
  //if(keyIsPressed && (key=="q" || key=="Q")){;}

} // Ends Function keyDown

function keyPressed(){
  //> keys
  if(key=='g' || key=='G'){Config.toggleGrid();}
  if(key=='t' || key=='T'){myCaveMap.swapDrawOption();}
  if(key=='r' || key=='R'){myCaveMap.randPopTileMap();}
  if(key=='s' || key=='S'){myCaveMap.doCASmoothOnce();}  

  //> keycodes
  if(keyCode == UP_ARROW) {myCaveMap.changeFillPct('+');}
  if(keyCode == DOWN_ARROW){myCaveMap.changeFillPct('-');}

/*
  if(key     == 'v') {if(display.currentMode.name.equals("tiles")){display.setMode("sectors");}else{display.setMode("tiles");}}  
  if(key     == 'p') {myCaveMap.filterMapByRegionSize(tileMap);}
*/

} // Ends P5JS Function keyPressed



/*----------------------------------------------------------------------
|>>> Function mouseDown 
+---------------------------------------------------------------------*/
function mouseDown(){
  if(mouseInCanvas()&&mouseIsPressed&&mouseButton==LEFT){
    myCaveMap.setCellAtPos(mousePtToVec());
  }
} // Ends Function mouseDown


/*----------------------------------------------------------------------
|>>> Function mousePressed
+---------------------------------------------------------------------*/
function mousePressed(){

  //> TODO: 'onRightClick' did sector flood-fill operation in orig verz

} // Ends Function mousePressed





//======================================================================
//>>> DEBUG UI/UX FUNCTIONS SPECIFIC TO THIS PROJECT
//======================================================================

// maybe throw into <utils.js> at some [future] point?
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


function updateDOMUI() {
  labl_fps.html("FPS: "+round(frameRate()));
} // Ends Function updateDOMUI