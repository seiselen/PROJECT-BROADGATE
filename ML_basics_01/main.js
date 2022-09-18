

// used for var destructure demo i.e. "const {project} = qq" indeed results in (project=='Hydrocon')
const qq = {
  name:    'Kaiser Soze',
  id:      'C24-9001',
  dept:    'UAC Energy',
  project: 'Hydrocon',
  region:  'Mars, East Eosia',
  base:    'UAC Paddock Complex',
  site:    'Alpha Labs III',
  seclear: 'TEC-04'
}


function setup(){
  createCanvas(800,800).parent("viz");
  ellipseMode(CENTER,CENTER);



} // Ends P5JS Function setup


function draw(){
  background(0,120,240);

} // Ends P5JS Function draw



function mousePressed(){
  if(mouseValid()){;}
} // Ends P5JS Function mousePressed

function mouseReleased(){
  ;
} // Ends P5JS Function mouseReleased

function mouseDragged(){
  if(mouseValid()){;}
} // Ends P5JS Function mouseDragged

function keyPressed(){
  /* stub */
} // Ends P5JS Function keyPressed

// TODO: PUT THIS IN SEISELEN "utils.js"
function mouseValid(button=LEFT, inCanvas=true){return (mouseInCanvas() == inCanvas) && (mouseButton == button);}