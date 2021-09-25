//######################################################################
//>>> PRE-BAKED EXAMPLE DEFINITIONS
//######################################################################

var templates = {

  getOffset : function(val){
    let off = val.offset;
    return {
      x: (!isNaN(off.x)) ? off.x : this.parseLenStr(off.x),
      y: (!isNaN(off.y)) ? off.y : this.parseLenStr(off.y)
    }
  },

  parseLenStr : function(str){
    let len = str.length;
    if(len==1){
      if(str=="t"){return PaneDims.TALL;}
    }
    if(len==3){
      if(str.substring(0,2)=="t/"){return PaneDims.TALL/parseInt(str.charAt(2));}
      if(str.substring(0,2)=="w/"){return PaneDims.VIZ_WIDE/parseInt(str.charAt(2));}
    }
    console.log("Error: Input ["+str.substring(0,2)+"] NOT handled!"); return 0;
  },

  /*>>> AND NOW, THE TEMPLATES THEMSELVES... */

  ex_tree_01 : {
    axiom   : 'X',
    rules   : [
      new Rule('X', "F+[[X]-X]-F[-FX]+X"),
      new Rule('F', "FF")
    ],
    theta   : 25,
    maxGen  : 6, 
    baseLen : 4,
    baseRot : -90,  
    offset  : {x:0, y:"t/2"}
  },

  ex_tree_02 : {
    axiom   : 'F',
    rules   : [
      new Rule('F', "F[+F][-F[-F]F]F[+F][-F]")
    ],
    theta   : 20,
    maxGen  : 4, 
    baseLen : 20,
    baseRot : -90,
    offset  : {x:0, y:"t/2"}
  },

  ex_tree_03 : {
    axiom   : 'F',
    rules   : [
      new Rule('F', "F[+F]F[-F][F]")
    ],
    theta   : 25.7,
    maxGen  : 5,
    baseLen : 10,
    baseRot : -90,
    offset  : {x:0, y:"t/2"}
  },

  ex_grass_01 : {
    axiom   : 'F',
    rules   : [
      new Rule('F', "FF-[XY]+[XY]"),
      new Rule('X', "+FY"),
      new Rule('Y', "-FX")
    ],
    theta   : 22.5,
    maxGen  : 6,
    baseLen : 5,
    baseRot : -90,
    offset  : {x:0, y:"t/2"}
  },

  ex_FracShape_01 : {
    axiom   : "F+F+F",
    rules   : [
      new Rule('F', "F-F+F")
    ],
    theta   : 120,
    maxGen  : 6, 
    baseLen : 20,
    baseRot : -90,
    offset  : {x:0, y:"t/2"}
  },

/*

  ex_5 : {
    axiom   : "F++F++F++F++F",
    rules   : [
      new Rule('F', "F++F++F|F-F++F")
    ],
    theta   : 36,
    maxGen  : 3, 
    baseLen : 75,
    baseRot : 0,
    offset  : {x:"-w/2", y:"-t/2"}
  },




  ex_shiff01 : {
    baseLen = 150;
    lsys = new LSystem("F");
    lsys.addRule(new Rule('F', "FF+[+F-F-F]-[-F+F+F]"));
    lsys.setTheta(radians(22.5)) // orig 25
    lsys.setMaxGen(4);
    initRotate = -PI/2;
    curXOff = PaneDims.VIZ_WIDE/2;
    curYOff = PaneDims.TALL;
  },


  ex_kochSnowflake01 : {
    baseLen = 60;
    lsys = new LSystem("F-F-F-F");
    lsys.addRule(new Rule('F', "FF-F-F-F-F-F+F"));
    lsys.setTheta(radians(90))
    lsys.setMaxGen(4);
    curXOff = 420;
    curYOff = 520;
  },

  ex_kochChecker01 : {
    baseLen = 60;
    lsys = new LSystem("F-F-F-F");
    lsys.addRule(new Rule('F', "FF-F-F-F-FF"));
    lsys.setTheta(radians(90))
    lsys.setMaxGen(4);
    curXOff = 150;
    curYOff = 450;
  },

  */
}