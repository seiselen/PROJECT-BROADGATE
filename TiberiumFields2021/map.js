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
+---------------------------------------------------------------------*/
class TibMap{
  //>>> TibMap 'Enums' (JavaScript analogs thereto, anyway...)
  static TerType = {DIRT:0, GRASS:1, ROAD:2, WATER:3};
  static ResType = {NONE:0, ORE:1, GEM:2, AETH:3};
  //>>> TibMap 'Consts'
  static get MAX_RES_AMT(){return 100;}

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
    this.showResTiles = true;  // show resource tiles   (def:false)
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

      //>>> Colors used for displaying tilemap (if not using sprites)
      fill_DIRT  : color(140,81,10),
      fill_GRASS : color(166,217,106),
      fill_ROAD  : color(84,84,84),
      fill_WATER : color(0,60,216),

      //>>> Colors used for displaying resource map (if not using sprites)
      fill_ORE   : color(255,240,0),
      fill_GEM   : color(0,255,0),
      fill_AETH  : color(0,255,255),

      //>>> Colormap used for resource growth heatmap viz
      fill_heatL : color(240,240,216),
      fill_heatR : color(216,156,0),

      //>>> Grid[lines] and Cell Coords Display Settings
      fill_gridL : color(255,255,255,60),
      sWgt_gridL : 2, // grid line stroke weight
      sWgt_coord : 6, // cell coord stroke weight

      //>>> Text Settings (i.e. for displaying cell coords)
      fill_text  : color(255),
      strk_text  : color(0,0,0,60),
      sWgt_text  : 1,
      size_text  : 12,
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
  //>>> FUNCTIONS FOR TER/RES [SUB]MAPS
  //##################################################################

  setTerCell(r,c,type){
    if(!this.cellInBounds(r,c)){return;}
    if(type == TibMap.TerType.ROAD || type == TibMap.TerType.WATER){this.clearResCell(r,c);}
    this.terTileMap[r][c] = type;
  }

  // DIRT cell with ORE turned to WATER -> set res cell to NONE and concentration to [0]
  clearResCell(r,c){
    this.resTileMap[r][c] = TibMap.ResType.NONE;
    this.resConcMap[r][c] = 0;
  }

  editResCellConc(r,c,type,act,amt=1){
    let curAmt = this.resConcMap[r][c];
    if(act=='mp'){
      this.setResCellConc(r,c,type,curAmt+amt);}
    else if(act=='md'){
      if(frameCount%60==0){this.setResCellConc(r,c,type,curAmt+amt);}
      else if(curAmt<=0){this.setResCellConc(r,c,type,amt);}
    }
  }

  setResCellConc(r,c,type,amt=1){
    if(!this.cellInBounds(r,c)){return;}

    let terTileType = this.terTileMap[r][c];
    if(terTileType == TibMap.TerType.ROAD || terTileType == TibMap.TerType.WATER){return;}

    this.resTileMap[r][c] = type;
    this.resConcMap[r][c] = min(amt,TibMap.MAX_RES_AMT);
  }


  /*### KEEPING IN CASE CAN REFACTOR/SALVAGE/USE #######################


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

  */





  //##################################################################
  //>>> GENERAL (SHARED) UTIL FUNCTIONS
  //##################################################################
  posToCoord(pos){return [floor(pos.y/this.cellSize),floor(pos.x/this.cellSize)];}
  coordToPos(r,c,i=0){return createVector((c*this.cellSize)+this.cellHalf, (r*this.cellSize)+this.cellHalf, i);}
  coordToTopLeftPos(rc,i=0){return createVector((rc[1]*this.cellSize), (rc[0]*this.cellSize), i);}
  isBorderCell(r,c){return (r==0||c==0||r==this.cellsTall-1||c==this.cellsWide-1);}
  cellInBounds(r,c){return (r>=0 && r<this.cellsTall && c>=0 && c<this.cellsWide);}

