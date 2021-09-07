

var maxVal = 100;
var setSize = 100;
var inputSet = Array(setSize).fill(0);

var testerIns;
var testerBub;

function setup() {
  createCanvas(1280,720);
  for (var i = 0; i < inputSet.length; i++){inputSet[i]=i;}
  inputSet = shuffle(inputSet);

  testerIns = new SortIterViz("I",inputSet.slice(),10,10,620,700);
  testerBub = new SortIterViz("B",inputSet.slice(),650,10,620,700);
}

var lastFrames = 0;
var frameDelay = 240;
var lFramesRec = false;
function draw() {



  testerIns.advance();
  testerBub.advance();

  background(60);
  testerIns.display();
  testerBub.display();

  if(lFramesRec == false && testerIns.isSorted && testerBub.isSorted){
    lastFrames = frameCount;
    lFramesRec = true;
  }

  if(lFramesRec == true && frameCount - lastFrames >= frameDelay ){
    doSortingRun();
    lFramesRec = false;
  }
}

var isPaused = false;
function keyPressed(){
  if(key == 'p'){
    isPaused = !isPaused;
  }
}









function println(s){
  console.log(s);
}

function doSortingRun(){
  inputSet = shuffle(inputSet);
  testerIns.resetInput(inputSet.slice());
  testerBub.resetInput(inputSet.slice());
}


class SortIterViz{

  constructor(sType,input,xO,yO,w,t){
    this.dataset  = input;
    this.sortType = sType;
    this.xOffset  = xO;
    this.yOffset  = yO;
    this.viewWide = w;
    this.viewTall = t;
    this.rectWide = this.viewWide/this.dataset.length;
    this.rectTall = this.viewTall/maxVal; // Note: SCALAR WRT maxVal i.e. rect height = val*rectTall
    this.initCacheVals();
  }

  initCacheVals(){

    this.animIndx = 0;
    this.isLocked = false; // locked -> searching in buffer prefix for place to put element
    this.isSorted = false; // how manager knows this obj finished sorting for stuff like waiting until all types done before sweep anim and reset
 
    // FOR INSERTION
    if(this.sortType=="I"){
      this.progIndx = 1;  // '1' because at init: buffer will be zero
      this.buffIndx = 0;  // '0' because at init: trivially comparing A[1] against A[0]
      this.swapIndx = -1; // '-1' because at init: no swap occured yet
      this.tempVal  = -1; // value at progIndx i.e. A[progIndx]
    }

    // FOR BUBBLE
    if(this.sortType=="B"){
      this.progIndx = this.dataset.length;  // |A| because progress advances A[n]->A[0]
      this.buffIndx = 1;  // '1' because at init: trivially comparing A[0] against A[1]
      this.swapIndx = -1; // '-1' because at init: no swap occured yet
      this.tempVal  = -1; // value at progIndx i.e. A[progIndx]
    }

  }

  resetInput(input){
    this.dataset  = input;
    this.rectWide = this.viewWide/this.dataset.length;
    this.initCacheVals();
  }

  advance(){
    if(this.sortType=="I"){this.advInsertSort();}
    if(this.sortType=="B"){this.advBubbleSort();}
    if(this.sortType=="S"){this.advSelectSort();}    
  }

  advInsertSort(){

    if(this.isSorted){return;}

    if(this.progIndx == this.dataset.length){this.isSorted = true;}

    // If current value less than buffer, 'lock' to begin insertion process
    if(!this.isLocked && this.progIndx < this.dataset.length){
      this.tempVal = this.dataset[this.progIndx];
      this.buffIndx = this.progIndx-1;
      if(this.buffIndx >= 0 && this.dataset[this.buffIndx] > this.tempVal){
        this.isLocked=true;
      } 
    }

    if( this.buffIndx >= 0 && this.dataset[this.buffIndx] > this.tempVal){ 
      this.dataset[this.buffIndx+1] = this.dataset[this.buffIndx]; 
      this.buffIndx--;
    }
    else{ 
      this.dataset[this.buffIndx+1] = this.tempVal; 
      this.progIndx ++; 
      this.isLocked=false; 
      this.swapIndx = (this.buffIndx+1);
    }
  }


  advBubbleSort(){

    if(this.isSorted){return;}

    if(this.progIndx == 1){this.isSorted = true;}

    if(this.buffIndx == this.progIndx){  
      this.progIndx--;
      this.buffIndx=1;
    }

    if(this.dataset[this.buffIndx-1] > this.dataset[this.buffIndx]){
      this.swapIndx = this.buffIndx;
      this.tempVal = this.dataset[this.buffIndx-1];
      this.dataset[this.buffIndx-1]=this.dataset[this.buffIndx];
      this.dataset[this.buffIndx]=this.tempVal;
    }   
    
    this.buffIndx++;
  }


  display(){
    stroke(60);
    for(var i=0; i<setSize; i++){

      if(this.isSorted){
        if(i == this.animIndx){fill(255,120,0);}
        else if(i < this.animIndx){fill(0,120,255);}
        else {fill(255,255,255);}
      }

      else{
        if(i==this.progIndx){fill(255,120,0);}
        else if(i==this.buffIndx){fill(0,255,0);}
        else if(i==this.swapIndx){fill(0,120,255);}
        else{fill(255,255,255);}
      }

      rect(
        this.xOffset + i*this.rectWide,
        this.yOffset + this.viewTall,
        this.rectWide,
        - this.dataset[i]*this.rectTall);
    }

    if(this.isSorted && this.animIndx < this.dataset.length){
      this.animIndx++;
    }


  }

}

