class GWAgent{
  constructor(r,c,m){
    this.pos = createVector(c*cellSize+(cellSize/2),r*cellSize+(cellSize/2));
    this.vel = createVector(1,0);
    this.ori = createVector(1,0);
    this.map = m;
    this.bodyLength = cellSize/2;
    this.bodyLnHalf = this.bodyLength/2;
    this.curPath    = [];
    this.curWaypt   = 0;
    this.maxSpeed   = 2;
    this.maxForce   = 0.2;
    this.isSelected = false;

    this.initGFXVals();
    this.updateSP();
  }

  initGFXVals(){
    this.fill_reg = color(255)
    this.strk_reg = color(60);
    this.swgt_reg = 1;
    this.strk_sel = color(0,0,255);
    this.swgt_sel = 4;
  }

  // debating whether or not to keep this...
  getMapCell(){
    return this.map.cellViaPos(this.pos);
  }

  inSameCellAsMe(othCell){
    let myCell = this.map.cellViaPos(this.pos);
    return othCell[0]==myCell[0]&&othCell[1]==myCell[1];
  }



  givePath(path){
    this.curWaypt = 0;
    this.curPath = path;
  }


  update(){
    this.updateSP();
    this.gotoPath();
  }


  updateSP(){
    let newCoord = this.map.updatePos(this);
    if(newCoord != null){this.curCoord = newCoord;}    
  }

 
  gotoPath(){
    if(this.curWaypt<this.curPath.length){

      // Calculate 'proposed' next move 
      var des = p5.Vector.sub(this.curPath[this.curWaypt],this.pos);
      des.setMag(this.maxSpeed);
      var newPos = p5.Vector.add(this.pos,des);

      var oriDelta = p5.Vector.sub(des,this.ori);
      oriDelta.limit(this.maxForce);
      this.ori.add(oriDelta);

      // Clamp if it overshoots the waypoint
      if(p5.Vector.dist(this.pos,newPos) > p5.Vector.dist(this.pos,this.curPath[this.curWaypt]) ){
        newPos = this.curPath[this.curWaypt];
      }

      // At current waypoint (exactly xor clamped overshoot, and also means I never 'lose a frame' of movement)
      if(p5.Vector.dist(this.pos,newPos) == p5.Vector.dist(this.pos,this.curPath[this.curWaypt]) ){
        this.curWaypt++;
      }

      this.pos = newPos;
      //console.log(this.pos);
    }
    else{
      //console.log("curWaypt<curPath.length");
    }
  }
  

  gotoPathSimpleWorks(){
    if(this.curWaypt<this.curPath.length){

      var des = p5.Vector.sub(this.curPath[this.curWaypt],this.pos);

      this.pos = p5.Vector.add(this.pos,des);
      console.log(des);
      this.curWaypt++;
    }
  }

  render(){
    let theta = this.ori.heading()+(PI/2);

    fill(this.fill_reg);
    if(this.isSelected){stroke(this.strk_sel); strokeWeight(this.swgt_sel);}
    else{               stroke(this.strk_reg); strokeWeight(this.swgt_reg);}

    push();
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