//######################################################################
//>>> PRE-BAKED EXAMPLE DEFINITIONS
//######################################################################

function load_Ex1(){
  initLength = 200;
  lsys = new LSystem("X");
  lsys.addRule(new Rule('X', "F+[[X]-X]-F[-FX]+X"));
  lsys.addRule(new Rule('F', "FF"));
  lsys.setTheta(radians(25))
  lsys.setMaxGen(6);
  initRotate = -PI/2;
  curXOff = screenSize/2;
  curYOff = screenSize;
}

function load_Ex2(){
  initLength = 300;
  lsys = new LSystem("F");
  lsys.addRule(new Rule('F', "F[+F]F[-F][F]"));
  lsys.setTheta(radians(25.7))
  lsys.setMaxGen(5);
  initRotate = -PI/2;
  curXOff = screenSize/2;
  curYOff = screenSize;
}

function load_Ex3(){
  initLength = 300;
  lsys = new LSystem("F");
  lsys.addRule(new Rule('F', "FF-[XY]+[XY]"));
  lsys.addRule(new Rule('X', "+FY"));
  lsys.addRule(new Rule('Y', "-FX"));
  lsys.setTheta(radians(22.5))
  lsys.setMaxGen(6);
  initRotate = -PI/2;
  curXOff = screenSize/2;
  curYOff = screenSize;
}


function load_Ex4(){
  initLength = 600;
  lsys = new LSystem("F+F+F");
  lsys.addRule(new Rule('F', "F-F+F"));
  lsys.setTheta(radians(120))
  lsys.setMaxGen(6);
  initRotate = -PI/2;
  curXOff = screenSize/2;
  curYOff = screenSize;
}


function load_Ex5(){
  initLength = 75;
  lsys = new LSystem("F++F++F++F++F");
  lsys.addRule(new Rule('F', "F++F++F|F-F++F"));
  lsys.setTheta(radians(36))
  lsys.setMaxGen(3);
}

function load_shiffEx(){
  initLength = 150;
  lsys = new LSystem("F");
  lsys.addRule(new Rule('F', "FF+[+F-F-F]-[-F+F+F]"));
  lsys.setTheta(radians(22.5)) // orig 25
  lsys.setMaxGen(4);
  initRotate = -PI/2;
  curXOff = screenSize/2;
  curYOff = screenSize;
}

function load_kochSnowflake01(){
  initLength = 60;
  lsys = new LSystem("F-F-F-F");
  lsys.addRule(new Rule('F', "FF-F-F-F-F-F+F"));
  lsys.setTheta(radians(90))
  lsys.setMaxGen(4);
  curXOff = 420;
  curYOff = 520;
}

function load_kochChecker01(){
  initLength = 60;
  lsys = new LSystem("F-F-F-F");
  lsys.addRule(new Rule('F', "FF-F-F-F-FF"));
  lsys.setTheta(radians(90))
  lsys.setMaxGen(4);
  curXOff = 150;
  curYOff = 450;
}

function load_Ex6(){
  initLength = 250;
  lsys = new LSystem("F");
  lsys.addRule(new Rule('F', "F[+F][-F[-F]F]F[+F][-F]"));
  lsys.setTheta(radians(20))
  lsys.setMaxGen(3);
  initRotate = -PI/2;
  curXOff = width/2;
  curYOff = height;
}