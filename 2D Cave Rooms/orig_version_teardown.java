class CACavesRegions{
  // FLOOD TYPE OPTION/MODE
  int floodWall   = 0;
  int floodSector = 1;
  int floodMode = floodWall;

  // SECTOR SETTINGS
  int curSectors = 0;
  int maxSectors = 12; // hardcoded for now
  
  /*----------------------------------------------------------------------
  |>>> Function changeFloodMode 
  ----------------------------------------------------------------------*/    
  void changeFloodMode(){
    if(floodMode==floodWall){floodMode=floodSector;}
    else{floodMode=floodWall;}
  } // Ends Function changeFloodMode  
  
  /*----------------------------------------------------------------------
  |>>> Function doFlood 
  ----------------------------------------------------------------------*/    
  void doFlood(int mR, int mC){
    if(floodMode==floodWall){caOps.floodFill(tileMap, mR, mC, drawOption);}
    else{markCellRegion(boundTileMap, boundSectorMap, mR, mC);}
  } // Ends Function doFlood
  

  /*----------------------------------------------------------------------
  |>>> Function clearMaps 
  ----------------------------------------------------------------------*/     
  void clearMaps(){
    for(int r=0;r<cellsTall;r++){
      for(int c=0;c<cellsWide;c++){
        boundTileMap[r][c]=FLOOR;
        boundSectorMap[r][c]=FLOOR;
      }
    }
  }


  /*----------------------------------------------------------------------
  |>>> Function markCellRegion 
  ----------------------------------------------------------------------*/  
  void markCellRegion(int[][] refMap, int[][] secMap, int seedRow, int seedCol){
    if(refMap[seedRow][seedCol] == FLOOR){
      curSectors++;
      ArrayList<Point> cells = getRegionTiles(refMap, seedRow,seedCol);
      for(Point p : cells){secMap[p.r][p.c] = curSectors;}
    }
  } // Ends Function markCellRegion
  

  /*----------------------------------------------------------------------
  |>>> Function filterMapByRegionSize 
  ----------------------------------------------------------------------*/
  void filterMapByRegionSize(int[][] map){
    ArrayList<ArrayList<Point>> wallRegions = getAllRegionsOfType(map, WALL);
  
    for(ArrayList<Point> region : wallRegions){
      if(region.size() <= 12){
        for(Point p : region){map[p.r][p.c] = 0;}
      }
    }  
    ArrayList<ArrayList<Point>> floorRegions = getAllRegionsOfType(map, FLOOR);
  
    for(ArrayList<Point> region : floorRegions){
      if(region.size() <= 12){
        for(Point p : region){
          map[p.r][p.c] = 1;
        }
      }
    }  
  } // Ends Function filterMapByRegionSize

  /*----------------------------------------------------------------------
  |>>> Function getAllRegionsOfType 
  ----------------------------------------------------------------------*/
  ArrayList<ArrayList<Point>> getAllRegionsOfType(int[][] map, int tileType){
    ArrayList<ArrayList<Point>> regions = new   ArrayList<ArrayList<Point>>();
    int[][] closedSet = new int[cellsTall][cellsWide];
  
    for(int r = 0; r < cellsTall; r++){
      for(int c = 0; c < cellsWide; c++){
        if(closedSet[r][c] == 0 && map[r][c] == tileType){
          ArrayList<Point> newRegion = getRegionTiles(map,r,c);
          regions.add(newRegion);
          for(Point p : newRegion){
            closedSet[p.r][p.c] = 1;
          }
        }
      }
    }
    return regions;
  } // Ends Function getAllRegionsOfType

  /*----------------------------------------------------------------------
  |>>> Function getRegionTiles 
  +-----------------------------------------------------------------------
  | Author:  Steven Eiselen, University of Arizona Computer Science
  | Source:  Sebastian Lague Tutorials: www.youtube.com/user/Cercopithecan
  | Project: PRIZE - Processing Rendered Implementation of the ZAC Engine
  +-----------------------------------------------------------------------
  | Purpose: Given a cell coordinate acting as the 'seed' point (typically
  |          mouseX, mouseY) and a int value to fill with - this function
  |          will return a set of Point objects that contains every cell 
  |          within the same map tile type region as the seed cell.
  | Inputs:  > int seedRow, seedCol - Cell coordinates of the seed
  |          > int map[][] - a map
  | Outputs: > A set of Point objects that contains every cell within the
  |            same map tile type region as the seed cell.
  +-----------------------------------------------------------------------
  | Implementation Notes:
  | > Has 'cousin' function called 'floodFill' which will directly modify
  |   the seed's region members with an input value; whereas this function
  |   instead returns the members of the same region as the seed cell.
  +---------------------------------------------------------------------*/
  ArrayList<Point> getRegionTiles(int[][] map, int seedRow, int seedCol){
    int seedTile = map[seedRow][seedCol];
    Point temp;
    Queue<Point> q = new LinkedList<Point>();
    ArrayList<Point> region = new ArrayList<Point>();
    int[][] closedSet = new int[cellsTall][cellsWide];
    q.add(new Point(seedRow,seedCol));
    closedSet[seedRow][seedCol] = 1;
  
    int sec=0;
    int maxSec = cellsWide*cellsTall;
    while(sec<maxSec && q.size() > 0){
      temp = q.poll();
    
      region.add(temp);
    
      for(int adjR = temp.r-1; adjR <= temp.r+1; adjR++){
        for(int adjC = temp.c-1; adjC <= temp.c+1; adjC++){
          if(checkInBounds(adjR,adjC) && (adjR==temp.r || adjC==temp.c)){
            // Final conditional makes sure all prospective filled tiles need to match original seed tile type
            if(closedSet[adjR][adjC] == 0 && map[adjR][adjC] == seedTile){
              closedSet[adjR][adjC] = 1;
              q.add(new Point(adjR,adjC));    
            }          
          }   
        }
      }
      sec++;
    }  
    println("SEC = " + sec + " MAX = " + maxSec);
    return region;
  } // Ends Function getRegionTiles  

} // Ends Class CACavesRegions