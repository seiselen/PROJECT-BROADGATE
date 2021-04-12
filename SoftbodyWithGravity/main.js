

var vertices = [];
var springs  = [];

var gForce = 1.5;


var sp_stiffVal = 1.0;
var sp_dampVal  = 0.5;

var cols = 5;
var rows = 5;
var span = 50; // i.e. horizontal/vertical span

function setup(){
  createCanvas(600,600);

  initSBodyLattice();

}


function draw(){
  background(32);

  applyGravity();
  vertices.forEach(v => v.update());
  springs.forEach(s => s.update2());


  springs.forEach(s => s.render());
  vertices.forEach(v => v.render());

}




function applyGravity(){
  vertices.forEach(v => v.applyForceViaDir('d',gForce));
}



function initSBodyLattice(){

  let sp_slackVal = span;
  let sp_slakDiag = sqrt(2)*sp_slackVal;



  let curIter = 0;
  for (var r = 1; r <= rows; r++) {
    for (var c = 1; c <= cols; c++) {
      vertices.push(new PhxVertex(createVector(c*span,r*span)).setID(curIter));
      curIter++;
    }
  }

  // Horizontal Springs
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols-1; c++) {
      springs.push(new PhxSpring(vertices[(r*cols)+c],vertices[(r*cols)+c+1],sp_slackVal,sp_stiffVal,sp_dampVal));
    }
  }

  // Vertical Springs
  for (var r = 0; r < rows-1; r++) {
    for (var c = 0; c < cols; c++) {
      springs.push(new PhxSpring(vertices[(r*cols)+c],vertices[((r+1)*cols)+c],sp_slackVal,sp_stiffVal,sp_dampVal));
    }
  }

  // Diagonal Springs (downward slope)
  for (var r = 0; r < rows-1; r++) {
    for (var c = 0; c < cols-1; c++) {
      springs.push(new PhxSpring(vertices[(r*cols)+c],vertices[((r+1)*cols)+c+1],sp_slakDiag,sp_stiffVal,sp_dampVal));
    }
  }

  // Diagonal Springs (upward slope)
  for (var r = 1; r < rows; r++) {
    for (var c = 1; c < cols; c++) {
      console.log( "("+((r*cols)+c-1)+") to ("+(((r-1)*cols)+c)+")" );
      springs.push(new PhxSpring(vertices[(r*cols)+c-1],vertices[((r-1)*cols)+c],sp_slakDiag,sp_stiffVal,sp_dampVal));
    }
  }

}



/*----------------------------------------------------------------------
|>>> MOUSE INTERACTION METHODS
----------------------------------------------------------------------*/
function mousePtToVec(){
  return createVector(mouseX, mouseY);
}

function mouseInCanvas(){
  return (mouseX > 0) && (mouseY > 0) && (mouseX < width) && (mouseY < height);
}

function mousePressed(){
  if(mouseInCanvas() && mouseButton === LEFT){
    vertices.forEach(v => v.onMousePressed(mousePtToVec()));
  }
}

function mouseReleased(){
  vertices.forEach(v => v.onMouseRelease());
}

function mouseDragged(){
  if(mouseInCanvas() && mouseButton === LEFT){
    console.log("yolo");
    vertices.forEach(v => v.onMouseDragged(mousePtToVec()));
  }
}