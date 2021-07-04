/*>>> TEMP --- KEEPING THIS FOR THE OLD RENDER{TURRET/LASER} CODE
class LaserBeam extends Weapon{
  constructor(owner){
    super(owner);
    //> Range and Damage Settings for this tower type
    this.weapRange  = this.owner.map.cellSize*2.5;
    this.baseDamage = 1;
    this.curDamage  = this.baseDamage;
    this.getCellsInRange(); // must be called here because needs weapRange assigned
    //> GFX/Viz Settings for this tower type
    this.turretL = 32; this.turretW = 8;
    this.turretLh = this.turretL/2;
    this.turretWh = this.turretW/2;
    this.turCol   = color(0,120,0);
    this.strCol   = color(60); 
    this.laserCol = color(0,255,255);
  } // Ends Constructor

  update(){this.getTargetsInRange();this.curTarget = this.getClosestTarget();}
  render(){this.renderRange(); this.renderLaser(); this.renderTurret();}

  renderTurret(){
    let turOri = (this.curTarget && this.curTarget.isAlive) ? p5.Vector.sub(this.curTarget.pos,this.owner.pos) : createVector(0,0);
    fill(this.turCol);stroke(this.strCol);strokeWeight(1);
    push(); 
      translate(this.owner.pos.x,this.owner.pos.y); rotate(turOri.heading()); 
      rect(-this.turretLh,-this.turretWh,this.turretL,this.turretW); 
    pop();
  } // Ends Function renderTurret  

  renderLaser(tar){
    if(this.curTarget && this.curTarget.isAlive){
      stroke(this.laserCol); strokeWeight(random(1,4));
      line(this.owner.pos.x,this.owner.pos.y,this.curTarget.pos.x,this.curTarget.pos.y);
    }
  } // Ends Function renderLaser  
} // Ends Weapon Type LaserBeam
*/

/*======================================================================
|>>> Weapon Type : Cannon
+=====================================================================*/
class Cannon extends Weapon{
  constructor(owner){
    super(owner);

    //> Range and Damage settings for this weapon type
    this.weapRange  = this.owner.map.cellSize*4.5;

    this.getCellsInRange(); // must be called here because needs weapRange assigned

    //> Behavior settings for this weapon type
    this.idle       = true;
    this.atkFrmSpan  = 30;   // attack frame span, s.t. next shot is delayed by (atkFrmSpan-atkFrmDelta)
    this.atkFrmDelta = 1;    // length of attack, see atkFrmSpan comment above for how it works therewith
    this.atkFrmStart = 0;    // frame/60 when not idle, used to start fire loop 'OnStartAttack'
    
    //> GFX/Viz Settings for this tower type
    this.turretL = 32;
    this.turretW = 8;
    this.turretLh = this.turretL/2;
    this.turretWh = this.turretW/2;
    this.turCol   = color(0,120,0);
    this.strCol   = color(60); 

    this.launchThisFrame = false;
  } // Ends Constructor

  canFire(){
    return ((frameCount-this.atkFrmStart)%this.atkFrmSpan) == this.atkFrmDelta;
  }

  update(){
    this.getTargetsInRange();
    this.curTarget = this.getClosestTarget();
  } // Ends Function update

  //> OPTM-AREA: Use Switches and/or Ternarys if frame rates start dropping?
  attack(){
    if(this.curTarget && this.curTarget.isAlive){
      if(this.idle == true){this.atkFrmStart=(frameCount%this.atkFrmSpan); this.idle=false;}
      this.launchThisFrame = false;
      if(this.canFire()){
        this.launchThisFrame = true;
        this.launchProjectile();
      }
    }
    else {
      this.idle = true;
    }
  } // Ends Function attack

  launchProjectile(){
    let launchPos = p5.Vector.add(this.owner.pos, p5.Vector.sub(this.curTarget.pos,this.owner.pos).setMag(this.turretLh));
    projPool.reqBullet(launchPos,this.curTarget);
  }

  render(){
    this.renderRange();
    this.renderTurret();
  } // Ends Function render 

  renderTurret(){
    let turOri = (this.curTarget && this.curTarget.isAlive) 
      ? p5.Vector.sub(this.curTarget.pos,this.owner.pos) 
      : createVector(0,0);

    fill(this.turCol);stroke(this.strCol);strokeWeight(1);
    push();
      translate(this.owner.pos.x,this.owner.pos.y);
      rotate(turOri.heading());
      stroke(60);
      strokeWeight(16); line(4-this.turretLh,0,8,0);
      strokeWeight(8); line(8,0,this.turretLh+8,0);
      if(this.launchThisFrame){
        strokeWeight(4); stroke(255,60,0,156); fill(255,255,0,216); 
        ellipse(this.turretLh+16,0,18,18);
      }
      noStroke();fill(this.turCol); ellipse(-10,0,8,8);
    pop();
  } // Ends Function renderTurret
} // Ends Weapon Type Cannon


/*======================================================================
|>>> Weapon Type : SemiAutoCannon
+=====================================================================*/
class SemiAutoCannon extends Weapon{
  constructor(owner){
    super(owner);

    //> Range and Damage settings for this weapon type
    this.weapRange  = this.owner.map.cellSize*4.5;

    this.getCellsInRange(); // must be called here because needs weapRange assigned

    //> Behavior settings for this weapon type
    this.idle       = true;
    this.atkFrmSpan  = 60;   // attack frame span, i.e. 'length of attack behavior'
    this.atkFrmDelta = 6;    // length between attacks during an attack span
    this.atksPerSpan = 5;    // how many attacks within the attack span [before idle until reset]
    this.atkFrmStart = 0;    // frame/60 when not idle, used to start fire loop 'OnStartAttack'
    this.atksCurSpan = 0;    // number of attacks this frame span
    
    //> GFX/Viz Settings for this tower type
    this.turretL = 32;
    this.turretW = 8;
    this.turretLh = this.turretL/2;
    this.turretWh = this.turretW/2;
    this.turCol   = color(0,120,0);
    this.strCol   = color(60); 

    this.launchThisFrame = false;
  } // Ends Constructor

