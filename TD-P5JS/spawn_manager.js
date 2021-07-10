/*======================================================================
|>>> 'Config Object' SpawnDelay
+-----------------------------------------------------------------------
| Description:  Config settings for how to handle spawning delays, both:
|                > *Unit-By-Unit* i.e. wait [u] frames between spawning 
|                  each [STD-3] enemy of a group thereof requested); and
|                > *Wave-By-Wave* i.e. if the current wave encompasses
|                  spawning [x] [STD-3] units, wait [w] frames based on
|                  [x,STD-3] before starting the next wave. One use-case
|                  for this is giving more time for [sub]boss waves.
| Special Note: Keeping as a standalone global var; though could install
|               within SpawnRequest or even GameManager. KISS for now...
+=====================================================================*/
var SpawnDelay = {
  unit: {
    STD_1: 16, 
    STD_2: 20, 
    STD_3: 24, 
    STD_4: 32, 
    STD_5: 48, 
    STD_6: 60, 
    STD_7: 120, 
    STD_8: 240
  },
  wave: function(type,num){return SpawnDelay.unit[type]*num;} // naive for now
} // Ends Object SpawnDelay

/*----------------------------------------------------------------------
|>>> class SpawnRequest
+-----------------------------------------------------------------------
| Description: Encompasses a request (made by either the player {via UI} 
|              and/or an enemy wave script WLOG) to produce some number
|              of some type of unit. Because there should be some delay
|              between spawning more than one unit, and as such implies
|              that waves can overlap each other (especially those that
|              were ordered by the player): such requests will need to:
|                > Persist with some state until all units therein have 
|                  been spawned (ergo the request satisfied);
|                > Execute 'concurrently' with other active requests (in
|                  terms of all such requests being serviced per-frame)
|              Thus: this class is written to support object pooling; as
|              an object pool will be utilized as per Projectiles.
+---------------------------------------------------------------------*/
class SpawnRequest{
  // Yeah, I know: declaration is 'not really needed' in JavaScript; but
  // somewhere: Uncle Bob (of Clean Code) is watching... and judging :-)
  constructor(){
    this.unitReq    = null;
    this.numReq     = -1;
    this.numMade    = 0;   
    this.expired    = true; 
    this.frameDelay = -1;
    this.frameStart = -1;
    this.frameDone  = -1;
  } // Ends Constructor

  init(what,howMany){
    this.unitReq    = what;
    this.numReq     = howMany;
    this.numMade    = 0;   
    this.expired    = false; 
    this.frameDelay = SpawnDelay.unit[this.unitReq];
    this.frameStart = frameCount;
    this.frameDone  = SpawnDelay.wave[this.unitReq,this.numReq];
  } // Ends Function init

  // Sure: having both are redundant, but keeping with other pools' conventions
  inUse()     {return !this.expired;}
  canRecycle(){return this.expired;}

  update(){
    if(this.expired){return;}
    if((frameCount-this.frameStart)%this.frameDelay==0){this.numMade++;manager.createUnit(this.unitReq);}
    if(this.numMade == this.numReq){this.expired = true;}
  } // Ends Function update | snippet: console.log("spawning: ["+this.unitReq+"] "+this.numMade+" of "+this.numReq)
} // Ends Class SpawnRequest

/*----------------------------------------------------------------------
|>>> Class SpawnManager
+-----------------------------------------------------------------------
| Description: [QAD] Implements Object Pooling for all Spawn Requests,
|              and manages their routine per-frame update calls.
| Func. Note:  poolPopToString is identical to that of the same name in
|              the analogous 'ProjectileManager', so see its comment box
|              if more info happens to be desired (though why? lol)
| Var. Note:   Per usual, 'poolCap' => *pool* *cap*acity
+---------------------------------------------------------------------*/
class SpawnManager{
  // Note: Using a size of 128 as the demand seems much less than with the Projectiles
  constructor(initSize=128){this.poolCap=initSize; this.pool=[]; this.initPool();}

  initPool(){for(let i=0; i<this.poolCap; i++){this.pool.push(new SpawnRequest());}}

  poolPopToString(){
    let pop = 0; this.pool.forEach(r => {pop += (r.canRecycle()) ? 0 : 1});
    return "Spwn Pool Use: "+floor((pop/this.poolCap)*100)+"% ["+pop+"/"+this.poolCap+"]";
  } // Ends Function poolPopToString

  reqSpawn(what,howMany){
    for(let i=0; i<this.poolCap; i++){if(this.pool[i].canRecycle()){this.pool[i].init(what,howMany); return;}}
    console.log("WARNING - No unused entries available!");   
  } // End Function reqSpawn

  update(){this.pool.forEach(r => {if(r.inUse()){r.update();}});}
} // Ends Class SpawnManager