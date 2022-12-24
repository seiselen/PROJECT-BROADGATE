class BuildButton{
  constructor(pos,dim){
    this.pos = pos;
    this.dim = dim;
    this.ePt = createVector(this.pos.x+this.dim.x,this.pos.y+this.dim.y);
    this.mid = p5.Vector.mult(this.dim,0.5);
    this.edgeInfo; // cache current edge point info
    this.cAlpha = 64; // max alpha for circle anim
    this.cAlHlf = this.cAlpha/2;
    this.cFSpeed = 60;
  }

  render(){
    noStroke();fill(0,0,84);rect(0,0,this.dim.x,this.dim.y);

    this.edgeInfo = this.ptOnRectViaDeg();

    if(bldgProgress<1){
      fill(255,this.cAlpha);
      beginShape();
        vertex(this.edgeInfo[1].x,this.edgeInfo[1].y);
        if(this.edgeInfo[0] == 1 || this.edgeInfo[0] == 2 && this.edgeInfo[1].x > this.mid.x){
          vertex(this.ePt.x,this.pos.y);vertex(this.ePt.x,this.ePt.y);vertex(this.pos.x,this.ePt.y);
        } 
        else if(this.edgeInfo[0] == 4){
          vertex(this.pos.x,this.ePt.y);
        }
        vertex(this.pos.x,this.pos.y);
        vertex(this.mid.x,this.pos.y);
        vertex(this.mid.x,this.mid.y);
      endShape();
    }
    else{
      fill(255,lerp(this.cAlpha,this.cAlHlf,((frameCount-bldgDoneFrame)%this.cFSpeed)/this.cFSpeed));
      rect(0,0,this.dim.x,this.dim.y);
      strokeWeight(1);stroke(255,180);
      textAlign(CENTER,CENTER); textSize(48);
      text("CONSTRUCTION\nCOMPLETE",this.mid.x,this.mid.y);
    }
  } // Ends Function render

  /*--------------------------------------------------------------------
  |>>> Function ptOnRectViaDeg 
  +---------------------------------------------------------------------
  | Source: stackoverflow.com/questions/4061576/       (original source)
  | Author: Steven Eiselen, Eiselen Laboratories       (changes thereto)
  +---------------------------------------------------------------------
  | Description: Computes the intersection point of a rectangle (defined 
  |              by this object) with a ray (defined by some degree of a
  |              circle cast at the rectangle's midpoint); returning the
  |              point as well as region where the intersection occured.
  | Input Vars:  > this.dim:     p5.Vector where {x,y}->{width,height}
  |                [State Var]   of rectangle encompassing a BuildButton
  |              > bldgProgress: value in range [0.0,1.0] of something
  |                [Global Var]  currently 'under construction'
  | Local Vars:  > angT = angle of theta (WRT bldgProgress %)
  |              > angR = angle of ray   (WRT bounding rect)
  | Output:      > 2D Array composed of:
  |                  [0] - intersection region (xor of set {1/2/3/4})
  |                  [1] - intersection point  (as p5.Vector)
  +---------------------------------------------------------------------
  | Implementation Notes:
  | > PI and TAU are constants of the p5js library, ergo if porting to
  |   another language/library: you may need to swap in their analogs
  |   [if/as applicable] (e.g. Math.PI, Math.TAU <or> 'TAU=Math.PI/2')
  | > (bldgProgress*360) factors 360 degree range by current progress
  |   factor. [90] is subtracted from it because we want to start the
  |   effect at the "12:00 position" i.e. midpoint of top rect edge
  | > There is some code repetition in 'Phase 3': but I believe that,
  |   compared to the original source, my augmentations are more...
  |    A) Efficient: e.g. reducing a tightly coupled 4-case switch and 
  |       if/else statement into a single 4-case switch statement; plus
  |       removing several variable definitions (beyond TAU and PI).
  |    B) Logically Succinct: i.e. allowed for significant reduction and
  |       simplification of code which formerly required cofactors as
  |       pos/neg modifiers, and/or turning "x += -1*(y)" into "x -= y"
  |   ...Though note that my intention is not to improve the original
  |   source: I'm simply a (recovering) pathetic fool when it comes to 
  |   my level of OCD towards reducing computation expense - Mea Culpa!
  | > This is one of those rare times when I'm not making much effort to
  |   fully understand this code (more than as-needed to customize for
  |   this use/implementation, at least). I also neatened and optimized
  |   it as best as reasonably/non-OCD possible.
  +-------------------------------------------------------------------*/
  ptOnRectViaDeg() {
    let reg  = -1;    
    let angR = Math.atan2(this.dim.x, this.dim.y); 
    let angT = ((bldgProgress*360)-90) * Math.PI / 180;
    
    while (angT < -PI){angT += TAU;} 
    while (angT >  PI){angT -= TAU;}

    if      (angT >   -angR && angT <= angR   ){reg = 1;} 
    else if (angT >    angR && angT <= PI-angR){reg = 4;} 
    else if (angT > PI-angR || angT <= angR-PI){reg = 3;} 
    else                                       {reg = 2;}

    switch (reg){
      case 1: return [reg,createVector(this.dim.x,(this.dim.y/2)+(this.dim.y/2)*Math.tan(angT))];
      case 2: return [reg,createVector((this.dim.x/2)-(this.dim.x/(2*Math.tan(angT))),0)];
      case 3: return [reg,createVector(0,(this.dim.y/2)-(this.dim.y/2)*Math.tan(angT))];
      case 4: return [reg,createVector((this.dim.x/2)+(this.dim.x/(2*Math.tan(angT))),this.dim.y)];
      default: return null;
    }
  } // Ends Function ptOnRectViaDeg

} // Ends Class BuildButton