//> Browser Sync Command: browser-sync start --server -f -w

var gForce = {dir:'d',mag:1.5};
var sp_stiffVal = 1.0;
var sp_dampVal  = 0.5;


var testGridBody;

function setup(){
  createCanvas(1280,800).parent("viz");

  testGridBody = new GridSoftBody(6,8,64);

}


function draw(){
  background(60,120,180);

  testGridBody.update(gForce);

  testGridBody.render();

  dispFPSViaDOM();
}






/*----------------------------------------------------------------------
|>>> MOUSE INTERACTION FUNCTIONS
----------------------------------------------------------------------*/
function mousePressed(){
  testGridBody.onMousePressed();
}

function mouseReleased(){
  testGridBody.onMouseReleased();
}

function mouseDragged(){
  testGridBody.onMouseDragged();
}

/*----------------------------------------------------------------------
|>>> MISC CANVAS AND/XOR UTIL FUNCTIONS
----------------------------------------------------------------------*/
var fpsPane = null;
function dispFPSViaDOM(dFrame=3){
  if(!fpsPane){fpsPane=document.getElementById("fpsPane");}
  if(frameCount%dFrame==0){fpsPane.textContent = `FPS: [${nf(frameRate(),2,2)}] (Updated Every [${dFrame}] Frames)`;}
}
