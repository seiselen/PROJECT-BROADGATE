import { UIObject } from "./ui_objects.js";

/*----------------------------------------------------------------------
|>>> class UIBuyButton (of superclass UIObject)
+-----------------------------------------------------------------------
| Description: x
| Side Note:   Button will poll bound state for now (to K.I.S.S.), but
|              can look into other design patterns i.e. 2-way messenger
|              s.t. the bound state will tell it if it can't be afforded
+---------------------------------------------------------------------*/
export class UIBuyButton extends UIObject{
  constructor(pos, dim, label=""){
    super(pos,dim);
    //> Subtype-Specific Style Setting[s]
    this.setStyle('fill_bg', color(144,144,144));
    this.setStyle('colr_01', color(0,0,0));
    this.setStyle('strk_02', color(60,60,60,128));
    //> Subtype-Specific State Component[s]
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
    super.update();
  } // Ends Function update

  render(){
    this.applyStyles(this.style.fill_bg, this.style.strk_01, this.style.sWgt_01);
    rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);

    this.applyStyles(this.style.colr_01);
    this.renderText();

    if(this.query()){
      if(this.mouseOver && mouseIsPressed){
        this.applyStyles(this.style.fill_fg, this.style.strk_01, this.style.sWgt_01);
        rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
      }
    }
    else{
      this.applyStyles(this.style.strk_02, this.style.strk_02, this.style.sWgt_02);      
      rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
    }
  } // Ends Function render

  onMousePressed(){
    if(this.mouseOver && this.action && this.query()){this.action();}
  } // Ends Function onMousePressed

} // Ends Class UIBuyButton