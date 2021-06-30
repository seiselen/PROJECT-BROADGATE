/*----------------------------------------------------------------------
|>>> Class Weapon
+---------------------------------------------------------------------*/
class Weapon{
  constructor(pos,map,owner){
    this.owner = owner;

    //> Range and Damage Settings (Applied PER FRAME! And will vary once I write subtypes!
    this.weapRange  = map.cellSize*2.5;
    this.baseDamage = 1; // base damage (i.e. if brand new with no upgrades)
    this.curDamage  = this.baseDamage;
    this.maxDamage  = 10; // TODO: make this a [parent class] static var in future?

    //> Visibility/Targeting System (PUT IN PARENT - COMMON FORALL TYPES)
    this.inRangeCells = this.getCellsInRange();
    this.targetList   = [];
    this.curTarget    = null;

    //> GFX/Viz Settings for this type of tower (NOTE: will vary once I write child weapon types)
    this.turretL = 32;
    this.turretW = 8;
    this.turretLh = this.turretL/2;
    this.turretWh = this.turretW/2;
    this.turCol   = color(0,120,0);
    this.strCol   = color(60); 
    this.laserCol = color(0,255,255);    

    //> GFX/Viz Settings (PUT IN PARENT - COMMON FORALL TYPES)
    this.dispRange = true;
    this.col_range = color(0,180,255,64); // attack range color
  }

  update(){
    this.getTargetsInRange();
    this.getClosestTarget();
  } // Ends Function update


  //####################################################################
  //>>> Visibility / Targeting / Attack System
  //####################################################################
  getCellsInRange(){
    let cellsInRange = [];
    let cellSpan = floor(this.weapRange/this.owner.map.cellSize);

    let r = this.owner.cell[0];
    let c = this.owner.cell[1];

    for(let adjR = r-cellSpan; adjR <= r+cellSpan; adjR++){
      for(let adjC = c-cellSpan; adjC <= c+cellSpan; adjC++){
        if( !(adjR==r && adjC==c) && this.owner.map.isEnemyPathCell(adjR,adjC) ){
          cellsInRange.push([adjR,adjC]);
        }
      }
    }
    return cellsInRange;
  } // Ends Function getCellsInRange


  getTargetsInRange(){
    this.targetList = this.owner.map.getUnitsInCells(this.inRangeCells);
  } // Ends Function getTargetsInRange


  getClosestTarget(){
    let minDist = 9999;
    let goalTar = null;
    let tarDist;

    for (let i=0; i<this.targetList.length; i++) {
      tarDist = p5.Vector.dist(this.targetList[i].pos,this.owner.pos);
      if(this.targetList[i].isAlive && tarDist<minDist){
        minDist = tarDist;
        goalTar = this.targetList[i];
      }  
    }
    this.curTarget = goalTar;
  } // Ends Function getClosestTarget


  attack(){
    if(this.curTarget && this.curTarget.isAlive){
      this.curTarget.applyDamage(this.curDamage);
    }
  }

  //####################################################################
  //>>> Render and other GFX/VFX methods
  //####################################################################

  render(){
    this.renderRange();
    this.renderLaser();
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
      rect(-this.turretLh,-this.turretWh,this.turretL,this.turretW);
    pop();
  } // Ends Function renderTurret  


  renderLaser(tar){
    if(this.curTarget && this.curTarget.isAlive){
      stroke(this.laserCol); strokeWeight(random(1,4));
      line(this.owner.pos.x,this.owner.pos.y,this.curTarget.pos.x,this.curTarget.pos.y);
    }
  } // Ends Function renderLaser  


  renderRange(){
    if(this.dispRange){
      noStroke();fill(this.col_range);
      ellipse(this.owner.pos.x,this.owner.pos.y,this.weapRange*2,this.weapRange*2);
    }
  } // Ends Function renderRange

} // Ends Class Weapon