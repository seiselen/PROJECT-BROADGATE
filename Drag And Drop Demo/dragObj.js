
// CAN ONLY SUPPORT CIRCLE (i.e. [N*N]) SHAPES IN TIME FOR 4/15 DISCUSSION
class DragObject{
  constructor(dim,pos,mrc){
    this.pos = pos;
    this.mrc = mrc;
    this.cWide = dim;
    this.cTall = dim;
    this.dim   = dim;

    // Variables and init method for diameter/radius
    this.diam = -1;
    this.radi = -1;
    this.setDiam();

    // Variables for [Mouse] Selection/Moving
    this.isSelected = false;
    this.mOffset;

    this.objDragCpt;

    // Colors
    this.regCol = color(0,216,0);
    this.selCol = color(0,216,0,127);
    this.strCol = color(60);
  }

  setPos(pos){
    this.pos = pos;
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
      return this;
    }
    return null;
  }

   onMouseDragged(mousePt){
    if(this.isSelected){
      // supports moving vertex WRT mouse pos at onMousePressed
      this.pos.set(p5.Vector.add(this.mOffset,mousePt));
    }
  }

  onMouseReleased(mousePt){
    if(this.isSelected){
      this.isSelected = false;

      this.snapToCell();

      console.log(this.pos);

      // Get destination map[row][col] thereof
      let qMap = null;
      let qRow = null;
      let qCol = null;


      let adjPos = createVector(this.pos.x-1, this.pos.y-1);

      // this should be a global method in 'dragDrop.js' (or renamed/equivalent)
      let objCoordB = mapB.posToCoord(adjPos);
      console.log(objCoordB);

      let objCoordO = mapO.posToCoord(adjPos);
      console.log(objCoordO);


      if(mapB.isValidCell(objCoordB)){qMap = mapB; qRow = objCoordB[0]; qCol = objCoordB[1];}
      if(mapO.isValidCell(objCoordO)){qMap = mapO; qRow = objCoordO[0]; qCol = objCoordO[1];}


      if (qMap==null) {
        this.snapToCell(this.mrc[0].coordToPos(this.mrc[1],this.mrc[2],this.dim));
        return null;      
      }



      for (var r = qRow; r < qRow+this.dim; r++) {
        for (var c = qCol; c < qCol+this.dim; c++) {
          if (!qMap.isValidVacantCell([r,c])){
            this.snapToCell(this.mrc[0].coordToPos(this.mrc[1],this.mrc[2],this.dim));
            console.log("hi");
            return null;
          }
        }
      }

      //>>> New position is possible! Start the 'transaction'...
 


      // (2) vacate existing map cells
      let curMap = this.mrc[0];
      let curRow = this.mrc[1];
      let curCol = this.mrc[2];

      for (var r = curRow; r < curRow+this.dim; r++) {
        for (var c = curCol; c < curCol+this.dim; c++) {
          curMap.setToVacant([r,c]);
        }
      }


      // (3) set new map[row][col]
      this.mrc[0] = qMap;
      this.mrc[1] = qRow;
      this.mrc[2] = qCol;      

      // (4) fill new map cells
      curMap = this.mrc[0];
      curRow = this.mrc[1];
      curCol = this.mrc[2];

      for (var r = curRow; r < curRow+this.dim; r++) {
        for (var c = curCol; c < curCol+this.dim; c++) {
          curMap.setToFilled([r,c]);
        }
      }
    }
  }

  snapToCell(newPos=null){
    if(newPos == null){
      this.pos.x = (round(this.pos.x/CELL_SIZE)*CELL_SIZE);
      this.pos.y = (round(this.pos.y/CELL_SIZE)*CELL_SIZE);
    }
    else{
      this.pos.x = (round(newPos.x/CELL_SIZE)*CELL_SIZE);
      this.pos.y = (round(newPos.y/CELL_SIZE)*CELL_SIZE);      
    }


  }

  render() {
    stroke(this.strCol);strokeWeight(2);
    if (this.isSelected) {fill(this.selCol);} else{fill(this.regCol);}
    ellipse(this.pos.x,this.pos.y,this.diam,this.diam);

    
    fill(0,0,255);
    ellipse(this.pos.x,this.pos.y,5,5);


  }

}