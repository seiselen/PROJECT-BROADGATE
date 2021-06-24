

var rootObj;

function setup(){

  createCanvas(800,800).parent("viz");

  let BLU = color(0,120,255);
  let RED = color(216,108,32);
  let GRN = color(60,208,60);
  let PRP = color(117,107,177);
  let PNK = color(221,28,119);

  rootObj = new UIObject(createVector(50,25),createVector(675,750));

  let child1 = new UIObject(createVector(25,25),createVector(300,400)).setColor('bg',RED);
  let child2 = new UIObject(createVector(350,25),createVector(300,700)).setColor('bg',GRN);
  let child3 = new UIObject(createVector(25,450),createVector(300,275)).setColor('bg',PRP);  

  rootObj.addChildren([child1,child2,child3]);

  let child1_1 = new UIObject(createVector(25,25),createVector(250,150)).setColor('bg',BLU);
  let child1_2 = new UIObject(createVector(25,225),createVector(250,150)).setColor('bg',GRN);

  child1.addChildren([child1_1,child1_2]);

  let child2_1 = new UIObject(createVector(25,25),createVector(250,50)).setColor('bg',RED);
  let child2_2 = new UIObject(createVector(25,100),createVector(125,75)).setColor('bg',BLU);
  let child2_3 = new UIObject(createVector(175,100),createVector(100,75)).setColor('bg',PRP);

  let child2_4 = new UIObject(createVector(25,250),createVector(250,50)).setColor('bg',PRP);
  let child2_5 = new UIObject(createVector(25,325),createVector(125,75)).setColor('bg',RED);
  let child2_6 = new UIObject(createVector(175,325),createVector(100,75)).setColor('bg',BLU);

  let child2_7 = new UIObject(createVector(25,450),createVector(250,225)).setColor('bg',PNK);  

  child2.addChildren([child2_1,child2_2,child2_3,child2_4,child2_5,child2_6,child2_7]);

  let child3_1 = new UIObject(createVector(25,25),createVector(250,125)).setColor('bg',RED);
  let child3_2 = new UIObject(createVector(25,175),createVector(250,75)).setColor('bg',GRN);  

  child3.addChildren([child3_1,child3_2]);

  let child2_1_1 = new UIObject(createVector(25,25),createVector(200,150)).setColor('bg',BLU);

  child2_7.addChild(child2_1_1);

}

function draw(){

  //>>> LOGIC CALLS
  rootObj.update();


  //>>> RENDER CALLS
  background(60);
  rootObj.render();

}