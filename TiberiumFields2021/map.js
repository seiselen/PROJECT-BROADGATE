/*----------------------------------------------------------------------
|>>> Class TibMap [Tiberium Map]
+-----------------------------------------------------------------------
| Author:  Steven Eiselen, Eiselen Laboratories
| Project: 'Broadgate (Phase II)' and 'ZAC'/'P5-ZAC'
| Source:  Derives from 'GameMap' which I wrote for another Broadgate-II
|          project: TD-P5JS (i.e. Tower Defense in P5JS). In addition to
|          modifications thereof WRT this project, I implemented some of
|          the 'TODO' improvement ideas (described in the notes below).  
| Purpose: Implements good-old-fashioned '2D Grid World' for the purpose
|          of simulating resource growth as-seen-in 'classic RTS' games; 
|          namely those of the classic 'Command & Conquer' series (hence
|          the [full] name of this class 'Tiberium Map' and this greater
|          project's name 'Tiberium Fields 2021').
+-----------------------------------------------------------------------
| State Variables and Structs:
| > TODO
+-----------------------------------------------------------------------
| Implementation Notes (re: 'TODO' item follow-ups from TD-P5JS version)
| > Function 'initGFXConfig' now creates a dictionary component called
|   '[this].style' which contains definitions for fill/stroke colors,
|   stroke weights, text sizes, etc.; as each were formerly initialized
|   independently. This refactor effectively realizes a much simpler and
|   self-contained analog of the 'UIStyle' component as used the TD-P5JS
|   'UIObject' family of classes.
| > Function 'initTerTileMap' utilizes a ternary operator, affirming the
|   similar experimental usage for the tilemap of TD-P5JS
| > Functions 'initTerTileMap' and 'initBothResMaps' feature designs in
|   which a row is initialized, then col vals appended thereto, then the
|   row appended to its respective [sub] map. This was also experimental
|   in TD-P5JS but worked (and works) fine.
| > 
+---------------------------------------------------------------------*/
class TibMap{
  //>>> GameMap 'Enums' (JavaScript analogs thereto, anyway...)
  static TerType = {DIRT:0, GRASS:1, ROAD:2, WATER:3, ERROR:-1};
  static ResType = {NONE:0, ORE:1, GEM:2, AETH:3, ERROR:-1};

  constructor(cT,cW,cS){
    //> General Map Info
    this.cellsTall = cT;
    this.cellsWide = cW;
    this.cellSize  = cS;
    this.cellHalf  = this.cellSize/2;
    this.cellQuar  = this.cellSize/4;
    this.areaWide  = this.cellsWide*this.cellSize;
    this.areaTall  = this.cellsTall*this.cellSize;

    //> [Sub] Map Info
    this.terTileMap = []; // Terrain Type info (i.e. is the cell of type DIRT, WATER, etc.?)
    this.resTileMap = []; // Resource Type info (i.e. does {ORE/GEM/AETH} exists at a cell?)
    this.resConcMap = []; // Resource Concentration info (e.g. how MUCH exists at a cell?)

    //> UI/UX Toggle Configs
    this.showGrid    = true;   // show map cell grid    (def:false)
    this.showCoords   = true;  // show map cell coords  (def:false)
    this.showTerTiles = true;  // show terrain tiles    (def:true)
    this.showResTiles = false; // show resource sprites (def:true)
    this.showResHtMap = false; // show resource heatmap (def:false)

    //> Loaders And Inits
    this.initGFXConfig();   // init colors and various other GFX/VFX vals
    this.initTerTileMap();  // set terrain tile map to default/init state
    this.initBothResMaps(); // set both resource maps to default/init state
  } // Ends Constructor

