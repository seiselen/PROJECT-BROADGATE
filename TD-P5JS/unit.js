/*======================================================================
| Project:  Simple Tower Defense Map and Pathwalk Demo 01
| Author:   Steven Eiselen, CFHS/UArizona Computer Science
|           Dan Shiffman, The Coding Train (crediting in case any of his
|           steering agent code appears in this code).
| Language: Javascript with P5JS Library
+-----------------------------------------------------------------------
| Description:  QAD - Implements a simple agent that follows a waypoint 
|               path specified by the map definition.
*=====================================================================*/
class Unit{
  constructor(x,y,ID,map){
    this.pos = createVector(y*cellSize+(cellSize/2),x*cellSize+(cellSize/2));
    this.vel = createVector(1,0);
    this.ori = createVector(1,0);

    this.setBodyLen(cellSize/2);

    this.curPath = [];
    this.curWaypt = 0;
    this.maxSpeed = 2;
    this.maxForce = 0.2;

    this.ID = ID;

    //>>> Variables for Spatial Partition
    this.map  = map; // TODO: Give it map obj's callback method instead?
    this.spCell = null;

    //>>> Variables for Color Palette
    this.fill_live = color(216);
    this.fill_dead = color(120,0,0);    
    this.col_agStrk = color(60);
    this.col_agHth1 = color(32,216,64);
    this.col_agHth2 = color(216,216,64);
    this.col_agHth3 = color(216,32,64);

    //>>> Variables for Health and Health-bar
    this.curHealth = 100;
    this.maxHealth = 100;
    this.isAlive   = true;
    this.deathFrame = 0;

    this.respawnDel = 120; // 'respawn delay'

    this.hbarWide = 48;
    this.hbarTall = 6;

  } // Ends Constructor

  givePath(path){
    this.curWaypt = 0;
    this.curPath = path;
    return this; // for method chaining
  } // Ends Function givePath

  setBodyLen(len){
    this.bodyLength = len;
    this.bodyLnHalf = len/2;    
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
      //OnEnemyKilled();    
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
      case true: fill(this.fill_live); break;
      case false: fill(this.fill_dead);
    }

    stroke(this.col_agStrk);strokeWeight(1);

    push();
      // Translate and Rotate, 'Nuff Said
      translate(this.pos.x,this.pos.y);
      rotate(theta);
      // Triangle body representation
      beginShape();
      vertex(0,-this.bodyLength);             // Head
      vertex(-this.bodyLnHalf,this.bodyLnHalf); // Starboard
      vertex(this.bodyLnHalf,this.bodyLnHalf);  // Port
      endShape(CLOSE);
    pop();   
  } // Ends Function renderBody

  renderHealthbar(){
    strokeWeight(1);

    let xOff = this.hbarWide/2;
    let yOff = this.bodyLnHalf+(this.hbarTall*2);

    stroke(this.col_agStrk);fill(this.col_agStrk);
    rect(this.pos.x-xOff,this.pos.y-yOff,this.hbarWide,this.hbarTall);

    noStroke();

    let hRatio = constrain(this.curHealth/this.maxHealth,0,1);

    switch(hRatio>=0.5){
      case true: fill(lerpColor(this.col_agHth2,this.col_agHth1, (hRatio-0.5)*2 ));break;
      case false: fill(lerpColor(this.col_agHth3,this.col_agHth2, hRatio*2  ));
    }

    rect(this.pos.x-xOff, this.pos.y-yOff, lerp(1,this.hbarWide,hRatio), this.hbarTall);    
  } // Ends Function renderHealthbar
  
}