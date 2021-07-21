class ProceduralLandmass{
  void increaseNoiseScale(){noiseScale+=0.1; generateNoiseMap(); println(noiseScale);}
  void decreaseNoiseScale(){noiseScale-=0.1; generateNoiseMap(); println(noiseScale);}
  void increaseOctaves(){octaves++;       generateNoiseMap(); println(octaves);}
  void decreaseOctaves(){octaves--;       generateNoiseMap(); println(octaves);}
  void increasePersist(){persist+=0.1;       generateNoiseMap(); println(persist);}
  void decreasePersist(){persist-=0.1;       generateNoiseMap(); println(persist);}
  void increaseLacunar(){lacunar++;          generateNoiseMap(); println(lacunar);}
  void decreaseLacunar(){lacunar--;          generateNoiseMap(); println(lacunar);}
  void increaseOffsetX(){offsetX+=0.1;          generateNoiseMap(); println(offsetX);}
  void increaseOffsetY(){offsetY-=0.1;          generateNoiseMap(); println(offsetY);}
  void decreaseOffsetX(){offsetX-=0.1;          generateNoiseMap(); println(offsetX);}
  void decreaseOffsetY(){offsetY+=0.1;          generateNoiseMap(); println(offsetY);}  
     
  float noiseScale; 
  int   octaves; 
  float persist; 
  float lacunar;
  float[][] map;
  float offsetX,offsetY;
  int cellsWide,cellsTall;
  int seed;
  
  public ProceduralLandmass(float nScale, int oct, float per, float lac, int s, float[][] m, int cWide, int cTall){
    setValues(nScale, oct, per, lac, s);
    bindMap(m,cWide,cTall);
  }
  
  void setValues(float nScale, int oct, float per, float lac, int s){
    noiseScale = nScale;
    octaves = oct;
    persist = per;
    lacunar = lac;  
    seed = s;
  } // Ends Function setValues
  
  void clearMap(){
    if(map!=null){
      for(int r=0;r<cellsTall;r++){
        for(int c=0;c<cellsWide;c++){
          map[r][c] = 0;
        }
      }
    }
  } // Ends Function clearMap
  
  void bindMap(float[][] bMap, int cWide, int cTall){
    map=bMap;
    cellsWide=cWide;
    cellsTall=cTall;
  } // Ends Function bindMap
  
  public void generateNoiseMap(){
    if(map==null){println("ProceduralLandmass/generateNoiseMap : No map is currently bound!");return;}
    clearMap();
    
    if(octaves<0){octaves=0;}
    if(lacunar<1){lacunar=1;}
    if(persist<0){persist=0;}
    if(persist>1){persist=1;}
    
    randomSeed(seed);
     
    if(noiseScale<=0){noiseScale = 0.0001;}
    
    PVector[] octaveOffsets = new PVector[octaves];
    for(int i=0;i<octaves;i++){octaveOffsets[i] = new PVector((random(-100000,100000)+offsetX),(random(-100000,100000)+offsetY));}
  
    float maxNoiseHeight = Float.MIN_VALUE;
    float minNoiseHeight = Float.MAX_VALUE; 
    float halfWide = cellsWide/2.0;
    float halfTall = cellsTall/2.0;
  
    for(int r=0;r<cellsTall;r++){
      for(int c=0;c<cellsWide;c++){
        float amplitude = 1;
        float frequency = 1;
        float noiseHeight = 0;
      
        for(int o=0;o<octaves;o++){
          float sampleC = (((c-halfWide)/noiseScale)*frequency)+octaveOffsets[o].x;
          float sampleR = (((r-halfTall)/noiseScale)*frequency)+octaveOffsets[o].y;
          float perlinValue = noise(sampleC,sampleR);   
          noiseHeight+= perlinValue * amplitude;   
          map[r][c] = perlinValue;
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
  } // Ends Function generateNoiseMap
} // Ends Class ProceduralLandmass