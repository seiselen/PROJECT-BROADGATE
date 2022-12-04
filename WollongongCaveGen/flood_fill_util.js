

//> SOURCE NOTE: A bunch of methods herein are borrowed (with love ♥) from ZAC code repo 
class FloorFillUtil {

  // Any 'islands' at-or-below this % of total pixels is filled in <xor> voided out
  static FLOOD_FILL_AREA_PCT = 0.25;

  constructor(boundBlendImage){
    this.boundImg = boundBlendImage;
    this.floodArea = (this.boundImg.dim*this.boundImg.dim)*FloorFillUtil.FLOOD_FILL_AREA_PCT;
  }






  cellInBounds(r,c){
    return (r>=0 && r<this.boundImg.dim &&c>=0 && c<this.boundImg.dim);
  }


  /*> QAD Algorithm given that:
      o pixel[0][0] is 99.9% guaranteed to be in main 'filled' region
      o pixel[dimH][dimH] likewise guaranteed to be main 'void' region
  */
  floodFill(){

    //> Create array rep of entire image. with vals init'd to [false]

    //> perform flood fill on pixel at [0][0], with seed of [true]. this should be main 'filled' part of image

    //> perform flood fill on pixel at [dimH][dimH], with seed of [true]. this should be main 'voidous' part of image

    //> prep maxIters-based sentinel, and 'regionFound' sentinel to value [true]

    //> [while] curIter<maxIters and 'regionFound'==true, do:

    //>> set 'regionFound' to [false]
    
    //>> find first coord of value [false], e.g. via naiive sweep. 
    
    //>>> if none found, return. regionFound remains [false], ergo while loop will quit 

    //>>> else get corresp. image value for this pixel; i.e. [WHITE] xor [BLACK] and store opposite, as that's what we [might] fill

    //>>> perform flood fill with seed of [true]; WHILE collecting all discovered (i.e. [false]) pixels into an array

    //>>> if size of array is <= this.floodArea: fill all members thereof with their opposite color (i.e. either 'fill' xor 'void')

    //>>> set 'regionFound' to [true]

  }




  floodFillStep(seedRow, seedCol, newVal){
    if(!this.map.cellInBounds(seedRow,seedCol)){return;}
    let curVal    = this.map.getValueAt(seedRow,seedCol);
    let temp      = null;
    let openSet   = [];
    let closedSet = new Map();
    let curSec    = 0;
    let maxSec    = this.map.cellsWide*this.map.cellsTall;
    
    openSet.push([seedRow,seedCol]);
    closedSet.set(""+seedRow+","+seedCol, 1);

    while(curSec<maxSec && openSet.length > 0){
      temp = openSet.shift();
      this.map.setValueAt(temp,newVal);
      for(let adjR = temp[0]-1; adjR <= temp[0]+1; adjR++){
        for(let adjC = temp[1]-1; adjC <= temp[1]+1; adjC++){
          // Von Neuman Neighborhood <vs> Moore bc of pesky diagonal-border cells
          if(this.map.cellInBounds(adjR,adjC) && (adjR==temp[0] || adjC==temp[1])){
            // Final conditional makes sure all prospective filled tiles need to match original seed tile type
            if(!closedSet.get(""+adjR+","+adjC) && this.map.getValueAt(adjR,adjC) == curVal){
              closedSet.set(""+adjR+","+adjC, 1);
              openSet.push([adjR,adjC]);    
            }          
          }   
        }
      }
      curSec++;
    }
    // console.log("SEC = " + curSec + " MAX = " + maxSec);
    openSet.length = 0;
    closedSet.clear();
  } // Ends Function floodFill


}