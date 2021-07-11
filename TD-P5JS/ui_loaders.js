/*----------------------------------------------------------------------
|>>> Function initUI
+-----------------------------------------------------------------------
| Description: Loaders/Inits for main UI panel and all [sub]panels (i.e.
|              UIContainers) and their UIObjects therein. Calling this
|              function thus sets up the UI contained within the right-
|              hand partition of the canvas (sans [future] exceptions).
+-----------------------------------------------------------------------
| Implementation Notes:
|  > Will init both UI mode types (in case I want to swap them manually
|    in-game via the inspector). Mode types are: {"regular","sandbox"}
+---------------------------------------------------------------------*/
function initUI(mode){
  let sBoxModePane = pane_sBoxModeUI();
  let regModePane  = pane_regModeUI();
  switch(mode){
    case GameType.REGULAR : regModePane.setHidden(false); sBoxModePane.setHidden(true); break;
    case GameType.SANDBOX : sBoxModePane.setHidden(false); regModePane.setHidden(true); break;
  }
  mainUIPanel = new UIContainer(vec2(worldWide,0),vec2(menuWide,worldTall)).setStyle("fill_bGround",color(60)).addChildren([sBoxModePane, regModePane]);
} // Ends Function initUI



/*######################################################################
|!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
|>>>>>> SANDBOX MODE UI LOADERS AND INITS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
|!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
+#####################################################################*/
function pane_sBoxModeUI(){
  let gameStatsPane      = pane_sBoxGameStats(32,32).setHidden(false);
  let gameDebugPane      = pane_sBoxGameDebug(32,32).setHidden(true);
  let statsDebugSwapPane = pane_sBoxSDSwap(32,0,gameStatsPane,gameDebugPane);

  let unitSpawnPane      = pane_sBoxUnitSpawn(32,224).setHidden(true);
  let bldgSpawnPane      = pane_sBoxBldgPlace(32,224).setHidden(false);
  let unitBldgSwapPane   = pane_sBoxUBSwap(32,192,unitSpawnPane,bldgSpawnPane);

  return new UIContainer(vec2(0,0),vec2(menuWide,worldTall)).setStyle("fill_bGround",color(60)).addChildren([gameStatsPane, gameDebugPane, statsDebugSwapPane, unitSpawnPane, bldgSpawnPane, unitBldgSwapPane]);
} // Ends Function pane_sBoxModeUI

function pane_sBoxSDSwap(xPos,yPos,statsPane=null,debugPane=null){
  let pane = new UIContainer(vec2(xPos,yPos),vec2(320,32)).setStyle("fill_bGround",color(255,64)).addChildren([
    new UIClickButton(vec2(0,0),vec2(160,32), "Game Info").bindAction(() => {statsPane.setHidden(false);debugPane.setHidden(true)}).setPredefStyle("click2").setStyle("fill_text",color(255)).setStyle("fill_bGround",color(156,120,0)),
    new UIClickButton(vec2(160,0),vec2(160,32), "Debug Info").bindAction(() => {statsPane.setHidden(true);debugPane.setHidden(false)}).setPredefStyle("click2").setStyle("fill_text",color(255)).setStyle("fill_bGround",color(120,60,120))
  ]);
  return pane;
} // Ends Function pane_sBoxSDSwap

