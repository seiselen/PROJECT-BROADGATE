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
    super.update();
  } // Ends Function update

  render(){
    strokeWeight(this.style.strk_weight);stroke(this.style.strk_border);fill(this.style.fill_bGround);
    rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);

    noStroke();fill(this.style.fill_text);textSize(this.style.textSize);
    this.renderTextViaTLCorner();

    if(this.query()){
      if(this.mouseOver && mouseIsPressed){
        strokeWeight(this.style.strk_weight);stroke(this.style.strk_border);fill(this.style.fill_fGround);
        rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
      }
    }
    else{
      strokeWeight(this.style.strk_weight2);fill(this.style.strk_border2);
      rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
    }
  } // Ends Function render

  onMousePressed(){
    if(this.mouseOver && this.action && this.query()){this.action();}
  } // Ends Function onMousePressed

} // Ends Class UIBuyButton