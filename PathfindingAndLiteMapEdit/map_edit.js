
class MapEditor{
  static maxPaintSize = 5;
  static tileSeedPct  = 5; // Percent chance that random tile gets seeded with some type (e.g. for lake, pond, field, etc. generation)

  constructor(gMap){
    this.map = gMap;
    this.paintSize = 1; // square # tiles to paint map tiles (i.e. 'paint water tiles 3x3'); a.k.a. 'drawCellSize' in PathfindingProcessing
    this.paintType = TileType.DIRT;
    this.paintFill = false;

    this.flowField  = [];
    this.noiseScale = 0.25; 

    this.debugPrint = true;

  }

  initFlowField(){
    for(let r=0; r<this.map.cellsTall; r++){this.flowField[r]=[]; for(let c=0; c<this.map.cellsWide; c++){this.flowField[r][c]=0;}} 
    return this; // used for method chaining as typically called preceeding 'randFlowField' call 
  } // Ends Function initFlowField

  randFlowField(){
    noiseSeed(Date.now());
    for(let r=0; r<this.map.cellsTall; r++){for(let c=0; c<this.map.cellsWide; c++){
      this.flowField[r][c]=noise(r*this.noiseScale,c*this.noiseScale);
    }}
  } // Ends Function randFlowField

  // Gets coord that is IN BOUNDS of map, of course!
  getRandomCoord(){
    return [int(random(1,this.map.cellsTall)),int(random(1,this.map.cellsWide))];
  }

  getAdjTotal(row, col, tile){
    let tot = 0;
    for(let adjR = row-1; adjR <= row+1; adjR++){
      for(let adjC = col-1; adjC <= col+1; adjC++){
        if((adjC!=col || adjR!=row) && this.map.cellInBounds(adjR,adjC) && this.map.getValueAt(adjR,adjC) == tile){tot++;}
      }
    }
    return tot;
  } // Ends Function getAdjTotal



  //> Warning: Invalid Input NOT handled (though painted tiles will likely appear 'ERROR' purple)
  setPaintType(newType){this.paintType = newType;}

  setPaintSize(coTerm){this.paintSize = constrain(this.paintSize+coTerm, 1, MapEditor.maxPaintSize);}

  paintAtMouseTile(){
    let mouseCoord = this.map.posToCoord(mousePtToVec());
    (this.paintSize==1) ? this.paintSingle(mouseCoord) : this.paintRegion(mouseCoord);
  } // Ends Function paintAtMouseTile

  paintSingle(coord){
    this.map.setValueAt(coord,this.paintType);
  } // Ends Function paintSingle

  paintRegion(coord){
    let temp = [-1,-1];
    for(let r=coord[0]; r<coord[0]+this.paintSize; r++){
      for(let c=coord[1]; c<coord[1]+this.paintSize; c++){
        if(this.map.cellInBounds(r,c)){temp[0]=r; temp[1]=c; this.paintSingle(temp);}    
      }
    }
  } // Ends Function paintRegion


  /*--------------------------------------------------------------------
  |>>> Function floodFill
  +---------------------------------------------------------------------
  |> 'Canon' Note: This is now the OFFICIAL VERSION; i.e. TODO is remove
  |                analog in ZAC-MVP's GameMap class (especially as the
  |                GameMap should NOT contain any other map-edit-related
  |                functions other than setting tile values as getters).
  +-------------------------------------------------------------------*/
  floodFill(seedRow, seedCol, newVal){
    if(!this.map.cellInBounds(seedRow,seedCol)){return;}
    let curVal    = this.map.map_tile[seedRow][seedCol];
    let temp      = null;
    let openSet   = [];
    let closedSet = new Map();
    let curSec    = 0;
    let maxSec    = this.map.cellsWide*this.map.cellsTall;
    
    openSet.push([seedRow,seedCol]);
    closedSet.set(""+seedRow+","+seedCol, 1);

    while(curSec<maxSec && openSet.length > 0){
      temp = openSet.shift();
      this.map.setValueAt(temp,newVal);
      for(let adjR = temp[0]-1; adjR <= temp[0]+1; adjR++){
        for(let adjC = temp[1]-1; adjC <= temp[1]+1; adjC++){
          // Von Neuman Neighborhood <vs> Moore bc of pesky diagonal-border cells
          if(this.map.cellInBounds(adjR,adjC) && (adjR==temp[0] || adjC==temp[1])){
            // Final conditional makes sure all prospective filled tiles need to match original seed tile type
            if(!closedSet.get(""+adjR+","+adjC) && this.map.map_tile[adjR][adjC] == curVal){
              closedSet.set(""+adjR+","+adjC, 1);
              openSet.push([adjR,adjC]);    
            }          
          }   
        }
      }
      curSec++;
    }
    // console.log("SEC = " + curSec + " MAX = " + maxSec);
    openSet.length = 0;
    closedSet.clear();
  } // Ends Function floodFill


