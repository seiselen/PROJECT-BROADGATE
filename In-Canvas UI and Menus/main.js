var mainUIPanel;

var testBool;
var int_health;
var int_armor;
var int_nClicks;
var int_money;

var buyItem_1;

function setup(){
  createCanvas(800,800).parent("viz");

  testBool = new Bool(true);
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
  background(60);
  mainUIPanel.render();

}


function mousePressed(){
  mainUIPanel.onMousePressed();
  return false;
}



//######################################################################
//>>> UTIL METHODS AND CLASSES
//######################################################################

function vec2(x,y){return createVector(x,y);}

class Bool{
  constructor(val=false){this.val = val;}
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