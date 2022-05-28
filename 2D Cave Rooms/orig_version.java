//######################################################################
//>>> TAB: "CellAutoCaveExperiment.pde"
//######################################################################

/*======================================================================
| Project: Cellular Automata for producing Caves / Creating room sectors
| Author:  Steven Eiselen, University of Arizona Computer Science 
| Source:  Sebastian Lague Tutorials: www.youtube.com/user/Cercopithecan
| Assets:  Did you import libraries, copy over code from other projects
+-----------------------------------------------------------------------
| Description: Generates cave rooms, marks rooms into their own sectors,
|              displays rooms in different colors according to sector.
+-----------------------------------------------------------------------
| Implementation Notes:
|  > MAP DISPLAY, A PROMISING PRIZE UPGRADE, IS LOCATED HERE!
|  > This is still an active experiment!
+-----------------------------------------------------------------------
| Version Info:
|  > 04/19/17 - Refactored, cleaned up for CSC 533 Grad Project turnin
*=====================================================================*/

import java.util.*;

//>>> MAP STRUCTS
int[][] tileMap;
int[][] sectors;

//>>> WINDOW SETTINGS
int screenWide = 1200;
int screenTall = 800;
int UIOffsetTall = 150;
int UIOffsetWide = 60;
int cellSize = 20;
int cellSizeHalf = cellSize/2;
int cellsWide  = screenWide/cellSize;
int cellsTall  = screenTall/cellSize;

//>>> UTIL
boolean showGrid = true;
int textSize = 32;

//>>> UI DISPLAY
int lastMillis=0;
int lastFrames = 0;

//>>> STRUCTS
CACavesRegions caOps;
FPSInfoModule fps;
MapDisplay display;

void settings(){
  size(screenWide+UIOffsetWide,screenTall+UIOffsetTall);
} // Ends Function settings

void setup(){
  textSize(textSize);
  fps     = new FPSInfoModule();
  display = new MapDisplay();
  tileMap = new int[cellsTall][cellsWide];
  sectors = new int[cellsTall][cellsWide];
  caOps   = new CACavesRegions(tileMap,sectors);
  
  display.addMode("tiles", caOps.baseScheme, tileMap);
  display.addMode("sectors", caOps.sectorScheme, sectors);
  display.setMode("tiles");
  
  caOps.populateMap();
} // Ends method setup

void draw(){
  
  // UI CALLS
  if(mousePressed && mouseButton==LEFT){mouseDraw();}
  
  // DRAW CALLS
  background(0,60,120);
  display.displayMap();
  
  // LOGO DISPLAY + FPS CALC AND DISPLAY
  textSize(30); fill(255);text("Eiselen Laboratories - Software Engineering Division - Project Genesis / PRIZE", 16,height-textSize);
  fps.calcFPS();text(("Avg FPS = " + fps.getAvgFPS()), 16,height-3*textSize);
  text(("Fill % = " + caOps.fillPct), 240,height-3*textSize);
  text(("Draw Option = " + caOps.drawOptionAsString()), 440,height-3*textSize);
} // Ends Function draw




//######################################################################
//>>> TAB: "IMPLEMENT.pde"
//######################################################################

/*----------------------------------------------------------------------
|>>> Class CACavesRegions
+-----------------------------------------------------------------------
| Author:  Steven Eiselen, University of Arizona Computer Science
| Project: PRIZE - Processing Rendered Implementation of the ZAC Engine
| Purpose: Implements the 'Cave Room' and 'Room Region' algorithms as
|          taught on Sebastian Lague's YouTube series for Procedurally
|          Generated Caves/Rooms in Unity3D. I adapted it to work in the
|          Processing Environment, for 2D maps, and added more of my own
|          additional features as well. 
| Source:  www.youtube.com/user/Cercopithecan
+-----------------------------------------------------------------------
| State Variables and Structs:
|  > See code for appropriate comments
+-----------------------------------------------------------------------
| Implementation Notes:
| > Notes go here...
+-----------------------------------------------------------------------
| Improvement Ideas / TTD:
| > As Applicable...
+-----------------------------------------------------------------------
| Version: > 4/17/17 - Refactored into 1 class, made to be more modular
+---------------------------------------------------------------------*/
class CACavesRegions{
  // DRAW TYPE OPTION/MODE
  int FLOOR = 0;
  int WALL  = 1;
  int drawOption = FLOOR;
  