  /*--------------------------------------------------------------------
  |>>> Function floodFillAtMouseTile
  +---------------------------------------------------------------------
  | Overview: Calls 'floodFill' with the cell coordinate corresponding
  |           to the current mouse position over the cancas; 'Nuff Said.
  +-------------------------------------------------------------------*/
  floodFillAtMouseTile(){
    let mouseCoord = this.map.posToCoord(mousePtToVec());
    this.floodFill(mouseCoord[0], mouseCoord[1], this.paintType);
  } // Ends Function floodFillAtMouseTile


  /*--------------------------------------------------------------------
  |>>> Function makeRiver
  +-------------------------------------------------------------------*/
  makeRiver(source,destin){
    let buffer = source;
    this.map.setValueAt(buffer,TileType.WATER);
    
    while(buffer[0] != destin[0] || buffer[1] != destin[1]) {
      // I am above and to the left of my destination...Move me either right or down
      if(buffer[1]<destin[1] && buffer[0]<destin[0]){if(int(random(2))==1){buffer[1]+=1;}else{buffer[0]+=1;}}
      // I am above and to the right of my destination...Move me either left or down
      else if(buffer[1]>destin[1] && buffer[0]<destin[0]){if(int(random(2))==1){buffer[1]-=1;} else{buffer[0]+=1;}}
      // I am below and to the left of my destination...Move me either right or up
      else if (buffer[1]<destin[1] && buffer[0]>destin[0]){if(int(random(2))==1){buffer[1]+=1;}else{buffer[0]-=1;}}
      // I am below and to the right of my destination...Move me either left or up
      else if (buffer[1]>destin[1] && buffer[0]>destin[0]){if(int(random(2))==1){buffer[1]-=1;}else{buffer[0]-=1;}}
      // I am one of the remaining [strictly] {above, below, left, right} cases, handle me accordingly
      else if (buffer[1]<destin[1]){buffer[1]+=1;} 
      else if (buffer[1]>destin[1]){buffer[1]-=1;}   
      else if (buffer[0]<destin[0]){buffer[0]+=1;}
      else if (buffer[0]>destin[0]){buffer[0]-=1;}
      // Set the tile I ended up moving to with tile type water
      this.map.setValueAt(buffer,TileType.WATER);
    } // Ends While Loop
  } // Ends Function makeRiver

  /*--------------------------------------------------------------------
  |>>> Function makeRandomRiver
  +---------------------------------------------------------------------
  | Overview: Calls 'makeRiver' with input via valls of 'gerRandomCoord'
  |           (ergo on 'random-but-in-range' coordinates); 'Nuff Said. 
  +-------------------------------------------------------------------*/
  makeRandomRiver(){
    this.makeRiver(this.getRandomCoord(),this.getRandomCoord());
  } // Ends Function makeRandomRiver


