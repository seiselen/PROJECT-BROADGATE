
/*----------------------------------------------------------------------
|>>> Global Variable Settings
+-----------------------------------------------------------------------
| Note: These settings are in global scope for ease of use, but should
|       eventually all be unique to a LSystem instance; sans screenSize
|       which is used to create the canvas. They could be kept around as
|       defaults in the event such vals aren't provided by the user, but
|       #YOLO for now...
+---------------------------------------------------------------------*/
var screenSize = 800;
var initXOff   = 0;
var initYOff   = 0;
var curXOff    = 0;
var curYOff    = 0;
var initLength = 400;
var initRotate = 0;
var initLenFac = 0.5;




// Note: Turn this into array of LSystem structs in future for more than 1 plant
var lsys;

function setup() {
  createCanvas(screenSize, screenSize).parent("viz");
  init_ui();

  load_Ex6();
  instaGenerate();
  
}




//######################################################################
//>>> DRAW LOOP: LOGIC | UI CALLS | RENDER CALLS
//######################################################################

function draw() {
  background(120,180,216);
  fill(0);

  translate(initXOff+curXOff, initYOff+curYOff); 
  rotate(initRotate);

  // QAD_WindSim();

  turtleRender(lsys);
}

function keyTyped(){
  if(key == 'g'){if (lsys.getCurGen() < lsys.getMaxGen()){lsys.generate();}}

}


//######################################################################
//>>> MISC. ANIMATION/SCRIPTING
//######################################################################

// QAD Wind Simulation
var windFrameSpeed = 240;
function QAD_WindSim(){
  var rawLerp = sin(lerp(0,PI,((frameCount%windFrameSpeed)/windFrameSpeed)));
  var rotAnimVal = lerp(10,30,rawLerp);
  var rotTreeVal = lerp(-10,10,rawLerp);
  lsys.setTheta(radians(rotAnimVal))
  rotate(radians(rotTreeVal));
}


// Used to insta-advance to max generations i.e. skip iter key presses
function instaGenerate(){
  for (var i = 0; i < lsys.getMaxGen(); i++) {lsys.generate();}
}


//######################################################################
//>>> L-SYSTEM SUPPORT CODE
//######################################################################

/*======================================================================
| L-System Support Code
+-----------------------------------------------------------------------
|      Author: Daniel Shiffman (The Coding Train / Nature Of Code)
|              Steven Eiselen (Modifications to Dan's code)
| Description: Support code for simple L-System implementation, derived
|              from Dan's N.O.C. GitHub repos.
|   Libraries: p5js
+=====================================================================*/

function Rule(p,q) {
  this.p = p;
  this.q = q;
}

function turtleRender(sys){

  var sen = sys.sentence;
  var len = initLength * pow(initLenFac, sys.curGen);
  var ang = sys.theta;

  var idx = sys.getCurGen();

  stroke(255);

  for (var i = 0; i < sen.length; i++) {
    var c = sen.charAt(i);
    if (c === 'F') {
      strokeWeight(1);
      line(0,0,len,0);
      translate(len,0);
    }
    else if (c === '+') {rotate(ang);}
    else if (c === '-') {rotate(-ang);}
    else if (c === '|') {rotate(PI);}
    else if (c === '[') {push();idx--;}
    else if (c === ']') {pop();idx++;}

    //console.log(idx);
  }
}

function treeColorQAD(idx){
  if(idx == 5){stroke(84,48,5);}
  if(idx == 4){stroke(140,81,10);}
  if(idx == 3){stroke(191,129,45);}
  if(idx == 2){stroke(39,100,25);}
  if(idx == 1){stroke(77,146,33);}
}


function LSystem(axiom) {
  this.sentence = axiom;  // init sentence string to axiom
  this.rules = [];      // init array for ruleset
  this.theta = 0;         // rotation delta for this system
  this.curGen = 0;        // current # generations expanded
  this.maxGen = 5;        // max # generations to expand (default=5)

  //>>> GETTERS
  this.getCurGen = function(){return this.curGen;}
  this.getMaxGen = function(){return this.maxGen;}

  //>>> SETTERS
  this.addRule = function(newRule){this.rules.push(newRule);}
  this.setTheta = function(newTheta){this.theta = newTheta;}
  this.setMaxGen = function(max){this.maxGen = max;}

  //>>> Function generate: Advances L-System Sentence forward by 1 generation
  this.generate = function() {
    var nextgen = ''; // buffer string to populate and replace sentence via generation
    for (var i = 0; i < this.sentence.length; i++) {
      // cur char generates string [if rule antecedent] <xor> remains for new sentence
      var genSeed = this.sentence.charAt(i);
      for (var j = 0; j < this.rules.length; j++) {
        // cur char is rule antecedent - swap with consequent for new sentence
        if (this.rules[j].p === genSeed) {genSeed = this.rules[j].q; break;}
      }
      nextgen += genSeed;
    }
    // Replace sentence and advance generation #
    this.sentence = nextgen;
    this.curGen++;
  }

} // Ends Class LSystem