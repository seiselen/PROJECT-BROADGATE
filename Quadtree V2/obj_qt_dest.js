

class QTNodeDest{
  constructor(pt1, pt2, nCnt, dEdg){
    this.pt1 = pt1; // TOP-LEFT Point
    this.pt2 = pt2; // BOTTOM-RIGHT Point
    this.dim = {tall: (pt2.y - pt1.y), wide: (pt2.x - pt1.x)};
    this.NE = null;
    this.NW = null;
    this.SW = null;
    this.SE = null;
    this.isDestroyed = false;
    this.minPixRes = 4; // min sq pixel cell (i.e. splitting policy)

    this.nodeCount = nCnt; // wrapped integer used to count # render calls i.e. # nodes in QT
    this.dispEdges = dEdg; // wrapped boolean indicating whether or not to display edges
    
    //>>> GFX/VFX Settings
    this.fill_isDest = color(255);
    this.fill_noDest = color(120,72,0);
  }


  collide(diskPos, diskRad){  
    // Stop if region destroyed
    if(this.isDestroyed){return;}
    
    // Disk fills region -> Nullify quadrants and assign state to destroyed
    if(this.qDiskSurrounds(diskPos,diskRad)){
      this.setToDestroyed();
      return;
    }

    let HW = this.dim.wide/2; // *H*alf *W*idth (of this node's bounding square)
 
    // split would result in quadrants smaller than splitting policy -> REJECT!
    if(HW < this.minPixRes){return false;}


    let cand_NW = new QTNodeDest(vec2(this.pt1.x,    this.pt1.y),    vec2(this.pt1.x+HW, this.pt1.y+HW), this.nodeCount, this.dispEdges);
    let cand_NE = new QTNodeDest(vec2(this.pt1.x+HW, this.pt1.y),    vec2(this.pt2.x,    this.pt1.y+HW), this.nodeCount, this.dispEdges);
    let cand_SW = new QTNodeDest(vec2(this.pt1.x,    this.pt1.y+HW), vec2(this.pt1.x+HW, this.pt2.y),    this.nodeCount, this.dispEdges);
    let cand_SE = new QTNodeDest(vec2(this.pt1.x+HW, this.pt1.y+HW), vec2(this.pt2.x,    this.pt2.y),    this.nodeCount, this.dispEdges);

    // Quadrant Intersects Disk -> Create if null, and/or traverse it
    if(cand_NW.qDiskIntersects(diskPos,diskRad)){
      if(this.NW==null){this.NW = cand_NW;} this.NW.collide(diskPos, diskRad); 
    }
    if(cand_NE.qDiskIntersects(diskPos,diskRad)){
      if(this.NE==null){this.NE = cand_NE;} this.NE.collide(diskPos, diskRad);  
    }
    if(cand_SW.qDiskIntersects(diskPos,diskRad)){
      if(this.SW==null){this.SW = cand_SW;} this.SW.collide(diskPos, diskRad);  
    }    
    if(cand_SE.qDiskIntersects(diskPos,diskRad)){
      if(this.SE==null){this.SE = cand_SE;} this.SE.collide(diskPos, diskRad);
    }
    
    // Quadrant Traversals yield all quadrants destroyed -> Nullify quadrants and assign state to destroyed
    if(this.NW && this.NW.isDestroyed && this.NE && this.NE.isDestroyed && this.SW && this.SW.isDestroyed && this.SE && this.SE.isDestroyed){ 
      this.setToDestroyed();
    }
  } // Ends Function Collide


  // Sets this node to destroyed (i.e. all children = null, isDestroyed = false)
  setToDestroyed(){
    this.NE = null; this.NW = null; this.SW = null; this.SE = null;
    this.isDestroyed = true; 
  } // Ends Function setToLeaf


  // Are all 4 corner pts of this quadnode within the query disk?
  qDiskSurrounds(diskPos,diskRad){
    if(!this.ptInQueryDisk(this.pt1.x, this.pt1.y, diskPos, diskRad)){return false;}
    if(!this.ptInQueryDisk(this.pt1.x, this.pt2.y, diskPos, diskRad)){return false;}
    if(!this.ptInQueryDisk(this.pt2.x, this.pt1.y, diskPos, diskRad)){return false;}
    if(!this.ptInQueryDisk(this.pt2.x, this.pt2.y, diskPos, diskRad)){return false;}
    return true;
  } // Ends Function qDiskSurrounds

  ptInQueryDisk(pX, pY, q, r){
    let deltaXSq = (pX-q.x)*(pX-q.x);
    let deltaYSq = (pY-q.y)*(pY-q.y);
    let distSq   = deltaXSq+deltaYSq;
    let radiusSq = r*r;
    if(distSq <= radiusSq){return true;}
    return false;
  } // Ends Function isPointInQueryDisk


  // Is the distance between midpoint of quadnode and query disk <= radius of query disk?
  qDiskIntersects(diskPos, diskRad){
    let HW = this.dim.wide/2;
    let nodeMidpt = createVector(this.pt1.x+HW, this.pt1.y+HW);

    let cDistX = abs(diskPos.x - nodeMidpt.x);
    let cDistY = abs(diskPos.y - nodeMidpt.y);
    if (cDistX > (HW + diskRad)) { return false; }
    if (cDistY > (HW + diskRad)) { return false; }
    if (cDistX <= HW) { return true; } 
    if (cDistY <= HW) { return true; }

    let cDistSq = (cDistX-HW)*(cDistX-HW) + (cDistY-HW)*(cDistY-HW);
    return (cDistSq <= (diskRad*diskRad));
  } // Ends Function qDiskIntersects


  render(){
    this.nodeCount.increment();

    if(this.isDestroyed){fill(this.fill_isDest);}
    else{fill(this.fill_noDest);}

    if(!this.dispEdges.get()){noStroke();}
    else{stroke(60);strokeWeight(1);}

    rect(this.pt1.x, this.pt1.y, this.dim.wide, this.dim.tall);
    if (this.NE!=null) {this.NE.render();}
    if (this.NW!=null) {this.NW.render();}
    if (this.SE!=null) {this.SE.render();}
    if (this.SW!=null) {this.SW.render();}
  } // Ends Function render

} // Ends Class QTNodeDest