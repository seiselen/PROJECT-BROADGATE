

var Config = {
  cellsWide : 64,
  cellsTall : 48, 
  cellSize  : 16,
}


var paintSize = 1; // square # tiles to paint map tiles (i.e. 'paint water tiles 3x3'); a.k.a. 'drawCellSize' in PathfindingProcessing
var paintType = TileType.dirt;
var pathType  = "A*";
var mouseMode = "path";


var priQ;


var myMap;
var pathTokens = {
  init(){
    this.start = createDragObject("start",2,4);
    this.goal  = createDragObject("goal",5,25);
    this.vals  = [this.start, this.goal];
    this.getOtherToken = function(tok){return (tok.token=="start") ? pathTokens.goal : pathTokens.start;}
  }
};


var curPath = null;

function setup(){
  createCanvas(1024,768).parent("pane_viz");

  myMap = new GameMap(Config.cellsTall,Config.cellsWide,Config.cellSize);
  pathTokens.init();


  priQ = new PriorityQueue((a, b) => (compareSearchNodes(a,b)));


  priQ.enqueue(new SearchNode("BATMAN",516));
  priQ.enqueue(new SearchNode("SUPARMAN",631));
  priQ.enqueue(new SearchNode("RIMJOB",520));
  priQ.enqueue(new SearchNode("BLACKENSTEIN",212));
  priQ.enqueue(new SearchNode("MIN",120));
  priQ.enqueue(new SearchNode("CORNHOLIO",480));
  priQ.enqueue(new SearchNode("BLOWJOB",718));
  priQ.enqueue(new SearchNode("BLACKULA",445));
  priQ.enqueue(new SearchNode("MAX",800));
  priQ.enqueue(new SearchNode("SVENGOOLIE",227));


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
  pathTokens.vals.forEach(tok => tok.render());

  drawMouseCoordCursor();
  drawCanvasBorder();
}


function onMouseDown(){
  if(mouseInCanvas()&&mouseIsPressed&&mouseButton==LEFT&&mouseMode=="paint"){
    paintTiles();
  }
} // Ends Function onMouseDown


function mousePressed(){
  if(mouseInCanvas() && mouseButton === LEFT && mouseMode=="path"){
    pathTokens.vals.forEach(tok => tok.onMousePressed(mousePtToVec()));
  }
}

function mouseReleased(){
  pathTokens.vals.forEach(tok => tok.onMouseReleased());
}

function mouseDragged(){
  if(mouseInCanvas() && mouseButton === LEFT && mouseMode=="path"){
    pathTokens.vals.forEach(tok => tok.onMouseDragged(mousePtToVec()));
  }
}


//######################################################################
//>>> VIZ UX Functions Specific To This Project
//######################################################################

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

      case "path":
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


/*----------------------------------------------------------------------
//>>> This whole thing simply realizes frame offset based animation of
|     the path's waypoints, similar to what I [much] later implemented
|     in P5JS for both 'Bezier [Curves]' and a (now deleted?) method for
|     animating waypoint progression for what would become TD-P5JS.
+---------------------------------------------------------------------*/
/*
int simFPS           = 24;
int deltaTime        = maxFPS/simFPS;
int lastFrame        = 0;
int pathID           = 0;

void updateDeltaTime(){
  if(frameCount-lastFrame==deltaTime){
    lastFrame=frameCount;
    if(existsPath){pathID++;}
  }  
}

^^^ should eventually be realized into: animateCurrentPathWaypts(){...} or equiv
*/



//######################################################################
//>>> GENERAL UTIL (i.e. to be added to utils.js, especially 'arr2Equals'
//######################################################################

//>>> Short, sweet, cute, and useful. Throw these two into utils.js soon

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


//######################################################################
//>>> DOM UI TEMP (TODO: Move to its own 'ui.js')
//######################################################################

var labl_curFPS, labl_mousePos, labl_mouseCell, labl_tokenS, labl_tokenG, labl_pathCost, labl_pathHops;
var cBox_showOCSets, cBox_showGrid, cBox_showSPMap;
var pathOpts, pntOpts;


function initUI(){
  labl_curFPS = select("#labl_curFPS");
  labl_mousePos = select("#labl_mousePos");
  labl_mouseCell = select("#labl_mouseCell");
  labl_tokenS = select("#labl_tokenS");
  labl_tokenG = select("#labl_tokenG");
  labl_pathCost = select("#labl_pathCost");
  labl_pathHops = select("#labl_pathHops");

/*
  cBox_showOCSets = select("#cBox_showOCSets");
  cBox_showOCSets.elt.checked = showOCSet;
  cBox_showOCSets.changed(()=>{showOCSet = cBox_showOCSets.checked()});
*/

  cBox_showGrid = select("#cBox_showGrid");
  cBox_showGrid.elt.checked = myMap.showGrid;
  cBox_showGrid.changed(()=>{myMap.showGrid = cBox_showGrid.checked()});


  pathOpts = document.getElementsByName('pathOpt');
  pntOpts  = document.getElementsByName('pntOpt');

  // synch (set) agent and paint radio buttons to that specified in main.js
  pntOpts.forEach((item)=>{if(item.value==paintType){item.checked=true;}});


  onMouseIntrctModeChanged({value:mouseMode});

  updateLabels();
}

function updateLabels(){
  labl_curFPS.html(round(frameRate(),2));
  labl_mousePos.html((mouseInCanvas()) ? "("+round(mouseX)+","+round(mouseY)+")" : "N/A");
  labl_mouseCell.html((mouseInCanvas()) ? "["+myMap.posToCoord(mousePtToVec())+"]" : "N/A");
  labl_tokenS.html(pathTokens.start.coord);
  labl_tokenG.html(pathTokens.goal.coord);
  labl_pathCost.html("N/A"); // TEMP - TODO will be replaced with something like "pathFind.pathCost" else some getter thereto/equiv
  labl_pathHops.html("N/A"); // TEMP - TODO will be replaced with something like "pathFind.pathHops" else some getter thereto/equiv
}


function onMouseIntrctModeChanged(newItem){
  mouseMode = newItem.value;
  switch(mouseMode){
    case "path" :
      select("#paintOptions").elt.hidden=true;
      select("#pathOptions").elt.hidden=false;
      select("#modePaint").elt.disabled = false;
      select("#modePath").elt.disabled = true;
      return;
    case "paint" : 
      select("#paintOptions").elt.hidden=false;
      select("#pathOptions").elt.hidden=true;
      select("#modePaint").elt.disabled = true;
      select("#modePath").elt.disabled = false;
      return;
  }
}


function onTilePaintOptionChanged(newItem){paintType = TileType[newItem.value];}
function onSearchAlgoModeChanged(newItem){console.log(newItem.value); /*>>> WILL SOON BE: pathFind.setAlgo(newItem.value); */}
