/*======================================================================
| Project: Perlin Noise - based Procedural Landmass Experiment
| Author:  Steven Eiselen, University of Arizona Computer Science 
| Source:  Sebastian Lague Series on Procedural Landmass Creation, link
|          to series first video: www.youtube.com/watch?v=wbpMiKiSKm8
| Assets:  Did you import libraries, copy over code from other projects
+-----------------------------------------------------------------------
| Description: QAD - Implements Procedural Landmass creation via Perlin
|              Noise based on Sebastian Lague's videos as aforementioned
+-----------------------------------------------------------------------
| Implementation Notes:
|  > THIS IMPLEMENTS THE NEWEST VERSION OF THE UI SYSTEM!!!
|  > This is an active experiment, ergo it is not thorougly documented!
+-----------------------------------------------------------------------
| Version Info:
|  > 04/18/17 - Emergency rush refactor for Grad Project turnin
*=====================================================================*/
UIManager ui;
ProceduralLandmass PLM;

float[][]map;
int screenWide   = 1000;
int screenTall   = 1000;
int UIOffsetTall = 0;
int UIOffsetWide = 700;
int cellSize     = 10;
int cellsWide    = screenWide/cellSize;
int cellsTall    = screenTall/cellSize;
boolean showGrid = false;

void settings(){size(screenWide+UIOffsetWide,screenTall+UIOffsetTall);}

void setup(){
  ui = new UIManager();
  map = new float[cellsWide][cellsTall];
  PLM = new ProceduralLandmass( 25,4,0.5,2, 21, map, cellsWide, cellsTall);
  PLM.generateNoiseMap();

  ui.registerNewAction(PLM, "increaseNoiseScale");
  ui.registerNewAction(PLM, "decreaseNoiseScale");
  ui.registerNewAction(PLM, "increaseOctaves");
  ui.registerNewAction(PLM, "decreaseOctaves");
  ui.registerNewAction(PLM, "increasePersist");
  ui.registerNewAction(PLM, "decreasePersist");
  ui.registerNewAction(PLM, "increaseLacunar");
  ui.registerNewAction(PLM, "decreaseLacunar");
  ui.registerNewAction(PLM, "increaseOffsetX");
  ui.registerNewAction(PLM, "increaseOffsetY");
  ui.registerNewAction(PLM, "decreaseOffsetX");
  ui.registerNewAction(PLM, "decreaseOffsetY");  
   
  ui.registerNewAction(this, "A_quit");
  ui.newContainer(screenWide, 0, width, height, "ProcyLandmass");
  ui.addClickButton(10,10,150,50,"ProcyLandmass","Noise Scale +", "increaseNoiseScale");
  ui.addClickButton(10,60,150,50,"ProcyLandmass","Noise Scale -", "decreaseNoiseScale");
  ui.addClickButton(170,10,150,50,"ProcyLandmass","Octaves +", "increaseOctaves");
  ui.addClickButton(170,60,150,50,"ProcyLandmass","Octaves -", "decreaseOctaves"); 
  ui.addClickButton(330,10,150,50,"ProcyLandmass","Persist +", "increasePersist" );
  ui.addClickButton(330,60,150,50,"ProcyLandmass","Persist -", "decreasePersist");   
  ui.addClickButton(490,10,150,50,"ProcyLandmass","Lacunarity +", "increaseLacunar");
  ui.addClickButton(490,60,150,50,"ProcyLandmass","Lacunarity -", "decreaseLacunar");   
  
  ui.addClickButton(10,120,150,50,"ProcyLandmass","X Offset +", "increaseOffsetX");
  ui.addClickButton(10,170,150,50,"ProcyLandmass","X Offset -", "decreaseOffsetX");
  ui.addClickButton(170,120,150,50,"ProcyLandmass","Y Offset +", "increaseOffsetY");
  ui.addClickButton(170,170,150,50,"ProcyLandmass","Y Offset -", "decreaseOffsetY"); 

  //ui.bindUIObjectWithAction("aButton", "A_quit");   
}

void draw(){
  ui.update();
 
  background(84);
  ui.render();
  drawCells();
}

void mousePressed(){ui.mousePress(mouseButton);} // Ends Function mousePressed
void mouseReleased(){ui.mouseRelease(mouseButton);} // Ends Function mouseReleased
void keyPressed(){ ui.keyboardEvent(key);} // Ends Function keyPressed
void A_quit(){exit();}