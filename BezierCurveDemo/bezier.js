/*======================================================================
|###### (OIC/OID) Vigil : Broadgate | Special Task : Spellbreaker ######
+-----------------------------------------------------------------------
|>>> Bezier Class and QuadBezier/SigmoidBezier/CubicBezier child classes
+-----------------------------------------------------------------------
| Implementation Notes:
|  > (4/7/21) Getting this version out NOW because it works at/beyond
|    MVP satisfaction for the purposes of a Broadgate project per spec.
|    task Spellbreaker. There are improvement suggestions throughout the
|    code (mostly for improving OOP via putting more code in the parent
|    class): but I'm suspending refactoring thereto to get this uploaded
+=====================================================================*/


// DO NOT INSTANTIATE CURVES FROM THIS! If this was Java - it would be 

/*----------------------------------------------------------------------
|>>> [Parent] Class Bezier
+-----------------------------------------------------------------------
|Implementation Notes: 
|    - DO NOT INSTANTIATE OBJECTS OF THIS CLASS! It is meant to provide
|      state and behavior definitions common to all child types, and is
|      thus not meant for standalone instantiation! IOW: If this was in
|      Java: this class would be declared an Abstract Class! 
+---------------------------------------------------------------------*/
class Bezier{
  constructor(){
    this.cPts = []; // control points (see above comments for child-class semantics!)
    this.wPts = []; // waypoints (general WRT any kind of child class of this one)

    // For MouseUI (i.e. selecting pts)
    this.cpDiam = 20; // control point diameter (also used for rendering)

    // For Waypoints
    this.numWayPts = 16; // number of 'waypoints' to vizualize
    this.wayPtDiam = 10; // diameter of waypoints

    this.selPtIndex = -1; // index of selected point (i.e. by mouse), where [-1]-> nothing selected

    this.initBezPts();
    this.createWaypts();
  }

  drawCPts(){
    strokeWeight(2); stroke(0,60,255); fill(255,120,0);

    for(let i=0; i<this.cPts.length; i++){
      ellipse(this.cPts[i].x,this.cPts[i].y,this.cpDiam,this.cpDiam); 
    }
  }

  // I ...MIGHT... be able to do a staggered switch when all 3 child types are up!
  drawHandles(){
    strokeWeight(1); stroke(0,60,255);

    // i.e. Quadratic
    if(this.cPts.length == 3){
      line(this.cPts[0].x,this.cPts[0].y,this.cPts[1].x,this.cPts[1].y);  
    }
    // i.e. Sigmoid ('Twin Quadratic')
    else if(this.cPts.length == 5){
      line(this.cPts[0].x,this.cPts[0].y,this.cPts[3].x,this.cPts[3].y);
      line(this.cPts[2].x,this.cPts[2].y,this.cPts[4].x,this.cPts[4].y);
    }
    // i.e. Cubic
    else if(this.cPts.length == 4){
      line(this.cPts[0].x,this.cPts[0].y,this.cPts[1].x,this.cPts[1].y);
      line(this.cPts[2].x,this.cPts[2].y,this.cPts[3].x,this.cPts[3].y);
    }

  }

  drawWPts(){
    strokeWeight(1); stroke(255,120,0); fill(0,60,255);
    for (let i=0; i<this.wPts.length; i++){
      ellipse(this.wPts[i].x, this.wPts[i].y, this.wayPtDiam, this.wayPtDiam);
    }
  }

  drawCurve(){
    strokeWeight(2); stroke(255,108,0); noFill();
    beginShape();
      for (let i=0; i<this.wPts.length; i++){
        vertex(this.wPts[i].x, this.wPts[i].y);
      }
    endShape();
  }

  // yeah, yeah... but the name works for a MVP demo!
  drawStuff(){
    this.drawCurve();
    this.drawHandles();
    this.drawCPts();
    this.drawWPts();
  }

} // Ends Parent Class Bezier


/*----------------------------------------------------------------------
|>>> Class QuadBezier (extending Bezier)
+---------------------------------------------------------------------*/
class QuadBezier extends Bezier{
  constructor(){
    super();
  }