  //##################################################################
  //>>> RENDER FUNCTIONS
  //##################################################################
  render(){ // Per usual: DRAW ORDER MATTERS!
    if (this.showTerTiles){this.renderTerTiles();}
    if (this.showResTiles){this.renderResTiles();}
    if (this.showResHtMap){this.renderResHeatmap();}
    if (this.showGrid){this.renderGrid();}
    if (this.showCoords){this.renderCellCoords();}
  } // Ends Function render

  renderGrid(){
    stroke(this.style.fill_gridL); strokeWeight(this.style.sWgt_gridL);
    for(let i=0; i<this.cellsWide; i++){line(i*this.cellSize,0,i*this.cellSize,this.areaTall);}
    for(let i=0; i<this.cellsTall; i++){line(0,i*this.cellSize,this.areaWide,i*this.cellSize);}
  } // Ends Function renderGrid

  renderCellCoords(){
    stroke(this.style.strk_text); strokeWeight(this.style.sWgt_text); fill(this.style.fill_text); 
    textSize(this.style.size_text); textAlign(CENTER, CENTER);
    for(let row=0; row<this.cellsTall; row++){
      for(let col=0; col<this.cellsWide; col++){
        if(row==0 && col==0){text("0", (this.cellSize*col)+this.cellHalf,(this.cellSize*row)+this.cellHalf);}
        else if(row==0){text(""+col, (this.cellSize*col)+this.cellHalf,(this.cellSize*row)+this.cellHalf);}
        else if(col==0){text(""+row, (this.cellSize*col)+this.cellHalf,(this.cellSize*row)+this.cellHalf);}
      }
    }
  } // Ends Function renderCellCoords

  renderTerTiles(){
    noStroke();
    for(let r=0; r<this.cellsTall; r++){
      for(let c=0; c<this.cellsWide; c++){
        switch(this.terTileMap[r][c]){
          case TibMap.TerType.DIRT:  fill(this.style.fill_DIRT);  break;
          case TibMap.TerType.GRASS: fill(this.style.fill_GRASS); break;
          case TibMap.TerType.ROAD: fill(this.style.fill_ROAD); break;
          case TibMap.TerType.WATER: fill(this.style.fill_WATER); break;          
          default:                   fill(this.style.fill_ERROR);
        }
        rect(c*this.cellSize,r*this.cellSize,this.cellSize,this.cellSize);
      }
    }
  } // Ends Function renderTerTiles

  renderResTileType(r,c,t){
    if(t=='X'){return;} // handles 'none'
    textAlign(CENTER,CENTER);
    text(this.resConcMap[r][c],(c*this.cellSize)+this.cellHalf,(r*this.cellSize)+this.cellHalf)
  }

  renderResTiles(){
    stroke(this.style.strk_text); strokeWeight(this.style.sWgt_text);
    for(let r=0; r<this.cellsTall; r++){
      for(let c=0; c<this.cellsWide; c++){   
        switch(this.resTileMap[r][c]){
          case TibMap.ResType.ORE:  fill(this.style.fill_ORE);   this.renderResTileType(r,c,"O"); break;
          case TibMap.ResType.GEM:  fill(this.style.fill_GEM);   this.renderResTileType(r,c,"G"); break;
          case TibMap.ResType.AETH: fill(this.style.fill_AETH);  this.renderResTileType(r,c,"A"); break;
          case TibMap.ResType.NONE: fill(this.style.fill_AETH);  this.renderResTileType(r,c,"X"); break;
          default:                  fill(this.style.fill_ERROR); this.renderResTileType(r,c,"?"); break;
        }
      }
    }
  } // Ends Function renderResTiles

  renderResHeatmap(){
    noStroke();
    let temp = 0;
    for(let r=0; r<this.cellsTall; r++){
      for(let c=0; c<this.cellsWide; c++){
        temp = this.resConcMap[r][c];
        (temp==0) ? noFill() : fill(lerpColor(this.style.fill_heatL, this.style.fill_heatR, temp/100));
        rect(c*this.cellSize,r*this.cellSize,this.cellSize,this.cellSize);
        //fill(255); noStroke(); text(temp,(c*this.cellSize)+this.cellSizeH,(r*this.cellSize)+this.cellSizeH);
      }
    }
  } // Ends Function renderUnitMap

} // Ends Class TibMap