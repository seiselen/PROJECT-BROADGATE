
// CAN ONLY SUPPORT CIRCLE (i.e. [N*N]) SHAPES IN TIME FOR 4/19 DISCUSSION

//>>> QAD VARS
// mOffset - Captures offset between mouse and pos at moment of selection.
//           Supports moving vertex WRT mouse pos at onMousePressed.

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
      this.mOffset = p5.Vector.sub(this.pos,mousePt);
      return this;
    }
    return null;
  }

   onMouseDragged(mousePt){
    if(this.isSelected){
      this.pos.set(p5.Vector.add(this.mOffset,mousePt));
    }
  }

  onMouseReleased(mousePt){
    if(this.isSelected){
      this.isSelected = false;

      this.snapToCell(this.pos);

      // Needed to avoid issue where snapping to CELL_WIDE puts 2x2 in prev row/col
      let adjPos = createVector(this.pos.x-1, this.pos.y-1);

      // Get MRC (map[row][col]) encompassing this new possible position
      let newMRC = getMRC(adjPos,this.dim);
      let qMap = newMRC[0];
      let qRow = newMRC[1];
      let qCol = newMRC[2];


      if(this.dim == 1){

        if (qMap==null || !qMap.isValidVacantCell([qRow,qCol])) {
          this.snapToCell(this.mrc[0].coordToPos(this.mrc[1],this.mrc[2],this.dim));
          return null;
        }

        // Set current cell to 'VACANT'
        this.mrc[0].setToVacant([this.mrc[1],this.mrc[2]]);
        // Reset MRC to new location
        this.mrc = [qMap,qRow,qCol];
        // Set new cell to 'FILLED'
        this.mrc[0].setToFilled([this.mrc[1],this.mrc[2]]);

      } // Ends Handling | dim = 1x1


      else if(this.dim == 2){

        if (qMap==null) {
          this.snapToCell(this.mrc[0].coordToPos(this.mrc[1],this.mrc[2],this.dim));
          return null;      
        }

        for (var r = qRow; r < qRow+this.dim; r++) {
          for (var c = qCol; c < qCol+this.dim; c++) {
            if (!qMap.isValidVacantCell([r,c])){
              this.snapToCell(this.mrc[0].coordToPos(this.mrc[1],this.mrc[2],this.dim));
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
      } // Ends Handling | dim = 2x2

    } // Ends handling if THIS is the selected object
  } // Ends Function OnMouseReleased


  snapToCell(newPos=null){

    if(this.dim == 1){
      this.pos.x = (floor(newPos.x/CELL_SIZE)*CELL_SIZE)+(CELL_SIZE/2);
      this.pos.y = (floor(newPos.y/CELL_SIZE)*CELL_SIZE)+(CELL_SIZE/2);
    }

    if(this.dim == 2){
      this.pos.x = (round(newPos.x/CELL_SIZE)*CELL_SIZE);
      this.pos.y = (round(newPos.y/CELL_SIZE)*CELL_SIZE);
    }
  }

  render() {
    stroke(this.strCol);strokeWeight(2);
    if (this.isSelected) {fill(this.selCol);} else{fill(this.regCol);}
    ellipse(this.pos.x,this.pos.y,this.diam,this.diam);
  }

}