function pane_sBoxGameStats(xPos,yPos){
  let i = 0; let objT = 32; let objW = 320;
  return new UIContainer(vec2(xPos,yPos),vec2(objW,128)).setStyle("fill_bGround",color(255,64)).addChildren([
    new UILabel(vec2(176,0),vec2(84,objT)).setPredefStyle("label2").setStyle("fill_bGround",color(156,120,0)).bindCallback(() => fpsBlurbToString()),
    new UIClickButton(vec2(260,0),vec2(60,objT), "# QUIT #\n# GAME #").bindAction(() => onGameExit()).setPredefStyle("click2").setStyle("textSize",12).setStyle("fill_text",color(255,60,0)).setStyle("fill_bGround",color(255)).setStyle("boldText",true),


    new UILabel(vec2(0,0),vec2(176,objT)).setPredefStyle("label2").setStyle("fill_bGround",color(156,120,0)).bindCallback(() => ("Units Killed: " + manager.getNumKills())), 
    new UILabel(vec2(0,i+=objT),vec2(176,objT)).setPredefStyle("label2").setStyle("fill_bGround",color(156,120,0)).bindCallback(() => ("Units On Map: " + manager.getNumUnits())),
    new UILabel(vec2(176,i),vec2(144,objT)).setPredefStyle("label2").setStyle("fill_bGround",color(156,120,0)).bindCallback(() => ("Lives Left: " + manager.getCurLives())),
    
    new UILabel(vec2(0,i+=objT),vec2(176,objT)).setPredefStyle("label2").setStyle("fill_bGround",color(156,120,0)).bindCallback(() => ("Towers On Map: " + manager.getNumTowers())),
    new UILabel(vec2(176,i),vec2(144,objT)).setPredefStyle("label2").setStyle("fill_bGround",color(156,120,0)).bindCallback(() => ("Money: $" + manager.getCurMoney())),

    new UILabel(vec2(0,i+=objT),vec2(320,objT)).setPredefStyle("label2").setStyle("fill_bGround",color(156,120,0)).bindCallback(() => waveManage.toBlurb()),
    new UIClickButton(vec2(176,i+4),vec2(136,24), "SEND NEXT WAVE").bindAction(() => waveManage.sendNextWave()).setPredefStyle("click2").setStyle("textOff",[0,2]).setStyle("textSize",14).setStyle("boldText",true),
  ]);
} // Ends Function pane_sBoxGameStats

function pane_sBoxGameDebug(xPos,yPos){
  let i = 0; let objT = 32; let objW = 320; let col = color(180,32,180);
  return new UIContainer(vec2(xPos,yPos),vec2(objW,160)).setStyle("fill_bGround",color(255,64)).addChildren([
    new UILabel(vec2(0,0),vec2(216,objT)).setPredefStyle("label").setStyle("fill_bGround",color(120,60,120)).setStyle("textOff",[4,8]).setStyle("textOri",UIStyle.TextOriOpts.TL).bindCallback(() => manager.gameModeToString()),
    new UILabel(vec2(216,0),vec2(104,objT)).setPredefStyle("label").setStyle("fill_bGround",color(120,60,120)).bindCallback(() => fpsBlurbToString()),   
    new UILabel(vec2(0,i+=objT),vec2(objW,objT)).setPredefStyle("label2").setStyle("fill_bGround",color(120,60,120)).bindCallback(() => projPool.poolPopToString(0)),
    new UILabel(vec2(0,i+=objT),vec2(objW,objT)).setPredefStyle("label2").setStyle("fill_bGround",color(120,60,120)).bindCallback(() => projPool.poolPopToString(1)),
    new UILabel(vec2(0,i+=objT),vec2(objW,objT)).setPredefStyle("label2").setStyle("fill_bGround",color(120,60,120)).bindCallback(() => spawnPool.poolPopToString()),
    new UILabel(vec2(0,i+=objT),vec2(objW,objT)).setPredefStyle("label2").setStyle("fill_bGround",color(120,60,120)).bindCallback(() => unitPool.poolPopToString()),
  ]);
} // Ends Function pane_sBoxGameDebug

function pane_sBoxUBSwap(xPos,yPos,unitPane=null,bldgPane=null){
  let pane = new UIContainer(vec2(xPos,yPos),vec2(320,32)).setStyle("fill_bGround",color(255,64)).addChildren([
    new UIClickButton(vec2(160,0),vec2(160,32), "Create Enemy").bindAction(() => {unitPane.setHidden(false);bldgPane.setHidden(true)}).setPredefStyle("click2").setStyle("fill_text",color(255)).setStyle("fill_bGround",color(0,60,216)),
    new UIClickButton(vec2(0,0),vec2(160,32), "Create Tower").bindAction(() => {unitPane.setHidden(true);bldgPane.setHidden(false)}).setPredefStyle("click2").setStyle("fill_text",color(255)).setStyle("fill_bGround",color(48,144,0))
  ]);
  return pane;
} // Ends Function pane_sBoxUBSwap

function pane_sBoxBldgPlace(xPos,yPos){
  let pane = new UIContainer(vec2(xPos,yPos),vec2(320,512)).setStyle("fill_bGround",color(240));
  Object.keys(WeaponType).forEach((t,i) => pane.addChildren(initUI_sBoxSelectWeapon(t,i)));
  pane.addChild(new UILabel(vec2(0,0),vec2(320,512)).setPredefStyle("label_transparent").setStyle("strk_border",color(240)));
  return pane;
} // Ends Function pane_sBoxBldgPlace

