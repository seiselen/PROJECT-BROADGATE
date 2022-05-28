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
  static NULL_SECT = 0;

  static PAINT_FLOOR  = 'f';
  static PAINT_WALL   = 'w';  
  static PAINT_SECTOR = 's';
  static CLEAR_SECTOR = 'x';

  static VIEW_TILE    = 't';
  static VIEW_SECT    = 's';

  constructor(nR, nC, cD){
    //> Map General State
    this.cellsTall = nR;
    this.cellsWide = nC;
    this.cellSize  = cD;
    this.cellHalf  = this.cellSize/2;
    this.tileMap   = [];
    this.sectMap   = [];

    //> Map Sector State
    this.curSectors = 1;   // sector 0 => [NULL_SECT] i.e. undef'd
    this.maxSectors = 128;
    this.delSectors = [];  // deleted sectors which could [should] be recycled

    //> Map Editor Vars
    this.curDrawMode = CaveMap.PAINT_FLOOR;
    this.curViewMode = CaveMap.VIEW_TILE;

    //> Map Generator Vars
    this.minFillPct = 25;
    this.maxFillPct = 55;
    this.curFillPct = 50;

    //> Call Loaders and Inits
    this.initTileMap();
    this.initSectMap();
    this.initGFXVals();

    //> Misc Flags
    this.doPrintValChanges = false; // (true) => prints [some] state val changes/swaps
    this.showCellSectLabel = false; // (true) => disps sector ID over each cell (CPU intense!)
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
  |>>> Function initTileMap 
  +---------------------------------------------------------------------*/   
  initSectMap(){
    for(let r=0; r<this.cellsTall; r++){
      this.sectMap[r]=[];
      for(let c=0; c<this.cellsWide; c++){
        this.sectMap[r].push(CaveMap.NULL_SECT);
      }
    }    
  } // Ends Function initTileMap


  /*----------------------------------------------------------------------
  |>>> Function initGFXVals 
  +---------------------------------------------------------------------*/   
  initGFXVals(){
    this.fill_OPEN = color(144,  84,  12);
    this.fill_WALL = color( 24,  24,  24);

    // good 'ol <colorbrewer2.org/#type=qualitative&scheme=Paired&n=12>
    // only 
    this.fill_SECT = [
      color('#ffffff'),
      color('#a6cee3'),
      color('#1f78b4'),
      color('#b2df8a'),
      color('#33a02c'),
      color('#fb9a99'),
      color('#e31a1c'),
      color('#fdbf6f'),
      color('#ff7f00'),
      color('#cab2d6'),
      color('#6a3d9a'),
      color('#ffff99'),
      color('#b15928')
    ]
  } // Ends Function initGFXVals


  /*----------------------------------------------------------------------
  |>>> Function changeFillPct 
  +---------------------------------------------------------------------*/   
  changeFillPct(opcode){
    if(opcode == '+' && this.curFillPct<this.maxPct){this.curFillPct++;}
    if(opcode == '-' && this.curFillPct>this.minPct){this.curFillPct--;}
    if(this.doPrintValChanges){console.log("curFillPct is now ["+this.curFillPct+"]");}
  } // Ends Function changeFillPct


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
  |>>> Function coordToMidpt 
  +---------------------------------------------------------------------*/
  coordToMidpt(row,col){
    return vec2((col*this.cellSize)+this.cellHalf, (row*this.cellSize)+this.cellHalf);
  } // Ends Function coordToMidpt


  /*----------------------------------------------------------------------
  |>>> Function drawItemToString
  +---------------------------------------------------------------------*/   
  drawItemToString(){
    return (this.curDrawMode==CaveMap.TILE_OPEN) ? "TILE_OPEN" : "TILE_WALL";
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
  |>>> Function getSectOfFirstAdjFound 
  |     o Note: Used by <setCellAtPos> to set cell painted to [OPEN] whose
  |             sector ID is [NULL] to 1st non-null Moore neighbor found.
  +---------------------------------------------------------------------*/   
  getSectOfFirstAdjFound(r,c){
    for(let adjR = r-1; adjR <= r+1; adjR++){
      for(let adjC = c-1; adjC <= c+1; adjC++){
        if(this.isInBounds(adjR,adjC) && this.sectMap[adjR][adjC] > CaveMap.NULL_SECT){
          return this.sectMap[adjR][adjC];
        }
      }
    }
    // all else fails => return [NULL_SECT]
    return CaveMap.NULL_SECT;
  } // Ends Function getSectOfFirstAdjFound


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
  |>>> Function canPaintSector 
  |      o Note: set 'ignoreSectorVal' to [true] if an 'assignRegion' call
  |              is allowed to 'overwrite' cells within some region which
  |              happen to have been (previously) assigned another sector
  |              value (besides [NULL_SECT]).
  +---------------------------------------------------------------------*/
  canPaintSector(row,col,ignoreSectorVal=false){
    return this.isInBounds(row,col) &&
    this.tileMap[row][col] != CaveMap.TILE_WALL &&
    (ignoreSectorVal || (this.sectMap[row][col] == CaveMap.NULL_SECT));
  } // Ends Function canPaintSector


  /*----------------------------------------------------------------------
  |>>> Function setDrawMode 
  |     o Note: Used by DOM UI/UX handler for mode change dropdown select
  +---------------------------------------------------------------------*/   
  setDrawMode(newMode){
    switch(newMode){
      case CaveMap.PAINT_FLOOR: case CaveMap.PAINT_WALL: case CaveMap.PAINT_SECTOR: this.curDrawMode = newMode; break;
      default: console.log("Warning! Invalid Input ["+newMode+"]");
    }
  } // Ends Function setDrawMode


  /*----------------------------------------------------------------------
  |>>> Function setDrawMode 
  |     o Note: Used by DOM UI/UX handler for mode change dropdown select
  +---------------------------------------------------------------------*/   
  setViewMode(newMode){
    switch(newMode){
      case CaveMap.VIEW_SECT: case CaveMap.VIEW_TILE: this.curViewMode = newMode; break;
      default: console.log("Warning! Invalid Input ["+newMode+"]");
    }
  } // Ends Function setDrawMode





  /*----------------------------------------------------------------------
  |>>> Function setCellValAtCoord 
  |     o Note: invalid coords and values are NOT handled (as to KISS)
  +---------------------------------------------------------------------*/  
  setCellValAtCoord(r,c,v){
    this.tileMap[r][c]=v;
  } // Ends Function setCellValAtCoord


  /*----------------------------------------------------------------------
  |>>> Function setCellAtPos 
  |     o Note: will be called in mouse UI handler with 'mousePtToVec'
  +---------------------------------------------------------------------*/   
  setCellAtPos(pos){
    let [r,c] = this.posToCoord(pos);
    if(this.isInBounds(r,c)){
      if(this.curDrawMode==CaveMap.PAINT_WALL){
        this.tileMap[r][c] = CaveMap.TILE_WALL;
        this.sectMap[r][c] = CaveMap.NULL_SECT;
        return;
      }
      if(this.curDrawMode==CaveMap.PAINT_FLOOR){
        this.tileMap[r][c] = CaveMap.TILE_OPEN;
        // gets sector ID of first non [NULL_SECT] Moore neighbor, else stays [NULL_SECT]
        if(this.sectMap[r][c] == CaveMap.NULL_SECT){this.sectMap[r][c] = this.getSectOfFirstAdjFound(r,c);}
      }
    }
  } // Ends Function setCellAtPos


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
    if(this.doPrintValChanges){console.log(sec);}
  } // Ends Function doFloodFill



  /*----------------------------------------------------------------------
  |>>> Function assignSector 
  +---------------------------------------------------------------------*/
  assignSector(/* p5.Vector=>(x,y) XOR int[2]=>[row,col] */ ){
    if(this.curSectors>this.maxSectors){return;}

    let seedRow, seedCol;

    if(arguments.length==1){
      [seedRow,seedCol] = this.posToCoord(arguments[0]);
    }
    else if (arguments.length==2){
      [seedRow,seedCol] = [arguments[0],arguments[1]];
    }


    if(!this.isInBounds(seedRow,seedCol)){return;}
    if(!this.canPaintSector(seedRow,seedCol)){return;}    

    // incorrect assignment... but doesn't break correctness so keeping
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

      this.sectMap[curNode.r][curNode.c] = this.curSectors;
    
      for(let adjR = curNode.r-1; adjR <= curNode.r+1; adjR++){
        for(let adjC = curNode.c-1; adjC <= curNode.c+1; adjC++){
          if(this.isInBounds(adjR,adjC) && (adjR==curNode.r || adjC==curNode.c)){
            curCKey = this.getSearchNodeCSetKey(adjR,adjC);
            if(!closedSet.has(curCKey) && this.canPaintSector(adjR,adjC)){
              closedSet.set(curCKey,1);
              openSet.push(this.getSearchNode(adjR,adjC));
            }          
          }   
        }
      }
      sec++;
    }
    if(this.doPrintValChanges){console.log(sec);}

    this.curSectors++;

    // Basically: foreach new sector greater than the max # colors, set their
    // colors WRT cycling through ONLY the 2nd to 13th in the original set;
    // as color at index zero is reserved for [NULL_SECT] i.e. undef'd only!
    if(this.curSectors>this.fill_SECT.length){
      this.fill_SECT.push(this.fill_SECT[ceil(map((this.curSectors-1)%12, 0,12, 1,12))]);
    }

  } // Ends Function assignSector



 /*----------------------------------------------------------------------
  |>>> Function removeSector 
  +---------------------------------------------------------------------*/
  removeSector(/* p5.Vector=>(x,y) XOR int[2]=>[row,col] */ ){
    /*
    >>> MEH, Not implementing this at the moment, no need. Though for
        future reference: the idea here is to save the sector ID of the
        target cell, clear any cells with its sector ID, then append the
        ID to the 'delSectors' array. I will then need to query this array
        on each call of 'assignSector' such that if (length>0): I make a
        <shift> call on the array (i.e. dequeue) and assign all the cells
        of the new sector to the recycled ID that was just dequeued.

    let remRow, remCol;

    if(arguments.length==1){
      [remRow,remCol] = this.posToCoord(arguments[0]);
    }
    else if (arguments.length==2){
      [remRow,remCol] = [arguments[0],arguments[1]];
    }

    if(!this.isInBounds(remRow,remCol)){return;}
    if(this.tileMap[remRow][remCol]==CaveMap.TILE_WALL){return;}
    */
  } // Ends Function removeSector


 /*----------------------------------------------------------------------
  |>>> Function onMouseDown 
  +---------------------------------------------------------------------*/
  onMouseDown(mousePos){
    this.setCellAtPos(mousePtToVec());
  } // Ends Function onMouseDown


 /*----------------------------------------------------------------------
  |>>> Function onMousePressed 
  +---------------------------------------------------------------------*/
  onMousePressed(mousePos){
    switch(this.curDrawMode){
      case CaveMap.PAINT_SECTOR: this.assignSector(mousePos); return;
      case CaveMap.CLEAR_SECTOR: this.removeSector(mousePos); return;
    }
  } // Ends Function onMousePressed


  /*----------------------------------------------------------------------
  |>>> Function render
  +---------------------------------------------------------------------*/   
  render(){
    switch(this.curViewMode){
      case CaveMap.VIEW_TILE: this.renderTileMap(); return;
      case CaveMap.VIEW_SECT: this.renderSectMap(); return;
    }
  } // Ends Function render


  /*----------------------------------------------------------------------
  |>>> Function renderTileMap
  +---------------------------------------------------------------------*/   
  renderTileMap(){
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
  } // Ends Function renderTileMap


  /*----------------------------------------------------------------------
  |>>> Function renderSectMap
  +---------------------------------------------------------------------*/
  renderSectMap(){
    noStroke(); fill(0);
    let curSect;
    let curMdPt;
    for(let r=0; r<this.cellsTall; r++){
      for(let c=0; c<this.cellsWide; c++){
        if(this.tileMap[r][c]==CaveMap.TILE_WALL){fill(this.fill_WALL);}
        else{
          curSect = this.sectMap[r][c];
          fill(this.fill_SECT[curSect]) 
          rect(c*this.cellSize,r*this.cellSize,this.cellSize,this.cellSize);
          if(this.showCellSectLabel){
            fill(0);
            curMdPt = this.coordToMidpt(r,c);
            text(curChar,curMdPt.x,curMdPt.y);
          }    
        }
      }
    }
  } // Ends Function renderSectMap




} // Ends Class CaveMap