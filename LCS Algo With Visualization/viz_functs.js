function initUI(){
  ui_wordROW = createInput('').parent("ui_wordROW").size(200);
  ui_wordCOL = createInput('').parent("ui_wordCOL").size(200);
  ui_RunLCS = createButton("Go!").parent("ui_RunLCS").mousePressed(() => {
    if(ui_wordROW.value().length < 1 && ui_wordCOL.value().length < 1){return;}
    rowSeq = ui_wordROW.value().toUpperCase();
    colSeq = ui_wordCOL.value().toUpperCase();
    computeAndDisplayLCS();    
  });
}


function displayLCSMatrix(){
  background(60);
  stroke(255); fill(255);

  let xOff = fontSize/4;
  let yOff = fontSize;
  let s    = "";

  //>>> Header Row >>>
  s += "      ";
  for(let i=0; i<colSeq.length; i++){
    s += colSeq.charAt(i);
    if( i < colSeq.length-1){s+=" ";}
  }
  text(s,xOff,yOff);

  //>>> Top Border Row >>>
  yOff+=fontSize;
  s = "";
  s+="  +";
  for(let i=0; i<colSeq.length*2+3; i++){s += "-";}
  text(s,xOff,yOff);

  //>>> Zeroth Row >>>
  yOff += fontSize;  
  s = "";  
  s += "  | ";
  for(let i=0; i<colSeq.length+1; i++){
    s += matrixDP[0][i];
    if(i < colSeq.length){s += " ";}
  }
  text(s,xOff,yOff);

  //>>> All Other Rows >>>
  yOff+=fontSize;  
  for(let row=1; row<=rowSeq.length; row++){
    s = "";    
    s += rowSeq.charAt(row-1) + " | ";
    for(let col=0; col<colSeq.length+1; col++){
      s += (matrixDP[row][col] > 9) ? (""+matrixDP[row][col])[1] : matrixDP[row][col];
      if(col < colSeq.length){s += " ";}
    }
    text(s,xOff,yOff);
    yOff+=fontSize;
  }

  //>>> One Last '|' >>>
  text('  |',xOff,yOff);
} // Ends Function displayLCSMatrix


function displayLCSString(){
  text("LCS = \"" + strLCS + "\"", 8, height-fontSize);
} // Ends Function displayLCSString