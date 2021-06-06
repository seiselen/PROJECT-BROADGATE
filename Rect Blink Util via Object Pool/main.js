
//>>> Data Structures
var rbm;

//>>> Variables (Globals, Configs, etc.)
var minTimePer = 1; // min time period for anim requests
var maxTimePer = 6; // max time period for anim requests

function setup(){
  createCanvas(800,800).parent("viz");
  rbm = new RectBlinkerManager();
}

function draw(){
  //>>> UPDATE CALLS
  rbm.updatePool();
  //>>> RENDER CALLS
  background(240,240,255);
  drawCanvasBorder();
  rbm.renderPool();
}

function drawCanvasBorder(){
  stroke(60); strokeWeight(4); noFill();
  rect(0,0,width,height);
}

function keyPressed(){
  rbm.request(
    createVector(int(random(20,380)),  int(random(20,380))),
    createVector(int(random(400,780)), int(random(400,780))),
    random(minTimePer,maxTimePer)
  );
}