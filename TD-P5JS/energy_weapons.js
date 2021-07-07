/*======================================================================
|>>> Weapon Type : Laser Beam
+=====================================================================*/
class LaserBeam extends Weapon{
  constructor(owner){
    super(owner);

    //> Range and Damage Settings for this tower type
    this.weapRange  = this.owner.map.cellSize*2.5;
    this.baseDamage = 1;
    this.curDamage  = this.baseDamage;

    this.getCellsInRange(); // must be called here because needs weapRange assigned

    //> GFX/Viz Settings for this tower type
    this.turretL = 32;
    this.turretW = 16;
    this.turretLh = this.turretL/2;
    this.turretWh = this.turretW/2;
    this.turCol   = color(0,120,0);
    this.strCol   = color(60); 
    this.laserCol = color(0,255,255);
    this.lLerpCol = color(0,60,240);
  } // Ends Constructor

  update(){
    this.getTargetsInRange();
    this.curTarget = this.getClosestTarget();
  } // Ends Function update

  render(){
    this.renderRange();
    this.renderLaser();
    this.renderTurret();
  } // Ends Function render 

  renderTurret(){
    let turOri = (this.curTarget && this.curTarget.isAlive) 
      ? p5.Vector.sub(this.curTarget.pos,this.owner.pos) 
      : createVector(0,0);

    push();
      translate(this.owner.pos.x,this.owner.pos.y);rotate(turOri.heading());
      
      fill(this.turCol);stroke(this.strCol);strokeWeight(1);
      rect(-this.turretLh,-this.turretWh,this.turretL,this.turretW);

      strokeWeight(2);fill(lerpColor(this.laserCol,this.lLerpCol, noise(frameCount/10)));
      rect(6-this.turretLh,2-this.turretWh,this.turretL-12,this.turretW-4);
    pop();
  } // Ends Function renderTurret  

  renderLaser(tar){
    if(this.curTarget && this.curTarget.isAlive){
      stroke(this.laserCol); strokeWeight(random(1,4));
      line(this.owner.pos.x,this.owner.pos.y,this.curTarget.pos.x,this.curTarget.pos.y);
    }
  } // Ends Function renderLaser  

} // Ends Weapon Type LaserBeam




/*======================================================================
|>>> Weapon Type : Laser Beam Relay
+=====================================================================*/
class LaserBeamRelay extends Weapon{
  constructor(owner){
    super(owner);

    //> Range and Damage Settings for this tower type
    this.weapRange  = this.owner.map.cellSize*2.5;
    this.baseDamage = 2;
    this.curDamage  = this.baseDamage;

    //> Other variables for this weapon type
    this.curTargets = [null,null,null];
    this.targetSitu = 0; // {0,1,2,3}

    this.getCellsInRange(); // must be called here because needs weapRange assigned

    //> GFX/Viz Settings for this tower type
    this.turretL = 32;
    this.turretW = 36;
    this.turretLh = this.turretL/2;
    this.turretWh = this.turretW/2;
    this.turCol   = color(0,120,0);
    this.strCol   = color(60); 
    this.laserCol = color(0,255,255);
    this.lLerpCol = color(0,60,240);
  } // Ends Constructor

  update(){
    this.getTargetsInRange();
    this.curTargets = this.get3ClosestTargets();
    this.updateTargetSitu();
  } // Ends Function update



