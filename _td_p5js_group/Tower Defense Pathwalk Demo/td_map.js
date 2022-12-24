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
|
| Docu. Note:   > As with td_agent.js: I'm keeping code documentation 
|                 very Q.A.D. (i.e. brief/sparse) as to get this code up
|                 for my students ASAP <vs> continued OCD about adding 
|                 "just a little more documentation detail". Again: if 
|                 ZAC, PRIZE, and/or StAgE are up in full detail on my
|                 GitHub: they should have all desired implement. notes!
|
| Impl. Note:   > That Said: Several methods in this class DO assume a
|                 map size of 12x16. I'll try to patch this in the next
|                 day or so, but giving you the head's up in any case...
*=====================================================================*/

// "Poor Man's Enum" - but beats 'magic values'.
var CellType = {
  border:    0,
  mapDecor:  1,
  enemyPath: 2,
  buildable: 3,
  ERROR:    -1
}


class TDMap{
  constructor(cellsTall,cellsWide, cellSize){
    this.cellsTall = cellsTall;
    this.cellsWide = cellsWide;
    this.cellSize  = cellSize;
    this.cellSizeH = this.cellSize/2;
    this.map       = [];
    this.mapPath   = [];

    this.entCoord  = [-1,-1];
    this.extCoord  = [-1,-1];

    // Flags for debug/viz
    this.showCellRowColCoords   = false;
    this.showRowColCoordHeaders = false;
    this.showMapPath            = false;
    
    this.resetMap();
  } // Ends Constructor


  /*--------------------------------------------------------------------
  |>>> Function resetMap 
  +---------------------------------------------------------------------
  | Purpose: [Re]Sets map such that the 'edge cells' are designated as 
  |          type 'border' while all other cells are designated as type
  |          'buildable'. This does NOT reset existing map paths, so you
  |          may want to support such if expanding/enhancing this code!
  +-------------------------------------------------------------------*/
  resetMap(){
    for (var r = 0; r < this.cellsTall; r++) {
      this.map[r]=[];
      for (var c = 0; c < this.cellsWide; c++) {
        if(r==0 || c==0 || r==cellsTall-1 || c==cellsWide-1){
          this.map[r][c] = CellType.border;
        }
        else{
          this.map[r][c] = CellType.buildable;
        }
      }
    }    
  } // Ends Function resetMap

  /*--------------------------------------------------------------------
  |>>> Function resetMap 
  +---------------------------------------------------------------------
  | Purpose: Sets all tiles to the input value. NO HANDLING of erroneous
  |          input i.e. coder[s] and user[s] accept this responsibility!
  +-------------------------------------------------------------------*/
  setAllTilesTo(val){
    for (var r = 0; r < this.cellsTall; r++) {
      for (var c = 0; c < this.cellsWide; c++) {
        this.map[r][c]=val;
      }
    }
  } // Ends Function setAllTilesTo

  /*--------------------------------------------------------------------
  |>>> Function setValueAt 
  +---------------------------------------------------------------------
  | Purpose: Sets a tile to the input value specified by the input row 
  |          and col. As with resetMap: there is NO HANDLING for bad val
  |          input; but there is basic handling of bad row/col inputs!
  +-------------------------------------------------------------------*/
  setValueAt(row,col,val){
    if(row<0||row>=this.cellsTall||col<0||col>=this.cellsWide){
      console.log(">>> Error: setValueAt("+row+","+col+","+val+") has invalid parms!");
    }
    else{
      this.map[row][col] = val;
    }
  } // Ends Function setValueAt

  /*--------------------------------------------------------------------
  |>>> Trigger Toggle Functions (Self-Explanatory) 
  +-------------------------------------------------------------------*/
  toggle_ShowCellCoords(){this.showCellRowColCoords = !this.showCellRowColCoords;}
  toggle_ShowHeaderCoords(){this.showRowColCoordHeaders = !this.showRowColCoordHeaders;}
  toggle_ShowMapPath(){this.showMapPath = !this.showMapPath;}


