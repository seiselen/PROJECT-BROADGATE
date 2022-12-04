
// https://p5js.org/reference/#/p5/createGraphics
// ImageSlider will use [CORNER] as its basis
class ImageSlider{
  constructor(posX,posY,wide,tall){
    this.pos = vec2(posX,posY);
    this.dim = {wide:wide, tall:tall, wideH:wide/2, tallH:tall/2};

    this.img_L = null;
    this.img_R = null;
    this.img_dynam_grfx = null;
    this.img_dynam_wide = -1;

    this.img_dynam_alpha = 127;
    this.img_dynam_use_alpha = false;

    this.setDynamicImg(this.dim.wideH);

    this.dragPt = new DragPt(this.pos.x+this.dim.wideH,this.pos.y-24,this.dim.wide,this);
  }

  bindImageLeft(imgL){this.img_L=imgL; return this;}
  bindImageRight(imgR){this.img_R=imgR; return this;}
  bindImages(imgL,imgR){return this.bindImageLeft(imgL).bindImageRight(imgR);}

  setDynamicImg(newWidth){
    this.img_dynam_wide = newWidth;
    this.img_dynam_grfx = createGraphics(newWidth,this.dim.tall);
  }

  sliderPtHasMoved(xVal){
    this.setDynamicImg(constrain(xVal-this.pos.x,1,this.dim.wide-1));
  }
  
  setSliderToLeft(){
    this.dragPt.setPosTo(-9999);
  }
  
  setSliderToRight(){
    this.dragPt.setPosTo(9999);
  }  
  
  onMousePressed(){
    this.dragPt.onMousePressed();
  }
  
  onMouseDragged(){
    this.dragPt.onMouseDragged();
  }
  
  onMouseReleased(){
    this.dragPt.onMouseDragged();
  }
  
  render(){
    imageMode(CORNER);
  
    noFill(); stroke(255); strokeWeight(4); rect(this.pos.x,this.pos.y,this.dim.wide,this.dim.tall);


    if(this.img_R){
      image(this.img_R,this.pos.x,this.pos.y);
    }
  
    if(this.img_L&&this.img_dynam_grfx){
      this.img_dynam_grfx.image(this.img_L,0,0);
      if(this.img_dynam_use_alpha){tint(255,this.img_dynam_alpha);}
      image(this.img_dynam_grfx,this.pos.x,this.pos.y,this.img_dynam_wide,this.dim.tall);
      if(this.img_dynam_use_alpha){noTint();}
    }

  
    this.dragPt.render();
  }

}




class DragPt{
  constructor(posX,posY,range,owner){
    this.owner = owner;
    this.pos   = vec2(posX,posY);
    this.range = [posX-range/2,posX+range/2];
    this.rad   = 16;
    this.diam  = this.rad*2;
    this.radSq = this.rad*this.rad;
    this.lenBd = this.diam*4; // length bound
    this.msOff = vec2(); // mouseOffset
    this.initGFXVals();
  }

  initGFXVals(){
    this.regFill = color(253,141,60);
    this.hovFill = color(180,240,180);
    this.selFill = color(108,204,120);
    this.regStrk = color(60);
    this.selStrk = color(0,108,48);
    this.hovStrk = color(0,108,48);
    this.regSWgt = 1;
    this.hovSWgt = 2;
    this.selSWgt = 4;
  }

  setPosTo(val){
    this.pos.x = constrain(val, this.range[0], this.range[1]);
    this.owner.sliderPtHasMoved(this.pos.x);       
  }

  onMousePressed(){
    if(!this.mouseOverMe()){this.isSelected=false; return;}
    this.isSelected = true; 
    this.msOff=this.pos.x-mouseX;
  }

  onMouseDragged(){
    if(!this.isSelected){return;}
    this.pos.x = constrain(this.msOff+mouseX, this.range[0], this.range[1]);
    this.owner.sliderPtHasMoved(this.pos.x);
  }

  onMouseReleased(){
    if(!this.isSelected){return;} 
    this.isSelected=false;
  }

  mouseOverMe(){
    return distSq(mouseX,mouseY,this.pos.x,this.pos.y) <= this.radSq;
  }

  mousePressedOverMe(){
    return mouseIsPressed && this.mouseOverMe();
  }

  render(){
    this.renderBoundsLine();
    this.renderPt();
  }

  renderBoundsLine(){
    stroke(60);strokeWeight(10);line(this.range[0],this.pos.y,this.range[1],this.pos.y);
    stroke(255);strokeWeight(8);line(this.range[0],this.pos.y,this.range[1],this.pos.y);
  }

  renderPt(){
    if     (this.mousePressedOverMe()){stroke(this.selStrk); strokeWeight(this.selSWgt); fill(this.selFill); ellipse(this.pos.x, this.pos.y, this.diam-2);}
    else if(this.mouseOverMe())       {stroke(this.hovStrk); strokeWeight(this.hovSWgt); fill(this.hovFill); ellipse(this.pos.x, this.pos.y, this.diam-1);}
    else                              {stroke(this.regStrk); strokeWeight(this.regSWgt); fill(this.regFill); ellipse(this.pos.x, this.pos.y, this.diam);}
  }
} // Ends Class RegionPt 