//######################################################################
//>>> GLOBAL DECLARATIONS/DEFINITIONS/CONFIG
//######################################################################
var multCirc;

//######################################################################
//>>> P5JS ROOT/IFACE DEFINITIONS
//######################################################################
function setup() {
  createCanvas(768,768).parent('pane_viz');
  multCirc = new MultiplicationCircle(createVector(width/2,height/2), 320, 10, 2);
  init_ui();
} // Ends P5JS Function setup

function draw() {
  background(0,32,64);
  multCirc.render();
  drawFPS(); drawCanvasBorder();
} // Ends P5JS Function draw

//######################################################################
//>>> UI/UX INIT AND HANDLER[S]          (here because it's not too big)
//######################################################################
function init_ui(){
  let slWide = "512px";
  let slider_nPts = createSlider(multCirc.ptsMin, multCirc.ptsMax, multCirc.ptsMin, multCirc.ptsTck).style('width', slWide).parent("slider_pts").input(()=> ui_parmEdit('pts', slider_nPts.value()));
  let slider_mFac = createSlider(multCirc.facMin, multCirc.facMax, multCirc.facMin, multCirc.facTck).style('width', slWide).parent("slider_fac").input(()=> ui_parmEdit('fac', slider_mFac.value()));
  ui_updateParmLabels(); // initial pump of vals into their respective <td>'s
} // Ends Function init_ui

function ui_parmEdit(parm, val){multCirc.setParmAndRegen(parm, val); ui_updateParmLabels();}
function ui_updateParmLabels(){select("#labl_pts").html(multCirc.numPts); select("#labl_fac").html(multCirc.factor);}

//######################################################################
//>>> MISC. UTIL FUNCTIONS                         (i.e. the usual ones)
//######################################################################
function drawFPS(blurb="FPS: "){noStroke();fill(0,128); rect(0,height-20,80,height-20);textSize(16); textAlign(LEFT,CENTER); strokeWeight(2); stroke(0); fill(255);text(blurb+round(frameRate()), 10, height-8);}
function drawCanvasBorder(){stroke(60); strokeWeight(8); noFill(); rect(0,0,width,height);}