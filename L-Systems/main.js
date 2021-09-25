/*======================================================================
|>>> Project: L-System Demo/Testbed/Sandbox
+-----------------------------------------------------------------------
| Description:  [QAD] Interactive visualization and experimentation with
|               PCG of simple 2D L-System objects for mostly vegetation
|               (e.g. trees bushes, etc.); as well as other things that
|               can be generated utilizing [L-System] shape grammars. 
| Author:     > Dan Shiffman (NYU / The Coding Train / Nature Of Code) 
|                for a chunk of the base L-System init and render code.
|              > Steven Eiselen (Eiselen Laboratories) for expansion and
|                enhancement thereupon, as well as UI/UX interactivity.
| Lang./Lib.:  JavaScript via P5JS
+=====================================================================*/
var PaneDims = {VIZ_WIDE:1024, UI_WIDE:320, TALL:768};

var pzUtil, lsys;

function setup() {
  createCanvas(PaneDims.VIZ_WIDE, PaneDims.TALL).parent("viz");

  pzUtil = new PZUtil([PaneDims.VIZ_WIDE, PaneDims.TALL]);
  lsys   = new LSystem().loadConfig('ex_tree_02').instaGenerate();
  init_ui();
} // Ends P5JS Function setup

function draw() {
  //====================================================================
  //>>> UPDATE CALLS
  //====================================================================
  pzUtil.update();
  updateDOMUI();
  //====================================================================
  //>>> RENDER CALLS
  //====================================================================
  background("#78B4D8"); // i.e. background(120,180,216) 
  pzUtil.pushTF();lsys.render();pzUtil.popTF();
  drawCanvasBorder();
  pzUtil.render();
  drawFPS();
} // Ends P5JS Function draw

function mousePressed(){pzUtil.handleMousePressed();if(mouseInCanvas()){return false;}}
function mouseWheel(evt){pzUtil.handleMouseWheel(evt);}
function keyPressed(){lsys.handleKeyPressed(key);pzUtil.handleKeyPressed(key);}