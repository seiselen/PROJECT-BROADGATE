/*======================================================================
|>>> Class QTNode
+-----------------------------------------------------------------------
| Description (QAD): Implements recursively structured Point Region (PR)
| Quadtree whose splitting policy triggers with 2+ points in a leaf and 
| stops when subquadrants would be less than 2x2 pixels.
+=====================================================================*/
class QTNode{
  constructor(pt1, pt2){
    this.pt1 = pt1; // TOP-LEFT Point
    this.pt2 = pt2; // BOTTOM-RIGHT Point
    this.dim = {tall: (pt2.y - pt1.y), wide: (pt2.x - pt1.x)};

    this.NE = null;
    this.NW = null;
    this.SW = null;
    this.SE = null;

    this.storedPt = null;
    this.isContainer = false;

    //>>> Color and VFX Settings
    this.ptFill = color(0,255,0);
    this.ptStrk = color(0,180,60);
    this.sqStrk = color(60,128);
    this.sqFill = color(60,64);
    this.ptDiam = 5;
  }

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

      this.NW = new QTNode(vec2(this.pt1.x,    this.pt1.y),    vec2(this.pt1.x+HW, this.pt1.y+HW));
      this.NE = new QTNode(vec2(this.pt1.x+HW, this.pt1.y),    vec2(this.pt2.x,    this.pt1.y+HW));
      this.SW = new QTNode(vec2(this.pt1.x,    this.pt1.y+HW), vec2(this.pt1.x+HW, this.pt2.y));
      this.SE = new QTNode(vec2(this.pt1.x+HW, this.pt1.y+HW), vec2(this.pt2.x,    this.pt2.y));

      if (this.NW.pointInBounds(this.storedPt)) {
        this.NW.storedPt = this.storedPt;
        this.isContainer = true;
      } 
      else if (this.NE.pointInBounds(this.storedPt)) {
        this.NE.storedPt = this.storedPt;
        this.isContainer = true;
      } 
      else if (this.SE.pointInBounds(this.storedPt)) {
        this.SE.storedPt = this.storedPt;
        this.isContainer = true;
      } 
      else if (this.SW.pointInBounds(this.storedPt)) {
        this.SW.storedPt = this.storedPt;
        this.isContainer = true;
      }

      this.storedPt = null;
    }

    if (this.NW.insert(insPt)) {return true;}
    if (this.NE.insert(insPt)) {return true;}
    if (this.SW.insert(insPt)) {return true;}
    if (this.SE.insert(insPt)) {return true;}

    return false;

  } // Ends Function insert

  render(){
    strokeWeight(1);
    fill(this.sqFill); stroke(this.sqStrk);
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

} // Ends Class QTNode



/*======================================================================
|>>> Class QTDiagramNode
+-----------------------------------------------------------------------
| Description (QAD): Implements simple 'R-Tree style' visualization of
| the Quadtree as a DAG tree of Branching Factor {0,4}. Gets very wide,
| very quickly and I'd like to use "better" algorithm, but will forego
| that battle for now to K.I.S.S. and get the otherwise working demo up.
+-----------------------------------------------------------------------
| Implementation Note: The following is needed to get this working...
|
| var showQTDiag = true;                   // as a global variable
|
| if(showQTDiag){qtUpdateDiag();}          // in setup() after initializing QT
|
| if(showQTDiag){QT.diagNode.render();}    // in draw() after rendering QT
|
| if(showQTDiagram){qtUpdateDiag();}       // after inserting point into QT
|
| this.diagNode = new QTDiagramNode(this); // in QTNode constructor
|
| function qtUpdateDiag(){                 // for use with the aforementioned
|   QT.diagNode.calcBBox();
|   QT.diagNode.calcPos((width/2)-(QT.diagNode.dim/2));  
| }
+=====================================================================*/
class QTDiagramNode{
  static bboxDiam = 8;
  static bboxMarg = 4;
  static yOffset  = 24;

  constructor(node){
    this.node = node;
    this.pos = vec2();
    this.dim = 0;
    this.mid = 0;
  }

  calcBBox(){
    this.dim = 0;

    if(this.node.NW!=null){this.node.NW.diagNode.calcBBox();}
    if(this.node.NE!=null){this.node.NE.diagNode.calcBBox();}
    if(this.node.SW!=null){this.node.SW.diagNode.calcBBox();}
    if(this.node.SE!=null){this.node.SE.diagNode.calcBBox();}

    if(!this.node.isContainer){
      this.dim = QTDiagramNode.bboxDiam;
    }
    else{
      // As wide as the total width of my childrens' bounding boxes
      if (this.node.NW!=null){this.dim += this.node.NW.diagNode.dim;}
      if (this.node.NE!=null){this.dim += this.node.NE.diagNode.dim;}
      if (this.node.SE!=null){this.dim += this.node.SE.diagNode.dim;}
      if (this.node.SW!=null){this.dim += this.node.SW.diagNode.dim;}   
      // Plus the partition space between them
      this.dim += 3*QTDiagramNode.bboxMarg;      
    }
  } // Ends Function calcBBox

  calcPos(posX){
    this.pos.x  = posX;
    this.mid    = this.pos.x + (this.dim/2);
    let curWide = this.pos.x;

    if (this.node.NW!=null){this.node.NW.diagNode.calcPos(curWide); curWide += this.node.NW.diagNode.dim + QTDiagramNode.bboxMarg;}
    if (this.node.NE!=null){this.node.NE.diagNode.calcPos(curWide); curWide += this.node.NE.diagNode.dim + QTDiagramNode.bboxMarg;}
    if (this.node.SE!=null){this.node.SE.diagNode.calcPos(curWide); curWide += this.node.SE.diagNode.dim + QTDiagramNode.bboxMarg;}
    if (this.node.SW!=null){this.node.SW.diagNode.calcPos(curWide); curWide += this.node.SW.diagNode.dim + QTDiagramNode.bboxMarg;}    
  } // Ends Function calcPos

  render(off=QTDiagramNode.yOffset){
    strokeWeight(1); stroke(60);

    if (this.node.NW!=null) {
      line(this.mid, off, this.node.NW.diagNode.mid, off+QTDiagramNode.yOffset);
      this.node.NW.diagNode.render(off+QTDiagramNode.yOffset);
    }
    if (this.node.NE!=null) {
      line(this.mid, off, this.node.NE.diagNode.mid, off+QTDiagramNode.yOffset);
      this.node.NE.diagNode.render(off+QTDiagramNode.yOffset);
    }
    if (this.node.SE!=null) {
      line(this.mid, off, this.node.SE.diagNode.mid, off+QTDiagramNode.yOffset);
      this.node.SE.diagNode.render(off+QTDiagramNode.yOffset);
    }
    if (this.node.SW!=null) {
      line(this.mid, off, this.node.SW.diagNode.mid, off+QTDiagramNode.yOffset);
      this.node.SW.diagNode.render(off+QTDiagramNode.yOffset);
    }
    
    if(this.node.isContainer){fill(0,120,240);}
    else if (this.node.storedPt==null){fill(60);}
    else{fill(0,216,0);}

    ellipse(this.mid,off-QTDiagramNode.bboxMarg+(QTDiagramNode.bboxDiam/2),QTDiagramNode.bboxDiam,QTDiagramNode.bboxDiam);
  } // Ends Function render

} // Ends Class QTDiagramNode