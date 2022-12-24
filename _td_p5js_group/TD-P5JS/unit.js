/*======================================================================
|>>> Class UnitManager
+=======================================================================
| Description: [QAD] Implements Object Pooling for all Units and manages
|              their routine per-frame update calls. Even though FPS and
|              other performance *seems* okay without it; the thought of
|              an ever growing list of dead/stale units that needs to be
|              iterated over as they're never used again motivated me to
|              utilize pooling after all. Oh well, shouldn't hurt things
|              and should actually boost effeciency (maybe performance?)
+-----------------------------------------------------------------------
| Implementation Notes:
|   > Function 'poolPopToString' is identical to that of the same name
|     in the analogous 'ProjectileManager' class; thus more info can be
|     seen in its comment box as needed (though what's the need? lol)
|   > Per usual, 'poolCap' => *pool* *cap*acity
|   > Variable 'uID' ensures all units will have a unique ID, and that
|     this ID was also never PREVIOUSLY used (i.e. units are recycled,
|     but unit IDs NEVER are recycled!)
+=====================================================================*/
class UnitManager{
  constructor(initSize=256){this.poolCap=initSize; this.uID=0; this.pool=[]; this.initPool();}

  initPool(){for(let i=0; i<this.poolCap; i++){this.pool.push(new Unit());}}

  getPoolPop(){let pop = 0; this.pool.forEach(r => {pop += (r.canRecycle()) ? 0 : 1}); return pop;}
  getPoolPct(){return floor((this.getPoolPop()/this.poolCap)*100);}

  poolPopToString(){return "Unit Pool Use: "+this.getPoolPct()+"% ["+this.getPoolPop()+"/"+this.poolCap+"]";}
  poolPctToString(){return "Unit Pool: "+nf(this.getPoolPct(),2)+"%";}

  reqUnit(type,row,col){
    for(let i=0; i<this.poolCap; i++){if(this.pool[i].canRecycle()){
      this.pool[i].init(this.uID++,type,row,col);
      return this.pool[i];
    }}
    console.log("WARNING - No unused entries available!"); return null;  
  } // End Function reqUnit

  // NOTE: Technically don't need the 'u.inUse' test, but keeping for now
  update(){this.pool.forEach(u => {if(u.inUse()){u.update();}});}
  render(){this.pool.forEach(u => {if(u.inUse()){u.render();}});}
} // Ends Class UnitManager




/*======================================================================
|>>> Object UnitType
+=======================================================================
| Description: Contains {key:value} entries whose keys identify the type
|              of unit (which is also the definitive ID to specify such
|              types with), and whose corresponding values are defined
|              in the Data Schema seen immediately below...
| Data Schema: {id : [maxHealth, maxSpeed, bodyLen, fill color, bounty]}
+-----------------------------------------------------------------------
| Implementation Notes:
|  > TODO: Turn values from array to dict? For example, define STD_1 as:
|          {key:"STD_1", maxH:25, maxS:4.0, bLen:18, fCol:[...], bty:25}
+=====================================================================*/
var UnitType = {
    /*------------------------------------------------------------------
    |>>> 'Standard Set'
    +-------------------------------------------------------------------
    |> Description: Difference between STD_(n+1) <vs> STD_(n) => 
    |  - inc. health (double its predecessor)
    |  - dec speed (-0.5 of its predecessor)
    |  - inc. size (-6 of its predecessor)
    |  - colormap (colorbrewer2.org/#type=diverging&scheme=Spectral&n=8)
    |  - $ bounty (will be same as respective health values for now)
    +-----------------------------------------------------------------*/
    STD_1 : [25,   4.0, 18, [50,136,189],    25],
    STD_2 : [50,   3.5, 24, [102,194,165],   50],
    STD_3 : [100,  3.0, 30, [171,221,164],  100],
    STD_4 : [200,  2.5, 36, [230,245,152],  200],
    STD_5 : [400,  2.0, 42, [254,224,139],  400],
    STD_6 : [800,  1.5, 48, [253,174,97],   800],
    STD_7 : [1600, 1.0, 54, [244,109,67],  1600],
    STD_8 : [3200, 0.5, 60, [213,62,79],   3200],
} // Ends 'Enum' UnitType




