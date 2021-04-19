

/*----------------------------------------------------------------------
|>>> Function createDragObject
+-----------------------------------------------------------------------
| Description: (QAD) Instantiates a DragObject and correctly assigns its
|              canvas-space position (i.e. 'pos'), the GridMap that it's
|              contained within, and the [row][col] cell of its Gridmap.
+-----------------------------------------------------------------------
| QAD Implementation Notes:  
|  > Parm 'req' (i.e. 'request') takes two types of input...
|    (1)=> [x,y]   : (x,y) position in canvas pixel space
|    (2)=> [m,r,c] : GridMap and [row][col] sector therein
|  > Parm 'dim' (i.e. 'dimension') is the desired object size (in square
|    cells). We might upgrade this build to support non-squares and even
|    irregular shapes (i.e. Refinery from classic C&C Red Alert), but
|    such will be TBD per K.I.S.S.
|  > Behavior for each type is as follows...
|    (1): If desired position is invalid (i.e. not in bounds of either
|         Gridmap, overlaps 'FILLED' cell[s], etc.); the operation is
|         cancelled and the function terminates. Otherwise: a DragObject
|         will be instantiated, correctly positioned on its Gridmap, and
|         the Gridmap cell[s] encompassing it updated to 'FILLED'.
|    (2): Much more straightforward. If the request is not possible (per
|         same reasons above), the operation is also cancelled; else the
|         same instantiation / DragObject update / Gridmap update steps
|         will occur.
+---------------------------------------------------------------------*/
function createDragObject(map,row,col,dim){

  let obj = null;
  let pos;

  if(dim==1){
    if (!map.isValidVacantCell([row,col])){return null;}
    pos = map.coordToPos(row,col,dim);
    obj = new DragObject(dim,pos,[map,row,col]);
    map.setToFilled([row,col]);
  } // Ends Handling 1x1 cell objects


  if(dim==2){

    // Every cell this object covers must be valid (in-bounds) and 'VACANT'
    for (var r = row; r < row+dim; r++) {
      for (var c = col; c < col+dim; c++) {
        if (!map.isValidVacantCell([r,c])){return null;}
      }
    }

    // get position WRT cell
    pos = map.coordToPos(row,col,dim);

    // Instantiate object
    obj = new DragObject(dim,pos,[map,row,col]);

    // Lastly: mark map cells as 'FILLED'
    for (var r = row; r < row+dim; r++) {
      for (var c = col; c < col+dim; c++) {
        map.setToFilled([r,c]);
      }
    }

  } // Ends Handling 2x2 cell objects


  return obj;
}



/*----------------------------------------------------------------------
|>>> Function getMRC
+-----------------------------------------------------------------------
| Description: (QAD) Extracted from DragObject.onMouseReleased(), this
|              function determines which [if any] map covers the input
|              position, then returns [map,row,col] thereto. Does NOT
|              handle invalid [row][col] coords!
+---------------------------------------------------------------------*/
function getMRC(pos,dim){
  let objCoord = mapB.posToCoord(pos,dim);
  if(mapB.isValidCell(objCoord)){return [mapB,objCoord[0],objCoord[1]];}

  objCoord = mapO.posToCoord(pos,dim);
  if(mapO.isValidCell(objCoord)){return [mapO,objCoord[0],objCoord[1]];}

  return null;
}