  /*--------------------------------------------------------------------
  |>>> [INCOMPLETE-VIA-R&D] Function makeRiverViaFlowField
  +---------------------------------------------------------------------
  | Overview: At the moment, generates extremely long winding rivers via
  |           utilizing a perlin [open simplex?] noise flow-field. This
  |           was an unexpected but delightfully interesting suprise, as
  |           I was about to comment it out as currently degenerate but 
  |           worth perhaps some future R&D! Suffice it to say that such
  |           is now certainly worthy thereto: however I want to get the 
  |           remaining 'ClassicMapMaker' Processing code refactored and
  |           and installed to this project first, before launching any 
  |           expeditions (especially of the Project Genesis type).
  +---------------------------------------------------------------------
  |> Special Note: Logic Schema For Current Switch Case Ternary
  |  > Condition 1:   Rejects adjacencies whose locations are opposite
  |                   to the flow direction of this cell.
  |  > Condition 2:   Rejects adjacencies whose flow directions are
  |                   opposite to the flow direction of this cell.
  |  > Condition 3,4: For adjacencies whose locations are neither equal
  |                   nor opposite to the flow direction of this cell, 
  |                   rejects any whose flow direction leads into this
  |                   cell xor parallel thereto.
  |  > Condition 5:   Admits adjacencies whose location (as relative to
  |                   this cell) and flow direction both match the flow
  |                   direction of this cell (i.e. form a 'straight-line
  |                   'path with this cell). As this is the 'preference'
  |                   for heuristic reasons discussed below, such cases
  |                   thus receive a score of [2].
  |  > Default Case:  Admits remaining adjacencies, encompassing those
  |                   whose locations and/or directions lead 'forwards
  |                   and/or outwards from this cell' WRT its location 
  |                   and direction. Such cases receive a score of [1],
  |                   implying they are at least satisfactory if there
  |                   exists no adjacency of the preferential case.
  |> Special Note: Rationale for Aforementioned 'Preferential Condition'
  |  > Despite the main motivation of this 'complicated as fuck' version
  |    being to PREVENT the undesirable "little diagonal squiggle [good]
  |    followed by straight line run to the destination [bad]" scenario
  |    of the original version, I believe this behavior needs to (rather
  |    ironically) be encouraged: at least on a cell-to-cell basis.
  |  > The main rational why is that I suspect the flow field will (or
  |    at least naturally ought to) minimize significant spans of some
  |    same direction while being 'smoothly random' in the variation of
  |    flows thereof; consequent of their [perlin] noise computation.
  +---------------------------------------------------------------------
  |> NAT[S]: Figure out how to [better] handle diagonal directions; and
  |          recall that clipping them to Von Neuman neighbor cells only
  |          (i.e. {N,S,E,W} worked like crap, so that's not an option).
  +-------------------------------------------------------------------*/
  makeRiverViaFlowField(source,destin){
    let openSet   = new PriorityQueue((p,q)=>(Math.sign(q[2]-p[2])));
    let closedSet = new Map();
    let curSec    = 0;
    let maxSec    = this.map.cellsWide*this.map.cellsTall;
    let myDir     = -1;
    let prefAdj   = null;
    let curNode   = [source[0],source[1],0,null];

    openSet.enqueue(curNode);
    closedSet.set((""+curNode[0]+","+curNode[1]), curNode);

    while(!openSet.isEmpty() && curSec<maxSec){
      curNode = openSet.dequeue();

      if(arr2Equals(curNode,destin)){break;}

      myDir = bucket(this.flowField[curNode[0]][curNode[1]], 8);

      for(let adjR = curNode[0]-1; adjR <= curNode[0]+1; adjR++){
        for(let adjC = curNode[1]-1; adjC <= curNode[1]+1; adjC++){
          // If adjacency is in bounds, in the Von Neuman Neighborhood, and has NOT [yet] been placed on the closed set
          if(this.map.cellInBounds(adjR,adjC) && (adjR==curNode[0] || adjC==curNode[1]) && !closedSet.get(""+adjR+","+adjC)){

            let adjLoc = Direction[((adjR>curNode[0]) ? 'N' : (adjR<curNode[0]) ? 'S' : (adjC>curNode[1]) ? 'E' : (adjC<curNode[1]) ? 'W' : 'X')];
            let adjDir = bucket(this.flowField[adjR][adjC],8);

            // see comment above for more info
            let adjScore = 0;
            switch(myDir){
              case Direction.N: adjScore = ((adjLoc == Direction.S) ? 0 : (adjDir == Direction.S || adjDir==Direction.SW || adjDir==Direction.SE) ? 0 : (adjLoc == Direction.W && (adjDir==Direction.NE || adjDir==Direction.E)) ? 0 : (adjLoc == Direction.E && (adjDir==Direction.NW || adjDir==Direction.W)) ? 0 : (adjLoc == myDir && adjDir == myDir) ? 2 : 1); break;
              case Direction.S: adjScore = ((adjLoc == Direction.N) ? 0 : (adjDir == Direction.N || adjDir==Direction.NW || adjDir==Direction.NE) ? 0 : (adjLoc == Direction.W && (adjDir==Direction.SE || adjDir==Direction.E)) ? 0 : (adjLoc == Direction.E && (adjDir==Direction.SW || adjDir==Direction.W)) ? 0 : (adjLoc=myDir && adjDir==myDir) ? 2 : 1); break;
              case Direction.E: adjScore = ((adjLoc == Direction.W) ? 0 : (adjDir == Direction.W || adjDir==Direction.NW || adjDir==Direction.SW) ? 0 : (adjLoc == Direction.N && (adjDir==Direction.SE || adjDir==Direction.S)) ? 0 : (adjLoc == Direction.S && (adjDir==Direction.NE || adjDir==Direction.N)) ? 0 : (adjLoc=myDir && adjDir==myDir) ? 2 : 1); break;
              case Direction.W: adjScore = ((adjLoc == Direction.E) ? 0 : (adjDir == Direction.E || adjDir==Direction.NE || adjDir==Direction.SE) ? 0 : (adjLoc == Direction.N && (adjDir==Direction.SW || adjDir==Direction.S)) ? 0 : (adjLoc == Direction.S && (adjDir==Direction.NW || adjDir==Direction.N)) ? 0 : (adjLoc=myDir && adjDir==myDir) ? 2 : 1); break;
              default:          adjScore = 0;
            }

            openSet.enqueue([adjR,adjC,curNode[2]+adjScore,curNode]); 
            closedSet.set(""+adjR+","+adjC, curNode);
          }   
        }
      }
      curSec++;
    }
    // console.log("SEC = " + curSec + " MAX = " + maxSec);

    let rivCoords = []; 
    while(curNode!=null){rivCoords.push([curNode[0],curNode[1]]); curNode=curNode[3];}
    // Finally: paint each cell tile in the river to water
    rivCoords.forEach((coord)=>this.map.setValueAt(coord,TileType.WATER));
  } // Ends Function makeRiverViaFlowField




