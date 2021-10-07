

var rangePts = [];
var rangeLns = [];
var genPts   = [];
var numPts   = 100;

function setup(){
  createCanvas(1200,800).parent("viz");
  ellipseMode(CENTER,CENTER);

  rangePts.push(new RegionPt(width/2,0,RegionPt.Axis.X_TOP));
  rangePts.push(new RegionPt(width/2,0,RegionPt.Axis.X_BOT));
  rangePts.push(new RegionPt(0,height/2,RegionPt.Axis.Y_LFT));
  rangePts.push(new RegionPt(0,height/2,RegionPt.Axis.Y_RGT));
  rangePts.push(new RegionPt(width/2,height/2));

  rangeLns.push(new RegionLn(rangePts[0].pos,rangePts[2].pos));
  rangeLns.push(new RegionLn(rangePts[1].pos,rangePts[3].pos));

}


function draw(){
  
  //>>> RENDER CALLS
  background(255);
  drawCanvasBorder();
  drawGrid(20,"#FF780040",undefined);

  rangeLns.forEach((ln)=>ln.render());
  rangePts.forEach((pt)=>pt.render());

  genPts.forEach((pt)=>{noStroke();fill(60);ellipse(pt.x,pt.y,10,10);});

  drawMouseDragPtProjectionsAndIntersects(rangeLns[0], rangeLns[1], rangePts[4].pos);


  drawFPS();
}


function mousePressed(){if(mouseInCanvas() && mouseButton==LEFT){rangePts.forEach(pt => pt.onMousePressed(mousePtToVec()));}}
function mouseReleased(){rangePts.forEach(pt => pt.onMouseReleased());}
function mouseDragged(){if(mouseInCanvas() && mouseButton==LEFT){rangePts.forEach(pt => pt.onMouseDragged(mousePtToVec()));}}

function keyPressed(){
  if(key==' '){genPts = createRandomPtsWRTRegLines(numPts,rangeLns[0],rangeLns[1]);}
}

function createRandomPtsWRTRegLines(nPts,tLine,bLine){
  let nCreated = 0;
  let retPts   = [];
  let candPt   = null;
  let cPtTopIsct, cptBotIsct;
  while(nCreated < nPts){
    candPt     = vec2(int(random(40,width-40)),int(random(40,height-40)));
    cPtTopIsct = intersectPt(bLine.p, bLine.q, candPt, orthoProjPt(tLine.p, tLine.q, candPt));
    cptBotIsct = intersectPt(tLine.p, tLine.q, candPt, orthoProjPt(bLine.p, bLine.q, candPt));
    if(cPtTopIsct||cptBotIsct){continue;}
    if(retPts.filter((pt)=>distSq(pt.x,pt.y,candPt.x,candPt.y)<=1000).length>0){continue;}
    nCreated++;
    retPts.push(candPt);
  }
  return retPts;
}


function drawMouseDragPtProjectionsAndIntersects(tLine,bLine,dragPt){
  let temp1 = orthoProjPt(bLine.p, bLine.q, dragPt);
  let temp2 = orthoProjPt(tLine.p, tLine.q, dragPt);
  let temp3 = intersectPt(bLine.p, bLine.q, dragPt, temp2);
  let temp4 = intersectPt(tLine.p, tLine.q, dragPt, temp1);

  fill(0,60,255); stroke(0,180,255);
  line(dragPt.x,dragPt.y,temp1.x,temp1.y);
  line(dragPt.x,dragPt.y,temp2.x,temp2.y);  
  ellipse(temp1.x,temp1.y,20,20);
  ellipse(temp2.x,temp2.y,20,20);

  noFill();stroke(255,36,24);
  if(temp3){ellipse(temp3.x,temp3.y,20,20);}
  if(temp4){ellipse(temp4.x,temp4.y,20,20);}
}


// a.k.a. normalPt (via shiffman)
function orthoProjPt(lp,lq,pt){
  let vecA = p5.Vector.sub(pt, lp);
  let vecB = p5.Vector.normalize(p5.Vector.sub(lq, lp));
  vecB.mult(vecA.dot(vecB));
  return p5.Vector.add(lp,vecB);
}

