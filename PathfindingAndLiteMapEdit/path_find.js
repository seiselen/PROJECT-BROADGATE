//######################################################################
//>>> Global Functions DBA 'Interfaces' for UI/UX WRT Path[Finding]
//######################################################################

/*======================================================================
|>>> Global Functions DBA 'Interfaces' for UI/UX WRT Path[Finding]
+=======================================================================
| Description: An ironic-yet-welcome feature of 'PathfindingProcessing'
|              was the Pathfinder system [class]; as it both returned
|              generated paths (i.e. without saving them locally), and
|              only cached the current closed set until a new path was
|              requested - so Good Job to 'Steve from the past' on that!
|
|              Consequently, I had implemented several global functions
|              to act as interfaces+commands between the UI and pathfind
|              system; and will be retaining their key ideas with these.
+=====================================================================*/

/*
void runPath(){
  if(pathStart==null || pathEnd==null){return;}
  clearPath();
  path = pathFind.getPath( pathStart, pathEnd, searchMode);
  cSet = pathFind.getClosedSet();
  textInfo.get(7).setText("" + pathFind.getPathCost());
  existsPath=true;
}
*/

/*
void clearPath(){
  path = null;
  cSet = null;
  existsPath=false;
  pathID = 0;
}
*/

/*
void renderPath(){
  noStroke();
  int numDrawn = 0;
  int size = path.size()-1;
  int cSize = 5;
  for(Point p : path){  
    if(numDrawn==0)        {fill(0,255,0);  cSize=10;}
    else if(numDrawn==size){fill(0,0,255);  cSize=10;}
    else                   {fill(255,255,0); cSize=5;}
    
    if(numDrawn<=pathID){ellipse((p.col*cellSize)+offset,(p.row*cellSize)+offset,cSize,cSize);}
    numDrawn++;
  }  
} // Ends Function renderPath
*/

/*
void renderClosedSet(){
  noStroke();fill(255,120,0);
  if(cSet !=null){for(Point p : cSet){ellipse((p.col*cellSize)+offset,(p.row*cellSize)+offset,5,5);}}
} // Ends Function renderClosedSet
*/

/*
void renderOpenSet(){
  >>> NOTE: I ACTUALLY IMPLEMENTED THIS WITHIN GRIDWALKER-P5JS, so that code should be mostly copy+paste into here!
}
*/

function compareSearchNodes(a,b){
  return Math.sign((a.cost+a.heur)-(b.cost+b.heur));
}

/*> Backup Comparator Implementation JIC ===>
function compareSearchNodes(a,b){
  let tempATotal = a.cost + a.heur; 
  let tempBTotal = b.cost + b.heur;
  return (tempATotal<tempBTotal) ? -1 : (tempATotal>tempBTotal) ? 1 : 0;
}
*/


class SearchNode{
  constructor(ID,cost){
    this.ID = ID;
    this.cost = cost;
    this.heur = 0;
  }
}



