/*======================================================================
|>>> Class IsoCellArray ################################################
+=====================================================================*/
class IsoCellArray{
  constructor(pos, nRows, nCols){
    this.pos   = (pos == null) ? createVector(0,0) : pos;
    this.cells = [];
    this.nRows = nRows;
    this.nCols = nCols;

    let curID = 1;
    for(let r=0; r<nRows; r++){
      let curRow = [];
      for(let c=0; c<nCols; c++){
        curRow.push(new IsoCell(r,c,curID));
        curID++;
      }
      this.cells.push(curRow);
    }

    this.computeCenOffVec();

    this.totPos = p5.Vector.add(this.pos, this.cenOffVec);

  } // Ends Constructor

  /*--------------------------------------------------------------------
  |>>> Function computeCenOffVec (Compute Center Offset Vector)
  +---------------------------------------------------------------------
  | Description: Computes X-Offset and Y-Offset of this IsoCell array,
  | then stores them in the p5.Vector 'this.cenOffVec'; such that if the
  | array's render code encompasses translating the [local] transform
  | to the values of 'this.cenOffVec': the visualization of the array
  | will be centered to the canvas space.
  +---------------------------------------------------------------------
  | Algorithm/Pseudocode Notes: 
  |
  | - Getting Iso Array 'Raw' X-Offset [RX]: 
  |   > cells[nRows-1][nCols-1].p3.x is array's iso width [IW]
  |   > 1/2 of [IW] will produce [RX]
  |
  | - Getting Iso Array 'Half Height' [HH]:
  |   > cells[0][nCols-1].p2.y is the [-Y] partition/half
  |   > cells[nRows-1][0].p4.y is the [+Y] partition/half
  |   > sum of abs([-Y]) and [+Y] will produce array's iso height [IH]
  |   > 1/2 of [IH] will then produce array's 'half height' i.e. [HH]
  |
  | - Getting Iso Array 'Raw' Y-Offset [RY]:
  |   > if (abs[-Y]<[+Y]): sub [HH] from [+Y] will produce [RY]
  |   > if (abs[-Y]>[+Y]): add [HH]  to  [-Y] will produce [RY]
  |   > if (abs[-Y]==[+Y]): can do either of above two steps for [RY],
  |     though I use the 2nd case vis-a-vis a ternary expression (WLOG).
  |
  | - Getting 'Refined' Offset Vector:
  |   > 'createVector(-[RX], -[RY])', as negation of terms will effect
  |     the desired translation. Why? Because if your coffee cup is [x]
  |     inches directly ahead of your face, you need to bring it -[x]
  |     inches towards you in order to drink from it
  +-------------------------------------------------------------------*/
  computeCenOffVec(){
    let RX = (this.cells[this.nRows-1][this.nCols-1].p3.x / 2);
    let YN = this.cells[0][this.nCols-1].p2.y;
    let YP = this.cells[this.nRows-1][0].p4.y;
    let HH = (abs(YN)+YP) / 2;
    let RY = (abs(YN) > YP) ? YN+HH : YP-HH;
    this.cenOffVec = createVector(-RX, -RY);
  } // Ends Function computeCenOffVec


  setCellDispTo(type){
    for(let r=0; r<this.nRows; r++){
      for(let c=0; c<this.nCols; c++){
        switch(type){
          case "none": case "id": case "rc": this.cells[r][c].setDispTo(type); break;
          default: console.log("ERROR: Input \""+type+"\" is invalid!"); return;
        }
      }
    }
    return this; // for method chaining
  } // Ends Function setCellDispTo


  advance(){
    for(let r=0; r<this.nRows; r++){
      for(let c=0; c<this.nCols; c++){
        this.cells[r][c].advance();
      }
    }
  } // Ends Function advance

  
  render(){
    // setting here <vs> global (but still serving all cells)
    textSize(14); textAlign(CENTER,CENTER);

    push();
    translate(this.totPos.x,this.totPos.y);
    for(let r=0; r<this.nRows; r++){
      for(let c=0; c<this.nCols; c++){
        this.cells[r][c].render();
      }
    }

    stroke(255); strokeWeight(2);

    let TL = this.cells[0][0].p1;
    let TR = this.cells[0][this.nCols-1].p2;
    let LL = this.cells[11][0].p4;
    let LR = this.cells[this.nRows-1][this.nCols-1].p3;
    
    line(TL.x,TL.y,TR.x,TR.y);
    line(TR.x,TR.y,LR.x,LR.y);
    line(LR.x,LR.y,LL.x,LL.y);
    line(LL.x,LL.y,TL.x,TL.y);
    pop();
  } // Ends Function render


