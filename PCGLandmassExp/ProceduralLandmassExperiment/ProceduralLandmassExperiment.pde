/*======================================================================
| Project: Perlin Noise - based Procedural Landmass Experiment
| Author:  Steven Eiselen, University of Arizona Computer Science 
| Source:  Sebastian Lague Series on Procedural Landmass Creation, link
|          to series first video: www.youtube.com/watch?v=wbpMiKiSKm8
+-----------------------------------------------------------------------
| Description: QAD - Implements Procedural Landmass creation via Perlin
|              Noise based on Sebastian Lague's videos as aforementioned
+-----------------------------------------------------------------------
| Implementation Notes:
|  > THIS IMPLEMENTS THE NEWEST VERSION OF THE UI SYSTEM!!!
|  > This is an active experiment, ergo it is not thorougly documented!
|  > (7/21/21) The reason why this terrain looks different despite its
|    P5JS counterpart (despite the same general implementation) is, as I
|    suspected: due to how each respectively implements random (and more
|    specifically for P5JS - how the BROWSER implements it). No need to
|    follow the source's suggestion to implement my own Perlin/Simplex
|    noise method (though I've done so in Unity via the CatLikeCoding
|    tutorial; as to KISS and get code up-and-running per Broadgate Ops.
+-----------------------------------------------------------------------
| Version Info:
|  > 04/18/17 = Emergency rush refactor for Grad Project turnin
|  > 07/21/21 = QAD somewhat comprehensive refactor while working on 
|               improved P5JS version of this; as to determine why P5JS
|               map looks different than this despite same code (NOTE:
|               see above implementation note for the answer thereto!)
*=====================================================================*/
UIManager ui;
ProceduralLandmass PLM;

int screenWide   = 800;
int screenTall   = 800;
int UIOffsetWide = 180;
int cellSize     = 8;
int cellsWide    = screenWide/cellSize;
int cellsTall    = screenTall/cellSize;
boolean showGrid = false;

void settings(){size(screenWide+UIOffsetWide,screenTall);}

void setup(){
  ui  = new UIManager();
  PLM = new ProceduralLandmass(cellsTall, cellsWide, 25,4,0.5,2, 21).generateNoiseMap();
  init_UI();
}

void draw(){
  ui.update();
  background(84);
  ui.render();
  PLM.drawCells();
}

void mousePressed(){ui.mousePress(mouseButton);} // Ends Function mousePressed
void mouseReleased(){ui.mouseRelease(mouseButton);} // Ends Function mouseReleased
void keyPressed(){ ui.keyboardEvent(key);} // Ends Function keyPressed
