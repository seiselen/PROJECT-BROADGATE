/*----------------------------------------------------------------------
|>>> Class GameManager
+=======================================================================
| Description: Contains code used to manage creation of units and towers
|              (via both user and scripted requests), state/scorekeeping
|              (i.e. #kills, #player_lives, #player_money), sending in
|              waves of enemy units (i.e. vis-a-vis the level's script),
|              and Win/Lose condition (i.e. {lives==0}->{OnGameLose()},
|              {wave==nWaves}&&{enemies==0}&&{lives>0}->{OnLevelWin()}
+-----------------------------------------------------------------------
| Variable Descriptions:
|  > curMoney     = How much money player currently has (i.e. to spend 
|                   on towers in a non-sandbox game, and as earned via
|                   killing enemy units)
|  > initMoney    = How much money a player gets on starting a game
|  > curLives     = Number of current (i.e. remaining) lives that player
|                   has; s.t. decremented whenever enemy unit arrives at
|                   exit waypoint, and [curLives==0] => "On-Lose-Game"
|  > maxLives     = Starting and Max number of lives that player gets
|  > numUnits     = Number of enemy units currently alive in the game
|  > numKills     = Number of enemy units killed by towers (i.e. player)
|  > numTowers    = Number of towers currently placed within the game
|  > gameMode     = Current game mode; i.e. of implicit F.S.M. effecting
|                   disjoint UI/UX behaviors (e.g. effect of mouse click
|                   after selecting a tower to place <vs> after it was
|                   placed). Default/Init value: GameManager.MODES.IDLE
|  > modeDeltaFr  = Frame of when a mode change occured. This is used to
|                   handle race conditions between asynch UI events and
|                   when game manager's update code is called; i.e. it's
|                   a slightly fancier analog of a 'dirty bit/flag'.
|  > reqBldg      = Tower type currently (most recently) requested for
|                   creation and then placement upon a cell; unlike its
|                   unit analog: this state remains very much utilized!
|  > reqUnit      = Unit type currently requested for creation/placement
|                   upon a cell; now mostly deprecated vis-a-vis the new
|                   UI design/system, but keeping for now JIC
*=====================================================================*/
class GameManager{
  static MODES = {START:0, IDLE:1, PLACE_BLDG:2, PLACE_UNIT:3, LOSE:4, WIN:5};
  constructor(mode){
    this.gameType  = mode;
    this.maxLives  = 200;
    this.initMoney = 1000;
    this.init();
  } // Ends Constructor

  // Helping future Steve prepare for resetting game per OnStartGame transition
  init(){
    this.curMoney  = this.initMoney;
    this.curLives  = this.maxLives;

    this.numUnits  = 0;
    this.numKills  = 0;
    this.numTowers = 0;

    this.reqUnit = null;
    this.reqBldg = null;

    this.modeDeltaFr = -1;  
    this.gameMode    = GameManager.MODES.IDLE;  
  };

  getCurLives(){return this.curLives;}
  getCurMoney(){return this.curMoney;} 
  getNumUnits(){return this.numUnits;}
  getNumKills(){return this.numKills;}
  getNumTowers(){return this.numTowers;}

  canAfford(thing){
    let cost = (WeaponType[thing]) ? WeaponType[thing][0] : 999999;
    return this.curMoney>=cost;
  }

  gameModeToString(){
    let prefx = "Game Mode: "; // ➞ keeping this cool char
    switch(this.gameMode){
      case GameManager.MODES.IDLE:     return prefx+"Idle";
      case GameManager.MODES.PLACE_BLDG: return prefx+"Place Tower";
      case GameManager.MODES.PLACE_UNIT: return prefx+"Place Enemy";
      default: return "UNEXPECTED ERROR: Game mode value ["+this.gameMode+"] INVALID!"; 
    }
  }

  OnEnemyCreated(){this.numUnits++;}

  OnTowerCreated(type){this.numTowers++;this.curMoney-=WeaponType[type][0];}

  OnEnemyKilled(type){this.numKills++;this.numUnits--;if(UnitType[type]){this.curMoney+=UnitType[type][4];}}
  OnEnemyExited(){this.curLives--;if(this.curLives<0){this.curLives=0;}}

