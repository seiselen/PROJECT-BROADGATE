


//----------------------------------------------------------------------
//>>> MOUSE/KEY METHODS AND EVENT HANDLERS
//----------------------------------------------------------------------
function mouseInCanvas(){
  return (mouseX > 0) && (mouseY > 0) && (mouseX < width) && (mouseY < height);
}

function mousePtToVec(){
  return createVector(mouseX, mouseY);
}

function mousePressed(){
  if(mouseInCanvas() && mouseButton === LEFT){
    towers.forEach(t => t.onMousePressed(mousePtToVec()));
  }
}

function mouseReleased(){
  towers.forEach(t => t.onMouseReleased());
}

function mouseDragged(){
  if(mouseInCanvas() && mouseButton === LEFT){
    towers.forEach(t => t.onMouseDragged(mousePtToVec()));
  }
}

//----------------------------------------------------------------------
// UI LOADERS (INIT) AND HANDLERS (BEHAVIORS)
//----------------------------------------------------------------------
function initButtons(){

  createButton('Show Tile Map')
  .parent(select('#ui_dispMap'))
  .mousePressed(uiHandle_showTileMap);

  createButton('Show Bldg Map')
  .parent(select('#ui_dispMap'))
  .mousePressed(uiHandle_showBldgMap);

  createButton('Show S.P. Map')
  .parent(select('#ui_dispMap'))
  .mousePressed(uiHandle_showSPMap);

  createButton('Show Map Grid')
  .parent(select('#ui_dispMap'))
  .mousePressed(uiHandle_showMapGrid);

  createButton('Show Cell Coords')
  .parent(select('#ui_dispMap'))
  .mousePressed(uiHandle_showCellCoords);

  createButton('Show Map Path')
  .parent(select('#ui_dispMap'))
  .mousePressed(uiHandle_showMapPath);

  createButton('Show Tower Ranges')
  .parent(select('#ui_dispMap'))
  .mousePressed(uiHandle_toggleTowerRanges);


  createButton('Add Agent')
  .parent(select('#ui'))
  .mousePressed(uiHandle_addAgent);

  createButton('Add Tower')
  .parent(select('#ui'))
  .mousePressed(uiHandle_addTower);

}

function uiHandle_showTileMap(){showTMap = !showTMap;}

function uiHandle_showBldgMap(){showBMap = !showBMap;}

function uiHandle_showSPMap(){showSMap = !showSMap;}

function uiHandle_showMapGrid(){showGrid = !showGrid;}

function uiHandle_showCellCoords(){showCoords = !showCoords;}

function uiHandle_showMapPath(){map.toggle_ShowMapPath();}

function uiHandle_toggleTowerRanges(){towers.forEach(t => (t.showRange=!t.showRange));}

function uiHandle_addAgent(){createAgent(true);}

function uiHandle_addTower(){createTowerFirstEmptyCell();}