  initGFXConfig(){
    this.style = {
      //>>> [reserved] color used for any error value
      fill_ERROR : color(255,0,255),

      //>>> Colors used for displaying tilemap (in lieu of sprites)
      fill_DIRT  : color(140,81,10),
      fill_GRASS : color(166,217,106),
      fill_ROAD  : color(84,84,84),
      fill_WATER : color(0,180,255),

      //>>> Colormap used for resource growth heatmap viz
      fill_heatL : color(240,240,216),
      fill_heatR : color(216,156,0),

      //>>> Grid[lines] and Cell Coords Display Settings
      fill_gridL : color(255,255,255,60),
      sWgt_gridL : 2, // grid line stroke weight
      sWgt_coord : 6, // cell coord stroke weight

      //>>> Text Settings (i.e. for displaying cell coords)
      fill_text  : color(255,255,0),
      strk_text  : color(0),
      sWgt_text  : 2,
      size_text  : 24,
    };
  } // Ends Function initGFXConfig

  initTerTileMap(){
    for (let r = 0; r < this.cellsTall; r++) {
      let nRow = [];
      for (let c = 0; c < this.cellsWide; c++) {
        nRow.push((this.isBorderCell(r,c)) ? TibMap.TerType.WATER : TibMap.TerType.DIRT);
      }
      this.terTileMap.push(nRow);
    }
  } // Ends Function initTerTileMap

  initBothResMaps(){
    for (let r = 0; r < this.cellsTall; r++) {
      let nRowTile = [];
      let nRowConc = [];
      for (let c = 0; c < this.cellsWide; c++) {
        nRowTile.push(TibMap.ResType.NONE);
        nRowConc.push(0);
      }
      this.resTileMap.push(nRowTile); 
      this.resConcMap.push(nRowConc); 
    }      
  } // Ends Function initBothResMaps



  //##################################################################
  //>>> FUNCTIONS FOR UI/UX TOGGLE FLAGS
  //##################################################################
  toggle_showGrid()    {this.showGrid     = !this.showGrid;}
  toggle_showCoords()  {this.showCoords   = !this.showCoords;}
  toggle_showTerTiles(){this.showTerTiles = !this.showTerTiles;}
  toggle_showResTiles(){this.showResTiles = !this.showResTiles;}
  toggle_showResHtMap(){this.showResHtMap = !this.showResHtMap;}

  //##################################################################
  //>>> FUNCTIONS FOR TILE [SUB]MAP AND ENEMY PATH
  //##################################################################


  isBorderCell(r,c){
    return (r==0||c==0||r==this.cellsTall-1||c==this.cellsWide-1);
  } // Ends Function isBorderCell




  setAllTilesTo(val){
    for (let r = 0; r < this.cellsTall; r++) {
      for (let c = 0; c < this.cellsWide; c++) {
        this.tileMap[r][c]=val;
      }
    }
  } // Ends Function setAllTilesTo


  // TODO: add parm for which map one wishes to change value for?
  setValueAt(row,col,val){
    if(this.cellInBounds(row,col)){this.tileMap[row][col] = val;}
    else{console.log(">>> Error: Input Out Of Bounds [row="+row+"][col="+col+"]");}
  } // Ends Function setValueAt

  getWayPtClosestTo(pos){
    let closestWaypt = -1;
    let closestDist  = 9999;
    let curDist;
    for (let i = 0; i < this.walkPath.length; i++){
      curDist = pos.dist(this.walkPath[i]);
      if(curDist < closestDist){
        closestWaypt = i;
        closestDist = curDist;
      }     
    }
    return closestWaypt;
  } // Ends Function getWayPtClosestTo


  //##################################################################
  //>>> FUNCTIONS FOR BLDG [SUB]MAP
  //##################################################################

  // naiive method: finds via searching top-left to bottom-right
  findVacantCell(){
    for (let r = 0; r < this.cellsTall; r++) {
      for (let c = 0; c < this.cellsWide; c++) {
        if(this.isVacant(r,c)){return [r,c];}
      }
    }
    return null;
  } // Ends Function findVacantCell

