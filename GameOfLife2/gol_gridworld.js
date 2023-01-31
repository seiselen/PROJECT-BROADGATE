//> IDEA: Making domains {-1,+1} xor {true,false} might be better via negation (iff 2 categories).
const WorldMode = {WRAP:0, NOWRAP:1};
const CellState = {DEAD:0, LIVE:1};

var GOLWorld = {
  init(cTall, cWide, cSize){
    this.cellsWide = cWide;
    this.cellsTall = cTall;
    this.cellSize  = cSize;
    this.mode = WorldMode.WRAP;

    this.curState = this.initGridMap();
    this.newState = this.initGridMap();
    this.initColors();
    return this; // for function chaining
  },
  
  
  //> TODO: Should be put in 'BG-Utils' | Note: Only needs to be called @ init.
  initGridMap(){
    let map = [];
    for(let r=0; r<this.cellsTall; r++){
      map[r]=[];
      for(let c=0; c<this.cellsWide; c++){map[r].push(CellState.DEAD);}
    }
    return map;
  },

  initColors(){
    this.fill_LIVE = color(0,255,0);
    // neither of below currently used, as drawing rect IFF cell is alive
    this.fill_DEAD = color(60);
    this.col_ERROR = color(255,255,0);
  },

  //> Note: Old Version re-init'd. This one'll simply reset all cells to DEAD.
  resetBothMaps(){
    for(let r=0; r<this.cellsTall; r++){
      for(let c=0; c<this.cellsWide; c++){
        this.curState[r][c] = CellState.DEAD;
        this.newState[r][c] = CellState.DEAD;
      }
    }
  },

  randomizeCurMap(){
    for(let r=0; r<this.cellsTall; r++){
      for(let c=0; c<this.cellsWide; c++){
        //> int(random(2))∋{0,1}, which is {DEAD,LIVE}. If the latter changes, so must this... duh!
        this.curState[r][c] = int(random(2));
      }
    }
  },


  swapWorldMode(){switch(this.mode){
    case WorldMode.WRAP: this.mode=WorldMode.NOWRAP; return;
    case WorldMode.NOWRAP: this.mode=WorldMode.WRAP; return;
    default: return; // in case of [es]linting :-)
  }},


  getModdedRow(r){
    return (this.cellsTall+r)%this.cellsTall;
  },

  getModdedCol(c){
    return (this.cellsWide+c)%this.cellsWide;
  },


  //> This is what, the 20th time I wrote xor copied this method? lol
  checkInBounds(r,c){
    return (r>=0 && r<this.cellsTall && c>=0 && c<this.cellsWide);
  },


  //> Syntactic Sugar, basically...
  outOfBounds(r,c){
    return !this.checkInBounds(r,c);
  },


  // both submethods work via [LIVE=1]. If that val changes, so must this, likely via categorical map to [1].
  getAdjTotal(r,c){switch(this.mode){
    case WorldMode.WRAP:   return this.adjTotal_wrap(r,c);
    case WorldMode.NOWRAP: return this.adjTotal_nowrap(r,c);
    default: return -9999; // in case of [es]linting :-)
  }},


  adjTotal_wrap(r,c){
    // could do sequence of additions to 'tot', but KISS for now...
    let tot=0;
    tot+=this.curState[this.getModdedRow(r-1)][c];
    tot+=this.curState[this.getModdedRow(r+1)][c];
    tot+=this.curState[r][this.getModdedCol(c-1)];
    tot+=this.curState[r][this.getModdedCol(c+1)];    
    tot+=this.curState[this.getModdedRow(r-1)][this.getModdedCol(c-1)];
    tot+=this.curState[this.getModdedRow(r+1)][this.getModdedCol(c+1)];
    tot+=this.curState[this.getModdedRow(r+1)][this.getModdedCol(c-1)];
    tot+=this.curState[this.getModdedRow(r-1)][this.getModdedCol(c+1)];
    return tot;
  },


  adjTotal_nowrap(r,c){
    let tot=0;
    for (let adjR=r-1; adjR<=r+1; adjR++){
      for (let adjC=c-1; adjC<=c+1; adjC++){
        if (this.checkInBounds(adjR,adjC) && !(adjC==c&&adjR==r)){
          tot += this.curState[adjR][adjC];
        } 
      }
    }
    return tot;
  },


  advance(){
    var adjs = 0;
    for (let r=0; r<this.cellsTall; r++) {
      for (let c=0; c<this.cellsWide; c++) {
        adjs = this.getAdjTotal(r,c);
        //> TODO? Can define more parametrically a-la what I did with L-System Flora?
        switch(this.curState[r][c]){
          case CellState.LIVE : this.newState[r][c] = (adjs==2||adjs==3) ? CellState.LIVE : CellState.DEAD; break;
          case CellState.DEAD : this.newState[r][c] = (adjs==3)          ? CellState.LIVE : CellState.DEAD; break;
        }
      }
    }
    for (let r=0; r<this.cellsTall; r++) {
      for (let c=0; c<this.cellsWide; c++) {
        this.curState[r][c] = this.newState[r][c];
      }
    }
  },


  setCellAtMousePos(){
    let [mRow,mCol] = [int(mouseY/this.cellSize),int(mouseX/this.cellSize)];
    if(this.outOfBounds(mRow,mCol)){return;}

    this.curState[mRow][mCol] = (this.curState[mRow][mCol]===CellState.LIVE) ? CellState.DEAD : CellState.LIVE; 
  },


  render(){
    noStroke();
    for(let r=0; r<this.cellsTall; r++){
      for(let c=0; c<this.cellsWide; c++){
        switch(this.curState[r][c]){
          case CellState.LIVE: fill(this.fill_LIVE); rect(c*this.cellSize, r*this.cellSize, this.cellSize); break;
          default: noFill(); break;
        }
      }
    }
  },

}