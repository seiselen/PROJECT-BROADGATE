/*----------------------------------------------------------------------
|>>> Class SPAgent            ([S]patial [P]artitioning Capable [Agent])
+---------------------------------------------------------------------*/
class SPAgent{
  static minSpeed = 1;
  static maxSpeed = 2;
  static maxForce = 0.15;
  static bodyDiam = 16;
  static maxScore = 100;

  static useScore = true;
  static scoreAgt = 3;
  static scoreObs = 2;
  static scoreWal = 1;
  static coolPcnt = 0.02;
  static coolDelF = 6;

  constructor(pos,ID,map){
    this.ID  = ID;
    this.map = map; // caching for modularity purposes
    this.pos = pos;
    this.vel = p5.Vector.random2D().setMag(random(SPAgent.minSpeed,SPAgent.maxSpeed));
    this.acc = vec2();

    //>>> Variables for SP/Neighbors
    this.curCoord = map.cellViaPos(this.pos);
    this.rangeRad  = 38; // visibility range radius
    this.rangeDiam = this.rangeRad*2;
    this.rangeRadSqd  = this.rangeRad*this.rangeRad;
    this.neighborList = [];
    this.inRangeCells = this.getCellsInRange();

    //>>> Variables for Collision Score
    this.collideScore = 0;

    //>>> Variables for GFX/VFX
    this.shapeDiam   = SPAgent.bodyDiam;
    this.shapeDiamSq = this.shapeDiam*this.shapeDiam;
    this.shapeRad    = this.shapeDiam/2;
    this.shapeRadSq  = this.shapeRad*this.shapeRad;
    this.initColorPallete();
  } // Ends Constructor


  initColorPallete(){
    //>>> Generic Colormap
    this.fill_agt = color(32,255,32); 
    this.strk_agt = color(0,180);
    this.swgt_agt = 1;
    //>>> Collide Colormap
    this.colormap  = ["#1A9850","#66BD63","#A6D96A","#D9EF8B","#FFFFBF","#FEE08B","#FDAE61","#F46D43","#D73027"];
    this.colormap  = this.colormap.map(hexVal=>{return color(hexVal)}); 
    this.colMapLen = this.colormap.length-1;
  } // Ends Function initColorPallete


