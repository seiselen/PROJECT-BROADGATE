/*----------------------------------------------------------------------
|>>> Class SPMap (Spatial Partition [supporting] [2D Gridworld] Map)
+-----------------------------------------------------------------------
| Description:  <TODO>
+-----------------------------------------------------------------------
| Implementation Notes:
|  > Tightly coupled with the following properties of the global object 
|    'Config' : {MAP_DISP_MODE, AGT_DISP_MODE, SPAT_PART_MODE}. This is
|    intentional for ease-of-use within this project; though such can be
|    refactored for improved coupling/cohesion if/as needed otherwise.
+---------------------------------------------------------------------*/
class SPMap{
  constructor(cellsTall,cellsWide, cellSize){
    // Object State
    this.cellsTall  = cellsTall;
    this.cellsWide  = cellsWide;
    this.cellSize   = cellSize;
    this.cellSizeH  = this.cellSize/2;
    this.map        = [];
    this.dim        = {wide:this.cellsWide*this.cellSize, tall:this.cellsTall*this.cellSize};
    this.showGrid   = true;
    this.showCells  = true;
    // Cache Values
    this.newCoords  = []; // cache variable used by 'updatePos' function group
    this.curCellPop = -1  // cache variable used by 'renderHeatMap' and 'renderCellPop'
    // Init/Loader Calls
    this.initSPGrid();
    this.initColorPallete();   
  } // Ends Constructor


  initColorPallete(){
    //>>> Colors for Heatmap Mode
    this.hm_colormapL = color(156,204,228); // ;color(222,235,247);
    this.hm_colormapR = color(12,48,108); // ;color(33,113,181);
    this.hm_strk_grid = color(60,128);
    //>>> Colors for Cell Population Mode
    this.cp_col_bGrnd = color(24);  // background
    this.cp_strk_grid = color(180); // grid lines
    this.cp_fill_text = color(180); // text labels
    this.cp_size_text = 14;         // font size
    //>>> Other GFX/VFX Setttings
    this.hm_sWgt_grid = 1;          // [grid] line stroke weight
    this.cp_sWgt_grid = 2;          // [grid] line stroke weight    
  } // Ends Function initColorPallete


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
  |>>> Functions toggle<thing>()
  +---------------------------------------------------------------------
  | Description: Toggle respective display flags WRT its current value;
  |              as intended for quick-and-easy use (e.g. via UI/UX).
  +-------------------------------------------------------------------*/
  toggleGrid(){this.showGrid = !this.showGrid;}
  toggleCells(){this.showCells = !this.showCells;}

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
  |>>> Function setCellPop (Set Cell Population)
  +---------------------------------------------------------------------
  | Description: Assigns current population of input cell to temp/buffer 
  |              variable 'this.curCellPop' based on current SP mode; as
  |              syntax differs between each mode (i.e. data structure).
  | Modularity:  This code was originally located within two functions: 
  |              'renderHeatMap' and 'renderCellPop' (else sub-function
  |              components thereof). Partitioning it therefrom and into
  |              its own function supports modularity via reducing code
  |              repetition and providing only one definition called by
  |              both map display implementations; while retaining the 
  |              buffer variable may have further performance benefits
  |              (see 'Var Note') below.
  | Var Note:    As aforementioned, cell population values are assigned
  |              to the buffer variable 'curCellPop'; i.e. NOT returned
  |              to the caller! This is partly for legacy reasons, and 
  |              partly to decrease the amount of work needed. That is:
  |              assigning directly to the buffer for immediate use on 
  |              return to the caller should perform better than first
  |              being returned to the caller and then assigned thereto;
  |              though I'm [very] likely being WAY too OCD about this!
  +-------------------------------------------------------------------*/
  setCellPop(cellObj){
    this.curCellPop = (Config.SPAT_PART_MODE==SpatPartMode.gridViaObj) ? Object.keys(cellObj).length
                    : (Config.SPAT_PART_MODE==SpatPartMode.gridViaMap) ? cellObj.size 
                    : -1;
  } // Ends Function setCellPop

  /*--------------------------------------------------------------------
  |>>> Functions  render, renderHeatMap, renderCellPop
  +---------------------------------------------------------------------
  | Description: Self-Explanatory. Note that 'render' is a 'gateway' WRT
  |              the value of 'Config.MAP_DISP_MODE', such that if it is
  |              either 'MapDispMode.none' else otherwise not specified 
  |              within the switch, it passes through with no effects.
  +-------------------------------------------------------------------*/
  render(){
    rectMode(CORNER);
    if(this.showCells){
      switch(Config.MAP_DISP_MODE){
        case MapDispMode.heatMap: this.renderHeatMap(); break;
        case MapDispMode.cellPop: this.renderCellPop(); break;
        default: return; // for naive SP mode
      }
    }
    if(this.showGrid){this.renderGrid();}
  } // Ends Function render


  renderHeatMap(){
    noStroke();
    for(var r=0; r<this.cellsTall; r++){
      for(var c=0; c<this.cellsWide; c++){
        this.setCellPop(this.map[r][c]);
        fill(lerpColor(this.hm_colormapL,this.hm_colormapR,this.curCellPop/5.0));
        rect(c*this.cellSize,r*this.cellSize,this.cellSize,this.cellSize);
      }
    }
  } // Ends Function renderHeatMap


  /*--------------------------------------------------------------------
  |>>> Function renderCellPop
  +---------------------------------------------------------------------
  | Description: Renders Cell Population Grid which displays the current
  |              number of agents reporting into each map cell. Utilizes
  |              and partitioned into two component methods, which first
  |              render the grid, then the per-cellpopulation counts.
  +-------------------------------------------------------------------*/
  renderCellPop(){
    background(this.cp_col_bGrnd); fill(this.cp_fill_text); noStroke(); textAlign(CENTER,CENTER); textSize(this.cp_size_text);
    for(var r=0; r<this.cellsTall; r++){
      for(var c=0; c<this.cellsWide; c++){
        this.setCellPop(this.map[r][c]);
        text(this.curCellPop, (c*this.cellSize)+this.cellSizeH, (r*this.cellSize)+this.cellSizeH);
      }
    } 
  } // Ends Function renderCellPop

  /*--------------------------------------------------------------------
  |>>> Function renderGrid
  +---------------------------------------------------------------------
  | Description: Draws map cell grid via line primitives. Intended to be
  |              called only by 'renderCellPop' as a component thereof,
  |              though might also utilize for the HeatMap viz... <TBD>
  +-------------------------------------------------------------------*/
  renderGrid(){
    switch(Config.MAP_DISP_MODE){
      case MapDispMode.heatMap: stroke(this.hm_strk_grid); strokeWeight(this.hm_sWgt_grid); break;
      case MapDispMode.cellPop: stroke(this.cp_strk_grid); strokeWeight(this.cp_sWgt_grid); break;
    }
    for(let i=0; i<=this.cellsTall; i++){line(0,this.cellSize*i,width,this.cellSize*i);}
    for(let i=0; i<=this.cellsWide; i++){line(this.cellSize*i,0,this.cellSize*i,height);}
  } // Ends Function renderGrid
} // Ends Class SPMap