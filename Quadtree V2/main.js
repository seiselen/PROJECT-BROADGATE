

//>>> Quadtree Structures/Variables
var QT;
var qtSqPixels = 768;

//>>> VFX/GFX Variables
var doAnimRandInsert = false; // do automatic random point inserts
var animInsertPeriod = 6; // insert random point every [x] frames (i.e. ~[x]/60 seconds)

function setup(){
  createCanvas(768,800).parent("viz");
  QT = new QTNode(vec2(0,0),vec2(qtSqPixels,qtSqPixels));
}

function draw(){
  //>>> UPDATE CALLS
  if(doAnimRandInsert && frameCount%animInsertPeriod==0){QT.insert(randPtInCanvas());}

  //>>> RENDER CALLS
  background(240,240,255);
  drawCanvasBorder();
  drawCanvasCrosshair();
  QT.render();
  drawFPSSimple();
}

function mousePressed(){
  if(mouseInCanvas() && mouseButton === LEFT){QT.insert(mousePtToVec());}
  return false;
}


//######################################################################
//>>> UTIL FUNCTIONS
//######################################################################

function drawCanvasBorder(){
  stroke(60); strokeWeight(4); noFill();
  rect(0,0,width,height);
}

/*-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~
|>>> SPECIAL NOTE: Updated so default parm vals are width/height, such
|                  that if crosshair is desired only upon a partition of
|                  the canvas - it will render correctly.
+~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~*/
function drawCanvasCrosshair(x=0,y=0,w=width,h=height){
  stroke(255,60,0,64); strokeWeight(2);
  line(x,h/2,w,h/2); line(w/2,y,w/2,h);
}

function mouseInCanvas(){return mouseX>0 && mouseY>0 && mouseX<width && mouseY<height;}
function mousePtToVec(){return vec2(mouseX, mouseY);}
function randPtInCanvas(){return vec2(int(random(qtSqPixels)),int(random(qtSqPixels)));}
function vec2(x=0,y=0){return createVector(x,y);}

/*-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~
|>>> SPECIAL NOTE: Use this method for future projects (i.e. by putting
|                  it into templete main.js)! It demonstrates both use
|                  of default parm val as place to 'cache' prefix blurb,
|                  and nicer code to get [nn.dd] version of frameRate()
+~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~*/
function drawFPSSimple(blurb="FPS: "){
  textSize(18); textAlign(LEFT,CENTER); noStroke(); fill(60);
  text(blurb+nfs(frameRate(),2,2), 12, height-15);
}