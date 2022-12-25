import { UIObject } from "./ui_objects.js";

/*----------------------------------------------------------------------
|>>> class UIClickButton (of superclass UIObject)
+-----------------------------------------------------------------------
| Description:  Implements a simple button that, when clicked while the
|               mouse is over it, will change the visual effect of the
|               button while calling the [callback] method bound to it.
| Dependencies: Uses p5js global var 'mouseIsPressed'
+---------------------------------------------------------------------*/
export class UIClickButton extends UIObject{
  constructor(pos, dim, label=""){
    super(pos,dim);
    //> Subtype-Specific Style Setting[s]
    this.textOff = [5,7];
    this.style.fill_bg = color(144,144,144);
    this.style.colr_01 = color(0,0,0);
    //> Subtype-Specific State Component[s]
    this.text = label;
    this.action;
  } // Ends Constructor

  bindAction(act){
    this.action = act;
    return this;
  } // Ends Function bindAction


  update(){
    super.update();
  } // Ends Function update

  render(){
    this.applyStyles(this.style.fill_bg, this.style.strk_01, this.style.sWgt_01);
    rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);

    this.applyStyles(this.style.colr_01);
    this.renderText();

    if(this.mouseOver && mouseIsPressed){
      this.applyStyles(this.style.fill_fg, this.style.strk_01, this.style.sWgt_02);
      rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
    }
  } // Ends Function render

  onMousePressed(){
    if(this.mouseOver && this.action){this.action();}
  }

} // Ends Class UIClickButton