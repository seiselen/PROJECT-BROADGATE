

//>>> VARIABLES: @ INIT GEAR OPTIONS
var g_nGearTeeth  = 6;    // # gear teeth (which is == # polygon sides)
var g_intPolyDiam = 180;  // interior diameter of polygon (i.e. sans gear teeth)
var g_toothLength = 128;  // length of gear teeth (?TODO: base it on % edge length instead?)
var g_botLandPct  = 0.15; // % of edge length to place bottom landing vertices
var g_topLandPct  = 0.50; // % of edge length to place bottom landing vertices
var rotSpdVal     = 0.25; // rotation speed of the gear

//>>> OBJECT DEFS
var myGear;

//######################################################################
//>>> SETUP / DRAW / MISC UTIL METHODS
//######################################################################

function setup(){
  createCanvas(640,640).parent("viz");
  initUI();

  myGear = new Gear(createVector(width/2, height/2, 0), 6,g_toothLength,g_intPolyDiam,g_botLandPct,g_topLandPct);
}

function draw(){
  background(240);
  drawCanvasBorder();
  myGear.drawGearShape();
}

function drawCanvasBorder(){
  strokeWeight(4); stroke(60); noFill();
  rect(0,0,width,height);
}

//######################################################################
//>>> UI/UX CODE SPECIFIC TO THIS DEMO
//######################################################################

// Could use lambdas to reduce this code, but K.I.S.S. as to push a completed build to GitHub per Broadgate
var UI_nGearTeeth, UI_intPolyDiam, UI_toothLength, UI_botLandPcnt, UI_topLandPcnt, UI_rotateSpeed;

function initUI(){
  let sldWidth = '240px';
  UI_nGearTeeth  = createSlider(4, 12, g_nGearTeeth).style('width', sldWidth).parent("ui_numTeeth").input(handleUI_nGearTeeth);
  UI_intPolyDiam = createSlider(120, 240, g_intPolyDiam).style('width', sldWidth).parent("ui_polyDiam").input(handleUI_intPolyDiam);
  UI_toothLength = createSlider(60, 240, g_toothLength).style('width', sldWidth).parent("ui_toothLen").input(handleUI_toothLength);
  UI_botLandPcnt = createSlider(0.1, 0.45, g_botLandPct,0).style('width', sldWidth).parent("ui_botLandPct").input(handleUI_botLandPct);
  UI_topLandPcnt = createSlider(0.45, 0.8, g_topLandPct,0).style('width', sldWidth).parent("ui_topLandPct").input(handleUI_topLandPct);
  UI_rotateSpeed = createSlider(-2.0, 2.0, rotSpdVal,0).style('width', sldWidth).parent("ui_rotateSpeed").input(handleUI_rotSpeed);

  createButton('Set To Zero').parent("ui_rotateSpeed").mousePressed(handleUI_rotStop);
}

function handleUI_nGearTeeth(){myGear.setNumTeeth(UI_nGearTeeth.value());}
function handleUI_intPolyDiam(){myGear.setPolyDiam(UI_intPolyDiam.value());}
function handleUI_toothLength(){myGear.setToothLen(UI_toothLength.value());}
function handleUI_botLandPct(){myGear.setBotLandPct(UI_botLandPcnt.value());}
function handleUI_topLandPct(){myGear.setTopLandPct(UI_topLandPcnt.value());}
function handleUI_rotSpeed(){myGear.setRotSpeed(UI_rotateSpeed.value());}
function handleUI_rotStop(){myGear.setRotSpeed(0);}