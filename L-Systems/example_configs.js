//######################################################################
//>>> PRE-BAKED EXAMPLE DEFINITIONS
//######################################################################

var ex_1; var ex_6;

function initExamples(){
  ex_1 = {
    axiom : 'X',
    rules : [
      new Rule('X', "F+[[X]-X]-F[-FX]+X"),
      new Rule('F', "FF")
    ],
    theta   : radians(25),
    maxGen  : 6, 
    initLen : 200,
    initRot : -PI/2,  
    offLS   : {x:screenSize/2, y:screenSize}
  } // Ends Example 01


  ex_6 = {
    axiom : 'F',
    rules : [
      new Rule('F', "F[+F][-F[-F]F]F[+F][-F]")
    ],
    theta   : radians(20),
    maxGen  : 3, 
    initLen : 250,
    initRot : -PI/2,  
    offLS   : {x:screenSize/2, y:screenSize}
  } // Ends Example 06




  /*
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

  */
}