  renderTopDownRep(xOff,yOff,xAlign='l'){
    switch(xAlign){
      case 'r': xOff -= this.nCols*cellDim; break;
      case 'c': xOff -= (this.nCols*cellDim)/2; break;
    }

    push(); translate(xOff,yOff);

    stroke(255,120); strokeWeight(1); 
    for(let r=0; r<this.nRows; r++){
      for(let c=0; c<this.nCols; c++){
        fill(this.cells[r][c].colVal);    
        rect(c*cellDim, r*cellDim, cellDim, cellDim);
      }
    }

    stroke(255); strokeWeight(2); noFill();
    rect(-1, -1, (this.nCols*cellDim)+1, (this.nRows*cellDim)+1);
    pop();
  } // Ends Function renderTopDownRep


} // Ends Class IsoCellArray


/*======================================================================
|>>> Class IsoCell #####################################################
+=====================================================================*/
class IsoCell{
  constructor(row, col, id){
    this.row    = row;
    this.col    = col;
    this.id     = id;
    this.rcStr  = "["+this.row+","+this.col+"]";
    this.initPts();

    //>>> Display and other GFX/VFX state
    this.DispOpts = {none:0,id:1,rc:2};
    this.setDispTo("none");
    this.nScale = 0.25;
    this.fScale = 0.01;
    this.colVal = color(255,0,255);
  } // Ends Constructor

  initPts(){
    this.p1 = createVector(
      (this.row*isoWide) + (this.col*isoWide),
      (this.row*isoTall) - (this.col*isoTall)
    );
    this.p2 = createVector(
      (this.row*isoWide) + ((this.col+1)*isoWide),
      (this.row*isoTall) - ((this.col+1)*isoTall)
    );
    this.p4 = createVector(
      ((this.row+1)*isoWide) + (this.col*isoWide),
      ((this.row+1)*isoTall) - (this.col*isoTall)
    );
    this.p3 = createVector(
      ((this.row+1)*isoWide) + ((this.col+1)*isoWide),
      ((this.row+1)*isoTall) - ((this.col+1)*isoTall)
    );
    this.pT = createVector( 
      ((this.p2.x-this.p4.x)/2)+this.p4.x,
      ((this.p3.y-this.p1.y)/2)+this.p1.y
    );
  } // Ends Function initPts

  addOffVecToPos(offVec){
    this.p1.add(offVec);
    this.p2.add(offVec);
    this.p3.add(offVec);
    this.p4.add(offVec);
    this.pT.add(offVec);
  } // Ends Function addOffVecToPos

  setDispTo(type){
    switch(type){
      case "none" : this.dispType = this.DispOpts.none; break;
      case "id"   : this.dispType = this.DispOpts.id; break;
      case "rc"   : this.dispType = this.DispOpts.rc; break;
      default: console.log("ERROR: Input \""+type+"\" is invalid!");
    }
    return this; // for method chaining
  } // Ends Function setDispTo


  advance(){
    //this.setFillViaCoords();
    this.setFillViaNoise();
  } // Ends Function advance

  /*--------------------------------------------------------------------
  |>>> Function setFillViaNoise
  +---------------------------------------------------------------------
  | Dependency Note: References two variables {col_D, col_W} which need
  |                  to exist as p5.Color objects (what those two colors
  |                  actually are can be changed as desired).
  +-------------------------------------------------------------------*/
  setFillViaNoise(){
    this.colVal = lerpColor(col_D,col_W, noise(this.row*this.nScale,this.col*this.nScale,(frameCount%1000)*this.fScale));
  } // Ends Function setFillViaNoise

  setFillViaCoords(){
    this.colVal = color(lerp(16,255,(this.row/numRows)), 0, lerp(16,255,(this.col/numCols)), 128);  
  } // Ends Function setFillViaCoords

  render(){
    stroke(255,120); strokeWeight(1); fill(this.colVal);
    quad( this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y, this.p4.x, this.p4.y);
    stroke(0); fill(255);
    if(this.dispType != this.DispOpts.none){
      text( (this.dispType==this.DispOpts.id) ? nfs(this.id,3) : this.rcStr, this.pT.x, this.pT.y);
    }
  } // Ends Function render

} // Ends Class IsoCell