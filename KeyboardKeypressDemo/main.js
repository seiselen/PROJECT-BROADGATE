
//>>> GLOBAL CONSTS AND DATA STRUCTURES
const ASCIIRange = 126;
var keyReps = new Map();

//>>> VARIABLES FOR KEYBOARD KEYS VIZ
var keyLettWide = 40;
var keyLettTall = 40;
var keyLettOffs = 10; // offset between keys

function setup(){
  createCanvas(800,300).parent("viz");
  initKeyReps();
}

function draw(){
  background(60);
  stroke(255);
  dispKeyReps();
}

function dispKeyReps(){
  keyReps.forEach((value, key) => {value.display();}); // hey a Lambda!
}

function keyPressed(){
  //console.log("keyCode = "+keyCode+" | key = "+key); // KEEP/USE THIS TO FIND KEY #'S
  if(keyReps.get(keyCode)){keyReps.get(keyCode).toggle();}
  return false;
}

function keyReleased(){
  if(keyReps.get(keyCode)){if(keyCode!=20){keyReps.get(keyCode).toggle();}}
  return false;
}