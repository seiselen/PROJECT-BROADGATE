class BouncyBall{
  constructor(pos){
    this.pos = pos;
    this.vel = createVector();
    this.acc = createVector();

    this.maxSpeed = 10;
    this.mass = 2;
    this.maxForce = .15;
    this.fleeDist = 40;

    this.rad = 10;
  } // Ends Constructor 

  setVelocity(newVel){
    this.vel = newVel;
  } // Ends Function setVelocity

  setVelocityRandom(){
    this.vel = createVector(
      random(-this.maxSpeed/2,this.maxSpeed/2),
      random(-this.maxSpeed/2,this.maxSpeed/2)
    );
    return this;
  } // Ends Function setVelocityRandom

  applyForce(force){
    this.acc.add(p5.Vector.div(force,this.mass)); 
  } // Ends Function applyForce  

  update(){
    this.applyForce(this.flee(createVector(mouseX,mouseY)));

    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.edgeBounce();
    this.fricDampen();
  } // Ends Function update

  flee(tar){
    let des = p5.Vector.sub(tar,this.pos);
    let dist = des.mag();  
    if(des.mag()<this.fleeDist){                      
      des.setMag(-this.maxSpeed);
      let steer = p5.Vector.sub(des,this.vel);
      steer.limit(this.maxForce);
      return steer;
    }
    else{
      return createVector(0);
    }
  } // Ends Behavior flee

  edgeBounce(){
    if (this.pos.x+this.rad > width)  {this.pos.x = width-this.rad;  this.vel.x *= -1;} 
    else if (this.pos.x-this.rad < 0) {this.pos.x = this.rad;      this.vel.x *= -1;}
    if (this.pos.y+this.rad > height) {this.pos.y = height-this.rad; this.vel.y *= -1;}  
    else if (this.pos.y-this.rad < 0) {this.pos.y = this.rad;      this.vel.y *= -1;}
  } // Ends Function edgeBounce

  fricDampen(){
    this.vel.mult(.999);
  }

  render(){
    fill(0,60,255);
    strokeWeight(2);stroke(255);
    ellipse(this.pos.x,this.pos.y,this.rad*2,this.rad*2);  
  } // Ends Function render

} // Ends Class BouncyBall