  /*--------------------------------------------------------------------
  |>>> Function updateTargetSitu (Update Target Situation)
  +---------------------------------------------------------------------
  | Description: Updates 'Target Situation', an value [0,3] that informs
  |              which behavior the Relay Beam should use based on the
  |              number of targets in range.
  +---------------------------------------------------------------------
  | Implementation Notes:
  |  > TargetSitu values: {0->none, 1->one, 2->two*one 3->three}, where:
  |    o [0] -> no targets, tower is idle
  |    o [1] -> only one target:  focus 100% damage upon it...ZZZZAPP!!!
  |    o [2] -> only two targets: 65% DAM upon 1st, 35% DAM upon 2nd
  |    o [3] -> three targets:    50% DAM on 1st, 30% on 2nd, 20% on 3rd
  |  > Expected this.curTargets vals -> consequent this.targetSitu val:
  |      {null|null|null} -> [0]  |  {tar1,tar1,tar1} -> [1]
  |      {tar1,tar1,tar2} -> [2]  |  {tar1,tar2,tar3} -> [3]
  |  > OPTIMIZATION NOTE: Could utilize nested ternary if future issues
  |    with performance/FPS; but leaving as 'if/if/if' for now via KISS
  +-------------------------------------------------------------------*/
  updateTargetSitu(){
    let ct = this.curTargets;
    if(this.curTargets[0]==null)              {this.targetSitu = 0; return;}
    if(this.curTargets[0]==this.curTargets[2]){this.targetSitu = 1; return;}
    if(this.curTargets[0]==this.curTargets[1]){this.targetSitu = 2; return;}
                                               this.targetSitu = 3;
  } // Ends Function updateTargetSitu

  attack(){
    switch(this.targetSitu){
      case 1: 
        if(this.curTargets[0].isAlive){this.curTargets[0].applyDamage(this.curDamage);} break;
      case 2:
        if(this.curTargets[0].isAlive){this.curTargets[0].applyDamage(this.curDamage*.65);}
        if(this.curTargets[2].isAlive){this.curTargets[2].applyDamage(this.curDamage*.35);} break;
      case 3:
        if(this.curTargets[0].isAlive){this.curTargets[0].applyDamage(this.curDamage*.5);}
        if(this.curTargets[1].isAlive){this.curTargets[1].applyDamage(this.curDamage*.3);}
        if(this.curTargets[2].isAlive){this.curTargets[2].applyDamage(this.curDamage*.2);} break;
    } // Ends Switch
  } // Ends Function attack

  render(){
    this.renderRange();
    this.renderLaser();
    this.renderTurret();
  } // Ends Function render 

  renderTurret(){
    let turOri = (this.curTargets[0] && this.curTargets[0].isAlive) 
      ? p5.Vector.sub(this.curTargets[0].pos,this.owner.pos) 
      : createVector(0,0);

    push();
      translate(this.owner.pos.x,this.owner.pos.y);rotate(turOri.heading());
      
      fill(this.turCol);stroke(this.strCol);strokeWeight(1);
      rect(-this.turretLh,-this.turretWh,this.turretL,this.turretW);

      strokeWeight(2);fill(lerpColor(this.laserCol,this.lLerpCol, noise(frameCount/10)));
      rect(6-this.turretLh,8-this.turretWh,this.turretL-12,this.turretW-16);
    pop();
  } // Ends Function renderTurret  

  renderLaser(tar){
    switch(this.targetSitu){
      case 1: 
        if(this.curTargets[0].isAlive){
          this.laserCol.setAlpha(255); stroke(this.laserCol); strokeWeight(random(3,6)); 
          line(this.owner.pos.x,this.owner.pos.y,this.curTargets[0].pos.x,this.curTargets[0].pos.y);
        }
      break;

      case 2: 
        if(this.curTargets[0].isAlive){
          this.laserCol.setAlpha(168); stroke(this.laserCol); strokeWeight(random(3,5)); 
          line(this.owner.pos.x,this.owner.pos.y,this.curTargets[0].pos.x,this.curTargets[0].pos.y);
        }
        if(this.curTargets[2].isAlive){
          this.laserCol.setAlpha(96); stroke(this.laserCol); strokeWeight(random(2,5)); 
          line(this.curTargets[0].pos.x,this.curTargets[0].pos.y,this.curTargets[2].pos.x,this.curTargets[2].pos.y);
        }
      break;

      case 3: 
        if(this.curTargets[0].isAlive){
          this.laserCol.setAlpha(168); stroke(this.laserCol); strokeWeight(random(3,5)); 
          line(this.owner.pos.x,this.owner.pos.y,this.curTargets[0].pos.x,this.curTargets[0].pos.y);
        }
        if(this.curTargets[1].isAlive){
          this.laserCol.setAlpha(96); stroke(this.laserCol); strokeWeight(random(2,5)); 
          line(this.curTargets[0].pos.x,this.curTargets[0].pos.y,this.curTargets[1].pos.x,this.curTargets[1].pos.y);
        }
        if(this.curTargets[2].isAlive){
          this.laserCol.setAlpha(64); stroke(this.laserCol); strokeWeight(random(1,4)); 
          line(this.curTargets[1].pos.x,this.curTargets[1].pos.y,this.curTargets[2].pos.x,this.curTargets[2].pos.y);
        }     
      break;          
    } // Ends Switch
  } // Ends Function renderLaser
} // Ends Weapon Type LaserBeamRelay