  // FLOOD TYPE OPTION/MODE
  int floodWall   = 0;
  int floodSector = 1;
  int floodMode = floodWall;
  
  // FILL PERCENT OPTION/SETTING
  int minPct  = 25;
  int maxPct  = 55;
  int fillPct = 50;
  
  // CELLULAR AUTOMATA SMOOTHING ROUNDS
  int numRoundsCA = 5;
  
  // COLOR SCHEMES FOR THIS MODULE
  color[] baseScheme = new color[] {(#B4B4B4),(#3C3C3C)};
  color[] sectorScheme = new color[] { (#3C3C3C),(#a6cee3),(#1f78b4),(#b2df8a),(#33a02c),
  (#fb9a99),(#e31a1c),(#fdbf6f),(#ff7f00),(#cab2d6),(#6a3d9a),(#ffff99),(#b15928)};
  
  // SECTOR SETTINGS
  int curSectors = 0;
  int maxSectors = 12; // hardcoded for now
  
  int boundTileMap[][];
  int boundSectorMap[][];
  
  public CACavesRegions(int[][]tile, int[][]sector){
    this.boundTileMap   = tile;
    this.boundSectorMap = sector;
  } // Ends Constructor
  
  /*----------------------------------------------------------------------
  |>>> Function markCellRegion 
  ----------------------------------------------------------------------*/    
  void changeFillPercent(char o){
    if( o == '+' && fillPct<maxPct){fillPct++;}
    if( o == '-' && fillPct>minPct){fillPct--;}
  } // Ends Function swapDrawOption
  
  /*----------------------------------------------------------------------
  |>>> Function changeFloodMode 
  ----------------------------------------------------------------------*/    
  void changeFloodMode(){
    if(floodMode==floodWall){floodMode=floodSector;}
    else{floodMode=floodWall;}
  } // Ends Function changeFloodMode  
  
  /*----------------------------------------------------------------------
  |>>> Function swapDrawOption 
  ----------------------------------------------------------------------*/    
  void swapDrawOption(){
    if(drawOption==FLOOR){drawOption=WALL;}else{drawOption=FLOOR;}
  } // Ends Function swapDrawOption
  
  /*----------------------------------------------------------------------
  |>>> Function drawOptionAsString 
  ----------------------------------------------------------------------*/    
  String drawOptionAsString(){
    if(drawOption==FLOOR){return "FLOOR";}else{return "WALL";}
  } // Ends Function drawOptionAsString  
  
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
  |>>> Function populateMap 
  ----------------------------------------------------------------------*/ 
  
  /*----------------------------------------------------------------------
  |>>> Function populateBaseMapLayer 
  +-----------------------------------------------------------------------
  | Author:  Steven Eiselen, University of Arizona Computer Science
  | Source:  Sebastian Lague Tutorials: www.youtube.com/user/Cercopithecan
  | Project: PRIZE - Processing Rendered Implementation of the ZAC Engine
  +-----------------------------------------------------------------------
  | Purpose: Randomly populates the bound tile map with 'WALL' and 'FLOOR'
  |          values. The balance i.e. proportion of one value versus the
  |          other is based on the global setting randomFillPct.
  | Inputs:  > None
  | Outputs: > boundTileMap values reassigned via the aforementioned
  +-----------------------------------------------------------------------
  | Version: > 4/03/17 - Original made in 3/??/17, this adds comment block
  |          > 4/04/17 - map now grabs myMap baseType layer
  |          > 4/17/17 - Now a util that works with bound array.
  +---------------------------------------------------------------------*/
  void populateMap(){
    for(int r=0;r<cellsTall;r++){
      for(int c=0;c<cellsWide;c++){
        if(c==0 || c==cellsWide-1 || r==0 || r==cellsTall-1){boundTileMap[r][c]=WALL;}
        else if(int(random(100)) < fillPct){boundTileMap[r][c]=WALL;}
        else{boundTileMap[r][c]=FLOOR;}
      }
    }
  } // Ends Function populateMap

  /*----------------------------------------------------------------------
  |>>> Function caRound 
  ----------------------------------------------------------------------*/
  void caRound(int[][] map){
    int temp;
    for(int r=0;r<cellsTall;r++){
      for(int c=0;c<cellsWide;c++){
        temp = getAdjTotal(map, r,c);
        if(temp > 4){map[r][c]=WALL;}
        else if(temp<4){map[r][c]=FLOOR;}
      }
    }
  } // Ends Function caRound
  
  /*----------------------------------------------------------------------
  |>>> Function iterativeSmoothing 
  ----------------------------------------------------------------------*/  
  void iterativeSmoothing(int[][] map){
    for(int i=0; i<numRoundsCA; i++){caRound(map);}
  } // Ends Function iterativeSmoothing

  /*----------------------------------------------------------------------
  |>>> Function getAdjTotal 
  ----------------------------------------------------------------------*/
  // Wow this is a cool function!
  int getAdjTotal(int[][] map, int cRow, int cCol){
    int tot = 0;
    for(int adjR = cRow-1; adjR <= cRow+1; adjR++){
      for(int adjC = cCol-1; adjC <= cCol+1; adjC++){
        if(checkInBounds(adjR,adjC)){
          if(!(adjC==cCol && adjR==cRow)){
            tot += map[adjR][adjC];
          }
        }
        else{
         tot++;
        }
      }
    }
    return tot;
  } // Ends Function getAdjTotal
  
  
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
  |
  | Inputs:  > int seedRow, seedCol - Cell coordinates of the seed
  |          > int map[][] - a map
  |
  | Outputs: > A set of Point objects that contains every cell within the
  |            same map tile type region as the seed cell.
  +-----------------------------------------------------------------------
  | Implementation Notes:
  | > Has 'cousin' function called 'floodFill' which will directly modify
  |   the seed's region members with an input value; whereas this function
  |   instead returns the members of the same region as the seed cell.
  +-----------------------------------------------------------------------
  | Improvement Ideas / TTD:
  | > Generalize the GameMap Infrastructure
  +-----------------------------------------------------------------------
  | Version: > 4/03/17 - Original made in 3/??/17, this adds comment block
  |          > 4/04/17 - map now grabs myMap baseType layer
  |          > 4/17/17 - Now a util that works with bound array.
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

  /*----------------------------------------------------------------------
  |>>> Function floodFill 
  +-----------------------------------------------------------------------
  | Author:  Steven Eiselen, University of Arizona Computer Science
  | Source:  Sebastian Lague Tutorials: www.youtube.com/user/Cercopithecan
  | Project: PRIZE - Processing Rendered Implementation of the ZAC Engine
  +-----------------------------------------------------------------------
  | Purpose: Given a cell coordinate acting as the 'seed' (typically via
  |          'mouse-space' cell representation) and a int value to fill 
  |          with - this function will fill every cell within the same map
  |          tile type region as the seed cell.
  |
  | Inputs:  > int seedRow, seedCol - Cell coordinates of the seed
  |          > int withWhat         - Value to replace region with
  |          > int map[][]          - a map
  |
  | Outputs: > Will fill the contiguous region of all cells with the same
  |            map tile value as the seed contained within its region with
  |            the specified value.
  +-----------------------------------------------------------------------
  | Implementation Notes:
  | > Has 'cousin' function called 'getRegionTiles' which only returns the
  |   members of the same region as the seed cell; whereas this function
  |   will directly modify the region with a value.
  +-----------------------------------------------------------------------
  | Improvement Ideas / TTD:
  | > Maybe Globalize the Queue and Closed Set
  | > Generalize the GameMap Infrastructure
  +-----------------------------------------------------------------------
  | Version: > 4/03/17 - Original made in 3/??/17, this adds comment block
  |          > 4/04/17 - map now grabs myMap baseType layer
  |          > 4/17/17 - Now a util that works with bound array.
  +---------------------------------------------------------------------*/
  void floodFill(int[][] map, int seedRow, int seedCol, int withWhat){
    int seedTile = map[seedRow][seedCol];
    Point temp;
    Queue<Point> q = new LinkedList<Point>();
    int[][] closedSet = new int[cellsTall][cellsWide];
    q.add(new Point(seedRow,seedCol));
    closedSet[seedRow][seedCol] = 1;
  
    int sec=0;
    int maxSec = cellsWide*cellsTall;
    while(sec<maxSec && q.size() > 0){
      temp = q.poll();
    
      map[temp.r][temp.c]=withWhat;
    
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
    q.clear(); 
    //return r;
  } // Ends Function floodFill

} // Ends Class CACavesRegions




//######################################################################
//>>> TAB: "UTIL.pde"
//######################################################################

// Simple Point Definition - Used with Flood Fill
class Point{int r;int c;public Point(int rP, int cP){this.r=rP;this.c=cP;}}

boolean checkInBounds(int r, int c){return (r>=0 && r<cellsTall && c>=0 && c<cellsWide);} // Ends Function checkInBounds

// Can Put this in module to support per-mode keystrokes!
void keyPressed(){
  if(key     == 'q') {exit();}
  if(key     == 'g') {display.showGrid();}
  if(key     == 'v') {if(display.currentMode.name.equals("tiles")){display.setMode("sectors");}else{display.setMode("tiles");}}  
  if(key     == ' ') {caOps.caRound(tileMap);}
  if(key     == 'r') {caOps.populateMap(); caOps.iterativeSmoothing(tileMap);}
  if(key     == 't') {caOps.swapDrawOption();}
  if(key     == 'm') {caOps.changeFloodMode();}
  if(key     == 'p') {caOps.filterMapByRegionSize(tileMap);}
  if(keyCode == UP)  {caOps.changeFillPercent('+');}
  if(keyCode == DOWN){caOps.changeFillPercent('-');}
}

void mouseDraw(){
  int mRow = int(mouseY/cellSize);
  int mCol = int(mouseX/cellSize);
  if(checkInBounds(mRow,mCol)){tileMap[mRow][mCol] = caOps.drawOption;}
} // Ends Function mouseDraw

void mousePressed(){
  if(mouseButton == RIGHT){caOps.doFlood(mouseY/cellSize, mouseX/cellSize);}
} // Ends Function mousePressed

// NEW AND PROMISING IDEA, TOO LATE TO ADVANCE THOUGH...
class MapDisplay{
  
  class DisplayMode{
    String name; color[] scheme; int[][] map;
    public DisplayMode(String n, color[] s, int[][]m){
      this.name=n;
      this.scheme=s;
      this.map=m;
    }
  }// Ends Class DisplayMode
  
  HashMap<String,DisplayMode> displayModes = new HashMap<String,DisplayMode>();
  
  DisplayMode currentMode;
  
  boolean showGrid = true;
  
  void showGrid(){showGrid=!showGrid;}
  
  void addMode(String name, color[] scheme, int[][] map){
    displayModes.put(name, new DisplayMode(name,scheme,map));
  }
  
  void setMode(String mode){
    try{currentMode = displayModes.get(mode);}
    catch(Exception e){println("MapDisplay/setMode >>> Error! Mode \""+mode+"\" not found!");}
  } // Ends Function setMode  
  
  void displayMap(){
    
    if(currentMode==null){println("MapDisplay/displayMap >>> Error! Current mode is null!");return;}
    
    int[][] m = currentMode.map;
    color[] s = currentMode.scheme;
    
    if(showGrid){stroke(24);strokeWeight(1);}
    if(!showGrid){noStroke();}
    for(int r=0;r<cellsTall;r++){
      for(int c=0;c<cellsWide;c++){
        fill(s[m[r][c]]);
        rect(c*cellSize,r*cellSize,cellSize,cellSize);
      }
    }  
  } // Ends Function displayMap
} // Ends Clas MapDisplay

/*----------------------------------------------------------------------
|>>> Class FPSInfoModule
+---------------------------------------------------------------------*/
class FPSInfoModule{
  int lastMillis = 0; int lastFrames = 0; int currentFPS = 0; int averageFPS = 0;
  int getAvgFPS(){return averageFPS;}
  void calcFPS(){
    if(lastMillis+1000<millis()){
      currentFPS = frameCount-lastFrames;
      averageFPS = (averageFPS+currentFPS)/2;
      lastFrames = frameCount;
      lastMillis=millis();
    }  
  } // Ends Function calcFPS
} // Ends Class FPSInfoModule