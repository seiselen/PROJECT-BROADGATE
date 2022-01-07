


function paintTiles(){
  let mouseCoord = myMap.posToCoord(mousePtToVec());

  myMap.setValueAt(mouseCoord,paintType);

}

//>>> Pathfinding Processing Version:
/*
// 'Paints Map Tiles' via reassigning WRT current type and drawCellSize
void MouseDrawController(){
  int dCellX = getMouseCell('x');
  int dCellY = getMouseCell('y');
  
  for(int r=dCellY;r<dCellY+drawCellSize;r++){
    for(int c=dCellX;c<dCellX+drawCellSize;c++){
      if(map.checkInBounds(r, c)){
        map.setAt(r,c,ThingToDraw);
      }    
    }
  }
} // Ends Function MouseDrawController

*/

//>>> Pathfinding (and Lite Map Editor) in P5JS Version: 
/* I want to augment the existing code s.t. if for example (WLOG:
    > map is of dims = [rows:24] X [cols:32] (i.e. indices of [0,...,23] and [0,...31] resp.); and
    > 'drawCellSize' = [3] and
    > mouseCoord     = [31,31] (i.e. [32,32] WRT one-indexing); then

    > draw region will be: { [29,29],[29,30],[29,31], [30,29],[30,30],[30,31], [31,29],[31,30],[31,31]}
    > i.e. will offset 'origin well' s.t. out-of-bounds not only avoided but [r]X[c] will always will as many cells 
*/