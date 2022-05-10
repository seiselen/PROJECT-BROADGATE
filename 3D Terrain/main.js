/*======================================================================
|>>> PROJECT : POLYNOMIAL-BASED ELEVATION GENERATION FUNCTIONS
+-----------------------------------------------------------------------
|> Description: Contains my 'Follow-Along-And-Experiment-With' code for
|               the YT video 'Painting a Landscape with Maths' from the 
|               source: (youtube.com/watch?v=BFld4EBO2RE); alongside the
|               usual derivations/extensions/experiments thereto.
+=====================================================================*/

// Axis "Enum" (Mostly in case I get confused, but likely future utility too)
var Axis = {"X":"Right", "Y":"Up", "Z":"Forward", "Right":"X", "Up":"Y", "Forward":"Z", "FORE":"X", "ELEV":"Y", "SIDE":"Z"};

// DOM and DEBUG vars/flags
var labl_fps;
var showAxesGizmo = false;

// CONFIG Vals (i.e. glorified command line argzzz)
var Config = {vertsX: 32, vertsZ: 32, vertDim: 16, polyDeg: 5};

// Object Declarations
var gridTile_Naive;
var myTerrain;

function setup() {
  createCanvas(1280,832,WEBGL).parent('viz');
  labl_fps = select("#labl_fps");
  gridTile_Naive = new GridTile_NaivePoly(Config.vertsX,Config.vertsZ,Config.vertDim,Config.polyDeg);
  //myTerrain = new PolySurfaceTerrain(8,8);
} // Ends P5JS Function setup


function draw() {
  //>>> UI/UX CALLS
  orbitControl();
  keyDown();
  //>>> RENDER CALLS
  background(216);
  scale(1,-1,1); // ASSERTS [+Y]=>[UP]

  gridTile_Naive.renderVertBoxesAndPlanes();
  //myTerrain.render();

  if(showAxesGizmo){drawGizmo_3DAxes();}
  updateDOMUI();
} // Ends P5JS Function draw


function keyDown(){
  if(keyIsPressed && (key=="r" || key=="R")){gridTile_Naive.initGridTile();}
} // Ends Function keyDown

function keyPressed(){
  if(key=="g" || key=="G"){showAxesGizmo = !showAxesGizmo;}
  //if(key=="r" || key=="R"){gridTile_Naive.initGridTile();}
} // Ends P5JS Function keyPressed


//======================================================================
//>>> DEBUG AND DOM-UI FUNCTIONS SPECIFIC TO THIS PROJECT
//======================================================================

//>> Draws Axis Lines and Ref Squares Unity3D-style (in resp. order {SIDE, FORE, ELEV})
function drawGizmo_3DAxes(lineDist=128, planeDim=16){ 
  strokeWeight(max(1,int(planeDim/16)));
  stroke(255,0,0); line(0,0,0,512,0,0);
  stroke(0,0,255); line(0,0,0,0,0,512);
  stroke(0,255,0); line(0,0,0,0,512,0);
  noStroke();
  let pDimHalf = planeDim/2;
  fill(255,0,0,127); push(); translate(pDimHalf,pDimHalf,0); plane(planeDim,planeDim); pop();
  fill(0,255,0,127); push(); translate(pDimHalf,0,pDimHalf); rotateX(HALF_PI); plane(planeDim,planeDim); pop();
  fill(0,0,255,127); push(); translate(0,pDimHalf,pDimHalf); rotateY(HALF_PI); plane(planeDim,planeDim); pop();
} // Ends Function drawGizmo_3DAxes


function updateDOMUI() {
  labl_fps.html("FPS: "+round(frameRate()));
} // Ends Function updateDOMUI