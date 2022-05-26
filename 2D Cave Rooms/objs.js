/*======================================================================
|>>> Class CaveMap
+-----------------------------------------------------------------------
| Description: <TBD>
+-----------------------------------------------------------------------
|> Implementation Notes:
|   o Opting to jam the map editing and generator code into the CaveMap
|     class s.t. it's all-encompassing. Not good modularity, but this is
|     a single project refactor; and ZAC has a much nicer family of map
|     classes to satisfy both Uncle Bob (Clean Coding) and Coder Jesus.
+=====================================================================*/
class CaveMap{
  static TILE_OPEN = 0;
  static TILE_WALL = 1;
  
  constructor(nR, nC, cD){
    //> Map General State
    this.cellsTall = nR;
    this.cellsWide = nC;
    this.cellSize  = cD;
    this.cellHalf  = this.cellSize/2;
    this.tileMap   = [];

    //> Map Sector State
    this.curSectors = 0;
    this.maxSectors = 12;

    //> Map Editor Vars
    this.curDrawItem = CaveMap.TILE_OPEN;
    this.curFloodOpt = CaveMap.TILE_WALL;

    //> Map Generator Vars
    this.minFillPct = 25;
    this.maxFillPct = 55;
    this.curFillPct = 50;

    //> Call Loaders and Inits
    this.initTileMap();
    this.initGFXVals();

    //> Misc Flags
    this.doPrintValChanges = true; // (true) => prints [some] state val changes/swaps
  } // Ends Constructor


  /*----------------------------------------------------------------------
  |>>> Function initTileMap 
  +---------------------------------------------------------------------*/   
  initTileMap(){
    for(let r=0; r<this.cellsTall; r++){
      this.tileMap[r]=[];
      for(let c=0; c<this.cellsWide; c++){
        this.tileMap[r].push(CaveMap.TILE_WALL);
      }
    }    
  } // Ends Function initTileMap


  /*----------------------------------------------------------------------
  |>>> Function initGFXVals 
  +---------------------------------------------------------------------*/   
  initGFXVals(){
    this.fill_OPEN = color(144,  84,  12);
    this.fill_WALL = color( 24,  24,  24);
    //> SECTOR COLORMAP VIA ORIG VERZ: [(#3c3c3c),(#a6cee3),(#1f78b4),(#b2df8a),(#33a02c),(#fb9a99),(#e31a1c),(#fdbf6f),(#ff7f00),(#cab2d6),(#6a3d9a),(#ffff99),(#b15928)]
  } // Ends Function initGFXVals


  /*----------------------------------------------------------------------
  |>>> Function changeFillPct 
  +---------------------------------------------------------------------*/   
  changeFillPct(opcode){
    if(opcode == '+' && this.curFillPct<this.maxPct){this.curFillPct++;}
    if(opcode == '-' && this.curFillPct>this.minPct){this.curFillPct--;}
    if(this.doPrintValChanges){console.log("curFillPct is now ["+this.curFillPct+"]");}
  } // Ends Function changeFillPct


  /* 
  changeFloodMode(){
    if(floodMode==floodWall){floodMode=floodSector;}
    else{floodMode=floodWall;}
  } // Ends Function changeFloodMode  
  */

  /*----------------------------------------------------------------------
  |>>> Function swapDrawOption 
  +---------------------------------------------------------------------*/   
  swapDrawOption(){
    this.curDrawItem = (this.curDrawItem==CaveMap.TILE_OPEN) ? CaveMap.TILE_WALL : CaveMap.TILE_OPEN;
    if(this.doPrintValChanges){console.log("curDrawItem is now ["+this.drawItemToString()+"]");}
  } // Ends Function swapDrawOption




  /*----------------------------------------------------------------------
  |>>> Function isInBounds 
  +---------------------------------------------------------------------*/   
  isInBounds(r,c){
    return (r>=0 && r<this.cellsTall && c>=0 && c<this.cellsWide);
  } // Ends Function isInBounds


  /*----------------------------------------------------------------------
  |>>> Function isEdgeCell
  |     o Note 1: true => row or col is 0 or cellsTall/cellsWide resp.
  +---------------------------------------------------------------------*/   
  isEdgeCell(r,c){
    return (r==0 || r==this.cellsTall-1 || c==0 || c==this.cellsWide-1);
  } // Ends Function isEdgeCell