function pane_sBoxUnitSpawn(xPos,yPos){
  let pane = new UIContainer(vec2(xPos,yPos),vec2(320,512)).setStyle("fill_bGround",color(0,60,216));
  Object.keys(UnitType).forEach((t,i) => pane.addChildren(initUI_sBoxSpawnUnit(t,i)));
  return pane;
} // Ends Function pane_sBoxUnitSpawn

function initUI_sBoxSelectWeapon(key,idx){
  let yOff = 48*idx; 
  switch(idx){
    case 3: case 4: yOff+=10; break; 
    case 5: case 6: case 7: yOff+=20; break; 
    case 8: case 9: yOff+=30; break;
  }
  return [
    new UILabel(vec2(0,yOff),vec2(320,48),"").setPredefStyle("label").setStyle("fill_bGround", color(48,144,0)),
    new UILabel(vec2(0,yOff),vec2(224,24),WeaponType[key][1]).setPredefStyle("label_transparent").setStyle("textSize",24).setStyle("textOff",[3,6]).setStyle("strk_border",color(0,0)),
    new UILabel(vec2(0,24+yOff),vec2(224,24),WeaponType[key][2]).setPredefStyle("label_transparent").setStyle("textSize",12).setStyle("textOff",[-109,-10]).setStyle("useTextWrap", true).setStyle("textDims", [224,24]).setStyle("textOri",UIStyle.TextOriOpts.CTR).setStyle("strk_border",color(0,0)),
    new UIClickButton(vec2(232,yOff+12),vec2(78,24), "SELECT").bindAction(() => manager.handlePlaceBuilding(key)).setPredefStyle("click2").setStyle("textOff",[0,2]).setStyle("boldText",true),
    new UILabel(vec2(0,yOff),vec2(320,48),"").setPredefStyle("label_transparent")
  ];
} // Ends Function initUI_sBoxSelectWeapon

function initUI_sBoxSpawnUnit(key,idx){
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
} // Ends Function initUI_sBoxSpawnUnit




/*######################################################################
|!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
|>>>>>> SANDBOX MODE UI LOADERS AND INITS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
|!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
+#####################################################################*/
function pane_regModeUI(){
  let projecUICol = color(156,12,60); let energyUICol = color(60,96,168); let gameUICol = color(0,108,48)
  let energyTowerSelPane = pane_regSelectEnergyWeap(16,416,energyUICol).setHidden(false);
  let projecTowerSelPane = pane_regSelectProjecWeap(16,416,projecUICol).setHidden(true);
  let swapEPWeapTowPane  = pane_regEnergyProjecSwap(16,384,energyTowerSelPane,energyUICol,projecTowerSelPane,projecUICol);
  let gameHUDPane        = pane_regGameHUD(16,0,gameUICol);
  return new UIContainer(vec2(0,0),vec2(menuWide,worldTall)).setStyle("fill_bGround",color(60)).addChildren([gameHUDPane, energyTowerSelPane, projecTowerSelPane, swapEPWeapTowPane]);
} // Ends Function pane_regModeUI

function pane_regEnergyProjecSwap(xPos,yPos,eTowPane,eTowCol,pTowPane,pTowCol){
  let pane = new UIContainer(vec2(xPos,yPos),vec2(352,32)).setStyle("fill_bGround",color(255,64)).addChildren([
    new UIClickButton(vec2(0,0),vec2(176,32), "Energy Weapons").setPredefStyle("click2").setStyle("fill_text",color(255)).setStyle("fill_bGround",eTowCol).bindAction(() => {eTowPane.setHidden(false);pTowPane.setHidden(true)}),
    new UIClickButton(vec2(176,0),vec2(176,32), "Projectile Weapons").setPredefStyle("click2").setStyle("fill_text",color(255)).setStyle("fill_bGround",pTowCol).bindAction(() => {eTowPane.setHidden(true);pTowPane.setHidden(false)})
  ]);
  return pane;
} // Ends Function pane_regEnergyProjecSwap

function pane_regSelectEnergyWeap(xPos,yPos,col){
  let pane = new UIContainer(vec2(xPos,yPos),vec2(352,320)).setStyle("fill_bGround",col);
  Object.keys(WeaponType).filter(k => k.charAt(0)=="E").forEach((t,i) => pane.addChildren(initUI_regSelectWeapon(t,i,col)));
  pane.addChild(new UIRectBar(vec2(0,186),vec2(352,10)).setStyle("fill_bGround",color(240)));
  return pane;
} // Ends Function pane_regSelectEnergyWeap