/*======================================================================
|>>> Weapon Type : Laser Blaster
+=====================================================================*/
class LaserBlaster extends Weapon{
  constructor(owner){
    super(owner);

    //> Range and Damage settings for this weapon type
    this.weapRange  = this.owner.map.cellSize*2.5;
    this.baseDamage = 2;
    this.curDamage  = this.baseDamage;

    this.getCellsInRange(); // must be called here because needs weapRange assigned

    //> Behavior settings for this weapon type
    this.idle       = true;
    this.atkFrmSpan  = 12;   // attack frame span, s.t. next shot is delayed by (atkFrmSpan-atkFrmDelta)
    this.atkFrmDelta = 3;    // length of attack, see atkFrmSpan comment above for how it works therewith
    this.atkFrmStart = 0;    // frame/60 when not idle, used to start fire loop 'OnStartAttack'
    
    //> GFX/Viz Settings for this tower type
    this.turretL = 32;
    this.turretW = 8;
    this.turretLh = this.turretL/2;
    this.turretWh = this.turretW/2;
    this.turCol   = color(0,120,0);
    this.strCol   = color(60); 
    this.laserCol = color(0,255,255);
    this.lLerpCol = color(0,60,240);
  } // Ends Constructor

  canFire(){
    return ((frameCount-this.atkFrmStart)%this.atkFrmSpan) <= this.atkFrmDelta;
  }

  update(){
    this.getTargetsInRange();
    this.curTarget = this.getClosestTarget();
  } // Ends Function update

  //> OPTM-AREA: Use Switches and/or Ternarys if frame rates start dropping?
  attack(){
    if(this.curTarget && this.curTarget.isAlive){
      if(this.idle == true){this.atkFrmStart=(frameCount%this.atkFrmSpan); this.idle=false;}
      if(this.canFire()){this.curTarget.applyDamage(this.curDamage);}
    }
    else {
      this.idle = true;
    }
  } // Ends Function attack

  render(){
    this.renderRange();
    this.renderLaser();
    this.renderTurret();
    this.renderTowerCap();
  } // Ends Function render 

  renderTurret(){
    let turOri = (this.curTarget && this.curTarget.isAlive) 
      ? p5.Vector.sub(this.curTarget.pos,this.owner.pos) 
      : createVector(0,0);

    fill(this.turCol);stroke(this.strCol);strokeWeight(1);
    push();
      translate(this.owner.pos.x,this.owner.pos.y);
      rotate(turOri.heading());
      rect(-this.turretLh,-this.turretWh,this.turretL,this.turretW);
    pop();
  } // Ends Function renderTurret  

  renderLaser(){
    if(this.curTarget && this.curTarget.isAlive && this.canFire()){
      stroke(this.laserCol); strokeWeight(2);
      line(this.owner.pos.x,this.owner.pos.y,this.curTarget.pos.x,this.curTarget.pos.y);
    }
  } // Ends Function renderLaser

  renderTowerCap(){
    strokeWeight(4);stroke(this.strCol);fill(lerpColor(this.laserCol,this.lLerpCol, noise(frameCount/10)));
    let capRad = 16;
    ellipse(this.owner.pos.x,this.owner.pos.y,capRad,capRad);
  }

} // Ends Weapon Type LaserBlaster


