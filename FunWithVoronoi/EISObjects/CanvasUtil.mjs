const BLURB_FPS_PREFIX = "FPS: ";
const CUR_SITES_PREFIX = "Sites: ";

import { setStyle } from "../utils.mjs";

class CanvasUtil{
  constructor(cWide,cTall){
    this.tform = {tall:cTall, tallHf:cTall/2, wide:cWide, wideHf:cWide/2};
    this.ttDim = {tall:24, wide:108};
    this.colBD  = color(60);
    this.colGD  = color(64,32);
    this.dimGD  = 10;
    //> Local state of observed extern state
    this.local_numVDSites = undefined;
    //> For My (Stupid) VFX
    this.curRot = 0;
    this.rotVel = 2;
    this.initStyles();
  }

  initStyles(){
    this.curs_diam = 24;
    this.chOff_out = this.curs_diam/4; //> i.e. 1/2 radius
    this.chOff_ept = this.chOff_out*3; //> i.e. 1/2 radius plus radius for endpoint outwards
    this.curs_strk = color(255);
    this.shad_strk = color(0);    
    this.curs_swgt = 2;
    this.shad_swgt = 4;    

    this.tbox_swgt = 1;
    this.tbox_size = 18;

    this.ttip_fill = color(255);
    this.ttip_strk = color(0);
    this.ttip_swgt = 4;
    this.ttip_offX = 8; // mouse coord tooltip offset
    this.ttip_offY = this.ttip_offX*2;

    this.numVertsTextPos = {x:120, y:height-15}
    this.dispFPSTextPos  = { x:16, y:height-15}    
  }

  callback_numVDSites(nSites){this.local_numVDSites = nSites}
  
  toString_numVDSites(){return this.local_numVDSites ?? "N/A"}

  updateCHRot(){this.curRot=(this.curRot+this.rotVel)%360}

  render(){
    this.updateCHRot(); // naughty, but meh harmless for a tiny VFX thing
    this.renderFPSSimple();
    this.renderNumVerts(); 
    this.drawCursor();
    this.drawMousePosTooltip();  
  }

  drawCursor(){
    if(!mouseInCanvas){return}
    let mVec = mousePtToVec();
    push();
    translate(mVec.x,mVec.y);
    setStyle(undefined,this.shad_strk,this.shad_swgt);
    circle(0,0,this.curs_diam);
    setStyle(undefined,this.curs_strk,this.curs_swgt);
    circle(0,0,this.curs_diam);
    rotate(radians(this.curRot));
    setStyle(undefined,this.shad_strk,this.shad_swgt);
    line(-this.chOff_out,0,-this.chOff_ept,0);
    line(+this.chOff_out,0,+this.chOff_ept,0);
    line(0,-this.chOff_out,0,-this.chOff_ept);
    line(0,+this.chOff_out,0,+this.chOff_ept);
    setStyle(undefined,this.curs_strk,this.curs_swgt);
    line(-this.chOff_out,0,-this.chOff_ept,0);
    line(+this.chOff_out,0,+this.chOff_ept,0);
    line(0,-this.chOff_out,0,-this.chOff_ept);
    line(0,+this.chOff_out,0,+this.chOff_ept);
    pop();
  }

  drawMousePosTooltip(){
    if(!mouseInCanvas()){return}
    let mVec = mousePtToVec();
    let x1 = (mVec.x+this.ttDim.wide>width) ? mVec.x-this.ttDim.wide : mVec.x;
    let y1 = (mVec.y+this.ttDim.tall>height) ? mVec.y-this.ttDim.tall : mVec.y;
    let xOff = mVec.x;
    let yOff = mVec.y;
    switch(x1==mVec.x){
      case true: xOff+=this.ttip_offX; textAlign(LEFT); break;
      case false: xOff-=this.ttip_offX; textAlign(RIGHT);
    }
    switch(y1==mVec.y){
      case true: yOff+=this.ttip_offY; break;
      case false: yOff-=this.ttip_offY;
    }
    textSize(this.text_size);
    setStyle(this.ttip_fill,this.ttip_strk,this.ttip_swgt);
    text("("+mVec.x+","+mVec.y+")",xOff,yOff);
  }

  renderFPSSimple(){
    textSize(this.tbox_size);
    textAlign(LEFT,CENTER);
    setStyle(this.colBD,this.colBD,this.tbox_swgt);
    text(BLURB_FPS_PREFIX+round(frameRate()), this.dispFPSTextPos.x, this.dispFPSTextPos.y);
  }

  renderNumVerts(){
    textSize(this.tbox_size);
    textAlign(LEFT,CENTER);
    setStyle(this.colBD,this.colBD,this.tbox_swgt);
    text(CUR_SITES_PREFIX+round(this.toString_numVDSites()),this.numVertsTextPos.x, this.numVertsTextPos.y);
  }

} // Ends Class CanvasUtil

export default CanvasUtil;