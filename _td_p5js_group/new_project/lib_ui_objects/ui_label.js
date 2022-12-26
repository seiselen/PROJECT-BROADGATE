import { UIObject } from "./ui_objects.js";

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
export class UILabel extends UIObject{
  constructor(pos, dim, label=""){
    super(pos,dim);
    //> Subtype-Specific Style Setting[s]
    this.txtSize = 32;
    this.fill_bg = color(60,60,60,120); 
    //> Subtype-Specific State Component[s]
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
    this.applyStyles(this.style.fill_bg, this.style.strk_01, this.style.sWgt_01);
    rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
    this.applyStyles(this.style.colr_01);
    this.renderText();
  } // Ends Function render

} // Ends Class UILabel