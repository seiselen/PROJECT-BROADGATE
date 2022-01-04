

var Config = {
  cellsWide : 48,
  cellsTall : 64, 
  cellSize  : 16,
}


var paintType = TileType.dirt;
var mouseMode = "paint";


var myMap;
var pathTokens = [];

function setup(){
  createCanvas(1024,768).parent("pane_viz");

  myMap = new GameMap(Config.cellsWide,Config.cellsTall,Config.cellSize);
  pathTokens.push(createDragObject("START",2,4));
  pathTokens.push(createDragObject("GOAL",5,25));

  initUI();
}


function draw(){
  //>>> UI CALLS
  onMouseDown();

  //>>> UPDATE CALLS
  updateLabels();

  //>>> RENDER CALLS
  background(255);
  myMap.render();
  pathTokens.forEach(tok => tok.render());

  drawMouseCoordCursor();
  drawCanvasBorder();
}







function onMouseDown(){
  if(mouseInCanvas()&&mouseIsPressed&&mouseButton==LEFT&&mouseMode=="paint"){
    myMap.setValueAt(myMap.posToCoord(mousePtToVec()),paintType);
  }
} // Ends Function onMouseDown


function mousePressed(){
  if(mouseInCanvas() && mouseButton === LEFT && mouseMode=="cells"){
    pathTokens.forEach(tok => tok.onMousePressed(mousePtToVec()));
  }
}

function mouseReleased(){
  pathTokens.forEach(tok => tok.onMouseReleased());
}

function mouseDragged(){
  if(mouseInCanvas() && mouseButton === LEFT && mouseMode=="cells"){
    pathTokens.forEach(tok => tok.onMouseDragged(mousePtToVec()));
  }
}






//>>> DOM UI TEMP (TODO: Move to its own 'ui.js')

var labl_curFPS, labl_mousePos, labl_mouseCell, labl_tokenS, labl_tokenG;
var cBox_showOCSets, cBox_showGrid, cBox_showSPMap;
var mseOpts, pathOpts, pntOpts;


function initUI(){
  labl_curFPS = select("#labl_curFPS");
  labl_mousePos = select("#labl_mousePos");
  labl_mouseCell = select("#labl_mouseCell");
  labl_tokenS = select("#labl_tokenS");
  labl_tokenG = select("#labl_tokenG");

/*
  cBox_showOCSets = select("#cBox_showOCSets");
  cBox_showOCSets.elt.checked = showOCSet;
  cBox_showOCSets.changed(()=>{showOCSet = cBox_showOCSets.checked()});
*/

  cBox_showGrid = select("#cBox_showGrid");
  cBox_showGrid.elt.checked = myMap.showGrid;
  cBox_showGrid.changed(()=>{myMap.showGrid = cBox_showGrid.checked()});


  mseOpts  = document.getElementsByName('mseMode');
  pathOpts = document.getElementsByName('pathOpt');
  pntOpts  = document.getElementsByName('pntOpt');

  // synch (set) agent and paint radio buttons to that specified in main.js
  pntOpts.forEach((item)=>{if(item.value.substring(4)==paintType){item.checked=true;}});

  // set mouse mode as specified in main.js; then disable counterparts' options
  mseOpts.forEach((item)=>{if(item.value==mouseMode){item.checked=true; onMouseIntrctModeChanged(item);}});

  updateLabels();
}

function updateLabels(){
  labl_curFPS.html(round(frameRate(),2));
  labl_mousePos.html((mouseInCanvas()) ? "("+round(mouseX)+","+round(mouseY)+")" : "N/A");
  labl_mouseCell.html((mouseInCanvas()) ? "["+myMap.posToCoord(mousePtToVec())+"]" : "N/A");
  labl_tokenS.html(pathTokens[0].coord);
  labl_tokenG.html(pathTokens[1].coord);
}


function onMouseIntrctModeChanged(newItem){
  mouseMode = newItem.value;
  switch(mouseMode){
    case "cells" : 
      pntOpts.forEach((pItm)=>pItm.disabled=true); 
      pathOpts.forEach((aItm)=>aItm.disabled=false); 
      return;
    case "paint" : 
      pntOpts.forEach((pItm)=>pItm.disabled=false); 
      pathOpts.forEach((aItm)=>aItm.disabled=true); 
      return;
  }
}


function onTilePaintOptionChanged(newItem){paintType = TileType[newItem.value];}
function onSearchAlgoModeChanged(newItem){console.log(newItem.value); /*>>> WILL SOON BE: pathFind.setAlgo(newItem.value); */}





function drawMouseCoordCursor(){
  if(!mouseInCanvas()){return;}
  let sinRand = map(sin(((frameCount%30)/30)*PI),-1,1,127,255);
  let cSize = Config.cellSize;
  noCursor();
  push(); 
    switch(mouseMode){
      case "paint": 
        translate(floor(mouseX/Config.cellSize)*Config.cellSize, floor(mouseY/Config.cellSize)*Config.cellSize);
        stroke(0,255,0,sinRand); strokeWeight(2); 
        switch(paintType){
          case TileType.road : fill(myMap.fill_terr_road); break;
          case TileType.pave : fill(myMap.fill_terr_pave); break;
          case TileType.dirt : fill(myMap.fill_terr_dirt); break;
          case TileType.gras : fill(myMap.fill_terr_gras); break;
          case TileType.sand : fill(myMap.fill_terr_sand); break;
          case TileType.watr : fill(myMap.fill_terr_watr); break;
          default:             fill(myMap.fill_terr_ERRR); break;
        } 
        rect(0,0,Config.cellSize,Config.cellSize); 
      break;

      case "cells":
        translate(mouseX-cSize*0.5, mouseY-cSize*0.5);
        noFill(); strokeWeight(2); stroke(60,60,255,sinRand); 
        line(cSize*0.5,cSize*.25,cSize*0.5,-cSize*.25); 
        line(cSize*0.5,cSize*.75,cSize*0.5,cSize*1.25); 
        line(-cSize*.25,cSize*0.5,cSize*.25,cSize*0.5); 
        line(cSize*.75,cSize*0.5,cSize*1.25,cSize*0.5); 
        rect(0,0,cSize,cSize);
      break;
    }
  pop();
} // Ends Function drawCursor