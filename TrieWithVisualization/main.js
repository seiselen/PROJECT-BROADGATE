var NODE_DIM = 30;   // node dimension (i.e. default [long,wide])
var NODE_PAD = 20;    // node padding (i.e. pixel space between)
var TRIE_OFF_Y = 60; // y-axis offset of the tree
var root;

var UI_textIn, UI_enterText;

function setup(){
  createCanvas(900,660).parent("viz");
  initUI();

  textAlign(CENTER,CENTER);
  textSize(18);

  // setup root
  root = new TrieNode("#");

  insertWord(root,"batman");
  insertWord(root,"batty");
  insertWord(root,"bat");

}

function draw(){
  background(60);
  root.render();
}


function initUI(){
  UI_textIn    = createInput('').size(480).parent("ui");
  UI_enterText = createButton('Enter Word').mousePressed(UIHandle_enterText).parent("ui");
}

function UIHandle_enterText(){insertWord(root, UI_textIn.value());}
