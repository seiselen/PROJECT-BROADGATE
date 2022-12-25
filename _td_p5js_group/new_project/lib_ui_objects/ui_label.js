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
  } // Ends Function setText

  bindCallback(cBack){
    this.cBack = cBack;
    this.text  = this.cBack();
    return this;
  } // Ends Function bindState

  update(){
    if(this.cBack){this.text = this.cBack();}
  } // Ends Function update

  render(){
    strokeWeight(this.style.strk_weight);stroke(this.style.strk_border);fill(this.style.fill_bGround);
    rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);

    noStroke();fill(this.style.fill_text);textSize(this.style.textSize);
    this.renderTextViaCenter(); 
  } // Ends Function render

} // Ends Class UILabel