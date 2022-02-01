

var sprImgArr;
var animClip1;

function preload(){
  sprImgArr = importDECFrameList(["SNIP E 1", "SNIP F 1", "SNIP G 1", "SNIP H 1", "SNIP I 1", "SNIP J 1", "SNIP K 1"]);
  
}

function setup(){
  createCanvas(1200,800).parent("viz");


  animClip1 = new SpriteAnimClip(sprImgArr);

}


function draw(){
  


  //>>> RENDER CALLS
  background(255);
  drawCanvasBorder();
  drawGrid(12,"#FF780040");
  drawFPS();
  animClip1.render();
}

function mousePressed(){

}

function mouseReleased(){

}

function mouseDragged(){

}

function keyPressed(){

}

