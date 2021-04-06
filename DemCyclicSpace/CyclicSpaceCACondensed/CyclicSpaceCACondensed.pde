/*======================================================================
| Project: Cyclic Space 2018 Condensed and FPS Boosted Version
| Author:  Steven Eiselen, University of Arizona
+-----------------------------------------------------------------------
| Description: Implements 'Demons of Cyclic Space' Cellular Automata in
|              Processing. The Novemeber 2018 update resulted in MASSIVE 
|              FPS improvement such that longtime theory on Processing's
|              ability to efficiently run-and-render this CA as well as
|              potentially similar problems were superseded. See Version
|              Info section below for more details.
+-----------------------------------------------------------------------
| Implementation Notes:
|  > x
+-----------------------------------------------------------------------
| Version Info:
|  > 01/20/15 - Refactored original CSC 227 'Demons of Cyclic Space' for
|               Processing from original Java Build.
|  > 02/10/18 - Changes from first version unknown sans decision to use
|               point graphics primitives to draw cells pixel-by-pixel
|               (via quad-nested for loop) for some reason. NOTE: As of
|               11/21/18, this version still exists in the Processing
|               Workspace under the name 'DemonsOfCyclicSpace'.
|  > 11/21/18 - Changed name from 'DemonMatrix' to 'CyclicCA'; fully
|               encapsulated functionality to CyclicCA Class such that
|               only external info needed are for object's constructor;
|               added three new colormap schema from ColorBrewer; added
|               'FPSUtil' class to compute and print delta time FPS via
|               delta time computation; and switched graphics primitive 
|               to rect which MASSIVELY improved FPS!!!
*=====================================================================*/

// MAIN SETTINGS
int numCellsTall = 256;
int numCellsWide = 512;
int cellSizeSqrd = 4;

// DEBUG PRINT FLAGS
boolean doCADebug = false;
boolean doFPSDebug = false;

// OBJECT DECLARATIONS
CyclicCA demo;
FPSUtil  fps;

// PROCESSING INIT-AND-RUN FUNCTIONS
void settings(){size(numCellsWide*cellSizeSqrd,numCellsTall*cellSizeSqrd);}
void setup(){demo = new CyclicCA(numCellsWide,numCellsTall,cellSizeSqrd); fps = new FPSUtil(); noStroke();}
void draw() {demo.AdvanceAndDisplay();fps.UpdateAndPrintFPS();}
void keyPressed(){demo.Reset();}

class CyclicCA {
  private int cWide, cTall, cSize;
  private int nStates = 12;
  color[] cMap;
  private int colScheme = 2;
  private byte adjT, adjB, adjL, adjR, cur; 
  private byte curW[][];
  private byte newW[][];
  private int nGens = 1;
  private boolean debugPrint = false;

  public CyclicCA(int cW, int cT, int cS) {
    cWide = cW; 
    cTall = cT; 
    cSize = cS;
    curW = new byte[cTall][cWide]; 
    newW = new byte[cTall][cWide];
    InitPalette(); 
    Populate();
  } // Ends Constructor  
  
  public void SetDebugPrint(boolean val){
    debugPrint=val;
  } // Ends Function SetDebugPrint  
  
  public void Reset(){
    Populate();nGens=1;
  } // Ends Function Reset  

  private void Populate() {
    for(int r=0; r<cTall; r++){for(int c=0; c<cWide; c++){curW[r][c]=byte(random(0,nStates));}}
  } // Ends Function Populate  
  
  public void AdvanceAndDisplay(){
    Advance(); 
    Display(); 
    if(debugPrint){ println("Generation # " + nGens++ + ".");} 
  } // Ends Function AdvanceAndDisplay 

  private void Advance() {
    for(int r=0; r<cTall; r++){for(int c=0; c<cWide; c++){newW[r][c]=curW[r][c];}}
          
    for(int r=0; r<cTall; r++){for(int c=0; c<cWide; c++){          
      adjL = curW[r][((c-1)+cWide)%cWide]; 
      adjR = curW[r][((c+1)+cWide)%cWide];
      adjT = curW[((r-1)+cTall)%cTall][c]; 
      adjB = curW[((r+1)+cTall)%cTall][c];
      cur = byte((curW[r][c]+1)%nStates);  
      if(adjT==cur){newW[r][c]=adjT;} 
      else if(adjB==cur){newW[r][c]=adjB;} 
      else if(adjL==cur){newW[r][c]=adjL;} 
      else if(adjR==cur){newW[r][c]=adjR;}
    }}

    for(int r=0; r<cTall; r++){for(int c=0; c<cWide; c++){curW[r][c]=newW[r][c];}}
  } // Ends Function Advance
  
