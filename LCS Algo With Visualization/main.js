//>>> Query Strings (with default vals)
var rowSeq = "NEWSPAPER";
var colSeq = "NEW YORKER";

//>>> Data Structures
var matrixDP = [];
var strLCS = "";

//>>> GFX and UI/UX Variables/Vals
var fontSize = 32;
var ui_wordROW, ui_wordCOL, ui_RunLCS;

//######################################################################
function setup(){
  createCanvas(800,600).parent("viz");
  initUI();
  textFont("Courier New", fontSize);
  computeAndDisplayLCS();
}


function draw(){} // NOTE: Still needed for update/redraw on each DOM user input event!


function computeAndDisplayLCS(){
  //>>> Compute...
  resetMatrixDP();
  computeLCSMatrix();
  computeLCSString();
  //>>> Display...
  displayLCSMatrix();
  displayLCSString();
}