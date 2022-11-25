/*======================================================================
|>>> Class ColorWheel
+=====================================================================*/
class ColorWheel{
  constructor(pos, iRad, oRad, config){
    this.pos    = pos;
    this.inRad  = iRad;
    this.outRad = oRad;
    this.colors = config.curColors;
    this.resCfg = config.curResCfg;
    this.onStateChanged();
  } // Ends Constructor

  onStateChanged(){
    this.deltaDeg = 360/this.resCfg.value;
    this.initVerts();
  }

  initVerts(){
    // inner/outer Vertices for color slice trapezoids
    this.iVerts  = []; // inner vertices
    this.oVerts  = []; // outer vertices

    let deg = 0;

    for(let i=0; i<this.resCfg.value; i++){
      this.iVerts.push(createVector(this.trapzXPos(deg,this.inRad),this.trapzYPos(deg,this.inRad)));
      this.oVerts.push(createVector(this.trapzXPos(deg,this.outRad),this.trapzYPos(deg,this.outRad)));
      deg+=this.deltaDeg;
    }
  } // Ends Function initVerts

  // these assign vals WRT 'global origin' (i.e. does NOT use 'push/translate/pop' technique!)
  trapzXPos(d,r){return this.pos.x + r * cos(radians(d));}
  trapzYPos(d,r){return this.pos.y + r * sin(radians(d));}


  setColorRGB(i){
    let lerpAmt = (i<this.resCfg.valueH) ? this.resCfg.tPcnt*i*2 : 1-(i-(this.resCfg.valueH))*this.resCfg.tPcnt*2;
    let curCol = lerpColor(color(this.colors.fill_p),color(this.colors.fill_q),lerpAmt);
    stroke(curCol); fill(curCol);
  } // Ends Function setColorRGB


  render(){
    this.renderSlices();
    this.renderEdges();
  }


  renderSlices(){
    for(let i=0, j=0; i<this.resCfg.value; i++){
      j = (i<this.resCfg.value-1) ? i+1 : 0;
      this.setColorRGB(i);
      quad(this.iVerts[i].x, this.iVerts[i].y, this.iVerts[j].x, this.iVerts[j].y, this.oVerts[j].x, this.oVerts[j].y, this.oVerts[i].x, this.oVerts[i].y);
    }
  }

  renderEdges(){
    noFill();
    stroke(this.colors.strk_e); 
    strokeWeight(this.colors.swgt_e); 

    //this.renderEdges_asLines();
    this.renderEdges_asShapes();
  }

  renderEdges_asLines(){
    strokeCap(ROUND);
    for(let i=0, j=0; i<this.resCfg.value; i++){
      j = (i<this.resCfg.value-1) ? i+1 : 0;
      line(this.iVerts[i].x, this.iVerts[i].y, this.iVerts[j].x, this.iVerts[j].y);
      line(this.oVerts[j].x, this.oVerts[j].y, this.oVerts[i].x, this.oVerts[i].y);
    }
  }

  renderEdges_asShapes(){
    strokeJoin(ROUND);
    beginShape();
    for(let i=0, j=0; i<this.resCfg.value; i++){
      j = (i<this.resCfg.value-1) ? i+1 : 0;
      vertex(this.iVerts[i].x, this.iVerts[i].y);
      vertex(this.iVerts[j].x, this.iVerts[j].y);
    }
    endShape();
    beginShape();
    for(let i=0, j=0; i<this.resCfg.value; i++){
      j = (i<this.resCfg.value-1) ? i+1 : 0;
      vertex(this.oVerts[i].x, this.oVerts[i].y);
      vertex(this.oVerts[j].x, this.oVerts[j].y);
    }
    endShape();
  }

} // Ends Class ColorWheel