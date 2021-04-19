

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
function createDragObject(req,dim){

  let obj = null;

  // Request Type -> 2
  if(req.length == 3){

    // 'unpack' request
    let qMap = req[0];
    let qRow = req[1];
    let qCol = req[2];

    // Every cell this object covers must be valid (in-bounds) and 'VACANT'
    for (var r = qRow; r < qRow+dim; r++) {
      for (var c = qCol; c < qCol+dim; c++) {
        if (!qMap.isValidVacantCell([r,c])){return null;}
      }
    }

    // get position WRT cell
    let qPos = qMap.coordToPos(qRow,qCol,dim);

    // Instantiate object
    obj = new DragObject(dim,qPos,[qMap,qRow,qCol]);

    // Lastly: mark map cells as 'FILLED'
    for (var r = qRow; r < qRow+dim; r++) {
      for (var c = qCol; c < qCol+dim; c++) {
        qMap.setToFilled([r,c]);
      }
    }
  } // Ends Handling of 2x2 DragObjects

  return obj;
}


