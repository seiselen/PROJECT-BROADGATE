/*######################################################################
###>>>>>> PROJECT : BROADGATE <--> SPECIAL TASK : SPELLBREAKER <<<<<<###
###           <OIC/OID - PRAISE BE THE HONOURABLE MENTORS>           ###
######################################################################*/

//######################################################################
//>>> GLOBAL STRUCT/CONFIG DECS/INITS
//######################################################################

//>>> Quadtree Structures/Variables (Both Types)
var qt;
var qtSqPixels = 768;
var MODES  = {pr:0, dest:1};
var qtMode = MODES.pr;

//>>> PR-Quadtrees Structures/Variables
var doAnimRandInsert = false; // do automatic random point inserts
var animInsertPeriod = 12; // insert random point every [x] frames (i.e. ~[x]/60 seconds)

//>>> Dest-Quadtrees Structures/Variables
var qtNodeNum; // # of DestQT nodes (via # calling 'render' each frame)
var dispEdges; // display node edges?
var queryDisk; // current position, current radius, and max radius of query disk

//######################################################################
//>>> SETUP FUNCTIONS
//######################################################################

function setup(){
  createCanvas(768,800).parent("viz");
  document.addEventListener("contextmenu", event => event.preventDefault()); // prevents right click menu popup
  switch(qtMode){   
    case MODES.pr:   setupPR();   break;
    case MODES.dest: setupDest(); break;
  }
} // Ends p5js Function setup

function setupPR(){
  qt = new QTNodePR(vec2(0,0),vec2(qtSqPixels,qtSqPixels));
} // Ends p5js Function setupPR

function setupDest(){
  qtNodeNum = new Integer_W(0);
  dispEdges = new Boolean_W(true);
  qt = new QTNodeDest(vec2(0,0), vec2(qtSqPixels,qtSqPixels), qtNodeNum, dispEdges);

  queryDisk = {
    pos: vec2(), 
    rad: 64,
    radD: 2,   // disk radius delta (i.e. change) per mouseWheel/keypress action
    radB: {min:8, max:128}, // disk radius min and max value bounds
    updatePos : function(){this.pos.set(mouseX,mouseY);},
    updateRad : function(mwDelta){this.rad = constrain(((mwDelta<0)?this.rad+this.radD:this.rad-this.radD), this.radB.min, this.radB.max)},
    render : function(){strokeWeight(2);noFill();stroke(0,120,255);ellipse(this.pos.x, this.pos.y, this.rad*2, this.rad*2);}
  };
} // Ends p5js Function setupDest

//######################################################################
//>>> DRAW FUNCTIONS
//######################################################################

function draw(){
  switch(qtMode){   
    case MODES.pr:   drawPR();   break;
    case MODES.dest: drawDest(); break;
  }
} // Ends p5js Function draw

function drawPR(){
  //>>> UPDATE CALLS
  if(doAnimRandInsert && frameCount%animInsertPeriod==0){qt.insert(randPtInCanvas());}
  //>>> RENDER CALLS
  background(240,240,255);
  drawCanvasBorder();
  qt.render();
  drawFPSSimple();
} // Ends Function drawPR

function drawDest(){
  //>>> UPDATE CALLS
  queryDisk.updatePos();
  qtNodeNum.setToZero();
  //>>> RENDER CALLS
  background(240,240,255);
  drawCanvasBorder();
  qt.render();
  queryDisk.render();
  // Display Quadtree Node Count. Makes no sense to define function for this (at least for this demo) 
  textSize(24); textAlign(LEFT,CENTER); strokeWeight(1); stroke(60); fill(60);
  text("Quadtree Node Count = "+qtNodeNum.get(), width/1.75, height-15);
  drawFPSSimple();
} // Ends Function drawDest

//######################################################################
//>>> UI/UX FUNCTIONS
//######################################################################

function mousePressed(){
  if(mouseInCanvas()){
    switch(qtMode){   
      case MODES.pr:
        if(mouseButton === LEFT){qt.insert(mousePtToVec());}
        if(mouseButton === RIGHT){qt.delete(mousePtToVec());}
        break;
      case MODES.dest:
        if(mouseButton === LEFT){qt.collide(queryDisk.pos, queryDisk.rad);}
        break;
    }
  }
  return false;
} // Ends p5js Function mousePressed

function mouseWheel(event){
  switch(qtMode){   
    case MODES.dest: queryDisk.updateRad(event.delta); break;
  }
  if(mouseInCanvas()){return false;} // NEAT -> IT WORKS!
} // Ends p5js Function mouseWheel

function keyPressed(){
  switch(qtMode){   
    case MODES.pr: kP_PR(key); break;
    case MODES.dest: kP_Dest(key); break;
  }
} // Ends p5js Function keyPressed

function kP_PR(k){
  switch(k){
    case 'm': qtMode = MODES.dest; setupDest(); break;
    case 'r': setupPR(); break;
    case 'a': doAnimRandInsert = !doAnimRandInsert; break;
  }
} // Ends Function kP_PR (keyPressed | PR-Quadtree)

function kP_Dest(k){
  switch(k){
    case 'm': qtMode = MODES.pr; setupPR(); break;
    case 'r': setupDest(); break;
  }
} // Ends Function kP_Dest (keyPressed | Dest-Quadtree)

//######################################################################
//>>> UTIL FUNCTIONS
//######################################################################

function drawCanvasBorder(){stroke(60); strokeWeight(4); noFill(); rect(0,0,width,height);}
function mouseInCanvas(){return mouseX>0 && mouseY>0 && mouseX<width && mouseY<height;}
function mousePtToVec(){return vec2(mouseX, mouseY);}
function randPtInCanvas(){return vec2(int(random(qtSqPixels)),int(random(qtSqPixels)));}
function vec2(x=0,y=0){return createVector(x,y);}
function drawFPSSimple(blurb="FPS: "){textSize(18); textAlign(LEFT,CENTER); noStroke(); fill(60); text(blurb+nfs(frameRate(),2,2), 12, height-15);}

//######################################################################
//>>> UTIL WRAPPER CLASSES
//######################################################################

class PrimitiveValWrapper{
  constructor(value=0){this.set(value);}
  set(value=0){this.value = value;}
  get(){return this.value;}
  toString(){return "Value = "+this.value;}
  getType(){return "Value Type = " + typeof this.value;}
} // Ends Class PrimitiveValWrapper

class Integer_W extends PrimitiveValWrapper{
  constructor(value=0){super(value);}
  setToZero(){this.value=0;}
  increment(){this.value++;}
  decrement(){this.value--;}
} // Ends Wrapper Class Integer_W

class Boolean_W extends PrimitiveValWrapper{
  constructor(value=false){super(value);}
  toggle(){this.value = !this.value;}
} // Ends Wrapper Class Boolean_W