SPManager spManager;
ArrayList<AgentRep> agents;
PVector mousePt = new PVector();
FPSUtil fps;

int numAgents = 3000;
boolean isPaused = true;

void setup(){
  fps = new FPSUtil();
  size(1000,1000);
  spManager = new SPManager(width,height,100);
  agents = new ArrayList<AgentRep>();
}

void draw(){
  background(24);
  // Transform mouse coords into unity's center-center origin
  mousePt.x = mouseX-width/2;
  mousePt.y = mouseY-height/2;
  // push viz by 1/2 horiz and vert to simulate unity's center-center origin
  pushMatrix();
  translate(width/2,height/2);
    if(!isPaused){
      createAgentsPerFrameQAD(1);
      for(AgentRep a : agents){a.update();}
    }
    
    for(AgentRep a : agents){a.getNeighbors();}
 
    spManager.disp(); 
    for(AgentRep a : agents){a.disp();} 
    onMouseOver();
  popMatrix();
  noStroke();fill(24,24,24,255);rect(0,0,200,50);fill(255);
  textAlign(LEFT);textSize(18);text("FPS = "+fps.UpdateAndGetFPS(12),15,25);
  textAlign(LEFT);textSize(18);text("# Agents = "+agents.size(),15,45);
}

void onMouseOver(){
  //spManager.highlightCellAndMembers(mousePt); 
  //spManager.highlightBinsInRange(mousePt,25);
  mouseOverAgentQAD();
}

void mouseOverAgentQAD(){
  for(AgentRep a : agents){
    if(a.mouseOverMe(mousePt)){
      a.highlightNeighbors();
      return;    
    }
  }   
}

void createAgentsPerFrameQAD(int factor){
  if(frameCount%1==0 && agents.size()<numAgents){
    for(int i=0; i<factor; i++){
      agents.add(new AgentRep(new PVector(0,0))); 
    }
  }
}

public ArrayList<AgentRep> getNeighborsNaive(AgentRep a, float range){
  ArrayList<AgentRep> ret = new ArrayList<AgentRep>();
  for(AgentRep oth : agents){
    if(oth != a && PVector.sub(oth.position,a.position).magSq() <= (range*range)){
      ret.add(oth);
    }
  }
  return ret;
}



void keyPressed(){
  if(key == 'p' || key == 'P'){
    isPaused = !isPaused;
  }
}


void mousePressed(){
  if(mouseButton==RIGHT){
    agents.add(new AgentRep(mousePt.copy()));
  }
}

void mouseDragged(){ 
  if(mouseButton==LEFT){
    for(AgentRep a : agents){
      if(a.mouseOverMe(mousePt)){
        a.position = mousePt.copy();
        return;
      }
    }  
  } 
}
