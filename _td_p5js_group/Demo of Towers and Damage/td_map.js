/*======================================================================
| Project:  Simple Tower Defense Map and Pathwalk Demo 01
| Author:   Steven Eiselen, CFHS/UArizona Computer Science
| Language: Javascript with P5JS Library
+-----------------------------------------------------------------------
| Description:  QAD - Implements a simple map representation and support
|               thereof for a 2D tower defense game; as well as loading
|               an array-based 'map file' definition as an alternative
|               to working with a text file definition (as the latter
|               might not be allowed if running code on local machine).
*=====================================================================*/

var CellType = {
  border:    0,
  mapDecor:  1,
  enemyPath: 2,
  buildable: 3,
  ERROR:    -1
}

var CellState = {
  VACANT: 0,
  FILLED: 1,
  ERROR: -1  
}


class TDMap{
  constructor(cellsTall,cellsWide, cellSize){
    this.cellsTall = cellsTall;
    this.cellsWide = cellsWide;
    this.cellSize  = cellSize;
    this.cellHalf  = this.cellSize/2;
    this.cellQuar  = this.cellSize/4;    
    this.tileMap   = [];
    this.bldgMap   = [];
    this.mapPath   = [];

    this.entCoord  = [-1,-1];
    this.extCoord  = [-1,-1];

    // Flags for debug/viz
    this.showMapPath = false;

    this.loadColors();
    
    this.resetTileMap();
    this.resetBldgMap();
    this.setNoBuildTilesToBldgMap();
  } // Ends Constructor

  loadColors(){

    this.col_ct_border    = color(0,0,0);
    this.col_ct_mapDecor  = color(84,84,84);
    this.col_ct_enemyPath = color(0,108,48);
    this.col_ct_buildable = color(144,84,12);

    this.col_st_vacant    = color(0,0,0,0);    
    this.col_st_filled    = color(255,60,0,180);  

    this.col_error     = color(255,0,255);
  }


  isEnemyPathCell(rc){
    return (this.isValidCell(rc) && (this.tileMap[rc[0]][rc[1]] == CellType.enemyPath));
  }


  resetTileMap(){
    for (var r = 0; r < this.cellsTall; r++) {
      this.tileMap[r]=[];
      for (var c = 0; c < this.cellsWide; c++) {
        if(r==0 || c==0 || r==cellsTall-1 || c==cellsWide-1){
          this.tileMap[r][c] = CellType.border;
        }
        else{
          this.tileMap[r][c] = CellType.buildable;
        }
      }
    }    
  } // Ends Function resetTileMap

  resetBldgMap(){
    for (var r = 0; r < this.cellsTall; r++) {
      this.bldgMap[r]=[];
      for (var c = 0; c < this.cellsWide; c++) {
        this.bldgMap[r][c] = CellState.VACANT;
      }
    }    
  } // Ends Function resetBldgMap


  // if tileMap[r][c] {border, map decor, enemy path} -> then bldgMap[r][c] {FILLED}
  setNoBuildTilesToBldgMap(){
    for (var r = 0; r < this.cellsTall; r++) {
      for (var c = 0; c < this.cellsWide; c++) {
        switch(this.tileMap[r][c]){
          case CellType.border:
          case CellType.mapDecor:
          case CellType.enemyPath: this.bldgMap[r][c] = CellState.FILLED; break;
          default: this.bldgMap[r][c] = CellState.VACANT;
        }
      }
    }
  }





  setAllTilesTo(val){
    for (var r = 0; r < this.cellsTall; r++) {
      for (var c = 0; c < this.cellsWide; c++) {
        this.tileMap[r][c]=val;
      }
    }
  } // Ends Function setAllTilesTo


  setValueAt(row,col,val){
    if(row<0||row>=this.cellsTall||col<0||col>=this.cellsWide){
      console.log(">>> Error: setValueAt("+row+","+col+","+val+") has invalid parms!");
    }
    else{
      this.tileMap[row][col] = val;
    }
  } // Ends Function setValueAt


  toggle_ShowMapPath(){
    this.showMapPath = !this.showMapPath;
  }


  // FOR NOW - ASSUMES 12x16
  printExtMap(map){
    for(var row=1; row<13; row++){
      let charSamp = "";
      for(var col=0; col<16; col++){
        charSamp += tileMap[row].charAt(col);
        if(col<15){charSamp += " ";}
      }
      console.log(charSamp);
    }
  }


  // FOR NOW - ASSUMES 12x16
  loadMap(extMap){
    this.loadMapCells(extMap);
    this.loadMapPath(extMap);
  }


