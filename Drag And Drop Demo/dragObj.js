
// CAN ONLY SUPPORT CIRCLE (i.e. [N*N]) SHAPES IN TIME FOR 4/15 DISCUSSION
class DragObject{
  constructor(pos,cX,cY){
    this.pos = pos;
    this.cWide = cX;
    this.cTall = cY;

    // Variables and init method for diameter/radius
    this.diam = -1;
    this.radi = -1;
    this.setDiam();

    // Variables for [Mouse] Selection/Moving
    this.isSelected = false;
    this.mOffset;

    // Colors
    this.regCol = color(0,216,0);
    this.selCol = color(0,216,0,127);
    this.strCol = color(60);
  }


  setDiam(){
    this.diam = this.cWide*CELL_SIZE;
    this.radi = this.diam/2;
  }

  ptInBoundCirc(pt){
    return (p5.Vector.dist(pt,this.pos) <= this.radi);
  }

  onMousePressed(mousePt){
    if(this.ptInBoundCirc(mousePt)){
      this.isSelected = true;
      // capture offset between mouse and pos at moment of selection
      this.mOffset = p5.Vector.sub(this.pos,mousePt);
    }
  }

   onMouseDragged(mousePt){
    if(this.isSelected){
      // supports moving vertex WRT mouse pos at onMousePressed
      this.pos.set(p5.Vector.add(this.mOffset,mousePt));
    }
  }

  onMouseReleased(){
    this.isSelected = false;
  } 

  render() {
    stroke(this.strCol);strokeWeight(2);
    if (this.isSelected) {fill(this.selCol);} else{fill(this.regCol);}
    ellipse(this.pos.x,this.pos.y,this.diam,this.diam);
  }

}