/*----------------------------------------------------------------------
|>>> GLOBAL VAR DECLARATIONS
+---------------------------------------------------------------------*/
var sprSheet;
var coordSheet; // used for testing/debug
var testAnims;  // used for testing/debug

// [24×24] cells at [32×32] px/cell
var worldDims = {canvWide:768, canvTall:768, cellSize:32};
var map;


/*----------------------------------------------------------------------
|>>> P5JS 'MAIN SEQUENCE' METHODS
+---------------------------------------------------------------------*/
function preload() {
  sprSheet   = loadImage('sSheetOreGemsAeth.png');
  coordSheet = loadImage('cellCoords.png');
  testAnims  = [];
} // Ends P5JS Function preload


function setup(){
  createCanvas(worldDims.canvWide,worldDims.canvTall).parent("viz");

  //sheetTest_initAnims();

} // Ends P5JS Function setup


function draw(){



  //>>> RENDER CALLS 
  background(240,240,255);

  //sheetTest_render();

  drawGrid(32);
  drawCanvasBorder();
  drawFPSSimple();
} // Ends P5JS Function draw



