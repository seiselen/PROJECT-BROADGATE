/*--------------------------------------------------------------------
|>>> Class PhxVertex (Physics Vertex)
+-------------------------------------------------------------------*/
class PhxVertex{
  constructor(pos){
    this.pos = pos;
    this.vel = createVector();
    this.acc = createVector();
    this.mass = 4;
    this.damp = 0.95;
    this.diam = 24;
    this.radi = this.diam/2;
    this.ID   = -9999;
    this.maxForce = 5;

    // Variables for [Mouse] Selection/Moving
    this.isSelected = false;
    this.mOffset;

    // Colors
    this.regCol = color(0,60,180);
    this.selCol = color(0,180,255);

    // Misc. Cached Variables
    this.pVec = createVector(); // general purpose p5.Vector
  }

  // need to return instance as this is called via 'chain init' (vis-a-vis D3)
  setID(id){
    this.ID = id;
    return this;
  }

  ptInBoundCirc(pt){
    return (p5.Vector.dist(pt,this.pos) <= this.radi);
  }
  
  onMousePressed(mousePt){
    if(this.ptInBoundCirc(mousePt)){
      this.isSelected = true;
      // capture offset between mouse and pos at moment of selection
      this.mOffset = p5.Vector.sub(this.pos,mousePt);
    }
  }

  onMouseDragged(mousePt){
    if(this.isSelected){
      // supports moving vertex WRT mouse pos at onMousePressed
      this.pos.set(p5.Vector.add(this.mOffset,mousePt));
    }
  }

  onMouseRelease(){
    this.isSelected = false;
  }

  applyForce(force,mod=1){
    this.acc.add(force.copy().mult(mod).div(this.mass));
  }

  // only supports {up,down,left,right} as to be QAD for gravity
  applyForceViaDir(dir,force){
    if(this.isSelected){return;}
    switch(dir){
      case 'u': this.pVec.set(0,-force);  break;
      case 'd': this.pVec.set(0,force); break;
      case 'l': this.pVec.set(force,0);  break;
      case 'r': this.pVec.set(-force,0); break;
      default:  this.pVec.set(0,0);
    }
    this.applyForce(this.pVec);
  }

  canvBorderBounce() {
    if (this.pos.x-this.radi >= width)  {this.pos.x = width-this.radi; this.vel.x *= -1;} 
    else if (this.pos.x+this.radi <= 0) {this.pos.x = this.radi; this.vel.x *= -1;}
    if (this.pos.y+this.radi >= height) {this.pos.y = height-this.radi; this.vel.y *= -1;}  
    else if (this.pos.y-this.radi <= 0) {this.pos.y = this.radi; this.vel.y *= -1;}
  } // Ends Function checkEdges

  // Good 'Ol Euler Integration
  update(){
    // if selected point - ignore physics (a-la Unity3D 'isKinematic')
    if(this.isSelected){
      this.canvBorderBounce();
    }
    else{
      this.acc.limit(this.maxForce);
      this.vel.add(this.acc); 
      this.vel.mult(this.damp); 
      this.pos.add(this.vel); 
      this.acc.mult(0);
      this.canvBorderBounce();
    }
  }

  render() {
    stroke(180);strokeWeight(2);
    if (this.isSelected) {fill(this.selCol);} else{fill(this.regCol);}
    ellipse(this.pos.x,this.pos.y,this.diam,this.diam);
    if(this.ID>=0){noStroke();fill(255);textAlign(CENTER,CENTER);text(this.ID, this.pos.x,this.pos.y)}
  } 

} // Ends Class PhxVertex