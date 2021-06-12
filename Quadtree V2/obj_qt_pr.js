/*======================================================================
|>>> Class QTNode
+-----------------------------------------------------------------------
| Description (QAD): Implements recursively structured Point Region (PR)
| Quadtree whose splitting policy triggers with 2+ points in a leaf and 
| stops when subquadrants would be less than 2x2 pixels.
+-----------------------------------------------------------------------
|> Implementation Note: This code aligns with existing PR-QT p5js demo,
|  even utilizing it for most of insert() and all of delete().
+=====================================================================*/
class QTNodePR{
  constructor(pt1, pt2){
    this.pt1 = pt1; // TOP-LEFT Point
    this.pt2 = pt2; // BOTTOM-RIGHT Point
    this.dim = {tall: (pt2.y - pt1.y), wide: (pt2.x - pt1.x)};

    this.NE  = null; // North-East Child
    this.NW  = null; // North-West Child
    this.SW  = null; // South-West Child
    this.SE  = null; // South-East Child

    this.storedPt = null;     // the point stored at this node (as p5.Vector)
    this.isContainer = false; // false-> empty QT xor leaf node

    //>>> Color and VFX Settings
    this.ptFill = color(0,255,0);
    this.ptStrk = color(0,180,60);
    this.sqStrk = color(60,128);
    this.sqFill = color(60,64);
    this.ptDiam = 5;
  } // Ends Constructor


  pointInBounds(pt){
    return (pt.x >= this.pt1.x && pt.x < this.pt2.x && pt.y >= this.pt1.y && pt.y < this.pt2.y);
  } // Ends Function ptInBounds


  insert(insPt){
    // not in bounds of this node (and subtree thereof) -> return false
    if (!this.pointInBounds(insPt)){return false;}

    // is in bounds and no existing pt -> store pt and return true
    if (!this.isContainer && this.storedPt == null){this.storedPt = insPt; return true;}

    if(this.NE == null){
      let HW = this.dim.wide/2; // *H*alf *W*idth (of this node's bounding square)

      // split would result in quadrants less than 2x2 -> REJECT!
      if(HW < 2){return false;}

      // split into 4 children: handling updates for both the [new] container and its children
      this.NW = new QTNodePR(vec2(this.pt1.x,    this.pt1.y),    vec2(this.pt1.x+HW, this.pt1.y+HW));
      this.NE = new QTNodePR(vec2(this.pt1.x+HW, this.pt1.y),    vec2(this.pt2.x,    this.pt1.y+HW));
      this.SW = new QTNodePR(vec2(this.pt1.x,    this.pt1.y+HW), vec2(this.pt1.x+HW, this.pt2.y));
      this.SE = new QTNodePR(vec2(this.pt1.x+HW, this.pt1.y+HW), vec2(this.pt2.x,    this.pt2.y));
      if (this.NW.pointInBounds(this.storedPt)) {this.NW.storedPt = this.storedPt;this.isContainer = true;} 
      else if (this.NE.pointInBounds(this.storedPt)) {this.NE.storedPt = this.storedPt;this.isContainer = true;} 
      else if (this.SE.pointInBounds(this.storedPt)) {this.SE.storedPt = this.storedPt;this.isContainer = true;} 
      else if (this.SW.pointInBounds(this.storedPt)) {this.SW.storedPt = this.storedPt;this.isContainer = true;}
      this.storedPt = null;
    }

    if (this.NW.insert(insPt)) {return true;}
    if (this.NE.insert(insPt)) {return true;}
    if (this.SW.insert(insPt)) {return true;}
    if (this.SE.insert(insPt)) {return true;}

    return false;
  } // Ends Function insert


  delete(delPt){
    // I am a leaf and point exists in my area -> set point to null and return
    if(!this.isContainer && this.pointInBounds(delPt)){this.storedPt = null; return;}

    // I am a container -> Recursive call into child containing the point
    if      (this.NW.pointInBounds(delPt)) {this.NW.delete(delPt);}
    else if (this.NE.pointInBounds(delPt)) {this.NE.delete(delPt);}
    else if (this.SE.pointInBounds(delPt)) {this.SE.delete(delPt);} 
    else if (this.SW.pointInBounds(delPt)) {this.SW.delete(delPt);}

    // At least 1 child is a container -> don't prune children yet
    let childrenAllLeaves = true;
    if (this.NW.isContainer) {childrenAllLeaves = false;}
    if (this.NE.isContainer) {childrenAllLeaves = false;}
    if (this.SE.isContainer) {childrenAllLeaves = false;}
    if (this.SW.isContainer) {childrenAllLeaves = false;}
    if(!childrenAllLeaves){return;}

    // All children are empty leaves -> prune them, make this node a leaf with no point, and return
    let nChildrenWithPts = 0;
    if (this.NW.storedPt != null) {nChildrenWithPts += 1;}
    if (this.NE.storedPt != null) {nChildrenWithPts += 1;}
    if (this.SE.storedPt != null) {nChildrenWithPts += 1;}
    if (this.SW.storedPt != null) {nChildrenWithPts += 1;}
    if(nChildrenWithPts==0){this.setToLeaf(); this.storedPt = null; return;}

    // Exactly 1 child has a point -> make this node a leaf with that point, prune them, and return
    if(nChildrenWithPts==1){
      if      (this.NW.storedPt!=null) {this.storedPt = this.NW.storedPt;}
      else if (this.NE.storedPt!=null) {this.storedPt = this.NE.storedPt;}
      else if (this.SE.storedPt!=null) {this.storedPt = this.SE.storedPt;}
      else if (this.SW.storedPt!=null) {this.storedPt = this.SW.storedPt;}
      this.setToLeaf();   
    }
  } // Ends Function delete


  // Sets this node to a leaf (i.e. all children = null, isContainer = false)
  setToLeaf(){
    this.NE = null; this.NW = null; this.SW = null; this.SE = null;
    this.isContainer = false;   
  } // Ends Function setToLeaf


  render(){
    strokeWeight(1); fill(this.sqFill); stroke(this.sqStrk);
    rect(this.pt1.x, this.pt1.y, this.dim.wide, this.dim.tall);

    if (this.NW!=null) {this.NW.render();}
    if (this.NE!=null) {this.NE.render();}
    if (this.SE!=null) {this.SE.render();}
    if (this.SW!=null) {this.SW.render();}

    if (this.storedPt != null && this.isContainer == false){
      stroke(this.ptStrk); fill(this.ptFill);
      ellipse(this.storedPt.x, this.storedPt.y, this.ptDiam, this.ptDiam);
    }
  } // Ends Function render

} // Ends Class QTNodePR