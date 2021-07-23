// Cleaned up (and other minor refactors) on 7/21/21 while working on P5JS improved verz
class ProceduralLandmass{
  float noiseScale; 
  int   octaves;
  PVector[] octOffsets; // added 7/21/21 while working on P5JS improved verz
  float persist; 
  float lacunar;
  float[][] map;
  float offsetX,offsetY;
  int cols,rows;
  int seed;
  boolean toggleGrid = false;
  
  // defined within obj (<vs> function) 7/21/21 while working on P5JS improved verz
  float noiseScaleDelta = 0.1f;
  float persistDelta    = 0.1f;  
  float octaveOffDelta  = 0.1f; 
  int octaveNumDelta    = 1;
  int lacunarDelta      = 1;
  
  public ProceduralLandmass(int nRows, int nCols, float nScale, int oct, float per, float lac, int rSeed){
    initMap(nRows,nCols);
    setValues(nScale, oct, per, lac, rSeed);
    generateOctaveOffsets();
  }
  
  void initMap(int nRows, int nCols){rows=nRows; cols=nCols; map = new float[rows][cols];}
  
  void setValues(float nScale, int oct, float per, float lac, int rSeed){
    noiseScale = nScale;
    octaves = oct;
    persist = per;
    lacunar = lac;  
    seed = rSeed;
    randomSeed(seed);
    noiseSeed(seed);
  } // Ends Function setValues
  
  // added 7/21/21 while working on P5JS improved verz
  void generateOctaveOffsets(){
    octOffsets = new PVector[octaves];
    for(int i=0;i<octaves;i++){
      octOffsets[i] = new PVector((random(-100000,100000)+offsetX),(random(-100000,100000)+offsetY));
    }
  } // Ends Function generateOctaveOffsets
  
  // added 7/21/21 while working on P5JS improved verz
  void toggleGrid(){showGrid = !showGrid;}
  
  // added 7/21/21 while working on P5JS improved verz
  void adjNScale(char op){switch(op){case '+': noiseScale += noiseScaleDelta; break; case '-': noiseScale -= noiseScaleDelta; break;}}
  void adjPersist(char op){switch(op){case '+': persist += persistDelta; break; case '-': persist -= persistDelta; break;}}
  void adjLacunar(char op){switch(op){case '+': lacunar += lacunarDelta; break; case '-': lacunar -= lacunarDelta; break;}}
  void adjOctaveVal(char op){switch(op){case '+': octaves += octaveNumDelta; break; case '-': octaves -= octaveNumDelta; break;} generateOctaveOffsets();}
  void adjOctOff(char dim, char op){
    // cool example of switch/ternary construct!
    switch(dim){
      case 'x': offsetX += (op=='+') ? 0.1 : -0.1; break; 
      case 'y': offsetY += (op=='+') ? 0.1 : -0.1; break;
      default : println(">>> adjOctaveOff Error: Invalid input for 'dim' ["+dim+"]; returning now!"); return;
    }
    generateOctaveOffsets();
  } // Ends Function adjOctaveOff
  
  // modified 7/21/21 while working on P5JS improved verz 
  void incNoiseScale(){adjNScale('+');  generateNoiseMap();}
  void decNoiseScale(){adjNScale('-');  generateNoiseMap();}
  void incOctaves(){adjOctaveVal('+');  generateNoiseMap();}
  void decOctaves(){adjOctaveVal('-');  generateNoiseMap();}
  void incPersist(){adjPersist('+');    generateNoiseMap();}
  void decPersist(){adjPersist('-');    generateNoiseMap();}
  void incLacunar(){adjLacunar('+');    generateNoiseMap();}
  void decLacunar(){adjLacunar('-');    generateNoiseMap();}
  void incOffsetX(){adjOctOff('x','+'); generateNoiseMap();}
  void incOffsetY(){adjOctOff('y','+'); generateNoiseMap();}
  void decOffsetX(){adjOctOff('x','-'); generateNoiseMap();}
  void decOffsetY(){adjOctOff('y','-'); generateNoiseMap();}  
  
  // defined in separate function 7/21/21 from 'generateNoiseMap' while working on P5JS improved verz 
  void validateNoiseParms(){
    if(octaves<0){octaves=0;}
    if(lacunar<1){lacunar=1;}
    if(persist<0){persist=0;}
    if(persist>1){persist=1;} 
    if(noiseScale<=0){noiseScale = 0.0001;}
  } // Ends Function validateNoiseParms
  
  public ProceduralLandmass generateNoiseMap(){
    validateNoiseParms();

    float maxNoiseHeight = -9999;
    float minNoiseHeight = 9999; 
    float halfWide = cellsWide/2.0;
    float halfTall = cellsTall/2.0;
  
    for(int r=0;r<rows;r++){
      for(int c=0;c<cols;c++){
        float amplitude = 1;
        float frequency = 1;
        float noiseHeight = 0;
      
        for(int o=0;o<octaves;o++){
          float sampleC = (((c-halfWide)/noiseScale)*frequency)+octOffsets[o].x;
          float sampleR = (((r-halfTall)/noiseScale)*frequency)+octOffsets[o].y;
          float perlinValue = noise(sampleC,sampleR);   
          noiseHeight+= perlinValue * amplitude;   
          amplitude *= persist;
          frequency *= lacunar;
        }        
        if(noiseHeight > maxNoiseHeight){maxNoiseHeight = noiseHeight;}
        else if(noiseHeight < minNoiseHeight){minNoiseHeight = noiseHeight;}
        map[r][c] = noiseHeight;
      }
    } 
    for(int r=0;r<cellsTall;r++){
      for(int c=0;c<cellsWide;c++){
        map[r][c] = map(map[r][c],minNoiseHeight,maxNoiseHeight,0,1);
      }
    }
    return this; // for function chaining
  } // Ends Function generateNoiseMap
  
  // moved to obj's method 7/21/21 while working on P5JS improved verz
  void drawCells(){
    if(showGrid){stroke(24);strokeWeight(1);} else{noStroke();} fill(0);
    for(int r=0;r<rows;r++){
      for(int c=0;c<cols;c++){
        if(map[r][c]<0.3){fill(0,0,255);}
        else if(map[r][c]<0.4){fill(0,120,255);}
        else if(map[r][c]<0.45){fill(228,216,96);}
        else if(map[r][c]<0.55){fill(0,255,0);}
        else if(map[r][c]<0.6){fill(36,84,0);}
        else if(map[r][c]<0.7){fill(108,60,0);}
        else if(map[r][c]<0.85){fill(96,96,96);}
        else if(map[r][c]<=1.0){fill(240);}    
        rect(c*cellSize,r*cellSize,cellSize,cellSize);
      }
    }
  } // Ends Function drawCells

} // Ends Class ProceduralLandmass
