var fireSequence;
var reloadSequence;
var animClip1;

function preload(){
  reloadSequence = importDECFrameList([   
    "SNIP E 2",
    "SNIP F 2",
    "SNIP G 2",
    "SNIP H 2",
    "SNIP I 2",
    "SNIP J 2",
    "SNIP K 2",
    "SNIP J 2",
    "SNIP I 2",
    "SNIP H 2",
    "SNIP G 2",
    "SNIP F 2",    
    "SNIP E 2",
  ]);

  fireSequence = importDECFrameList([
    "SNIP B 2",
    "SNIP C 2",
    "SNIP D 2",    
  ]);

}

function setup(){
  createCanvas(900,600).parent("viz");
  animClip1 = new SpriteAnimClip(reloadSequence).setImgScale(2);
  frameRate(35); // IMPORTANT! 1 Tic = 1/35 second, so this synchs accordingly
}

function draw(){
  //>>> UPDATE CALLS  
  animClip1.advance();
  //>>> RENDER CALLS
  background(255);
  drawCanvasBorder();
  drawGrid(12,"#FF780040");
  drawFPS();
  animClip1.render();
}

function mousePressed(){}
function mouseReleased(){}
function mouseDragged(){}
function keyPressed(){}