  // TODO: 2 Methods with diff inputs... How Annoying! Try to change all back to 'input Array2 / output Array2' paradigm?
  isVacant(r,c){return this.cellInBounds(r,c) && (this.bldgMap[r][c]==GameMap.CellState.VACANT);}
  isVacant2(coord){return(this.isVacant(coord[0],coord[1]));}
  // TODO: Same as aforementioned: change dependencies to isEnemyPathCell(coord)
  isEnemyPathCell(r,c){return this.cellInBounds(r,c) && (this.tileMap[r][c]==GameMap.CellType.enemyPath);}
  isEnemyPathCell2(coord){return this.cellInBounds(coord[0],coord[1]) && (this.tileMap[coord[0]][coord[1]]==GameMap.CellType.enemyPath);}

  // TODO: Handle invalid input via 'cellInBounds'? (vis-a-vis an 'if' xor ternary)
  setToFilled(r,c){this.bldgMap[r][c] = GameMap.CellState.FILLED;}
  setToVacant(r,c){this.bldgMap[r][c] = GameMap.CellState.VACANT;}

  // tileMap[r][c]=={border, map decor, enemy path} -> then bldgMap[r][c] {FILLED}
  setInitNoBuildTiles(){
    for (let r = 0; r < this.cellsTall; r++) {
      for (let c = 0; c < this.cellsWide; c++) {
        switch(this.tileMap[r][c]){
          case GameMap.CellType.border: 
          case GameMap.CellType.mapDecor: 
          case GameMap.CellType.enemyPath: this.setToFilled(r,c); break;
          default: this.bldgMap[r][c] = GameMap.CellState.VACANT;
        }
      }
    }
  } // Ends Function setInitNoBuildTiles

  //##################################################################
  //>>> FUNCTIONS FOR UNIT [SUB]MAP
  //##################################################################
  updatePos(unit){
    let newCoords = this.posToCoord(unit.pos);

    // am i in the same cell as last call? if so - do nothing.
    if(unit.spCell != null && 
      unit.spCell[0]==newCoords[0] &&
      unit.spCell[1]==newCoords[1] ){
      return;
    }

    if(unit.spCell != null){
      delete this.unitMap[unit.spCell[0]][unit.spCell[1]][unit.ID];
    } 
  
    this.unitMap[newCoords[0]][newCoords[1]][unit.ID] = unit;
    unit.spCell = newCoords;
  } // Ends Function updatePos

  // Added 7/8 to [possibly] support Unit object pooling
  removePos(unit){
    if(unit.spCell != null){
      delete this.unitMap[unit.spCell[0]][unit.spCell[1]][unit.ID];
    }     
  } // Ends Function removePos


  getUnitsInCells(list){
    let units = [];
    for (let i=0; i<list.length; i++){units = units.concat(this.getUnitsAtCell(list[i]));} 
    return units;
  } // Ends Function getUnitsInCells

  getUnitsAtCell(cell){
    return (this.cellInBounds(cell[0],cell[1])) ? Object.values(this.unitMap[cell[0]][cell[1]]) : [];
  } // Ends Function getUnitsAtCell

  //##################################################################
  //>>> GENERAL (SHARED) UTIL FUNCTIONS
  //##################################################################
  posToCoord(pos){return [floor(pos.y/this.cellSize),floor(pos.x/this.cellSize)];}

  coordToPos(r,c,i=0){return createVector((c*this.cellSize)+this.cellHalf, (r*this.cellSize)+this.cellHalf, i);}


  coordToTopLeftPos(rc,i=0){return createVector((rc[1]*this.cellSize), (rc[0]*this.cellSize), i);}

  // Note: a.k.a. 'checkInBounds' or 'isValidCell' when porting old version code in
  cellInBounds(r,c){return (r>=0 && r<this.cellsTall && c>=0 && c<this.cellsWide);}


  //##################################################################
  //>>> RENDER FUNCTIONS
  //##################################################################

