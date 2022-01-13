var Config = {
  cellsWide : 64,
  cellsTall : 48, 
  cellSize  : 16,
  pthPtDiam : 8
}

var mouseMode = "paint";

var myMap;
var pathFind;
var mapEdit;

/*======================================================================
|>>> UI 'Interface' State/Functions for Pathfinder System Demonstrator
+=====================================================================*/
var curPath  = null;  // current generated path (as output from pathFind.findPath(...))
var curCSet  = null;  // current Open Set (as copy of that in pathFind object)
var curOSet  = null;  // current Closed Set (as copy of that in pathFind object)
var showPath = true; // display Path? (A/A)
var showCSet = false; // display Open Set? (A/A)
var showOSet = false; // display Closed Set? (A/A)

function setup(){
  createCanvas(1024,768).parent("pane_viz");
  myMap    = new GameMap(Config.cellsTall,Config.cellsWide,Config.cellSize);
  pathFind = new PathFinder(myMap);
  mapEdit  = new MapEditor(myMap);


  pathTokens.init();
  initUI();


}

function draw(){
  //>>> UI CALLS
  onMouseDown();

  //>>> UPDATE CALLS
  updateLabels();

  //>>> RENDER CALLS
  background(255);
  myMap.renderMap();

  switch(mouseMode){
    case 'paint': mapEdit.renderCursor(); myMap.renderGrid(); renderPathInfo(); break;
    case 'path' : myMap.renderGrid(); renderPathInfo(); drawPathModeCursor(); break;
  }

  //drawCanvasBorder();
}

// Exists to assert RENDER CALL order for path-related stuff
function renderPathInfo(){renderOpenSet(); renderClosedSet(); renderPath(); pathTokens.render();}


function keyPressed(){
  key = key.toLowerCase();
  if(key=='g'){onToggleShowGrid();}
  if(key=='p'){onSaveMapDialogue();}
  if(key=='l'){onLoadMapDialogue();}
}



function onMouseDown(){
  if(mouseInCanvas()&&mouseIsPressed&&mouseButton==LEFT&&mouseMode=="paint"){
    mapEdit.paintAtMouseTile();
  }
} // Ends Function onMouseDown

function mousePressed(){
  if(mouseInCanvas() && mouseButton === LEFT){
    if(mouseMode=="path"){pathTokens.vals.forEach(tok => tok.onMousePressed(mousePtToVec()));}
    if(mouseMode=="paint" && cBox_floodFillTile.checked()){mapEdit.floodFillAtMouseTile();}
  }


} // Ends Function mousePressed

function mouseReleased(){
  //>>> TODO: This and all equivalents should be within a 'PathDemoManager' s.t. <myPDManager.onMouseReleased()>
  pathTokens.vals.forEach(tok => tok.onMouseReleased());
} // Ends Function mouseReleased

function mouseDragged(){
  if(mouseInCanvas() && mouseButton === LEFT && mouseMode=="path"){
    pathTokens.vals.forEach(tok => tok.onMouseDragged(mousePtToVec()));
  }
} // Ends Function mouseDragged

function mouseWheel(event){
  mapEdit.setPaintSize(Math.sign(-event.delta));
}

//######################################################################
//>>> GENERAL UTIL      (TODO: add to utils.js, especially 'arr2Equals')
//######################################################################

//>>> For Array[2] Only (i.e. [arr]=>[v0,v1])
function arr2Equals(v1,v2){
  return (v1[0]==v2[0] && v1[1]==v2[1]);
}

//>>> For Any Size (though returns 'false' if their lengths differ!)
function arrayValsEqual(arr1, arr2){
  if(arr1.length != arr2.length){return false;}
  for (let i=0; i<arr1.length; i++){if (arr1[i] != arr2[i]){return false;}}
  return true; 
}

//>>> For any float (0.0…1.0], maps it to an int [1,…,nParts] 
function bucket(val,nParts){return ceil(val*nParts);}