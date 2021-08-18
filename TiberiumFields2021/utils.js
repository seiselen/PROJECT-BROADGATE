

function drawCanvasBorder(){stroke(60); strokeWeight(4); noFill(); rect(0,0,width,height);}
function drawCanvasCrosshair(x=0,y=0,w=width,h=height){stroke(255,60,0,64); strokeWeight(2); line(x,h/2,w,h/2); line(w/2,y,w/2,h);}

function drawGrid(spacing=10,lineColor=null,lineThick=2){
  let numLinesH = int(height/spacing);
  let numLinesV = int(width/spacing);
  stroke((lineColor) ? lineColor : color(64,32));
  strokeWeight(lineThick);
  for(let i=0; i<numLinesH; i++){line(0,spacing*i,width,spacing*i);}
  for(let i=0; i<numLinesV; i++){line(spacing*i,0,spacing*i,height);}
}


function drawMouseCellCursor(){
  if(!mouseInCanvas()){return;}
  noCursor(); noFill(); stroke(240); strokeWeight(2); 
  let cSize = worldDims.cellSize;
  rect(floor(mouseX/cSize)*cSize, floor(mouseY/cSize)*cSize, cSize, cSize);
} // Ends Function drawMouseCellCursor


function drawFPS(blurb="FPS: "){noStroke();fill(0,128); rect(0,height-20,80,height-20);textSize(16); textAlign(LEFT,CENTER); strokeWeight(2); stroke(0); fill(255);text(blurb+round(frameRate()), 10, height-8);}
function mouseInCanvas(){return (mouseX > 0) && (mouseY > 0) && (mouseX < width) && (mouseY < height);}
function mousePtToVec(){return createVector(mouseX, mouseY);}
function randCanvasPt(){return vec2(int(random(qtSqPixels)),int(random(qtSqPixels)));}
function vec2(x=0,y=0){return createVector(x,y);}
