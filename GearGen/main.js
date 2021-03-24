

var myNgon;


//>>> VARIABLES: GEAR OPTIONS (FOR UI/UX AND DOM MANIP.)
var g_nGearTeeth  = 6;    // # gear teeth (which is == # polygon sides)
var g_intPolyDiam = 180;  // interior diameter of polygon (i.e. sans gear teeth)
var g_toothLength = 128;  // length of gear teeth (?TODO: base it on % edge length instead?)
var g_botLandPct  = 0.25; // % of edge length to place bottom landing vertices
var g_topLandPct  = 0.50; // % of edge length to place bottom landing vertices

//>>> VARIABLES: Q.A.D. GEAR ROTATION ANIM
var rotAnmVal = 0;
var rotSpdVal = 0.25;




function setup(){
  createCanvas(640,640).parent("viz");

  initUI();


  myNgon = createNgon(g_nGearTeeth,g_intPolyDiam,0);




}


function draw(){

  background(240);
  drawCanvasBorder();

  drawNgonShape(myNgon,width/2,height/2);


  translate(width/2,height/2);
  //doRotate();
  drawTeeth(myNgon,g_botLandPct,g_topLandPct,g_toothLength);

}




// tLandWide will be as % of width of line seg formed by {ptS,ptE}
// footAngle is angle outward from polygon edge that is tangent to this edge and previous
function generateTooth(ptS, ptE, bLandWide, tLandWide, toothTall, numSides){

  var footAngle = 180/numSides;
  var tLandPct = (1-tLandWide)/2;
  var bLandRad = lerp(0,p5.Vector.dist(ptS,ptE),(bLandWide/2));

  stroke(0,240,24);
  line(ptS.x,ptS.y,ptE.x,ptE.y);

  //>>> Angle of segment [ptS,ptE]. Needed to create bot landing verts
  var lineSlopeAngle = degrees(createVector(ptE.x-ptS.x,ptE.y-ptS.y).normalize().heading());

  //>>> Point of length toothTall perpendicular to segment [ptS,ptE]. Needed to create top landing verts
  var perpSlopePoint = createVector(-1*(ptE.y-ptS.y),ptE.x-ptS.x).setMag(-toothTall);

  //>>> 'Left' and 'Right' Bottom Landing Half-Segment Vertices
  var lBotVert = degRadToCoord( -footAngle  ,bLandRad, lineSlopeAngle).add(ptS);
  var rBotVert = degRadToCoord( (180+footAngle) ,bLandRad,lineSlopeAngle).add(ptE);

  //>>> 'Left' and 'Right' Top Landing Vertices
  var lTopVert = p5.Vector.lerp(ptS,ptE,tLandPct).add(perpSlopePoint);
  var rTopVert = p5.Vector.lerp(ptS,ptE,1-tLandPct).add(perpSlopePoint);

  // Ordering is contiguous vert-to-vert i.e. 'can be used for SVG path shape'
  return {
    "initVert" : ptS,
    "lBotVert" : lBotVert,
    "lTopVert" : lTopVert,
    "rTopVert" : rTopVert,
    "rBotVert" : rBotVert,
    "exitVert" : ptE
  }

}



function drawTeeth(ngon,bLandPct,tLandPct,tTall){
  let nSides = ngon.length; // caching because used in code 3x
  for (var i = 0; i < nSides; i++) {
    drawTooth(generateTooth(myNgon[i],myNgon[(i+1)%nSides],bLandPct,tLandPct,tTall,nSides));
  }
}

function drawTooth(t){
  stroke(240,120,0);

  line(t.initVert.x,t.initVert.y,t.lBotVert.x,t.lBotVert.y);
  line(t.lBotVert.x,t.lBotVert.y,t.lTopVert.x,t.lTopVert.y);
  line(t.lTopVert.x,t.lTopVert.y,t.rTopVert.x,t.rTopVert.y);
  line(t.rTopVert.x,t.rTopVert.y,t.rBotVert.x,t.rBotVert.y);
  line(t.rBotVert.x,t.rBotVert.y,t.exitVert.x,t.exitVert.y);  

}







