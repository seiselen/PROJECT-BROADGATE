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
    this.initMissPool();
  } // Ends Constructor


  /*--------------------------------------------------------------------
  |>>> Functions getPoolPop getPoolPct / poolPopToString
  +---------------------------------------------------------------------
  | Description: Prints out message indicating pool use for one of the
  |              two projectile pools; informing of both usage percent 
  |              and the ratio thereto, i.e. (in-use/capacity).
  | Functions:   > poolPopToString: prints one of the two pools based
  |                on the opcode; whereby {0->bullet, 1->missile}. This
  |                is a generic replacement of the two below functions 
  |                (and 'initUI()' does call it <vs> the other two), but
  |                keeping them in the code just-in-case (JIC).
  |              > bullPoolPopToString, missPoolPopToString: prints info
  |                \foreach of the two pools, respectively. Replaced by
  |                'poolPopToString' as a generic function as their code
  |                is identical sans the obvious, but keeping JIC.
  | Usage Note:  All of these methods might be CPU 'expensive', though I
  |              think only as a small factor to the otherwise per-frame
  |              operations. Still...use these only as needed for debug!
  | Input Parm:  op => 'opcode' [1] indicating the pool to provide info
  |                    for; whereby {0 -> bullet} and {1 -> missile}
  +-------------------------------------------------------------------*/
  getPoolPop(op){
    let pool = (op==0) ? this.bullPool : this.missPool;    
    let pop = 0; pool.forEach(r => {pop += (r.canRecycle()) ? 0 : 1}); return pop;
  }

  getPoolPct(op){return floor((this.getPoolPop(op)/this.poolCap)*100);}

  poolPctToString(op){return ((op==0) ? "Bull" : "Miss") + " Pool: "+nf(this.getPoolPct(op),2)+"%";}

  // Commented out below is a new version based on getPop/getPct as used with unit pool. Keeping un-commented version as it ain't broken!
  // poolPopToString(op){return "Unit Pool Use: "+this.getPoolPct(op)+"% ["+this.getPoolPop(op)+"/"+this.poolCap+"]";}
  poolPopToString(op=0){
    let pop  = 0;
    let pool = (op==0) ? this.bullPool : this.missPool;
    let prfx = (op==0) ? "Bull" : "Miss";
    pool.forEach(i => {pop += (i.canRecycle()) ? 0 : 1});
    let pct  = floor((pop/this.poolCap)*100);
    return prfx+" Pool Use: "+(pct)+"% ["+pop+"/"+this.poolCap+"]";
  } // Ends Function poolPopToString

  bullPoolPopToString(){
    let pop = 0;
    this.bullPool.forEach(b => {pop += (b.canRecycle()) ? 0 : 1});
    let pct = floor((pop/this.poolCap)*100);
    return "Bullet Pool Use: "+(pct)+"% ["+pop+"/"+this.poolCap+"]";
  } // Ends Function bullPoolPopToString

  missPoolPopToString(){
    let pop = 0;
    this.missPool.forEach(m => {pop += (m.canRecycle()) ? 0 : 1});
    let pct = floor((pop/this.poolCap)*100);
    return "Missile Pool Use: "+(pct)+"% ["+pop+"/"+this.poolCap+"]";
  } // Ends Function missPoolPopToString

  initBullPool(){for(let i=0; i<this.poolCap; i++){this.bullPool.push(new Bullet());}}

  initMissPool(){for(let i=0; i<this.poolCap; i++){this.missPool.push(new Missile());}}

  reqBullet(launchPos,target){
    for(let i=0; i<this.poolCap; i++){
      if(this.bullPool[i].canRecycle()){
        this.bullPool[i].init(launchPos,target);
        return;
      }
    }
    console.log("WARNING - No unused Bullet entries available!");   
  } // End Function reqBullet

  reqMissile(launchPos,target){
    for(let i=0; i<this.poolCap; i++){
      if(this.missPool[i].canRecycle()){
        this.missPool[i].init(launchPos,target);
        return;
      }
    }
    console.log("WARNING - No unused Missile entries available!");   
  } // End Function reqBullet

  update(){this.updateBullets(); this.updateMissiles();}
  render(){this.renderBullets(); this.renderMissiles();}

  updateBullets(){this.bullPool.forEach(b => {if(b.inUse){b.update();}});}
  renderBullets(){this.bullPool.forEach(b => {if(b.inUse){b.render();}});}

  updateMissiles(){this.missPool.forEach(m => { if(m.inUse){m.update();}});}
  renderMissiles(){this.missPool.forEach(m => { if(m.inUse){m.render();}});}

} // Ends Class ProjectileManager


