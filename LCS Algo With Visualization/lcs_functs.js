function resetMatrixDP(){
  matrixDP = [];
  for(let row = 0; row <= rowSeq.length; row++){
    let colVals = [];
    for(let col = 0; col <= colSeq.length; col++){
      colVals.push(0);
    }
    matrixDP.push(colVals);
  }
} // Ends Function resetMatrixDP


function computeLCSMatrix(){
  for(let row = 0; row < rowSeq.length; row++){
    for(let col = 0; col < colSeq.length; col++){
      if(rowSeq.charAt(row) == colSeq.charAt(col)){ 
        matrixDP[row+1][col+1] = matrixDP[row][col]+1; 
      }
      else {
        matrixDP[row+1][col+1] = max(matrixDP[row][col+1], matrixDP[row+1][col]);
      }      
    }  
  }  
} // Ends Function computeLCSMatrix


function computeLCSString(){
  let i = rowSeq.length;
  let j = colSeq.length;
  let k = matrixDP[i][j];

  let strBuff = "";

  while(k>0){
    if(matrixDP[i][j] > matrixDP [i-1][j] && matrixDP[i][j] > matrixDP[i][j-1]){
      strBuff = rowSeq.charAt(i-1) + strBuff;
      i--; j--; k--;
    }    
    else if(matrixDP[i][j] == matrixDP[i][j-1]){ j--;}
    else{i--;}
  }
  strLCS = strBuff; 
} // Ends Function computeLCSString