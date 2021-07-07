/*======================================================================
| Project:  Simple Tower Defense Map and Pathwalk Demo 01
| Author:   Steven Eiselen, CFHS/UArizona Computer Science
|           Dan Shiffman, The Coding Train (crediting in case any of his
|           steering agent code appears in this code).
| Language: Javascript with P5JS Library
+-----------------------------------------------------------------------
| Description:  QAD - Implements a simple agent that follows a waypoint 
|               path specified by the map definition.
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
*=====================================================================*/

// Schema: {id : [maxHealth, maxSpeed, bodyLen, fill color, $ bounty]}
var UnitType = {
    /*------------------------------------------------------------------
    |>>> 'Standard Set'
    +-------------------------------------------------------------------
    |> Description: Difference between STD_(n+1) <vs> STD_(n) => 
    |  - inc. health (double its predecessor)
    |  - dec speed (+0.25 from [8,5], +1 from [5,1])
    |  - inc. size (-6 its predecessor)
    |  - colormap (colorbrewer2.org/#type=diverging&scheme=Spectral&n=8)
    |  - $ bounty (will be same as respective health values for now)
    +-----------------------------------------------------------------*/
    STD_1 : [25,     5, 18, [50,136,189],    25],
    STD_2 : [50,     4, 24, [102,194,165],   50],
    STD_3 : [100,    3, 30, [171,221,164],  100],
    STD_4 : [200,    2, 36, [230,245,152],  200],
    STD_5 : [400,    1, 42, [254,224,139],  400],
    STD_6 : [800,  .75, 48, [253,174,97],   800],
    STD_7 : [1600,  .5, 54, [244,109,67],  1600],
    STD_8 : [3200, .25, 60, [213,62,79],   3200],
} // Ends 'Enum' UnitType

class Unit{
  constructor(row,col,ID,map){
    this.ID  = ID;
    this.pos = createVector(col*cellSize+(cellSize/2),row*cellSize+(cellSize/2));
    this.vel = createVector(1,0);
    this.ori = createVector(1,0);

    //>>> Spatial Partition / Visibility
    this.map  = map; // TODO: Give it map obj's callback method instead?
    this.spCell = null;

    //>>> Path[walk] Info
    this.curPath = [];
    this.curWaypt = 0;

    //>>> Life/Death State
    this.isAlive   = true;
    this.deathFrame = 0;
    this.respawnDel = 120; // 'respawn delay'

    //>>> Variables for Health and Health-bar (these are DEFAULT VALS, else WILL VARY BY UNIT TYPE!)
    this.unitType = -1;
    this.setBodyLen(cellSize*0.5);
    this.maxSpeed = 1;
    this.maxForce = 0.1; // relates to turning speed (good heuristic seems to be maxSpeed/10)
    this.maxHealth = 400;
    this.curHealth = this.maxHealth;



    //##################################################################
    //>>> GFX/VFX Variables, Color Palette, etc.
    //##################################################################
    this.fill_live  = color(216); // DEFAULT val - else WILL VARY BY UNIT TYPE!) 
    this.fill_dead  = color(255,64);
    this.strk_live  = color(60);
    this.strk_dead  = color(0,128);
    this.fill_hBar1 = color(32,216,64);
    this.fill_hBar2 = color(216,216,64);
    this.fill_hBar3 = color(216,32,64);

    // Healthbar Settings
    this.hBar_wide = 48;
    this.hBar_tall = 6;
    this.hBar_xOff = this.hBar_wide/2;
    this.hBar_yOff = this.bodyLnHalf+(this.hBar_tall*2);
  } // Ends Constructor

  // Type Data Schema: {id : [maxHealth, maxSpeed, bodyLen, bodyColor]}
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


  givePath(path){
    this.curWaypt = 0;
    this.curPath = path;
    return this; // for method chaining
  } // Ends Function givePath

  setBodyLen(len){
    this.bodyLength = len;
    this.bodyLnHalf = len/2;
    this.bodyLenSq  = (this.bodyLnHalf*this.bodyLnHalf);
  } // Ends Function setBodyLen

  setBodyLenRand(minLen,maxLen){
    this.setBodyLen(round(lerp(minLen,maxLen,random()),1));
  } // Ends Function setBodyLenRand

  update(){
    if(this.isAlive){this.gotoPath();}
    else{this.checkRespawn();}
    this.map.updatePos(this);
  } // Ends Function update


  checkRespawn(){
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

  onAgentKilled(){
    this.curHealth = 0;
    this.isAlive = false;
    this.deathFrame = frameCount;
    this.ori = createVector(random(-10,10),random(-10,10)).normalize();
    manager.OnEnemyKilled(); // DEPENDENCY NOTE: REFERENCING GLOBAL VAR!    
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
    if(this.curHealth <= 0){this.onAgentKilled();}
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

    // hard hack for now: reset posotion to enter pt, no change to velocity nor orientation
    else{
      this.curWaypt = 0;
      this.pos = createVector(this.curPath[this.curWaypt].x,this.curPath[this.curWaypt].y);
    }
  } // Ends Function gotoPath


  render(){
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