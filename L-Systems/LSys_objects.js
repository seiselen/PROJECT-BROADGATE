



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
 > offLS  = offset specified by L-Sys 
+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=*/
class LSystem{
  // NOTE: Object state is 'properly'/officially' assigned via init function
  constructor(){
    // A/O 9/24: used to put berries on trees :-)
    this.fixedRandom = Array(100).fill(0).map((v)=>v=random(100));
    // QAD Wind Simulation
    this.doQADWind = false;
    this.windSpeed = 240;
    this.cfigKey   = 'none'; // key of config


    this.prevBracket; // used with QAD fruit growth
  } // Ends Constructor

  //####################################################################
  //>>> GETTERS
  //####################################################################

  // defines if some state exists to update/render/etc.
  isActive(){return (this.axiom && this.rules);}
  getCurGen(){return this.curGen;}
  getMaxGen(){return this.maxGen;}


  // Function 'init', but loads in a pre-defined config (per old def.)
  loadConfig(configKey){
    this.cfigKey = configKey;
    let config   = templates[configKey];
    this.axiom   = config.axiom;
    this.corpus  = this.axiom;
    this.rules   = config.rules;
    this.theta   = config.theta;
    this.curGen  = 0;
    this.maxGen  = config.maxGen;
    this.baseLen = config.baseLen;
    this.baseRot = radians((360+config.baseRot)%360); // xtra syntax converts negative degs to positive equivalent
    this.offset  = templates.getOffset(config);
    return this; // for function chaining
  }

  addRule(nR)   {this.rules.push(nR);}
  addRules(nRs) {nRs.forEach((nR)=>{this.addRule(nR);})}
  setTheta(nT)  {this.theta = nT;}
  setMaxGen(nMx){this.maxGen = mMx;}

  setInitRot(val){this.baseRot=val;}
  setInitLen(val){this.baseLen=val;}
  setInitTheta(val){this.theta=val;} // MISNOMER, as used by slider 'onChanged' to [re]set theta
  setLenFac(val){this.lenFac=val;}

  handleKeyPressed(key){
    if(key == 'g'){this.generate();}
  }

  //>>> Function generate: Advances L-System Sentence forward by 1 generation
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

  // Used to insta-advance to max generations i.e. skip iter key presses
  instaGenerate(){for(let i=0; i<this.maxGen; i++){this.generate();}return this;}



  QAD_WindSim(){
    let rawLerp = sin(lerp(0,PI,((frameCount%this.windpeed)/this.windpeed)));
    lsys.setTheta(radians(lerp(10,30,rawLerp)))
    rotate(radians(lerp(-10,10,rawLerp)));
  } // Ends Function QAD_WindSim



  render(){
    fill(0);
    translate(this.offset.x, this.offset.y); 
    rotate(this.baseRot);
    //if(this.doQADWind){this.QAD_WindSim();}
    this.turtleRender();
  } // Ends Function render


  turtleRender(){
    let sen = this.corpus;
    let len = this.baseLen;
    let ang = radians(this.theta);
    let idx = this.curGen;

    stroke("#8c510a");

    this.prevBracket = '?';


    for (let i = 0; i < sen.length; i++) {
      let c = sen.charAt(i);
      if (c === 'F') {
        strokeWeight(1); stroke(60);
        line(0,0,len,0);
        translate(len,0);
      }
      if (c === 'G') {
        translate(len,0);
      }
      else if (c === '+') {rotate(ang);}
      else if (c === '-') {rotate(-ang);}
      else if (c === '|') {rotate(PI);}
      else if (c === '[') {push();idx--;}
      else if (c === ']') {pop();idx++;}
    }
  } // Ends Function turtleRender


  // called this <vs> "strokeWeight(1); stroke(60);" in handling of 'F' production symbol
  QADTreeColor(idx,len){
    strokeWeight((idx*1.5)+1);
    stroke(lerpColor(color("#bf812d"),color("#543005"), idx/this.maxGen));
  }

  // called this below call of line(...) in handling of 'F' production symbol
  QADTreeFruit(sen,len){
    if(sen.charAt(i+1) === ']' && this.prevBracket === '['){
      this.prevBracket = '?';
      if(idx<=1 && this.fixedRandom[(i%100)]<50){
        stroke(24,168,72); strokeWeight(0.5); fill(96,int(lerp(180,240,(i%100)/100)),108); 
        ellipse(len,0,int(lerp(8,12,(i%100)/100)),int(lerp(8,12,(i%100)/100)));
      };
    }
    else if(sen.charAt(i+1) === '[' && this.prevBracket === '?'){
      this.prevBracket = '[';
    }    
  }

} // Ends Class LSystem