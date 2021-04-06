/*======================================================================
|###### (OIC/OID) Vigil : Broadgate | Special Task : Spellbreaker ######
+-----------------------------------------------------------------------
| Project: Demons Of Cyclic Space (2021 P5JS 'Broadgate Demo' Version)
| Author:  Steven Eiselen, University of Arizona
+-----------------------------------------------------------------------
| Description: Implements 'Demons of Cyclic Space' Cellular Automata in
|              JavaScript/browser via the P5JS library.
+-----------------------------------------------------------------------
| Implementation Notes:
|  > There are three versions of the 'display' method, as follows:
|    - display1() : Uses rect primitives. SLOW compared to Processing 
|                   counterpart! Thus wrote display2()...
|    - display2() : Uses p5js set method to set pixel colors such that
|                   it handles color channel values therein. While this
|                   method technically produces the highest FPS, it also
|                   staggers down to average FPS worse than display1()
|                   the moment that the user interacts with the browser
|                   window. I think this is due to such activating the
|                   browser's UI handling code, thus expending more CPU?
|                   In any case, thus wrote display3()...
|    - display3() : Directly manipulates p5js pixel array i.e. assigns
|                   values to each color, for each pixel. Despite this
|                   method encompassing my very first sextuple for loop
|                   (outside, perhaps, some PCG methods in Unity); it
|                   also [ironically?] produces the best average FPS.
+-----------------------------------------------------------------------
| Improvement Notes (per OIC 'Out Report' Procedure):
|  > The FPS issues do NOT appear to be caused by advancing the CA world
|    (via running FPS tests with the display[?]() call commented out);
|    thus seems to involve the work needed to render it to the screen. 
|    This makes me think the FPS can be further improved via refactoring 
|    the code to work with P5JS's Open-GL rendering mode. But as I never
|    worked with this mode, and to K.I.S.S. and get the code uploaded to
|    GitHub for archive/demo: I'll stop and reserve this task/experiment
|    for either future me else whoever else stumbles across this to try!
|  > Could add more UI i.e. change color mode, button-based reset, but
|    K.I.S.S. and YOLO for now...
+-----------------------------------------------------------------------
| Version Info:
|  > All previous versions (i.e. Java and Processing3) should have their
|    entries in the Processing .pde sketch version of this code, which
|    should be included in the GitHub repo.
|  > 4/5/21 - Refactored into p5js for uploading to GitHub for archive
|             and live demo purposes per [Operation : Broadgate].
|  > 4/6/21 - Implemented display3() for final successful improvement of
|             average FPS; cleaned code and prepared for GitHub publish.
*=====================================================================*/

//>>> VARIABLES
var cellsWide = 200;
var cellsTall = 100;
var cellPxDim = 4;

//>>> OBJECT DECLA'S
var cycCA;

//>>> GLOBAL TRIGGERS
var showFPS = false // change via inspector if needed - not for user manip.

function setup(){
  createCanvas(cellsWide*cellPxDim, cellsTall*cellPxDim).parent("viz");
  cycCA = new CyclicCA(cellsWide,cellsTall,cellPxDim);
}

function draw(){
  background(0);
  drawCanvasBorder();

  cycCA.advance();
  cycCA.display();

  if(showFPS){QADShowFPS();}
}

// Should let user know they can reset with 'r', but K.I.S.S. and get this code out!
function keyPressed(){
  if(key == 'r'){cycCA.reset();}
}

// Draws border around canvas, 'Nuff Said
function drawCanvasBorder(){
  strokeWeight(4); stroke(60); noFill();
  rect(0,0,width,height);
}

// QAD textbox showing rough FPS
function QADShowFPS(){
  noStroke();fill(0,0,0,128);
  rect(width-90,height-21,90,21);
  fill(255); stroke(0);
  textSize(18);
  text( ('FPS: '+frameRate()).substring(0,9),width-84,height-4);
}