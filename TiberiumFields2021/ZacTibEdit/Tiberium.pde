// TAB FOR ALL THINGS TIBERIUM, NAMELY THE BLOSSOM AND RULES FOR INDIE TIB PIECE GROWTH



// STUFF THAT NEEDS TO BE PART OF + FULLY CONTAINED IN AN OBJECT CLASS CALLED TiberiumBlossom

/* Function growTiberium

 > Sick - Very good results on radially drawing tiberium
 > rad in this case deals with the tiberium seed point for
   just one vine, so will need to assign each vine their own
   rad variable in the future.
 > There's still got to be a more organic way of doing this,
   but I like this effect/behavior more than previous attempts

*/
class TiberiumBlossom{
  int rad = 0;     // This tree's current Tiberium Radius
  int maxRad = 50; // Maximum Radius to spread Tiberium
  int treeCellX;   // Tree cell position x
  int treeCellY;   // Tree cell position y
  int treeRealX;   // Tree real position x
  int treeRealY;   // Tree real position y

  public TiberiumBlossom(int cX, int cY){
    treeCellX = cX;
    treeCellY = cY;
    treeRealX = cX*cellSize;
    treeRealY = cY*cellSize;
    map[treeCellX][treeCellY]=2;
  }// Ends Constructor


  void growTiberium(){
    int cX,cY;
    for(int i=0;i<numCells;i++){
      for(int j=0;j<numCells;j++){
        cX=j*cellSize;
        cY=i*cellSize;
      
        if(map[i][j]==0 && dist(cX,cY,treeRealX,treeRealY)<=rad){
          if(canGrowViaAdjacency(i,j)){updateTibMap[i][j]=1;}
        }
        // Might comment out - this code will cover rest of the field
        // Could include a <= rad check and fix rad at the maxRad value in the future...
        else if(map[i][j]>1 && map[i][j]<100){
          if(canGrowViaAdjacency(i,j)){updateTibMap[i][j]=1;}
        }
      }  
    }
  
    // Update Field from the update map
    for(int i=0;i<numCells;i++){
      for(int j=0;j<numCells;j++){
        if (updateTibMap[i][j]==1){
          updateTibMap[i][j]=0;
          if(map[i][j] == 0){map[i][j]=2;}
          else{map[i][j]++;}
        }
      }
    }
    rad++;
  }// Ends Function growTiberium

void drawTree(){
  image(tibTree, (treeRealX)-30, (treeRealY)-50);
}

}

/* Function canGrowViaAdjacency
 > This function basically asks its immediate adjacencies if they are tiberium.
 > If one adjacency is tiberium - this piece will also grow
 > NOTE - I WONDER WHAT WOULD HAPPEN IF I NEEDED 2 ADJ'S? 3 ADJ'S? better simulation?
*/
// GLOBALS FOR THIS FUNCTION
boolean includeCornerAdjs = false; // Include corner pieces e.g. 'Bottom Left' in the calculation?
int     numAdjsNeeded     = 1;     // How many adjacencies needed? 

boolean canGrowViaAdjacency(int xC, int yC){
  
  int tibAdjs = 0;
  
  // Top/Bottom/Left/Right Adjacencies
  if(checkValidCell(xC-1, yC  ) && map[xC-1][yC]   >1){tibAdjs++;}
  if(checkValidCell(xC  , yC-1) && map[xC][yC-1]   >1){tibAdjs++;}
  if(checkValidCell(xC  , yC+1) && map[xC][yC+1]   >1){tibAdjs++;}
  if(checkValidCell(xC+1, yC  ) && map[xC+1][yC]   >1){tibAdjs++;}
  
  // Corner Adjacencies (Might disable, hence the conditional)
  if(includeCornerAdjs){
    if(checkValidCell(xC-1, yC-1) && map[xC-1][yC-1] >1){tibAdjs++;}
    if(checkValidCell(xC-1, yC+1) && map[xC-1][yC+1] >1){tibAdjs++;}  
    if(checkValidCell(xC+1, yC-1) && map[xC+1][yC-1] >1){tibAdjs++;}
    if(checkValidCell(xC+1, yC+1) && map[xC+1][yC+1] >1){tibAdjs++;}
  }

  // Logical return - if there's enough adjacencies with tiberium - grow
  return (tibAdjs>=numAdjsNeeded);
} // Ends Function canGrowViaAdjacency