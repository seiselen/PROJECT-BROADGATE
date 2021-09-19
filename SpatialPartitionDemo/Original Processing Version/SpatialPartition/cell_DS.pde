class SPCell{
  PVector TL;  // World-Space coordinate of top-left of this cell
  PVector MP;  // World-Space coordinate of center-center of this cell
  float dim;   // Dimension of this square cell i.e. both width and height 
  Coord coord; // Coordinate of spatial partition manager corresponding to this cell
  boolean isHighlighted = false; // used for debug in Processing, remove for Unity
  ArrayList<AgentRep> agents = new ArrayList<AgentRep>(); // List of agents within this cell
  
  // Constructor: spatial partition manager informs it location, dimension, and coordinates
  public SPCell(PVector tl,float d,Coord c){
    TL=tl;
    dim = d;
    MP = new PVector( TL.x+(dim/2), TL.y+(dim/2));
    coord = c;
  }
  
  // used for debug in Processing, remove for Unity
  public void highlight(boolean status){
    isHighlighted = status;
  }
  
  // used for debug in Processing, remove for Unity
  public void disp(){
    stroke(180);strokeWeight(2);
    if(isHighlighted){ fill(120,60,0,128);}else{noFill();}
    rect(TL.x,TL.y,dim,dim);
    if(isHighlighted){for(AgentRep a : agents){a.highlight();}} 
    fill(180);textSize(14);textAlign(CENTER);
    text("("+coord.row+","+coord.col+")",MP.x,MP.y-7);
    text("Pop: "+agents.size(),MP.x,MP.y+7);
  }
  
  // used for debug in Processing, can remove or keep for Unity
  public PVector GetMidPt(){
    return MP;
  }
  
} // Ends Class SPCell
