



class Rule{
  constructor(p,q){this.p = p;this.q = q;}
}


/*=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
State Desc. QAD:
 > axiom  =  self-evident 
 > rules  = self-evident
 > theta  = rotation delta for this system (as radians, default = 0)
 > curGen = current # generations this L-Sys was expanded
 > maxGen = maximum # generations this L-Sys can expand (default = 4)
 > offUI  = offset via UI input
 > offLS  = offset specified by L-Sys 
+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
class LSystem{
  // NOTE: Object state is 'properly'/officially' assigned via init function
  constructor(){
    this.axiom   = null;
    this.corpus  = null;
    this.rules   = null;
    this.theta   = 0;
    this.curGen  = -1;
    this.maxGen  = 4;
    this.offUI   = {x:0, y:0};
    this.offLS   = {x:0, y:0};
    this.initLen = 400;
    this.initRot = -PI/2;
    this.lenFac  = 0.5;


    // QAD Wind Simulation
    this.doQADWind = false;
    this.windSpeed = 240;
  } // Ends Constructor

  //####################################################################
  //>>> GETTERS
  //####################################################################

  // defines if some state exists to update/render/etc.
  isActive(){return (this.axiom && this.rules);}
  getCurGen(){return this.curGen;}
  getMaxGen(){return this.maxGen;}

  //####################################################################
  //>>> SETTERS
  //####################################################################

  // Inits xor Recycles init L-Sys state (can add/edit via resp. setter)
  init(axiom,rules,theta,maxGen){
    this.axiom  = axiom;
    this.corpus = this.axiom;
    this.rules  = rules;
    this.theta  = (theta)  ? theta  : 0;
    this.maxGen = (maxGen) ? maxGen : 4;
    this.curGen = 0;
    return this; // for function chaining
  } // Ends Function init

  // Function 'init', but loads in a pre-defined config (per old def.)
  loadConfig(config){
    this.axiom  = config.axiom;
    this.corpus = this.axiom;
    this.rules  = config.rules;
    this.theta  = config.theta;
    this.curGen = 0;
    this.maxGen = config.maxGen;
    this.initLen = config.initLen;
    this.initRot = config.initRot;
    this.offLS   = config.offLS;
    return this; // for function chaining
  }

  addRule(nR)   {this.rules.push(nR);}
  addRules(nRs) {nRs.forEach((nR)=>{this.addRule(nR);})}
  setTheta(nT)  {this.theta = nT;}
  setMaxGen(nMx){this.maxGen = mMx;}

  setInitRot(val){this.initRot=val;}
  setInitLen(val){this.initLen=val;}
  setLenFac(val){this.lenFac=val;}


  //>>> Function generate: Advances L-System Sentence forward by 1 generation
  generate() {
    //if(this.curGen < this.maxGen){
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
    //}
  } // Ends Function generate

  // Used to insta-advance to max generations i.e. skip iter key presses
  instaGenerate(){for(let i=0; i<this.maxGen; i++){this.generate();}return this;}



  QAD_WindSim(){
    let rawLerp = sin(lerp(0,PI,((frameCount%this.windpeed)/this.windpeed)));
    lsys.setTheta(radians(lerp(10,30,rawLerp)))
    rotate(radians(lerp(-10,10,rawLerp)));
  } // Ends Function QAD_WindSim



  render(){
    fill(0);
    translate(this.offUI.x+this.offLS.x, this.offUI.y+this.offLS.y); 
    rotate(this.initRot);
    //if(this.doQADWind){this.QAD_WindSim();}
    this.turtleRender();
  } // Ends Function render


  turtleRender(){
    let sen = this.corpus;
    let len = this.initLen * pow(this.lenFac, this.curGen);
    let ang = this.theta;
    let idx = this.curGen;

    stroke(255);

    for (let i = 0; i < sen.length; i++) {
      let c = sen.charAt(i);
      if (c === 'F') {
        strokeWeight(1);
        line(0,0,len,0);
        translate(len,0);
      }
      else if (c === '+') {rotate(ang);}
      else if (c === '-') {rotate(-ang);}
      else if (c === '|') {rotate(PI);}
      else if (c === '[') {push();idx--;}
      else if (c === ']') {pop();idx++;}
    }
  } // Ends Function turtleRender

} // Ends Class LSystem