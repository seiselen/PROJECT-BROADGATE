// TEMP until I throw into ui_objects.js xor its own ui_loaders source file
function initUI(){
  let i = 0; let iDelta = 32;


  //####################################################################
  // LABELS+CONTAINER FOR {GAME MODE, CONFIG[S], ETC.}
  //--------------------------------------------------------------------

  let panWide = 256;

  let label_gameConfigHeader = new UILabel(vec2(0,0),vec2(panWide,32), "Misc. Game Info:")
  .setPredefStyle("label2");

  i = 0; iDelta = 32;

  let label_gameMode = new UILabel(vec2(0,i+=iDelta),vec2(panWide,32))
  .bindCallback(() => manager.gameModeToString())
  .setPredefStyle("label").setStyle("textSize",16).setStyle("fill_bGround",color(120,60,120));

  let label_bullPool = new UILabel(vec2(0,i+=iDelta),vec2(panWide,32))
  .bindCallback(() => projPool.bulletPoolPopToString())
  .setPredefStyle("label").setStyle("textSize",16).setStyle("fill_bGround",color(120,60,120));



  let container_gameConfig = new UIContainer(vec2(32,32),vec2(panWide,128))
  .setStyle("fill_bGround",color(0,0,60,128))
  .addChildren([label_gameConfigHeader,label_gameMode,label_bullPool]);
  //####################################################################



  //####################################################################
  // LABELS+CONTAINER FOR # {GAME MODE, KILLS, ENEMIES, TOWERS}
  //--------------------------------------------------------------------
  let label_gameStatsHeader = new UILabel(vec2(0,0),vec2(224,32), "Game Stats")
  .setPredefStyle("label2");

  i = 0; iDelta = 32;

  let label_numKills = new UILabel(vec2(0,i+=iDelta),vec2(224,32))
  .bindCallback(() => ("# Enemies Killed: " + manager.getNumKills())).setPredefStyle("label");
  let label_numUnits = new UILabel(vec2(0,i+=iDelta),vec2(224,32))
  .bindCallback(() => ("# Enemies On Map: " + manager.getNumUnits())).setPredefStyle("label");
  let label_numTowers = new UILabel(vec2(0,i+=iDelta),vec2(224,32))
  .bindCallback(() => ("# Towers On Map: " + manager.getNumTowers())).setPredefStyle("label");

  let container_gameStats = new UIContainer(vec2(32,192),vec2(224,128))
  .setStyle("fill_bGround",color(0,0,60,128))
  .addChildren([label_gameStatsHeader,label_numKills,label_numUnits,label_numTowers]);
  //####################################################################


  //####################################################################
  // BUTTONS+CONTAINER FOR PLACING UNITS, TOWERS, ETC.
  //--------------------------------------------------------------------
  let label_constHeader = new UILabel(vec2(0,0),vec2(320,32), "Construction Options")
  .setPredefStyle("label2");

  let objW = 152;
  let objT = 32;

  let label_unitHeader = new UILabel(vec2(0,32),vec2(objW,objT), "<Unit Types>").setPredefStyle("label");
  let label_towerHeader = new UILabel(vec2(168,32),vec2(objW,objT), "<Tower Types>").setPredefStyle("label");


  let button_placeTower = new UIClickButton(vec2(168,64),vec2(objW,objT), "Place Tower")
  .bindAction(() => manager.handlePlaceBuilding())
  .setPredefStyle("click2");




  i = 32; iDelta = 32;

  let cBut_Unit_STD1 = new UIClickButton(vec2(0,i+=iDelta),vec2(objW,objT), "Standard-1")
  .bindAction(() => manager.handlePlaceUnit("STD_1")).setPredefStyle("click2");

  let cBut_Unit_STD2 = new UIClickButton(vec2(0,i+=iDelta),vec2(objW,objT), "Standard-2")
  .bindAction(() => manager.handlePlaceUnit("STD_2")).setPredefStyle("click2");

  let cBut_Unit_STD3 = new UIClickButton(vec2(0,i+=iDelta),vec2(objW,objT), "Standard-3")
  .bindAction(() => manager.handlePlaceUnit("STD_3")).setPredefStyle("click2");

  let cBut_Unit_STD4 = new UIClickButton(vec2(0,i+=iDelta),vec2(objW,objT), "Standard-4")
  .bindAction(() => manager.handlePlaceUnit("STD_4")).setPredefStyle("click2");

  let cBut_Unit_STD5 = new UIClickButton(vec2(0,i+=iDelta),vec2(objW,objT), "Standard-5")
  .bindAction(() => manager.handlePlaceUnit("STD_5")).setPredefStyle("click2");

  let cBut_Unit_STD6 = new UIClickButton(vec2(0,i+=iDelta),vec2(objW,objT), "Standard-6")
  .bindAction(() => manager.handlePlaceUnit("STD_6")).setPredefStyle("click2");

  let cBut_Unit_STD7 = new UIClickButton(vec2(0,i+=iDelta),vec2(objW,objT), "Standard-7")
  .bindAction(() => manager.handlePlaceUnit("STD_7")).setPredefStyle("click2");

  let cBut_Unit_STD8 = new UIClickButton(vec2(0,i+=iDelta),vec2(objW,objT), "Standard-8")
  .bindAction(() => manager.handlePlaceUnit("STD_8")).setPredefStyle("click2");





  let rectBar_buildStuffBotPad = new UIRectBar(vec2(168,96),vec2(objW,224))
  .setPredefStyle("rectBar");


  let container_placeThings = new UIContainer(vec2(32,384),vec2(320,320))
  .setStyle("fill_bGround",color(0,0,60,128))
  .addChildren([
    label_constHeader,label_unitHeader,label_towerHeader,
    button_placeTower,
    cBut_Unit_STD1,cBut_Unit_STD2,cBut_Unit_STD3,cBut_Unit_STD4,cBut_Unit_STD5,cBut_Unit_STD6,cBut_Unit_STD7,cBut_Unit_STD8,
    rectBar_buildStuffBotPad
  ]);
  //####################################################################




  //####################################################################
  // MAIN UI CONTAINER INIT AND CONSTRUCTION (OF SUBTREE)
  //--------------------------------------------------------------------
  mainUIPanel = new UIContainer(vec2(worldWide,0),vec2(menuWide,worldTall))
  .addChildren([container_gameConfig,container_gameStats,container_placeThings]);
  //####################################################################
} // Ends Function initUI