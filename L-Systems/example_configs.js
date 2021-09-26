//######################################################################
//>>> PRE-BAKED EXAMPLE DEFINITIONS
//######################################################################
var templates = {
  /*--------------------------------------------------------------------
  |>>> TEMPLATE GETTERS/PARSERS
  +-------------------------------------------------------------------*/
  getOffset : function(val){
    let off = val.offset;
    return {
      x: (!isNaN(off.x)) ? off.x : this.parseLenStr(off.x),
      y: (!isNaN(off.y)) ? off.y : this.parseLenStr(off.y)
    }
  },

  parseLenStr : function(str){
    let opr = str.split(',');
    let num = parseFloat(opr[0]);
    let dim = (opr[2]=='t') ? PaneDims.TALL : (opr[2]=='w') ? PaneDims.VIZ_WIDE : 0;

    switch(opr[1]){
      case '+' : return num+dim; 
      case '*' : return num*dim;
    }
    console.log("Error: Input ["+str+"] NOT handled!"); return 0;
  },

  /*--------------------------------------------------------------------
  |>>> TEMPLATE EXAMPLE DEFINITIONS
  +---------------------------------------------------------------------
  | > The following are REQUIRED settings for a template:
  |    {axiom, rules, theta, maxGen, baseLen, baseRot, offset}
  | > The following are OPTIONAL settings for a template:
  |    disblUI: "theta,len,etc." // disables slider for a setting
  +-------------------------------------------------------------------*/

  //####################################################################
  //>>> TREE-LIKE VEGETATION
  //####################################################################
  ex_tree_01 : {
    name    : "Tree 01 (Thin and Sparse)",
    axiom   : 'X',
    rules   : [
      new Rule('X', "F+[[X]-X]-F[-FX]+X"),
      new Rule('F', "FF")
    ],
    theta   : 25,
    maxGen  : 6, 
    baseLen : 4,
    baseRot : -90,  
    offset  : {x:0, y:".5,*,t"}
  },

  ex_tree_02 : {
    name    : "Tree 02 (Bushy Inverse Cone)",
    axiom   : 'F',
    rules   : [
      new Rule('F', "F[+F][-F[-F]F]F[+F][-F]")
    ],
    theta   : 20,
    maxGen  : 4, 
    baseLen : 20,
    baseRot : -90,
    offset  : {x:0, y:".5,*,t"}
  },

  ex_tree_03 : {
    name    : "Tree 03 (Bushy And Slender)",
    axiom   : 'F',
    rules   : [
      new Rule('F', "F[+F]F[-F][F]")
    ],
    theta   : 25.7,
    maxGen  : 5,
    baseLen : 10,
    baseRot : -90,
    offset  : {x:0, y:".5,*,t"}
  },

  ex_tree_04 : {
    name    : "Tree 04 (Bushy Lightbulb)",
    axiom   : 'F',
    rules   : [
      new Rule('F', "FF+[+F-F-F]-[-F+F+F]")
    ],
    theta   : 22.5, /* orig 25 */
    maxGen  : 4,
    baseLen : 11,
    baseRot : -90,
    offset  : {x:0, y:".5,*,t"}
  },

  ex_tree_05 : {
    name    : "Tree 05 (Thin Pine-Like)",
    axiom   : 'X',
    rules   : [
      new Rule('X', "F[+X][-X]FX"),
      new Rule('F', "FF")
    ],
    theta   : 25,
    maxGen  : 6,
    baseLen : 5,
    baseRot : -90,
    offset  : {x:0, y:".5,*,t"}
  },

  //####################################################################
  //>>> PLANT-LIKE VEGETATION
  //####################################################################
  ex_plant_01 : {
    name    : "Plant 01 (Wheat-Like Grass)",
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
    offset  : {x:0, y:".5,*,t"}
  },

  ex_plant_02 : {
    name    : "Plant 02 (Desert Pine-Like)",
    axiom   : 'Z',
    rules   : [
      new Rule('Z', "ZFX[>3+Z][>3-Z]"),
      new Rule('X', "X[>-FFF][>+FFF]FX")
    ],
    theta   : 25,
    maxGen  : 4,
    baseLen : 25,
    baseRot : -90,
    offset  : {x:0, y:".5,*,t"}
  },

  ex_plant_03 : {
    name    : "Plant 03 (Short Shrub-Like)",
    axiom   : 'SLFFF',
    rules   : [
      new Rule('S', "[5+++Z][5---Z]TS"),
      new Rule('Z', "+H[-Z]L"),
      new Rule('H', "-Z[+H]L"),
      new Rule('T', "TL"),
      new Rule('L', "[-FFF][+FFF]F")
    ],
    theta   : 18,
    maxGen  : 5,
    baseLen : 25,
    baseRot : -90,
    offset  : {x:0, y:".5,*,t"}
  },


  //####################################################################
  //>>> FRACTAL SHAPES
  //####################################################################
  ex_frac_01 : {
    name    : "Frac 01 (Terdragon Curve)",
    axiom   : "F+F+F",
    rules   : [
      new Rule('F', "F-F+F")
    ],
    theta   : 120,
    maxGen  : 6, 
    baseLen : 20,
    baseRot : -90,
    offset  : {x:0, y:".5,*,t"}
  },

  ex_frac_02 : {
    name    : "Frac 02 (Sierpinski Pentagon)",
    axiom   : "F++F++F++F++F",
    rules   : [
      new Rule('F', "F++F++F|F-F++F")
    ],
    theta   : 36,
    maxGen  : 3, 
    baseLen : 20,
    baseRot : 0,
    offset  : {x:"-.15,*,w", y:"-.35,*,t"},
    disblUI : "theta"
  },

  ex_frac_03 : {
    name    : "Frac 03 (Koch Snowflake)",
    axiom   : "F--F--F",
    rules   : [
      new Rule('F', "F+F--F+F")
    ],
    theta   : 60,
    maxGen  : 3, 
    baseLen : 16,
    baseRot : 90,
    offset  : {x:"-.1,*,w", y:"-.25,*,t"},
    disblUI : "theta,len"
  },

  ex_frac_04 : {
    name    : "Frac 04 (Sierpinski Carpet)",
    axiom   : "F",
    rules   : [
      new Rule('F', 'F+F-F-F-G+F+F+F-F'),
      new Rule('G', 'GGG')
    ],
    theta   : 90,
    maxGen  : 4, 
    baseLen : 16,
    baseRot : 90,
    offset  : {x:"0,*,w", y:"-.86,*,t"},
    disblUI : "theta,len"
  },  

  ex_frac_05 : {
    name    : "Frac 05 (Koch 'Checkerboard')",
    axiom   : "F-F-F-F",
    rules   : [
      new Rule('F', "FF-F-F-F-FF")
    ],
    theta   : 90,
    maxGen  : 4, 
    baseLen : 16,
    baseRot : 90,
    offset  : {x:"-.64,*,w", y:"-.85,*,t"},
    disblUI : "theta,len"
  },
} // Ends Object templates