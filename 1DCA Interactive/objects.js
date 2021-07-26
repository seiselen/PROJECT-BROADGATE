class RuleButton{
  constructor(dim,pos){
    this.pos = pos;
    this.dim = dim;
    this.ePt = vec2(this.pos.x+this.dim,this.pos.y+this.dim);

    // 'act' => 'activation' (for {L,M,R} antedecents) and 'action' (for {C} consequent)
    this.act = CA1D.State.OFF;

    this.col_on   = color(60);
    this.col_off  = color(255);
    this.col_strk = color(0);
  } // Ends Constructor

  onMousePressed(){
    if (this.isMouseOver()){
      this.act = (this.isOn()) ? CA1D.State.OFF : CA1D.State.ON;
    }
  } // Ends Function onMousePressed 

  isOn(){
    return (this.act == CA1D.State.ON);
  }

  // Should be named something like 'equals', 'compareTo', etc. but too OCD about reducing code in RuleCheckBox.evaluate (Sorry Uncle Bob!)
  is(val){
    return (val==this.act);
  } // Ends Function is
  
  isMouseOver(){
    return (mouseX >= this.pos.x && mouseX < this.ePt.x && mouseY >= this.pos.y && mouseY < this.ePt.y);
  } // Ends Function isMouseOver

  render(){
    stroke(this.col_strk), strokeWeight(2); (this.isOn()) ? fill(this.col_on) : fill(this.col_off);rect(this.pos.x, this.pos.y, this.dim, this.dim);
  } // Ends Function render
} // Ends Class RuleButton


class RuleCheckBox{
  // Note: All parms sans 'pos' are passed by parent: since they're the same \forEach
  constructor(cDim,mDim,bDim,pos){
    this.cDim = cDim; // cell dimension
    this.marg = mDim; // margin dimension
    this.dim  = bDim; // checkbox dimension
    this.pos = pos;
    this.ePt = vec2(this.pos.x+this.dim.x, this.pos.y+this.dim.y);
    
    this.ruleCells = {};
    this.initCells();

  } // Ends Constructor

  // { L: Left Antecedent, M: Center Antecedent, R: Right Antecedent, C: Consequent}
  initCells(){
    let curX=this.pos.x; let curY=this.pos.y;
    this.ruleCells.L = new RuleButton(this.cDim, vec2(curX+=this.marg,curY+=this.marg));
    this.ruleCells.M = new RuleButton(this.cDim, vec2(curX+=this.cDim,curY));
    this.ruleCells.R = new RuleButton(this.cDim, vec2(curX+=this.cDim,curY));
    this.ruleCells.C = new RuleButton(this.cDim, vec2(curX-=this.cDim,curY+=this.cDim));
  } // Ends Function initButtons 

  onMousePressed(){
    if (this.isMouseOver()){ this.ruleCells.L.onMousePressed(); this.ruleCells.M.onMousePressed(); this.ruleCells.R.onMousePressed(); this.ruleCells.C.onMousePressed();}
  } // Ends Function onMousePressed 

  evaluate(L,M,R){
    return this.ruleCells.L.is(L) && this.ruleCells.M.is(M) && this.ruleCells.R.is(R);
  } // Ends Function evaluate

  getConseq(){
    return this.ruleCells.C.act;
  } // Ends Function getConseq

  setVals(L,M,R,C){
    this.ruleCells.L.act=L;
    this.ruleCells.M.act=M;
    this.ruleCells.R.act=R;
    this.ruleCells.C.act=C;    
  } // Ends Function setVals

  isMouseOver(){
    return (mouseX >= this.pos.x && mouseX < this.ePt.x && mouseY >= this.pos.y && mouseY < this.ePt.y);
  } // Ends Function isMouseOver

  render(){
    stroke(60), strokeWeight(1); noFill();
    rect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);

    this.ruleCells.L.render();
    this.ruleCells.M.render();
    this.ruleCells.R.render();
    this.ruleCells.C.render();
  } // Ends Function render
} // Ends Class RuleCheckBox


class RuleDefinition{
  constructor(pos){
    this.cDim = 40; // RuleButton size (1D because they'll be squares)
    this.mDim = 10; // padding between group of RuleButtons and border
    this.bDim = vec2((this.cDim*3)+(this.mDim*2),(this.cDim*2)+(this.mDim*2)); // checkbox size

    this.pos = pos;
    this.dim = vec2(this.bDim.x*8,this.bDim.y);
    this.ePt = vec2(this.pos.x+this.dim.x,this.pos.y+this.dim.y);
    
    this.ruleDefs = [];
    this.initRuleDefs();

    this.initTestDefVals();
  } // Ends Constructor

  initRuleDefs(){
    for(let i=0; i<8; i++){this.ruleDefs.push(new RuleCheckBox(this.cDim, this.mDim, this.bDim, vec2(this.pos.x+(this.bDim.x*i),this.pos.y)));}
  } // Ends Function initButtons 

