//> Policy: [canvWide, canvTall, cellSize] are MASTER s.t. [cellsWide, cellsTall] derive therefrom.
const Config = {
  toggleToConsole : true,
  //> No parms for now, let's not be *THAT* OCD this time around...
  init(){
    this.canvWide  = 1024;
    this.canvTall  = 864;
    this.cellSize  = 4;
    this.cellsWide = int(this.canvWide/this.cellSize);
    this.cellsTall = int(this.canvTall/this.cellSize);
    this.isPaused  = false;
    this.showGrid  = false;
    this.showFPS   = false;
  },

  togglePause(){this.isPaused=!this.isPaused; if(Config.toggleToConsole){this.statusToConsole('Pause',this.isPaused)}},
  toggleGrid(){this.showGrid=!this.showGrid;  if(Config.toggleToConsole){this.statusToConsole('Show Grid',this.showGrid)}},
  toggleFPS(){this.showFPS=!this.showFPS;     if(Config.toggleToConsole){this.statusToConsole('Show FPS',this.showFPS)}},  
  statusToConsole(id,bool){console.log(`${id} is ${bool?'ON':'OFF'}`);}
}

function setup() {
  Config.init();
  createCanvas(Config.canvWide,Config.canvTall).parent("viz");
  GOLWorld.init(Config.cellsTall, Config.cellsWide, Config.cellSize);
  GOLWorld.randomizeCurMap();
} // Ends Method setup


function draw(){
  //### PER-FRAME UI CALLS ###
  mouseDown();
  //### LOGIC CALLS ###
  if(!Config.isPaused){GOLWorld.advance();}
  //### RENDER CALLS ###
  background(0);
  GOLWorld.render();
  if(Config.showGrid){drawGrid(Config.cellSize,'#FFFFFFg80',.5)}
  if(Config.showFPS){drawFPS()}
  drawCanvasBorder();
} // Ends Method draw


function keyPressed(){
  switch(key.toLowerCase()){
    case 'p' : return Config.togglePause();
    case 'g' : return Config.toggleGrid();
    case 'f' : return Config.toggleFPS();
    case 'c' : return GOLWorld.resetBothMaps();
    case 'r' : return GOLWorld.randomizeCurMap();
    case 'm' : return GOLWorld.swapWorldMode();
  }
}

function mouseDown(){
  if(mouseButton===LEFT){GOLWorld.setCellAtMousePos()} 
}


function mousePressed(){
  if(mouseButton===LEFT){GOLWorld.setCellAtMousePos()}
} // Ends Function mousePressed
