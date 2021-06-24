class UIObject{
  constructor(pos, dim){
    //>>> 'Transform' State
    this.pos = pos;
    this.dim = dim;
    this.ePt = createVector(this.pos.x+this.dim.x,this.pos.y+this.dim.y);
    this.mPt = p5.Vector.mult(this.dim,0.5).add(this.pos);

    //>>> Other Common State
    this.mouseOver = false;
    this.text;

    //>>> VFX/GFX Variables <TODO: Bring back UIStyle obj for color/text?>
    this.textSize    = 18;
    this.textOff     = [0,0]; // offset [LEFT,DOWN] from top left corner
    this.col_text    = color(255,255,255);    
    this.col_border  = color(255,255,255);
    this.col_border2 = color(180,180,180);
    this.col_bground = color(0,120,255);
    this.col_fground = color(240,240,240,50);
  } // Ends Constructor

  update(){
    if(this.mouseOverMe()){this.mouseOver = true;}
    else{this.mouseOver = false;}
  } // Ends Function update

  mouseOverMe(){
    return (mouseX >= this.pos.x && mouseX <= this.ePt.x && mouseY >= this.pos.y && mouseY <= this.ePt.y);
  } // Ends Function mouseOverMe

  onMousePressed(){
     // Default behavior is to do nothing
  } // Ends Function onMousePressed

  // Use at own risk, as clearly not handled
  setStyle(id,val){
    this[id] = val;
    return this;
  }

  // Util that sets styles and whatnot
  setPredefStyle(objType){
    switch(objType){
      case "click":
        this.textOff     = [5,7];
        this.col_bground = color(144,144,144);
        this.col_text    = color(0,0,0);
        break;
      case "toggle":
        this.textOff     = [5,7];
        this.col_bground = color(144,144,144);
        this.col_fground = color(180,180,180,64);
        this.col_border2 = color(120,120,120);
        this.col_text    = color(0,0,0);
        break;
      case "label":
        this.textSize    = 32;
        this.col_bground = color(60,60,60,120);
        break;    
      case "label2":
        this.col_bground = color(60,60,60,120);
        break;
      case "label3":
        this.textOff     = [10,-9];
        this.col_border  = color(255,0);     
        this.col_bground = color(255,0);
        break;
      case "label_toggle": 
        this.textOff     = [10,6];
        this.col_T       = color(255);
        this.col_F       = color(0);
        break;
    }
    return this;
  } // Ends Function setPredefStyle

  renderTextViaTLCorner(){
    textAlign(LEFT,TOP);
    text(this.text,this.pos.x+this.textOff[0],this.pos.y+this.textOff[1]);
  }

  renderTextViaTRCorner(){
    textAlign(RIGHT,TOP);
    text(this.text,this.ePt.x-this.textOff[0],this.pos.y+this.textOff[1]);
  }

  renderTextViaCenter(){
    textAlign(CENTER,CENTER);    
    text(this.text,this.mPt.x+this.textOff[0],this.mPt.y+this.textOff[1]);
  }

} // Ends Class UIObject


/*----------------------------------------------------------------------
|>>> class UIContainer (of superclass UIObject)
+-----------------------------------------------------------------------
| Description: Functions as a 'panel' and container for other UIObject
|              types, such that all such objects (buttons, labels, etc.) 
|              should be placed within a UIContainer.
+---------------------------------------------------------------------*/
class UIContainer extends UIObject{
  constructor(pos, dim){
    super(pos,dim);
    this.children = [];
    this.hidden = false;
  } // Ends Constructor

  // should see if default parm val of 'val = !this.hidden' works
  setHidden(val){
    this.hidden = val;
  }

  addChildren(siblings){
    siblings.forEach(c => this.addChild(c));
    return this;
  } // Ends Function addChildren

  addChild(child){
    // offset child pos and ePt by parent's pos
    this.adjParentPosToChild(child,this.pos);
    this.children.push(child);
    return this;
  } // Ends Function addChild