/*======================================================================
|>>> Weapon Type : Dual Blaster
+-----------------------------------------------------------------------
| > Implementation Notes:
|    - Targeting: Will attack two closest targets. If there is only one
|      target in range: both blasters will attack; effectively turning
|      this into a more powerful Laser Blaster
+=====================================================================*/
class LaserBlasterDual extends Weapon{
  constructor(owner){
    super(owner);

    //> Range and Damage settings for this weapon type
    this.weapRange  = this.owner.map.cellSize*2.5;
    this.baseDamage = 2;
    this.curDamage  = this.baseDamage;

    this.getCellsInRange(); // must be called here because needs weapRange assigned

    //> Behavior settings for this weapon type
    this.curTargets  = [null,null];
    this.idle        = [true,true];
    this.atkFrmSpan  = 12;   // attack frame span, s.t. next shot is delayed by (atkFrmSpan-atkFrmDelta)
    this.atkFrmDelta = 3;    // length of attack, see atkFrmSpan comment above for how it works therewith
    this.atkFrmStart = [0,0];    // frame/60 when not idle, used to start fire loop 'OnStartAttack'
    
    //> GFX/Viz Settings for this tower type
    this.turretL = 32;
    this.turretW = 8;
    this.turretLh = this.turretL/2;
    this.turretWh = this.turretW/2;
    this.turCol   = color(0,120,0);
    this.strCol   = color(60); 
    this.laserCol = color(0,255,255);
    this.lLerpCol = color(0,60,240);
  } // Ends Constructor

  canFire(id){
    switch(id){
      case 0: return ((frameCount-this.atkFrmStart[0])%this.atkFrmSpan) <= this.atkFrmDelta;
      case 1: return ((frameCount-this.atkFrmStart[1])%this.atkFrmSpan) <= this.atkFrmDelta;
    }
  }

  update(){
    this.getTargetsInRange();
    this.curTargets = this.get2ClosestTargets();
  } // Ends Function update

  attack(){
    this.attackSingle(0);
    this.attackSingle(1);
  } // Ends Function attack

  attackSingle(i){
    if(this.curTargets[i] && this.curTargets[i].isAlive){
      if(this.idle[i] == true){this.atkFrmStart[i]=(frameCount%this.atkFrmSpan); this.idle[i]=false;}
      if(this.canFire(i)){this.curTargets[i].applyDamage(this.curDamage);}
    }
    else {
      this.idle[i] = true;
    }
  } // Ends Function attackSingle

  render(){
    this.renderRange();
    this.renderLaser(0); this.renderTurret(0);
    this.renderLaser(1); this.renderTurret(1);
    this.renderTowerCap();
  } // Ends Function render


  renderTurret(i){
    let turOri = (this.curTargets[i] && this.curTargets[i].isAlive) 
      ? p5.Vector.sub(this.curTargets[i].pos,this.owner.pos) 
      : createVector(0,0);

    fill(this.turCol);stroke(this.strCol);strokeWeight(1);
    push();
      translate(this.owner.pos.x,this.owner.pos.y);
      rotate(turOri.heading());
      rect(-this.turretLh,-this.turretWh,this.turretL,this.turretW);
    pop();
  } // Ends Function renderTurret  

  renderLaser(i){
    if(this.curTargets[i] && this.curTargets[i].isAlive && this.canFire(i)){
      stroke(this.laserCol); strokeWeight(2);
      line(this.owner.pos.x,this.owner.pos.y,this.curTargets[i].pos.x,this.curTargets[i].pos.y);
    }
  } // Ends Function renderLaser  

  renderTowerCap(){
    strokeWeight(4);stroke(this.strCol);fill(lerpColor(this.laserCol,this.lLerpCol, noise(frameCount/10)));
    let capRad = 20;
    ellipse(this.owner.pos.x,this.owner.pos.y,capRad,capRad);
  }

} // Ends Weapon Type LaserBlasterDual



