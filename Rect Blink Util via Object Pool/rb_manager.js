/*----------------------------------------------------------------------
|>>> Class RectBlinkerManager
+---------------------------------------------------------------------*/
class RectBlinkerManager{
  constructor(poolPop=32){
    this.pool = [];
    for(let i=0; i<poolPop; i++){this.pool.push(new BlinkInstance());}
    this.defStrobePer = 60; // default strobe period (60 'seems okay' thereto)
  }

  updatePool(){this.pool.forEach(p => p.update());} 
  renderPool(){this.pool.forEach(p => p.render());}

  request(pt_TL, pt_BR, nSecs){ 
    let nFrames = int(nSecs*60);   
    for (let i=0; i<this.pool.length; i++){
      if(this.pool[i].isExpired()){
        this.pool[i].reset(pt_TL, pt_BR, frameCount, frameCount+nFrames, this.defStrobePer);
        return;
      }
    } 
    println("Warning! Could not find stale entry, did you add too many requests too quickly?");
  }
} // Ends Class RectBlinkerManager


/*----------------------------------------------------------------------
|>>> Class BlinkInstance
+-----------------------------------------------------------------------
| QAD Variable Descriptions
|   Transform State >>>
|     > ptTL:    [T]op [L]eft corner point
|     > ptBR:    [B]ottom [R]ight corner point
|   Animation State >>>
|     > sFrame:  starting frame (i.e. when request start[s/ed])
|     > eFrame:  ending frame (i.e. when request expires)
|     > stbPer:  strobe period (i.e. speed of blink in-out)
|     > active:  request hasn't expired (i.e. currently animating it)
|   GFX State >>>
|     > stkAmt:  stroke weight (i.e. thickness) of rect line
|     > stkCol:  stroke color (as p5.Vector to get {r,g,b} easier)
|     > perOff:  cache variable used to support per-frame animation
+---------------------------------------------------------------------*/
class BlinkInstance{
  // Default values because constructor only used to init pool
  constructor(){
    this.pt_TL  = createVector(0,0);
    this.pt_BR  = createVector(0,0);
    this.sFrame = -1;
    this.eFrame = -1;
    this.stbPer = 1;
    this.active = false; 
    //>>> GFX State
    this.stkAmt = 2;
    this.stkCol = createVector(0,0,255);
    this.perOff = 0;
  }

  reset(ptTL, ptBR, sf, ef, sPer){
    this.pt_TL  = ptTL;
    this.pt_BR  = ptBR;
    this.sFrame = sf;
    this.eFrame = ef+(ef%sPer);
    this.stbPer = sPer;
    this.active = true;
    this.update();
  }

  update(){
    if(frameCount>=this.eFrame){this.active=false;}    
  }

  // Adds enough frames to requested period to complete full strobe animation (i.e. optional for better VFX)
  clampEF(ef, sPer){this.eFrame = ef+(ef%sPer);}

  setStokeColor(r,g,b){this.stkCol = createVector(r,g,b);}

  isActive(){return this.active;}
  isExpired(){return !this.isActive();}
  
  render(){
    if(this.active){
      this.perOff = sin((((frameCount-this.sFrame)%this.stbPer)/this.stbPer)*PI)*255;           
      noFill(); strokeWeight(this.stkAmt);
      stroke(this.stkCol.x, this.stkCol.y, this.stkCol.z, this.perOff);
      rect(this.pt_TL.x, this.pt_TL.y, this.pt_BR.x-this.pt_TL.x, this.pt_BR.y-this.pt_TL.y);  
    }
  }
} // Ends Class BlinkInstance