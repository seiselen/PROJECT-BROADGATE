// added all on 7/21/21 while working on P5JS improved verz
void init_UI(){UI_initActions(); UI_initObjects();}

void UI_initActions(){
  ui.registerNewAction(PLM, "incNoiseScale");
  ui.registerNewAction(PLM, "decNoiseScale");
  ui.registerNewAction(PLM, "incOctaves");
  ui.registerNewAction(PLM, "decOctaves");
  ui.registerNewAction(PLM, "incPersist");
  ui.registerNewAction(PLM, "decPersist");
  ui.registerNewAction(PLM, "incLacunar");
  ui.registerNewAction(PLM, "decLacunar");
  ui.registerNewAction(PLM, "incOffsetX");
  ui.registerNewAction(PLM, "incOffsetY");
  ui.registerNewAction(PLM, "decOffsetX");
  ui.registerNewAction(PLM, "decOffsetY");  
  ui.registerKeyAndNewAction('g', PLM, "toggleGrid"); // added 7/21/21 while working on P5JS improved verz   
} // Ends Function UI_initActions

void UI_initObjects(){
  String uiName = "sidebarUI";
  int bWide = 150; int bTall = 30; int bPosX = 15;
  int yOff  = 0;   int ySep  = bTall/2;  
  ui.newContainer(screenWide, 0, width, height, uiName);
  ui.addClickButton(bPosX,yOff+=10,bWide,bTall,uiName,"Noise Scale +", "incNoiseScale");
  ui.addClickButton(bPosX,yOff+=bTall,bWide,bTall,uiName,"Noise Scale -", "decNoiseScale");
  ui.addClickButton(bPosX,yOff+=bTall+ySep,bWide,bTall,uiName,"Persist +", "incPersist" );
  ui.addClickButton(bPosX,yOff+=bTall,bWide,bTall,uiName,"Persist -", "decPersist");   
  ui.addClickButton(bPosX,yOff+=bTall+ySep,bWide,bTall,uiName,"Lacunarity +", "incLacunar");
  ui.addClickButton(bPosX,yOff+=bTall,bWide,bTall,uiName,"Lacunarity -", "decLacunar");   
  ui.addClickButton(bPosX,yOff+=bTall+ySep,bWide,bTall,uiName,"Octaves +", "incOctaves");
  ui.addClickButton(bPosX,yOff+=bTall,bWide,bTall,uiName,"Octaves -", "decOctaves"); 
  ui.addClickButton(bPosX,yOff+=bTall+ySep,bWide,bTall,uiName,"Octave Off X+", "incOffsetX");
  ui.addClickButton(bPosX,yOff+=bTall,bWide,bTall,uiName,"Octave Off X-", "decOffsetX");
  ui.addClickButton(bPosX,yOff+=bTall,bWide,bTall,uiName,"Octave Off Y+", "incOffsetY");
  ui.addClickButton(bPosX,yOff+=bTall,bWide,bTall,uiName,"Octave Off Y-", "decOffsetY"); 
} // Ends Function UI_initObjects
