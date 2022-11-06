/*--------------------------------------------------------------------
|>>> Class PhxSpring (Physics Spring)
+-------------------------------------------------------------------*/
class PhxSpring {
  /*--------------------------------------------------------------------
  |# Variable Descriptions:
  |  > {p,q}    - PhxVertex pair affected by (i.e. sharing) this spring
  |  > rLen     - rest length of this spring (i.e. slack length?)
  |  > stiff    - a.k.a. 'k', the stiffness factor of this spring
  |  > sprForce - current (i.e. per frame) force of this spring
  |  > stretch  - current difference between dist(p,q) and rest length
  +-------------------------------------------------------------------*/
  constructor(p,q,rLen,sFac,dVal){
    this.p = p;
    this.q = q;
    this.rLen  = rLen;
    this.stiff = sFac;
    this.damp = dVal;
    this.color = color(255);

    // Cached (i.e. per-frame) Variables
    this.sprForce;
    this.stretch;
  }

  update() {
    this.sprForce = p5.Vector.sub(this.p.pos, this.q.pos);
    this.stretch = this.sprForce.mag() - this.rLen;

    this.sprForce.setMag(this.stiff*this.stretch);

    // order MATTERS: must be opposite of sub op in line assigning 'this.sprForce'
    this.q.applyForce(this.sprForce);
    this.sprForce.mult(-1);
    this.p.applyForce(this.sprForce);
  }

  // L_0 -> rLen
  // k_d -> damp
  // k_s -> stiff
  // x   -> stretch
  // he does sub(q.pos,p.pos) 

  update2() {

    let deltaPos = p5.Vector.sub(this.p.pos, this.q.pos);
    let deltaVel = p5.Vector.sub(this.p.vel, this.q.vel);

    let stretch = deltaPos.mag() - this.rLen;

    let Fs = stretch*this.stiff;

    deltaPos.normalize();

    let Fd = this.damp * p5.Vector.dot(deltaPos,deltaVel);

    this.sprForce = deltaPos.mult(Fs+Fd); 

    let forceQ = p5.Vector.sub(this.p.pos, this.q.pos); 
    let forceP = p5.Vector.sub(this.q.pos, this.p.pos); 

    forceQ.normalize(); 
    forceQ.mult(Fs+Fd);
    forceP.normalize(); 
    forceP.mult(Fs+Fd);

    // order MATTERS: must be opposite of sub op in line assigning 'this.sprForce'
    this.q.applyForce(forceQ);
    //this.sprForce.mult(-1);
    this.p.applyForce(forceP);
  }

  render() {
    strokeWeight(2);stroke(this.color);
    line(this.p.pos.x, this.p.pos.y, this.q.pos.x, this.q.pos.y);}
}