  private void Display(){
    for(int r=0; r<cTall; r++){for(int c=0; c<cWide; c++){fill(cMap[curW[r][c]]);rect(c*cSize,r*cSize,cSize,cSize);}}
  } // Ends Function Display
  
  void InitPalette(){
    cMap = new color[24]; // 18 is arbitrary max 
    // >>> Color Scheme 1 [13 Colors] (Original From 227 Project) {Dark Gray, Blue, Light Gray, Green, Orange, Pink, Yellow, White, Purple, Teal, Cyan, Black, Red}
    if(colScheme == 1){cMap[0]=color(60,60,60);cMap[1]=color(0,0,255);cMap[2]=color(120,120,120);cMap[3]=color(0,255,0);cMap[4]=color(255,144,6);cMap[5]=color(255,5,226);cMap[6]=color(255,255,0);cMap[7]=color(255,255,255);cMap[8]=color(216,6,255);cMap[9]=color(6,255,180);cMap[10]=color(6.255,255);cMap[11]=color(0,0,0);cMap[12]=color(255,0,0);}
    // >>> Color Scheme 2 [12 Colors] ('Bold Colors' via ColorBrewer)
    if(colScheme == 2){cMap[0]=color(166,206,227);cMap[1]=color(31,120,180);cMap[2]=color(178,223,138);cMap[3]=color(51,160,44);cMap[4]=color(251,154,153);cMap[5]=color(227,26,28);cMap[6]=color(253,191,111);cMap[7]=color(255,127,0);cMap[8]=color(202,178,214);cMap[9]=color(106,61,154);cMap[10]=color(255,255,153);cMap[11]=color(177,89,40);}
    // >>> Color Scheme 3 [12 Colors] ('Pastel Colors' via ColorBrewer)
    if(colScheme == 3){cMap[0]=color(141,211,199);cMap[1]=color(255,255,179);cMap[2]=color(190,186,218);cMap[3]=color(251,128,114);cMap[4]=color(128,177,211);cMap[5]=color(253,180,98);cMap[6]=color(179,222,105);cMap[7]=color(252,205,229);cMap[8]=color(217,217,217);cMap[9]=color(188,128,189);cMap[10]=color(204,235,197);cMap[11]=color(255,237,111);}
    // >>> Color Scheme 4 [24 Colors] ('Bold Colors' followed by 'Pastel Colors' via ColorBrewer)
    if(colScheme == 4){cMap[0]=color(166,206,227);cMap[1]=color(31,120,180);cMap[2]=color(178,223,138);cMap[3]=color(51,160,44);cMap[4]=color(251,154,153);cMap[5]=color(227,26,28);cMap[6]=color(253,191,111);cMap[7]=color(255,127,0);cMap[8]=color(202,178,214);cMap[9]=color(106,61,154);cMap[10]=color(255,255,153);cMap[11]=color(177,89,40);cMap[12]=color(141,211,199);cMap[13]=color(255,255,179);cMap[14]=color(190,186,218);cMap[15]=color(251,128,114);cMap[16]=color(128,177,211);cMap[17]=color(253,180,98);cMap[18]=color(179,222,105);cMap[19]=color(252,205,229);cMap[20]=color(217,217,217);cMap[21]=color(188,128,189);cMap[22]=color(204,235,197);cMap[23]=color(255,237,111);}
  } // Ends Function InitPalette
  
} // Ends Class CyclicCA

class FPSUtil{
  private float cFrameMillis, lFrameMillis, deltaT, fps;  
  void UpdateFPS(){cFrameMillis = millis(); deltaT = cFrameMillis-lFrameMillis; fps = 1000.0/deltaT; lFrameMillis = cFrameMillis;} 
  public float GetFPS(){return fps; }  
  public void  UpdateAndPrintFPS(){ UpdateFPS();println("FPS = " + fps); } 
} // Ends Class FPSUtil
