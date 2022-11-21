/*----------------------------------------------------------------------
|>>> Class SPAgent            ([S]patial [P]artitioning Capable [Agent])
+---------------------------------------------------------------------*/
class SPAgent{
  static minSpeed = 1;
  static maxSpeed = 4;
  static maxForce = 0.15;

  static useCScore = true;
  static maxCScore = 100;
  static doHealCSc = 80;
  static maxHealth = 1000;
  static dam_Agent = 6;
  static dam_Obstc = 4;
  static dam_Bound = 2;
  static coolPrcnt = 0.02;
  static coolDelFr = 6;
  static deadFrLen = 180;

  constructor(pos,ID,map){
    this.ID  = 'a'+ID;
    this.map = map; // caching for modularity purposes
    this.pos = pos;
    this.vel = p5.Vector.random2D().setMag(random(SPAgent.minSpeed,SPAgent.maxSpeed));
    this.acc = vec2();
    this.mvq = SPAgent.maxSpeed*SPAgent.maxSpeed; // [m]ax [v]elocity s[q]uared

    //>>> Variables for SP/Neighbors
    this.curCoord = map.cellViaPos(this.pos);
    this.rangeRad  = 38; // visibility range radius
    this.rangeDiam = this.rangeRad*2;
    this.rangeRadSqd  = this.rangeRad*this.rangeRad;
    this.neighborList = [];
    this.inRangeCells = this.getCellsInRange();

    //>>> Variables for Collision Score And Health
    this.isAlive   = true;
    this.curCScore = 0;
    this.curHealth = SPAgent.maxHealth;
    this.curDeadFr = 0;

    //>>> Variables for GFX/VFX
    this.shapeDiam   = Config.AGENT_DIAM;
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
    this.fill_ded = color(120);
    this.strk_ded = color(255);
    this.swgt_ded = 3;
    //>>> Collide Colormap
    this.colormap  = ["#1A9850","#66BD63","#A6D96A","#D9EF8B","#FFFFBF","#FEE08B","#FDAE61","#F46D43","#D73027"];
    this.colormap  = this.colormap.map(hexVal=>{return color(hexVal)}); 
    this.colMapLen = this.colormap.length-1;
  } // Ends Function initColorPallete


  update(){
    if(this.isAlive){
      let sepForce = this.separate();
      let lzdForce = this.lazyDrift();
      if(sepForce.magSq()>0){lzdForce.mult(0.25);}
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
  }


  lateUpdate(){
    if(this.isAlive){

    }
    else{
      // I step into this 1-2 frames into death sequence
      if(this.curDeadFr>SPAgent.deadFrLen){return;}
      if(this.curDeadFr==SPAgent.deadFrLen){this.poolRef.addToKillList(this.ID);return;}
      if(this.curDeadFr==0){new ExplodeEffect(this.pos.x,this.pos.y);}   
      if(this.curCoord!=null){this.map.removeUnit(this); return;}
      this.shapeDiam = Math.max(2,this.shapeDiam*.995);
      this.curDeadFr++;
    }
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
      this.applyCollideDAM('a');
      des.setMag(-SPAgent.maxSpeed);
      steer = p5.Vector.sub(des,this.vel);
      //steer.limit(SPAgent.maxForce);
      return steer;
    }
    return vec2();
  }


  updateSP(){
    if(!this.isAlive){return;}
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
      case true: this.vel.x *= -1; this.applyCollideDAM('w'); case false: break;
    }
    switch(this.pos.y+this.shapeRad > this.map.dim.tall || this.pos.y-this.shapeRad < 0){
      case true: this.vel.y *= -1; this.applyCollideDAM('w'); case false: break;
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


  getCollideDAMViaSpeed(evt){
    return this.getCollideDAM(evt)*(this.vel.magSq()/this.mvq);

  }


  getCollideDAM(evt){
    switch(evt){
      case 'a' : return SPAgent.dam_Agent;
      case 'o' : return SPAgent.dam_Obstc;
      case 'w' : return SPAgent.dam_Bound;
      case 'z' : return 32;
    }
  }

  applyCollideDAM(evt){
    evt = this.getCollideDAMViaSpeed(evt); // because I'mm OCD for a 'let ...'
    this.curCScore = constrain(this.curCScore+evt, 0, SPAgent.maxCScore);
    this.curHealth = constrain(this.curHealth-evt, 0, SPAgent.maxHealth);
    if(this.curHealth<=0){this.isAlive=false;}
  }

  applyCooldownHEAL(){
    this.curCScore = constrain(this.curCScore-(this.curCScore*SPAgent.coolPrcnt), 0, SPAgent.maxCScore);
    if(this.curCScore>SPAgent.doHealCSc){return;}
    this.curHealth = constrain(this.curHealth+(this.curHealth*SPAgent.coolPrcnt), 0, SPAgent.maxHealth);
  }

  updateCooldown(){
    if(frameCount%SPAgent.coolDelFr==0){this.applyCooldownHEAL();}
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

  styleSet(){
    switch(this.isAlive){
      case true: 
        stroke(this.strk_agt); 
        strokeWeight(this.swgt_agt); 
        fill(this.linMapCol(this.curCScore)); 
      return;
      case false: 
        stroke(this.strk_ded); 
        strokeWeight(this.swgt_ded); 
        fill(this.fill_ded);
      return;
    }
  }

  render(){
    this.styleSet();
    ellipse(this.pos.x,this.pos.y,this.shapeDiam,this.shapeDiam);
  } // Ends Function render

} // Ends Class SPAgent