  /*--------------------------------------------------------------------
  |>>> Function makeSimpleShore
  +---------------------------------------------------------------------
  | Overview: Creates shorelines via setting all non [WATER] tile cells 
  |           encompassing the permimeter of any/all such cells to type
  |           [SAND]. That is, for each map cell, if it is not a [WATER]
  |           tile, but at at least one of its Moore Neighbors happens
  |           to be such a tile: then set it to a [SAND] tile.     
  +-------------------------------------------------------------------*/
  makeSimpleShore(){
    for(let r=0; r<this.map.cellsTall; r++){
      for(let c=0; c<this.map.cellsWide; c++){
        if(this.map.getValueAt(r,c) != TileType.WATER){
          for(let adjR=r-1; adjR<=r+1; adjR++){
            for(let adjC=c-1; adjC<=c+1; adjC++){
              if((r!=adjR || c!=adjC) && this.map.cellInBounds(adjR,adjC) && this.map.getValueAt(adjR,adjC)==TileType.WATER){
                this.map.setValueAt(r,c,TileType.SAND); 
              }
            }
          }
        }        
      }
    }      
  } // Ends Function makeSimpleShore


  /*--------------------------------------------------------------------
  |>>> Function makeSimpleSandDuneGrass
  +---------------------------------------------------------------------
  | Overview: Originally the 2nd Phase of 'makeSimpleShore', sets any
  |           [DIRT] tile with 4 or more Moore Neighbors of type [SAND]
  |           to type [GRASS]; thus (kinda?) simulating the grassy areas
  |           adjacent to coast lines (as seen on Long Island and most
  |           archetypal tropical [island] coastlines). 
  +-------------------------------------------------------------------*/
  makeSimpleSandDuneGrass(adjMin=4){
    for(let r=0; r<this.map.cellsTall; r++){
      for(let c=0; c<this.map.cellsWide; c++){ 
        if(this.map.getValueAt(r,c)==TileType.DIRT && this.getAdjTotal(r,c,TileType.SAND)>adjMin){
          this.map.setValueAt(r,c,TileType.GRASS);
        }
      }
    } 
  } // Ends Function makeSimpleSandDuneGrass