  initTestDefVals(){
    let X  = CA1D.State.ON;
    let O = CA1D.State.OFF

    // RULE 254
    /*
    this.ruleDefs[0].setVals(X,X,X,X);
    this.ruleDefs[1].setVals(X,X,O,X);
    this.ruleDefs[2].setVals(X,O,X,X);
    this.ruleDefs[3].setVals(X,O,O,X);
    this.ruleDefs[4].setVals(O,X,X,X);
    this.ruleDefs[5].setVals(O,X,O,X);
    this.ruleDefs[6].setVals(O,O,X,X);
    this.ruleDefs[7].setVals(O,O,O,O);
    */
    // RULE 250
    /*
    this.ruleDefs[0].setVals(X,X,X,X);
    this.ruleDefs[1].setVals(X,X,O,X);
    this.ruleDefs[2].setVals(X,O,X,X);
    this.ruleDefs[3].setVals(X,O,O,X);
    this.ruleDefs[4].setVals(O,X,X,X);
    this.ruleDefs[5].setVals(O,X,O,O);
    this.ruleDefs[6].setVals(O,O,X,X);
    this.ruleDefs[7].setVals(O,O,O,O);
    */
    // RULE 90
    /*
    this.ruleDefs[0].setVals(X,X,X,O);
    this.ruleDefs[1].setVals(X,X,O,X);
    this.ruleDefs[2].setVals(X,O,X,O);
    this.ruleDefs[3].setVals(X,O,O,X);
    this.ruleDefs[4].setVals(O,X,X,X);
    this.ruleDefs[5].setVals(O,X,O,O);
    this.ruleDefs[6].setVals(O,O,X,X);
    this.ruleDefs[7].setVals(O,O,O,O);
    */
    // RULE 30
    this.ruleDefs[0].setVals(X,X,X,O);
    this.ruleDefs[1].setVals(X,X,O,O);
    this.ruleDefs[2].setVals(X,O,X,O);
    this.ruleDefs[3].setVals(X,O,O,X);
    this.ruleDefs[4].setVals(O,X,X,X);
    this.ruleDefs[5].setVals(O,X,O,X);
    this.ruleDefs[6].setVals(O,O,X,X);
    this.ruleDefs[7].setVals(O,O,O,O);



  } // Ends Function initTestDefVals 

  onMousePressed(){
    if (this.isMouseOver()){this.ruleDefs.forEach((rd)=>rd.onMousePressed());}
  } // Ends Function onMousePressed 

  evaluate(L,M,R){
    for(let i=0; i<8; i++){
      if(this.ruleDefs[i].evaluate(L,M,R)){
        return this.ruleDefs[i].getConseq();
      }
    }
    console.log(">>> Error: Should NOT get here! Returning \'false\'"); return CA1D.State.OFF;
  } // Ends Function evaluate 

  isMouseOver(){
    return (mouseX >= this.pos.x && mouseX < this.ePt.x && mouseY >= this.pos.y && mouseY < this.ePt.y);
  } // Ends Function isMouseOver

  render(){
    stroke(0), strokeWeight(2); fill(0,120,216); rect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);    
    this.ruleDefs.forEach((rd)=>rd.render());
  } // Ends Function render
} // Ends Class RuleDefinition




class CA1D{
  static State = {ON:1,OFF:0};
  constructor(cellsWide, cellsTall, cellSize, pos){
    this.cellsWide = cellsWide;
    this.cellsTall = cellsTall;
    this.cellSize  = cellSize;

    this.pos  = pos;
    this.wide = this.cellSize*this.cellsWide;

    this.CAData = [];
    this.initAxiomRow();
    this.setAxiomRowMidPtOn();

    this.col_on   = color(60);
    this.col_off  = color(255);
    this.col_err  = color(255,0,255);
    this.col_strk = color(0);
  } // Ends Constructor

  blankCellRow(){
    let row = [];
    for(let i=0; i<this.cellsWide; i++){row.push(CA1D.State.OFF);}
    return row;
  } // Ends Function blankCellRow

  initAxiomRow(){
    this.CAData.push(this.blankCellRow());
  } // Ends Function initAxiomRow

  toggleAxiomCell(col){
    (this.CAData[0][col]==CA1D.State.ON) ? this.CAData[0][col]=CA1D.State.OFF : this.CAData[0][col]=CA1D.State.ON;
  } // Ends Function toggleAxiomCell

  setAxiomRowMidPtOn(){
    this.CAData[0][int(this.cellsWide/2)]=CA1D.State.ON
  } // Ends Function toggleAxiomCell

  // For Edge Cases (col==0, col==len-1): pretend 'missing' antecedent is State.OFF
  advanceCA(){
    let curRow = this.CAData[this.CAData.length-1];
    let newRow = [];
    let newCol = -1;

    for(let col=0; col<this.cellsWide; col++){
      if(col==0)                    {newCol = curRule.evaluate(CA1D.State.OFF,curRow[col],curRow[col+1]);}  
      else if(col==this.cellsWide-1){newCol = curRule.evaluate(curRow[col-1],curRow[col],CA1D.State.OFF);}
      else                          {newCol = curRule.evaluate(curRow[col-1],curRow[col],curRow[col+1]);}
      newRow.push(newCol);
    }
    this.CAData.push(newRow);
  } // Ends Function advanceCA

  onMousePressed(){
    if (this.mouseOverAxiomRow()){
      let cellID = int(mouseX/this.cellSize);
      this.toggleAxiomCell(cellID);
    }
  } // Ends Function onMousePressed 

  mouseOverAxiomRow(){
    return (mouseX >= this.pos.x && mouseX < (this.pos.x+this.wide) && mouseY >= this.pos.y && mouseY < (this.pos.y+this.cellSize));
  } // Ends Function isMouseOver

  render(){
    stroke(this.col_strk); strokeWeight(1);

    let curRow = 0;
    if(this.CAData.length>this.cellsTall){curRow = this.CAData.length-this.cellsTall;}

    let virRow = 0;
    while(curRow<this.CAData.length){
      this.CAData[curRow].forEach((e,c)=> {
        switch(e){case 0: fill(this.col_off); break; case 1: fill(this.col_on); break; default: fill(this.col_err);}
        rect((c*this.cellSize)+this.pos.x,(virRow*this.cellSize)+this.pos.y,this.cellSize,this.cellSize);
      })
      curRow++; virRow++;
    }

  } // Ends Function render
} // Ends Class CA1D