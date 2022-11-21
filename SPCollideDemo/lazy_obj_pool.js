const PoolEvent = {
  INSERT:'i', TOKILL:'k', KILLED:'r',
  toStr:(e)=>{switch(e){
    case PoolEvent.INSERT: return "Added To Pool"; 
    case PoolEvent.TOKILL: return "Added To Kill List"; 
    case PoolEvent.KILLED: return "Removed From Pool";
  }}
}

class LazyObjectPool{
  constructor(){
    this.pool    = new Map();
    this.toKill  = [];
    this.logEvts = false;
  }

  insert(thing){
    thing.poolRef = this;
    this.pool.set(thing.ID,thing);
    this.debugLog(thing.ID,PoolEvent.INSERT);
  }

  addToKillList(key){
    this.toKill.push(key);
    this.debugLog(key,PoolEvent.TOKILL);
  }

  pruneKillList(){
    if(this.toKill.length==0){return;}
    this.toKill.forEach(key=>{
      this.pool.delete(key);
      this.debugLog(key,PoolEvent.KILLED);
    })
    this.toKill.length=0; // IIRC: most efficient way to clear it
  }

  updateEntries(){
    this.pool.forEach((val)=>val.update());
  }

  lateUpdateEntries(){
    this.pool.forEach((val)=>val.lateUpdate());
  }

  renderEntries(){
    this.pool.forEach((val)=>val.render());
  }

  debugLog(k,e){
    if(!this.logEvts){return;}
    console.log(`Event Type: [${PoolEvent.toStr(e)}] | Object Key: [${k}]`)
  }
}