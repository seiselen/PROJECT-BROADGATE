/*----------------------------------------------------------------------
|>>> 'Abstract' Class SortViz
+-----------------------------------------------------------------------
| Description: Abstract Class composed of common implementation code for
|              Child Class sorting algos (i.e. Insertion, Bubble, etc.)
+---------------------------------------------------------------------*/
class SortViz{
  constructor(pos,dim,off,type){
    this.pos     = pos;
    this.dim     = dim;
    this.offPos  = createVector(pos.x+(off.x/2),pos.y+(off.y/2));
    this.viewDim = createVector(dim.x-off.x,dim.y-off.y);
    this.rectDim = createVector(-1, this.viewDim.y/Globals.MAX_VAL);
    this.sortAlg = type;
  } // Ends Constructor

  loadInput(inArr){
    this.dataset   = inArr;
    this.rectDim.x = this.viewDim.x/this.dataset.length;
    this.initCacheVals();
  } // Ends Function loadInput 

  initCacheVals(){
    this.animIndx = 0;
    this.isSorted = false; // how manager knows this obj finished sorting for stuff like waiting until all types done before sweep anim and reset
    this.swapIndx = -1;    // '-1' because at init: no swap occured yet
    this.tempVal  = -1;    // value at progIndx i.e. A[progIndx]    
  } // Ends Function initCacheVals

  render(){
    stroke(60); strokeWeight(1);
    push();
    translate(this.offPos.x,this.offPos.y);
      for(let i=0; i<this.dataset.length; i++){
        (this.isSorted) ? this.fillPostSorting(i) : this.fillWhenSorting(i);
        rect(i*this.rectDim.x, this.viewDim.y, this.rectDim.x, -this.dataset[i]*this.rectDim.y);
      } // Ends For Loop
     this.dispSortType();
    pop();
    this.dispBorder();
    if(this.isSorted && this.animIndx < this.dataset.length){this.animIndx++;}
  } // Ends Function render

  fillWhenSorting(i){switch(i){case this.progIndx: fill(255,120,0); break; case this.buffIndx: fill(0,255,0); break; case this.swapIndx: fill(0,120,255); break; default: fill(255);}}
  fillPostSorting(i){(i==this.animIndx) ? fill(255,120,0) : (i<this.animIndx) ? fill(0,120,255) : fill(255,255,255);}
  dispSortType(){stroke(60); strokeWeight(2); fill(255); textSize(18); textAlign(LEFT,CENTER); text(this.sortAlg,0,20);}
  dispBorder(){stroke(255,128); strokeWeight(4); noFill(); rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);}
} // Ends 'Abstract' Class SortViz


/*----------------------------------------------------------------------
|>>> [Child] Class InsertSort
+-----------------------------------------------------------------------
| Description: QAD - Implements Insertion Sort
+---------------------------------------------------------------------*/
class InsertSort extends SortViz{
  constructor(pos,dim,off){
    super(pos,dim,off,"Insertion Sort");
  } // Ends Constructor

  initCacheVals(){
    super.initCacheVals();
    this.isLocked = false; // locked -> searching in buffer prefix for place to put element    
    this.progIndx = 1;  // '1' because at init: buffer will be zero
    this.buffIndx = 0;  // '0' because at init: trivially comparing A[1] against A[0]
  } // Ends Function initCacheVals

  advance(){
    if(this.isSorted){return;}
    if(this.progIndx == this.dataset.length){this.isSorted = true;}
    if(!this.isLocked && this.progIndx < this.dataset.length){
      this.tempVal = this.dataset[this.progIndx];
      this.buffIndx = this.progIndx-1;
      if(this.buffIndx >= 0 && this.dataset[this.buffIndx] > this.tempVal){this.isLocked=true;} 
    }
    if( this.buffIndx >= 0 && this.dataset[this.buffIndx] > this.tempVal){
      this.dataset[this.buffIndx+1] = this.dataset[this.buffIndx]; this.buffIndx--;
    }
    else{ 
      this.dataset[this.buffIndx+1] = this.tempVal; 
      this.progIndx ++; 
      this.isLocked=false; 
      this.swapIndx = (this.buffIndx+1);
    }    
  } // Ends Function advance
} // Ends Class InsertSort


/*----------------------------------------------------------------------
|>>> [Child] Class BubbleSort
+-----------------------------------------------------------------------
| Description: QAD - Implements Bubble Sort
+---------------------------------------------------------------------*/
class BubbleSort extends SortViz{
  constructor(pos,dim,off){
    super(pos,dim,off,"Bubble Sort");
  } // Ends Constructor

  initCacheVals(){
    super.initCacheVals();
    this.progIndx = this.dataset.length;  // |A| because progress advances A[n]->A[0]
    this.buffIndx = 1;  // '1' because at init: trivially comparing A[0] against A[1]
  } // Ends Function initCacheVals

  advance(){
    if(this.isSorted){return;}
    if(this.progIndx == 1){this.isSorted = true;}
    if(this.buffIndx == this.progIndx){this.progIndx--; this.buffIndx=1;}
    if(this.dataset[this.buffIndx-1] > this.dataset[this.buffIndx]){
      this.swapIndx = this.buffIndx;
      this.tempVal = this.dataset[this.buffIndx-1];
      this.dataset[this.buffIndx-1]=this.dataset[this.buffIndx];
      this.dataset[this.buffIndx]=this.tempVal;
    }   
    this.buffIndx++;   
  } // Ends Function advance
} // Ends Class BubbleSort