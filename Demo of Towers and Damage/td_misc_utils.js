


//----------------------------------------------------------------------
//>>> SCORE KEEP AND DISPLAY METHODS (Q.A.D. PENDING MANAGER AND UI)
//----------------------------------------------------------------------
var numKills   = 0;
var numEnemies = 0; // # instantiated, NOT necessarily # alive
var numTowers  = 0;

function OnEnemyKilled(){numKills++;}
function OnEnemyCreated(){numEnemies++;}
function OnTowerCreated(){numTowers++;}

function QADshowKillCount(){
  fill(0); noStroke();
  rect(width-256,0,256,64);
  fill(255);textSize(24);textAlign(LEFT,CENTER);
  text("> Enemies Killed: "+numKills, width-256,32);
}

function QADshowEnemyCount(){
  fill(0); noStroke();
  rect(width-512,0,256,64);
  fill(255);textSize(24);textAlign(LEFT,CENTER);
  text("> Enemies On Map: "+numEnemies, width-512,32);
}

function QADshowTowerCount(){
  fill(0); noStroke();
  rect(width-768,0,256,64);
  fill(255);textSize(24);textAlign(LEFT,CENTER);
  text("> Towers On Map: "+numTowers, width-768,32);
}

//----------------------------------------------------------------------
//>>> AGENT AND TOWER CREATION METHODS (Q.A.D. PENDING FACTORY OBJ)
//----------------------------------------------------------------------

function createAgent(randomLen = false){
  let agt = new TDAgent(map.entCoord[0], map.entCoord[1], agents.length);
  if(randomLen){agt.setBodyLenRand(16,32);}
  agt.givePath(map.mapPath);
  agents.push(agt);
  OnEnemyCreated();
} // Ends Function createAgent

function createTowerFirstEmptyCell(){
  let cell = map.findVacantCell();
  console.log(cell);
  if(cell==null){return;}
  createTower(cell);
}

function createTower(cell){
  let twr = null;
  let pos;

  if (!map.isValidVacantCell(cell)){return null;}
  pos = map.coordToPos(cell);
  twr = new TDTower(pos,cell);
  map.setToFilled(cell);
  towers.push(twr);
  OnTowerCreated();
}



//----------------------------------------------------------------------
//>>> [IM]PORTED CODE FROM GEAR-GEN[ERATOR] DEMO
//----------------------------------------------------------------------
function createNgon(pos, rad, nSides, rotOff){
  var degPerPt = 360/nSides;
  var curDeg   = 0;
  var verts    = [];

  for (var i=0; i<nSides; i++) {
    verts.push(this.degRadToCoord(pos,rad,curDeg,rotOff));
    curDeg += degPerPt;
  }
  return verts;
}

function degRadToCoord(pos, rad, deg, degOff = 270){
  return createVector(
    rad*cos(radians(degOff+deg)),
    rad*sin(radians(degOff+deg))
  );
}