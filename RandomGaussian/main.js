var normDistHists = [];
var autoGenPts = false; // if true, will add certain # of samples each frame
var numAutoPts = 64;    // # of samples to add each frame if autogen mode on

function setup(){
  createCanvas(1024,768).parent("viz");
  ellipseMode(CENTER,CENTER);

  normDistHists.push(new NormalDistHisto(vec2(32,32),vec2(960,320)).set_sDev(3));
  normDistHists.push(new NormalDistHisto(vec2(32,416),vec2(960,320)).set_sDev(3));
  normDistHists.forEach((h)=>h.populateHisto(65536));
}

function draw(){
  //>>> UPDATE CALLS
  if(autoGenPts){normDistHists.forEach((h)=>h.populateHisto(numAutoPts));}

  //>>> RENDER CALLS
  background(180,216,255);
  drawCanvasBorder();
  //drawGrid(32,"#FF780040",undefined);
  normDistHists.forEach((h)=>h.render());
  drawFPS();
  //fill(0); text("Mouse Cell Pos : "+(int(mouseX/32)*32)+", "+(int(mouseY/32)*32),480,640);
}

function keyPressed(){
  if(key=='a'||key=='A'){autoGenPts = !autoGenPts;}
  if(key=='c'||key=='C'){normDistHists.forEach((h)=>h.resetHisto());}  
}

function mousePressed(){
  if(mouseInCanvas()){normDistHists.forEach((h)=>h.onMousePressed());}
}


/*======================================================================
|>>> Class NormalDistHisto
+=====================================================================*/
class NormalDistHisto {
  constructor(pos,dim,mean=0,sdev=2){
    this.pos  = pos;
    this.dim  = dim;
    this.mpt  = vec2(this.dim.x/2,this.dim.y/2).add(this.pos);
    this.ept  = vec2(this.dim.x,this.dim.y).add(this.pos);
    this.mean = mean;
    this.sdev = sdev;
    this.hist = [];

    this.numSamples = 0;
    this.binBarWide = round(this.dim.x/202,2);
    this.binMaxSize = 0;
    this.histOffset = vec2(round((this.dim.x-(this.binBarWide*201))/2,1),this.dim.y/2);
    this.histAlignV = 'm'; //> vert. alignment WRT: {'m'->'middle' | 'wrt b'->'bottom'}

    this.initHisto();
  }

  // sets up 201 buckets; encompassing {-200,…,0,…,+200}
  initHisto(){for (let i=0; i<201; i++){this.hist.push([i-100,0]);}}

  // resets values of histogram buckets to zero
  resetHisto(){for (let i=0; i<201; i++){this.hist[i][1]=0;}}

  // for use as function chain call[s] following constructor call
  set_sDev(v){this.sdev=v; return this;}
  set_mean(v){this.mean=v; return this;}

  // can be used to 'insta-add' all points, 'incra-add' one at a time, etc.
  populateHisto(nItems=1){let nAdded = 0; while (nAdded<nItems){if(this.addSample()){nAdded++;}}}

  // called by 'populateHisto', this handles the work of adding a sample
  addSample(){
    let curVal = randomGaussian(this.mean);
    if(curVal>=-this.sdev && curVal<=this.sdev){
      curVal = round(map(curVal,-this.sdev,this.sdev,-100,100));
      this.hist[100+curVal][1]++;
      this.binMaxSize = max(this.binMaxSize,this.hist[100+curVal][1]);
      this.numSamples++;
      return true;
    }
  } // Ends Function addSampleToHisto

  toggleHistAlign(){
    this.histAlignV = (this.histAlignV=='m') ? 'b' : 'm';
  }

  onMousePressed(){
    if(this.mouseOverMe()){this.toggleHistAlign();}
  }

  mouseOverMe(){
    return (mouseX>this.pos.x)&&(mouseY>this.pos.y)&&(mouseX<this.ept.x)&&(mouseY<this.ept.y);
  } // Ends Function mouseOverMe


  render(){
    //this.renderBoundBox(); // intended for debug only
    this.renderHisto();
    this.renderCurNumPts();
  } // Ends Function render

  renderHisto(){
    push(); translate(this.pos.x+this.histOffset.x, this.pos.y+this.histOffset.y);
    stroke(60); strokeWeight(2); fill(60);
    let y1,y2;    
    for (let i=0; i<this.hist.length; i++) {
      y2 = map(this.hist[i][1],0,this.binMaxSize,0,this.dim.y);
      y1 = (this.histAlignV=='m') ? -y2/2 : (this.histAlignV=='b') ? -y2+this.histOffset.y : 0;
      rect(this.binBarWide*i,y1,this.binBarWide,y2);
    }
    pop(); // pops translation WRT pos[X/Y]
  } // Ends Function renderHisto


  renderCurNumPts(){
    if(!this.mouseOverMe()){return;}
    textAlign(CENTER,CENTER); textSize(32); fill(255); strokeWeight(2); stroke(0);  
    text("# Samples: "+this.numSamples, this.mpt.x, this.mpt.y);
  } // Ends Function renderCurNumPts
  

  renderBoundBox(){
    stroke(0,255,0,127); strokeWeight(4); noFill(); 
    rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
  } // Ends Function renderBoundBox

} // Ends Class NormalDistHisto