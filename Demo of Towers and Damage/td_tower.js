

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
    return (p5.Vector.dist(pt,this.pos) <= this.radi);
  }  


  //--------------------------------------------------------------------
  //>>> Mouse/UI Behaviors

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

    map.setToFilled(this.cell);

  } // Ends Function OnMouseReleased  


  snapToCurCell(){
    this.snapToCell(map.coordToPos(this.cell));
  }

  snapToCell(newPos=null){
    this.pos.x = (floor(newPos.x/this.diam)*this.diam)+(this.radi);
    this.pos.y = (floor(newPos.y/this.diam)*this.diam)+(this.radi);
  }

  render(){
    if(this.showRange){this.dispRange();}
    //this.render1();
    this.render2();
  }

  // Draws ellipse using this.diam as basis
  render1() {
    stroke(this.strCol);strokeWeight(2);
    if (this.isSelected) {fill(this.selCol);} else{fill(this.regCol);}
    ellipse(this.pos.x,this.pos.y,this.diam*0.75,this.diam*0.75);
  }

  // Draws Regular Polygon using this.shapeDiam as basis
  render2(){
    stroke(this.strCol);strokeWeight(2);
    if (this.isSelected) {fill(this.selCol);} else{fill(this.regCol);}

    beginShape();
      for (let i = 0; i < this.shapeSides; i++) {
        vertex(this.pos.x+this.shapeVerts[i].x, this.pos.y+this.shapeVerts[i].y);
      }
    endShape(CLOSE);

  } // Ends Function drawNgonShape

  dispRange(){
    if(this.showRange){
      noStroke();fill(this.vRgCol);
      ellipse(this.pos.x,this.pos.y,this.vizRange*2,this.vizRange*2);
    }    
  }

}