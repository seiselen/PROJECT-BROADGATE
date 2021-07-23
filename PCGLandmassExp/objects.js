

class ProceduralLandmass{
  constructor(nRows, nCols, cSize, nParms, nInfo){
    this.dim = {rows:nRows, hRows:nRows/2, cols:nCols, hCols:nCols/2, cell:cSize};
    this.initMap();
    this.cOff = createVector(0,0);
    this.setnoiseParms(nParms, nInfo);
    this.generateOctOffs();
    this.showGrid = false;
  } // Ends Constructor


  initMap(){
    this.map = [];
    for(let r=0; r<this.dim.rows; r++){let nRow = []; for(let c=0; c<this.dim.cols; c++){nRow.push(0);} this.map.push(nRow);}
  } // Ends Function initMap


  clearMap(){
    for(let r=0; r<this.dim.rows; r++){ for(let c=0; c<this.dim.cols; c++){nRow.push(0);} this.map[r][c]=0;}
  } // Ends Function clearMap


  setnoiseParms(nParms, nInfo){
    this.noiseParm = nParms;
    this.noiseInfo = nInfo;
    this.noiseBound = {min:0.25, max:1.5} // {min:9999, max:-9999}
    randomSeed(this.noiseParm.seed); noiseSeed(this.noiseParm.seed);
  } // Ends Function setnoiseParms


  setNoiseScale(newVal){
    this.noiseParm.scale = constrain(newVal, this.noiseInfo.scaleMin, this.noiseInfo.scaleMax);
    this.generateMap();
    this.setUILabel('scl');
  } // Ends Function setNoiseScale


  setNumOctaves(newVal){
    this.noiseParm.oct = constrain(newVal, this.noiseInfo.octMin, this.noiseInfo.octMax);
    this.generateOctOffs();
    this.generateMap();
    this.setUILabel('oct');
  } // Ends Function setNumOctaves


  setPersistVal(newVal){
    this.noiseParm.per = constrain(newVal, this.noiseInfo.perMin, this.noiseInfo.perMax);
    this.generateOctOffs();
    this.generateMap();
    this.setUILabel('per');
  } // Ends Function setPersistVal


  setLacunarVal(newVal){
    this.noiseParm.lac = constrain(newVal, this.noiseInfo.lacMin, this.noiseInfo.lacMax);
    this.generateOctOffs();
    this.generateMap();
    this.setUILabel('lac'); 
  } // Ends Function setLacunarVal


  setCellOffAndRegen(dir){
    switch(dir){
      case 'U': case 'N': this.cOff.y--; break;
      case 'D': case 'S': this.cOff.y++; break;
      case 'L': case 'W': this.cOff.x--; break;
      case 'R': case 'E': this.cOff.x++; break;
      case 'NW': this.cOff.y--; this.cOff.x--; break;
      case 'NE': this.cOff.y--; this.cOff.x++; break;
      case 'SW': this.cOff.y++; this.cOff.x--; break;
      case 'SE': this.cOff.y++; this.cOff.x++; break;
    }
    this.generateMap();
  } // Ends Function setCellOffset


  setAllUILabels(){
    this.setUILabel('scl');
    this.setUILabel('oct');
    this.setUILabel('per');
    this.setUILabel('lac');    
  } // Ends Function updateUILabels


  // Note: Has special dependency 'uiItems' (global dict containing all UI labels \foreach noise parm)
  setUILabel(item){
    switch(item){
      case 'scl': uiItems.setText("label_scl",""+this.noiseParm.scale); break;
      case 'oct': uiItems.setText("label_oct",""+this.noiseParm.oct);   break;
      case 'per': uiItems.setText("label_per",""+this.noiseParm.per);   break;
      case 'lac': uiItems.setText("label_lac",""+this.noiseParm.lac);   break;
    }
  } // Ends Function setUILabel


  generateOctOffs(){
    this.octOffs = [];
    for(let i=0; i<this.noiseParm.oct; i++){
      this.octOffs.push(createVector(random(-100000,100000),random(-100000,100000)));
    }
  } // Ends Function generateOctOffs


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
        for(let o=0; o<this.noiseParm.oct; o++){
          sampC = ((((c+this.cOff.x)-this.dim.hCols)/this.noiseParm.scale)*freq)+this.octOffs[o].x;
          sampR = ((((r+this.cOff.y)-this.dim.hRows)/this.noiseParm.scale)*freq)+this.octOffs[o].y;
          pnVal = noise(sampC,sampR);
          nHgt += pnVal * ampl;
          ampl *= this.noiseParm.per;
          freq *= this.noiseParm.lac;
        }
        this.map[r][c] = nHgt;
      }
    }
    for(let r=0; r<this.dim.rows; r++){
      for(let c=0; c<this.dim.cols; c++){
        // added 'true' to parm #6 for auto-constrain, as I'm gonna simply eat extrema WRT fixed bounds <vs> resample 
        this.map[r][c] = map(this.map[r][c], this.noiseBound.min, this.noiseBound.max, 0, 1, true);
      }
    }
    return this; // supports function chaining
  } // Ends Function generateMap


  // Keeping but likely not using, as VERY expensive. Will use vals it generates for fixed bounds instead
  genMapExtrema(nTests=8000){
    let sampC = -1; // sample WRT col
    let sampR = -1; // sample WRT row
    let ampl  = -1; // amplitude
    let freq  = -1; // frequency
    let nHgt  = -1; // noise [heightmap] height
    let pnVal = -1; // per/simpx noise val

    nTests=ceil(nTests/2); // to sample neg rows/cols via span of [-t/2,...,+t/2]

    for(let r=-nTests; r<nTests; r++){ 
      for(let c=-nTests; c<nTests; c++){
        ampl = 1; freq = 1; nHgt = 0;
        for(let o=0; o<this.noiseParm.oct; o++){
          pnVal = noise(((((c+this.cOff.x)-this.dim.hCols)/this.noiseParm.scale)*freq)+this.octOffs[o].x,
                       ((((r+this.cOff.y)-this.dim.hRows)/this.noiseParm.scale)*freq)+this.octOffs[o].y);
          nHgt += pnVal * ampl;
          ampl *= this.noiseParm.per;
          freq *= this.noiseParm.lac;
        }
        if(nHgt > this.noiseBound.max){this.noiseBound.max = nHgt;}
        else if(nHgt < this.noiseBound.min){this.noiseBound.min = nHgt;}
      }
    }
    console.log(this.noiseBound);
  } // Ends Function genMapExtrema


  toggleGrid(){
    this.showGrid = !this.showGrid;
  } // Ends Function toggleGrid


  render(){
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
  } // Ends Function render

} // Ends Class ProceduralLandmass