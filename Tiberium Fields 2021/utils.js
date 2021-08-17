

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

function drawFPSSimple(blurb="FPS: "){textSize(18); textAlign(LEFT,CENTER); noStroke(); fill(60); text(blurb+nfs(frameRate(),2,2), 12, height-15);}
function mouseInCanvas(){return (mouseX > 0) && (mouseY > 0) && (mouseX < width) && (mouseY < height);}
function mousePtToVec(){return createVector(mouseX, mouseY);}
function randCanvasPt(){return vec2(int(random(qtSqPixels)),int(random(qtSqPixels)));}
function vec2(x=0,y=0){return createVector(x,y);}
