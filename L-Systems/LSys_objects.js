/*======================================================================
|>>> Class Rule                               (L-System Production Rule)
+-----------------------------------------------------------------------
| Description: Simple representation of a L-System Production Rule as an
|              {Antecedent, Consequent} (i.e. {p,q}) two-tuple pair.
+=====================================================================*/
class Rule{
  constructor(p,q){this.p = p;this.q = q;}
}  // Ends Class [Production] Rule


/*======================================================================
|>>> Class LSystem                      (Lindenmayer System Realization)
+-----------------------------------------------------------------------
| Description: Implements the state, behaviors, and visualization of a 
|              2D Lindenmayer System (to whichever level of complexity
|              is currently implemented).
| Usage Notes: > This class works via loading in definitions of existing
|                L-Systems; both on-initialization (see note immediately
|                below), on selecting a pre-existing L-System (i.e. one
|                defined offline and located within a .js file), and/or
|                on the user defining one via the DOM UI.
|              > After initializing this object: one of the pre-existing
|                L-System definitions MUST be loaded in before the call
|                of both 'initUI()' and P5JS function 'draw()'; as the
|                DOM UI code outside this class and render code within
|                are both dependent on a fully-defined state thereof.
+=====================================================================*/
class LSystem{
  constructor(){
    this.windSpeed = 128;
    this.cfigKey   = 'none'; // key of config
  } // Ends Constructor


  //####################################################################
  //>>> LOADER/[RE]INIT FUNCTIONS
  //####################################################################
  loadConfig(configKey){
    this.cfigKey = configKey;
    let config   = templates[configKey];
    this.axiom   = config.axiom;
    this.corpus  = this.axiom;
    this.rules   = config.rules;
    this.theta   = config.theta;
    this.wTheta  = 0;
    this.curGen  = 0;
    this.maxGen  = config.maxGen;
    this.lenFac  = 1;
    this.baseLen = config.baseLen;
    this.baseRot = radians((360+config.baseRot)%360); // xtra syntax converts negative degs to positive equivalent
    this.offset  = templates.getOffset(config);

    this.isVeg   = (configKey.includes("tree")||configKey.includes("grass")) ? true : false;
    this.colBrch = false;
    this.simWind = false;
    return this; // for function chaining
  }


  //####################################################################
  //>>> GETTER FUNCTIONS
  //####################################################################
  isActive(){return (this.axiom && this.rules);}
  getCurGen(){return this.curGen;}
  getMaxGen(){return this.maxGen;}


  //####################################################################
  //>>> SETTER FUNCTIONS
  //####################################################################
  addRule(nR)   {this.rules.push(nR);}
  addRules(nRs) {nRs.forEach((nR)=>{this.addRule(nR);})}
  setTheta(nT)  {this.theta = nT;}
  setMaxGen(nMx){this.maxGen = mMx;}
  setLenFac(val){this.lenFac=val;}


  //####################################################################
  //>>> UPDATE/ADVANCE FUNCTIONS
  //####################################################################
  // Advances corpus forward by 1 generation
  generate() {
    if(this.curGen < this.maxGen){
      let nextgen = ''; // buffer string to populate and replace sentence via generation
      for (let i=0; i<this.corpus.length; i++) {
        // cur char generates string [if rule antecedent] <xor> remains for new sentence
        let genSeed = this.corpus.charAt(i);
        for (let j=0; j<this.rules.length; j++) {
          // cur char is rule antecedent - swap with consequent for new sentence
          if (this.rules[j].p === genSeed) {genSeed = this.rules[j].q; break;}
        }
        nextgen += genSeed;
      }
      // Replace sentence and advance generation #
      this.corpus = nextgen;
      this.curGen++;
    }
  } // Ends Function generate

  // Advances corpus forward until max generation
  fullyGenerate(){for(let i=0; i<this.maxGen; i++){this.generate();}return this;}


  //####################################################################
  //>>> MISC BEHAVIOR FUNCTIONS
  //####################################################################
  QAD_WindSim(){
    let rawLerp = sin(lerp(0,PI,((frameCount%this.windSpeed)/this.windSpeed)));
    this.wTheta = radians(lerp(-20,20,rawLerp));
    rotate(radians(lerp(-2.5,2.5,rawLerp)));
  } // Ends Function QAD_WindSim


  //####################################################################
  //>>> RENDER FUNCTIONS
  //####################################################################
  render(){
    fill(0);
    translate(this.offset.x, this.offset.y); 
    rotate(this.baseRot);
    if(this.simWind){this.QAD_WindSim();}
    this.turtleRender();
  } // Ends Function render


  turtleRender(){
    let sen = this.corpus;
    let len = this.baseLen*this.lenFac;
    let ang = radians(this.theta+this.wTheta);
    let idx = this.curGen;

    stroke("#8c510a");


    for (let i = 0; i < sen.length; i++) {
      let c = sen.charAt(i);
      if (c === 'F') {
        switch(this.colBrch){
          case false: strokeWeight(1); stroke(60); break;
          case true: this.QADTreeColor(idx,len); break;
        }
        line(0,0,len,0); translate(len,0);
      }
      else if (c === 'G') {translate(len,0);}
      else if (c === '+') {rotate(ang);}
      else if (c === '-') {rotate(-ang);}
      else if (c === '|') {rotate(PI);}
      else if (c === '[') {push();idx--;}
      else if (c === ']') {pop();idx++;}
    }
  } // Ends Function turtleRender

  // called this <vs> "strokeWeight(1); stroke(60);" in handling of 'F' production symbol
  QADTreeColor(idx,len){
    strokeWeight((idx*1.5)+1); stroke(lerpColor(color("#bf812d"),color("#543005"), idx/this.maxGen));
  }

} // Ends Class LSystem