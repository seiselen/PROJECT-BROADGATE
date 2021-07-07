/*======================================================================
|>>> GAME MANAGER
+=======================================================================
| Description: Contains code used to manage creation of units and towers
|              (via both user and scripted requests), state/scorekeeping
|              (i.e. #kills, #player_lives, #player_money), sending in
|              waves of enemy units (i.e. vis-a-vis the level's script),
|              and Win/Lose condition (i.e. {lives==0}->{OnGameLose()},
|              {wave==nWaves}&&{enemies==0}&&{lives>0}->{OnLevelWin()}
*=====================================================================*/


class GameManager{
  static MODES = {IDLE:0, PLACE_BLDG:1, PLACE_UNIT:2};
  constructor(){
    this.numUnits  = 0; // i.e. # enemy units
    this.numKills  = 0; // i.e. # enemy units killed by towers [player]
    this.numTowers = 0; // i.e. # towers in world in current level/game

    this.gameMode  = GameManager.MODES.IDLE;


    this.reqUnit;
    this.reqBldg;

    this.frameModeChanged = -1;

  }

  getNumUnits(){return this.numUnits;}
  getNumKills(){return this.numKills;}
  getNumTowers(){return this.numTowers;}

  gameModeToString(){
    let prefx = "Game Mode ➞ ";
    switch(this.gameMode){
      case GameManager.MODES.IDLE:     return prefx+"Idle";
      case GameManager.MODES.PLACE_BLDG: return prefx+"Place Tower";
      case GameManager.MODES.PLACE_UNIT: return prefx+"Place Enemy";
      default: return "UNEXPECTED ERROR: Game mode value ["+this.gameMode+"] INVALID!"; 
    }
  }

  OnEnemyKilled(){this.numKills++;}
  OnEnemyCreated(){this.numUnits++;}
  OnTowerCreated(){this.numTowers++;}



  onMousePressed(){

    if(this.gameMode == GameManager.MODES.PLACE_BLDG && frameCount > this.frameModeChanged){
      let res = this.createTowerAt(map.posToCoord(mousePtToVec()));
      if(res==true || mouseInSidebar()){this.gameMode = GameManager.MODES.IDLE;}
    }

    if(this.gameMode == GameManager.MODES.PLACE_UNIT && frameCount > this.frameModeChanged){
      let res = this.createUnitAt(map.posToCoord(mousePtToVec()));
      if(res==true || mouseInSidebar()){this.gameMode = GameManager.MODES.IDLE;}
    }


  }



  handlePlaceBuilding(request){
    if(mouseInSidebar()){
      this.gameMode = GameManager.MODES.PLACE_BLDG;
      this.frameModeChanged = frameCount;
      this.reqBldg = request;
    } 
  }

  handlePlaceUnit(request){
    if(mouseInSidebar()){
      this.gameMode = GameManager.MODES.PLACE_UNIT;
      this.frameModeChanged = frameCount;
      this.reqUnit = request;
    } 
  }

  handleSpawnUnit(request, numRequested=1){
    this.reqUnit = request;
    if(numRequested == 1){this.createUnitAt(map.entCoord);}
    else{for(let i=0; i<numRequested; i++){this.createUnitAt(map.entCoord);}}
  } // Ends Function handleSpawnUnit

  createUnit(){
    let u = new Unit(map.entCoord[0], map.entCoord[1], units.length, map)
    .setType(this.reqUnit)
    .givePath(map.walkPath);

    units.push(u);
    this.OnEnemyCreated();
    this.reqUnit = null;
    return true;
  } // Ends Function createUnit

  createUnitAt(cell){

    let row = cell[0];
    let col = cell[1];

    if (!map.isEnemyPathCell(row,col)){return false;}

    let u = new Unit(row, col, units.length, map)
    .setType(this.reqUnit)
    .givePath(map.walkPath);

    u.curWaypt = map.getWayPtClosestTo(u.pos);

    units.push(u);
    this.OnEnemyCreated();
    this.reqUnit = null;
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
    this.OnTowerCreated();
    return true;
  } // Ends Function createTower


  // Here until I utilize UIObjects placed in the side panel with the others
  QADShowGameStats(){this.QADshowKillCount(); this.QADshowEnemyCount(); this.QADshowTowerCount();}
  QADshowKillCount(){fill(0);noStroke();rect(256,0,256,64);fill(255);textSize(24);textAlign(LEFT,CENTER);text("# Enemies Killed: "+this.numKills, 256,32);}
  QADshowEnemyCount(){fill(0);noStroke();rect(512,0,256,64);fill(255);textSize(24);textAlign(LEFT,CENTER);text("# Enemies On Map: "+this.numUnits, 512,32);}
  QADshowTowerCount(){fill(0);noStroke();rect(768,0,256,64);fill(255);textSize(24);textAlign(LEFT,CENTER);text("# Towers On Map: "+this.numTowers, 768,32);}

} // Ends Class GameManager
