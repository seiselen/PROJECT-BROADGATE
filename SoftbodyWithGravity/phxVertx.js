/*----------------------------------------------------------------------
|>>> Class PhxVertex (Physics Vertex)
+-----------------------------------------------------------------------
|# Object State Descriptions:
|   > designAdjs → adjacent PhxVertex objects WRT the artificial design
|                  of greater softbody shape; should be passed On-Init.
|   > actualAdjs → adjacent PhxVertex objects WRT spatial partitioning;
|                  TBD but I'll likely pass it a util SP component.                  
+---------------------------------------------------------------------*/
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
    this.maxForce = 12;

    // Variables for [Mouse] Selection/Moving
    this.isSelected = false;
    this.mOffset;

    // Colors
    this.regCol = color(160,80,0);
    this.selCol = color(240,120,0);

    // Other Components/Collections
    this.designAdjs = [];
    this.actualAdjs = [];
    this.expAdjDist = undefined;

    // Misc. Cached Variables
    this.pVec = createVector(); // general purpose p5.Vector
  }


  /**
   * 
   * @param {*} id 
   * @returns {PhxVertex} `this` for function chaining
   */
  setID(id){
    this.ID = id;
    return this;
  }


  /**
   * @desc Sets 'Official' Neighbors (i.e. not via spatial partitoning)
   * @param {*} adjs
   * @returns {PhxVertex} `this` for function chaining per constructor
   */
  setOfficialNeighbors(adjs){
    this.designAdjs = adjs;
    return this;
  }


  setExpAdjDist(dist){
    this.expAdjDist = dist;
    return this; 
  }





  ptInBoundCirc(pt){
    return (p5.Vector.dist(pt,this.pos) <= this.radi);
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


  steerToHarmonyWithAdjs(){
    if(this.designAdjs.length==0||this.expAdjDist==undefined){return;}

    let desireds = this.designAdjs.map(adj=> p5.Vector.sub(adj.pos,this.pos));
    let dist,steer;

    let perAdjRatio = 1.0/this.designAdjs.length;

    desireds.forEach(desVec=>{
      dist = desVec.mag();
      if(dist<this.expAdjDist*0.5){
        if(this.ID==6){console.log(dist);}
        desVec.setMag(dist*perAdjRatio);
        desVec.mult(-1);
        steer = p5.Vector.sub(desVec,this.vel);
        this.applyForce(steer);        
      }

      else if(dist>this.expAdjDist*1.5){
        desVec.setMag(dist*perAdjRatio);
        desVec.mult(1);
        steer = p5.Vector.sub(desVec,this.vel);
        this.applyForce(steer);        
      }

    })
  }

  seek(){
    if(!this.isSelected||!this.mOffset){return;}
    var des = p5.Vector.sub(this.mOffset,this.pos);
    des.setMag(des.mag());
    var steer = p5.Vector.sub(des,this.vel);
    this.applyForce(steer);
  } // Ends Behavior seek



  canvBorderBounce() {
    if (this.pos.x-this.radi >= width)  {this.pos.x = width-this.radi; this.vel.x *= -1;} 
    else if (this.pos.x+this.radi <= 0) {this.pos.x = this.radi; this.vel.x *= -1;}
    if (this.pos.y+this.radi >= height) {this.pos.y = height-this.radi; this.vel.y *= -1;}  
    else if (this.pos.y-this.radi <= 0) {this.pos.y = this.radi; this.vel.y *= -1;}
  } // Ends Function checkEdges

  // Good 'Ol Euler Integration
  update(){
      //this.steerToHarmonyWithAdjs();
      this.seek();

      this.acc.limit(this.maxForce);
      this.vel.add(this.acc); 
      this.vel.mult(this.damp); 
      this.pos.add(this.vel); 
      this.acc.mult(0);
      this.canvBorderBounce();
  }

 
  onMousePressed(mousePt){
    if(this.ptInBoundCirc(mousePt)){
      this.isSelected = true;
      this.mOffset = mousePt;
    }
  }

  onMouseDragged(mousePt){
    if(this.isSelected){
      this.mOffset.set(mousePt);
    }
  }

  onMouseRelease(){
    this.isSelected = false;
  }


  render() {
    stroke(180);strokeWeight(2);
    if (this.isSelected) {fill(this.selCol);} else{fill(this.regCol);}
    ellipse(this.pos.x,this.pos.y,this.diam,this.diam);
    if(this.ID>=0){noStroke();fill(255);textAlign(CENTER,CENTER);text(this.ID, this.pos.x,this.pos.y)}
  } 

} // Ends Class PhxVertex