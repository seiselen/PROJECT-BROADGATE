/*======================================================================
|>>> Class ColorBar
+=====================================================================*/
class ColorBar{
  constructor(pos,c1,c2,numBars,barWide,barTall){
    this.pos   = pos;
    this.bWide = barWide;
    this.bTall = barTall;
    this.setColVals(c1,c2);
    this.setNumBars(numBars);
  } // Ends Constructor

  setNumBars(nBars){
    this.nBars = nBars;
    this.cWide = this.bWide/this.nBars;
    this.cPcnt = 1.0/this.nBars;      
  } // Ends Function setNumBars

  setColVals(c1, c2){
    this.col1 = c1;
    this.col2 = c2;
  } // Ends Function setColVals

  render(){
    push();
      translate(this.pos.x,this.pos.y);
      let buffCol;
      for (var i = 0; i < this.nBars; i++) {
        this.setColorViaMode(i);
        rect(this.cWide*i,0,this.cWide,this.bTall);
      }
      stroke(255); strokeWeight(2); noFill();
      rect(-1,-1,this.bWide+1,this.bTall+1);
    pop();
  } // Ends Function render

  setColorViaMode(i){
    switch(curColMode){
      case ColorMode.RGB: this.setColorRGB(i); break;
      case ColorMode.HSB: this.setColorHSB(i); break;
      default: stroke(255,0,255); fill(255,0,255);
    }    
  } // Ends Function setColorViaMode

  setColorRGB(i){
    let curCol = lerpColor(color(this.col1),color(this.col2),this.cPcnt*i);
    stroke(curCol); fill(curCol);
  } // Ends Function setColorRGB

  setColorHSB(i){
    let hueVal = lerp(int(this.col1[0]),int(this.col2[0]),i/this.nBars);    
    stroke(hueVal,75,100);fill(hueVal,75,100);
  } // Ends Function setColorHSB

} // Ends Class ColorBar