

class ProceduralLandmass{
  constructor(nRows, nCols, cSize, nSeed, nScale, nOct, nPer, nLac){
    this.dim = {rows:nRows, hRows:nRows/2, cols:nCols, hCols:nCols/2, cell:cSize, offX:0, offY:0};
    this.initMap();
    this.cOff = createVector(0,0);
    this.setNoiseVals(nSeed, nScale, nOct, nPer, nLac);
    this.generateOctOffs();
    this.generateNoiseBounds();
    this.showGrid = false;
  } // Ends Constructor

  initMap(){
    this.map = [];
    for(let r=0; r<this.dim.rows; r++){let nRow = []; for(let c=0; c<this.dim.cols; c++){nRow.push(0);} this.map.push(nRow);}
  } // Ends Function initMap

  clearMap(){
    for(let r=0; r<this.dim.rows; r++){ for(let c=0; c<this.dim.cols; c++){nRow.push(0);} this.map[r][c]=0;}
  } // Ends Function clearMap

  // QAD Contents: {[random] seed, noiseScale, # octaves, persist val, lacunarity} | ALSO: Out-Of-Bounds NOT currently handed (as with UI verz)
  setNoiseVals(nSeed, nScale, nOct, nPer, nLac){
    randomSeed(nSeed); noiseSeed(nSeed);
    this.noiseVal = {seed:nSeed, scale:nScale, oct:nOct, per:nPer, lac:nLac};
    this.noiseBound = {min:9999, max:-9999}
  } // Ends Function setNoiseVals


  setCellOffAndRegen(dir){
    switch(dir){
      case 'U': this.cOff.y--; break;
      case 'D': this.cOff.y++; break;
      case 'L': this.cOff.x--; break;
      case 'R': this.cOff.x++; break;      
    }
    this.generateMap();
  } // Ends Function setCellOffset






  // Idea: Generate these ONLY when # octaves is changed (goal: support "translating" map while preserving existing latent state)
  generateOctOffs(){
    this.octOffs = [];
    for(let i=0; i<this.noiseVal.oct; i++){
      this.octOffs.push(createVector(random(-100000,100000),random(-100000,100000)));
    }
  }

  // This will [most likely] need to be called whenever I change ANY noise value
  generateNoiseBounds(nTests=1000){
    let sampC = -1; // sample WRT col
    let sampR = -1; // sample WRT row
    let ampl  = -1; // amplitude
    let freq  = -1; // frequency
    let nHgt  = -1; // noise [heightmap] height
    let pnVal = -1; // per/simpx noise val

    for(let r=0; r<nTests; r++){ 
      for(let c=0; c<nTests; c++){
        ampl = 1; freq = 1; nHgt = 0;
        for(let o=0; o<this.noiseVal.oct; o++){
          pnVal = noise(((((c+this.cOff.x)-this.dim.hCols)/this.noiseVal.scale)*freq)+this.octOffs[o].x,
                       ((((r+this.cOff.y)-this.dim.hRows)/this.noiseVal.scale)*freq)+this.octOffs[o].y);
          nHgt += pnVal * ampl;
          ampl *= this.noiseVal.per;
          freq *= this.noiseVal.lac;
        }
        if(nHgt > this.noiseBound.max){this.noiseBound.max = nHgt;}
        else if(nHgt < this.noiseBound.min){this.noiseBound.min = nHgt;}
      }
    }
  }

  generateMap(){
    let sampC = -1; // sample WRT col
    let sampR = -1; // sample WRT row
    let ampl  = -1; // amplitude
    let freq  = -1; // frequency
    let nHgt  = -1; // noise [heightmap] height
    let pnVal = -1; // per/simpx noise val

    for(let r=0; r<this.dim.rows; r++){ 
      for(let c=0; c<this.dim.cols; c++){
        ampl = 1; freq = 1; nHgt = 0;
        for(let o=0; o<this.noiseVal.oct; o++){
          sampC = ((((c+this.cOff.x)-this.dim.hCols)/this.noiseVal.scale)*freq)+this.octOffs[o].x;
          sampR = ((((r+this.cOff.y)-this.dim.hRows)/this.noiseVal.scale)*freq)+this.octOffs[o].y;
          pnVal = noise(sampC,sampR);
          nHgt += pnVal * ampl;
          ampl *= this.noiseVal.per;
          freq *= this.noiseVal.lac;
        }
        this.map[r][c] = nHgt;
      }
    }
    for(let r=0; r<this.dim.rows; r++){
      for(let c=0; c<this.dim.cols; c++){
        this.map[r][c] = map(this.map[r][c],this.noiseBound.min,this.noiseBound.max,0,1);
      }
    }
    return this; // supports function chaining
  } // Ends Function generateMap



  toggleGrid(){
    this.showGrid = !this.showGrid;
  }


  render(){
    this.renderMap();
  } // Ends Function render

  renderMap(){
    switch(this.showGrid){case true: stroke(24,128);strokeWeight(1); break; case false: noStroke(); break;}
    for(let r=0; r<this.dim.rows; r++){
      for(let c=0; c<this.dim.cols; c++){
        if     (this.map[r][c]<0.3) {fill(0,0,255);}
        else if(this.map[r][c]<0.4) {fill(0,120,255);}
        else if(this.map[r][c]<0.45){fill(228,216,96);}
        else if(this.map[r][c]<0.55){fill(0,255,0);}
        else if(this.map[r][c]<0.6) {fill(36,84,0);}
        else if(this.map[r][c]<0.7) {fill(108,60,0);}
        else if(this.map[r][c]<0.85){fill(96,96,96);}
        else if(this.map[r][c]<=1.0){fill(240);}
        else                        {fill(255,0,255);}  
        rect(c*this.dim.cell,r*this.dim.cell,this.dim.cell,this.dim.cell);
      }
    }
  } // Ends Function renderMap

} // Ends Class ProceduralLandmass