  loadMapCells(extMap){
    let cellChar = '?';

    /* Implementation Note >>> For rows: 0-indexing was used in the loop
       while 1-indexing was used for map access because row-0 is defined
       at index-1 of the array defining a map definition 'file'. */
    for(var row=0; row<12; row++){
      for(var col=0; col<16; col++){
        cellChar = extMap[row+1].charAt(col);
        switch(cellChar) {
          case '#': this.setValueAt(row,col,CellType.border); break;
          case 'X': this.setValueAt(row,col,CellType.mapDecor); break;
          case '@': this.setValueAt(row,col,CellType.enemyPath); break;
          case '-': this.setValueAt(row,col,CellType.buildable); break;
          default:  this.setValueAt(row,col,CellType.ERROR);
        }
      }
    }    

    this.setNoBuildTilesToBldgMap();
  }


  // Need to turn [row,col] cell coords into (x,y) waypoints
  loadMapPath(extMap){

    let pathArr = extMap[13]; // prodecural index should be #rows+1

    this.entCoord = pathArr[0];
    this.extCoord = pathArr[pathArr.length-1];

    for (var i = 0; i < pathArr.length; i++) {
      this.mapPath.push(createVector(
        (pathArr[i][1]*this.cellSize)+this.cellHalf, 
        (pathArr[i][0]*this.cellSize)+this.cellHalf
      ));
    }
  }


  checkInBounds(r, c){
    return (r>=0 && r<this.cellsTall && c>=0 && c<this.cellsWide);
  } // Ends Method checkInBounds


  // naiive method: finds via searching top-left to bottom-right
  findVacantCell(){
    for (var r = 0; r < this.cellsTall; r++) {
      for (var c = 0; c < this.cellsWide; c++) {
        if(this.bldgMap[r][c]==CellState.VACANT){return [r,c];}
      }
    }
    return null;
  }


  //--------------------------------------------------------------------
  //>>> [IM]PORTED CODE FROM DRAG-AND-DROP DEMO GridMap

  setToFilled(cell){this.bldgMap[cell[0]][cell[1]] = CellState.FILLED;}

  setToVacant(cell){this.bldgMap[cell[0]][cell[1]] = CellState.VACANT;}

  isValidCell(rc){return (rc[0] >= 0 && rc[0] < this.cellsTall && rc[1] >= 0 && rc[1] < this.cellsWide);}

  isVacantCell(rc){return (this.bldgMap[rc[0]][rc[1]]==CellState.VACANT);}

  isValidVacantCell(rc){return (this.isValidCell(rc) && this.isVacantCell(rc));}

  posToCoord(pos){return [floor(pos.y/this.cellSize),floor(pos.x/this.cellSize)];}

  coordToPos(rc){return createVector((rc[1]*this.cellSize)+this.cellHalf, (rc[0]*this.cellSize)+this.cellHalf);}

  //--------------------------------------------------------------------


  renderTileMap(){
    noStroke();
    for(var r=0; r<this.cellsTall; r++){
      for(var c=0; c<this.cellsWide; c++){
        switch(this.tileMap[r][c]){
          case CellType.border:    fill(this.col_ct_border); break;
          case CellType.mapDecor:  fill(this.col_ct_mapDecor); break;
          case CellType.enemyPath: fill(this.col_ct_enemyPath); break;
          case CellType.buildable: fill(this.col_ct_buildable); break;
          default:                 fill(this.col_error); break;
        } // default will cover CellType.ERROR as well as unexpected vals
        rect(c*this.cellSize,r*this.cellSize,this.cellSize,this.cellSize);
      }
    }

    if(this.showMapPath){this.renderPathWaypoints();}
  } // Ends Function renderTilemap

  renderBldgMap(){
    noStroke();
    for(var r=0; r<this.cellsTall; r++){
      for(var c=0; c<this.cellsWide; c++){
        switch(this.bldgMap[r][c]){
          case (CellState.VACANT): fill(this.col_st_vacant); break;
          case (CellState.FILLED): fill(this.col_st_filled); break;
          default: fill(this.col_error);
        }
        rect( (c*this.cellSize)+this.cellQuar, (r*this.cellSize)+this.cellQuar, this.cellHalf,this.cellHalf);
      }
    }
  } // Ends Function renderBldgMap



  renderPathWaypoints(){
    textAlign(CENTER, CENTER);
    textSize(36);

    fill(255,255,0); stroke(0); strokeWeight(2);
    for (var wpt = 0; wpt < this.mapPath.length; wpt++) {
      text(wpt,this.mapPath[wpt].x,this.mapPath[wpt].y);
    }
  }

} // Ends Class WorldMap