  // FOR NOW - ASSUMES 12x16
  printExtMap(map){
    for(var row=1; row<13; row++){
      let charSamp = "";
      for(var col=0; col<16; col++){
        charSamp += map[row].charAt(col);
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
  }


  // Need to turn [row,col] cell coords into (x,y) waypoints
  loadMapPath(extMap){

    let pathArr = extMap[13]; // prodecural index should be #rows+1

    this.entCoord = pathArr[0];
    this.extCoord = pathArr[pathArr.length-1];

    for (var i = 0; i < pathArr.length; i++) {
      this.mapPath.push(createVector(
        (pathArr[i][1]*this.cellSize)+this.cellSizeH, 
        (pathArr[i][0]*this.cellSize)+this.cellSizeH
      ));
    }
  }


  checkInBounds(r, c){
    return (r>=0 && r<this.cellsTall && c>=0 && c<this.cellsWide);
  } // Ends Method checkInBounds


  render(){
    var temp;
    strokeWeight(1);stroke(144,216,255,144);
    for(var r=0; r<this.cellsTall; r++){
      for(var c=0; c<this.cellsWide; c++){
        temp = this.map[r][c];
        if(temp == CellType.border) {fill(0,0,0);}
        if(temp == CellType.mapDecor) {fill(84,84,84);}
        if(temp == CellType.enemyPath) {fill(72,156,36);}
        if(temp == CellType.buildable){fill(144,84,12);}
        if(temp == CellType.ERROR){fill(255,0,255);}
        rect(c*this.cellSize,r*this.cellSize,this.cellSize,this.cellSize);
      }
    }

    //>>> Note: These calls are in draw-order (i.e. layers in order)
    if(this.showRowColCoordHeaders){this.renderHeaderCoords();}
    if(this.showCellRowColCoords){this.renderCellCoords();}
    if(this.showMapPath){this.renderPathWaypoints();}

  } // Ends Function render


  showCellCoord(row,col){
    stroke(0,0,0,60); fill(255);
    textSize(16); textAlign(CENTER, CENTER);
    let t = "("+row+","+col+")";
    text(t, (this.cellSize*col)+this.cellSizeH,(this.cellSize*row)+this.cellSizeH);        
  }


  renderCellCoords(row, col){
    for(var row=1; row<11; row++){
      for(var col=1; col<15; col++){
        this.showCellCoord(row,col);
      }
    }

    // and show entrance/exit coords
    this.showCellCoord(this.entCoord[0],this.entCoord[1]);
    this.showCellCoord(this.extCoord[0],this.extCoord[1]);
  }


  renderHeaderCoords(){
    // maybe cache these if perform. issue later on?
    let rArrowChar  = String.fromCharCode(0x25B6);
    let dArrowChar = String.fromCharCode(0x25BC);

    let colCol = color(60,120,255);
    let rowCol = color(255,96,72);

    stroke(0,0,0,127); strokeWeight(2); textAlign(RIGHT, CENTER);
    fill(colCol); textSize(18); text("Col "+rArrowChar,this.cellSize-2,this.cellSize*.25);
    fill(rowCol); textSize(18); text(dArrowChar+" Row",this.cellSize-4,this.cellSize*.75);
    
    textAlign(CENTER, CENTER);
    textSize(32);

    fill(colCol);
    for (var col = 1; col < 15; col++) {
      text(col,(this.cellSize*col)+this.cellSizeH,this.cellSizeH);
    }

    fill(rowCol);
    for (var row = 1; row < 11; row++) {
      text(row,this.cellSizeH,(this.cellSize*row)+this.cellSizeH);
    }
  }


  renderPathWaypoints(){
    textAlign(CENTER, CENTER);
    textSize(36);

    fill(255,255,0); stroke(0); strokeWeight(2);
    for (var wpt = 0; wpt < this.mapPath.length; wpt++) {
      text(wpt,this.mapPath[wpt].x,this.mapPath[wpt].y);
    }
  }

} // Ends Class WorldMap