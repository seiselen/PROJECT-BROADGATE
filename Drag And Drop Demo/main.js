
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

  dObj = createDragObject([mapO,1,3], 2);



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

//vertices.forEach(v => v.onMousePressed(mousePtToVec()));
function mousePressed(){
  if(mouseInCanvas() && mouseButton === LEFT){
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