  /*----------------------------------------------------------------------
  |>>> Function posToCoord 
  |     o Note: retuns int[2] => [<row>,<col>] per usual (i.e. WRT ZAC)
  +---------------------------------------------------------------------*/
  posToCoord(pos){
    return [int(pos.y/this.cellSize), int(pos.x/this.cellSize)];
  } // Ends Function posToCoord


  /*----------------------------------------------------------------------
  |>>> Function coordToTLPos 
  |     o Note 1: inputs [<row>,<col>] and outputs (x,y) per ZAC method
  |     o Note 2: returns vec3 s.t. <z> component => cellSize; which is
  |               needed by 'cellCursor' <vs> getting via 'Config' global.
  +---------------------------------------------------------------------*/
  coordToTLPos(coord){
    return vec3(coord[1]*this.cellSize, coord[0]*this.cellSize, this.cellSize);
  } // Ends Function coordToTLPos


  /*----------------------------------------------------------------------
  |>>> Function drawItemToString
  +---------------------------------------------------------------------*/   
  drawItemToString(){
    return (this.curDrawItem==CaveMap.TILE_OPEN) ? "TILE_OPEN" : "TILE_WALL";
  } // Ends Function drawItemToString


  /*----------------------------------------------------------------------
  |>>> Function getAdjTotal
  +-----------------------------------------------------------------------
  | Overview: Basically, returns how many adjacencies of the cell at the 
  |           input-speficied coords are of type [WALL], s.t. any of which
  |           are out-of-bounds are ALSO considered to be type [WALL].
  +---------------------------------------------------------------------*/
  getAdjTotal(r, c){
    let tot = 0;
    for(let adjR = r-1; adjR <= r+1; adjR++){
      for(let adjC = c-1; adjC <= c+1; adjC++){
        if(this.isInBounds(adjR,adjC)){if(adjR!=r || adjC!=c){tot += this.tileMap[adjR][adjC];}}
        else{tot+=CaveMap.TILE_WALL;}
      }
    }
    return tot;
  } // Ends Function getAdjTotal


  /*----------------------------------------------------------------------
  |>>> Function getSearchNode 
  |     o Note: Used by doFloodFill, def'ing here to ensure consistency
  +---------------------------------------------------------------------*/   
  getSearchNode(inR,inC){
    return {r:inR,c:inC};
  } // Ends Function getSearchNode


  /*----------------------------------------------------------------------
  |>>> Function getSearchNode 
  |     o Note: Used by doFloodFill, def'ing here to ensure consistency
  +---------------------------------------------------------------------*/   
  getSearchNodeCSetKey(inR,inC){
    return ""+inR+","+inC;
  } // Ends Function getSearchNode


  /*----------------------------------------------------------------------
  |>>> Function setCellAtPos 
  |     o Note: will be called in mouse UI handler with 'mousePtToVec'
  +---------------------------------------------------------------------*/   
  setCellAtPos(pos){
    let coord = this.posToCoord(pos);
    if(this.isInBounds(coord[0],coord[1])){
      this.tileMap[coord[0]][coord[1]] = this.curDrawItem;
    }
  } // Ends Function setCellAtPos


  /*----------------------------------------------------------------------
  |>>> Function setCellValAtCoord 
  |     o Note: invalid coords and values are NOT handled (as to KISS)
  +---------------------------------------------------------------------*/  
  setCellValAtCoord(r,c,v){
    this.tileMap[r][c]=v;
  } // Ends Function setCellValAtCoord





  /*----------------------------------------------------------------------
  |>>> Function randPopTileMap (Random Populate Tile Map)
  +---------------------------------------------------------------------*/   
  randPopTileMap(){
    let v = CaveMap.TILE_OPEN;
    for(var r=0; r<this.cellsTall; r++){
      for(var c=0; c<this.cellsWide; c++){
        v = this.isEdgeCell(r,c) ? CaveMap.TILE_WALL : (int(random(100)) < this.curFillPct) ? CaveMap.TILE_WALL : CaveMap.TILE_OPEN;
        this.setCellValAtCoord(r,c,v);
      }
    }
  } // Ends Function randPopTileMap