  //>>> Initializes Start/Ctrl/End points with arbitrary coords
  initBezPts(){
    this.cPts.push(createVector(50,50));
    this.cPts.push(createVector(50,height-50));
    this.cPts.push(createVector(width-50,height-50));
  }


  // this could be in parent class with 'getQuadBezPt' renamed 'getBezPt'
  createWaypts(){
    let wayPtDelta = 1.0/(this.numWayPts-1);
    for(let i=0; i<this.numWayPts; i++){
      this.wPts.push(this.getQuadBezPt(wayPtDelta*i));
    }
  }


  // this could be in parent class with 'getQuadBezPt' renamed 'getBezPt'
  resetWaypts(){
    let wayPtDelta = 1.0/(this.numWayPts-1);
    for(let i=0; i<this.numWayPts; i++){
      this.wPts[i].set(this.getQuadBezPt(wayPtDelta*i));
    }    
  }


  // could rename to 'getBezPt' so that all 3 child classes share same name.
  getQuadBezPt(amt){
    return createVector(
      ((1-amt)*(1-amt)*this.cPts[0].x)+(2*(1-amt)*amt*this.cPts[1].x)+(amt*amt*this.cPts[2].x),
      ((1-amt)*(1-amt)*this.cPts[0].y)+(2*(1-amt)*amt*this.cPts[1].y)+(amt*amt*this.cPts[2].y)
    );
  }


  // nothing special as with quad sigmoid (though a smooth [i.e. 'sigmoid'] cubic will follow thereto)
  updateCtrlPt(mouseVec){
    this.cPts[this.selPtIndex].set(mouseVec);
    this.resetWaypts(); // need to reset waypoints whenever ctrl point is moved
  }

} // Ends Class QuadBezier


/*----------------------------------------------------------------------
|>>> Class SigmoidBezier (extending Bezier)
+---------------------------------------------------------------------*/
class SigmoidBezier extends Bezier{
  constructor(){
    super();
  }


  /*--------------------------------------------------------------------
  |>>> Implementation Note: 
  |    - A sigmoid bezier curve is composed of 2 quadratic bezier curves
  |      such that they share an endpoint with each other that is their
  |      midpoint; i.e. the midpoint between the endpoints of a sigmoid 
  |      bezier curve is the other endpoint for the two quadratic bezier
  |      curves which compose it.
  |
  |      Thus, for sigmoid curve endpoints {pE,qE}, their midpoint {m},
  |      and their handle-points {pH,qH}. The ordering of elements in
  |      'cPts' will thus be as follows: {pE,m,qE,pH,qH}.
  |
  |    - Also again: using arbitrary values for now, though still WRT
  |      the canvas' width and height: so likely OK as default values! 
  +-------------------------------------------------------------------*/
  initBezPts(){
    // a bit overboard, but enables 'off' as a hyperparam and makes code cleaner 
    let off = 50;
    let offR = width-off;
    let offB = height-off;
    let hWid = width/2;
    let hHig = height/2;
    let x_pH  = lerp(off,hWid,0.5);
    let x_qH  = lerp(hWid, offR,0.5);

    this.cPts.push(createVector(off,hHig));  // {pE}
    this.cPts.push(createVector(hWid,hHig)); // {m}
    this.cPts.push(createVector(offR,hHig)); // {qE}

    this.cPts.push(createVector(x_pH,off));  // {pH}
    this.cPts.push(createVector(x_qH,offB)); // {qH}
  }


  createWaypts(){
    let wayPtDelta = 1.0/(this.numWayPts-1);
    for(let i=0; i<this.numWayPts; i++){
      this.wPts.push(this.getSigBezPt(wayPtDelta*i));
    }
    // start at i==1 because i==0 already created above
    for(let i=1; i<this.numWayPts; i++){
      this.wPts.push(this.getSigBezPt(-1*wayPtDelta*i));
    }
  }


