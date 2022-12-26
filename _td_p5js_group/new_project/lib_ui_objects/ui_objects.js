
/** 
 * @typedef {object} p5js_stylesheet
 * @prop {object} fill_bg - object color when not clicked or toggled
 * @prop {object} fill_fg - object transparent color when clicked/toggled
 * @prop {object} strk_01 - border stroke color (in general)
 * @prop {object} strk_02 - border stroke color (if disabled {A/A})
 * @prop {object} sWgt_01 - default stroke weight (i.e. typical/base scenario)
 * @prop {object} sWgt_02 - special stroke weight (i.e. vfx if toggled/disabled)
 * @prop {object} colr_01 - default font/glyph color (i.e. typical/base scenario) 
 * @prop {object} colr_02 - special font/glyph color (i.e. vfx if disabled)
 * @prop {object} txtSize - in-canvas text ᴀᴋᴀ font size
 * @prop {object} txtOffX - `[x]` position offset of text (A/A else [0])
 * @prop {object} txtOffY - `[y]` position offset of text (A/A else [0])
 * */

/** Parent UIObject Class */
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

  }

  initStyles(){


    /** @type {p5js_stylesheet} */
    this.style = {
      fill_bg: color(0,120,255),
      fill_fg: color(240,240,240,50),
      strk_01: color(255,255,255),
      strk_02: color(180,180,180),
      colr_01: color(255,255,255),
      colr_02: color(180,180,180),
      sWgt_01:  1,
      sWgt_02:  4,
      txtSize: 18,
      txtOffX:  0,
      txtOffY: -4,
    }
  }

  /**
   * @summary Sets (i.e. overrides) values to style properties currently
   * defined by instance. If property does not exist: NO changes occur.
   * Note that the only data validation is checking for existence of the
   * specified property exists... ergo be careful with input thereto!
   * @param {*} id name of style property to be changed
   * @param {*} val val to set for style property specified by `id`
   * @returns {UIStyle} reference to instance, for function chaining 
   */
  setStyle(id,val){
    if(this.style[id]){this.style[id]=val;}
    else{console.warn(`WARNING: No property [style.${id}] currently exists in this object!`)}
    return this;
  }

  /**
   * @summary Basically: Plural form of `<setStyle>` via making multiple
   * calls thereto via input array of style `{property:value}` pairs.
   * @param {*} pairs `Array[n][2]` of form `n⨯[propID,propValue]`
   * @returns {UIStyle} reference to instance, for function chaining 
   */
  setStyles(pairs){
    pairs.forEach(e=>{this.setStyle(...e)});
    return this;
  }





  update(){
    this.mouseOver = (this.isMouseOver()) ? true : false;
  }


  isMouseOver(){
    return (mouseX >= this.pos.x && mouseX <= this.ePt.x && mouseY >= this.pos.y && mouseY <= this.ePt.y);
  }


  onMousePressed(){
     // Default behavior is to do nothing
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