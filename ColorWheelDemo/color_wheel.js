


class ColorWheel{
  constructor(c1, c2, inR, outR, nSl){
    this.col1    = c1;
    this.col2    = c2;
    this.inRad   = inR;
    this.outRad  = outR;
    this.nSlices = nSl;

    // inner/outer Vertices for color slice trapezoids
    this.iVerts  = []; // inner vertices
    this.oVerts  = []; // outer vertices

    this.initVerts();
  }

  initVerts(){
    let deg = 0;
    let deltaDeg = 360/this.nSlices;
    for(let i=0; i<this.nSlices; i++){
      this.iVerts.push(createVector(this.trapzXPos(deg,this.inRad),this.trapzYPos(deg,this.inRad)));
      this.oVerts.push(createVector(this.trapzXPos(deg,this.outRad),this.trapzYPos(deg,this.outRad)));
      deg+=deltaDeg;
    }
  }

  // these assign vals WRT 'global origin' (i.e. does NOT use 'push/translate/pop' technique!)
  trapzXPos(d,r){return (width/2) + r * cos(radians(d));}
  trapzYPos(d,r){return (width/2) + r * sin(radians(d));}


  render(){
    colorMode(HSB);
    strokeWeight(1);

    let lVal;

    let j;

    for(let i = 0; i<this.nSlices; i++){
      
      if(i<this.nSlices-1){j=i+1;}
      else{j=0;}

      lVal = lerp(0,360,i/this.nSlices);

      stroke(lVal,COL_SAT,100);fill(lVal,COL_SAT,100);
      quad(this.iVerts[i].x, this.iVerts[i].y, this.iVerts[j].x, this.iVerts[j].y,
           this.oVerts[j].x, this.oVerts[j].y, this.oVerts[i].x, this.oVerts[i].y);
    }


  }


}