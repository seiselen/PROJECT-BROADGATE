
//>>> GLOBAL CONSTS AND DATA STRUCTURES
const ASCIIRange = 126;
var keyReps = new Map();

//>>> VARIABLES FOR KEYBOARD KEYS VIZ
var keyLettWide = 40;
var keyLettTall = 40;
var keyLettOffs = 10; // offset between keys

function setup(){
  createCanvas(800,300).parent("viz");
  initKeyReps();
}

function draw(){
  background(60);
  stroke(255);
  dispKeyReps();
}

function dispKeyReps(){
  keyReps.forEach((value, key) => {value.display();}); // hey a Lambda!
}

function keyPressed(){
  keyInfoToConsole();
  if(keyReps.get(keyCode)){keyReps.get(keyCode).toggleViaKB();}
  return false;
}

function keyReleased(){
  if(keyReps.get(keyCode)){if(keyCode!=20){keyReps.get(keyCode).toggleViaKB();}}
  return false;
}

function mousePressed(){
  if (mouseInCanvas()){keyReps.forEach((k) => k.onMousePressed());}
}

function mouseReleased(){
  if (mouseInCanvas()){keyReps.forEach((k) => k.releaseViaMouse());}
}

/*----------------------------------------------------------------------
|>>> Function keyInfoToConsole 
+-----------------------------------------------------------------------
| Description: Prints the following to console:
|               > keyCode (P5JS managed global int)
|               > key     (P5JS managed global char)
|               > dec     (decimal ASCII WRT aforementioned 'key')
|               > hex     (hexadecimal ASCII WRT aforementioned 'key')
+-----------------------------------------------------------------------
| Implementation Notes:
|  > Added 2/3/22
+---------------------------------------------------------------------*/
var spart = "]\n";
function keyInfoToConsole(){
  let decK = unchar(key);
  if (decK==undefined){decK = keyCode;}
  let hexK = hex(decK);
  if (hexK.startsWith("0000")){hexK = hexK.substring(4);}
  console.log("keyCode: ["+keyCode+spart+"    key: ["+key+spart+"    dec: ["+decK+spart+"    hex: ["+hexK+"]");  
} // Ends Function keyInfoToConsole