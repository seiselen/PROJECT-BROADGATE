
var drawOp;
function initUI(){
  createSpan("Draw Option: ").parent("#ui");

  drawOp = createSelect().parent("#ui");

  drawOp.option('none', 'none');
  drawOp.option('draw dirt tile',  'td');
  drawOp.option('draw grass tile', 'tg');
  drawOp.option('draw road tile',  'tr');
  drawOp.option('draw water tile', 'tw');

  drawOp.option('clear resource', 'xr');
  drawOp.option('plant ore (5)',  'or_5');
  drawOp.option('plant gem (5)',  'gr_5');
  drawOp.option('plant aeth (5)', 'ar_5');  

  drawOp.style('width', '120px');
  textAlign(CENTER);
  fill(255, 0, 0);
} // Ends Function initUI


function onMapEditMouseEvent(ev,op){
  let mCoord = map.posToCoord(mousePtToVec());
  let mRow   = mCoord[0]; 
  let mCol   = mCoord[1];

  switch(op){
    case 'td'   : map.setTerCell(mRow, mCol, TibMap.TerType.DIRT); break;
    case 'tg'   : map.setTerCell(mRow, mCol, TibMap.TerType.GRASS); break;
    case 'tr'   : map.setTerCell(mRow, mCol, TibMap.TerType.ROAD); break;
    case 'tw'   : map.setTerCell(mRow, mCol, TibMap.TerType.WATER); break;
    case 'xr'   : map.clearResCell(mRow, mCol); break;
    case 'or_5' : map.setResCellConc(mRow, mCol, TibMap.ResType.ORE,  ev, 5); break;
    case 'gr_5' : map.setResCellConc(mRow, mCol, TibMap.ResType.GEM,  ev, 5); break;
    case 'ar_5' : map.setResCellConc(mRow, mCol, TibMap.ResType.AETH, ev, 5); break;
  }
} // Ends Function onMapEditMousePressed