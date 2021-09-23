/*======================================================================
|>>> Example Project for PZUtil
+-----------------------------------------------------------------------
| Description: (QAD) Demonstrates how to use the PZUtil
*=====================================================================*/

///*>>> UNCOMMENT ONLY WHEN SERVER IS TURNED ON!
var ImageDisp = {gridEIS:null, gridUV:null, display:function(i,x,y,w=-1,t,d=null){imageMode(CENTER,CENTER);switch(w==-1){case true: image(this[i],x,y);return; case false: image(this[i],x,y,w,t);}}}
function preload(){ImageDisp.gridEIS = loadImage('testGridEIS_dark.png'); ImageDisp.gridUV = loadImage('testGridUV_dark.png');}
//*/

var CANVAS_DIMS = [1280, 768];
var pzUtil;

function setup(){
  createCanvas(CANVAS_DIMS[0],CANVAS_DIMS[1]).parent("viz");
  textFont('Arial'); textStyle(BOLD);

  pzUtil = new PZUtil(CANVAS_DIMS);
} // Ends P5JS Function setup


function draw(){
  //====================================================================
  //>>> UPDATE CALLS
  //====================================================================
  pzUtil.update();

  //====================================================================
  //>>> RENDER CALLS
  //====================================================================
  background("#181818FF"); drawCanvasBorder(); drawGrid(32,"#FFFFFF80",1);
  
  pzUtil.pushTF();

    ImageDisp.display('gridEIS',0,0,1024,1024);

  pzUtil.popTF();

  pzUtil.render();
} // Ends P5JS Function draw


function mousePressed(){
  pzUtil.handleMousePressed();
  return false;
} // Ends P5JS Function mousePressed


function mouseWheel(evt){
  pzUtil.handleMouseWheel(evt);
} // Ends P5JS Function mouseWheel


function keyPressed(){
  pzUtil.handleKeyPressed(key);
} // Ends P5JS Function keyPressed