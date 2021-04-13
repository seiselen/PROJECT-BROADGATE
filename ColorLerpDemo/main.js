
var myColormapBar;
var NUM_BARS = 32;

function setup(){
  createCanvas(800,400).parent("viz");
  initUI();
  let colL = color(222,235,247);
  let colR = color(33,113,181);
  myColormapBar = new ColorBar(createVector(50,50),colL,colR,NUM_BARS,600,100);
}

function draw(){
  background(120);
  myColormapBar.render();
}