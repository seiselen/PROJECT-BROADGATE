/*======================================================================
|###### (OIC/OID) Vigil : Broadgate | Special Task : Spellbreaker ######
+-----------------------------------------------------------------------
|>>> Bezier Point Demo 01 (2/17/21)
+=====================================================================*/


var cWheel;

//>>> TODO -> Could use sliders for these! 
var NUM_SLICES = 128;
var COL_SAT    = 75;

function setup(){
  var canvas = createCanvas(600, 600);
  canvas.parent("viz");



  cWheel = new ColorWheel("","",60,240,NUM_SLICES);


}


function draw(){

  background(0);

  cWheel.render();

}