/*======================================================================
|>>> Weapon Type : Triple Blaster
+-----------------------------------------------------------------------
| > Implementation Notes:
|    - Targeting: Will attack three closest targets. If only one target
|      is in range: all three blasters attack it; effectively acting as
|      a 3x damage LaserBlaster. If only two targets are within range: 
|      the first two beams will attack the first target (i.e. analogous
|      to LaserBlasterDual's handling of only one target); and the third
|      beam will attack the second target.
+=====================================================================*/
class LaserBlasterTriple extends Weapon{
  constructor(owner){
    super(owner);

    //> Range and Damage settings for this weapon type
    this.weapRange  = this.owner.map.cellSize*2.5;
    this.baseDamage = 2;
    this.curDamage  = this.baseDamage;

    this.getCellsInRange(); // must be called here because needs weapRange assigned

    //> Behavior settings for this weapon type
    this.curTargets  = [null,null,null];
    this.idle        = [true,true,true];
    this.atkFrmSpan  = 12;   // attack frame span, s.t. next shot is delayed by (atkFrmSpan-atkFrmDelta)
    this.atkFrmDelta = 3;    // length of attack, see atkFrmSpan comment above for how it works therewith
    this.atkFrmStart = [0,0,0];    // frame/60 when not idle, used to start fire loop 'OnStartAttack'
    
    //> GFX/Viz Settings for this tower type
    this.turretL = 32;
    this.turretW = 8;
    this.turretLh = this.turretL/2;
    this.turretWh = this.turretW/2;
    this.turCol   = color(0,120,0);
    this.strCol   = color(60); 
    this.laserCol = color(0,255,255);
    this.lLerpCol = color(0,60,240);
  } // Ends Constructor

  canFire(id){
    switch(id){
      case 0: return ((frameCount-this.atkFrmStart[0])%this.atkFrmSpan) <= this.atkFrmDelta;
      case 1: return ((frameCount-this.atkFrmStart[1])%this.atkFrmSpan) <= this.atkFrmDelta;
      case 2: return ((frameCount-this.atkFrmStart[2])%this.atkFrmSpan) <= this.atkFrmDelta;
    }
  }

  update(){
    this.getTargetsInRange();
    this.curTargets = this.get3ClosestTargets();
  } // Ends Function update

  attack(){
    this.attackSingle(0);
    this.attackSingle(1);
    this.attackSingle(2);
  } // Ends Function attack

  attackSingle(i){
    if(this.curTargets[i] && this.curTargets[i].isAlive){
      if(this.idle[i] == true){this.atkFrmStart[i]=(frameCount%this.atkFrmSpan); this.idle[i]=false;}
      if(this.canFire(i)){this.curTargets[i].applyDamage(this.curDamage);}
    }
    else {
      this.idle[i] = true;
    }
  } // Ends Function attackSingle

  render(){
    this.renderRange();
    this.renderLaser(0); this.renderTurret(0);
    this.renderLaser(1); this.renderTurret(1);
    this.renderLaser(2); this.renderTurret(2);
    this.renderTowerCap();
  } // Ends Function render


  renderTurret(i){
    let turOri = (this.curTargets[i] && this.curTargets[i].isAlive) 
      ? p5.Vector.sub(this.curTargets[i].pos,this.owner.pos) 
      : createVector(0,0);

    fill(this.turCol);stroke(this.strCol);strokeWeight(1);
    push();
      translate(this.owner.pos.x,this.owner.pos.y);
      rotate(turOri.heading());
      rect(-this.turretLh,-this.turretWh,this.turretL,this.turretW);
    pop();
  } // Ends Function renderTurret  

  renderLaser(i){
    if(this.curTargets[i] && this.curTargets[i].isAlive && this.canFire(i)){
      stroke(this.laserCol); strokeWeight(2);
      line(this.owner.pos.x,this.owner.pos.y,this.curTargets[i].pos.x,this.curTargets[i].pos.y);
    }
  } // Ends Function renderLaser  

  renderTowerCap(){
    strokeWeight(4);stroke(this.strCol);fill(lerpColor(this.laserCol,this.lLerpCol, noise(frameCount/10)));
    let capRad = 24;
    ellipse(this.owner.pos.x,this.owner.pos.y,capRad,capRad);
  }

} // Ends Weapon Type LaserBlasterTriple