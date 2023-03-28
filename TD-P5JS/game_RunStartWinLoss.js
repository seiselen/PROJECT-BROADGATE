/*----------------------------------------------------------------------
|>>> Functions initGame / clearGame / onGameExit / runGame
+-----------------------------------------------------------------------
| Description: QAD Last-Minute implementation/handling of starting a new
|              game, especially following a win <xor> loss of the former
|              game played. Yes: it's disgusting compared to some of the
|              other code of this project --- but it works.
+---------------------------------------------------------------------*/
function initGame(mode){
  map        = new GameMap(cellsTall, cellsWide, cellSize, m01);
  waveManage = new WaveManager(m01[m01[0][0]+2]);
  manager    = new GameManager(mode);
  projPool   = new ProjectileManager();
  spawnPool  = new SpawnManager();
  unitPool   = new UnitManager();
  bldgs      = [];
  initUI(mode);
  didInitGame = true;
} // Ends Function initGame

function clearGame(){
  map         = null;
  waveManage  = null;
  manager     = null; 
  projPool    = null;
  spawnPool   = null;
  unitPool    = null;
  mainUIPanel = null;
  bldgs       = null;
} // Ends Function clearGame

function onGameExit(){
  frameGameQuit = frameCount;
  didInitGame = false;
  gameWon = false;
  gameLost = false;
} // Ends Function onGameExit

function runGame(){
  //>>> UPDATE CALLS (unit->bldg order COUNTS)
  mainUIPanel.update();
  manager.update();
  unitPool.update();
  bldgs.forEach(b => b.update());
  projPool.update();
  spawnPool.update();
  
  //>>> RENDER CALLS
  db_drawMenuSubCanv();
  map.render();
  bldgs.forEach(b => b.render());
  unitPool.render();
  projPool.render();
  dispMousePlaceCell();
  mainUIPanel.render();

  if(gameWon || gameLost){dispGameWinOrLose();};
} // Ends Function runGame

/*----------------------------------------------------------------------
|>>> Function initTitleScreenUI
+-----------------------------------------------------------------------
| Description: Loader/Init for title screen UI + all UIObjects therein
+---------------------------------------------------------------------*/
function initTitleScreenUI(){
  titleUIPanel = new UIContainer(vec2(0,0),vec2(worldWide,worldTall)).setStyle("fill_bGround",color(36,36,72)).addChildren([
    new UILabel(vec2(0,64),vec2(worldWide,72),"TOWER DEFENSE (IN P5JS)").setPredefStyle("label_transparent").setStyle("boldText",true).setStyle("textSize",64).setStyle("strk_border",color(0,0)),
    new UILabel(vec2(0,144),vec2(worldWide,36),"A Steven Eiselen Project / Game Demo (2021)").setPredefStyle("label_transparent").setStyle("boldText",true).setStyle("textSize",32).setStyle("strk_border",color(0,0)),
    new UIClickButton(vec2(32,288),vec2(448,192), "Start Game\n(Regular Mode)").bindAction(() => initGame(GameType.REGULAR)).setPredefStyle("click2").setStyle("fill_bGround",color(208,96,0)).setStyle("fill_text",color(255)).setStyle("boldText",true).setStyle("textSize",56).setStyle("strk_border",color(255)),
    new UIClickButton(vec2(544,288),vec2(448,192), "Start Game\n(Sandbox Mode)").bindAction(() => initGame(GameType.SANDBOX)).setPredefStyle("click2").setStyle("fill_bGround",color(0,144,48)).setStyle("fill_text",color(255)).setStyle("boldText",true).setStyle("textSize",56).setStyle("strk_border",color(255))
  ]);
} // Ends Function initTitleScreenUI

/*----------------------------------------------------------------------
|>>> Function runTitleScreen
+-----------------------------------------------------------------------
| Description: Implements 1-frame gap from leaving the current game and
|              setting all game-oriented objects null for reset/init on
|              starting new game; and otherwise updating and rendering
|              the title screen. Again: rough - but simple and works.
+---------------------------------------------------------------------*/
function runTitleScreen(){
  if(frameGameQuit+1==frameCount){clearGame();}
  titleUIPanel.update();
  titleUIPanel.render();
} // Ends Function runTitleScreen