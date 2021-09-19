

/*----------------------------------------------------------------------
|>>> Class SPMap
+-----------------------------------------------------------------------
| Description:  Purpose of the Class
+-----------------------------------------------------------------------
| Implementation Notes:
|  > Tightly coupled with the following properties of the global object 
|    'Config' : {MAP_DISP_MODE, AGT_DISP_MODE, SPAT_PART_MODE}. This is
|    intentional for ease-of-use within this project; though such can be
|    refactored for improved coupling/cohesion if/as needed otherwise.
+---------------------------------------------------------------------*/
class SPMap{
  constructor(cellsTall,cellsWide, cellSize){
    this.cellsTall = cellsTall;
    this.cellsWide = cellsWide;
    this.cellSize  = cellSize;
    this.cellSizeH = this.cellSize/2;
    this.map       = [];
    this.dim       = {wide:this.cellsWide*this.cellSize, tall:this.cellsTall*this.cellSize};
    this.showGrid  = true; // show grid (cell borders)
    this.newCoords = []; // cache variable used by 'updatePos' function group

    // Color Defs (For Heatmap)
    this.colL = color(222,235,247);
    this.colR = color(33,113,181);

    this.initSPGrid();    
  }

  /*--------------------------------------------------------------------
  |>>> Function initSPGrid
  +---------------------------------------------------------------------
  | Description: Clears elements of current map, then [re]initializes it
  |              based on the value of 'Config.SPAT_PART_MODE'. 
  | When Called: Within the constructor on initialization, and whenever
  |              the value of 'Config.SPAT_PART_MODE' changes (via a UI
  |              handler for the event where the applicable DOM-UI radio
  |              button group's value has changed.
  +-------------------------------------------------------------------*/
  initSPGrid(){
    this.map.length = 0;
    switch(Config.SPAT_PART_MODE){
      case SpatPartMode.gridViaObj: this.initSPGridViaRegObj(); return;
      case SpatPartMode.gridViaMap: this.initSPGridViaMapObj(); return;
    }
  } // Ends Function initSPGrid


  initSPGridViaRegObj(){
    this.map.length = 0;
    for (var r = 0; r < this.cellsTall; r++) {
      this.map[r]=[];
      for (var c = 0; c < this.cellsWide; c++) {
        this.map[r].push({});
      }
    }
  } // Ends Function initSPGridViaRegObj


  initSPGridViaMapObj(){
    for (var r = 0; r < this.cellsTall; r++) {
      this.map[r]=[];
      for (var c = 0; c < this.cellsWide; c++) {
        this.map[r].push(new Map());
      }
    }
  } // Ends Function initSPGridViaMapObj

  /*--------------------------------------------------------------------
  |>>> Function updatePos
  +---------------------------------------------------------------------
  | Description: 'Gateway' via which all agents utilizing the SP system 
  |              both update it via their current position, and receive
  |              either an updated cell coord else null (which implies
  |              that they remain within their current map cell).
  +---------------------------------------------------------------------
  | Implementation Notes:
  |  > This function is also a 'gateway' in that it is called in either
  |    of the SP modes; as it first does the work common to / shared by
  |    both modes, then steps into a switch keyed on the current mode.
  |  > I added a default case which prints an error message to console
  |    because I definitely want to know whenever this occurs! I also
  |    did this because both 'further-work' functions no longer return
  |    anything: each returned 'newCoords' unchanged, so I did that here
  |    instead to support this implementation's internal modularity.
  |  > Relax! For future implementations utilizing SP (e.g. ZAC) where
  |    only one SP type is used: this code can be merged back with the
  |    remaining implementation of the greater 'updatePos' operation.
  +-------------------------------------------------------------------*/
  updatePos(obj){
    //>>> Compute cell coords based on current position
    let newCoords = this.cellViaPos(obj.pos);
    //>>> Inside same cell as last update => Do nothing but return null
    if(obj.curCoord != null && obj.curCoord[0]==newCoords[0] && obj.curCoord[1]==newCoords[1] ){return null;}
    //>>> Agent is in new cell => Complete updatePos operation based on current SP mode
    switch(Config.SPAT_PART_MODE){
      case SpatPartMode.gridViaObj: this.updatePosViaRegObj(obj, newCoords); break;
      case SpatPartMode.gridViaMap: this.updatePosViaMapObj(obj, newCoords); break;
      default: console.log("ERROR: Switch encountered unexpected spatial partition mode!");
    }
    return newCoords;
  } // Ends Function updatePos


  /*--------------------------------------------------------------------
  |>>> Function updatePosViaRegObj
  +---------------------------------------------------------------------
  | Description: Remove entry from former cell, then add it to new cell
  +-------------------------------------------------------------------*/
  updatePosViaRegObj(obj, newCoords){
    if(obj.curCoord != null){delete this.map[obj.curCoord[0]][obj.curCoord[1]][obj.ID];}
    this.map[newCoords[0]][newCoords[1]][obj.ID] = obj;
  } // Ends Function updatePosViaRegObj

