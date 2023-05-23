
class CanvasUtil{
  constructor(cWide,cTall,in_vertUtil){
    this.tform = {tall:cTall, tallHf:cTall/2, wide:cWide, wideHf:cWide/2};
    this.ttDim = {tall:24, wide:108};
    this.colBD  = color(60);
    this.colGD  = color(64,32);
    this.dimGD  = 10;

    this.vertUtil = in_vertUtil;

    this.initStyles();
  }

  initStyles(){
    this.cursOff   = 4;
    this.cursOff2x = this.cursOff*2;
    this.curs_strk = color(0,12,24,128);
    this.curs_swgt = 2;
    this.curs_diam = 12;
    this.text_swgt = 1;
    this.text_size = 18;

    this.numVertsTextPos = {x:120, y:height-15}
    this.dispFPSTextPos  = { x:16, y:height-15}    
  }

  render(){
    this.renderFPSSimple();
    this.renderNumVerts();
  }
  
  lateRender(){    
    this.drawCursor();
    this.drawMousePosTooltip();  
  }

  drawCursor(){
    if(!mouseInCanvas){return}
    let mVec = mousePtToVec();
    noFill();
    stroke(this.curs_strk);
    strokeWeight(this.curs_swgt); 
    circle(mVec.x, mVec.y, this.curs_diam);
    line(mVec.x-this.cursOff,mVec.y,mVec.x-this.cursOff2x,mVec.y);
    line(mVec.x+this.cursOff,mVec.y,mVec.x+this.cursOff2x,mVec.y);
    line(mVec.x,mVec.y-this.cursOff,mVec.x,mVec.y-this.cursOff2x); 
    line(mVec.x,mVec.y+this.cursOff,mVec.x,mVec.y+this.cursOff2x);
  }


  drawMousePosTooltip(){
    if(!mouseInCanvas()){return}
    let mVec = mousePtToVec();
    let x1 = (mVec.x+this.ttDim.wide>width) ? mVec.x-this.ttDim.wide : mVec.x;
    let y1 = (mVec.y+this.ttDim.tall>height) ? mVec.y-this.ttDim.tall : mVec.y;
    let xOff = mVec.x;
    let yOff = mVec.y;
    switch(x1==mVec.x){
      case true: xOff+=6; textAlign(LEFT); break;
      case false: xOff-=6; textAlign(RIGHT);
    }
    switch(y1==mVec.y){case true: yOff+=12; break; case false: yOff-=12;}
    textSize(this.text_size);
    stroke(0);
    strokeWeight(4);
    fill(255);
    text("("+mVec.x+","+mVec.y+")",xOff,yOff);
  }

  renderFPSSimple(blurb="FPS: "){textSize(this.text_size); textAlign(LEFT,CENTER); strokeWeight(this.text_swgt); stroke(this.colBD); fill(this.colBD); text(blurb+round(frameRate()), this.dispFPSTextPos.x, this.dispFPSTextPos.y);}
  renderNumVerts(blurb="# Verts: "){textSize(this.text_size); textAlign(LEFT,CENTER); strokeWeight(this.text_swgt); stroke(this.colBD); fill(this.colBD); text(blurb+round(this.vertUtil.getNumVerts()), this.numVertsTextPos.x, this.numVertsTextPos.y);}

} // Ends Class CanvasUtil

export default CanvasUtil;