  /*--------------------------------------------------------------------
  |>>> Function makePondsAndLakes
  +---------------------------------------------------------------------
  | Overview: TODO
  +---------------------------------------------------------------------
  |> Implementation Notes:
  |  > [Old] Note: Difference between this one and grass generation- no
  |                random chance, spread via seeds only!
  |  > [New] Note: Perhaps implement another version utilizing Lague's
  |                'Cave-Gen-With-CAs' algorithm and/or Perlin Noise?
  |  > NAT:        As with CA's - Versus setting tile values directly,
  |                first create a list of cells to set, then set them.
  +-------------------------------------------------------------------*/
  makePondsAndLakes(pctWater=25){
    let totalCells  = this.map.cellsWide*this.map.cellsTall;   
    let curWatTiles = 0; 
    let numWatTiles = (totalCells*pctWater)/100;
    let curFails    = 0; 
    let maxFails    = totalCells*10;
    let numAdded    = 0; 
    let numDeleted  = 0;

    let sample = []; 
    // Phase 1 Water Tile Generation: Set water tiles from dirt via either random chance (via pctDoTile) else adjacent [neighboring] water tiles
    // ^ Note: Check if latter (i.e. adjacency-based) method is consistent/correct WRT when I install Moore Neighborhood support
    while(curFails<maxFails && curWatTiles<numWatTiles){   
      sample = this.getRandomCoord();
      if(this.map.getValueAt(sample)==TileType.DIRT && (int(random(100))<MapEditor.tileSeedPct || this.getAdjTotal(sample[0],sample[1],TileType.WATER)>1)){
        this.map.setValueAt(sample,TileType.WATER); curWatTiles++;
      }
      else{curFails++;}
    }
    if(this.debugPrint){console.log("makePondsAndLakes: water cell placement [curFails/maxFails] = ["+curFails+"/"+maxFails+"]");}

    if(this.debugPrint){console.log("makePondsAndLakes: [curWaterTiles/numWaterTiles] = ["+curWatTiles+"/"+numWatTiles+"] i.e. "+nf((curWatTiles/numWatTiles)*100,2,2)+"%");}
    
    // Phase 2 Water Tile Generation: Set all independent water tiles to dirt, then add as many back via resampling random cells with adjaceny rule increased
    for(let r=0; r<this.map.cellsTall; r++){
      for(let c=0; c<this.map.cellsWide; c++){ 
        if(this.map.getValueAt(r,c)==TileType.WATER && this.getAdjTotal(r,c,TileType.WATER)<3){
          this.map.setValueAt(r,c,TileType.DIRT);
          numDeleted++;
        }
      }
    }

    curFails = 0; // needed to reset from existing value
    while(curFails<maxFails && numAdded<numDeleted){   
      sample = this.getRandomCoord();   
      if(this.map.getValueAt(sample)==TileType.DIRT && this.getAdjTotal(sample[0],sample[1],TileType.WATER)>=4){
        this.map.setValueAt(sample,TileType.WATER); numAdded++; curWatTiles++;
      }
      else{curFails++;}
    }
    if(this.debugPrint){console.log("makePondsAndLakes: [numDeleted/numAdded] = ["+numDeleted+"/"+numAdded+"]");}
    
    // One last mode of generation: dirt tiles with 6+ water neighbors become water
    for(let r=0; r<this.map.cellsTall; r++){
      for(let c=0; c<this.map.cellsWide; c++){ 
        if(this.map.getValueAt(r,c)==TileType.DIRT && this.getAdjTotal(r,c,TileType.WATER)>=6){
          this.map.setValueAt(r,c,TileType.WATER);
          curWatTiles++;
        }
      }
    }
    if(this.debugPrint){console.log("makePondsAndLakes: [curWaterTiles/numWaterTiles] = ["+curWatTiles+"/"+numWatTiles+"] i.e. "+nf((curWatTiles/numWatTiles)*100,2,2)+"%");}
  } // Ends Function makePondsAndLakes