  // Note 1: DRAW ORDER COUNTS -> KEEP IN MIND FOR ORDER OF CALLS!
  // Note 2: Was going to use folded ternary scheme but doing 'if/elseif list' instead to K.I.S.S.
  render(){
    if (this.showTileMap){this.renderTileMap();}
    if (this.showPathMap){this.renderPathWaypts();}
    if (this.showBldgMap){this.renderBldgMap();}
    if (this.showUnitMap){this.renderUnitMap();}
    if (this.showGrid){this.renderGrid();}
    if (this.showCoords){this.renderCellCoords();}
  } // Ends Function render

  renderGrid(){
    stroke(this.col_gridLines); strokeWeight(this.stWgt_gridLines);
    for(let i=0; i<this.cellsWide; i++){line(i*this.cellSize,0,i*this.cellSize,this.areaTall);}
    for(let i=0; i<this.cellsTall; i++){line(0,i*this.cellSize,this.areaWide,i*this.cellSize);}
  } // Ends Function renderGrid

  renderCellCoords(){
    stroke(0,0,0,60); strokeWeight(this.stWgt_cellCoords); fill(255); textSize(16); textAlign(CENTER, CENTER);
    for(let row=0; row<cellsTall; row++){
      for(let col=0; col<cellsWide; col++){
        text("["+row+","+col+"]", (this.cellSize*col)+this.cellHalf,(this.cellSize*row)+this.cellHalf);  
      }
    }
  } // Ends Function renderCellCoords

  renderTileMap(){
    noStroke();
    for(let r=0; r<this.cellsTall; r++){
      for(let c=0; c<this.cellsWide; c++){
        switch(this.tileMap[r][c]){
          case GameMap.CellType.border:    fill(this.col_cellBorder); break;
          case GameMap.CellType.mapDecor:  fill(this.col_cellMapDecor); break;
          case GameMap.CellType.enemyPath: fill(this.col_cellEnemyPath); break;
          case GameMap.CellType.buildable: fill(this.col_cellBuildable); break;
          default: fill(this.col_error);
        }
        rect(c*this.cellSize,r*this.cellSize,this.cellSize,this.cellSize);
      }
    }
  } // Ends Function renderTilemap

  renderBldgMap(){
    noStroke();
    for(let r=0; r<this.cellsTall; r++){
      for(let c=0; c<this.cellsWide; c++){
        switch(this.bldgMap[r][c]){
          case (GameMap.CellState.VACANT): fill(this.col_bldgVacant); break;
          case (GameMap.CellState.FILLED): fill(this.col_bldgFilled); break;
          default: fill(this.col_error);
        }
        rect( (c*this.cellSize)+this.cellQuar, (r*this.cellSize)+this.cellQuar, this.cellHalf, this.cellHalf);
      }
    }
  } // Ends Function renderBldgMap

  renderUnitMap(){
    noStroke();
    let temp = 0;
    for(let r=0; r<this.cellsTall; r++){
      for(let c=0; c<this.cellsWide; c++){
        temp = Object.keys(this.unitMap[r][c]).length;
        (temp==0) ? noFill() : fill(lerpColor(this.col_unitHeatL, this.col_unitHeatR, temp/5.0));
        rect(c*this.cellSize,r*this.cellSize,this.cellSize,this.cellSize);
        //fill(255); noStroke(); text(temp,(c*this.cellSize)+this.cellSizeH,(r*this.cellSize)+this.cellSizeH);
      }
    }
  } // Ends Function renderUnitMap

  renderPathWaypts(){
    textAlign(CENTER, CENTER); textSize(this.size_pathText);
    fill(this.fill_pathText); stroke(this.stroke_pathText); strokeWeight(this.stWgt_pathText);
    this.walkPath.forEach(wPt => text(wPt.z, wPt.x, wPt.y));
  } // Ends Function renderPathWaypts

} // Ends Class TibMap