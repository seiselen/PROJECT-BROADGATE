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
    if(obj.curCoord != null){this.map[obj.curCoord[0]][obj.curCoord[1]].delete(obj.ID);}
    this.map[newCoords[0]][newCoords[1]].set(obj.ID,obj);
    return newCoords;
  }

  /*--------------------------------------------------------------------
  |> Function removeUnit
  +---------------------------------------------------------------------
  | Purpose: Removes input unit from the SP system. For the BG Spatial 
  |          Partitioning demo, such units are SPAgent instances which 
  |          have recently 'died' s.t. there is no further need of they
  |          nor the remaining 'alive' units to consider them WRT SP.
  | Input:   SPAgent instance (which is assumed to be 'dead' for ~[1-2] 
  |          frames e.g. has 'isAlive' flag set to 'false', but this is
  |          not [necessarily] a guarantee, requirement, nor dependency.
  | Output:  Well, side effect anyway... The agent's 'curCoord' value is
  |          set to [null]; which alongside its 'isAlive' value already
  |          being [false] should mean it calls this method ONLY ONCE!
  +---------------------------------------------------------------------
  |# Implementation Notes:
  |  > [ZAC NOTE] The eponymous codebase would probably like this method
  |    added therein at some point, so count that as a TODO item...
  |  > [WHY INCLUDE 'NEWCOORDS'?] Two sub-maps have the <delete> called
  |    thereunto: that of the agent's 'curCoord' value, as well as that 
  |    of its 'newCoords' (as computed by <cellViaPos>). The latter case
  |    is done as a precaution: handling an edge case whereby the agent
  |    JUST enters a new coordinate and happens to have not yet updated 
  |    its 'curCoords' value; which is certainly possible if this is not
  |    called a 'safe' time in the draw loop (i.e. 'OnLateUpdate' as is
  |    realized for the object pool). There should be no adverse effects
  |    for the sub-map that happens to not contain the agent, so #YOLO.
  +-------------------------------------------------------------------*/
  removeUnit(obj){
    this.map[obj.curCoord[0]][obj.curCoord[1]].delete(obj.ID);
    let newCoords = this.cellViaPos(obj.pos);
    this.map[newCoords[0]][newCoords[1]].delete(obj.ID);
    obj.curCoord = null;
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