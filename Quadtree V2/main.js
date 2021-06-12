/*######################################################################
###>>>>>> PROJECT : BROADGATE <--> SPECIAL TASK : SPELLBREAKER <<<<<<###
###           <OIC/OID - PRAISE BE THE HONOURABLE MENTORS>           ###
######################################################################*/

var MODES  = {pr:0, dest:1};
var qtMode = MODES.dest;

//>>> Quadtree Structures/Variables (Both Types)
var qt;
var qtSqPixels = 768;

//>>> PR-Quadtrees Structures/Variables
var doAnimRandInsert = false; // do automatic random point inserts
var animInsertPeriod = 6; // insert random point every [x] frames (i.e. ~[x]/60 seconds)

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
}


function mouseWheel(event){
  switch(qtMode){   
    case MODES.dest: queryDisk.updateRad(event.delta); break;
  }
}


function keyPressed(){
  switch(qtMode){   
    case MODES.pr: kP_PR(key); break;
    case MODES.dest: kP_Dest(key); break;
  }
}

function kP_PR(k){
  switch(k){
    case 'm': qtMode = MODES.dest; setupDest(); break;
    case 'r': setupPR(); break;
  }
}

function kP_Dest(k){
  switch(k){
    case 'm': qtMode = MODES.pr; setupPR(); break;
    case 'r': setupDest(); break;
  }
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


/*-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~
|>>> SPECIAL NOTE: Using Wrapper Classes, and not my first time doing so
|                  when needing to give 2+ objects external state via
|                  'pass by reference' to either watch and/or manipulate 
|                  value thereof (as seen with UI code in thr 'P5 Tower
|                  Defense' project). If we were writing C/C++, I'd use
|                  pointers; and if Java/C# - a likewise struct and/or
|                  wrapper class. I should include this in the template
|                  skeleton code for future projects - as it seems this
|                  idea is here to stay (here's to Unity3D for fostering
|                  this lovely inspiration [influence?] on me!)
+~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~*/

/*======================================================================
|>>> Class PrimitiveVal
+-----------------------------------------------------------------------
| Description: Implements a Wrapper Class intended for storing primitive
|              values, for the purpose of realizing "passing a primitive 
|              value by reference". See 'Implementation Notes' for more
|              info on the rationale thereto and examples of  use cases.
+-----------------------------------------------------------------------
| Implementation Notes:
|  > Purpose: Instances allow multiple objects and/or code constructs to
|    receive and cache their reference (e.g. via function call WLOG) in
|    order to both read and [most importantly] modify the primitive type
|    values stored/wrapped therein, such that all other recipients can 
|    notice any changes thereto and likewise make their own.
|  > Use Case: An instance of this class can store a boolean value which
|    indicates whether or not to display a grid over some canvas. This
|    instance is declared as a global variable WLOG. Three entities work 
|    with the value supported by this instance: 
|      (1) A conditional expression within the p5js draw() method which
|          determines whether or not to display the grid. If the boolean
|          value is true - the conditional passes and code is run which
|          effects displaying the grid WLOG.
|      (2) A 'ClickButton' instance of a custom canvas-based UI class,
|          which 'binds its action' to the wrapped boolean (i.e. caches
|          its reference thereto). Whenever the user clicks the button,
|          the boolean's value is negated in a 'toggle' behavior.
|      (3) A 'Label' instance of the same UI class whose message and
|          appearence changes whether or not the grid is toggled (i.e.
|          displays 'Grid On' in bright colors if boolean is true, else
|          'Grid Off' in dim colors otherwise WLOG).
|  > Why not work with / pass in primitive values directly? Aren't they
|    technically JavaScript objects themselves? Yes, but JavaScript is 
|    nonetheless 'pass-by-value', NOT 'pass-by-reference'. Thus the side
|    effect of passing a primitive type variable into a function call is
|    that only its value is assigned to the function parameter - NOT its
|    reference as for its value to be changed. That is: any modification
|    of this value made by the function body will only affect the state
|    of the function's parm variable - NOT the original global variable!
+=====================================================================*/
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