// Modified Via Original: https://editor.p5js.org/peanutscratch/sketches/rk7Mi9USz
function intersectPt(l1p,l1q,l2p,l2q){
  let dtmt = (l2q.y-l2p.y)*(l1q.x-l1p.x)-(l2q.x-l2p.x)*(l1q.y-l1p.y);
  let numA = (l2q.x-l2p.x)*(l1p.y-l2p.y)-(l2q.y-l2p.y)*(l1p.x-l2p.x);
  let numB = (l1q.x-l1p.x)*(l1p.y-l2p.y)-(l1q.y-l1p.y)*(l1p.x-l2p.x);
  let uA   = numA/dtmt; 
  let uB   = numB/dtmt;
  //> Coincident => Return Common Midpoint
  if (abs(numA)==0 && abs(numB)==0 && abs(dtmt)==0){return vec2((l1p.x+l1q.x)/2,(l1p.y+l1q.y)/2);}
  //> Parallel => Return Null
  if (abs(dtmt)==0){return null;}
  //> Intersection => Return Intersection Point
  if (uA>=0 && uA<=1 && uB>=0 && uB<=1){return vec2(l1p.x+(uA*(l1q.x-l1p.x)), l1p.y+(uA*(l1q.y-l1p.y)));}
  //> Non-Intersection => Return Null 
  return null;
}




class RegionLn{
  constructor(pt1,pt2){
    this.p = pt1;
    this.q = pt2;
  }
  render(){stroke(60);line(this.p.x, this.p.y, this.q.x, this.q.y);}
}


class RegionPt{
  static Axis = {X_TOP:'t', X_BOT:'b', Y_LFT:'l', Y_RGT:'r'}

  constructor(posX,posY,axis){
    this.pos   = vec2(posX,posY);
    this.rad   = 10;
    this.diam  = this.rad*2;
    this.radSq = this.rad*this.rad; // radius squared
    this.lenBd = this.diam*4; // length bound
    this.fixAx = axis; // axes in which fixed
    this.msOff = vec2(); // mouseOffset
    this.constrainPosToAxis();
    this.initGFXVals();
  }

  initGFXVals(){
    this.regFill = color(253,141,60);
    this.hovFill = color(180,240,180);
    this.selFill = color(108,204,120);
    this.regStrk = color(60);
    this.selStrk = color(0,108,48);
    this.hovStrk = color(0,108,48);
    this.regSWgt = 1;
    this.hovSWgt = 2;
    this.selSWgt = 4;
  }

  constrainPosToAxis(){
    switch(this.fixAx){
      case RegionPt.Axis.X_TOP: this.pos.y = this.diam;        break;
      case RegionPt.Axis.X_BOT: this.pos.y = height-this.diam; break;
      case RegionPt.Axis.Y_LFT: this.pos.x = this.diam;        break;
      case RegionPt.Axis.Y_RGT: this.pos.x = width-this.diam;  break;
    }
    switch(this.fixAx){
      case RegionPt.Axis.X_TOP: case RegionPt.Axis.X_BOT: this.pos.x = constrain(this.pos.x, this.lenBd, width-this.lenBd);  break;
      case RegionPt.Axis.Y_LFT: case RegionPt.Axis.Y_RGT: this.pos.y = constrain(this.pos.y, this.lenBd, height-this.lenBd); break;
    }
  }

  onMousePressed(mousePt){if(this.mouseOverMe()){this.isSelected = true; this.msOff=p5.Vector.sub(this.pos,mousePt);}}
  onMouseDragged(mousePt){if(this.isSelected){this.pos.set(p5.Vector.add(this.msOff,mousePt)); this.constrainPosToAxis();}}
  onMouseReleased(mousePt){if(!this.isSelected){return;} this.isSelected=false;}

  mouseOverMe(){return distSq(mouseX,mouseY,this.pos.x,this.pos.y) <= this.radSq;}
  mousePressedOverMe(){return mouseIsPressed && this.mouseOverMe();}

  render(){
    if     (this.mousePressedOverMe()){stroke(this.selStrk); strokeWeight(this.selSWgt); fill(this.selFill); ellipse(this.pos.x, this.pos.y, this.diam-2);}
    else if(this.mouseOverMe())       {stroke(this.hovStrk); strokeWeight(this.hovSWgt); fill(this.hovFill); ellipse(this.pos.x, this.pos.y, this.diam-1);}
    else                              {stroke(this.regStrk); strokeWeight(this.regSWgt); fill(this.regFill); ellipse(this.pos.x, this.pos.y, this.diam);}
  }
} // Ends Class RegionPt 