

var bbutton;


var bldgStartFrame;
var bldgDoneFrame;
var bldgTimePeriod = 300;
var bldgProgress = 0;
var isBuilding     = false;

function setup(){
  createCanvas(600,600).parent("viz");

  bbutton = new BuildButton(createVector(0,0),createVector(400,400));

}

function draw(){


  simulateBuilding();


  translate(100,100);
  background(180);
  bbutton.render();



}

//######################################################################
//>>> UI METHODS
//######################################################################
function keyPressed(){
  if(key == ' ' && !isBuilding){onStartBuilding();}
}

//######################################################################
//>>> LOGIC METHODS
//######################################################################
function onStartBuilding(){
  isBuilding = true;
  bldgStartFrame = frameCount;
  bldgProgress = 0;
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

//######################################################################
//>>> RENDER METHODS
//######################################################################
function QADShowBldgProgress(){
  noStroke();fill(255);
  textAlign(CENTER,TOP); textSize(32);
  text(bldgProgress,width/2,32);
}