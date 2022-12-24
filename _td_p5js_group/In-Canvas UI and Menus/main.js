var mainUIPanel;

var showGrid;
var colMode;

var int_health;
var int_armor;
var int_nClicks;
var int_money;

var buyItem_1;

function setup(){
  createCanvas(600,800).parent("viz");

  showGrid = new Bool(true);
  colMode = new Bool(true);

  int_health  = new Integer(100);
  int_armor  = new Integer(150);
  int_nClicks = new Integer(0);
  int_money = new Integer(2000);

  buyItem_1 = new BuyItem("Type 1",150);


  initUI(); // need to call this AFTER defining any state (to be bound to UIObjects)

}

function draw(){
  //>>> LOGIC CALLS
  mainUIPanel.update();

  //>>> RENDER CALLS
  (colMode.eval()) ? background(240) : background(12);
  renderGrid();
  mainUIPanel.render();
}

function mousePressed(){
  mainUIPanel.onMousePressed();
  return false;
}

function renderGrid(cellSize=20){
  if(showGrid.eval()){
    (colMode.eval()) ? stroke(12,128) : stroke(240,128);
    strokeWeight(4);
    for(let i=0; i<width/cellSize; i++) {line(i*cellSize,0,i*cellSize,height);}
    for(let i=0; i<height/cellSize; i++){line(0,i*cellSize,width,i*cellSize);}
  }
} // Ends Function renderGrid



//######################################################################
//>>> UTIL METHODS AND CLASSES
//######################################################################

function vec2(x,y){return createVector(x,y);}

class Bool{
  constructor(val=false){this.val = val;}
  eval(){return this.val;}
  toggle(){this.val = !this.val;}
}

class Integer{
  constructor(val=0){this.val = val;}
  set(val){this.val = val;}
  inc(i=1){this.val += i;}
  dec(i=1){this.val -= i;}
}


class BuyItem{
  constructor(name,cost){
    this.name = name;
    this.cost = cost;
  }
  canAfford(){
    return (this.cost <= int_money.val);
  }
}