  /*--------------------------------------------------------------------
  |>>> Function updatePosViaMapObj
  +---------------------------------------------------------------------
  | Description: Delete entry from former cell, then set it to new cell
  +-------------------------------------------------------------------*/
  updatePosViaMapObj(obj, newCoords){
    if(obj.curCoord != null){this.map[obj.curCoord[0]][obj.curCoord[1]].delete(obj.ID);}
    this.map[newCoords[0]][newCoords[1]].set(obj.ID,obj);
  } // Ends Function updatePosViaMapObj

  /*--------------------------------------------------------------------
  |>>> Function getUnitsInCells
  +---------------------------------------------------------------------
  | Description: Self-Explanatory, however do note that it can and will 
  |              be used for both types of grid SP mode; as it handles
  |              each respectively within the 'getUnitsAtCell' function.            
  +-------------------------------------------------------------------*/
  getUnitsInCells(list){
    let units = [];
    for (let i=0; i<list.length; i++){units = units.concat(this.getUnitsAtCell(list[i]));} 
    return units;
  } // Ends Function getUnitsInCells

  /*--------------------------------------------------------------------
  |>>> Function getUnitsInCells
  +---------------------------------------------------------------------
  | Description: Self-Explanatory. I constructed a gnarly nested ternary
  |              version of this code, but opted not to use it. Let's be
  |              sure that this version works before getting ambitious.
  |              As with other functions: I DO want to know if the value
  |              of 'Config.SPAT_PART_MODE' is neither 'gridViaObj' nor
  |              'gridViaMap'; as such is NOT expected (and NOT good!)
  +-------------------------------------------------------------------*/
  getUnitsAtCell(cell){
    switch(this.isValidCell(cell)){
      case true:  switch(Config.SPAT_PART_MODE){
        case SpatPartMode.gridViaObj: return Object.values(this.map[cell[0]][cell[1]]);
        case SpatPartMode.gridViaMap: return Array.from(this.map[cell[0]][cell[1]].values());
        default: console.log("ERROR: Switch encountered unexpected spatial partition mode!");
      }
    }
    return [];
  } // Ends Function getUnitsAtCell







  /*--------------------------------------------------------------------
  |>>> Functions [toggleGrid/toggleHMap/toggleCPop and setFlagValue]
  +---------------------------------------------------------------------
  | Description: These three functions toggle their respective display 
  |              flags WRT its current value; thus are parameterless and 
  |              intended for quick-and-easy utilization via the UI/UX.
  +-------------------------------------------------------------------*/
  toggleGrid(){this.showGrid = !this.showGrid;}
  toggleHMap(){this.showHMap = !this.showHMap;}
  toggleCPop(){this.showCPop = !this.showCPop;}

  /*--------------------------------------------------------------------
  |>>> Functions  [Misc. Map Util Getters]
  +---------------------------------------------------------------------
  | Description: Same as / analogous to counterparts in TD-P5JS, etc.) 
  +-------------------------------------------------------------------*/
  cellViaPos(pos){return [Math.floor(pos.y/this.cellSize),Math.floor(pos.x/this.cellSize)];}
  getCellMidPt(rc){return (this.isValidCell(rc)) ? vec2((rc[1]*this.cellSize)+this.cellSizeH, (rc[0]*this.cellSize)+this.cellSizeH) : vec2(-1,-1);}
  getCellTLPos(rc){return createVector((rc[1]*this.cellSize),(rc[0]*this.cellSize));}
  isValidCell(rc){return (rc[0]>=0 && rc[0]<this.cellsTall && rc[1]>=0 && rc[1]<this.cellsWide);}

  /*--------------------------------------------------------------------
  |>>> Functions  render, renderHeatMap, renderCellPop
  +---------------------------------------------------------------------
  | Description: Self-Explanatory. Note that 'render' is a 'gateway' WRT
  |              the value of 'Config.MAP_DISP_MODE', such that if it is
  |              either 'MapDispMode.none' else otherwise not specified 
  |              within the switch, it passes through with no effects.
  +-------------------------------------------------------------------*/
  render(){
    switch(Config.MAP_DISP_MODE){
      case MapDispMode.heatMap: this.renderHeatMap(); return;
      case MapDispMode.cellPop: this.renderCellPop(); return;
    } // else in all other cases => do nothing
  } // Ends Function render


  renderHeatMap(){
    let temp;

    strokeWeight(1);
    (this.showGrid) ? stroke(60,128) : noStroke();

    for(var r=0; r<this.cellsTall; r++){
      for(var c=0; c<this.cellsWide; c++){
        temp = (Config.SPAT_PART_MODE==SpatPartMode.gridViaObj) ? Object.keys(this.map[r][c]).length
          : (Config.SPAT_PART_MODE==SpatPartMode.gridViaMap) ? this.map[r][c].size 
          : 0;


        fill(lerpColor(this.colL,this.colR,temp/5.0));
        rect(c*this.cellSize,r*this.cellSize,this.cellSize,this.cellSize);
        //fill(255); noStroke();
        //text(temp, (c*this.cellSize)+this.cellSizeH, (r*this.cellSize)+this.cellSizeH);
      }
    }
  } // Ends Function render


} // Ends Class SPMap