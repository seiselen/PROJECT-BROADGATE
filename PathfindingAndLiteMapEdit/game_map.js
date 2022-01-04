var TileType = {
  dirt:  0,
  gras:  1,
  road:  2,
  pave:  3,
  sand:  4,
  watr:  5,
  ERRR: -1,
  cost : (ID)=>{switch(ID){
    case TileType.road : return 1;
    case TileType.pave : return 2;
    case TileType.dirt : return 16;
    case TileType.gras : return 32;
    case TileType.sand : return 64;
    case TileType.watr : return 1024;
    default: return 9999;
  }}
}; // Ends Enum TileType


class GameMap{
  constructor(cellsTall,cellsWide, cellSize){
    this.cellsTall = cellsTall;
    this.cellsWide = cellsWide;
    this.cellSize  = cellSize;
    this.cellHalf  = this.cellSize/2;
    this.map_tile  = []; // stores TileType val informing of cell's current tile type
    this.showGrid  = true;

    this.initColorPallete();
    this.initTileMap();
  } // Ends Constructor


  //####################################################################
  //>>> LOADER/[RE]INIT FUNCTIONS
  //####################################################################
  initColorPallete(){
    //> Grid-Related Settings
    this.strk_grid = color(60,128);    
    this.sWgt_grid = 2; 

    //> Tile-Map Settings
    this.fill_terr_road = color( 84,  84,  84);
    this.fill_terr_pave = color(168, 168, 168);    
    this.fill_terr_dirt = color(144,  84,  12);
    this.fill_terr_gras = color(  0, 144,  24);       
    this.fill_terr_sand = color(255, 216, 144);
    this.fill_terr_watr = color( 60, 120, 180);
    this.fill_terr_ERRR = color(255,   0, 255);    

    //> Translucent 'foreground' indicating [IMPASSIBLE] cell
    this.fill_impassible = color(240,60,48,128);

  } // Ends Function initColorPallete

  initTileMap(){
    for(let r=0; r<this.cellsTall; r++){this.map_tile[r]=[]; for(let c=0; c<this.cellsWide; c++){this.map_tile[r][c]=TileType.dirt;}}    
  } // Ends Function initTileMap


  //####################################################################
  //>>> SETTER FUNCTIONS
  //####################################################################
  setValueAt(coord,val){
    if(this.cellInBounds(coord)){this.map_tile[coord[0]][coord[1]] = val;}
    else{console.log(">>> ERRR: setValueAt("+row+","+col+","+val+") has invalid parms!");}
  } // Ends Function setValueAt

  floodFill(seedRow, seedCol, newVal){
    if(!this.cellInBounds(seedRow,seedCol)){return;}

    let curVal    = this.map_tile[seedRow][seedCol];
    let temp      = null;
    let openSet   = [];
    let closedSet = new Map();

    openSet.push([seedRow,seedCol]);
    closedSet.set( ""+seedRow+","+seedCol, 1);
  
    let curSec = 0;
    let maxSec = this.cellsWide*this.cellsTall;

    while(curSec<maxSec && openSet.length > 0){
      temp = openSet.shift();
    
      this.setValueAt(temp,newVal); // <-- IMPROVEMENT <vs> ZAC MVP one, should refactor it [!/?]
    
      for(let adjR = temp[0]-1; adjR <= temp[0]+1; adjR++){
        for(let adjC = temp[1]-1; adjC <= temp[1]+1; adjC++){
          console.log(adjR+","+adjC);
          // don't know why 2nd conditional constrains WRT to Von Neuman neighborhood, but okelie dokelie...
          if(this.cellInBounds(adjR,adjC) && (adjR==temp[0] || adjC==temp[1])){
            // Final conditional makes sure all prospective filled tiles need to match original seed tile type
            if(!closedSet.get(""+adjR+","+adjC) && this.map_tile[adjR][adjC] == curVal){
              closedSet.set(""+adjR+","+adjC, 1);
              openSet.push([adjR,adjC]);    
            }          
          }   
        }
      }
      curSec++;
    }  
    console.log("SEC = " + curSec + " MAX = " + maxSec);
    // might be overkill, but #yolo
    openSet.length = 0;
    closedSet.clear();
  } // Ends Function floodFill

  //####################################################################
  //>>> GETTER FUNCTIONS
  //####################################################################
  posToCoord(pos){
    return [floor(pos.y/this.cellSize),floor(pos.x/this.cellSize)];
  } // Ends Function posToCoord

