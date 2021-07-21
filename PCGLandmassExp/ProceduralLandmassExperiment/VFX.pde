void drawCells(){
  if(showGrid){stroke(24);strokeWeight(1);}
  if(!showGrid){noStroke();}
  fill(0);
  for(int r=0;r<cellsTall;r++){
    for(int c=0;c<cellsWide;c++){
      if(map[r][c]<0.3){fill(0,0,255);}
      else if(map[r][c]<0.4){fill(0,120,255);}
      else if(map[r][c]<0.45){fill(228,216,96);}
      else if(map[r][c]<0.55){fill(0,255,0);}
      else if(map[r][c]<0.6){fill(36,84,0);}
      else if(map[r][c]<0.7){fill(108,60,0);}
      else if(map[r][c]<0.85){fill(96,96,96);}
      else if(map[r][c]<1.0){fill(240);}    
      rect(c*cellSize,r*cellSize,cellSize,cellSize);
    }
  }
} // Ends Function drawCells