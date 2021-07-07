function pane_statsDebugSwap(xPos,yPos,statsPane=null,debugPane=null){
  let pane = new UIContainer(vec2(xPos,yPos),vec2(320,32)).setStyle("fill_bGround",color(255,64)).addChildren([
    new UIClickButton(vec2(0,0),vec2(160,32), "Game Stats").bindAction(() => {statsPane.setHidden(false);debugPane.setHidden(true)}).setPredefStyle("click2").setStyle("fill_text",color(255)).setStyle("fill_bGround",color(156,120,0)),
    new UIClickButton(vec2(160,0),vec2(160,32), "Debug Menu").bindAction(() => {statsPane.setHidden(true);debugPane.setHidden(false)}).setPredefStyle("click2").setStyle("fill_text",color(255)).setStyle("fill_bGround",color(120,60,120))
  ]);
  return pane;
} // Ends Function pane_unitBldgSwap

function pane_gameStats(xPos,yPos){
  let i = 0; let objT = 32; let objW = 320;
  return new UIContainer(vec2(xPos,yPos),vec2(objW,128)).setStyle("fill_bGround",color(255,64)).addChildren([
    new UILabel(vec2(0,0),vec2(objW,objT)).setPredefStyle("label").setStyle("fill_bGround",color(156,120,0)).bindCallback(() => ("# Enemies Killed: " + manager.getNumKills())),
    new UILabel(vec2(0,i+=objT),vec2(objW,objT)).setPredefStyle("label").setStyle("fill_bGround",color(156,120,0)).bindCallback(() => ("# Enemies On Map: " + manager.getNumUnits())),
    new UILabel(vec2(0,i+=objT),vec2(objW,objT)).setPredefStyle("label").setStyle("fill_bGround",color(156,120,0)).bindCallback(() => ("# Towers On Map: " + manager.getNumTowers()))
  ]);
} // Ends Function pane_gameStats

function pane_gameDebug(xPos,yPos){
  let i = 0; let objT = 32; let objW = 320; let col = color(180,32,180);
  return new UIContainer(vec2(xPos,yPos),vec2(objW,128)).setStyle("fill_bGround",color(255,64)).addChildren([
    new UILabel(vec2(0,0),vec2(objW,objT)).setPredefStyle("label").setStyle("fill_bGround",color(120,60,120)).bindCallback(() => manager.gameModeToString()),
    new UILabel(vec2(0,i+=objT),vec2(objW,objT)).setPredefStyle("label").setStyle("fill_bGround",color(120,60,120)).bindCallback(() => projPool.poolPopToString(0)),
    new UILabel(vec2(0,i+=objT),vec2(objW,objT)).setPredefStyle("label").setStyle("fill_bGround",color(120,60,120)).bindCallback(() => projPool.poolPopToString(1))
  ]);
} // Ends Function pane_gameDebug




function initUI(){
  //====================================================================
  //>>> Loaders/Inits for [sub] UI panels 
  //====================================================================
  let gameStatsPane      = pane_gameStats(32,32)/*.setHidden()*/;
  let gameDebugPane      = pane_gameDebug(32,32).setHidden();
  let statsDebugSwapPane = pane_statsDebugSwap(32,0,gameStatsPane,gameDebugPane);

  let unitSpawnPane      = pane_unitSpawn(32,224).setHidden();
  let bldgSpawnPane      = pane_bldgSpawn(32,224)/*.setHidden()*/;
  let unitBldgSwapPane   = pane_unitBldgSwap(32,192,unitSpawnPane,bldgSpawnPane);

  //====================================================================
  //>>> Loader/Init for main UI Panel
  //====================================================================
  mainUIPanel = new UIContainer(vec2(worldWide,0),vec2(menuWide,worldTall))
  .setStyle("fill_bGround",color(60)).addChildren([
    gameStatsPane, gameDebugPane, statsDebugSwapPane,
    unitSpawnPane, bldgSpawnPane, unitBldgSwapPane
  ]);
  //####################################################################
} // Ends Function initUI



function pane_unitBldgSwap(xPos,yPos,unitPane=null,bldgPane=null){
  let pane = new UIContainer(vec2(xPos,yPos),vec2(320,32)).setStyle("fill_bGround",color(255,64)).addChildren([
    new UIClickButton(vec2(160,0),vec2(160,32), "Create Enemy").bindAction(() => {unitPane.setHidden(false);bldgPane.setHidden(true)}).setPredefStyle("click2").setStyle("fill_text",color(255)).setStyle("fill_bGround",color(0,60,216)),
    new UIClickButton(vec2(0,0),vec2(160,32), "Create Tower").bindAction(() => {unitPane.setHidden(true);bldgPane.setHidden(false)}).setPredefStyle("click2").setStyle("fill_text",color(255)).setStyle("fill_bGround",color(48,144,0))
  ]);
  return pane;
} // Ends Function pane_unitBldgSwap

