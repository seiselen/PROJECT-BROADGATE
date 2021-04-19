var CellType = {
  VACANT: 0,
  FILLED: 1,
  ERROR: -1
}

class GridMap{
  constructor(pos, rows, cols, cSize){
    this.pos   = pos;
    this.rows  = rows;
    this.cols  = cols;
    this.cSize = cSize;
    this.map   = [];
    this.resetMap();

    this.vacantCol = null; // null -> noFill()
    this.filledcol = color(180,0,0);
    this.strokeCol = color(240,127);
  } // Ends Constructor

  // INVALID INPUT NOT HANDLED - USE AT OWN RISK!
  setColor(col,op){
    switch(op){
      case 'v': this.vacantCol = col; break;
      case 'f': this.filledcol = col; break;
      case 's': this.strokeCol = col; break;      
    }
    return this; // need this per 'chain initialization'
  } // Ends Function setColor

  resetMap(){
    for (var r = 0; r < this.rows; r++) {
      this.map[r]=[];
      for (var c = 0; c < this.cols; c++) {
        this.map[r][c] = CellType.VACANT;
      }
    }    
  } // Ends Function resetMap

  setCellsToFilled(cells){
    for (var i = 0; i < cells.length; i++){this.setToFilled(cells[i]);}
  } // Ends Function setCellsToFilled

  setCellsToVacant(cells){
    for (var i = 0; i < cells.length; i++){this.setToVacant(cells[i]);}
  } // Ends Function setCellsToVacant

  // could improve logic, but K.I.S.S. and #YOLO
  toggleCellAtPos(pos){
    let c = this.posToCoord(pos);
    if(!this.isValidCell(c)){return;}
    if(this.map[c[0]][c[1]] == CellType.VACANT){this.setToFilled(c);}
    else if(this.map[c[0]][c[1]] == CellType.FILLED){this.setToVacant(c);}
  } // Ends Function toggleCellAtPos

  // no longer used as of writing this comment, but keeping J.I.C.
  setCellAtPosToFilled(pos){this.setToFilled(this.posToCoord(pos));}
  setCellAtPosToVacant(pos){this.setToVacant(this.posToCoord(pos));}

  setToFilled(cell){
    this.map[cell[0]][cell[1]] = CellType.FILLED;
  } // Ends Function setToFilled

  setToVacant(cell){
    this.map[cell[0]][cell[1]] = CellType.VACANT;
  } // Ends Function setToVacant

  // Determines if a row and col are in valid range of grid map <TODO: Rename 'cellInBounds' ?>
  isValidCell(coord){
    return (coord[0] >= 0 && coord[0] < this.rows && coord[1] >= 0 && coord[1] < this.cols);
  } // Ends Function isValidCell

  isVacantCell(coord){
    return (this.map[coord[0]][coord[1]]==CellType.VACANT);
  }

  // good example of short-circuit logical AND (i.e. to implicitly handle invalid coords)!
  isValidVacantCell(coord){
    return (this.isValidCell(coord) && this.isVacantCell(coord));
  }


  // (round(this.pos.y/CELL_SIZE)*CELL_SIZE);
  // Converts p5.Vector of position (as [x,y,z]) into its cell coordinate in this map's local space (as [row,col])
  posToCoord(pos){
    console.log(pos);
    let tempRow = floor((pos.y-this.pos.y)/CELL_SIZE);
    let tempCol = floor((pos.x-this.pos.x)/CELL_SIZE);

    console.log(tempRow+","+tempCol);

    return [tempRow,tempCol];
  } // Ends Function posToCoord

  // supporting for dim={1,2,3}. Can make this procedural for any dim, but K.I.S.S. for now...
  coordToPos(row,col,dim){
    switch(dim){
      case 2: return createVector(this.pos.x+((col+1)*this.cSize), this.pos.y+((row+1)*this.cSize));
      default: return createVector(this.pos.x+(col*this.cSize), this.pos.y+(row*this.cSize));
    }
  }

  render(){
    var temp;
    strokeWeight(1);
    stroke(this.strokeCol);

    for(var r=0; r<this.rows; r++){
      for(var c=0; c<this.cols; c++){
        temp = this.map[r][c];
        if(temp == CellType.VACANT) {if(this.vacantCol == null){noFill();}else{fill(this.vacantCol);}}
        else if(temp == CellType.FILLED) {fill(this.filledcol);}
        rect(this.pos.x+(c*this.cSize), this.pos.y+(r*this.cSize),this.cSize,this.cSize);
      }
    }
  } // Ends Function render

} // Ends Class GridMap