class SPMap{
  constructor(cellsTall,cellsWide, cellSize){
    // Object State
    this.cellsTall  = cellsTall;
    this.cellsWide  = cellsWide;
    this.cellSize   = cellSize;
    this.cellSizeH  = this.cellSize/2;
    this.map        = [];
    this.dim        = {wide:this.cellsWide*this.cellSize, tall:this.cellsTall*this.cellSize};
    this.showGrid   = false;
    // Init/Loader Calls
    this.initColorMap(); this.initSPGrid();
  }
  
  initColorMap(){
    this.fill_bg    = color(32);
    this.strk_grid  = color(255,128);
    this.sWgt_grid  = 1;
  }

  initSPGrid(){
    for (let r=0; r<this.cellsTall; r++) {
      this.map[r]=[];
      for (let c=0; c<this.cellsWide; c++) {
        this.map[r].push(new Map());
      }
    }
  }

  updatePos(obj){
    let newCoords = this.cellViaPos(obj.pos);
    if(obj.curCoord != null && obj.curCoord[0]==newCoords[0] && obj.curCoord[1]==newCoords[1] ){return null;}
    this.updatePosViaMapObj(obj, newCoords);
    return newCoords;
  }

  updatePosViaMapObj(obj, newCoords){
    if(obj.curCoord != null){this.map[obj.curCoord[0]][obj.curCoord[1]].delete(obj.ID);}
    this.map[newCoords[0]][newCoords[1]].set(obj.ID,obj);
  }

  getUnitsInCells(list){
    let units = [];
    for (let i=0; i<list.length; i++){
      units = units.concat(this.getUnitsAtCell(list[i]));
    } 
    return units;
  }

  getUnitsAtCell(cell){
    switch(this.isValidCell(cell)){
      case true: return Array.from(this.map[cell[0]][cell[1]].values());
      case false: return [];
    }
  }

  toggleGrid(){
    this.showGrid = !this.showGrid;
  }

  cellViaPos(pos){
    return [Math.floor(pos.y/this.cellSize),Math.floor(pos.x/this.cellSize)];
  }

  getCellMidPt(rc){
    return (this.isValidCell(rc))
      ? vec2((rc[1]*this.cellSize)+this.cellSizeH,(rc[0]*this.cellSize)+this.cellSizeH)
      : vec2(-1,-1); 
  }

  getCellTLPos(rc){
    return createVector((rc[1]*this.cellSize),(rc[0]*this.cellSize));}
  
  isValidCell(rc){
    return (rc[0]>=0 && rc[0]<this.cellsTall && rc[1]>=0 && rc[1]<this.cellsWide);
  }

  render(){
    background(this.fill_bg)
    if(this.showGrid){this.renderGrid();}
  } // Ends Function render

  renderGrid(){
    noFill(); stroke(this.strk_grid); strokeWeight(this.sWgt_grid);
    for(let i=0; i<=this.cellsTall; i++){line(0,this.cellSize*i,width,this.cellSize*i);}
    for(let i=0; i<=this.cellsWide; i++){line(this.cellSize*i,0,this.cellSize*i,height);}
  } // Ends Function renderGrid

} // Ends Class SPMap