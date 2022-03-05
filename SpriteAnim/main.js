var fireSequence;
var reloadSequence;
var animClip1;

function preload(){
  //reloadSequence = importDECFrameList(["SNIP E 2","SNIP F 2","SNIP G 2","SNIP H 2","SNIP I 2","SNIP J 2","SNIP K 2","SNIP J 2","SNIP I 2","SNIP H 2","SNIP G 2","SNIP F 2","SNIP E 2"]);
  //fireSequence = importDECFrameList(["SNIP B 1", "SNIP C 2", "SNIP B 1", "SNIP D 1"]);
  //reloadSequence = importDECFrameList(["MISR M 1","MISR N 1","MISR O 1","MISR P 1","MISR O 1","MISR N 1","MISR M 1"]);

  reloadSequence = importDECFrameList([
    "RLNG A 10",    
    "MIAI A 5",
    "MIAI B 5",
    "MIAI C 5",
    "MIAI D 5",
    "RLNG A 10"
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