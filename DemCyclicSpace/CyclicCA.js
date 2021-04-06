
class CyclicCA{

  constructor(cW, cT, cS){
    this.cellsWide = cW;
    this.cellsTall = cT;
    this.cellSize  = cS;
    this.numStates = 12;

    this.colMap = [];
    this.colScheme = 4;

    this.curGen;    // current generation (i.e. state frame) where [init==1]
    this.predWorld; // predecessor i.e. existing world state i.e. 'On Enter'
    this.succWorld; // successor i.e. 'soon to be' world state i.e. 'On Exit'

    this.initPalette();
    this.initWorld();

    // Cached vars for use with advance()
    var adjT, adjB, adjL, adjR, cur;
  } // Ends Constructor

  // Populate World Randomly
  popWorldRand(){
    this.predWorld = [];
    for(var r=0; r<this.cellsTall; r++){
      var temp = [];
      for(var c=0; c<this.cellsWide; c++){
        temp.push(byte(random(0,this.numStates)));
      }
      this.predWorld.push(temp);
    }
  }

  initWorld(){
    this.popWorldRand();
    this.curGen = 1;
  }

  // Keeping redundancy in case I want different reset behavior
  reset(){
    this.initWorld();
  }

  // could improve by returning array literal, but YOLO
  initPalette(){
    var cMap = []; // 18 is arbitrary max 
    // >>> Color Scheme 1 [13 Colors] (Original From 227 Project) {Dark Gray, Blue, Light Gray, Green, Orange, Pink, Yellow, White, Purple, Teal, Cyan, Black, Red}
    if(this.colScheme == 1){cMap[0]=color(60,60,60);cMap[1]=color(0,0,255);cMap[2]=color(120,120,120);cMap[3]=color(0,255,0);cMap[4]=color(255,144,6);cMap[5]=color(255,5,226);cMap[6]=color(255,255,0);cMap[7]=color(255,255,255);cMap[8]=color(216,6,255);cMap[9]=color(6,255,180);cMap[10]=color(6.255,255);cMap[11]=color(0,0,0);cMap[12]=color(255,0,0);}
    // >>> Color Scheme 2 [12 Colors] ('Bold Colors' via ColorBrewer)
    if(this.colScheme == 2){cMap[0]=color(166,206,227);cMap[1]=color(31,120,180);cMap[2]=color(178,223,138);cMap[3]=color(51,160,44);cMap[4]=color(251,154,153);cMap[5]=color(227,26,28);cMap[6]=color(253,191,111);cMap[7]=color(255,127,0);cMap[8]=color(202,178,214);cMap[9]=color(106,61,154);cMap[10]=color(255,255,153);cMap[11]=color(177,89,40);}
    // >>> Color Scheme 3 [12 Colors] ('Pastel Colors' via ColorBrewer)
    if(this.colScheme == 3){cMap[0]=color(141,211,199);cMap[1]=color(255,255,179);cMap[2]=color(190,186,218);cMap[3]=color(251,128,114);cMap[4]=color(128,177,211);cMap[5]=color(253,180,98);cMap[6]=color(179,222,105);cMap[7]=color(252,205,229);cMap[8]=color(217,217,217);cMap[9]=color(188,128,189);cMap[10]=color(204,235,197);cMap[11]=color(255,237,111);}
    // >>> Color Scheme 4 [24 Colors] ('Bold Colors' followed by 'Pastel Colors' via ColorBrewer)
    if(this.colScheme == 4){cMap[0]=color(166,206,227);cMap[1]=color(31,120,180);cMap[2]=color(178,223,138);cMap[3]=color(51,160,44);cMap[4]=color(251,154,153);cMap[5]=color(227,26,28);cMap[6]=color(253,191,111);cMap[7]=color(255,127,0);cMap[8]=color(202,178,214);cMap[9]=color(106,61,154);cMap[10]=color(255,255,153);cMap[11]=color(177,89,40);cMap[12]=color(141,211,199);cMap[13]=color(255,255,179);cMap[14]=color(190,186,218);cMap[15]=color(251,128,114);cMap[16]=color(128,177,211);cMap[17]=color(253,180,98);cMap[18]=color(179,222,105);cMap[19]=color(252,205,229);cMap[20]=color(217,217,217);cMap[21]=color(188,128,189);cMap[22]=color(204,235,197);cMap[23]=color(255,237,111);}
    
    this.colMap = cMap;
  } // Ends Function InitPalette