  adjParentPosToChild(child,pos){
    child.pos.add(pos);
    child.ePt.add(pos);
    child.mPt.add(pos);
    // not FULLY tested more than 1 level, but is straightforward recursion so should work.
    if(child.children){child.children.forEach(c => child.adjParentPosToChild(c,pos));}
  }

  update(){
    if(this.hidden){return;}

    if(this.mouseOverMe()){this.mouseOver = true;}
    else{this.mouseOver = false;}
    this.children.forEach(c => c.update());
  } // Ends Function update

  render(){
    if(this.hidden){return;}

    strokeWeight(1); stroke(this.col_border); fill(this.col_bground);
    rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
    //noFill();ellipse(this.mPt.x,this.mPt.y,5,5);
    if(this.mouseOver){
      strokeWeight(4);noFill();
      rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
    }
    this.children.forEach(c => c.render());
  } // Ends Function render

  onMousePressed(){
    if(this.hidden){return;}
    this.children.forEach(c => c.onMousePressed());
  } // Ends Function onMousePressed

} // Ends Class UIContainer


/*----------------------------------------------------------------------
|>>> class UIClickButton (of superclass UIObject)
+-----------------------------------------------------------------------
| Description: Simple button that, when clicked by the mouse: highlights
|              while executing a [callback] method bound thereof.
+---------------------------------------------------------------------*/
class UIClickButton extends UIObject{
  constructor(pos, dim, label=""){
    super(pos,dim);
    this.text = label;
    this.action;
  } // Ends Constructor

  bindAction(act){
    this.action = act;
    return this;
  } // Ends Function bindAction

  update(){
    if(this.mouseOverMe()){this.mouseOver = true;}
    else{this.mouseOver = false;}
  } // Ends Function update

  render(){
    strokeWeight(1); stroke(this.col_border); fill(this.col_bground);
    rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);

    noStroke(); fill(this.col_text); textSize(this.textSize);
    this.renderTextViaTLCorner();

    if(this.mouseOver && mouseIsPressed){
      strokeWeight(4);fill(this.col_fground);
      rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
    }
  } // Ends Function render

  onMousePressed(){
    if(this.mouseOver && this.action){this.action();}
  } // Ends Function onMousePressed

} // Ends Class UIClickButton



/*----------------------------------------------------------------------
|>>> class UIBuyButton (of superclass UIObject)
+-----------------------------------------------------------------------
| Description: x
| Side Note:   Button will poll bound state for now (to K.I.S.S.), but
|              can look into other design patterns i.e. 2-way messenger
|              s.t. the bound state will tell it if it can't be afforded
+---------------------------------------------------------------------*/
class UIBuyButton extends UIObject{
  constructor(pos, dim, label=""){
    super(pos,dim);
    this.text = label;
    this.action;
    this.query;
  } // Ends Constructor

  bindAction(act){
    this.action = act;
    return this;
  } // Ends Function bindAction

  bindQuery(qry){
    this.query = qry;
    return this;
  } // Ends Function bindAction

  update(){
    if(this.mouseOverMe()){this.mouseOver = true;}
    else{this.mouseOver = false;}
  } // Ends Function update

  render(){
    strokeWeight(1); stroke(this.col_border); fill(this.col_bground);
    rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);

    noStroke(); fill(this.col_text); textSize(this.textSize);
    this.renderTextViaTLCorner();


    if(this.query()){
      if(this.mouseOver && mouseIsPressed){
        strokeWeight(4);fill(this.col_fground);
        rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
      }
    }

    else{
      strokeWeight(4);fill(this.col_border2);
      rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
    }




  } // Ends Function render

  onMousePressed(){
    if(this.mouseOver && this.action && this.query()){this.action();}
  } // Ends Function onMousePressed

} // Ends Class UIClickButton


