

class GameMap{
  //>>> GameMap 'ENUMS' (JavaScript analogs thereto, anyway...)
  static CellType  = { border: 0, mapDecor: 1, enemyPath: 2, buildable: 3, ERROR: -1 };
  static CellState = { VACANT: 0, FILLED: 1, ERROR: -1 };

  // QAD Note: 'mapInfo' aka 'external map' is 'map file' (as .js) to base ingame map rep from
  constructor(cT,cW,cS,mapInfo){
    //##################################################################
    //>>> DATA STRUCTURE / VARIABLE DECLARATIONS (AND INITS A/A)
    //##################################################################

    //> General/Shared Map Info
    this.cellsTall = cT;
    this.cellsWide = cW;
    this.cellSize  = cS;
    this.cellHalf  = this.cellSize/2;
    this.cellQuar  = this.cellSize/4;
    this.areaWide  = this.cellsWide*this.cellSize;
    this.areaTall  = this.cellsTall*this.cellSize;

    //> [Sub] Map Info
    this.tileMap = [];        // CellType info (e.g. buildable, enemyPath, etc.)
    this.bldgMap = [];        // spatial partition info of buildings (e.g. towers)
    this.unitMap = [];        // spatial partition info of agents (e.g. enemy units)

    //> Enemy Path Info
    this.walkPath  = [];      // cell coord list of enemy path through map
    this.entCoord  = [-1,-1]; // cell coord where enemies enter the map 
    this.extCoord  = [-1,-1]; // cell coord where enemies exit the map

    //> UI/UX Toggle Configs
    this.showGrid    = true;  // show map grid        (def:true {FALSE when done with dev?})
    this.showCoords  = false; // show map cell coords (def:false)
    this.showTileMap = true;  // show map tiles       (def:true)
    this.showBldgMap = false; // show building SP map (def:false)
    this.showUnitMap = false; // show unit SP map     (def:false)
    this.showPathMap = false; // show enemy path info (def:false)

    //##################################################################
    //>>> LOADERS AND INITS  (NOTE: ORDER MIGHT COUNT!)
    //##################################################################    
    this.initGFXConfig();  // init colors and various other GFX/VFX vals
    this.initTileMap();    // set tile map to default/init state
    this.initBldgMap();    // set bldg map to default/init state
    this.initUnitMap();    // set unit map to default/init state
    this.loadMap(mapInfo); // load map def into tileMap and walkPath
    

  } // Ends Constructor


  //>>> TODO: setup as Hash Table for easier referencing?
  initGFXConfig(){
    //>>> Colors used for displaying tilemap (in lieu of sprites)
    this.col_cellBorder    = color(0,0,0);
    this.col_cellMapDecor  = color(84,84,84);
    this.col_cellEnemyPath = color(0,108,48);
    this.col_cellBuildable = color(144,84,12);

    //>>> Colors used for displaying building cell state    
    this.col_bldgVacant    = color(0,0,0,0);    
    this.col_bldgFilled    = color(255,60,0,180); 

    //>>> Colormap used for unit spatial partition heatmap viz
    this.col_unitHeatL   = color(222,235,247);
    this.col_unitHeatR   = color(33,113,181);

    //>>> RESERVED color used for any error value
    this.col_error         = color(255,0,255);

    //>>> Grid and Cell Coords Display Settings
    this.col_gridLines     = color(255,255,255,60);
    this.stWgt_gridLines   = 2; // grid line stroke weight
    this.stWgt_cellCoords  = 6; // cell coord stroke weight

    //>>> Path Waypoint Settings
    this.fill_pathText     = color(255,255,0);
    this.stroke_pathText   = color(0);
    this.stWgt_pathText    = 2;
    this.size_pathText     = 36;

  } // Ends Function initColors

