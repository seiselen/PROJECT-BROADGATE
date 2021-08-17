


/*----------------------------------------------------------------------
|>>> Function createAnimSeq 
+-----------------------------------------------------------------------
| Description: (QAD) Creates everything needed to animate a behavior.
|              This [currently] only works for spritesheets composed of
|              equally sized and spaced square sprites (i.e. rectangular
|              and/or staggered position NOT currently supported). This
|              version does, however, support sprite sequences contained
|              over multiple rows.
| Variables:   (QAD) Names/Descriptions as follows...
|  > sheet:   p5.Image containing the sprite sheet
|  > iDim:    'input dimension' i.e. square pixels composing each sprite
|  > oDim:    'output dimension' i.e. square pixels for which the sprite 
|             will be drawn to the screen. Can be different than iDim, 
|             and is usually 'cellSize' (or its equivalent WLOG).
|  > stCoord: [row,col] in spritesheet where to start gathering sprites.
|             Suffice to say: these are WRT zero-indexing.
|  > nFrames: Number of sprite frames to gather for the animation.
+---------------------------------------------------------------------*/
function createAnimSeq(sheet, iDim, oDim, stCoord, nFrames){
  let animArr = [];
  let curRow  = stCoord[0];
  let curCol  = stCoord[1];
  let nRows   = sheet.height/iDim;
  let nCols   = sheet.width/iDim;

  for(let i=0; i<nFrames; i++){
    // jump to first col of next row if at last col of cur row
    if(curCol == nCols){curCol = 0; curRow++;}
    animArr.push(sheet.get(curCol*iDim,curRow*iDim,iDim,iDim));
    curCol++;
  } // Ends For Loop

  return {anim: animArr, numFrames: nFrames, curFrame: 0, sprDim: oDim,
    animate: function(frmDel=6){this.render(); if(frameCount%frmDel==0){this.curFrame=(this.curFrame+1)%this.numFrames;}},
    render(){image(this.anim[this.curFrame], 0, 0, this.sprDim, this.sprDim);}
  };
} // Ends Function createAnimSeq