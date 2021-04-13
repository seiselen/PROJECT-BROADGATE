
class ColorBar{
  /*--------------------------------------------------------------------
  |> Variable Descriptions/Details:
  |  > pos   - position of the colorbar, 'Nuff Said
  |  > colL  - lefthand color, from which to interpolate throughout the
  |            colormap viz into the righthand color
  |  > colR  - righthand color, as explained in the aforementioned desc.
  |  > nBars - number of color bars to show, i.e. level-of-detail for
  |            the colormap viz. obviously has implicit/explicit bounds
  |  > bWide - width of ENTIRE color bar, such that width of component
  |            bars (i.e. for each color in map) will be [bWide/nBars]
  |  > bTall - height of ENTIRE color bar, should be specified by caller
  |  > cWide - component bar width, as explained in aforementioned desc.
  |  > cPcnt - division of 100 into nBars, to determine lerp value for
  |            each component bar as described in the aforementioned.  
  +-------------------------------------------------------------------*/
  constructor(pos,colL,colR,numBars,barWide,barTall){
    this.pos  = pos;
    this.colL = colL;
    this.colR = colR;
    this.nBars = numBars;
    this.bWide = barWide;
    this.bTall = barTall;
    this.cWide = this.bWide/this.nBars;
    this.cPcnt = 1.0/this.nBars;
  }

  // per usual: reset it and any other state deriving thereof
  setNumBars(nBars){
    this.nBars = nBars;
    this.cWide = this.bWide/this.nBars;
    this.cPcnt = 1.0/this.nBars;      
  }

  setColBound(col,side){
    switch(side){
      case 'l': this.colL = col; break;
      case 'r': this.colR = col; break;
      default: console.log("setColBound: input ["+side+"] invalid for 'side' parm!");
    }
  } // Ends Function setColBound

  setColBounds(col1, col2){
    this.setColBound(col1,'l');
    this.setColBound(col2,'r');
  }

  render(){
    push();
      translate(this.pos.x,this.pos.y);
      let buffCol;
      for (var i = 0; i < this.nBars; i++) {
        buffCol = lerpColor(this.colL,this.colR,this.cPcnt*i);
        stroke(buffCol); fill(buffCol); // QAD solution for 'pixel perfect'
        rect(this.cWide*i,0,this.cWide,this.bTall);
      }
      stroke(0); noFill();
      rect(0,0,this.bWide,this.bTall);
    pop();
  } // Ends Function render

}