/*----------------------------------------------------------------------
|>>> Class Projectile    (Abstract per Java context {i.e. no instances})
+-----------------------------------------------------------------------
| Description: [QAD] Implements parent class for the Bullet and Missile
|              classes (as best/simple as is possible in JavaScript WRT 
|              my understanding {i.e. likely a better way, but KISS}).
| Add'l Note:  The parent class idea kinda did end up short/reduntant 
|              vis-a-vis JavaScript; but keeping to keep OOP convention,
|              and as it will make Uncle Bob (Clean Code) smile :-)
+---------------------------------------------------------------------*/
class Projectile{
  constructor(pos,tar){
    this.pos; this.tar;
    this.arrivedAtTar   = false; // arrived at the target
    this.didImpactAnim  = false; // completed impact anim
    this.inUse = false; // SET FALSE if using object pool!
  } // Ends Constructor
} // Ends Class Projectile


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


/*----------------------------------------------------------------------
|>>> Class Missile
+-----------------------------------------------------------------------
| Description: [QAD] Implements Bullet Projectile type, 'Nuff Said.
+---------------------------------------------------------------------*/
class Missile extends Projectile{
  constructor(pos,tar){
    super(pos,tar);
    this.speed = 8;
    this.force = 0.5;
    this.dam   = 6;

    this.minDistSq     = pow(4,2); // (x,2) => x^2 | x => pixel units
    this.impactAnimLen = 32;

    this.colMapL = color(240,240,0);
    this.colMapR = color(144,96,0,64);

    //this.init(pos,tar); // COMMENT OUT when using object pool!
  } // Ends Constructor

  /*--------------------------------------------------------------------
  |>>> Function init
  +---------------------------------------------------------------------
  | Description: Used to initialize (AKA reset) the per-use state of a
  |              Missile projectile, as object pooling will be used.
  | Input Vars:  - launchPos: [p5.Vector] wherefrom this was launched
  |              - target:    [Unit] target that this will impact 
  +-------------------------------------------------------------------*/
  init(launchPos,target){
    this.inUse = true;

    this.pos = launchPos;
    this.tar = target;
    this.ori = p5.Vector.sub(this.tar.pos,this.pos).normalize();
    this.vel = this.ori.copy().setMag(this.speed);

    this.numLifeFrames = 60;
    this.curLifeFrame  = 0;

    this.arrivedAtTar  = false;
    this.didImpactAnim = false;
    this.impactAnimFrm = 0;
  } // Ends Function init


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

  tarDistSq(){return p5.Vector.sub(this.pos, this.tar.pos).magSq();}

  update(){
    if(!this.tar.isAlive && !this.arrivedAtTar){
      this.vel.mult(0.85);
      if(this.vel.magSq()<0.01){this.arrivedAtTar = true; return;}
    }

    if(this.curLifeFrame >= this.numLifeFrames){
      this.arrivedAtTar = true; return;
    }

    if(!this.arrivedAtTar){
      this.vel.add(this.pursue());
      this.vel.limit(this.speed);
      this.pos.add(this.vel);

      if(this.tar.didMissileCollide(this.pos)){this.onHitTarget();}
    }
    
    if(this.didImpactAnim){
      console.log("hi");
      this.inUse = false;
    }
    this.curLifeFrame++;
  } // Ends Function update

  pursue(){
    let targetEst = createVector(this.tar.pos.x,this.tar.pos.y);
    targetEst.add(this.tar.vel);

    let des = p5.Vector.sub(targetEst,this.pos);
    des.setMag(this.speed);
    let steer = p5.Vector.sub(des,this.vel)
    steer.limit(this.force);
    return steer;
  }

  onHitTarget(){
    this.arrivedAtTar = true;
    this.tar.onMissileHit(this.pos,this.dam);    
  } // Ends Function onHitTarget

  render(){
    if(!this.arrivedAtTar){this.renderBullet();}
    else if(!this.didImpactAnim){this.renderImpactAnim();}
  } // Ends Function render
  
  renderBullet(){
    strokeWeight(1);stroke(60,128);
    push();
      translate(this.pos.x,this.pos.y); rotate(this.vel.heading()+PI);
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

} // Ends Class Missile