function pane_bldgSpawn(xPos,yPos){
  let pane = new UIContainer(vec2(xPos,yPos),vec2(320,512)).setStyle("fill_bGround",color(240));
  Object.keys(WeaponType).forEach((t,i) => pane.addChildren(spawnWeapUI(t,i)));
  pane.addChild(new UILabel(vec2(0,0),vec2(320,512)).setPredefStyle("label_transparent").setStyle("strk_border",color(240)));
  return pane;
} // Ends Function pane_bldgSpawn

function pane_unitSpawn(xPos,yPos){
  let pane = new UIContainer(vec2(xPos,yPos),vec2(320,512))
  .setStyle("fill_bGround",color(0,60,216));
  Object.keys(UnitType).forEach((t,i) => pane.addChildren(spawnUnitUI(t,i)));
  return pane;
} // Ends Function pane_unitSpawn

function spawnWeapUI(key,idx){
  let yOff = 48*idx; 
  switch(idx){
    case 3: case 4: yOff+=10; break; 
    case 5: case 6: case 7: yOff+=20; break; 
    case 8: case 9: yOff+=30; break;
  }
  return [
    new UILabel(vec2(0,yOff),vec2(320,48),"").setPredefStyle("label").setStyle("fill_bGround", color(48,144,0)),
    new UILabel(vec2(0,yOff),vec2(224,24),bldgKeyToUIName(key)).setPredefStyle("label_transparent").setStyle("textSize",24).setStyle("textOff",[3,6]).setStyle("strk_border",color(0,0)),
    new UILabel(vec2(0,24+yOff),vec2(224,24),WeaponType[key][1]).setPredefStyle("label_transparent").setStyle("textSize",12).setStyle("textOff",[-109,-10]).setStyle("useTextWrap", true).setStyle("textDims", [224,24]).setStyle("textOri",UIStyle.TextOriOpts.CTR).setStyle("strk_border",color(0,0)),
    new UIClickButton(vec2(232,yOff+12),vec2(78,24), "SELECT").bindAction(() => manager.handlePlaceBuilding(key)).setPredefStyle("click2").setStyle("textOff",[0,2]).setStyle("boldText",true),
    new UILabel(vec2(0,yOff),vec2(320,48),"").setPredefStyle("label_transparent")
  ];
} // Ends Function spawnWeapUI

function spawnUnitUI(key,idx){
  let info   = UnitType[key];
  let spdStr = (info[1]<1) ? " p/s" : " px/sec";
  let blurb  = "Health: "+info[0]+"\nSpeed: "+info[1]+spdStr+"\nBounty: $"+info[4];
  let yOff   = 64*idx;
  return [
    new UILabel(vec2(0,yOff),vec2(96,64),unitKeyToUIName(key)).setPredefStyle("label_transparent").setStyle("strk_border",color(0,0)),
    new UILabel(vec2(96,yOff),vec2(96,64),blurb).setPredefStyle("label_transparent").setStyle("textSize",12).setStyle("textOff",[6,12]).setStyle("textOri",UIStyle.TextOriOpts.TL).setStyle("strk_border",color(0,0)),
    new UILabel(vec2(192,yOff),vec2(128,64),"Click To Spawn:").setPredefStyle("label_transparent").setStyle("textSize",16).setStyle("textOff",[4,8]).setStyle("textOri",UIStyle.TextOriOpts.TL).setStyle("strk_border",color(0,0)),
    new UIClickButton(vec2(200,yOff+30),vec2(48,24), "ONE").bindAction(() => manager.handleSpawnUnit(key)).setPredefStyle("click2").setStyle("boldText",true),
    new UIClickButton(vec2(260,yOff+30),vec2(48,24), "TEN").bindAction(() => manager.handleSpawnUnit(key,10)).setPredefStyle("click2").setStyle("boldText",true),
    new UILabel(vec2(0,yOff),vec2(320,64),"").setPredefStyle("label_transparent")
  ];
} // Ends Function spawnUnitUI