function pane_regSelectProjecWeap(xPos,yPos,col){
  let pane = new UIContainer(vec2(xPos,yPos),vec2(352,320)).setStyle("fill_bGround",col);
  Object.keys(WeaponType).filter(k => k.charAt(0)=="P").forEach((t,i) => pane.addChildren(initUI_regSelectWeapon(t,i,col)));
  pane.addChild(new UIRectBar(vec2(0,186),vec2(352,10)).setStyle("fill_bGround",color(240)));
  return pane;
} // Ends Function pane_regSelectProjecWeap

function initUI_regSelectWeapon(key,idx,col){
  let yOff = 62*idx; 
  switch(idx){case 3: case 4: yOff+=10; break;}
  return [
    new UILabel(vec2(0,yOff),vec2(224,24),WeaponType[key][1]).setPredefStyle("label_transparent").setStyle("textOri",UIStyle.TextOriOpts.TL).setStyle("textSize",28).setStyle("textOff",[6,6]).setStyle("strk_border",color(0,0)),
    new UILabel(vec2(0,24+yOff),vec2(224,24),WeaponType[key][2]).setPredefStyle("label2").setStyle("textSize",16).setStyle("textOff",[8,14]).setStyle("strk_border",color(0,0)),
    new UIBuyButton(vec2(288,yOff+8),vec2(56,40), "$"+WeaponType[key][0]).bindAction(() => manager.handlePlaceBuilding(key)).bindQuery(() => manager.canAfford(key)).setPredefStyle("click2").setStyle("textSize",20).setStyle("textOff",[0,1]).setStyle("boldText",true),
    new UILabel(vec2(0,yOff),vec2(352,62),"").setPredefStyle("label_transparent")
  ];
} // Ends Function initUI_sBoxSelectWeapon