  update(){
    let sepForce = this.separate();
    let lzdForce = this.lazyDrift();

    if(sepForce.magSq()>0){
      lzdForce.mult(0.25);
    }

    this.applyForce(sepForce);
    this.applyForce(lzdForce);

    this.vel.add(this.acc);
    this.vel.limit(SPAgent.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.edgeBounce();
    this.updateSP();
    this.updateCooldown();
  }

  applyForce(force){
    this.acc.add(force);    
  }

  lazyDrift(){
    let steer = this.vel.copy();
    steer.limit(SPAgent.maxForce);
    return steer;
  }

  separate(){
    let steer = vec2();
    this.neighborList.forEach((n)=> steer.add(this.flee(n.pos)));
    return steer;
  }

  
  flee(tar){
    let des = p5.Vector.sub(tar,this.pos);
    let steer;
    let dSq = distSq(tar,this.pos);
    // diam -> 2x rad -> tar bounding circle touches my bound circle
    if(dSq<this.shapeDiamSq){
      this.onDidCollide('a');
      des.setMag(-SPAgent.maxSpeed);
      steer = p5.Vector.sub(des,this.vel);
      //steer.limit(SPAgent.maxForce);
      return steer;
    }
    return vec2();
  }


  updateSP(){
    if((frameCount%Config.updateOffset)!==(this.ID%Config.updateOffset)){return;}

    let newCoord = this.map.updatePos(this);
    if(newCoord != null){
      this.curCoord = newCoord; 
      this.inRangeCells = this.getCellsInRange();
    }
    this.getNeighborsInRangeViaSP();
  }

  /*--------------------------------------------------------------------
  |>>> Function edgeBounce
  +---------------------------------------------------------------------
  | Description: If the agent is out-of-bounds WRT the map world space,
  |              this function will 'repel' it back in-bounds via first
  |              reversing its velocity WRT the border[s] it collided 
  |              with, then applying one step of the new velocity to its
  |              position (which effectively does the same 'reflection'
  |              behavior as seen with the 'naive' old implementation).
  +---------------------------------------------------------------------
  | Implementation Note: 
  |  > This function is intended to be called AFTER applying velocity to 
  |    position (i.e. the reduced Euler Integration step).
  +-------------------------------------------------------------------*/
  edgeBounce(){
    switch(this.pos.x+this.shapeRad > this.map.dim.wide || this.pos.x-this.shapeRad < 0){
      case true: this.vel.x *= -1; this.onDidCollide('w'); case false: break;
    }
    switch(this.pos.y+this.shapeRad > this.map.dim.tall || this.pos.y-this.shapeRad < 0){
      case true: this.vel.y *= -1; this.onDidCollide('w'); case false: break;
    }
    this.vel.limit(SPAgent.maxSpeed);
    this.pos.add(this.vel);
  } // Ends Function edgeBounce


  //####################################################################
  //>>> SP-RELATED FUNCTIONS
  //####################################################################

  /*--------------------------------------------------------------------
  |>>> Function getCellsInRange
  +---------------------------------------------------------------------
  | Description: Returns array of cell coordinates that are within the 
  |              bounding square of the agent's range. While this will
  |              consequently 'overshoot' (i.e. misidentify) some cells
  |              for circle-shaped ranges, the number thereof is a small
  |              and acceptable constant (certainly at least for now).
  |              For Example: A bounding square of radius 5 cells from
  |              agent cell will encompass 121 total cells, of which 12
  |              corner cells will be erroneous.
  | Origin Note: This function derives from the analogous one in TD-P5JS
  |              (with refactoring for use with this project). However:
  |              this version FIXES A MAJOR BUG which is applicable to
  |              (thus of interest/benefit to) the TD-P5JS version; as 
  |              discussed in the relevant 'Implementation Note'.         
  +---------------------------------------------------------------------
  | Implementation Notes:
  |  > The definition of 'cellSpan' has changed from the TD-P5JS version
  |    which calls 'floor()': to the revision which calls 'ceil()'. This
  |    new version accurately encompasses the furthest 'out-degree' of
  |    cells which will fully contain the range of an object within ANY
  |    point of its cell; not just WRT it being at the midpoint thereof.
  |  > We now INCLUDE the cell that contains this agent, as unlike with
  |    the TD-P5JS version: this agent is mobile and now interested in 
  |    neighbors within its cell; ESPECIALLY if collision is turned off.
  +-------------------------------------------------------------------*/
  getCellsInRange(){
    let cellSpan = ceil(this.rangeRad/Config.CELL_SIZE);

    let r = this.curCoord[0]; let c = this.curCoord[1];

    let cells = [];

    for(let adjR = r-cellSpan; adjR <= r+cellSpan; adjR++){
      for(let adjC = c-cellSpan; adjC <= c+cellSpan; adjC++){
        cells.push([adjR,adjC]);
      }
    }

    return cells;
  } // Ends Function getCellsInRange


  getNeighborsInRangeViaSP(){
    this.neighborList = this.map.getUnitsInCells(this.inRangeCells).filter(u => (u.ID != this.ID && p5.Vector.sub(u.pos,this.pos).magSq() <= this.rangeRadSqd));
    // NOTE: The following is an alternate version utilizing distance formula --> filter(u => (u.ID != this.ID && this.pos.dist(u.pos) <= this.rangeRad));
  }


  // used to both increment (i.e. 'OnCollide') AND decrement (i.e. cooldown)
  updateCollideScore(amt){
    this.collideScore = constrain(this.collideScore+amt, 0, SPAgent.maxScore);
  }


  onDidCollide(evt){
    switch(evt){
      case 'a' : this.updateCollideScore(SPAgent.scoreAgt); return;
      case 'o' : this.updateCollideScore(SPAgent.scoreObs); return;
      case 'w' : this.updateCollideScore(SPAgent.scoreWal); return;
    }
  }

  updateCooldown(){
    if(frameCount%SPAgent.coolDelF==0){this.updateCollideScore(-this.collideScore*SPAgent.coolPcnt)}
  }

  mouseOverMe(){
    return (dist(mouseX,mouseY,this.pos.x,this.pos.y)<=this.shapeDiam) ? true : false;
  } // Ends Function mouseOverMe



  linMapCol(val){
    let vKey = val/(100/(this.colMapLen)); //=> key of pct from which to 'colerp'
    let idxL = floor(vKey); //=> index of left color on raw map
    let idxR = ceil(vKey); //=> index of right color on raw map
    let lPct = vKey-floor(vKey); //=> % by which to lerp between L and R colors
    return lerpColor(this.colormap[idxL],this.colormap[idxR],lPct);
  }
  
  logMapCol(val){
    val = min(((log(val+1)/log(10))*100)/2,100);
    let vKey = val/(100/(this.colMapLen)); //=> key of pct from which to 'colerp'
    let idxL = floor(vKey); //=> index of left color on raw map
    let idxR = ceil(vKey); //=> index of right color on raw map
    let lPct = vKey-floor(vKey); //=> % by which to lerp between L and R colors
    return lerpColor(this.colormap[idxL],this.colormap[idxR],lPct);
  }






  render(){
    strokeWeight(this.swgt_agt);

    switch(SPAgent.useScore){
      case false: fill(this.fill_agt); break;
      case true: fill(this.linMapCol(this.collideScore)); break;
    }

    stroke(this.strk_agt);
    ellipse(this.pos.x,this.pos.y,this.shapeDiam,this.shapeDiam);
  } // Ends Function render

} // Ends Class SPAgent