  posToMidpt(pos){
    return this.coordToPos(this.posToCoord(pos));
  } // Ends Function posToMidpt

  // more appropriate name would be 'coordToMidPt' but legacy so KISS
  coordToPos(v1,v2){
    switch(arguments.length){
      case 1: return vec2((v1[1]*this.cellSize)+this.cellHalf, (v1[0]*this.cellSize)+this.cellHalf);
      case 2: return vec2((v2*this.cellSize)+this.cellHalf, (v1*this.cellSize)+this.cellHalf);
    }
  } // Ends Function coordToPos

  posInBounds(pos){
    return (pos.x>=0 && pos.y>=0 && pos.x<this.areaWide && pos.y<this.areaTall);
  } // Ends Function posInBounds

  cellInBounds(v1,v2){
    switch(arguments.length){
      case 1: return this.cellInBounds(v1[0],v1[1]);
      case 2: return (v1>=0 && v1<this.cellsTall && v2>=0 && v2<this.cellsWide);
    }
  } // Ends Function cellInBounds


  //####################################################################
  //>>> FUNCTION PAIR 'loadMap' and 'mapToString' [KEEP GROUPED FOR NOW]
  //####################################################################
  loadMap(mapArr=null){
    if(mapArr){
      for(let r=0; r<this.cellsTall; r++){
        for(let c=0; c<this.cellsWide; c++){
          switch(mapArr[r][c]){
            case 'r': this.map_tile[r][c] = TileType.road; break;
            case 'p': this.map_tile[r][c] = TileType.pave; break;
            case 'd': this.map_tile[r][c] = TileType.dirt; break;            
            case 'g': this.map_tile[r][c] = TileType.gras; break;
            case 's': this.map_tile[r][c] = TileType.sand; break;            
            case 'w': this.map_tile[r][c] = TileType.watr; break;
            default : this.map_tile[r][c] = TileType.ERRR; break;
          }
        }
      }   
    }
    return this; // for function chaining 
  } // Ends Function loadMap

  mapToString(nLine="\n"){
    let retStr = "map = [" + nLine;
    for (var r=0; r<this.cellsTall; r++){
      retStr += "[";
      for (var c=0; c<this.cellsWide; c++){
        retStr+="\'";
        switch(this.map_tile[r][c]){
            case CellType.road : retStr+='r'; break;
            case CellType.pave : retStr+='p'; break;
            case CellType.dirt : retStr+='d'; break;
            case CellType.gras : retStr+='g'; break;
            case CellType.sand : retStr+='s'; break;
            case CellType.watr : retStr+='w'; break;
            default :            retStr+='?'; break;
        }
        retStr+="\'";
        if(c<this.cellsWide-1){retStr+=',';}
      }
      retStr += "],"+nLine;
    }
    retStr += "];";
    return retStr;
  } // Ends Function mapToString


  //####################################################################
  //>>> RENDER FUNCTIONS
  //####################################################################
  render(){
    this.renderMap();
    if(this.showGrid){this.renderGrid();}
    if(this.showCoord){this.renderCoords();}    
  } // Ends Function render

  renderMap(){
    noStroke();
    for(let r=0; r<this.cellsTall; r++){
      for(let c=0; c<this.cellsWide; c++){
        switch(this.map_tile[r][c]){
            case TileType.road: fill(this.fill_terr_road); break;
            case TileType.pave: fill(this.fill_terr_pave); break;
            case TileType.dirt: fill(this.fill_terr_dirt); break;            
            case TileType.gras: fill(this.fill_terr_gras); break;
            case TileType.sand: fill(this.fill_terr_sand); break;            
            case TileType.watr: fill(this.fill_terr_watr); break;
            default :           fill(this.fill_ERRR);
        }
        rect(c*this.cellSize,r*this.cellSize,this.cellSize,this.cellSize);
      }
    }
  } // Ends Function renderMap

  renderGrid(){
    strokeWeight(this.sWgt_grid); stroke(this.strk_grid);
    for(let i=0; i<=this.cellsTall; i++){line(0,this.cellSize*i,width,this.cellSize*i);}
    for(let j=0; j<=this.cellsWide; j++){line(this.cellSize*j,0,this.cellSize*j,height);}
  } // Ends Function renderGrid  

} // Ends Class GameMap