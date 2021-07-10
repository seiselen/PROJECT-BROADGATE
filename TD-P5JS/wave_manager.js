class WaveManager{
  constructor(waveSchedule){
    this.schedule   = waveSchedule;
    this.totalWaves = waveSchedule.length;
    this.curWave    = 0;
  }
  reqU(){return this.schedule[this.curWave][0];} // *req*uested *u*nit type
  reqN(){return this.schedule[this.curWave][1];} // *req*uested *n*umber of units
  sendNextWave(){if(this.curWave < this.totalWaves){spawnPool.reqSpawn(this.reqU(),this.reqN());this.curWave++;}}
  toBlurb(){return "Current Wave: "+this.curWave+"/"+this.totalWaves;}
} // Ends Class WaveManager