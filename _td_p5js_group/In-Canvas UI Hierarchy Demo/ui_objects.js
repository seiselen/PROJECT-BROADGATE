class UIObject{
  constructor(pos, dim){
    //>>> Transform State
    this.pos = pos;
    this.dim = dim;
    this.ePt = createVector(this.pos.x+this.dim.x,this.pos.y+this.dim.y);
    this.mid = p5.Vector.mult(this.dim,0.5).add(this.pos);

    //>>> Children UIObjects (TEMP - SHOULD BE FOR UIContainer ONLY!)
    this.children = [];

    //>>> Flags and Triggers
    this.mouseOver = false;

    //>>> VFX/GFX Variables <TODO: Bring back UIStyle obj for color/text?>
    this.col_border  = color(255,255,255);
    this.col_bground = color(0,120,255);
    this.col_fground = color(240,240,240,50);

  }

  update(){
    if(this.mouseOverMe()){
      this.mouseOver = true;
    }
    else{
      this.mouseOver = false;
    }

    this.children.forEach(c => c.update());
  }

  addChildren(siblings){
    siblings.forEach(c => this.addChild(c));
  }

  addChild(child){
    // offset child pos and ePt by parent's pos
    child.pos.add(this.pos);
    child.ePt.add(this.pos);
    child.mid.add(this.pos);
    this.children.push(child);
  }

  setColor(id,col){
    switch(id){
      case "bd": this.col_border  = col; break;
      case "bg": this.col_bground = col; break;
      case "fg": this.col_fground = col; break;
    }
    return this; // for chain-init method (a-la D3)
  }


  mouseOverMe(){
    return (mouseX >= this.pos.x && mouseX <= this.ePt.x && mouseY >= this.pos.y && mouseY <= this.ePt.y);
  }




  render(){
    strokeWeight(1); stroke(this.col_border); fill(this.col_bground);
    rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
    noFill();ellipse(this.mid.x,this.mid.y,5,5);
    if(this.mouseOver){
      strokeWeight(4); fill(this.col_fground);
      rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
    }
    this.children.forEach(c => c.render());
  } // Ends Function render





}