  updateCtrlPt(mouseVec){
    // if midpoint -> translate handles WRT its translation
    if(this.selPtIndex == 1){

      let diffCp4 = p5.Vector.sub(this.cPts[4],this.cPts[1]);
      let diffCp3 = p5.Vector.sub(this.cPts[3],this.cPts[1]);

      this.cPts[4].set(diffCp4.add(mouseVec));
      this.cPts[3].set(diffCp3.add(mouseVec));
      this.cPts[1].set(mouseVec);
    }

    // if handle-point -> orient its counterpart such that both form linear bisector of {m}
    // This is a QAD way of keeping the handle-points 'smooth' WRT each other.
    else if(this.selPtIndex == 3){
      this.cPts[this.selPtIndex].set(mouseVec);
      this.cPts[4] = p5.Vector.lerp(this.cPts[3],this.cPts[1],2);
    }
    else if(this.selPtIndex == 4){
      this.cPts[this.selPtIndex].set(mouseVec);
      this.cPts[3] = p5.Vector.lerp(this.cPts[4],this.cPts[1],2);
    }

    else{
      this.cPts[this.selPtIndex].set(mouseVec);
    }

    this.resetWaypts(); // need to reset waypoints whenever ctrl point is moved
  }


  resetWaypts(){
    // QAD for now - change to setting vector vals when working!
    this.wPts = [];
    this.createWaypts();
  }


  getSigBezPt(amt){
    if(amt>=0){
      return createVector(
        ((1-amt)*(1-amt)*this.cPts[0].x)+(2*(1-amt)*amt*this.cPts[3].x)+(amt*amt*this.cPts[1].x),
        ((1-amt)*(1-amt)*this.cPts[0].y)+(2*(1-amt)*amt*this.cPts[3].y)+(amt*amt*this.cPts[1].y)
      );      
    } 
    else{
      amt *= -1;
      return createVector(
        ((1-amt)*(1-amt)*this.cPts[1].x)+(2*(1-amt)*amt*this.cPts[4].x)+(amt*amt*this.cPts[2].x),
        ((1-amt)*(1-amt)*this.cPts[1].y)+(2*(1-amt)*amt*this.cPts[4].y)+(amt*amt*this.cPts[2].y)
      );
    }
  }

} // Ends Class SigmoidBezier


/*----------------------------------------------------------------------
|>>> Class CubicBezier (extending Bezier)
+---------------------------------------------------------------------*/
class CubicBezier extends Bezier{
  constructor(){
    super();
  }


  initBezPts(){
    // a bit overboard, but enables 'off' as a hyperparam and makes code cleaner 
    let off = 50;
    let offR = width-off;
    let offB = height-off;
    let x_pH  = width*0.25; // (w/4)
    let x_qH  = 3*x_pH;     // i.e. 3*(w/4) i.e. 3/4

    this.cPts.push(createVector(x_pH,offB));  // {pE}
    this.cPts.push(createVector(off,off));  // {pH}

    this.cPts.push(createVector(offR,off));  // {qE}
    this.cPts.push(createVector(x_qH,offB)); // {qH}
  }


  createWaypts(){
    let wayPtDelta = 1.0/(this.numWayPts-1);
    for(let i=0; i<this.numWayPts; i++){
      this.wPts.push(this.getCubeBezPt(wayPtDelta*i));
    }
  }


  // nothing special as with quad sigmoid (though a smooth [i.e. 'sigmoid'] cubic will follow thereto)
  updateCtrlPt(mouseVec){
    this.cPts[this.selPtIndex].set(mouseVec);
    this.resetWaypts(); // need to reset waypoints whenever ctrl point is moved
  }


  resetWaypts(){
    let wayPtDelta = 1.0/(this.numWayPts-1);
    for(let i=0; i<this.numWayPts; i++){
      this.wPts[i].set(this.getCubeBezPt(wayPtDelta*i));
    }
  }


  getCubeBezPt(amt){
    return createVector(
      (((1-amt)*(1-amt)*(1-amt)*this.cPts[0].x) + ((3*amt)*(1-amt)*(1-amt)*this.cPts[1].x) + ((3*amt*amt)*(1-amt)*this.cPts[2].x) + (amt*amt*amt*this.cPts[3].x)),
      (((1-amt)*(1-amt)*(1-amt)*this.cPts[0].y) + ((3*amt)*(1-amt)*(1-amt)*this.cPts[1].y) + ((3*amt*amt)*(1-amt)*this.cPts[2].y) + (amt*amt*amt*this.cPts[3].y))
    );
  }

} // Ends Class CubicBezier