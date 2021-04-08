/*----------------------------------------------------------------------
|>>> Function initKeyReps - QAD Notes
+-----------------------------------------------------------------------
| Description: This method populates a Javascript Map type with KeyRep
|              objects corresponding to the keys currently supported by
|              this visualization/demo. Yes: it looks disgusting... and
|              Yes: it can definitely be improved/refactored; but I want
|              to get this out per Broadgate/Spellbreaker ops, so will
|              K.I.S.S. and #YOLO for now and maybe revise later... 
+---------------------------------------------------------------------*/
function initKeyReps(){

  let row1Str = "QWERTYUIOP";
  let row2Str = "ASDFGHJKL";
  let row3Str = "ZXCVBNM"

  let uncVers = -1;

  let offKeys = keyLettWide+keyLettOffs;

  //--------------------------------------------------------------------
  //>>> ROW 1
  //--------------------------------------------------------------------
  let offX = 10; let offY = 20;

  keyReps.set(192, new KeyRep(offX, offY, 192, "` ~").setCustomDims(35,17.5)); 

  let row0Str = [
    ["1 !",49],
    ["2 @",50],
    ["3 #",51],
    ["4 $",52],
    ["5 %",53],
    ["6 ^",54],
    ["7 &",55],
    ["8 *",56],
    ["9 (",57],
    ["0 )",48],
    ["- _",189],
    ["= +",187]
  ];

  offX -= 5;

  for (var i = 0; i < row0Str.length; i++) {
    offX += offKeys;
    keyReps.set(row0Str[i][1], new KeyRep(offX, offY, row0Str[i][1], row0Str[i][0]));    
  }

  offX += offKeys;
  keyReps.set(8, new KeyRep(offX, offY, 8, "Backspace").setCustomDims(90,45,16));  

  //--------------------------------------------------------------------
  //>>> ROW 2
  //--------------------------------------------------------------------

  offX = 10; offY += 10 + keyLettTall;
  keyReps.set(9, new KeyRep( offX , offY , 9, "Tab").setCustomDims(60,30));

  offX+=20;
  for (var i = 0; i < row1Str.length; i++) {
    uncVers = unchar(row1Str[i]);
    offX += offKeys
    keyReps.set(uncVers, new KeyRep( offX , offY , uncVers));
  }

  offX += offKeys;
  keyReps.set(219, new KeyRep(offX, offY, 219, "{  ["));

  offX += offKeys;
  keyReps.set(221, new KeyRep(offX, offY, 221, "}  ]"));  

  offX += offKeys;
  keyReps.set(220, new KeyRep(offX, offY, 220, "|  \\").setCustomDims(65,32.5));  

  //--------------------------------------------------------------------
  //>>> ROW 3
  //--------------------------------------------------------------------

  offX = 10; offY += 10 + keyLettTall;
  keyReps.set(20, new KeyRep( offX , offY , 20, "Caps Lock").setCustomDims(85,42.5,16));

  offX += 45;
  for (var i = 0; i < row2Str.length; i++) {
    uncVers = unchar(row2Str[i]);
    offX += offKeys
    keyReps.set(uncVers, new KeyRep(offX, offY, uncVers));
  }

  offX += offKeys;
  keyReps.set(186, new KeyRep(offX, offY, 186, ":  ;"));

  offX += offKeys;
  keyReps.set(222, new KeyRep(offX, offY, 222, "\"  \'"));

  offX += offKeys;
  keyReps.set(13, new KeyRep( offX , offY , 13, "Enter").setCustomDims(90,45,-90)); 

  //--------------------------------------------------------------------
  //>>> ROW 4
  //--------------------------------------------------------------------

  offX = 10; offY += 10 + keyLettTall;
  keyReps.set(16, new KeyRep( offX , offY , 16, "Shift").setCustomDims(110,55));

  offX += 70;
  for (var i = 0; i < row3Str.length; i++) {
    uncVers = unchar(row3Str[i]);
    offX += offKeys
    keyReps.set(uncVers, new KeyRep(offX, offY, uncVers));
  }

  offX += offKeys;
  keyReps.set(188, new KeyRep(offX, offY, 188, "<  ,"));

  offX += offKeys;
  keyReps.set(190, new KeyRep(offX, offY, 190, ">  ."));

  offX += offKeys;
  keyReps.set(191, new KeyRep(offX, offY, 191, "?  /"));

  offX += offKeys;
  keyReps.set(-1, new KeyRep(offX, offY, -1, "A\nN\nY").setCustomDims(15,7.5,10));

  //--------------------------------------------------------------------
  //>>> ROW 5
  //--------------------------------------------------------------------

  offX = 10; offY += 10 + keyLettTall;
  keyReps.set(17, new KeyRep( offX , offY , 17, "Control").setCustomDims(110,55));

  offX += 120;
  keyReps.set(18, new KeyRep( offX , offY , 17, "Alt").setCustomDims(60,30));

  offX += 70;
  keyReps.set(32, new KeyRep( offX , offY , 17, "______ Space ______").setCustomDims(345,172.5));

  offX += 305;

  row0Str = [
    ["⯇",37],
    ["⯅",38],
    ["⯈",39],
    ["⯆",40],
  ];

  for (var i = 0; i < row0Str.length; i++) {
    offX += offKeys;
    keyReps.set(row0Str[i][1], new KeyRep(offX, offY, row0Str[i][1], row0Str[i][0]));    
  }

} // Ends Method initKeyReps