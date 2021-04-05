


/*
>>> VARIABLES >>>
  - numTeeth: Number of teeth in the gear (i.e. formed via polygon sides) 
  - lenTeeth: Length of the gear's teeth (i.e. outward from polygon sides)
  - polydiam: Diameter of polygon from whose edges teeth will be generated
  - landPctBot: Percent of edge length to place bottom landing vertices
  - landPctTop: Percent of edge length to place bottom landing vertices
  - nGonShape:  List of polygon edges, from which teeth will be generated
  - teethParts: List of teeth edges, for each tooth (yeah, wording...)
*/
class Gear{

  constructor(pos, nTeeth, lTooth, polyDiam, lPctBot, lPctTop){
    // gear's shape state
    this.pos        = pos;
    this.numTeeth   = nTeeth;
    this.toothLen   = lTooth;
    this.polyDiam   = polyDiam;
    this.landPctBot = lPctBot;
    this.landPctTop = lPctTop;
    this.nGonShape  = this.createNgon(this.numTeeth,this.polyDiam,0);
    this.nGonInside = this.createNgon(this.numTeeth,20,0);
    this.teethParts = this.generateTeeth();

    // gear's rotation state
    this.isRotating = true;
    this.rotVal = 0;
    this.rotSpeed = 0.25;

    // gfx triggers
    this.showPolyEdges = false;

    // color settings
    this.col_gear = color(0,24,120);
    this.col_edge = color(255,60,0);

  }

  //######################################################################
  //>>> FUNCTIONS FOR 'MINI-CONSTRUCTOR' SETTERS
  //######################################################################

  setNumTeeth(nTeeth){
    if(nTeeth<4 || nTeeth>32){return;} // bounds (QAD hardcoded, but #YOLO) 
    this.numTeeth   = nTeeth;
    this.resetShapes();
  }

  setPolyDiam(diam){
    if(diam < 120 || diam>width){return;} // bounds (QAD hardcoded, but #YOLO)
    this.polyDiam   = diam;
    this.resetShapes();
  }

  setToothLen(lTooth){
    if(lTooth < 120 || lTooth>width){return;} // bounds (QAD hardcoded, but #YOLO)
    this.toothLen   = lTooth;
    this.resetShapes();
  }

  setBotLandPct(pct){
    if(pct < 0 || pct>= this.landPctTop){return;} // should NEVER be >= top landing %
    this.landPctBot   = pct;
    this.resetShapes();
  }

  setTopLandPct(pct){
    if(pct < this.landPctBot || pct> 1){return;} // should NEVER be < bottom landing %
    this.landPctTop   = pct;
    this.resetShapes();
  }

  resetShapes(){
    this.nGonShape  = this.createNgon(this.numTeeth,this.polyDiam,0);
    this.nGonInside = this.createNgon(this.numTeeth,20,0);
    this.teethParts = this.generateTeeth();
  }

  setRotSpeed(speed){
    // Warning - Invalid values not handled!
    this.rotSpeed = speed;
  }

  setShowPolyEdges(){
    this.showPolyEdges = !this.showPolyEdges;
  }


  //######################################################################
  //>>> FUNCTIONS FOR GENERATING SHAPES
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
  createNgon(numSides,radius,rotOff){
    var degPerPt = 360/numSides;
    var curDeg   = 0;
    var verts    = [];

    for (var i=0; i<numSides; i++) {
      verts.push(this.degRadToCoord(curDeg,radius,rotOff));
      curDeg += degPerPt;
    }

    return verts;
  }

  // Returns point that is on a circle of <radius> at angle <degree+degOff> WRT circle center at world origin
  degRadToCoord(degree, radius, degOff = 270){
    return createVector(
      (radius * cos(radians(degOff+degree))),
      (radius * sin(radians(degOff+degree)))
    );
  }


  generateTeeth(){
    let teeth = [];
    let nSides = this.nGonShape.length; // caching because used in code 3x
    for (var i = 0; i < nSides; i++) {
      teeth.push(
        this.generateTooth(
          this.nGonShape[i],
          this.nGonShape[(i+1)%nSides]
        )
      );
    }
    return teeth;
  }