  /*----------------------------------------------------------------------
  |>>> Function doCASmoothOnce
  |     o Note 1: This is via the orig version which used an 'in-place' CA
  |               update mechanism <vs> a 'compute-and-replace' one. As a 
  |               TODO: should I implement the latter to see what it does?
  |     o Note 2: CA Ruleset [appears to be] as follows; for each cell:
  |                > Get the # of adjacencies in its Moore Neighborhood
  |                  that are either of type [WALL] or out-of-bounds A/A.
  |                > If there are more than [4] thereof: become [WALL]
  |                > If there are less than [4] thereof: become [OPEN]
  |                > Elif there are exactly [4] thereof: stay the same  
  ----------------------------------------------------------------------*/
  doCASmoothOnce(){
    var nAdjs;
    for(var r=0; r<this.cellsTall; r++){
      for(var c=0; c<this.cellsWide; c++){
        nAdjs = this.getAdjTotal(r,c);
        if(nAdjs>4){this.tileMap[r][c]=CaveMap.TILE_WALL;}
        else if(nAdjs<4){this.tileMap[r][c]=CaveMap.TILE_OPEN;}
      }
    }
  } // Ends Function doCASmoothOnce


  /*----------------------------------------------------------------------
  |>>> Function doCASmoothNTimes
  ----------------------------------------------------------------------*/  
  doCASmoothNTimes(nTimes){
    for(let i=0; i<nTimes; i++){this.doCASmoothOnce();}
  } // Ends Function doCASmoothNTimes





  /*----------------------------------------------------------------------
  |>>> Function doFloodFillAtPos
  ----------------------------------------------------------------------*/  
  doFloodFillAtPos(pos){
    this.doFloodFill(this.posToCoord(pos));
  } // Ends Function doFloodFillAtPos



  /*----------------------------------------------------------------------
  |>>> Function doFloodFill
  |      o Note 1: Currently explores VON NEUMAN neighborhood only (i.e.
  |                does NOT consider diagonal adjacencies!)
  +---------------------------------------------------------------------*/
  doFloodFill(seedRow, seedCol, fillItem){
    if(!this.isInBounds(seedRow,seedCol)){return;}

    let seedTile = this.tileMap[seedRow][seedCol];

    let openSet   = [];
    let closedSet = new Map();

    let curNode = this.getSearchNode(seedRow,seedCol);
    let curCKey = this.getSearchNodeCSetKey(seedRow,seedCol)
    openSet.push(curNode);
    closedSet.set(curCKey,1);
  
    let sec=0; let maxSec = this.cellsWide*this.cellsTall;
    while(sec<maxSec && openSet.length > 0){
      curNode = openSet.shift();
    
      this.tileMap[curNode.r][curNode.c]=fillItem;
    
      for(let adjR = curNode.r-1; adjR <= curNode.r+1; adjR++){
        for(let adjC = curNode.c-1; adjC <= curNode.c+1; adjC++){
          if(this.isInBounds(adjR,adjC) && (adjR==curNode.r || adjC==curNode.c)){
            curCKey = this.getSearchNodeCSetKey(adjR,adjC);
            if(!closedSet.has(curCKey) && this.tileMap[adjR][adjC] == seedTile){
              closedSet.set(curCKey,1);
              openSet.push(this.getSearchNode(adjR,adjC));
            }          
          }   
        }
      }
      sec++;
    }
    console.log(sec);
  } // Ends Function doFloodFill







  /*----------------------------------------------------------------------
  |>>> Function render
  +---------------------------------------------------------------------*/   
  render(){
    noStroke();
    for(let r=0; r<this.cellsTall; r++){
      for(let c=0; c<this.cellsWide; c++){
        switch(this.tileMap[r][c]){
          case CaveMap.TILE_OPEN : fill(this.fill_OPEN); break;
          case CaveMap.TILE_WALL : fill(this.fill_WALL); break;
        }
        rect(c*this.cellSize,r*this.cellSize,this.cellSize,this.cellSize);
      }
    }
  } // Ends Function render



} // Ends Class CaveMap