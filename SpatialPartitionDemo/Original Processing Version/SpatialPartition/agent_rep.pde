/*----------------------------------------------------------------------
|>>> How Agent interfaces with Grid-Bin Spatial Partition Manager.
+-----------------------------------------------------------------------
|  > A struct of 2 ints called 'Coord' should be defined, else could use
|    a Vector2 but need to use int casts and be careful with mapping of
|    implicit {row,col} with explicit {x,y}. Assume this struct exists
|    for remaining steps...
|  > Agent instances must add a Coord object to their state data called
|    'curCoord', representing current grid coordinate within the spatial
|    partition manager servicing them. This is so that manager can check
|    if agent left current cell in current frame, as to append agent to
|    new cell, delete agent from old cell, and update agent's 'curCoord'
|    struct with the new coordinate info. 
|      - Note: Originally tried using a Vector3 to keep agent's previous
|        position, but bugs occured.
|  > Agent instances also need float 'range' indicating desired diameter
|    within which to report neighbors. 
|      - Note: TTD could give spatial partition manager value of agent's
|        bounding circle/sphere too, for getting neighbors with respect
|        to mutual bounding shapes versus point-to-point, but KISS.
|  > Agent instances trivially need ArrayList of neighbors returned from
|    request of spatial partition manager to find its neighbors.
|  > Agent reports to spatial partition manager within Update() via call
|    of 'spManager.UpdateAgentPos(this)' i.e. passing itself as input.
|      - Note: Could try 'delta frame' updates to spManager, especially
|        if grids are large enough that small constant delta won't be
|        too inaccurate, but TTD and WLOG.
|  > Agent gets neighbors from spatial partition manager via call of
|    'neighbors.addAll(spManager.getNeighborsInRange(this,range))'. This
|    is done within agent function 'getNeighbors' which interfaces with
|    current StAgE system.
+---------------------------------------------------------------------*/
class AgentRep{

  PVector position;
  Coord curCoord;
  public String name;
  ArrayList<AgentRep> neighbors = new ArrayList<AgentRep>();
  
  PVector vel;
  float diam = 10;
  float range = 50;
  
  public AgentRep(PVector initPos){
    position = initPos;
    vel = new PVector(random(-8,8),random(-8,8));
  }
  
  public void update(){
    if ( position.x + diam >= width/2 || position.x - diam <= -width/2) {vel.x *= -1;}
    if ( position.y + diam >= height/2 || position.y - diam <= -height/2) { vel.y *= -1;} 
    position.add(vel);
    curCoord = spManager.UpdateAgentPos(this); 
  }
    
  public void getNeighbors(){
    neighbors.clear();
    neighbors.addAll(spManager.getNeighborsInRange(this,range));
    //neighbors.addAll(getNeighborsNaive(this,range));
  }
  
  public void disp(){noStroke();fill(0,255,0);ellipse(position.x,position.y,diam,diam);} 
  public void highlight(){noStroke();fill(255,255,0);ellipse(position.x,position.y,diam*2,diam*2); }
  public void highlightNeighbors(){
    noStroke();fill(255,180,0);for(AgentRep a : neighbors){ellipse(a.position.x,a.position.y,diam*2,diam*2);}
    noFill();stroke(0,180,255);ellipse(position.x,position.y,range*2,range*2);
  }
  
  public boolean mouseOverMe(PVector mPos){
    return (dist(mPos.x,mPos.y,position.x,position.y)<=diam) ? true : false;
  } // Ends Function mouseOverMe

}
