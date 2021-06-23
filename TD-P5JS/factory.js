/*======================================================================
|>>> FACTORY
+=======================================================================
| Description: Contains code used to create everything from towers to
|              enemy units to UI objects, etc. (at least until/unless)
|              they have their own systems and/or source files/code.
|              So not exactly the similarly named OOP design pattern...
|              but a factory that produces objects nonetheleess. As with
|              UTILS: contents are ordered/grouped as best as possible.
*=====================================================================*/


/*----------------------------------------------------------------------
|>>> Agent and Tower Creation (Q.A.D. PENDING FACTORY OBJ)
+---------------------------------------------------------------------*/


function createUnit(randomLen = false){
  let u = new Unit(map.entCoord[0], map.entCoord[1], units.length, map);
  if(randomLen){u.setBodyLenRand(16,32);}
  u.givePath(map.walkPath);
  units.push(u);
} // Ends Function createUnit


function createTowerFirstEmptyCell(){
  let cell = map.findVacantCell();
  console.log(cell);
  if(cell==null){console.log("Cell Null!");return;}
  createTower(cell[0],cell[1]);
}


function createTower(cell){
  let row = cell[0];
  let col = cell[1];
  let twr = null;
  let pos;

  if (!map.isVacant(row,col)){return null;}
  pos = map.coordToPos(row,col);
  twr = new Tower(pos,cell,map);
  map.setToFilled(row,col);
  bldgs.push(twr);
}
