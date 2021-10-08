var CellType = {
  road:  1,
  dirt:  8,
  sand:  32,
  watr: 1024,
}

class GWMap{

  constructor(cellsTall,cellsWide, cellSize){
    this.cellsTall = cellsTall;
    this.cellsWide = cellsWide;
    this.cellSize  = cellSize;
    this.map       = [];
    this.showGrid  = true;
    this.resetMap();
  } // Ends Constructor

  resetMap(){
    for (var r = 0; r < this.cellsTall; r++) {
      this.map[r]=[];
      for (var c = 0; c < this.cellsWide; c++) {
        this.map[r][c] = CellType.dirt;
      }
    }    
  } // Ends Function resetMap

  setAllTilesTo(val){
    for (var r = 0; r < this.cellsTall; r++) {
      for (var c = 0; c < this.cellsWide; c++) {
        this.map[r][c]=val;
      }
    }
  } // Ends Function setAllTilesTo

  setValueAt(coord,val){
    if(this.checkInBounds(coord)){this.map[coord[0]][coord[1]] = val;}
    else{console.log(">>> Error: setValueAt("+row+","+col+","+val+") has invalid parms!");}
  } // Ends Function setValueAt

  randomizeMapBasic(){
    var rnd = -1;
    for (var r = 0; r < this.cellsTall; r++) {
      for (var c = 0; c < this.cellsWide; c++) {
        rnd = random(3);
        if (rnd < 1)   {this.map[r][c] = CellType.dirt;}
        else if (rnd<2){this.map[r][c] = CellType.water;}
        else if (rnd<3){this.map[r][c] = CellType.sand; }
        else           {this.map[r][c] = CellType.ERROR;}
      }
    }  
  } // Ends Function randomizeMapBasic

  checkInBounds(coord){
    return (coord[0]>=0 && coord[0]<this.cellsTall && coord[1]>=0 && coord[1]<this.cellsWide);
  } // Ends Method checkInBounds

  cellViaPos(pos){return [Math.floor(pos.y/this.cellSize),Math.floor(pos.x/this.cellSize)];}

  render(){
    if(this.showGrid){strokeWeight(1);stroke(24,24,24);} else{noStroke();}
    for(var r=0; r<this.cellsTall; r++){
      for(var c=0; c<this.cellsWide; c++){
        switch(this.map[r][c]){
          case CellType.dirt: fill(144,84,12);   break;
          case CellType.road: fill(120,120,120); break;
          case CellType.sand: fill(255,216,144); break;
          case CellType.watr: fill(60,120,180);  break;
          default:            fill(255,0,255);
        }
        rect(c*this.cellSize,r*this.cellSize,this.cellSize,this.cellSize);
      }
    }
  } // Ends Function render

} // Ends Class WorldMap