/*----------------------------------------------------------------------
|>>> Class Unit
+-----------------------------------------------------------------------
| Description: Implements Units (i.e. enemies) which travel throughout
|              the game map's enemy path (see Map class for more info).
|              Path travel is accomplished via a very basic steering 
|              agent which follows waypoints defined as the midpoints of
|              each enemy path cell in the order specified by the map's
|              definition thereof. This class [now] utilizes an object
|              pool, and thus Unit instances will be recycled once they
|              enter the 'fullyDead' state.
| Source Note: This class (alongside the Homing Missile Projectile type)
|              utilizes code from my (Steven Eiselen's) 'Project StAgE' 
|              (*St*eering *Ag*ent *E*ntities). StAgE's code is roughly
|              derivative from that of Dan Shiffman (The Coding Train);
|              as introduced in his book 'Nature Of Code' and videos on
|              the aforementioned YouTube channel.
| Variables:   > ID: (ideally) unique identifier for the particular life
|                of this unit (i.e. will change whenever unit instance
|                is recycled by its object pool / manager).
this.pos
this.vel
this.ori

this.bodyLength = len;
this.bodyLnHalf = len/2;
this.bodyLenSq  = (this.bodyLnHalf*this.bodyLnHalf);

this.map
this.spCell
this.curPath
this.curWaypt

this.isAlive    = false;
this.fullyDead  = true; // Note: ([!alive] != [fullyDead]). Fully dead means can be removed/recycled
this.deathFrame = -9999;
this.canRespawn = false;
this.respawnDel = 120; // 'respawn delay'
this.corpseDel  = 120; // delay from when !alive to when fullyDead (as used when respawn disabled)

//>>> Variables for Health and Health-bar (these are DEFAULT VALS, else WILL VARY BY UNIT TYPE!)
this.unitType = -1;
this.setBodyLen(cellSize*0.5);
this.maxSpeed = 1;
this.maxForce = 0.1; // relates to turning speed (good heuristic seems to be maxSpeed/10)
this.maxHealth = 400;
this.curHealth = this.maxHealth;



+-----------------------------------------------------------------------
| Implementation Notes:
|   > Utilizing only 1 class and diversifying unit types as configs of
|     values such as maxHealth, maxSpeed, color, etc. Why? No need to
|     create subtypes, as units just pathwalk until dead. This will NOT
|     be the case for RTS-P5JS (obviously...)
|   > Constructor inputs a map [row][col], not a world (x,y) position.
|     For RTS-P5JS refactor, this should again be (x,y) position again,
|     corresponding to factory's or otherwise 'spawn point'.
|   > (7/5/21) Refactored the unit type "enum" from a static dict within
|     the Unit class definition to a global var defined externally. This
|     is actually better OOP in-general; but the main reason was so the
|     'sandbox mode' enemy spawner UI can iterate through its keys as to
|     access and display unit info to the player: which appears to be a
|     difficult ['wonky'?] for a statically defined dict.
|   > Object Pooling refactoring was done on 7/8 (and its LNOS session)
*=====================================================================*/
class Unit{
  constructor(){
    //##################################################################
    //>>> State that is INDEPENDENT of being [re]set via init
    //##################################################################    
    this.ID   = -9999;
    this.map  = map; // referencing the GLOBAL VAR
    this.fullyDead  = true; // should cover most 'missing state' cases until unit is first activated by pool
    this.canRespawn = false;
    this.respawnDel = 120;
    this.corpseDel  = 120;
    //##################################################################
    //>>> GFX/VFX Variables, Color Palette, etc.
    //##################################################################
    this.fill_live  = color(216); // will be reset based on unit type
    this.fill_dead  = color(255,64);
    this.strk_live  = color(60);
    this.strk_dead  = color(0,128);
    this.fill_hBar1 = color(32,216,64);
    this.fill_hBar2 = color(216,216,64);
    this.fill_hBar3 = color(216,32,64);
    this.hBar_wide  = 48;
    this.hBar_tall  = 6;
    this.hBar_xOff  = this.hBar_wide/2;
    this.hBar_yOff  = 32+(this.hBar_tall*2);
  } // Ends Constructor

  init(ID,type,row,col){
    this.ID  = ID;
    this.pos = createVector(col*cellSize+(cellSize/2),row*cellSize+(cellSize/2));
    this.vel = createVector(1,0);
    this.ori = createVector(1,0);
    this.setType(type);

    this.spCell = null;
    this.givePath(this.map.walkPath);

    this.isAlive    = true;
    this.fullyDead  = false;
    this.deathFrame = 0;
  } // Ends Function init


  setType(type){
    this.unitType = type;
    let info = UnitType[type];
    if(info){
      this.maxHealth = info[0];
      this.curHealth = this.maxHealth;
      this.maxSpeed  = info[1];
      this.maxForce  = this.maxSpeed/10; // relates to turn speed (good heuristic seems to be maxSpeed/10)
      this.setBodyLen(info[2]);
      this.fill_live = color(info[3][0],info[3][1],info[3][2]);
    }
    else{
      console.log(">>> Warning: Input \""+type+"\" is an invalid unit type! Retaining default values.");
    }
    return this; // for function chaining
  } // Ends Function setType

  // Sure: having both are redundant, but keeping with other pools' conventions
  inUse()     {return this.isAlive || !this.fullyDead;}
  canRecycle(){return this.fullyDead;}

  givePath(path){
    this.curWaypt = 0;
    this.curPath = path;
    return this; // for method chaining
  } // Ends Function givePath

  setBodyLen(len){
    this.bodyLength = len;
    this.bodyLnHalf = len/2;
    this.bodyLenSq  = (this.bodyLnHalf*this.bodyLnHalf);

    this.hBar_yOff  = this.bodyLnHalf+(this.hBar_tall*2);
  } // Ends Function setBodyLen

  setBodyLenRand(minLen,maxLen){
    this.setBodyLen(round(lerp(minLen,maxLen,random()),1));
  } // Ends Function setBodyLenRand

