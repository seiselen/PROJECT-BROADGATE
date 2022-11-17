/*----------------------------------------------------------------------
|>>> Class SPAgent            ([S]patial [P]artitioning Capable [Agent])
+---------------------------------------------------------------------*/
class SPAgent{
  static minSpeed = 1;
  static maxSpeed = 2;
  static maxForce = 0.15;

  constructor(pos,ID,map){
    this.ID  = ID;
    this.map = map; // caching for modularity purposes
    this.pos = pos;
    this.vel = p5.Vector.random2D().setMag(random(SPAgent.minSpeed,SPAgent.maxSpeed));
    this.acc = vec2();

    //>>> Variables for SP/Neighbors
    this.curCoord = map.cellViaPos(this.pos);
    this.rangeRad  = 75; // visibility range radius
    this.rangeDiam = this.rangeRad*2;
    this.rangeRadSqd  = this.rangeRad*this.rangeRad;
    this.neighborList = [];
    this.inRangeCells = this.getCellsInRange();

    //>>> Variables for GFX/VFX
    this.shapeDiam   = 32;
    this.shapeDiamSq = this.shapeDiam*this.shapeDiam;
    this.shapeRad    = this.shapeDiam/2;
    this.shapeRadSq  = this.shapeRad*this.shapeRad;
    this.initColorPallete();
  } // Ends Constructor


  initColorPallete(){
    //>>> Colors for Full-Opaque Mode
    this.fill_fullOpq_agt = color(32,255,32); 
    this.strk_fullOpq_agt = color(60);
    this.fill_fullOpq_nbr = color(255,180,0);
    this.strk_fullOpq_nbr = color(255,0);
    this.strk_fullOpq_rad = color(32,255,32);
    //>>> Good Ol 'Error Magenta'
    this.col_Error        = color(255,0,255);    
  } // Ends Function initColorPallete\


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
    if(dSq<this.shapeDiamSq){ // diam -> 2x rad -> tar bounding circle touches my bound circle             
      des.setMag(-SPAgent.maxSpeed);
      steer = p5.Vector.sub(des,this.vel);
      //steer.limit(SPAgent.maxForce);
      return steer;
    }
    return vec2();
  }



  updateSP(){
    if(!SPFrmOff.canUpdate(this.ID)){return;}

    if(Config.isGridMode()){
      let newCoord = this.map.updatePos(this);
      if(newCoord != null){
        this.curCoord = newCoord; 
        this.inRangeCells = this.getCellsInRange();
      }
      this.getNeighborsInRangeViaSP();
    }
    else{
      this.getNeighborsInRangeNaive();
    }
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
    this.vel.x *= (this.pos.x+this.shapeRad > this.map.dim.wide || this.pos.x-this.shapeRad < 0) ? -1: 1;
    this.vel.y *= (this.pos.y+this.shapeRad > this.map.dim.tall || this.pos.y-this.shapeRad < 0) ? -1: 1;
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

  // Yes, is QAD and directly calls global array - it's late and I'm tired...
  getNeighborsInRangeNaive(){
    this.neighborList = agents.filter(u => (u.ID != this.ID && p5.Vector.sub(u.pos,this.pos).magSq() <= this.rangeRadSqd));
  }

  mouseOverMe(){
    return (dist(mouseX,mouseY,this.pos.x,this.pos.y)<=this.shapeDiam) ? true : false;
  } // Ends Function mouseOverMe

  /*====================================================================
  |>>> RENDER FUNCTIONS
  +===================================================================*/
  render(){
    this.renderNeighborhood(); this.renderAgent();
  }

  renderAgent(){
    strokeWeight(2);
    fill(this.fill_fullOpq_agt);
    stroke(this.strk_fullOpq_agt);
    ellipse(this.pos.x,this.pos.y,this.shapeDiam,this.shapeDiam);
  } // Ends Function renderAgent

  renderNeighborhood(){
    if(!this.mouseOverMe()){return;}
    strokeWeight(2); noFill();stroke(this.strk_fullOpq_rad);
    ellipse(this.pos.x,this.pos.y,this.rangeDiam,this.rangeDiam);
    strokeWeight(4);
    fill(this.fill_fullOpq_nbr); stroke(this.strk_fullOpq_nbr);
    this.neighborList.forEach((n)=>{ellipse(n.pos.x,n.pos.y,this.shapeDiam+4,this.shapeDiam+4)});
  } // Ends Function renderNeighborhood

} // Ends Class SPAgent