//>>> QAD NOTE: Obsolete per new/upgraded UI, but keeping J.I.C.
function pane_oldPlaceUnitBldg(){
  let objW = 152; let objT = 32; let i = 32;
  let UnitPlaceBlurb = "Note: Places unit at \'mouse\n          hover\' cell (if enemy\n          path), not the cell of\n          starting waypoint!"
  return new UIContainer(vec2(32,352),vec2(320,384))
  .setStyle("fill_bGround",color(0,0,60,128))
  .addChildren([
    new UILabel(vec2(0,0),vec2(320,objT), "Construction Options").setPredefStyle("label2"),
    new UILabel(vec2(0,32),vec2(objW,objT), "<Unit Types>").setPredefStyle("label"),
    new UILabel(vec2(168,32),vec2(objW,objT), "<Tower Types>").setPredefStyle("label"),
    new UIClickButton(vec2(0,i+=objT),vec2(objW,objT), "Standard #1").bindAction(() => manager.handlePlaceUnit("STD_1")).setPredefStyle("click2"),
    new UIClickButton(vec2(0,i+=objT),vec2(objW,objT), "Standard #2").bindAction(() => manager.handlePlaceUnit("STD_2")).setPredefStyle("click2"),
    new UIClickButton(vec2(0,i+=objT),vec2(objW,objT), "Standard #3").bindAction(() => manager.handlePlaceUnit("STD_3")).setPredefStyle("click2"),
    new UIClickButton(vec2(0,i+=objT),vec2(objW,objT), "Standard #4").bindAction(() => manager.handlePlaceUnit("STD_4")).setPredefStyle("click2"),
    new UIClickButton(vec2(0,i+=objT),vec2(objW,objT), "Standard #5").bindAction(() => manager.handlePlaceUnit("STD_5")).setPredefStyle("click2"),
    new UIClickButton(vec2(0,i+=objT),vec2(objW,objT), "Standard #6").bindAction(() => manager.handlePlaceUnit("STD_6")).setPredefStyle("click2"),
    new UIClickButton(vec2(0,i+=objT),vec2(objW,objT), "Standard #7").bindAction(() => manager.handlePlaceUnit("STD_7")).setPredefStyle("click2"),
    new UIClickButton(vec2(0,i+=objT),vec2(objW,objT), "Standard #8").bindAction(() => manager.handlePlaceUnit("STD_8")).setPredefStyle("click2"),
    new UILabel(vec2(0,i+=objT),vec2(objW,objT*2),UnitPlaceBlurb).setPredefStyle("label").setStyle("textSize",12).setStyle("textOff",[3,6]).setStyle("textOri",UIStyle.TextOriOpts.TL),
    new UIClickButton(vec2(168,i=2*objT),vec2(objW,objT), "Laser Blaster").bindAction(() =>   manager.handlePlaceBuilding("LaserBlaster")).setPredefStyle("click2"),
    new UIClickButton(vec2(168,i+=objT),vec2(objW,objT), "Laser Blaster 2x").bindAction(() => manager.handlePlaceBuilding("LaserBlasterDual")).setPredefStyle("click2"),
    new UIClickButton(vec2(168,i+=objT),vec2(objW,objT), "Laser Blaster 3x").bindAction(() => manager.handlePlaceBuilding("LaserBlasterTriple")).setPredefStyle("click2"),
    new UIClickButton(vec2(168,i+=objT),vec2(objW,objT), "Laser Beam").bindAction(() =>       manager.handlePlaceBuilding("LaserBeam")).setPredefStyle("click2"),
    new UIClickButton(vec2(168,i+=objT),vec2(objW,objT), "Relay Beam").bindAction(() =>       manager.handlePlaceBuilding("LaserBeamRelay")).setPredefStyle("click2"),
    new UIClickButton(vec2(168,i+=objT),vec2(objW,objT), "Cannon").bindAction(() =>           manager.handlePlaceBuilding("Cannon")).setPredefStyle("click2"),
    new UIClickButton(vec2(168,i+=objT),vec2(objW,objT), "Semi Auto").bindAction(() =>        manager.handlePlaceBuilding("SemiAutoCannon")).setPredefStyle("click2"),
    new UIClickButton(vec2(168,i+=objT),vec2(objW,objT), "Gatling Gun").bindAction(() =>      manager.handlePlaceBuilding("GatlingGunCannon")).setPredefStyle("click2"),
    new UIClickButton(vec2(168,i+=objT),vec2(objW,objT), "Missile Site").bindAction(() =>     manager.handlePlaceBuilding("MissileLauncher")).setPredefStyle("click2"),
    new UIClickButton(vec2(168,i+=objT),vec2(objW,objT), "Missile Site 2x").bindAction(() =>  manager.handlePlaceBuilding("MissileLauncher2X")).setPredefStyle("click2")
  ]);
} // Ends Function pane_oldPlaceUnitBldg