

class UIStyle{
  constructor(){
    this.col_background = color(0,120,255);      // Color when not clicked or toggled
    this.col_foreground = color(255,255,255,50); // Transparent color when clicked or toggled
    this.col_border     = color(0,255,0);        // Border stroke color for owner shape
    this.col_text       = color(255,255,255);    // Text color, 'Nuff Said
    this.textSize       = 32;                    // Text size, 'Nuff Said
  }

  setup_headerLabel(){
    this.col_background = color(255,120,0);
    this.col_border     = color(255,255,255,0);
    return this; // for chain calls via instantiation (vis-a-vis D3 lib)
  }  
  
  setup_staticLabel(){
    this.col_background = color(255,255,255,0);
    this.col_border     = color(255,255,255,0);
    return this; // for chain calls via instantiation (vis-a-vis D3 lib)
  }
  
  setup_dynamicLabel(){
    this.col_background = color(255,120,0);
    this.col_border     = color(255,255,255,0);
    return this; // for chain calls via instantiation (vis-a-vis D3 lib)
  } 

}