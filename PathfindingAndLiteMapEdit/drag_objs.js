

function createDragObject(token,row,col){
  if (!myMap.cellInBounds(row,col)){return null;}
  return new DragObject(token,row,col);
}

class DragObject{
  constructor(tok,row,col){
    this.token = tok; // token of node s.t. {START xor GOAL}
    this.coord = [row,col];
    this.pos   = myMap.coordToPos(row,col);
    this.diam  = Config.cellSize;
    this.radi  = this.diam/2;

    // Variables for [Mouse] Selection/Moving
    this.isSelected = false;
    this.mOffset;

    // Colors
    this.fill_tokenS = color(0,216,0);
    this.fill_tokenG = color(216,0,0);
    this.fill_ERROR  = color(255,0,255);    
    this.strk_bounds = color(60);
    this.sWgt_bounds = 2;    
  }

  ptInBoundCirc(pt){
    return (p5.Vector.dist(pt,this.pos) <= this.radi);
  }

  onMousePressed(mousePt){
    if(this.ptInBoundCirc(mousePt)){
      this.isSelected = true;
      this.mOffset = p5.Vector.sub(this.pos,mousePt);
      return this;
    }
    return null;
  }

  onMouseDragged(mousePt){
    if(this.isSelected){this.pos.set(p5.Vector.add(this.mOffset,mousePt));}
  }

  onMouseReleased(mousePt){
    if(this.isSelected){
      this.isSelected = false;
      this.snapToCell(this.pos);

      let adjPos = createVector(this.pos.x-1, this.pos.y-1);
      let newCoord = myMap.posToCoord(adjPos);

      if(newCoord == null){
        this.snapToPrevMRC();
        return null;
      }

      /*
      if (<newCoord is where the other token is>){
        this.snapToPrevMRC();
        return null;
      }
      */

      // Reset MRC to new location
      this.coord = newCoord;
    } // Ends handling if THIS is the selected object
  } // Ends Function OnMouseReleased

  snapToPrevMRC(){
    this.snapToCell(myMap.coordToPos(this.coord));
  }

  snapToCell(newPos){
    if(newPos==null){return;}
    this.pos.set(myMap.posToMidpt(newPos));
  }

  render() {
    stroke(this.strk_bounds); strokeWeight(this.sWgt_bounds);
    switch(this.token){
      case "START" : fill(this.fill_tokenS); break;
      case "GOAL"  : fill(this.fill_tokenG); break;
      default      : fill(this.fill_ERROR);
    }
    ellipse(this.pos.x,this.pos.y,this.diam,this.diam);
  }

}