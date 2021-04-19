//>>> GLOBAL DEFAULT VALS FOR MAP DIMS
var CELLS_TALL = 15;
var CELLS_WIDE = 10;
var CELL_SIZE  = 50;

//>>> DATA STRUCTURES FOR MAPS, OBJECTS
var mapB;
var mapO;
var dObjs;


function setup(){
  createCanvas(1200,850).parent("viz");

  mapO = new GridMap(createVector(CELL_SIZE,CELL_SIZE), 
    CELLS_TALL, 
    CELLS_WIDE, 
    CELL_SIZE
  ).setColor(color(240,120,0),'v');

  mapB = new GridMap(
    createVector(width-(CELL_SIZE*CELLS_WIDE)-CELL_SIZE,CELL_SIZE), 
    CELLS_TALL, 
    CELLS_WIDE, 
    CELL_SIZE
  ).setColor(color(0,120,240),'v');

  // Initialize dObjs and add 2 initial members (arbitrary for demo purposes)
  dObjs = [];
  dObjs.push(createDragObject(mapO,1,3,2));
  dObjs.push(createDragObject(mapO,1,1,1));
}


function draw(){
  background(60);
  mapB.render();
  mapO.render();
  dObjs.forEach(d => d.render());
  QADFPS();
}

/*>>> This function is 'functionally' equivalent to the above lambda
function render(d){
  d.render();
}
*/

//>>> QUICK-AND-DIRTY F.P.S. Textbox Display
const FPSSTR = "FPS: ";
function QADFPS(){
  textSize(16);noStroke();
  fill(0,60,180,127);rect(0,0,72,24);
  fill(255);text(FPSSTR+floor(frameRate()),6,18);
}


//>>> MOUSE/KEY METHODS AND EVENT HANDLERS

function mouseInCanvas(){
  return (mouseX > 0) && (mouseY > 0) && (mouseX < width) && (mouseY < height);
}

function mousePtToVec(){
  return createVector(mouseX, mouseY);
}

function mousePressed(){
  if(mouseInCanvas() && mouseButton === LEFT){
    dObjs.forEach(d => d.onMousePressed(mousePtToVec()));
  }
}

function mouseReleased(){
  dObjs.forEach(d => d.onMouseReleased());
}

function mouseDragged(){
  if(mouseInCanvas() && mouseButton === LEFT){
    dObjs.forEach(d => d.onMouseDragged(mousePtToVec()));
  }
}

function keyPressed(){
  let rMRC,rObj; // *r*equest MRC/Obj

  if(!mouseInCanvas()){return;}

  if(key === '1'){
    rMRC = getMRC(mousePtToVec(),1);
    if(rMRC){
      rObj = createDragObject(rMRC[0],rMRC[1],rMRC[2],1);
      if(rObj){dObjs.push(rObj);}
    }
  }

  if(key === '2'){
    rMRC = getMRC(mousePtToVec(),2);
    if(rMRC){
      rObj = createDragObject(rMRC[0],rMRC[1],rMRC[2],2);
      if(rObj){dObjs.push(rObj);}
    }    
  }

}