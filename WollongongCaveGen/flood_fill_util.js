

//> SOURCE NOTE: A bunch of methods herein are borrowed (with love ♥) from ZAC code repo 
class FloodFillUtil {

  // Any 'islands' at-or-below this % of total pixels is filled in <xor> voided out
  static FLOOD_FILL_AREA_PCT = 0.25;

  constructor(boundBlendImage){
    this.boundImage  = boundBlendImage.image_WBlend;
    this.imageDim    = boundBlendImage.dim;
    this.imageDimH   = boundBlendImage.dimH;    
    this.maxFloodReg = (this.imageDim*this.imageDim)*FloodFillUtil.FLOOD_FILL_AREA_PCT;
    this.maxSec      = this.imageDim*this.imageDim;
    this.maxProbes   = 64; // i.e. should be less than 64 disjoint 'island' regions
    this.pixelRepArr = null;
  }



  cellInBounds(r,c){
    return (r>=0 && r<this.imageDim &&c>=0 && c<this.imageDim);
  }


  createPixelRepArray(){
    this.pixelRepArr = [];
    let row;
    for (let r = 0; r < this.imageDim; r++) {
      row = [];
      for (let c = 0; c < this.imageDim; c++) {
        row.push(false);
      }
      this.pixelRepArr.push(row);  
    }
  }

  areAllPixelsObserved(){
    for (let r = 0; r < this.imageDim; r++) {
      for (let c = 0; c < this.imageDim; c++) {
        if(this.pixelRepArr[r][c]==false){return false;}
    }}
    return true;
  }




  /*> QAD Algorithm given that:
      o pixel[0][0] is 99.9% guaranteed to be in main 'filled' region
      o pixel[dimH][dimH] likewise guaranteed to be main 'void' region
  */
  floodFill(){
    //> Create array rep of entire image. with vals init'd to [false]
    this.createPixelRepArray();
    //> do non-paint flood fill on pixel at [0][0], with seed of [true]. this should be main 'filled' part of image
    this.floodFillStep(0,0);
    //> do non-paint flood fill on pixel at [dimH][dimH], with seed of [true]. this should be main 'voidous' part of image
    this.floodFillStep(this.imageDimH,this.imageDimH);
    //> if above two covers ALL pixels, there is nothing to fill nor void - WE'RE DONE! (i.e. repeat 'floodFill' calls)
    if(this.areAllPixelsObserved()){console.log("Image Seems Correctly Filled"); return;}
    //> prep maxIters-based sentinel, and 'regionFound' sentinel to value [true]
    let curProbe = 0; let regionFound=true;
    //> [while] curIter<maxIters and 'regionFound'==true, do:
    while(curProbe<this.maxProbes&&regionFound===true){
      //>> set 'regionFound' to [false]
      regionFound = false;
      for (let r = 0; r < this.imageDim; r++) {
        for (let c = 0; c < this.imageDim; c++) {
          //>> find first coord of value [false], e.g. via naiive sweep. 
          if(this.pixelRepArr[r][c]==false){
            //>>> get corresp. image value for this pixel; and store opposite, as that's what we [might] fill
            let fillVal = (this.boundImage.get(c,r)[0]===0) ? 255 : 0;
            //>>> set 'regionFound' to [true]
            regionFound = true;
            //>>> perform flood fill with seed of [true]; WHILE collecting all discovered (i.e. [false]) pixels into an array
            let doEditSet = this.floodFillStep(r,c,fillVal);
            //>>> if size of array is <= this.floodArea: fill all members thereof with their opposite color (i.e. either 'fill' xor 'void')
            if(doEditSet!==undefined&&doEditSet.length>0){
              this.fillPixelsOfDoEditSet(doEditSet,fillVal);
            }
          }
          //>>> else no [false] pixel reps found, regionFound remains [false], ergo while loop will quit
      }} // Ends Double-For Loop
      // don't forget to iterate the while loop sentinel!
      curProbe++;
    } // Ends While Loop

  } // Ends Function floodFill

  floodFillStep(seedRow, seedCol, newVal=undefined){
    if(!this.cellInBounds(seedRow,seedCol)){return;}

    // Column-Major to correspond with 'get(*x*,*y*)'
    let seedVal   = this.boundImage.get(seedCol,seedRow)[0];
    let temp      = null;
    let openSet   = [];
    let closedSet = new Map();
    let doEditSet = []; // will contain [row][col] of pixels to fill, A/A
    let curSec    = 0;
    
    openSet.push([seedRow,seedCol]);
    closedSet.set(""+seedRow+","+seedCol, 1);

    while(curSec<this.maxSec && openSet.length>0){
      temp = openSet.shift();

      // lets this util know that the pixel has been handled
      this.pixelRepArr[temp[0]][temp[1]] = true;
      // if we are painting a [qualified] region, add this coord to target set 
      if(newVal!==undefined){doEditSet.push({row:temp[0],col:temp[1]})}

      for(let adjR = temp[0]-1; adjR <= temp[0]+1; adjR++){
        for(let adjC = temp[1]-1; adjC <= temp[1]+1; adjC++){

          // Von Neuman Neighborhood <vs> Moore bc of pesky diagonal-border cells
          if(this.cellInBounds(adjR,adjC) && (adjR==temp[0] || adjC==temp[1])){

            // You were not yet visited in this round of FloodFill AND you are same color as seed pixel
            if(!closedSet.get(""+adjR+","+adjC) && this.boundImage.get(adjC,adjR)[0] === seedVal){
              closedSet.set(""+adjR+","+adjC, 1);
              openSet.push([adjR,adjC]);
            }          
          }   
        }
      }
      curSec++;
    }
    //console.log("SEC = " + curSec + " MAX = " + this.maxSec);
    openSet.length = 0;
    closedSet.clear();
    return doEditSet; // will be empty if not changing vals xor degenerate
  } // Ends Function floodFillStep


  fillPixelsOfDoEditSet(set,val){
    this.boundImage.loadPixels()
    // Column-Major to correspond with 'set(*x*,*y*)'
    set.forEach(coord=>this.boundImage.set(coord.col,coord.row,color(val)));
    this.boundImage.updatePixels();
  }

}