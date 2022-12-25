export class UIObject{
  static TextAlignmentType = {
    CENTER:0, TOP_LEFT:1, TOP_RIGHT:2
  }

  constructor(pos, dim){
    this.pos = pos;
    this.dim = dim;
    this.ePt = vec2(this.pos.x+this.dim.x,this.pos.y+this.dim.y);
    this.mPt = p5.Vector.mult(this.dim,0.5).add(this.pos);

    this.alignment = UIObject.TextAlignmentType.CENTER;
    this.text;
    this.mouseOver = false;

    this.initStyles();
  } // Ends Constructor

  /*> TEMP UNTIL 'In-Canvas UI and Menus' FULLY PORTED
      ⬝ fill_bGround ⬌ fill_bg
      ⬝ fill_fGround ⬌ fill_fg
      ⬝ strk_border  ⬌ strk_01
      ⬝ strk_border2 ⬌ strk_02
      ⬝ strk_weight  ⬌ sWgt_01
      ⬝ strk_weight2 ⬌ sWgt_02
      ⬝ fill_text    ⬌ colr_01
      ⬝ fill_text2   ⬌ colr_02
      ⬝ textSize     ⬌ txtSize


      ⯈ label
        this.txtSize = 32;
        this.fill_bg = color(60,60,60,120); 
      ⯈ label_2
        this.fill_bg = color(60,60,60,120);
      ⯈ label_3
        this.textOff = [10,-9];
        this.strk_01 = color(255,0);     
        this.fill_bg = color(255,0);

  */

  //> Basically: more-or-less models CSS
  initStyles(){
    this.style = {
      fill_bg: color(0,120,255),      // object color when not clicked or toggled
      fill_fg: color(240,240,240,50), // object transparent color when clicked/toggled
      strk_01: color(255,255,255),    // border stroke color (in general)
      strk_02: color(180,180,180),    // border stroke color (if disabled {A/A})
      sWgt_01: 1,
      sWgt_02: 4,
      colr_01: color(255,255,255),    // font/glyph/etc. color (in general)
      colr_02: color(180,180,180),    // font/glyph/etc. color (if disabled {A/A})
      txtSize: 18,                    // size of text ᴀᴋᴀ font
      txtOffX: 0,                     // [x] position offset of text (A/A else [0])
      txtOffY: 0,                     // [y] position offset of text (A/A else [0])
    }
  }



  update(){
    this.mouseOver = (this.isMouseOver()) ? true : false;
  } // Ends Function update

  isMouseOver(){
    return (mouseX >= this.pos.x && mouseX <= this.ePt.x && mouseY >= this.pos.y && mouseY <= this.ePt.y);
  } // Ends Function isMouseOver

  onMousePressed(){
     // Default behavior is to do nothing
  } // Ends Function onMousePressed



  setStyle(id,val){
    if(this.styles[id]){this.styles[id]=val;}
    return this;
  }

  //====================================================================
  //>>> RENDER METHODS
  //====================================================================

  /**
   * @summary 'Syntactic Sugar' that calls VERY common set of three P5JS
   * style methods {fill, stroke, stroke-weight} with resp. parm inputs.
   * @param {*} fill `p5.color` to be input into `fill()`
   * @param {*} strk `p5.color` to be input into `stroke()`
   * @param {*} swgt `p5.color` to be input into `strokeWeight()`
   */
  applyStyles(v_fill=null,v_strk=null,v_swgt=null){
    if(v_fill){fill(v_fill)}   else{noFill()}
    if(v_strk){stroke(v_strk)} else{noStroke()}
    if(v_swgt){strokeWeight(v_swgt)}
  }

  renderText(){
    textSize(this.style.txtSize);
    switch(this.alignment){
      case UIObject.TextAlignmentType.CENTER:
        textAlign(CENTER,CENTER);
        text(this.text,this.mPt.x+this.style.txtOffX,this.mPt.y+this.style.txtOffY);
        return;
      case UIObject.TextAlignmentType.TOP_LEFT:
        textAlign(LEFT,TOP);
        text(this.text,this.pos.x+this.style.txtOffX,this.pos.y+this.style.txtOffY);
        return;
      case UIObject.TextAlignmentType.TOP_RIGHT:
        textAlign(RIGHT,TOP);
        text(this.text,this.ePt.x-this.style.txtOffX,this.pos.y+this.style.txtOffY);
        return;  
    }
  }


} // Ends Class UIObject