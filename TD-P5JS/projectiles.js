/*----------------------------------------------------------------------
|>>> Class ProjectileManager
+-----------------------------------------------------------------------
| Description: [QAD] Implements Object Pooling for all of the Bullet and
|              Missile Projectiles fired by weapons; as well as managing
|              their routine per-frame update and render calls.
+---------------------------------------------------------------------*/
class ProjectileManager{
  constructor(initSize=256){
    this.poolCap = initSize; // *pool* *cap*acity
    this.bullPool = [];
    this.missPool = [];
    this.initBullPool();
    //this.initMissPool();
  } // Ends Constructor

  // Might be expensive - use sparingly (thankfully user never needs it)
  bulletPoolPopToString(){
    let pop = 0;
    this.bullPool.forEach(b => {pop += (b.canRecycle()) ? 0 : 1});
    let pct = floor((pop/this.poolCap)*100);
    return "Bullet Pool Use: "+(pct)+"% ["+pop+"/"+this.poolCap+"]";
  } // End Function bulletPoolPopToString

  initBullPool(){
    for(let i=0; i<this.poolCap; i++){
      this.bullPool.push(new Bullet());
    }
  } // End Function initBullPool

  reqBullet(launchPos,target){
    for(let i=0; i<this.poolCap; i++){
      if(this.bullPool[i].canRecycle()){
        this.bullPool[i].init(launchPos,target);
        return;
      }
    }
    console.log("WARNING - No unused entries available!");   
  } // End Function reqBullet

  update(){this.updateBullets(); /*this.updateMissiles()*/;}
  render(){this.renderBullets(); /*this.renderMissiles()*/;}

  updateBullets(){this.bullPool.forEach(b => {if(b.inUse){b.update();}});}
  renderBullets(){this.bullPool.forEach(b => {if(b.inUse){b.render();}});}

  //updateMissiles(){this.missPool.forEach(m => { if(m.inUse){m.update();}});}
  //renderMissiles(){this.missPool.forEach(m => { if(m.inUse){m.render();}});}

} // Ends Class ProjectileManager


/*----------------------------------------------------------------------
|>>> Class Projectile    (Abstract per Java context {i.e. no instances})
+-----------------------------------------------------------------------
| Description: [QAD] Implements parent class for the Bullet and Missile
|              classes (as best/simple as is possible in JavaScript WRT 
|              my understanding {i.e. likely a better way, but KISS})
+---------------------------------------------------------------------*/
class Projectile{
  constructor(pos,tar){
    this.pos; this.tar;
    this.arrivedAtTar   = false; // arrived at the target
    this.didImpactAnim  = false; // completed impact anim
    this.inUse = false; // SET FALSE if using object pool!
  } // Ends Constructor

  // Needs opcode because Bullet needs to use tar.pos AT-INIT <vs> AT-CURRENT-FRAME  
  tarDistSq(op=0){return p5.Vector.sub(this.pos, (op==0) ? this.tar.pos : this.goalPos).magSq();}
  // Wrapper for Bullet to use tarDistSq via this.goalPos <vs> this.tar.pos
  goalPtDistSq(){return this.tarDistSq(1);}
}


/*----------------------------------------------------------------------
|>>> Class Bullet
+-----------------------------------------------------------------------
| Description: [QAD] Implements Bullet Projectile type, 'Nuff Said.
+---------------------------------------------------------------------*/
class Bullet extends Projectile{
  constructor(pos,tar){
    super(pos,tar);
    this.speed = 32;
    this.dam   = 6;

    this.impactAnimLen = 32;

    this.colMapL = color(240,240,0);
    this.colMapR = color(144,96,0,64);

    //this.init(pos,tar); // COMMENT OUT when using object pool!
  } // Ends Constructor

