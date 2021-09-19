// Should be struct in Unity. Simple int/int row/col representation used by space partition system
class Coord{
  public int row;
  public int col;
  public Coord(int r, int c){
    row = r; col = c;
  }
  // Simple comparator used when space partition manager asks if agent now located in new cell
  public boolean Equals(Coord oth){  
    return(oth==null || row==oth.row && col==oth.col);
  }
} // Ends Class Coord
