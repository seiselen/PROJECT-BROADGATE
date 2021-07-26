var curRule;
var cur1DCA;

function setup(){
  createCanvas(1200,800).parent("viz");
  curRule = new RuleDefinition(vec2(40,0));
  cur1DCA = new CA1D(60, 35, 20, vec2(0,100));

  // NOTE: QAD
  let advButton = createButton("Advance CA").parent("ui").mousePressed(()=>cur1DCA.advanceCA());
} // Ends P5JS Function setup

function draw(){
  background(0,255,60);
  drawCanvasBorder();
  drawGrid();

  curRule.render();
  cur1DCA.render();
  drawFPSSimple();
} // Ends P5JS Function draw


//>>> P5JS UI/IO FUNCTIONS
function mousePressed(){
  if(mouseInCanvas()){
    curRule.onMousePressed();
    cur1DCA.onMousePressed();
  }
  return false;
} // Ends P5JS Function mousePressed


//>>> 'STANDARD' UTIL FUNCTIONS
function drawCanvasBorder(){stroke(60); strokeWeight(4); noFill();rect(0,0,width,height);}
function drawCanvasCrosshair(x=0,y=0,w=width,h=height){stroke(255,60,0,64); strokeWeight(2);line(x,h/2,w,h/2); line(w/2,y,w/2,h);}
function drawGrid(spacing=20,lineColor=null,lineThick=1){let numLinesH = int(height/spacing); let numLinesV = int(width/spacing); stroke((lineColor) ? lineColor : color(64,32)); strokeWeight(lineThick); for(let i=0; i<numLinesH; i++){line(0,spacing*i,width,spacing*i);} for(let i=0; i<numLinesV; i++){line(spacing*i,0,spacing*i,height);}}
function drawFPSSimple(blurb="FPS: "){ textSize(18); textAlign(LEFT,CENTER); noStroke(); fill(60); text(blurb+nfs(frameRate(),2,2), 12, height-15);}
function mouseInCanvas(){return (mouseX > 0) && (mouseY > 0) && (mouseX < width) && (mouseY < height);}
function mousePtToVec(){return createVector(mouseX, mouseY);}
function vec2(x=0,y=0){return createVector(x,y);}