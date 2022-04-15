class ImgStruct{
  constructor(i,n){
    this.name  = n; 
    this.image = i;
    this.wide  = i.width;
    this.tall  = i.height;
    this.parentDim  = null;
  }

  setParentDim(pDim){
    // if same dims, keep null (s.t. won't call <image> with redundant parms 
    if(this.wide == pDim.wide && this.tall == pDim.tall){return;}
    this.parentDim = pDim;
    return this;
  }

  render(){
    switch(this.parentDim==null){
      case true: image(this.image,0,0); break;
      case false: image(this.image,0,0,this.parentDim.wide, this.parentDim.tall); break;
    }
  }
} // Ends Class ImgStruct


class AnimStruct{
  constructor(){
    this.frames = [];
    this.curFrame   = 0;
    this.deltaFrame = 0;
    this.deltaSpeed = 8;
    this.parentDim  = null;
  }

  setParentDim(pDim){
    this.frames.forEach(frame=>frame.setParentDim(pDim));
  }

  setDeltaSpeed(newSpeed){
    this.deltaSpeed = newSpeed;
    return this;
  }

  addFrame(imgStruct){
    this.frames.push(imgStruct);
    return this;
  }

  addFrames(imgStructs){
    imgStructs.forEach(imgStruct=>this.addFrame(imgStruct));
    return this;
  }

  addFramesViaNames(imgStructNames){
    imgStructNames.forEach(name=>this.addFrame(images[name]));
    return this;
  }

  advance(){
    this.deltaFrame+=1; 
    if(this.deltaFrame == this.deltaSpeed){
      this.deltaFrame = 0; 
      this.curFrame = (this.curFrame+1)%this.frames.length;
    }
  }

  render(){
    this.frames[this.curFrame].render();
  }
} // Ends Class AnimStruct





class TexSlot{

  constructor(p,w,t){
    this.item = null;
    this.wide = w;
    this.tall = t;
    this.pos  = p;

    this.mouseOffst = vec2(0,0);
    this.preMovePos = null;
    this.isSelected = false;
    this.mouseHover = false;

    this.initGFX();
  }

  initGFX(){
    this.strk_reg = color(0,255,0,128);
    this.strk_sel = color(0,255,0);
    this.fill_hov = color(255,64);
    this.sWgt_reg = 1;
    this.sWgt_sel = 3;
  }

  bindItem(someStruct){
    this.item = someStruct;
    someStruct.setParentDim({wide:this.wide, tall:this.tall});
  }


  ptInBoundRect(pt){
    return (pt.x>this.pos.x && pt.x<(this.pos.x+this.wide) && pt.y>this.pos.y && pt.y<(this.pos.y+this.tall));
  }

  /*--------------------------------------------------------------------
  |>>> Function collidesWith 
  +---------------------------------------------------------------------
  | Overview: Performs a 'Rectangle-on-Rectangle' collision test between
  |           this TexSlot and another; as utilized to prevent them from
  |           overlapping in [CLUSTER] mode. Sans name/parm changes, the 
  |           main difference between my version and the original source
  |           is that I constrain the comparison operators to STRICTLY 
  |           less/greater than, since the edges of slots are CERTAINLY
  |           permitted to collide with each other!
  | Source:   > jeffreythompson.org/collision-detection/rect-rect.php
  | Input:    > othr: instanceof [TexSlot]
  | Output:   > boolean s.t. [true]->[collision] / [false]->[no collision]  
  +-------------------------------------------------------------------*/
  collidesWith(othr){
    return ((this.pos.x+this.wide) > othr.pos.x && this.pos.x < (othr.pos.x+othr.wide) && (this.pos.y+this.tall) > othr.pos.y && this.pos.y < (othr.pos.y+othr.tall));
  } // Ends Function collidesWith

  onMouseHover(mousePt){
    if(this.ptInBoundRect(mousePt)){
      if(!this.mouseHover){this.mouseHover=true;}
      return;
    }
    if(this.mouseHover){this.mouseHover=false; return;}
  }


  onMousePressed(mousePt){
    if(this.ptInBoundRect(mousePt)){
      this.isSelected = true;
      this.preMovePos = this.pos.copy();
      this.mouseOffst = p5.Vector.sub(this.pos,mousePt);
      return this;
    }
    return null;
  }


  onMouseDragged(mousePt){
    if(this.isSelected){
      this.pos.set(p5.Vector.add(this.mouseOffst,mousePt));
    }
  }


  onMouseReleased(mousePt){
    if(!this.isSelected){return;}
    this.isSelected = false;

    //let othrSlot = null;
    //for(let i=0; i<texSlots.length; i++){
    //  othrSlot = texSlots[i];
    //  console.log()
    //}


    switch(texSlots.every(slot=>(slot==this || !slot.collidesWith(this)))){
      case true:  this.snapToNewPos(); return;
      case false: this.snapToOldPos(); return;
    }
  }


  snapToOldPos(){
    this.pos.set(this.preMovePos)
  }


  snapToNewPos(){
    this.pos.set(round(this.pos.x/Config.snapDim)*Config.snapDim , round(this.pos.y/Config.snapDim)*Config.snapDim);
  }


  render(){
    push();
    translate(this.pos.x, this.pos.y);
    if(this.isSelected){stroke(this.strk_sel); strokeWeight(this.sWgt_sel);}
    else if(Config.renderBBoxIfNotSel){stroke(this.strk_reg); strokeWeight(this.sWgt_reg);}
    else{noStroke();}
    noFill();
    rect(0,0,this.wide,this.tall);
    if(this.item){this.item.render();}
    if(this.mouseHover){noStroke();fill(this.fill_hov);rect(0,0,this.wide,this.tall);}
    pop();
  }

} // Ends Class TexStruct







class CompareSlider{
  constructor(){
    this.sliderPos   = vec2(Config.canvWide/2,32);
    this.sliderPinD  = 32;
    this.sliderPinR  = this.sliderPinD/2;
    this.mouseOffst  = vec2(0,0);
    this.isSelected  = false;

    this.fill_pinReg = color(255);
    this.fill_pinSel = color(120);
    this.strk_slider = color(0);
    this.sWgt_pin    = 4;
    this.sWgt_line   = 1;
  }

  ptInBoundCirc(pt){
    return (p5.Vector.dist(pt,this.sliderPos) <= this.sliderPinR);
  }

  onMousePressed(mousePt){
    mousePt.y = this.sliderPos.y;
    if(!this.ptInBoundCirc(mousePt)){return;}
    this.isSelected = true;
    this.mouseOffst = p5.Vector.sub(this.sliderPos,mousePt);
  }

  onMouseDragged(mousePt){
    mousePt.y = this.sliderPos.y;
    if(!this.isSelected){return;}
    this.sliderPos.set(p5.Vector.add(this.mouseOffst,mousePt));
  }

  onMouseReleased(mousePt){
    if(!this.isSelected){return;}
    this.isSelected = false;
  }

  render(){
    this.renderLine();
    this.renderPin();
  }
 
  renderPin(){
    stroke(this.strk_slider);strokeWeight(this.sWgt_pin);
    if (this.isSelected) {fill(this.fill_pinSel);} else{fill(this.fill_pinReg);}
    ellipse(this.sliderPos.x,this.sliderPos.y,this.sliderPinD,this.sliderPinD);
  }

  renderLine(){
    stroke(this.strk_slider);strokeWeight(this.sWgt_line);
    line(this.sliderPos.x, this.sliderPos.y, this.sliderPos.x, Config.canvTall)
  }

} // Ends Class CompareSlider