  /*--------------------------------------------------------------------
  |>>> Function init
  +---------------------------------------------------------------------
  | Description: Used to initialize (AKA reset) all of the per-use state 
  |              of a Bullet projectile, as object pooling will be used.
  | Input Vars:  - launchPos: [p5.Vector] wherefrom this Bullet launched
  |              - target:    [Unit] target that this Bullet will impact 
  +-------------------------------------------------------------------*/
  init(launchPos,target){
    this.inUse = true;

    this.pos = launchPos;
    this.tar = target;
    this.ori = p5.Vector.sub(this.tar.pos,this.pos).normalize();
    this.vel = this.ori.copy().setMag(this.speed);

    this.theta    = this.ori.heading()+PI; // radian val to rotate bulllet at target
    this.goalPos  = this.getGoalPos();
    this.goalDist = this.pos.dist(this.goalPos); // total distance bullet will travel
    this.impactFr = frameCount+(this.goalDist/this.speed); // frame bullet hits target (thx Isaac Newton!)

    this.arrivedAtTar  = false;
    this.didImpactAnim = false;
    this.impactAnimFrm = 0;
  } // Ends Function init

  /*--------------------------------------------------------------------
  |>>> Function getGoalPos
  +---------------------------------------------------------------------
  | Implementation Notes: 
  |  > Supports 'frame lookahead' wherein the target's future prediction
  |    is estimated via multiplying its current velocity by [x] frames;
  |    similar to the 'Pursue' steering agent behavior <vs> the more 
  |    basic 'Flee' (likewise analogous to the non-lookahead option).
  |  > aheadFr => Number of frames to lookahead. The default (i.e. input
  |    parameterless call) option is [0] (zero); implying NO lookahead.
  +-------------------------------------------------------------------*/
  getGoalPos(aheadFr=0){
    let tarPos = this.tar.pos.copy();
    return (aheadFr == 0) ? tarPos : p5.Vector.add(tarPos,p5.Vector.mult(this.tar.vel,aheadFr));
  } // Ends Function getGoalPos

  /*--------------------------------------------------------------------
  |>>> Function canRecycle
  +---------------------------------------------------------------------
  | Description: Used by projectile object pool to check if this Bullet
  |              is not or no-longer being used; as to then be recycled
  |              for a new request. Returns negation of 'inUse' because:
  |                > (!true == false) i.e. 'do not recycle this yet!'
  |                > (!false == true) i.e. 'no longer in use, go ahead!'
  +-------------------------------------------------------------------*/
  canRecycle(){
    return !this.inUse;
  } // Ends Function canRecycle

  update(){
    if(!this.arrivedAtTar){
      this.pos.add(this.vel);
      if(this.impactFr<=frameCount){this.onHitTarget();}
    }
    else if(this.didImpactAnim){
      this.inUse = false;
    }
  } // Ends Function update

  onHitTarget(){
    this.pos = this.goalPos;
    this.arrivedAtTar = true;
    this.tar.onBulletHit(this.pos,this.dam);    
  } // Ends Function onHitTarget

  render(){
    if(!this.arrivedAtTar){this.renderBullet();}
    else if(!this.didImpactAnim){this.renderImpactAnim();}
  } // Ends Function render
  
  renderBullet(){
    strokeWeight(1);stroke(60,128);
    push();
      translate(this.pos.x,this.pos.y); rotate(this.theta);
      fill(216,180,0);ellipse(0,0,12,6);
      fill(60);rect(0,0-3,6,6);
    pop(); 
  } // Ends Function renderBullet

  renderImpactAnim(){
    let animPct = this.impactAnimFrm/this.impactAnimLen;
    let ellipseRad = lerp(4,64,animPct);
    let strkWeight = (animPct <= 50) ? lerp(1,6,animPct*2) : lerp(6,1,(animPct-0.5)*2);
    stroke(60,128);
    fill(lerpColor(this.colMapL, this.colMapR, animPct));
    ellipse(this.pos.x,this.pos.y,ellipseRad,ellipseRad);
    this.impactAnimFrm++;
    if(this.impactAnimFrm>this.impactAnimLen){this.didImpactAnim=true;}
  } // Ends Function renderImpactAnim

} // Ends Class Bullet