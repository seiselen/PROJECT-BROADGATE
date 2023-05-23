/** **EisBBox** ⯁ (**Eis**elen **B**ounding **Box**) */
class EisBBox{
  constructor(x1,y1,x2,y2){
    // t-form state
    this.pos = createVector(x1,y1);
    this.ept = createVector(x2,y2);
    this.dim = createVector(x2-x1,y2-y1);
    this.mpt = createVector(this.pos.x+(this.dim.x/2),this.pos.y+(this.dim.y/2));
    // vfx state
    this.strk_box = color(0,60,240,32);
    this.fill_box = color(0,60,240,32);
    this.swgt_box = 8;

    this.swgt_chr = 2;
    this.strk_chr = color(0,108,240,216);

    this.CHLenHf = min(this.dim.x,this.dim.y)/8;

    this.doFillBG = false;
    this.doShowCH = false;

  } // Ends Constructor

  toggleBGFill(){this.bgFill=!this.bgFill}

  toggleDispCrosshair(){this.dispCH=!this.dispCH}

  /** Return bounds encoding for Vert generator */
  getBoundsPC(){return {minX: this.pos.x, maxX: this.ept.x, minY: this.pos.y, maxY: this.ept.y}}

  /** Return bounds encoding for Voronoi generator */
  getBoundsVD(){return {xl: this.pos.x, xr: this.ept.x, yt: this.pos.y, yb: this.ept.y}}

  inBounds(x,y){return (x>=this.pos.x && x<=this.ept.x && y>=this.pos.y && y<=this.ept.y)}

  render(){this.renderRect(); if(this.doShowCH){this.renderCrosshair()}}

  renderRect(){
    strokeWeight(this.swgt_box);
    stroke(this.strk_box);
    (this.doFillBG) ? fill(this.fill_box) : noFill();
    rect(this.pos.x,this.pos.y,this.dim.x, this.dim.y);
  }

  renderCrosshair(){
    stroke(this.strk_chr); strokeWeight(this.swgt_chr);
    line(this.mpt.x,this.mpt.y-this.CHLenHf,this.mpt.x,this.mpt.y+this.CHLenHf);
    line(this.mpt.x-this.CHLenHf,this.mpt.y,this.mpt.x+this.CHLenHf,this.mpt.y);
  }

} // Ends Class BBox

export default EisBBox;