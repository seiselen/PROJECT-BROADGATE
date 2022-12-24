

function drawGrid(cellSizeFactor=1){
  stroke(gridLnCol); strokeWeight(2); noFill();
  let span = cellSize * cellSizeFactor;
  for (var i = 0; i < cellsWide; i++) {line(i*span,0,i*span,height);}
  for (var i = 0; i < cellsTall; i++) {line(0,i*span,width,i*span);}
}

function drawCellCoords(){
  stroke(0,0,0,60); fill(255);
  textSize(16); textAlign(CENTER, CENTER);

  for(var row=0; row<cellsTall; row++){
    for(var col=0; col<cellsWide; col++){
      text("["+row+","+col+"]", (cellSize*col)+cellHalf,(cellSize*row)+cellHalf);  
    }
  }
}

function QADshowFPS(){
  fill(0,60,240,128);
  rect(width-128,height-64,128,64);
  fill(255);noStroke();textSize(24);textAlign(CENTER,CENTER);
  text("FPS = "+Math.floor(frameRate()),width-64,height-32);
}