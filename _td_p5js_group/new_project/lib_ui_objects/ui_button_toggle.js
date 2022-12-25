import { UIObject } from "./ui_objects.js";

/*----------------------------------------------------------------------
|>>> class UIToggleButton (of superclass UIObject)
+-----------------------------------------------------------------------
| Purpose: Button s.t. if clicked with mouse hovering over it: switches
|          between an on/off state visually while toggling the boolean
|          value asssociated thereto. I'll be using a new idea this time
|          around: <vs> doing an [OnInit] sync of a bound simple wrapped
|          boolean; I will instead require a getter and setter method be
|          bound. A benefit of this is that ANY bool can now be managed
|          and sync'd with (if'n assuming the getter and setter thereof
|          are implemented correctly). Further: alhough this does mean
|          that the getter and setter must be 'spam-polled' every frame,
|          isn't that effectively the same computation work as doing so
|          for a local bool alongside having to call the bound method?
+---------------------------------------------------------------------*/
export class UIToggleButton extends UIObject{

  constructor(pos, dim, label=""){
    super(pos,dim);
    //> Subtype-Specific Style Setting[s]
    this.style.fill_bg = color(144,144,144);
    this.style.fill_fg = color(180,180,180,64);
    this.style.strk_02 = color(120,120,120);
    this.style.colr_01 = color(0,0,0);
    this.style.swgt_TL = +2; // in-border stroke for toggle VFX
    this.style.swgt_BR = -4; // in-border stroke for toggle VFX    
    //> Subtype-Specific State Component[s]
    this.text = label;
    this.boundGet = ()=>{console.log('NO GETTER!'); return false;}
    this.boundSet = ()=>{console.log('NO SETTER!'); return false;}
  } // Ends Constructor

  bindValueGetter(mGet){
    this.boundGet = mGet; return this;
  }

  bindValueSetter(mSet){
    this.boundSet = mSet; return this;
  }
  
  update(){
    super.update();
  } // Ends Function update

  render(){
    this.applyStyles(this.style.fill_bg, this.style.strk_01, this.style.sWgt_01);
    rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);

    this.applyStyles(this.style.colr_01);
    this.renderText();

    if(this.boundGet()){
      this.applyStyles(this.style.fill_fg, this.style.strk_02, this.style.sWgt_02);
      rect(this.pos.x+this.style.swgt_TL,this.pos.y+this.style.swgt_TL,this.dim.x+this.style.swgt_BR,this.dim.y+this.style.swgt_BR);
    }
  } // Ends Function render

  onMousePressed(){
    if(this.mouseOver){this.boundSet();}
  } // Ends Function onMousePressed

} // Ends Class UIToggleButton