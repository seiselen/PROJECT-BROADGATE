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
    this.turretL  = 32;
    this.turretW  = 16;
    this.barrelW  = 8;
    this.barrelWh = this.barrelW/2;    
    this.turretLh = this.turretL/2;
    this.turretWh = this.turretW/2;
    this.turCol   = color(24,120,24);
    this.barCol   = color(168,192,216);
    this.strCol   = color(24);

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

    strokeWeight(1); stroke(this.strCol);
    push();
      translate(this.owner.pos.x,this.owner.pos.y);
      rotate(turOri.heading());

      fill(this.turCol); rect(-this.turretLh,-this.turretWh,this.turretLh*1.5,this.turretW); 
      fill(this.barCol); rect(this.turretLh-(this.turretLh*1.25),-this.barrelWh,this.turretLh*1.5,this.barrelW);

      if(this.launchThisFrame){
        strokeWeight(4); stroke(255,60,0,156); fill(255,255,0,216); 
        ellipse(this.turretLh+this.barrelW,0,18,18);
      }
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
    this.turretL  = 40;
    this.turretW  = 20;
    this.barrelW  = 10;
    this.barrelWh = this.barrelW/2;    
    this.turretLh = this.turretL/2;
    this.turretWh = this.turretW/2;
    this.turCol   = color(24,120,24);
    this.barCol   = color(168,192,216);
    this.strCol   = color(24);

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

    strokeWeight(1); stroke(this.strCol);
    push();
      translate(this.owner.pos.x,this.owner.pos.y);
      rotate(turOri.heading());

      fill(this.turCol); rect(-this.turretLh,-this.turretWh,this.turretLh*1.5,this.turretW); 
      fill(this.barCol); rect(this.turretLh-(this.turretLh*1.25),-this.barrelWh,this.turretLh*1.5,this.barrelW);

      if(this.launchThisFrame){
        strokeWeight(4); stroke(255,60,0,156); fill(255,255,0,216); 
        ellipse(this.turretLh+this.barrelW,0,18,18);
      }
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
    this.turretL  = 40;
    this.turretW  = 30;
    this.barrelW  = 15;
    this.barrelWh = this.barrelW/2;    
    this.turretLh = this.turretL/2;
    this.turretWh = this.turretW/2;
    this.turCol   = color(24,120,24);
    this.barCol   = color(168,192,216);
    this.strCol   = color(24);

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

    strokeWeight(1); stroke(this.strCol);
    push();
      translate(this.owner.pos.x,this.owner.pos.y);
      rotate(turOri.heading());

      fill(this.turCol); rect(-this.turretLh,-this.turretWh,this.turretLh*1.5,this.turretW); 
      fill(this.barCol); rect(this.turretLh-(this.turretLh*1.25),-this.barrelWh,this.turretLh*1.5,this.barrelW);

      if(this.launchThisFrame){
        strokeWeight(4); stroke(255,60,0,156); fill(255,255,0,216); 
        ellipse(this.turretLh+this.barrelW,0,18,18);
      }
    pop();
  } // Ends Function renderTurret
} // Ends Weapon Type GatlingGunCannon



/*======================================================================
|>>> Weapon Type : MissileLauncher
+=====================================================================*/
class MissileLauncher extends Weapon{
  constructor(owner){
    super(owner);

    //> Range and Damage settings for this weapon type
    this.weapRange  = this.owner.map.cellSize*6.5;

    this.getCellsInRange(); // must be called here because needs weapRange assigned

    //> Behavior settings for this weapon type
    this.idle       = true;
    this.atkFrmSpan  = 108;   // attack frame span, i.e. 'length of attack behavior'
    this.atkFrmDelta = 12;    // length between attacks during an attack span
    this.atksPerSpan = 2;    // how many attacks within the attack span [before idle until reset]
    this.atkFrmStart = 0;    // frame/60 when not idle, used to start fire loop 'OnStartAttack'
    this.atksCurSpan = 0;    // number of attacks this frame span
    this.animFrame   = 0;    // current frame (of animation span)
    
    //> GFX/Viz Settings for this tower type
    this.turretL = 32;
    this.turretW = 32;
    this.turretLh = this.turretL/2;
    this.turretWh = this.turretW/2;
    this.turCol   = color(120,36,0);
    this.doorCol  = color(60);
    this.strCol   = color(180); 

    this.launchThisFrame = false;

  } // Ends Constructor

  update(){
    this.getTargetsInRange();
    this.curTarget = this.getFurthestTarget();
  } // Ends Function update

