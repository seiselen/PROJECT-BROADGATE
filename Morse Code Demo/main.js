var morseGen;
var UI_textIn, UI_enterText;

function setup(){
  createCanvas(1000,500).parent("viz");
  textFont('Courier New');

  UI_textIn    = createInput('').size(500).parent("ui");
  UI_enterText = createButton('Translate').mousePressed(UIHandle_enterText).parent("ui");

  morseGen = new MorseCodeGenerator();
}

function draw(){
  background(60);
  morseGen.render();
}

function UIHandle_enterText(){morseGen.sentenceToConsole(UI_textIn.value());}