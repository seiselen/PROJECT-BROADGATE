/*----------------------------------------------------------------------
|>>> Class SPManager
+-----------------------------------------------------------------------
| Author:  Steven Eiselen, University of Arizona Computer Science
| Project: StAgE: *St*eering *Ag*ent *E*ntities 
| Purpose: Purpose of the Class
+-----------------------------------------------------------------------
| Implementation Notes:
|  > Should be turned into a Singleton within Unity
|  > Assumes its origin as the world origin. Will need to refactor for
|    otherwise cases!
|  > Assumes wraparound space! Will refactor and/or add a boolean flag
|    within Unity to support wraparound -vs- planar
+-----------------------------------------------------------------------
| Version: > 08/17/19: Revised for prep for Unity porting
+---------------------------------------------------------------------*/

class SPManager{

  SPCell[][] grid;
  int cellsWide;
  int cellsTall;
  float areaWide;
  float areaTall;
  float res;
  
  // used for debug viz in processing, not needed for unity
  ArrayList<SPCell> selectedCell = new ArrayList<SPCell>();
  
  /* Constructor: Should pass in 'clean' vals for areaWide/areaTall, as 
     cellsWide/cellsTall assigned from each as divided by cell dimension 
     respectively, and must be ints. Floor taken for each division op as
     to ensure int assignment to cellsWide/cellsTall in any event. */
  public SPManager(float aWide, float aTall, int cellRes){
    areaWide = aWide;
    areaTall = aTall;
    cellsWide = floor(areaWide/cellRes);
    cellsTall = floor(areaTall/cellRes);
    
    /* Cannot express negative positions in world space as negative cells
       in grid, so offset calculations needed to map negative positions to
       positive grid such that {-areaWide,-areaTall}->{grid[0][0]} */
    int rowOff; int colOff;
    res = cellRes;
    grid = new SPCell[cellsTall][cellsWide];
    for(int r=0; r<cellsTall; r++){
      rowOff = r - (cellsTall/2);
      for(int c=0; c<cellsWide; c++){
        colOff = c -(cellsWide/2);
        grid[r][c] = new SPCell(new PVector(colOff*res,rowOff*res),res,new Coord(r,c));
      }
    }
  }
  
  // Converts world origin point to grid coordinate iff world origin is (0,0) 
  public Coord mapWorldPosToGridCell(PVector pt){
    float tPosX = pt.x + (width/2);
    float tPosY = pt.y + (height/2);
    int row = int(tPosY/res);
    int col = int(tPosX/res);    
    return new Coord(row,col);  
  }
  
  // Called by all agents to update spatial partitioning w.r.t. themselves
  public Coord UpdateAgentPos(AgentRep agent){
    
    // Get grid coord corresponding to agent's current position
    Coord newCoord = mapWorldPosToGridCell(agent.position);   

    // Get grid cell corresponding to agent's current position
    SPCell newCell = grid[newCoord.row][newCoord.col];
    int newIndex = newCell.agents.indexOf(agent);   
    
    // if agent has not changed cells...
    if(newCoord.Equals(agent.curCoord)){
      // but not currently registered therein - add it in.
      if(newIndex == -1){newCell.agents.add(agent);}
      // otherwise, do nothing. 
    }
    
    // if agent has changed cells...
    else{  
      SPCell oldCell = grid[agent.curCoord.row][agent.curCoord.col];
      int oldIndex = oldCell.agents.indexOf(agent);   
      // and was registered at old cell - remove it.
      if(oldIndex != -1){oldCell.agents.remove(oldIndex);}
      // inform the cell it's now within
      newCell.agents.add(agent);  
    }

    // give agent its current grid coord for whatever purpose
    return newCoord;
  }
  
  // used for debug viz in processing, can remove for Unity
  public void highlightBinsInRange(PVector loc,float range){
    
    // Convert coords into 
    Coord gridCoords = mapWorldPosToGridCell(loc);        
    int adj = ceil(range/res)+1;

    if(selectedCell.size()!=0){
      for(SPCell c : selectedCell){
        c.highlight(false);
      }
      selectedCell.clear();
    }
    
    int rAdj,cAdj; // for wraparound (A/A)
    for(int r=gridCoords.row-adj+1; r<gridCoords.row+adj; r++){
      for(int c=gridCoords.col-adj+1; c<gridCoords.col+adj; c++){
        rAdj = (r+cellsTall)%cellsTall;
        cAdj = (c+cellsWide)%cellsWide;
        grid[rAdj][cAdj].highlight(true);
        selectedCell.add(grid[rAdj][cAdj]);
      }      
    }  
  }

  // used for debug viz in processing, can remove for Unity
  public void highlightCellAndMembers(PVector loc){
    
    Coord gridCoords = mapWorldPosToGridCell(loc);        
    if(selectedCell.size()!=0){
      for(SPCell c : selectedCell){c.highlight(false);}
      selectedCell.clear();
    }  
    grid[gridCoords.row][gridCoords.col].highlight(true);
    selectedCell.add(grid[gridCoords.row][gridCoords.col]);    
  }
  
  /* This function retrieves all agents within all adjacent bins w.r.t. range value. 
     NOTE: ASSUMES WRAPAROUND SPACE! Should be easy enough refactor to correct for
     planar space and/or provide boolean flag option to switch between thereof */
  public ArrayList<AgentRep> getNeighborsInBinRange(AgentRep a, float range){
    ArrayList<AgentRep> neighbors = new ArrayList<AgentRep>();
    
    // Convert coords into 
    Coord gridCoords = mapWorldPosToGridCell(a.position);        
    int adj = ceil(range/res)+1;
    
    int rAdj,cAdj; // for wraparound (A/A)
    for(int r=gridCoords.row-adj+1; r<gridCoords.row+adj; r++){
      for(int c=gridCoords.col-adj+1; c<gridCoords.col+adj; c++){
        rAdj = (r+cellsTall)%cellsTall;
        cAdj = (c+cellsWide)%cellsWide;
        neighbors.addAll(grid[rAdj][cAdj].agents);
      }      
    }
    // lastly - remove the agent itself
    neighbors.remove(neighbors.indexOf(a));  
    return neighbors;
  }
  
  /* Calls getNeighborsInBinRange on input, then prunes the 'bin-wise' neighbors
     to those that are actually within 'point-to-point' range of input agent.
     Future note: this is where you could refactor for 'hull-to-hull range of
     input agent, but KISS TBD WLOG */
  public ArrayList<AgentRep> getNeighborsInRange(AgentRep a, float range){   
    ArrayList<AgentRep> neighborsRaw = getNeighborsInBinRange(a,range);
    ArrayList<AgentRep> neighborsRet = new ArrayList<AgentRep>();
    for(AgentRep oth : neighborsRaw){
      if( PVector.sub(oth.position,a.position).magSq() <= (range*range)){
        neighborsRet.add(oth);
      }
    }
    return neighborsRet;  
  }  
  
  // used for debug viz in processing, can remove for Unity
  public void disp(){
    for(int r=0; r<cellsTall; r++){
      for(int c=0; c<cellsWide; c++){
        grid[r][c].disp();
      }
    }  
  }
  
} // Ends Class SPManager