function pane_regGameHUD(xPos,yPos,col){
  let i = 38;
  let pane = new UIContainer(vec2(xPos,yPos),vec2(352,320)).setStyle("fill_bGround",col).addChildren([
    new UILabel(vec2(0,0),vec2(256,32),"Tower Defense In P5JS").setPredefStyle("label").setStyle("fill_bGround",color(240,240,255)).setStyle("fill_text",color(60,60,72)).setStyle("boldText",true).setStyle("textOri",UIStyle.TextOriOpts.TL).setStyle("textSize",24).setStyle("textOff",[3,6]).setStyle("strk_border",color(0,0)),
    new UILabel(vec2(256,0),vec2(96,32),"Steven Eiselen\nVersion : 1.0").setPredefStyle("label").setStyle("fill_bGround",color(240,240,255)).setStyle("fill_text",color(60,60,72)).setStyle("boldText",true).setStyle("textOri",UIStyle.TextOriOpts.TL).setStyle("textSize",12).setStyle("textOff",[6,4]).setStyle("strk_border",color(0,0)),

    new UILabel(vec2(256,32),vec2(96,80),"").setPredefStyle("label_transparent").setStyle("fill_bGround",color(64,128)).setStyle("strk_border",color(0,0)),
    new UIClickButton(vec2(8,40),vec2(112,64), "Quit\nGame").setPredefStyle("click2").setStyle("boldText",true).setStyle("textSize",22).bindAction(() => onGameExit()),
    new UIClickButton(vec2(136,40),vec2(112,64), "New\nGame").setPredefStyle("click2").setStyle("boldText",true).setStyle("textSize",22).bindAction(() => onGameExit()),   
    new UILabel(vec2(256,i),vec2(96,20)).setPredefStyle("label_transparent").setStyle("textOri",UIStyle.TextOriOpts.TL).setStyle("textSize",12).setStyle("textOff",[6,6]).setStyle("strk_border",color(0,0)).bindCallback(() => fpsBlurbToString()),
    new UILabel(vec2(256,i+=16),vec2(96,20)).setPredefStyle("label_transparent").setStyle("textOri",UIStyle.TextOriOpts.TL).setStyle("textSize",12).setStyle("textOff",[6,6]).setStyle("strk_border",color(0,0)).bindCallback(() => unitPool.poolPctToString()),
    new UILabel(vec2(256,i+=16),vec2(96,20)).setPredefStyle("label_transparent").setStyle("textOri",UIStyle.TextOriOpts.TL).setStyle("textSize",12).setStyle("textOff",[6,6]).setStyle("strk_border",color(0,0)).bindCallback(() => projPool.poolPctToString(0)),
    new UILabel(vec2(256,i+=16),vec2(96,20)).setPredefStyle("label_transparent").setStyle("textOri",UIStyle.TextOriOpts.TL).setStyle("textSize",12).setStyle("textOff",[6,6]).setStyle("strk_border",color(0,0)).bindCallback(() => projPool.poolPctToString(1)),

    new UIRectBar(vec2(0,112),vec2(352,14)).setStyle("fill_bGround",color(240)),
    new UILabel(vec2(0,112+14),vec2(352,36),"Funds Available:").setPredefStyle("label_transparent").setStyle("textOri",UIStyle.TextOriOpts.TL).setStyle("textOff",[16,8]).setStyle("textSize",22).setStyle("strk_border",color(0,0)),
    new UILabel(vec2(0,148+14),vec2(352,36),"Lives Remaining:").setPredefStyle("label_transparent").setStyle("textOri",UIStyle.TextOriOpts.TL).setStyle("textOff",[16,8]).setStyle("textSize",22).setStyle("strk_border",color(0,0)),
    new UILabel(vec2(0,184+14),vec2(352,36),"Enemies Killed:").setPredefStyle("label_transparent").setStyle("textOri",UIStyle.TextOriOpts.TL).setStyle("textOff",[16,8]).setStyle("textSize",22).setStyle("strk_border",color(0,0)),
    new UILabel(vec2(224,112+14),vec2(128,36)).setPredefStyle("label_transparent").setStyle("textOri",UIStyle.TextOriOpts.TL).setStyle("textOff",[4,6]).setStyle("textSize",28).setStyle("boldText",true).setStyle("strk_border",color(0,0)).bindCallback(() => ("$" + manager.getCurMoney())),
    new UILabel(vec2(224,148+14),vec2(128,36)).setPredefStyle("label_transparent").setStyle("textOri",UIStyle.TextOriOpts.TL).setStyle("textOff",[4,6]).setStyle("textSize",28).setStyle("boldText",true).setStyle("strk_border",color(0,0)).bindCallback(() => nf(manager.getCurLives(),3)),
    new UILabel(vec2(224,184+14),vec2(128,36)).setPredefStyle("label_transparent").setStyle("textOri",UIStyle.TextOriOpts.TL).setStyle("textOff",[4,6]).setStyle("textSize",28).setStyle("boldText",true).setStyle("strk_border",color(0,0)).bindCallback(() => nf(manager.getNumKills(),3)),

    new UIRectBar(vec2(0,234),vec2(352,14)).setStyle("fill_bGround",color(240)),
    new UILabel(vec2(0,220+30),vec2(352,36), "This Wave:").setPredefStyle("label_transparent").setStyle("textOri",UIStyle.TextOriOpts.TL).setStyle("textOff",[16,8]).setStyle("textSize",22).setStyle("strk_border",color(0,0)),
    new UILabel(vec2(0,256+27),vec2(352,36), "Next Wave:").setPredefStyle("label_transparent").setStyle("textOri",UIStyle.TextOriOpts.TL).setStyle("textOff",[16,8]).setStyle("textSize",22).setStyle("strk_border",color(0,0)),
    new UILabel(vec2(140,220+30),vec2(352,36)).setPredefStyle("label_transparent").setStyle("boldText",true).setStyle("textOri",UIStyle.TextOriOpts.TL).setStyle("textOff",[4,6]).setStyle("textSize",28).setStyle("strk_border",color(0,0)).bindCallback(() => waveManage.progressToString()),
    new UILabel(vec2(140,256+27),vec2(352,36)).setPredefStyle("label_transparent").setStyle("boldText",true).setStyle("textOri",UIStyle.TextOriOpts.TL).setStyle("textOff",[4,6]).setStyle("textSize",28).setStyle("strk_border",color(0,0)).bindCallback(() => waveManage.nextwaveToString()),   
    new UIClickButton(vec2(196,254),vec2(148,28), "SEND NEXT WAVE").setPredefStyle("click2").setStyle("textOff",[0,2]).setStyle("boldText",true).setStyle("textSize",16).bindAction(() => waveManage.sendNextWave()),
  ]);
  return pane;  
} // Ends Function pane_regGameHUD