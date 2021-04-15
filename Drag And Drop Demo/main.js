
//>>> GLOBAL DEFAULT VALS FOR MAP DIMS
var CELLS_TALL = 15;
var CELLS_WIDE = 10;
var CELL_SIZE  = 50;


var mapB;
var mapO;

var dObj;

function setup(){
  createCanvas(1200,850).parent("viz");

  let mapBCol = color(0,120,240);
  let mapOCol = color(240,120,0);

  mapO = new GridMap(createVector(CELL_SIZE,CELL_SIZE), 
    CELLS_TALL, 
    CELLS_WIDE, 
    CELL_SIZE
  ).setColor(mapOCol,'v');

  mapB = new GridMap(
    createVector(width-(CELL_SIZE*CELLS_WIDE)-CELL_SIZE,CELL_SIZE), 
    CELLS_TALL, 
    CELLS_WIDE, 
    CELL_SIZE
  ).setColor(mapBCol,'v');

  dObj = new DragObject(createVector(150,150),2,2);


  placeDragObject(null,dObj);

}


function draw(){
  background(60);
  mapB.render();
  mapO.render();
  dObj.render();
  QADFPS();
}

//>>> QUICK-AND-DIRTY F.P.S. Textbox Display
const FPSSTR = "FPS: ";
function QADFPS(){
  textSize(16);noStroke();
  fill(0,60,180,127);rect(0,0,72,24);
  fill(255);text(FPSSTR+floor(frameRate()),6,18);
}


function mouseInCanvas(){return (mouseX > 0) && (mouseY > 0) && (mouseX < width) && (mouseY < height);}

function mousePtToVec(){return createVector(mouseX, mouseY);}


function mousePressed(){
  if(mouseInCanvas() && mouseButton === LEFT){
    //vertices.forEach(v => v.onMousePressed(mousePtToVec()));
    dObj.onMousePressed(mousePtToVec());
  }
}

function mouseReleased(){
  //vertices.forEach(v => v.onMouseRelease());
  dObj.onMouseReleased(mousePtToVec());
}

function mouseDragged(){
  if(mouseInCanvas() && mouseButton === LEFT){
    //vertices.forEach(v => v.onMouseDragged(mousePtToVec()));
    dObj.onMouseDragged(mousePtToVec());
  }
}


//>>> STUFF THAT WILL GO INTO DragObjectController

function placeDragObject(pos,obj){

  let mapAndCell = getDragObjectTopLeftCell(obj);

  if(mapAndCell==null){return;}

  let theMap  = mapAndCell[0];
  let theCell = mapAndCell[1];
  let theDim  = mapAndCell[2];

  let cellList = [];

  for (var r = 0; r < theDim; r++) {
    for (var c = 0; c < theDim; c++) {
      cellList.push([r+theCell[0], c+theCell[1]]);
    }
  }

  theMap.setCellsToFilled(cellList);




}


function getDragObjectTopLeftCell(obj){

  let objSize = obj.cWide;
  let objTLPos = null;

  if(objSize == 2){
    objTLPos = createVector(
      obj.pos.x - ((obj.cWide/2)*CELL_SIZE) + (CELL_SIZE/2),
      obj.pos.y - ((obj.cWide/2)*CELL_SIZE) + (CELL_SIZE/2),
    );
  }

  let objCoord = mapB.posToCoord(objTLPos);

  if(mapB.isValidCell(objCoord)){return [mapB, objCoord, objSize];}

  objCoord = mapO.posToCoord(objTLPos);

  if(mapO.isValidCell(objCoord)){return [mapO, objCoord, objSize];}

  return null;
}