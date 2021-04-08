/*======================================================================
|###### (OIC/OID) Vigil : Broadgate | Special Task : Spellbreaker ######
+-----------------------------------------------------------------------
|>>> Bezier Point Demo 01 (2/17/21)
+=====================================================================*/


var bez;

function setup(){
  var canvas = createCanvas(900, 600);
  canvas.parent("viz");
  initUI();

  bez = new QuadBezier();

}


function draw(){

  background(240);
  drawCanvasBorder();

  bez.drawStuff();

}

function drawCanvasBorder(){
  strokeWeight(4); stroke(60); noFill();
  rect(0,0,width,height);
}


//######################################################################
//>>> MOUSE UI CODE (AND RESP. UTILS)
//######################################################################

function mousePtToVec(){return createVector(mouseX, mouseY);}
function mouseInCircle(pt, diam){return (p5.Vector.dist(mousePtToVec(), pt) < (diam/2));}
function mouseInCanvas(){return (mouseX > 0) && (mouseY > 0) && (mouseX < width) && (mouseY < height);}

/*----------------------------------------------------------------------
|>>> Mouse Action Handlers
+-----------------------------------------------------------------------
| Notes: > could define setter in Bezier parent class to set value of
|          'selPtIndex' (per OOP modularity), but KISS for now.
|        > could also define corresponding getter, for that matter...
|        > see additional in-line comments for other 'TODO's
+---------------------------------------------------------------------*/
function mousePressed(){
  if(mouseInCanvas() && mouseButton === LEFT){
    // all of this this could [should] be a Bezier (parent class) method!
    for(let i=0; i<bez.cPts.length; i++){
      if(mouseInCircle(bez.cPts[i], bez.cpDiam)){
        bez.selPtIndex = i;
        return;
      }
    }
  }
}

function mouseReleased(){
  bez.selPtIndex = -1;
}

function mouseDragged(){
  if(mouseInCanvas() && mouseButton === LEFT && bez.selPtIndex != -1){  
    bez.updateCtrlPt(mousePtToVec());
  }
}

//######################################################################
//>>> BUTTON UI CODE (AND RESP. UTILS)
//######################################################################

var UI_quadButton, UI_cubeButton, UI_qsigButton;

function initUI(){
  UI_quadButton = createButton("Quadratic Bezier").parent("ui").mousePressed(UIhand_loadQuad);
  UI_cubeButton = createButton("\'Sigmoid\' Bezier").parent("ui").mousePressed(UIhand_loadQsig);
  UI_qsigButton = createButton("Cubic Bezier").parent("ui").mousePressed(UIhand_loadCube);
}

// could use lambdas -vs- function def's, but K.I.S.S. and #YOLO for now
function UIhand_loadQuad(){bez = new QuadBezier();}
function UIhand_loadCube(){bez = new CubicBezier();}
function UIhand_loadQsig(){bez = new SigmoidBezier();}