/*----------------------------------------------------------------------
|>>> class UIToggleButton (of superclass UIObject)
+-----------------------------------------------------------------------
| Description: Simple button that, when clicked by the mouse: switches
|              between an on/off state, keeping its highlight until the 
|              'on' state is toggled back to 'off. For modularity and
|              decouple purposes: the toggle state will synch with its
|              bound variable only ONCE when first bound.
+---------------------------------------------------------------------*/
class UIToggleButton extends UIObject{
  constructor(pos, dim, label=""){
    super(pos,dim);
    this.text = label;
    this.state;
  } // Ends Constructor

  bindState(state){
    this.state = state;
    return this;
  } // Ends Function bindState

  update(){
    if(this.mouseOverMe()){this.mouseOver = true;}
    else{this.mouseOver = false;}
  } // Ends Function update

  render(){
    strokeWeight(1); stroke(this.col_border); fill(this.col_bground);
    rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);

    noStroke(); fill(this.col_text); textSize(this.textSize);
    this.renderTextViaTLCorner();

    if(this.state.val){
      strokeWeight(4); stroke(this.col_border2); fill(this.col_fground);
      rect(this.pos.x+2,this.pos.y+2,this.dim.x-4,this.dim.y-4); // 'magic vals', I know...
    }
  } // Ends Function render

  onMousePressed(){
    if(this.mouseOver){
      this.state.toggle();
    }
  } // Ends Function onMousePressed

} // Ends Class UIToggleButton


/*----------------------------------------------------------------------
|>>> class UILabel (of superclass UIObject)
+-----------------------------------------------------------------------
| Description: Simple text label, sits at its position and looks pretty.
|              If external state is bound to it - it will need to update
|              to reflect the value thereof. I'm currently doing this
|              every frame, but a more advanced 'onChanged' messaging
|              system could be utilized as well (but K.I.S.S. for now!)
+-----------------------------------------------------------------------
| Implementation Notes:
|  > Use mouse-over to implement a tooltip popup in a future version?
+---------------------------------------------------------------------*/
class UILabel extends UIObject{
  constructor(pos, dim, label=""){
    super(pos,dim);
    this.text = label;
    this.cBack;
  } // Ends Constructor

  // Used for manual setting (i.e. one-time at init <vs> needing updates)
  setText(text){
    this.text = text;
    return this;
  }

  bindCallback(cBack){
    this.cBack = cBack;
    this.text  = this.cBack();
    return this;
  } // Ends Function bindState

  update(){
    if(this.cBack){this.text = this.cBack();}
  } // Ends Function update

  render(){
    strokeWeight(1); stroke(this.col_border); fill(this.col_bground);
    rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);

    noStroke(); fill(this.col_text); textSize(this.textSize);

    this.renderTextViaCenter(); 
  } // Ends Function render

} // Ends Class UILabel



class UIToggleLabel extends UILabel{
  constructor(pos, dim, label=""){
    super(pos,dim,label);
    this.col_T = color(0,60,255);
    this.col_F = color(255,60,0);
  } // Ends Constructor


  // Used for manual setting (i.e. one-time at init <vs> needing updates)
  setText(text){
    this.text = text;
    return this;
  }


  bindCallback(cBack){
    this.cBack = cBack;
    this.text  = this.cBack();
    return this;
  } // Ends Function bindState


  update(){
    if(this.cBack){this.text = this.cBack();}
  } // Ends Function update


  render(){
    strokeWeight(1); stroke(this.col_border);

    switch(this.cBack()){
      case true:  fill(this.col_T); break;
      case false: fill(this.col_F); break;
    }

    rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);

    noStroke(); textSize(this.textSize);
    switch(this.cBack()){
      case true:  fill(this.col_F); this.renderTextViaTLCorner(); break;
      case false: fill(this.col_T); this.renderTextViaTRCorner(); break;
    }

  } // Ends Function render

} // Ends Class UILabel