  generateTooth(ptS, ptE){
    // angle outward from ngon edge that is tangent to intersect. of this edge and previous edge
    var footAngle = 180/this.numTeeth;
    var tLandPct = (1-this.landPctTop)/2;
    var bLandRad = lerp(0,p5.Vector.dist(ptS,ptE),(this.landPctBot/2));

    stroke(0,240,24);
    line(ptS.x,ptS.y,ptE.x,ptE.y);

    //>>> Angle of segment [ptS,ptE]. Needed to create bot landing verts
    var lineSlopeAngle = degrees(createVector(ptE.x-ptS.x,ptE.y-ptS.y).normalize().heading());

    //>>> Point of length toothTall perpendicular to segment [ptS,ptE]. Needed to create top landing verts
    var perpSlopePoint = createVector(-1*(ptE.y-ptS.y),ptE.x-ptS.x).setMag(-this.toothLen);

    //>>> 'Left' and 'Right' Bottom Landing Half-Segment Vertices
    var lBotVert = this.degRadToCoord( -footAngle  ,bLandRad, lineSlopeAngle).add(ptS);
    var rBotVert = this.degRadToCoord( (180+footAngle) ,bLandRad,lineSlopeAngle).add(ptE);

    //>>> 'Left' and 'Right' Top Landing Vertices
    var lTopVert = p5.Vector.lerp(ptS,ptE,tLandPct).add(perpSlopePoint);
    var rTopVert = p5.Vector.lerp(ptS,ptE,1-tLandPct).add(perpSlopePoint);

    // Ordering is contiguous vert-to-vert i.e. 'can be used for SVG-style path shape'
    return {
      "initVert" : ptS,
      "lBotVert" : lBotVert,
      "lTopVert" : lTopVert,
      "rTopVert" : rTopVert,
      "rBotVert" : rBotVert,
      "exitVert" : ptE
    }
  } // Ends Function generateTooth


  //######################################################################
  //>>> FUNCTIONS FOR DISPLAYING POLYGON AND GEAR TEETH
  //######################################################################

  drawGearShape(){
    push();
      translate(this.pos.x, this.pos.y);

      if(this.isRotating){  
        rotate(radians(this.rotVal));
        this.rotVal = (this.rotVal+this.rotSpeed)%360;
      }

      this.drawNgonShape();
      this.drawTeeth();
    pop();
  } // Ends Function drawGearShape

  drawNgonShape(){
    if(this.showPolyEdges){stroke(this.col_edge);}
    else{stroke(this.col_gear);}
    fill(this.col_gear);

    beginShape();
      for (var i = 0; i < this.nGonShape.length; i++) {
        vertex(this.nGonShape[i].x, this.nGonShape[i].y);
      }
      beginContour();
        for (var j = this.nGonInside.length-1; j>=0; j--) {
          vertex(this.nGonInside[j].x, this.nGonInside[j].y);
        }
      endContour();
    endShape(CLOSE);
  } // Ends Function drawNgonShape

  drawTeeth(){
    let nSides = this.nGonShape.length; // caching because used in code 3x

    if(this.showPolyEdges){stroke(this.col_edge);}
    else{stroke(this.col_gear);}
    fill(this.col_gear);

    for (var i = 0; i < nSides; i++) {
      this.drawTooth(this.teethParts[i]);
    }
  } // Ends Function drawTeeth

  drawTooth(t){
    beginShape();
      vertex(t.initVert.x,t.initVert.y);
      vertex(t.lBotVert.x,t.lBotVert.y);
      vertex(t.lTopVert.x,t.lTopVert.y);
      vertex(t.rTopVert.x,t.rTopVert.y);
      vertex(t.rBotVert.x,t.rBotVert.y);
      vertex(t.exitVert.x,t.exitVert.y);
    endShape(CLOSE); 
  } // Ends Function drawTooth

} // Ends Class Gear