  update(){
    if     (this.isAlive)   {this.gotoPath();this.map.updatePos(this);}
    else if(this.canRespawn){this.resurrect();}
    else if(!this.fullyDead){this.afterlife();} 
  } // Ends Function update


  resurrect(){
    if(frameCount-this.deathFrame>this.respawnDel){
      // reset alive status and health
      this.isAlive = true;
      this.curHealth = this.maxHealth;

      // reset waypoint and transform
      this.curWaypt = 0;
      this.pos = createVector(this.curPath[this.curWaypt].x,this.curPath[this.curWaypt].y);
      this.ori = createVector(0,0);
    }
  }

  afterlife(){
    if(frameCount-this.deathFrame>this.corpseDel){
      this.fullyDead = true;
    }
  }




  onKilled(){
    this.curHealth = 0;
    this.isAlive = false;
    this.deathFrame = frameCount;
    this.ori = createVector(random(-10,10),random(-10,10)).normalize();
    this.map.removePos(this); // added 7/8 to possibly support unit object pool
    manager.OnEnemyKilled(this.unitType); // DEPENDENCY NOTE: REFERENCING GLOBAL VAR!    
  }



  didMissileCollide(projPos){
    return p5.Vector.sub(projPos,this.pos).magSq() <= this.bodyLenSq*4;
  }


  onBulletHit(bulletPos,dam){
    if(p5.Vector.sub(bulletPos,this.pos).magSq() <= this.bodyLenSq*2){
      this.applyDamage(dam);
    }
  }

  onMissileHit(bulletPos,dam){
    this.applyDamage(dam);
  }


  applyDamage(dam){
    this.curHealth -= dam;
    if(this.curHealth <= 0){this.onKilled();}
  }





 
  gotoPath(){
    if(this.curWaypt<this.curPath.length){

      if(!this.isAlive){return;}

      // Calculate 'proposed' next move 
      var des = p5.Vector.sub(this.curPath[this.curWaypt],this.pos);
      des.setMag(this.maxSpeed);
      var newPos = p5.Vector.add(this.pos,des);

      // Determine orientation given desired velocity and current ori
      var oriDelta = p5.Vector.sub(des,this.ori);
      oriDelta.limit(this.maxForce);
      this.ori.add(oriDelta);

      // Clamp position if it overshoots waypoint (large velocities unhandled!)
      if(p5.Vector.dist(this.pos,newPos) > p5.Vector.dist(this.pos,this.curPath[this.curWaypt]) ){
        newPos = this.curPath[this.curWaypt];
      }

      // At current waypoint (exactly xor clamped overshoot, and also means I never 'lose a frame' of movement)
      if(p5.Vector.dist(this.pos,newPos) == p5.Vector.dist(this.pos,this.curPath[this.curWaypt]) ){
        this.curWaypt++;
      }

      this.pos = newPos;
    }

    /*----------------------------------------------------------------------
    | 'OnExitedMap' State => call game manager's 'OnEnemyExited' function,
    | then set current waypoint back to zero, then set position to that of 
    | current waypoint (i.e. 'teleport' to waypoint zero), 
    +---------------------------------------------------------------------*/ 
    else{
      manager.OnEnemyExited();
      this.curWaypt = 0;
      this.pos = createVector(this.curPath[this.curWaypt].x,this.curPath[this.curWaypt].y);
    }
  } // Ends Function gotoPath

  render(){
    if(this.fullyDead){return;}
    this.renderBody();
    this.renderHealthbar();
  }

  renderBody(){
    let theta = this.ori.heading()+(PI/2);

    switch(this.isAlive){
      case true:  fill(this.fill_live); stroke(this.strk_live); break;
      case false: fill(this.fill_dead); stroke(this.strk_dead); break;
    }

    strokeWeight(1);

    push();
      translate(this.pos.x,this.pos.y);
      rotate(theta);
      // Triangle Chevron body representation
      beginShape();
      vertex(0,-this.bodyLength);               // Head
      vertex(-this.bodyLnHalf,this.bodyLnHalf); // Starboard
      vertex(this.bodyLnHalf,this.bodyLnHalf);  // Port
      endShape(CLOSE);
    pop();   
  } // Ends Function renderBody

  renderHealthbar(){
    strokeWeight(1);stroke(this.strk_live);fill(this.strk_live);
    rect(this.pos.x-this.hBar_xOff,this.pos.y-this.hBar_yOff,this.hBar_wide,this.hBar_tall);

    let hRatio = constrain(this.curHealth/this.maxHealth,0,1);
    switch(hRatio>=0.5){ /* switch implements diverging colormap */
      case true: fill(lerpColor(this.fill_hBar2,this.fill_hBar1, (hRatio-0.5)*2 ));break;
      case false: fill(lerpColor(this.fill_hBar3,this.fill_hBar2, hRatio*2  ));break;
    }
    noStroke();
    rect(this.pos.x-this.hBar_xOff, this.pos.y-this.hBar_yOff, lerp(1,this.hBar_wide,hRatio), this.hBar_tall);    
  } // Ends Function renderHealthbar
  
} // Ends Class Unit