function drawNgonShape(shapeArr,xOff,yOff){

  fill(0,24,120); stroke(0,180,240); // hardcoded for now...

  push();
    translate(xOff,yOff);
    beginShape();
      for (var i = 0; i < shapeArr.length; i++) {
        vertex(shapeArr[i].x, shapeArr[i].y);
      }
    endShape(CLOSE);
  pop();

  // QAD "proof" that shape is centered in local space as well as global space WRT (xOff,yOff)
  ellipse(xOff,yOff,10,10);
}



//######################################################################
//>>> FUNCTIONS FOR GENERATING N-GONS
//######################################################################

/*----------------------------------------------------------------------
|>>> Function createNgon
+-----------------------------------------------------------------------
| Purpose:   This function will create and return an n-gon (i.e. polygon 
|            of 'n' many sides) as defined by a bounding circle radius.
| Algorithm: This function uses the 'circumscribed circle' technique to 
|            generate n-gons, whose general algorithm is as follows:
|              > Distribute 'n' points equally around a circle
|              > Construct lines from point-to-point around the circle 
+-----------------------------------------------------------------------
| Implementation Notes:
|  > This function uses the 'circumscribed circle' technique to generate
|    n-gons, whose general algorithm is as follows:
|      1) Distribute 'n' points equally around a circle of some radius
|      2) Construct a line between each point and its adjacent neighbor
|         around the circle (i.e. each point to clockwise neighbor WLOG)
|      3) The resulting polyline thereof will compose the n-gon shape!
+=====================================================================*/
function createNgon(numSides,radius,rotOff){

  var degPerPt = 360/numSides;
  var curDeg   = 0;
  var verts    = [];

  for (var i=0; i<numSides; i++) {
    verts.push(degRadToCoord(curDeg,radius,rotOff));
    curDeg += degPerPt;
  }

  return verts;

}

// "point that is on circle of <radius> at <degree+degOff> degrees WRT circle center at world origin (0,0)"
function degRadToCoord(degree, radius, degOff = 270){
  return createVector(
    (radius * cos(radians(degOff+degree))),
    (radius * sin(radians(degOff+degree)))
  );
}


//######################################################################
//>>> UI/UX CODE SPECIFIC TO THIS DEMO
//######################################################################



var UI_nGearTeeth;
var UI_intPolyDiam;

function initUI(){
  UI_nGearTeeth  = createSlider(4, 12).style('width', '80px').parent("ui").changed(handleUI_nGearTeeth);
  UI_intPolyDiam = createSlider(120, 240).style('width', '80px').parent("ui").changed(handleUI_intPolyDiam);

}

function handleUI_nGearTeeth(){
  g_nGearTeeth = UI_nGearTeeth.value();
  myNgon = createNgon(g_nGearTeeth,g_intPolyDiam,0);
}

function handleUI_intPolyDiam(){
  g_intPolyDiam = UI_intPolyDiam.value();
  myNgon = createNgon(g_nGearTeeth,g_intPolyDiam,0);
}




//######################################################################
//>>> MOUSE UI CODE AND OTHER UTILS
//######################################################################

function mousePtToVec(){
  return createVector(mouseX, mouseY);
}

function mouseInCircle(pt, diam){
  return (p5.Vector.dist(mousePtToVec(), pt) < (diam/2));
}

function mousePtWithinCanvas(){
  return (mouseX > 0) && (mouseY > 0) && (mouseX < width) && (mouseY < height); 
}

function drawCanvasBorder(){
  strokeWeight(4); stroke(60); noFill();
  rect(0,0,width,height);
}

//>>> NOTE: - requires variables to be global and declared! 
//          - will be applied to whoever called it AND ALL STUFF THEREAFTER FOR REST OF FRAME!
function doRotate(){
  rotate(radians(rotAnmVal));
  rotAnmVal = (rotAnmVal+rotSpdVal)%360;
}