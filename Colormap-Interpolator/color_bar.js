/*======================================================================
|>>> Class ColorBar
+=====================================================================*/
class ColorBar{
  constructor(pos,barWide,barTall,config){
    this.pos    = pos;
    this.bWide  = barWide;
    this.bTall  = barTall;
    this.colors = config.curColors;
    this.resCfg = config.curResCfg;
    this.onStateChanged();
  } // Ends Constructor

  onStateChanged(){
    this.cWide = this.bWide/this.resCfg.value;     
  } // Ends Function setNumBars

  render(){
    push();
      translate(this.pos.x,this.pos.y);
      rotate(DEG_TO_RAD*90);
      this.renderSlots();
      this.renderBar();
    pop();
  } // Ends Function render
  
  renderSlots(){
    strokeWeight(this.colors.swgt_c);     
    for (var i = 0; i < this.resCfg.value; i++) {
      this.curColor = lerpColor(
        this.colors.fill_p,
        this.colors.fill_q,
        this.resCfg.tPcnt*i
      );
      stroke(this.curColor); 
      fill(this.curColor);     
      rect(this.cWide*i,0,this.cWide,this.bTall);
    }    
  }

  renderBar(){      
    stroke(this.colors.strk_e); 
    strokeWeight(this.colors.swgt_e); 
    noFill();
    rect(-1,-1,this.bWide+1,this.bTall+1);
  }

} // Ends Class ColorBar