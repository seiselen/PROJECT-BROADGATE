import { UIObject } from "./ui_objects.js";

/*======================================================================
|>>> class UIContainer (of superclass UIObject)
+=======================================================================
| Description: Functions as a 'panel' and container for other UIObject
|              types, such that all such objects (buttons, labels, etc.) 
|              should be placed within a UIContainer.
+=====================================================================*/
export class UIContainer extends UIObject{
  constructor(pos, dim){
    super(pos,dim);
    //> Subtype-Specific Style Setting[s]
    this.sWgt_02 = 4;
    //> Subtype-Specific State Component[s]
    this.children = [];
    this.isHidden = false;
  } // Ends Constructor



  //> NOTE: implements 'toggleHidden' if no parm vals entered!
  setHidden(val=undefined){
    this.isHidden (val) ? val : !this.isHidden;
    return this;
  }


  /*--------------------------------------------------------------------
  |>>> Function addChildren
  +---------------------------------------------------------------------
  | Purpose: Adds multiple UIObject types via calls to <addChildren>.
  | Inputs:  ⬝ [cs] Children UIObjects to be added as components of this
  |                 instance. Also yeah I'm using scheme variable names,
  |                 fool - what of it?!? Man... Fuck You and your bone 
  |                 spurs!!! <https://youtu.be/hrmQ_qRPKyE&t=265s>
  +-------------------------------------------------------------------*/
  addChildren(cs){
    cs.forEach(c => this.addChild(c));
    return this;
  } // Ends Function addChildren


  /*--------------------------------------------------------------------
  |>>> Function addChildren
  +---------------------------------------------------------------------
  | Purpose: Adds a UIObject type to this instance as a component. Note
  |          that this may include other UIContainers, which may in turn
  |          contain their own child components (that's the idea, duh!)
  | Inputs:  ⬝ [child] UIObject to be added as component of this object.               
  +-------------------------------------------------------------------*/  
  addChild(child){
    // offset child pos and ePt by parent's pos
    this.offsetChildPostToParent(child,this.pos);
    this.children.push(child);
    return this;
  } // Ends Function addChild

  offsetChildPostToParent(child,pos){
    child.pos.add(pos);
    child.ePt.add(pos);
    child.mPt.add(pos);
    // not FULLY tested more than 1 level, but is straightforward recursion so should work.
    if(child.children){child.children.forEach(c => child.offsetChildPostToParent(c,pos));}
  }



  update(){
    if(this.hidden){return;}
    super.update();
    this.children.forEach(c => c.update());
  } // Ends Function update


  render(){
    if(this.hidden){return;}
    strokeWeight(this.style.sWgt_01);
    stroke(this.style.strk_01);
    fill(this.style.fill_bg);
    rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
    this.renderEllipseAtMidpoint(); // typically commented out, as DEBUG purpose only
    if(this.mouseOver){this.renderBorderHighlight();}
    this.children.forEach(c => c.render());
  } // Ends Function render


  renderBorderHighlight(){
    strokeWeight(this.style.sWgt_02);
    noFill();
    rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
  }


  // draw ellipse at midpoint
  renderEllipseAtMidpoint(){
    noFill();
    stroke(this.style.strk_01);
    strokeWeight(this.style.sWgt_01); 
    ellipse(this.mPt.x,this.mPt.y,5,5); 
  }


  onMousePressed(){
    if(this.hidden){return;}
    this.children.forEach(c => c.onMousePressed());
  } // Ends Function onMousePressed
} // Ends Class UIContainer