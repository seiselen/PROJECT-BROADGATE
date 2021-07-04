/*======================================================================
|>>> Class Weapon (Abstract Class in Java context {i.e. no instances})
+-----------------------------------------------------------------------
+=====================================================================*/
class Weapon{
  constructor(owner){
    this.owner = owner;

    //> Range and Damage Settings (Note: Damage applied PER FRAME)
    this.maxDamage = 10; // max possible damage for any tower (note: make this a static var?)

    //> Visibility/Targeting System (Common \forall weapon types)
    this.inRangeCells = [];
    this.targetList   = [];
    this.curTarget    = null;

    //> GFX/Viz Settings (Common \forall weapon types)
    this.dispRange = true;
    this.col_range = color(0,180,255,64); // attack range color
  }

  //####################################################################
  //>>> Visibility / Targeting / Attack System
  //####################################################################
  getCellsInRange(){
    let cellSpan = floor(this.weapRange/this.owner.map.cellSize);

    let r = this.owner.cell[0];
    let c = this.owner.cell[1];

    for(let adjR = r-cellSpan; adjR <= r+cellSpan; adjR++){
      for(let adjC = c-cellSpan; adjC <= c+cellSpan; adjC++){
        if( !(adjR==r && adjC==c) && this.owner.map.isEnemyPathCell(adjR,adjC) ){
          this.inRangeCells.push([adjR,adjC]);
        }
      }
    }
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
    return goalTar;
  } // Ends Function getClosestTarget

  /*--------------------------------------------------------------------
  |>>> Functions get2ClosestTargets / get3ClosestTargets
  +---------------------------------------------------------------------
  | Implementation Notes:
  |  > Definitions are 'lazy OOP' as get2ClosestTargets repeats a chunk 
  |    of getClosestTarget's code, and get3ClosestTargets does the same
  |    for get2ClosestTargets's code...I know; but KISS nonetheless.
  |  > Handling of edge cases:
  |    o Both Functions: No targets in range -> Array of size 2 xor 3
  |      with null values are returned; analogous to getClosestTarget's 
  |      return of null implying 'got nothin!'
  |    o get2ClosestTargets: Only 1 target in range -> (tar2 = tar1);
  |      which supports DualBlaster weapon's design of focusing both
  |      blasters on a single enemy if none other are within range.
  |    o get3ClosestTargets: Two handlings as follows, supporting the
  |      design of TripleBlaster and RelayBeam weapon...
  |      # 1 target in range  -> (tar3 = tar2 = tar1); analogous to the
  |        handling of get2ClosestTargets; i.e. fire all on the 1 enemy
  |      # 2 targets in range -> (tar3 = tar2) AND (tar2 = tar1); which
  |        realizes effecting the most and 2nd most damaging relay on
  |        the closest target, and the weakest on the 2nd. As to the
  |        Triple Blaster, this effects giving priority to the closest
  |        target: via firing 2 of the 3 blasters at it until/unless a
  |        3rd target exists (which KISS and makes reasonable sense).
  |      # 3 targets in range -> obvious. Both RelayBeam and Tri-Blaster
  |        will be happy (i.e. get correct output) with [tar1,tar2,tar3]
  |      # Note: This handling is not 'gospel'; i.e. 2 targets in range
  |        COULD effect the function returning [tar1,tar2,null]; as for
  |        the RelayBeam to maybe do an alternate behavior where e.g.
  |        damage is [100%,60%] or something...
  +-------------------------------------------------------------------*/
  get2ClosestTargets(){
    let tar1 = this.getClosestTarget(); if(tar1==null){return [null,null];}
    let tar2 = null;

    let minDist = 9999; let tarDist;
    for (let i=0; i<this.targetList.length; i++) {
      tarDist = p5.Vector.dist(this.targetList[i].pos,this.owner.pos);
      if(this.targetList[i] != tar1 && this.targetList[i].isAlive && tarDist<minDist){
        minDist = tarDist;
        tar2 = this.targetList[i];
      }  
    }
    return (!tar2) ? [tar1,tar1] : [tar1,tar2];
  } // Ends Function get2ClosestTargets


  get3ClosestTargets(){
    let tars = this.get2ClosestTargets();
    let tar1 = tars[0]; if(tar1==null){return [null,null,null];}
    let tar2 = tars[1]; if(tar2==null){return [tar1,tar1,tar1];}
    let tar3 = null;

    let minDist = 9999; let tarDist;
    for (let i=0; i<this.targetList.length; i++) {
      tarDist = p5.Vector.dist(this.targetList[i].pos,this.owner.pos);
      if(this.targetList[i] != tar1 && this.targetList[i] != tar2 && this.targetList[i].isAlive && tarDist<minDist){
        minDist = tarDist;
        tar3 = this.targetList[i];
      }
    }
    return (!tar3) ? [tar1,tar1,tar2] : [tar1,tar2,tar3];
  } // Ends Function get3ClosestTargets


  attack(){
    if(this.curTarget && this.curTarget.isAlive){
      this.curTarget.applyDamage(this.curDamage);
    }
  }

  //####################################################################
  //>>> Render and other GFX/VFX methods
  //####################################################################

  renderRange(){
    if(this.dispRange){
      noStroke();fill(this.col_range);
      ellipse(this.owner.pos.x,this.owner.pos.y,this.weapRange*2,this.weapRange*2);
    }
  } // Ends Function renderRange

} // Ends Class Weapon