  update(){
    this.getTargetsInRange();
    this.curTarget = this.getClosestTarget();
  } // Ends Function update

  //> OPTM-AREA: Use Switches and/or Ternarys if frame rates start dropping?
  attack(){
    this.launchThisFrame = false; // for barrel flash VFX
    
    if(this.curTarget && this.curTarget.isAlive){
      if(this.idle == true){
        this.atkFrmStart = frameCount;
        this.idle=false;
      }

      let animFrame = (frameCount-this.atkFrmStart)%this.atkFrmSpan;

      if(animFrame%this.atkFrmDelta == 0 && this.atksCurSpan < this.atksPerSpan){
        this.launchThisFrame = true;
        this.launchProjectile();
        this.atksCurSpan+=1;
      } 
    
      if (this.atksCurSpan == this.atksPerSpan && animFrame+1 == this.atkFrmSpan){
        this.atksCurSpan = 0;
        this.idle=true;
      }
    }
    else {
      this.idle = true;
    }
  } // Ends Function attack

  launchProjectile(){
    let launchPos = p5.Vector.add(this.owner.pos, p5.Vector.sub(this.curTarget.pos,this.owner.pos).setMag(this.turretLh));
    projPool.reqBullet(launchPos,this.curTarget);
  }

  render(){
    this.renderRange();
    this.renderTurret();
  } // Ends Function render 

  renderTurret(){
    let turOri = (this.curTarget && this.curTarget.isAlive) 
      ? p5.Vector.sub(this.curTarget.pos,this.owner.pos) 
      : createVector(0,0);

    fill(this.turCol);stroke(this.strCol);strokeWeight(1);
    push();
      translate(this.owner.pos.x,this.owner.pos.y);
      rotate(turOri.heading());
      stroke(60);
      strokeWeight(24); line(4-this.turretLh,0,8,0);
      strokeWeight(14); line(8,0,this.turretLh+8,0);
      if(this.launchThisFrame){
        strokeWeight(4); stroke(255,60,0,156); fill(255,255,0,216); 
        ellipse(this.turretLh+16,0,18,18);
      }
      noStroke();fill(this.turCol); ellipse(-10,0,12,12);
    pop();
  } // Ends Function renderTurret
} // Ends Weapon Type SemiAutoCannon



/*======================================================================
|>>> Weapon Type : GatlingGunCannon
+=====================================================================*/
class GatlingGunCannon extends Weapon{
  constructor(owner){
    super(owner);

    //> Range and Damage settings for this weapon type
    this.weapRange  = this.owner.map.cellSize*4.5;

    this.getCellsInRange(); // must be called here because needs weapRange assigned

    //> Behavior settings for this weapon type
    this.idle        = true;
    this.atkFrmSpan  = 60;   // attack frame span, i.e. 'length of attack behavior'
    this.atkFrmDelta = 6;    // length between attacks during an attack span
    this.atkFrmStart = 0;    // frame/60 when not idle, used to start fire loop 'OnStartAttack'
    
    //> GFX/Viz Settings for this tower type
    this.turretL = 32;
    this.turretW = 8;
    this.turretLh = this.turretL/2;
    this.turretWh = this.turretW/2;
    this.turCol   = color(0,120,0);
    this.strCol   = color(60); 

    this.launchThisFrame = false;
  } // Ends Constructor

  update(){
    this.getTargetsInRange();
    this.curTarget = this.getClosestTarget();
  } // Ends Function update

  //> OPTM-AREA: Use Switches and/or Ternarys if frame rates start dropping?
  attack(){
    this.launchThisFrame = false; // for barrel flash VFX
    
    if(this.curTarget && this.curTarget.isAlive){
      if(this.idle == true){
        this.atkFrmStart = frameCount;
        this.idle=false;
      }

      let animFrame = (frameCount-this.atkFrmStart)%this.atkFrmSpan;

      if(animFrame%this.atkFrmDelta == 0){
        this.launchThisFrame = true;
        this.launchProjectile();
      }
    }
    else {
      this.idle = true;
    }
  } // Ends Function attack

  launchProjectile(){
    let launchPos = p5.Vector.add(this.owner.pos, p5.Vector.sub(this.curTarget.pos,this.owner.pos).setMag(this.turretLh));
    projPool.reqBullet(launchPos,this.curTarget);
  }

  render(){
    this.renderRange();
    this.renderTurret();
  } // Ends Function render 

  renderTurret(){
    let turOri = (this.curTarget && this.curTarget.isAlive) 
      ? p5.Vector.sub(this.curTarget.pos,this.owner.pos) 
      : createVector(0,0);

    fill(this.turCol);stroke(this.strCol);strokeWeight(1);
    push();
      translate(this.owner.pos.x,this.owner.pos.y);
      rotate(turOri.heading());
      stroke(60);
      strokeWeight(24); line(4-this.turretLh,0,8,0);
      strokeWeight(14); line(8,0,this.turretLh+8,0);
      if(this.launchThisFrame){
        strokeWeight(4); stroke(255,60,0,156); fill(255,255,0,216); 
        ellipse(this.turretLh+16,0,18,18);
      }
      noStroke();fill(this.turCol); ellipse(-10,0,12,12);
    pop();
  } // Ends Function renderTurret
} // Ends Weapon Type GatlingGunCannon