  // NOTE/TODO: Ternary and other ops are EXPERIMENTAL. Keeping other 'init<x>Map' methods per original for now.
  initTileMap(){
    for (let r = 0; r < this.cellsTall; r++) {
      let nRow = [];
      for (let c = 0; c < this.cellsWide; c++) {
        nRow.push((r==0 || c==0 || r==this.cellsTall-1 || c==this.cellsWide-1) ? GameMap.CellType.border : GameMap.CellType.buildable);
      }
      this.tileMap.push(nRow);
    }
  } // Ends Function initTileMap

  initBldgMap(){
    for (let r = 0; r < this.cellsTall; r++) {
      this.bldgMap[r]=[];
      for (let c = 0; c < this.cellsWide; c++) {
        this.bldgMap[r][c] = GameMap.CellState.VACANT;
      }
    }    
  } // Ends Function initBldgMap

  initUnitMap(){
    for (let r = 0; r < this.cellsTall; r++) {
      this.unitMap[r]=[];
      for (let c = 0; c < this.cellsWide; c++) {
        this.unitMap[r].push({});
      }
    }
  } // Ends Function initUnitMap


  //##################################################################
  //>>> FUNCTIONS FOR UI/UX TOGGLE FLAGS
  //##################################################################
  toggle_showGrid()   {this.showGrid    = !this.showGrid;}
  toggle_showCoords() {this.showCoords  = !this.showCoords;}
  toggle_showTileMap(){this.showTileMap = !this.showTileMap;}
  toggle_showBldgMap(){this.showBldgMap = !this.showBldgMap;}
  toggle_showUnitMap(){this.showUnitMap = !this.showUnitMap;}
  toggle_showPathMap(){this.showPathMap = !this.showPathMap;}

  set_showGrid(b=true)   {this.showGrid    = (b==true) ? true : false; return this;}
  set_showCoords(b=true) {this.showCoords  = (b==true) ? true : false; return this;}
  set_showTileMap(b=true){this.showTileMap = (b==true) ? true : false; return this;}
  set_showBldgMap(b=true){this.showBldgMap = (b==true) ? true : false; return this;}
  set_showUnitMap(b=true){this.showUnitMap = (b==true) ? true : false; return this;}
  set_showPathMap(b=true){this.showPathMap = (b==true) ? true : false; return this;}

  //##################################################################
  //>>> FUNCTIONS FOR TILE [SUB]MAP AND ENEMY PATH
  //##################################################################

  loadMap(extMap){
    this.loadMapCells(extMap);
    this.loadMapPath(extMap);
    this.setInitNoBuildTiles();
  } // Ends Function loadMap


  loadMapCells(extMap){
    /* Note: 1-indexing used to get row info from map 'file' because
       its row-0 is an Array[2] containing [#rows,#Cols] thereof */
    for(let row=0; row<this.cellsTall; row++){
      for(let col=0; col<this.cellsWide; col++){
        switch(extMap[row+1].charAt(col)){
          case '#': this.setValueAt(row,col,GameMap.CellType.border); break;
          case 'X': this.setValueAt(row,col,GameMap.CellType.mapDecor); break;
          case '@': this.setValueAt(row,col,GameMap.CellType.enemyPath); break;
          case '-': this.setValueAt(row,col,GameMap.CellType.buildable); break;
          default:  this.setValueAt(row,col,GameMap.CellType.ERROR);
        }
      }
    }
  } // Ends Function loadMapCells


  loadMapPath(extMap){
    let pathArr   = extMap[extMap[0][0]+1];
    this.entCoord = pathArr[0];
    this.extCoord = pathArr[pathArr.length-1];
    for (let i = 0; i < pathArr.length; i++){this.walkPath.push(this.coordToPos(pathArr[i][0],pathArr[i][1],i+1));}
  } // Ends Function loadMapPath


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

  isVacant(r,c){return this.cellInBounds(r,c) && (this.bldgMap[r][c]==GameMap.CellState.VACANT);}

  isEnemyPathCell(r,c){return this.cellInBounds(r,c) && (this.tileMap[r][c]==GameMap.CellType.enemyPath);}

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

} // Ends Class GameMap