var bbutton;

//>>> Variables for building anim state/sim
var bldgStartFrame;
var bldgDoneFrame; 
var bldgTimePeriod = 300;
var bldgProgress   = 0;
var isBuilding     = false;
var isPaused       = false;

function setup(){
  createCanvas(600,600).parent("viz");
  document.addEventListener("contextmenu", event => event.preventDefault()); // prevents right click menu popup

  bbutton = new BuildButton(createVector(0,0),createVector(400,400));
}

function draw(){
  // LOGIC CALLS
  simulateBuilding();

  // RENDER CALLS
  background(180);
  push();
  translate(100,100);
  bbutton.render();
  pop();
  showBothPopups();
}

//######################################################################
//>>> UI METHODS
//######################################################################
function keyPressed(){
  if(key == ' ' && !isBuilding){onStartBuilding();}
}

function mousePressed(){
  if(mouseInCanvas()){ 
    if(mouseButton == LEFT && !isBuilding){onStartBuilding();}
    if(mouseButton == RIGHT && bldgProgress>0){onCancelBuilding();}
  }

  return false;
}

//######################################################################
//>>> LOGIC METHODS
//######################################################################
function onStartBuilding(){
  isBuilding = true;
  bldgStartFrame = frameCount;
  bldgProgress = 0;
  resetBldgStartPopup();
}

function onDoneBuilding(){
  bldgProgress = 1;
  isBuilding = false;
  bldgDoneFrame = frameCount;
}

function simulateBuilding(){
  if(isBuilding){
    bldgProgress = (frameCount-bldgStartFrame)/bldgTimePeriod;
    if(bldgProgress >= 1){onDoneBuilding();}
  }
}

function onCancelBuilding(){
  bldgProgress = 0;
  isBuilding = false;
  bldgDoneFrame = frameCount;
  resetBldgCancelPopup();
}



//######################################################################
//>>> RENDER METHODS
//######################################################################
function QADShowBldgProgress(){
  noStroke();fill(255);
  textAlign(CENTER,TOP); textSize(32);
  text(bldgProgress,width/2,32);
}


//>>> QAD Popup System (for indicating construction was started/cancelled in lieu of RA-1 Narrator audio clips)
var cPopupFrameStart = -1; var cShowPopup = false;
var sPopupFrameStart = -1; var sShowPopup = false;
var popupNumFrames   = 60;
function resetBldgCancelPopup(){cShowPopup = true; cPopupFrameStart = frameCount;}
function resetBldgStartPopup(){sShowPopup = true; sPopupFrameStart = frameCount;}
function showBothPopups(){showBldgStartPopup();showBldgCancelPopup();}
function showBldgCancelPopup(){if(cShowPopup && frameCount <= cPopupFrameStart+popupNumFrames){strokeWeight(2);stroke(64,64);fill(255,60,0,128);textAlign(RIGHT,CENTER);textSize(48);text("CANCELLED",height-30,height-30);}else{cShowPopup = false;}}
function showBldgStartPopup(){if(sShowPopup && frameCount <= sPopupFrameStart+popupNumFrames){strokeWeight(2);stroke(64,64);fill(0,120,255,128);textAlign(LEFT,CENTER);textSize(48);text("BUILDING",30,height-30);}else{sShowPopup = false;}}


//######################################################################
//>>> UTIL METHODS
//######################################################################
function mouseInCanvas(){
  return (mouseX > 0) && (mouseY > 0) && (mouseX < width) && (mouseY < height);
}