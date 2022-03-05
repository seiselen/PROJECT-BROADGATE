/*----------------------------------------------------------------------
|>>> Class KeyRep - QAD Notes
+-----------------------------------------------------------------------
| Description: Implements the virtual representation of a single key for
|              a greater set which compose the virtual keyboard. There's
|              enough comments/documentation for now, as I want to get 
|              this out per Broadgate/Spellbreaker ops.
+---------------------------------------------------------------------*/
class KeyRep{
  constructor(posX,posY,key,name=""){
    this.pos = createVector(posX,posY);
    this.key = key;
    this.char = (name=="") ? char(this.key) : name;
    this.isKBPressed = false;
    this.isMPPressed = false;

    this.wide = keyLettWide;
    this.tall = keyLettTall;
    this.ePt = createVector(this.pos.x+this.wide,this.pos.y+this.tall);
    this.xOff = 20;
    this.yOff = 20;

    this.fontSize = 18;

    this.pressedCol = color(240,120,0);
    this.releaseCol = color(0,120,240); 
  }

  // For non-alphabet keys (i.e. 'Shift', 'Caps Lock', etc.)
  setCustomDims(wide,xOff,fSize=0){
    this.wide = wide;
    this.xOff = xOff;
    if(fSize>0){this.fontSize=fSize;}

    // hard hack for enter key to set VERTICAL size, since it's only one that needs this
    if(fSize<0){this.tall = abs(fSize);}

    this.ePt = createVector(this.pos.x+this.wide,this.pos.y+this.tall);

    return this; // needed since chain-called (i.e. D3-style) with instantiation
  }

  toggleViaKB(){
    this.isKBPressed = !this.isKBPressed;
  }

  pressViaMouse(){
    this.isMPPressed = true;
  }

  releaseViaMouse(){
    this.isMPPressed = false;
  }

  onMousePressed(){
    if(this.mouseOverMe()){
      this.pressViaMouse();
      console.log(this.key);
      return;
    }
    this.releaseViaMouse();
  }

  mouseOverMe(){
    return (mouseX>this.pos.x)&&(mouseY>this.pos.y)&&(mouseX<this.ePt.x)&&(mouseY<this.ePt.y);
  }

  display(){
    stroke(255); fill( ((this.isKBPressed||this.isMPPressed) ? this.pressedCol : this.releaseCol) );
    rect(this.pos.x, this.pos.y, this.wide, this.tall);
    noStroke(); fill(255); textSize(this.fontSize); textAlign(CENTER,CENTER);
    text(this.char,this.pos.x+this.xOff,this.pos.y+this.yOff);
  }
} // Ends Class KeyRep