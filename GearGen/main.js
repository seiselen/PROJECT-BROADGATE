

var myNgon;

var rotAnmVal = 0;
var rotSpdVal = 0.25;


function setup(){
  createCanvas(640,640);

  myNgon = createNgon(5,180,0);

}


function draw(){

  background(240);
  drawCanvasBorder();

  drawNgonShape(myNgon,width/2,height/2);


  translate(width/2,height/2);
  //doRotate();
  drawGearShape(myNgon,32,0.5,128);

}

function drawGearShape(ngon,bLandWide,tLandWide,toothTall){
  var numSides = ngon.length;

  for (var i = 0; i < numSides; i++) {
    drawTooth(myNgon[i],myNgon[(i+1)%numSides],0.25,0.5,128,numSides);
  }

}


// tLandWide will be as % of width of line seg formed by {ptS,ptE}
function drawTooth(ptS, ptE, bLandWide, tLandWide, toothTall, numSides){

  var footAngle = 180/numSides;

  var tLandPct = (1-tLandWide)/2;
  var bLandPct = (bLandWide)/2;

  var bLandRad = lerp(0,p5.Vector.dist(ptS,ptE),bLandPct);

  stroke(0,240,24);
  line(ptS.x,ptS.y,ptE.x,ptE.y);


  var normSlopeAngle = degrees(createVector(ptE.x-ptS.x,ptE.y-ptS.y).normalize().heading());

  // Vertex ID: Bottom Landing 'Left' Half-Segment
  var lBotLandHalf = degRadToCoord( -footAngle  ,bLandRad, normSlopeAngle).add(ptS);

  // Vertex ID: Bottom Landing 'Right' Half-Segment
  var rBotLandHalf = degRadToCoord( (180+footAngle) ,bLandRad,normSlopeAngle).add(ptE);


  // Get projection of point on line of length toothTall
  var lineSlopeVec = createVector(-1*(ptE.y-ptS.y),ptE.x-ptS.x).setMag(-toothTall);


  // Vertex forming left top landing segment pt
  var tLandPt1 = p5.Vector.lerp(ptS,ptE,tLandPct);
  tLandPt1.add(lineSlopeVec);

  // Vertex forming right top landing segment pt
  var tLandPt2 = p5.Vector.lerp(ptS,ptE,1-tLandPct);
  tLandPt2.add(lineSlopeVec);

  stroke(240,120,0);

  line(ptS.x,ptS.y,lBotLandHalf.x,lBotLandHalf.y);
  line(lBotLandHalf.x,lBotLandHalf.y,tLandPt1.x,tLandPt1.y);
  line(tLandPt1.x,tLandPt1.y,tLandPt2.x,tLandPt2.y);
  line(tLandPt2.x,tLandPt2.y,rBotLandHalf.x,rBotLandHalf.y);
  line(ptE.x,ptE.y,rBotLandHalf.x,rBotLandHalf.y);




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