  advanceAndDisplay(){
    this.advance();
    this.display(); // note: will call display{1|2|3}
  } // Ends Function advanceAndDisplay

  advance(){
    this.succWorld = this.copyPredWorld();

    for(var r=0; r<this.cellsTall; r++){
      for(var c=0; c<this.cellsWide; c++){
        this.adjL = this.predWorld[r][((c-1)+this.cellsWide)%this.cellsWide]; 
        this.adjR = this.predWorld[r][((c+1)+this.cellsWide)%this.cellsWide];
        this.adjT = this.predWorld[((r-1)+this.cellsTall)%this.cellsTall][c]; 
        this.adjB = this.predWorld[((r+1)+this.cellsTall)%this.cellsTall][c];
        this.cur = byte((this.predWorld[r][c]+1)%this.numStates);  
        if(this.adjT==this.cur){this.succWorld[r][c]=this.adjT;} 
        else if(this.adjB==this.cur){this.succWorld[r][c]=this.adjB;} 
        else if(this.adjL==this.cur){this.succWorld[r][c]=this.adjL;} 
        else if(this.adjR==this.cur){this.succWorld[r][c]=this.adjR;}
    }}

    for(var r=0; r<this.cellsTall; r++){
      for(var c=0; c<this.cellsWide; c++){
        this.predWorld[r][c]=this.succWorld[r][c];
      }
    }
  } // Ends Function advance

  copyPredWorld(){
    var pWorld = [];
    for(var r=0; r<this.cellsTall; r++){
      var temp = [];
      for(var c=0; c<this.cellsWide; c++){
        temp.push(this.predWorld[r][c]);
      }
      pWorld.push(temp);
    }
    return pWorld;
  } // Ends Function copyPredWorld

  // These calls should be XOR i.e. only make 1 of them (unless you want crappy FPS!)
  display(){
    //this.display1(); // uses rect primitives (SLOW compared to Processing counterpart!)
    //this.display2(); // uses set method to set pixel vals wherein p5js handes pixel|col vals
    this.display3(); // directly manipulates pixel|col vals, fastest method of these three
  } // Ends Function display

  display1(){
    noStroke();
    for(var r=0; r<this.cellsTall; r++){
      for(var c=0; c<this.cellsWide; c++){
        fill(this.colMap[this.predWorld[r][c]]);
        rect(c*this.cellSize,r*this.cellSize,this.cellSize,this.cellSize);
      }
    }
  } // Ends Function display1

  display2(){
    for(var r=0; r<this.cellsTall; r++){
      for(var c=0; c<this.cellsWide; c++){    
        for(var rP=0; rP<this.cellSize; rP++){
          for(var cP=0; cP<this.cellSize; cP++){
            set( (c*this.cellSize)+cP, (r*this.cellSize)+rP, this.colMap[this.predWorld[r][c]]);
          }
        }
      }
    }
    updatePixels();
  } // Ends Function display2

  // might find a little improvement by further caching / direct referencing, but YOLO
  display3(){
    loadPixels();
    let d = pixelDensity();
    let pixX,pixY,index;
    for(var r=0; r<this.cellsTall; r++){
      for(var c=0; c<this.cellsWide; c++){    
        for(var rP=0; rP<this.cellSize; rP++){
          for(var cP=0; cP<this.cellSize; cP++){
            pixX = (c*this.cellSize)+cP;
            pixY = (r*this.cellSize)+rP;
            for (let i = 0; i < d; i++) {
              for (let j = 0; j < d; j++) {
                index = 4 * ((pixY * d + j) * width * d + (pixX * d + i));
                pixels[index]   = red(this.colMap[this.predWorld[r][c]]);
                pixels[index+1] = green(this.colMap[this.predWorld[r][c]]);
                pixels[index+2] = blue(this.colMap[this.predWorld[r][c]]);
                pixels[index+3] = alpha(this.colMap[this.predWorld[r][c]]);
              }
            }
          }
        }
      }
    }
    updatePixels();
  } // Ends Function display3

} // Ends Class CyclicCA