  onMousePressed(){

    if(this.gameMode == GameManager.MODES.PLACE_BLDG && frameCount > this.modeDeltaFr){
      let res = this.createTowerAt(map.posToCoord(mousePtToVec()));
      if(res==true || mouseInSidebar()){this.gameMode = GameManager.MODES.IDLE;}
    }

    else if(this.gameMode == GameManager.MODES.PLACE_UNIT && frameCount > this.modeDeltaFr){
      let res = this.createUnitAt(map.posToCoord(mousePtToVec()));
      if(res==true || mouseInSidebar()){this.gameMode = GameManager.MODES.IDLE;}
    }

    else if(this.gameMode == GameManager.MODES.IDLE){

      // When the player clicks on a tower, they toggle showing the range circle
      let mCell = map.posToCoord(mousePtToVec());
      for(let i=0; i<bldgs.length; i++){
        if(bldgs[i].weap&&mCell[0]==bldgs[i].cell[0]&&mCell[1]==bldgs[i].cell[1]){
          bldgs[i].toggleShowRange(); return;
        }
      }
    }
  }



  // ASSIGNS TO GLOBALS! And also a QAD last-minute addition
  update(){
    if(this.gameType==GameType.REGULAR){
      if(this.curLives==0){gameLost = true;}
      if(this.numUnits==0 && waveManage.noMoreWaves()){gameWon = true;}
    }
  }


  handlePlaceBuilding(request){
    if(mouseInSidebar()){
      this.gameMode = GameManager.MODES.PLACE_BLDG;
      this.modeDeltaFr = frameCount;
      this.reqBldg = request;
    } 
  }

  handlePlaceUnit(request){
    if(mouseInSidebar()){
      this.gameMode = GameManager.MODES.PLACE_UNIT;
      this.modeDeltaFr = frameCount;
      this.reqUnit = request;
    } 
  }

  /*----------------------------------------------------------------------
  |>>> Function handleSpawnUnit
  +-----------------------------------------------------------------------
  | Description: Handles a user-clicked button <xor> wave script's request
  |              to spawn one or more of a particular unit.
  | Impl't Note: As with 'createUnit' -  will NOT utilize 'this.reqUnit'.
  +---------------------------------------------------------------------*/ 
  handleSpawnUnit(request, numRequested=1){
    spawnPool.reqSpawn(request,numRequested);
  } // Ends Function handleSpawnUnit

  /*--------------------------------------------------------------------
  |>>> Function createUnit
  +---------------------------------------------------------------------
  | Description: Creates unit specified by the input at the map's first 
  |              enemy path waypoint (i.e. ready to do it's thing).
  | Impl't Note: Rewritten to work with SpawnManager and its obj. pool,
  |              as well as the UnitManager and it's object pool.
  +-------------------------------------------------------------------*/
  createUnit(type){
    let result = unitPool.reqUnit(type, map.entCoord[0], map.entCoord[1]);
    if(result != null){this.OnEnemyCreated();}
  } // Ends Function createUnit

  createUnitAt(cell){
    if (!map.isEnemyPathCell(cell[0],cell[1])){return false;}
    
    let result = unitPool.reqUnit(type, cell[0], cell[1]);
    
    if(result == null){return false;}

    result.curWaypt = map.getWayPtClosestTo(result.pos);
    this.reqUnit    = null; 
    this.OnEnemyCreated();
    return true;
  } // Ends Function createUnitAt


  createTowerAt(cell){
    let row = cell[0];
    let col = cell[1];
    let twr = null;
    let pos;

    if (!map.isVacant(row,col)){return false;}
    pos = map.coordToPos(row,col);
    twr = new Tower(pos,cell,map).setWeapon( (this.reqBldg) ? this.reqBldg : "LaserBlaster");
    map.setToFilled(row,col);
    bldgs.push(twr);
    this.OnTowerCreated(this.reqBldg);
    this.reqBldg = null;
    return true;
  } // Ends Function createTower

} // Ends Class GameManager
