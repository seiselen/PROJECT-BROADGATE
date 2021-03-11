/*======================================================================
| Project:  Simple Tower Defense Map and Pathwalk Demo 01
| Author:   Steven Eiselen, CFHS/UArizona Computer Science
|           Dan Shiffman, The Coding Train (crediting in case any of his
|           steering agent code appears in this code).
| Language: Javascript with P5JS Library
+-----------------------------------------------------------------------
| Description: (QAD) Implements a simple agent that follows a waypoint 
|              path specified by the map definition. As I want to get
|              this code up for my students ASAP <vs> my OCD of adding
|              "just a little more code documentation": I'll stop here.
|              
|              That Said: If you happen to see a completed version of my
|              Project StAgE (Steering Agent Engine) on my GitHub when
|              viewing this: it should have any desired implement info!
*=====================================================================*/
class TDAgent{
  constructor(x,y){
    // *pos*ition  *vel*ocity  *ori*entation
    this.pos = createVector(y*cellSize+(cellSize/2),x*cellSize+(cellSize/2));
    this.vel = createVector(1,0);
    this.ori = createVector(1,0);

    this.setBodyLen(cellSize/2);

    // waypoint path state
    this.curPath = [];
    this.curWaypt = 0;

    // state constraints
    this.maxSpeed = 2;
    this.maxForce = 0.2; // effectively 'turning' force/speed
  }

  /*----------------------------------------------------------------------
  |>>> Function givePath 
  +-----------------------------------------------------------------------
  | Purpose: Provides a path definition to the agent; such that if it is
  |          not empty and in form of an array of p5js vector types: the
  |          agent will start following it in the current or next frame.
  | Input:   > path: This MUST be a JavaScript array (i.e. '[]'') of p5js 
  |            vector types (i.e. P5JS version of Processing's PVector).
  +---------------------------------------------------------------------*/
  givePath(path){
    this.curWaypt = 0;
    this.curPath = path;
  }

  // [re]sets body length. recall we need to [re]assign 'bodyLnHalf' too!
  setBodyLen(len){
    this.bodyLength = len;
    this.bodyLnHalf = len/2;    
  }

  // used in main to add new agents of a random length
  setBodyLenRand(minLen,maxLen){
    this.setBodyLen(round(lerp(minLen,maxLen,random()),1));
  }

  /*----------------------------------------------------------------------
  |>>> Function gotoPath 
  +-----------------------------------------------------------------------
  | Purpose: (QAD) Implements behavior of the agent following its current
  |          path, as assigned in 'givePath'. For my students: you could
  |          request to recap the code in class as-needed. For everyone:
  |          I recall this code being similar or near-exact to that used
  |          by Dan Shiffman for his 'Nature Of Code' steering agents; so
  |          you could check his text or GitHub for more info as-needed.
  +---------------------------------------------------------------------*/ 
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
    var theta = this.ori.heading()+(PI/2);
    fill(216);stroke(60);strokeWeight(1);
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
  
}