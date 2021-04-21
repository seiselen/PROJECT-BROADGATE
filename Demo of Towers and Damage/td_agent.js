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
class TDAgent{
  constructor(x,y,ID){
    this.pos = createVector(y*cellSize+(cellSize/2),x*cellSize+(cellSize/2));
    this.vel = createVector(1,0);
    this.ori = createVector(1,0);

    this.setBodyLen(cellSize/2);

    this.curPath = [];
    this.curWaypt = 0;
    this.maxSpeed = 2;
    this.maxForce = 0.2;

    this.ID = ID;

    // for spatial partition (i have encapsulation issues, but #YOLO for now)
    this.spCell = null;

    //>>> Variables for Color Palette
    this.col_agFill = color(216);
    this.col_agStrk = color(60);
    this.col_agHlth = color(32,216,64);

    //>>> Variables for Health and Health-bar
    this.curHealth = 100;
    this.maxHealth = 100;

    this.hbarWide = 48;
    this.hbarTall = 6;



  }

  givePath(path){
    this.curWaypt = 0;
    this.curPath = path;
  }

  setBodyLen(len){
    this.bodyLength = len;
    this.bodyLnHalf = len/2;    
  }

  setBodyLenRand(minLen,maxLen){
    this.setBodyLen(round(lerp(minLen,maxLen,random()),1));
  }

  update(){
    this.gotoPath();
    mapSP.updatePos(this);
  }


 
  gotoPath(){
    if(this.curWaypt<this.curPath.length){

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
  }

  render(){
    this.renderAgent();
    this.renderHealthbar();
  }

  renderAgent(){
    var theta = this.ori.heading()+(PI/2);
    fill(this.col_agFill);stroke(this.col_agStrk);strokeWeight(1);
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
  } // Ends Function render

  renderHealthbar(){
    strokeWeight(1);

    let xOff = this.hbarWide/2;
    let yOff = this.bodyLnHalf+(this.hbarTall*2);

    stroke(this.col_agStrk);fill(this.col_agStrk);
    rect(this.pos.x-xOff,this.pos.y-yOff,this.hbarWide,this.hbarTall);

    noStroke();fill(this.col_agHlth);
    let hRatio = lerp(1, this.hbarWide, constrain(this.curHealth/this.maxHealth,0,1) );
    rect(this.pos.x-xOff, this.pos.y-yOff, hRatio, this.hbarTall);    
  }
  
}