  /*--------------------------------------------------------------------
  |>>> Function makeGrass
  +---------------------------------------------------------------------
  | Overview: TODO
  +-------------------------------------------------------------------*/
  makeGrass(pctGrass=25){    
    let  totalCells     = this.map.cellsWide*this.map.cellsTall;   
    let  numGrassTiles  = (totalCells*pctGrass)/100;
    let  curGrassTiles  = 0;  
    let  sample         = []; 
    let  curFails       = 0; 
    let  maxFails       = totalCells*10;

    while(curFails<maxFails && curGrassTiles<numGrassTiles){   
      sample = this.getRandomCoord();  
      if(this.map.getValueAt(sample)==TileType.DIRT && (int(random(100))<MapEditor.tileSeedPct || this.getAdjTotal(sample[0],sample[1],TileType.GRASS)>1)){
        this.map.setValueAt(sample,TileType.GRASS); curGrassTiles++;
      }
      else{curFails++;}
    }
    if(this.debugPrint){console.log("makeGrass: grass cell placement [curFails/maxFails] = ["+curFails+"/"+maxFails+"]");}

    //>>> FOLLOWING 2 LOOPS ARE PROTOTYPE OF 'THROW LONE GRASS WITH NEIGHBORS' IDEA

    let numLoneGrassRemoved = 0;
    for(let r=0;r<this.map.cellsTall;r++){
      for(let c=0;c<this.map.cellsWide;c++){ 
        if(this.map.getValueAt(r,c)==TileType.GRASS && this.getAdjTotal(r,c,TileType.GRASS)==0){
          this.map.setValueAt(r,c,TileType.DIRT);
          numLoneGrassRemoved++;
        }
      }
    }

    for(let r=0;r<this.map.cellsTall;r++){
      for(let c=0;c<this.map.cellsWide;c++){ 
        if(numLoneGrassRemoved>0 && this.map.getValueAt(r,c)==TileType.DIRT && this.getAdjTotal(r,c,TileType.GRASS)>=6){
          this.map.setValueAt(r,c,TileType.GRASS);
          numLoneGrassRemoved--;
        }
      }
    }
    if(this.debugPrint){console.log("makeGrass: lone grass cell replacement: [numLoneGrassRemoved] = ["+numLoneGrassRemoved+"]");}

    /*
    for(let r=0;r<this.map.cellsTall;r++){
      for(let c=0;c<this.map.cellsWide;c++){ 
        if(this.map.getValueAt(r,c)==TileType.DIRT && this.getAdjTotal(r,c,TileType.GRASS)>4){this.map.setValueAt(r,c,TileType.GRASS);}
      }
    } 
    */
  } // Ends Function makeGrass


/*
  void makeBlockWithSurroundingRoads(){
    
    int failures = 0;
    int maxFails = 20;
    boolean validSite = false;
    int blocksMade = 0;

    int[] sample;
    int[] extent = new int[]{-1,-1};

    int tempVal; // Used for comparison with tile types    
    while(failures<maxFails && blocksMade<numBlocks){
      sample = getRandCoord();

      extent[0] = sample[0]+int(random(2,5))+2;
      extent[1] = sample[1]+int(random(2,5))+2;
            
      validSite=true;
      
      // Check #1 - are extents in bounds?
      if( !map.checkInBounds(sample) || !map.checkInBounds(extent)){validSite=false;}

      // Check #2 - are all prospective points sitting on either dirt, grass, or sand (i.e. NOT water or other blocks/roads!)
      else{
        for(int r=sample[0]; r<extent[0]; r++){
          for(int c=sample[1]; c<extent[1]; c++){
            tempVal = map.getValueAt(r,c);
            if(tempVal==TileType.WATER || tempVal==TileType.ROAD || tempVal==TileType.PAVE || tempVal==TileType.SAND){validSite=false;}
          }
        }
      }
      
      // Either out of bounds or overlaps on top of invalid tile type: report fail, reiterate
      if(validSite==false){failures++;}
      
      // Valid site to draw tiles on: assign the road and pavement tiles
      else{   
        for(int r=sample[0]; r<extent[0]; r++){
          for(int c=sample[1]; c<extent[1]; c++){
            if(r==sample[0] || r==extent[0]-1 || c==sample[1] || c==extent[1]-1){map.setValueAt(r,c,TileType.ROAD);}
            else{map.setValueAt(r,c,TileType.PAVE);}
          }
        }

        blocks.add(new BlockDims(sample, extent, new int[]{int(lerp(sample[0],extent[0],0.5)), int(lerp(sample[1],extent[1],0.5))}));
        blocksMade++;
      } // Ends Condition that the block can be drawn
    } // Ends While Loop
    if(debugPrint){println("makeBlockWithSurroundingRoads: block generation [failures/maxFails] = ["+failures+"/"+maxFails+"]");}
  } // Ends Function makeBlockWithSurroundingRoads
  

  void connectBlocksViaBFS(){
    int nBlocks = blocks.size();
    if(nBlocks<2){return;}  
        
    for(int i=0; i<nBlocks; i++){
      drawRoadAndReportNNViaBFS(blocks.get(i));  
    }
  } // Ends Function connectBlocksViaBFS
  

  void drawRoadAndReportNNViaBFS(BlockDims in){
    Queue<MMSearchNode> openSet = new LinkedList<MMSearchNode>();
    int[][] closedSet = new int[cellsTall][cellsWide];
    
    boolean goalFound=false;
    int cSetSize=0;   
  
    int startRow = int(in.CC[0]);
    int startCol = int(in.CC[1]);
      
    MMSearchNode curCoord = null;

    openSet.add(new MMSearchNode(startRow, startCol, null));
    closedSet[startRow][startCol] = 1;
  
    int sec=0; int maxSec=cellsWide*cellsTall;

    while(!goalFound && sec<maxSec && openSet.size()>0){
      curCoord = openSet.poll();
      
      for(BlockDims b : blocks){if(curCoord.row != startRow && curCoord.col != startCol && curCoord.row == b.CC[0] && curCoord.col == b.CC[1]){goalFound=true; break;}}
      if(goalFound){break;}
    
      for(int adjR = curCoord.row-1; adjR <= curCoord.row+1; adjR++){
        for(int adjC = curCoord.col-1; adjC <= curCoord.col+1; adjC++){
          if( !map.checkInBounds(adjR,adjC) || 
              (adjR==curCoord.row && adjC==curCoord.col)      || (adjR!=curCoord.row && adjC!=curCoord.col)      ||
              (map.getValueAt(adjR,adjC) == TileType.WATER) || (map.getValueAt(adjR,adjC) == TileType.SAND)  ||
              (closedSet[adjR][adjC] != 0) ){
            continue;
          }

          closedSet[adjR][adjC] = 1;
          openSet.add(new MMSearchNode(adjR, adjC, curCoord));
          cSetSize++;
        } // Ends Inner For Loop
      } // Ends Outer For Loop
      sec++;
    } // Ends Frontier Exploration While Loop
  
    int totPathSteps = 0;
    while(curCoord != null){
      totPathSteps++;
      if(map.getValueAt(curCoord.row,curCoord.col)!=TileType.PAVE){map.setValueAt(curCoord.row,curCoord.col,TileType.ROAD);}
      curCoord=curCoord.parent;
    }
   
    if(debugPrint){
      println("BFS Run Completed. Stats:");
      println("Total Map cells     = "+maxSec);
      println("Total In Closed Set = "+cSetSize);
      println("Frontier Loop Iters = "+sec);
      println("Total Path Hops     = "+totPathSteps);
      println("Goal was found      = "+goalFound);
    }
  }
*/





