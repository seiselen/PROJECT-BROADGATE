//######################################################################
//>>> Variable and Data Structure Declarations/Init
//######################################################################

//>>> Variables for Array and Cells
var numRows = 12;
var numCols = 8;
var isoWide = 48;
var isoTall = 32;
var cellDim = 32;

//>>> Data Structures
var isoArr;

//>>> Global Variables for GFX/VFX
var col_D, col_W;


//######################################################################
//>>> P5JS Functions (setup/draw) and per-project calls within
//######################################################################


function setup(){
  createCanvas(1280,672).parent("viz");

  isoArr = new IsoCellArray(createVector( (width/2)-140, (height/2)), numRows, numCols).setCellDispTo("rc");

  col_D = color(144,84,12);
  col_W = color(0,120,255);
} // Ends p5js Function setup

function draw(){
  isoArr.advance();

  background(48);
  drawCanvasBorder();
  
  isoArr.render();
  isoArr.renderTopDownRep(width-18,18,'r');

  drawFPS();
} // Ends p5js Function draw


//######################################################################
//>>> Misc. Util Methods (i.e. 'the usual ones')
//######################################################################


function drawCanvasBorder(){stroke(60); strokeWeight(4); noFill(); rect(0,0,width,height);}
function drawFPS(){noStroke();fill(0,128); rect(0,height-20,80,height-20);textSize(16); textAlign(LEFT,CENTER); strokeWeight(2); stroke(0); fill(255);text("FPS: "+round(frameRate()), 10, height-8);}