//>>> Variables for Array and Cells
var numRows = 12;
var numCols = 8;
var isoWide = 50;
var isoTall = isoWide/2;

//>>> Data Structures
var isoArr;

//>>> Global Variables for GFX/VFX
var col_D, col_W;

function setup(){
  createCanvas(1200,800).parent("viz");

  isoArr = new IsoCellArray(createVector(width/2, height/2), numRows, numCols).setCellDispTo("rc");

  col_D = color(144,84,12);
  col_W = color(0,120,255);
} // Ends p5js Function setup

function draw(){
  background(216,255,216);
  drawCanvasBorder();
  //drawCanvasCrosshair();
  isoArr.render();
} // Ends p5js Function draw

function drawCanvasBorder(){
  stroke(60); strokeWeight(4); noFill();
  rect(0,0,width,height);
} // Ends Function drawCanvasBorder

function drawCanvasCrosshair(){
  stroke(0,0,0,127); strokeWeight(2);
  line(0,height/2,width,height/2);
  line(width/2,0,width/2,height);
} // Ends Function drawCanvasCrosshair