  //####################################################################
  //>>> RENDER FUNCTIONS (MOST SANS renderCursor INTENDED DEBUG-ONLY)
  //####################################################################

  renderCursor(){
    if(!mouseInCanvas()){return;}
    let cSize = this.map.cellSize;
    
    stroke(255,255,0); strokeWeight(4);
    switch(this.paintType){
      case TileType.ROAD  : fill(this.map.fill_terr_ROAD);  break;
      case TileType.PAVE  : fill(this.map.fill_terr_PAVE);  break;
      case TileType.DIRT  : fill(this.map.fill_terr_DIRT);  break;
      case TileType.GRASS : fill(this.map.fill_terr_GRASS); break;
      case TileType.SAND  : fill(this.map.fill_terr_SAND);  break;
      case TileType.WATER : fill(this.map.fill_terr_WATER); break;
      default:              fill(this.map.fill_terr_ERROR); break;
    }

    push(); translate(floor(mouseX/cSize)*cSize,floor(mouseY/cSize)*cSize);
    if(!this.paintFill){rect(0,0,min(this.map.cellsWide-floor(mouseX/cSize), this.paintSize)*cSize,min(this.map.cellsTall-floor(mouseY/cSize), this.paintSize)*cSize);       }
    else{rect(0,0,cSize,cSize);}
    pop();
  } // Ends Function drawMouseCoordCursor

  renderFlowField(){
    noStroke();
    for(let r=0; r<this.map.cellsTall; r++){for(let c=0; c<this.map.cellsWide; c++){
      fill(map(this.flowField[r][c], 0,1, 0,255),255); rect(c*this.map.cellSize,r*this.map.cellSize,this.map.cellSize,this.map.cellSize);
    }}
  } // Ends Function renderFlowField

  renderFlowFieldGlyphs(){
    noStroke(); fill(0); textSize(12); textAlign(CENTER,CENTER); push(); translate(this.map.cellHalf,this.map.cellHalf);
    for(let r=0; r<this.map.cellsTall; r++){for(let c=0; c<this.map.cellsWide; c++){
      text(Direction.glyph[bucket(this.flowField[r][c], 8)],c*this.map.cellSize, r*this.map.cellSize);
    }}
    pop();
  } // Ends Function renderFlowFieldGlyphs

} // Ends Class MapEditor