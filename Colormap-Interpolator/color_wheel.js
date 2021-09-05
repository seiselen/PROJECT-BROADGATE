/*======================================================================
|>>> Class ColorWheel
+=====================================================================*/
class ColorWheel{
  constructor(pos, c1, c2, numSlices, inR, outR){
    this.pos     = pos;
    this.inRad   = inR;
    this.outRad  = outR;
    this.setColVals(c1,c2);    
    this.setNumSlices(numSlices);
  } // Ends Constructor

  setNumSlices(numSlices){
    this.nSlices = numSlices;
    this.tPcnt   = 1.0/this.nSlices;
    this.initVerts();
  } // Ends Function setNumBars

  setColVals(c1, c2){
    this.col1 = c1;
    this.col2 = c2;
  } // Ends Function setColVals

  initVerts(){
    // inner/outer Vertices for color slice trapezoids
    this.iVerts  = []; // inner vertices
    this.oVerts  = []; // outer vertices

    let deg = 0;
    let deltaDeg = 360/this.nSlices;
    for(let i=0; i<this.nSlices; i++){
      this.iVerts.push(createVector(this.trapzXPos(deg,this.inRad),this.trapzYPos(deg,this.inRad)));
      this.oVerts.push(createVector(this.trapzXPos(deg,this.outRad),this.trapzYPos(deg,this.outRad)));
      deg+=deltaDeg;
    }
  } // Ends Function initVerts

  // these assign vals WRT 'global origin' (i.e. does NOT use 'push/translate/pop' technique!)
  trapzXPos(d,r){return this.pos.x + r * cos(radians(d));}
  trapzYPos(d,r){return this.pos.y + r * sin(radians(d));}

  render(){
    strokeWeight(1);

    let j, curCol;
    for(let i = 0; i<this.nSlices; i++){
      j = (i<this.nSlices-1) ? i+1 : 0;
      this.setColorViaMode(i);
      quad(this.iVerts[i].x, this.iVerts[i].y, this.iVerts[j].x, this.iVerts[j].y, this.oVerts[j].x, this.oVerts[j].y, this.oVerts[i].x, this.oVerts[i].y);
    }
    stroke(255); strokeWeight(2); noFill();
    ellipse(this.pos.x,this.pos.y,(this.outRad+1)*2,(this.outRad+1)*2);
    ellipse(this.pos.x,this.pos.y,(this.inRad-1)*2,(this.inRad-1)*2);
  } // Ends Function render

  setColorViaMode(i){
    switch(curColMode){
      case ColorMode.RGB: this.setColorRGB(i); break;
      case ColorMode.HSB: this.setColorHSB(i); break;
      default: stroke(255,0,255); fill(255,0,255);
    }    
  } // Ends Function setColorViaMode

  setColorRGB(i){
    let lerpAmt = (i<this.nSlices/2) ? this.tPcnt*i*2 : 1-(i-(this.nSlices/2))*this.tPcnt*2;
    //let lerpAmt = this.tPcnt*i;
    let curCol = lerpColor(color(this.col1),color(this.col2),lerpAmt);
    stroke(curCol); fill(curCol);
  } // Ends Function setColorRGB

  setColorHSB(i){
    //let lerpAmt = (i<this.nSlices/2) ? (i*2)/this.nSlices: 1-(((i%(this.nSlices/2))*2)/this.nSlices);
    let lerpAmt = i/this.nSlices;
    let hueVal = lerp(int(this.col1[0]),int(this.col2[0]),lerpAmt);    
    stroke(hueVal,75,100);fill(hueVal,75,100);
  } // Ends Function setColorHSB

} // Ends Class ColorWheel