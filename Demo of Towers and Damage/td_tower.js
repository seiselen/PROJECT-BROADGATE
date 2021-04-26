

class TDTower{
  constructor(pos,cell){
    this.pos  = pos;
    this.cell = cell;

    // Tower shape info/method (in lieu of Sprites/Images)
    this.diam;
    this.radi;
    this.shapeRad;
    this.setDiam(cellSize); // USING GLOBAL VAR HERE!
    this.shapeSides = 6;
    this.shapeVerts = createNgon(this.pos,this.shapeRad,this.shapeSides,0);

    // Variables for [Mouse] Selection/Moving
    this.isSelected = false;
    this.mOffset;

    // Variables for Visibility and Target[s]
    this.vizRange  = cellSize*2.5;
    this.showRange = true;
    this.enmyCells = [];
    this.enemyList = [];
    this.curTarget = null;

    this.getEnemyCellsInRange();

    // Variables for Damage and Related Settings
    this.baseDamage = 1;
    this.curDamage = this.baseDamage;
    this.maxDamage = 10;


    // Variables for Turret Settings (QAD - turret should be its own object!)
    this.turretL = 32;
    this.turretW = 8;
    this.turretLh = this.turretL/2;
    this.turretWh = this.turretW/2;
    this.turCol   = color(0,120,0);
    this.laserCol = color(0,255,255);

    // Colors
    this.regCol = color(0,216,0);
    this.selCol = color(0,216,0,127);
    this.strCol = color(60);
    this.vRgCol = color(0,180,255,64); // viz range color

  }

  setDiam(newDiam){
    this.diam = newDiam;
    this.radi = this.diam/2;
    this.shapeRad = newDiam*0.375;
  }

  ptInBoundCirc(pt){
    return (p5.Vector.dist(pt,this.pos) <= this.diam);
  }

  distToPt(pt){
    return p5.Vector.dist(pt,this.pos);
  }



  //--------------------------------------------------------------------
  //>>> Mouse/UI Behaviors
  //--------------------------------------------------------------------

  onMousePressed(mousePt){
    if(this.ptInBoundCirc(mousePt)){
      this.isSelected = true;
      this.mOffset = p5.Vector.sub(this.pos,mousePt);
    }
  }

  onMouseDragged(mousePt){
    if(this.isSelected){
      this.pos.set(p5.Vector.add(this.mOffset,mousePt));
    }
  }

  onMouseReleased(mousePt){
    // if it ain't you - don't worry
    if(!this.isSelected){return;}

    this.isSelected = false;

    this.snapToCell(this.pos);

    let newCell = map.posToCoord(this.pos);
 
    if (!map.isValidVacantCell(newCell)){this.snapToCurCell(); return;}

    map.setToVacant(this.cell);

    this.cell = newCell;

    this.getEnemyCellsInRange();

    map.setToFilled(this.cell);

  } // Ends Function OnMouseReleased  


  snapToCurCell(){
    this.snapToCell(map.coordToPos(this.cell));
  }

  snapToCell(newPos=null){
    this.pos.x = (floor(newPos.x/this.diam)*this.diam)+(this.radi);
    this.pos.y = (floor(newPos.y/this.diam)*this.diam)+(this.radi);
  }

  //--------------------------------------------------------------------
  //>>> Update
  //--------------------------------------------------------------------
  update(){
    this.getEnemiesInRange();
    this.getClosestEnemyInRange();
    this.attackCurTarget();
  }

  //--------------------------------------------------------------------
  //>>> Visibility / Targeting / Attack System
  //--------------------------------------------------------------------

  getEnemyCellsInRange(){
    this.enmyCells = [];

    let cellRange = floor(this.vizRange/cellSize);

    let r = this.cell[0];
    let c = this.cell[1];

    let buff = [-1,-1];

    let enmyCells = [];

    for(let adjR = r-cellRange; adjR <= r+cellRange; adjR++){
      for(let adjC = c-cellRange; adjC <= c+cellRange; adjC++){
        buff[0] = adjR; buff[1] = adjC;
        if( !(adjR==r && adjC==c) && map.isEnemyPathCell(buff) ){
          this.enmyCells.push([adjR,adjC]);
        }
      }
    }
  }


  getEnemiesInRange(){
    this.enemyList = mapSP.getAgentsInCellList(this.enmyCells);
  }


  getClosestEnemyInRange(){
    let curDist = 9999;
    let closestEnemy = null;
    let nmyDist;

    for (var i = 0; i < this.enemyList.length; i++) {
 
      nmyDist = this.distToPt(this.enemyList[i].pos)
      if(nmyDist<curDist){
        curDist = nmyDist;
        closestEnemy = this.enemyList[i];
      }
    
    }

    this.curTarget = closestEnemy;
  }


  attackCurTarget(){
    if(this.curTarget && this.curTarget.isAlive){
      this.curTarget.applyDamage(this.curDamage);
    }
  }




  //--------------------------------------------------------------------
  //>>> Render and other GFX/VFX methods
  //--------------------------------------------------------------------

  render(){
    if(this.showRange){this.dispRange();}
    //this.render1();
    this.render2();
    this.renderLaser();
    this.renderTurret();
  }

  // Draws ellipse using this.diam as basis
  render1() {
    stroke(this.strCol);strokeWeight(2);
    if (this.isSelected) {fill(this.selCol);} else{fill(this.regCol);}
    ellipse(this.pos.x,this.pos.y,this.diam*0.75,this.diam*0.75);
  } // Ends Function render1

  // Draws Regular Polygon using this.shapeDiam as basis
  render2(){
    stroke(this.strCol);strokeWeight(2);
    if (this.isSelected) {fill(this.selCol);} else{fill(this.regCol);}

    beginShape();
      for (let i = 0; i < this.shapeSides; i++) {
        vertex(this.pos.x+this.shapeVerts[i].x, this.pos.y+this.shapeVerts[i].y);
      }
    endShape(CLOSE);

  } // Ends Function render2


  renderTurret(){
    let turOri = (this.curTarget && this.curTarget.isAlive) 
      ? p5.Vector.sub(this.curTarget.pos,this.pos) 
      : createVector(0,0);

    fill(this.turCol);stroke(this.strCol);strokeWeight(1);
    push();
      translate(this.pos.x,this.pos.y);
      rotate(turOri.heading());
      rect(-this.turretLh,-this.turretWh,this.turretL,this.turretW);
    pop();
  }

  renderLaser(){
    if(this.curTarget && this.curTarget.isAlive){
      stroke(this.laserCol); strokeWeight(random(1,4));
      line(this.pos.x,this.pos.y,this.curTarget.pos.x,this.curTarget.pos.y);
    }

  }


  dispRange(){
    if(this.showRange){
      noStroke();fill(this.vRgCol);
      ellipse(this.pos.x,this.pos.y,this.vizRange*2,this.vizRange*2);
    }    
  }

}