  //> OPTM-AREA: Use Switches and/or Ternarys if frame rates start dropping?
  attack(){
    this.launchThisFrame = false; // for barrel flash VFX
    
    if(this.curTarget && this.curTarget.isAlive){
      if(this.idle == true){
        this.atkFrmStart = frameCount;
        this.idle=false;
      }

      this.animFrame = (frameCount-this.atkFrmStart)%this.atkFrmSpan;

      if(this.animFrame%this.atkFrmDelta == 0 && this.atksCurSpan < this.atksPerSpan){
        this.launchThisFrame = true;
        this.launchProjectile();
        this.atksCurSpan+=1;
      } 
    
      if (this.atksCurSpan == this.atksPerSpan && this.animFrame+1 == this.atkFrmSpan){
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
    projPool.reqMissile(launchPos,this.curTarget);
  }

  render(){
    this.renderRange();
    this.renderTurret();
  } // Ends Function render 

  renderTurret(){
    let turOri = (this.curTarget && this.curTarget.isAlive) ? p5.Vector.sub(this.curTarget.pos,this.owner.pos) : createVector(0,0);
    fill(this.turCol);stroke(this.strCol);strokeWeight(1);
    push(); 
      translate(this.owner.pos.x,this.owner.pos.y); rotate(turOri.heading());
      rect(-this.turretLh,-this.turretWh,this.turretL,this.turretW);
      fill(this.doorCol);
      rect(this.turretLh-16,-this.turretWh+8,this.turretLh,this.turretWh);
      strokeWeight(2); stroke(this.doorCol);
      fill(240,216,0);
      push();
        translate(6-this.turretLh,0);
        rotate(PI*lerp(0,2, (frameCount%120)/120));
        ellipse(0,0,6,16);
      pop();
    pop();
  } // Ends Function renderTurret  

} // Ends Weapon Type MissileLauncher



/*======================================================================
|>>> Weapon Type : MissileLauncher2X
+=====================================================================*/
class MissileLauncher2X extends Weapon{
  constructor(owner){
    super(owner);

    //> Range and Damage settings for this weapon type
    this.weapRange  = this.owner.map.cellSize*6.5;

    this.getCellsInRange(); // must be called here because needs weapRange assigned

    //> Behavior settings for this weapon type
    this.idle       = true;
    this.atkFrmSpan  = 108;   // attack frame span, i.e. 'length of attack behavior'
    this.atkFrmDelta = 12;    // length between attacks during an attack span
    this.atksPerSpan = 4;    // how many attacks within the attack span [before idle until reset]
    this.atkFrmStart = 0;    // frame/60 when not idle, used to start fire loop 'OnStartAttack'
    this.atksCurSpan = 0;    // number of attacks this frame span
    this.animFrame   = 0;    // current frame (of animation span)
    
    //> GFX/Viz Settings for this tower type
    this.turretL = 32;
    this.turretW = 48;
    this.turretLh = this.turretL/2;
    this.turretWh = this.turretW/2;
    this.turCol   = color(120,36,0);
    this.doorCol  = color(60);
    this.strCol   = color(180); 

    this.launchThisFrame = false;

  } // Ends Constructor

  update(){
    this.getTargetsInRange();
    this.curTarget = this.getFurthestTarget();
  } // Ends Function update

  //> OPTM-AREA: Use Switches and/or Ternarys if frame rates start dropping?
  attack(){
    this.launchThisFrame = false; // for barrel flash VFX
    
    if(this.curTarget && this.curTarget.isAlive){
      if(this.idle == true){
        this.atkFrmStart = frameCount;
        this.idle=false;
      }

      this.animFrame = (frameCount-this.atkFrmStart)%this.atkFrmSpan;

      if(this.animFrame%this.atkFrmDelta == 0 && this.atksCurSpan < this.atksPerSpan){
        this.launchThisFrame = true;
        this.launchProjectile();
        this.atksCurSpan+=1;
      } 
    
      if (this.atksCurSpan == this.atksPerSpan && this.animFrame+1 == this.atkFrmSpan){
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
    projPool.reqMissile(launchPos,this.curTarget);
  }

  render(){
    this.renderRange();
    this.renderTurret();
  } // Ends Function render 

  renderTurret(){
    let turOri = (this.curTarget && this.curTarget.isAlive) ? p5.Vector.sub(this.curTarget.pos,this.owner.pos) : createVector(0,0);
    fill(this.turCol);stroke(this.strCol);strokeWeight(1);
    push(); 
      translate(this.owner.pos.x,this.owner.pos.y); rotate(turOri.heading());
      rect(-this.turretLh,-this.turretWh,this.turretL,this.turretW);
      fill(this.doorCol);
      rect(this.turretLh-16,-this.turretWh+8,this.turretLh,this.turretWh+8);
      strokeWeight(2); stroke(this.doorCol);
      fill(240,216,0);
      let rotVal = PI*lerp(0,2, (frameCount%120)/120);
      push();translate(6-this.turretLh,-12);rotate(rotVal);ellipse(0,0,6,16);pop();
      push();translate(6-this.turretLh,12);rotate(HALF_PI+rotVal);ellipse(0,0,6,16);pop();
    pop();
  } // Ends Function renderTurret  

} // Ends Weapon Type MissileLauncher2X