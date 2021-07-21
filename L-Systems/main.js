/*======================================================================
|>>> Project: L-System Demo/Testbed/Sandbox
+-----------------------------------------------------------------------
| OIC Op Info:  > "Initiative : BROADGATE" (Phase 2)
|               > "Project : GENESIS" (L-System / Shape Grammar PCG)
| Acronym Info: PCG => *Procedural *C*ontent *G*eneration
| Description:  [QAD] Interactive visualization and experimentation with
|               PCG of simple 2D L-System objects for mostly vegetation
|               (e.g. trees bushes, etc.); as well as other things that
|               can be generated utilizing [L-System] shape grammars. 
| Author Info: > Dan Shiffman (NYU / The Coding Train / Nature Of Code) 
|                for a chunk of the base L-System init and render code.
|              > Steven Eiselen (Eiselen Laboratories) for expansion and
|                enhancement thereupon, as well as UI/UX interactivity.
| Lang./Lib.:  JavaScript via P5JS
| Vers. Info:  I'll be utilizing GitHub for periodic updates (thank you
|              B-Gate Phase II projects for getting me into the habit!);
|              ergo check this repo's history for more info A/A.
+=====================================================================*/
var screenSize = 800;
var lsys;

function setup() {
  createCanvas(screenSize, screenSize).parent("viz");
  init_ui();
  initExamples();

  lsys = new LSystem().loadConfig(ex_6).instaGenerate();
} // Ends P5JS Function setup

//######################################################################
//>>> DRAW LOOP: LOGIC | UI CALLS | RENDER CALLS
//######################################################################

function draw() {

  //>>> RENDER CALLS
  background(120,180,216);
  lsys.render();

} // Ends P5JS Function draw


function keyTyped(){
  if(key == 'g'){lsys.generate();}
}


//######################################################################
//>>> MISC. ANIMATION/SCRIPTING
//######################################################################

/*
function treeColorQAD(idx){
  if(idx == 5){stroke(84,48,5);}
  if(idx == 4){stroke(140,81,10);}
  if(idx == 3){stroke(191,129,45);}
  if(idx == 2){stroke(39,100,25);}
  if(idx == 1){stroke(77,146,33);}
}
*/