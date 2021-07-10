class WaveManager{
  constructor(waveSchedule){
    this.schedule   = waveSchedule;
    this.totalWaves = waveSchedule.length;
    this.curWave    = 0;
  }
  reqU(){return this.schedule[this.curWave][0];} // *req*uested *u*nit type
  reqN(){return this.schedule[this.curWave][1];} // *req*uested *n*umber of units
  sendNextWave(){if(this.curWave < this.totalWaves){spawnPool.reqSpawn(this.reqU(),this.reqN());this.curWave++;}}
  toBlurb(){return "Current Wave: "+this.progressToString();}
  progressToString(){return this.curWave+"/"+this.totalWaves;}
  nextwaveToString(){return (this.curWave>=this.totalWaves) ? "None. Done!" : this.schedItemToString(this.curWave);}
  schedItemToString(id){return this.schedule[id][1]+"x "+unitKeyToUIName(this.schedule[id][0]);}
} // Ends Class WaveManager