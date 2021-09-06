//######################################################################
//>>> Variable / Data-Structure Declarations
//######################################################################
var morseGen, UI_textIn, UI_enterText;

//######################################################################
//>>> Loader / Launcher / UI-UX Functions
//######################################################################
function setup(){
  createCanvas(800,720).parent("viz");
  textFont('Courier New');
  initUI();
  morseGen = new MorseCodeGenerator();
} // Ends P5JS Function setup

function draw(){
  background(60);
  morseGen.render();
} // Ends P5JS Function draw

function initUI(){
  UI_textIn    = createInput('').size(500).parent("ui");
  UI_enterText = createButton('Translate Message!').mousePressed(UIHandle_enterText).parent("ui");
} // Ends Function initUI

function UIHandle_enterText(){
  morseGen.sentenceToConsole(UI_textIn.value());
} // Ends Function UIHandle_enterText