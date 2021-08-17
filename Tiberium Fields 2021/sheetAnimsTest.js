/*======================================================================
|>>> sheetAnimsTest.js
+-----------------------------------------------------------------------
| Description: Loader/Render methods for testing/debugging the creation
|              and rendering of animation [sequence] objects of the RA-1
|              ORE and GEM sprites alongside the RS-1 Aetherium sprites.
*=====================================================================*/
function sheetTest_initAnims(){
  // RA-1 ORE
  testAnims.push( createAnimSeq(sprSheet, 24, 24, [0,0], 12) );
  testAnims.push( createAnimSeq(sprSheet, 24, 24, [1,4], 12) );
  testAnims.push( createAnimSeq(sprSheet, 24, 24, [3,0], 12) );
  testAnims.push( createAnimSeq(sprSheet, 24, 24, [4,4], 12) );

  // RA-1 GEMS
  testAnims.push( createAnimSeq(sprSheet, 24, 24, [6,0], 3) );
  testAnims.push( createAnimSeq(sprSheet, 24, 24, [6,3], 3) );
  testAnims.push( createAnimSeq(sprSheet, 24, 24, [6,6], 3) );
  testAnims.push( createAnimSeq(sprSheet, 24, 24, [7,1], 3) );

  // RS-1 AETHERIUM
  testAnims.push( createAnimSeq(sprSheet, 24, 24, [7,4], 4) );
} // Ends Function sheetTest_initAnims

// Render {ore/gem/aeth} sheet, coord sheet, and all animations
function sheetTest_render(){sheetTest_renderSheets(); sheetTest_renderAnims();
} // Ends Function sheetTest_render

// Render {ore/gems/aeth} and coord sheets as-a-whole
function sheetTest_renderSheets(){image(sprSheet,0,0,192,192); image(coordSheet,216,0,192,192);
} // Ends Function sheetTest_renderSheets

// Render animations \foreach {ore/gem/aeth} sequence
function sheetTest_renderAnims(){
  // starting coords to draw them, and offset therefrom
  let initX = 72; let initY = 256; let xyOffset = 48;

  let curPos = [initX, 256];
  testAnims.forEach((a,i)=> {
    push();
      translate(curPos[0],curPos[1]);
      switch(a.numFrames){case 3: a.animate(96); break; case 4: a.animate(72); break; case 12: a.animate(24); break;}
      if(i==3){curPos[1]+=xyOffset; curPos[0]=initX;} else{curPos[0]+=xyOffset;}
    pop();
  });
} // Ends Function sheetTest_renderAnims