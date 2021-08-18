/*---------------------------------------------------------------------
|>>> Function - keyPressed
+----------------------------------------------------------------------
| Implementation Note:   
|  > For numeric inputs, I discovered a neat trick based on Processing  
|    returning keys by their ASCII char value (i.e. '1'=49):
|     1) I exploit this in the conditional check by querying if the key 
|        is <='9' and >'0' which via lerping works!!!
|     2) For the corresponding integer representation, I then utilize
|        int(key)-48 which produces the char's numeric form.
*--------------------------------------------------------------------*/
void keyPressed(){
  // Tiberium Growth Switch
  if     (key == 't' && triggerGrowth==false){triggerGrowth=true;}
  else if(key == 't' && triggerGrowth==true){triggerGrowth=false;}
  // Grid Display Switch
  else if(key == 'g' && showGrid == false){showGrid=true;}
  else if(key == 'g' && showGrid == true){showGrid=false;}
  // Square Cell Draw Switch
  else if(key <= '9' && key > '0'){drawCellSize = (int(key)-48);}
  // Stuff To Draw Switch
  else if(key == 'd'){drawWhat = 0;}  
  else if(key == 'w'){drawWhat = 1;}  
} // Ends keyPressed

/*---------------------------------------------------------------------
|>>> Function - mouseDraw
+----------------------------------------------------------------------
| Purpose:  Gets X or Y coordinate of the cell that mouse is on top of
| Parms:    > o = option, either 'x', or 'y'
| Returns:  > the cell ID of the option entered, or
|           > 0 iff invalid option chosen (message will console print)
*--------------------------------------------------------------------*/
int getMouseCell(char o){
  if(o=='x'){return int(mouseX/cellSize);}
  if(o=='y'){return int(mouseY/cellSize);}
  println("getMouseCell Error - invalid option chosen! Returning 0");
  return 0;
} // Ends Function getMouseCell

/*---------------------------------------------------------------------
|>>> Function - drawMouseCursor
+--------------------------------------------------------------------*/
void drawMouseCursor(){
  // Reset VFX settings
  stroke(256,180,0);
  strokeWeight(2);
  noFill();
  // Get Mouse Cell ID
  int hCell = getMouseCell('x');
  int vCell = getMouseCell('y');
  // Draw Rect over mouse Region (TODO: ROOM FOR VISUAL IMPROVEMENT IN CASE OUT OF BOUNDS)
  rect(hCell*cellSize, vCell*cellSize, drawCellSize*cellSize, drawCellSize*cellSize);
} // Ends Function drawMouseCursor

/*---------------------------------------------------------------------
|>>> Function - mouseDraw
+----------------------------------------------------------------------
| Purpose:  Called by event handler associated with mouse clicks, will
|           draw current user selected item on corresponding cell(s)
| Parms:    None
| Returns:  Nothing
*--------------------------------------------------------------------*/
void mouseDraw(){
  int dCellX = getMouseCell('x');
  int dCellY = getMouseCell('y');
  for(int i=dCellX;i<dCellX+drawCellSize;i++){
    for(int j=dCellY;j<dCellY+drawCellSize;j++){
      if(checkValidCell(i, j)){map[i][j] = drawWhat;}
    }
  }
} // Ends Function mouseDraw

/*----------------------------------------------------------------------
|>>> Function clearMap 
+---------------------------------------------------------------------*/
void clearMap(){
  for(int i=0;i<numCells;i++){for(int j=0;j<numCells;j++){map[i][j]=0;}}
} // Ends Function clearMap

/*----------------------------------------------------------------------
|>>> Function checkValidCell 
+---------------------------------------------------------------------*/
boolean checkValidCell(int xC, int yC){
  return (xC>=0 && xC<numCells && yC>=0 && yC<numCells);
} // Ends Function checkValidCell

/*----------------------------------------------------------------------
|>>> Function drawCells 
+---------------------------------------------------------------------*/
void drawCells(){
  if(showGrid){stroke(24);strokeWeight(1);}
  if(!showGrid){noStroke();}
  for(int i=0;i<numCells;i++){
    for(int j=0;j<numCells;j++){
      if     (map[i][j]==0){fill(100,50,0);} // Brown
      else if(map[i][j]==TILE_WATER){fill(0,120,180);}  // Blue
      else if(map[i][j]<20){fill(0,48,0);}   // Green Tib Scale
      else if(map[i][j]<40){fill(0,96,0);}
      else if(map[i][j]<60){fill(0,144,0);}
      else if(map[i][j]<80){fill(0,192,0);}
      else if(map[i][j]<101){fill(0,240,0);}
      rect(i*cellSize,j*cellSize,cellSize,cellSize);
    }
  }
} // Ends Function drawCells