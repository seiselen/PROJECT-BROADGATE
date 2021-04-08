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
    this.isPressed = false;

    this.wide = keyLettWide;
    this.tall = keyLettTall;
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

    return this; // needed since chain-called (i.e. D3-style) with instantiation
  }

  toggle(){
    this.isPressed = !this.isPressed;
  }

  display(){
    stroke(255); fill( ((this.isPressed) ? this.pressedCol : this.releaseCol) );
    rect(this.pos.x, this.pos.y, this.wide, this.tall);
    noStroke(); fill(255); textSize(this.fontSize); textAlign(CENTER,CENTER);
    text(this.char,this.pos.x+this.xOff,this.pos.y+this.yOff);
  }
} // Ends Class KeyRep