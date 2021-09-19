class FPSUtil{
  private float cFrameMillis;
  private float lFrameMillis;
  private float deltaT;
  private float fps;
  private String lastFPS; // used for delta-frame
  
  void UpdateFPS(){
    cFrameMillis = millis();
    deltaT       = cFrameMillis-lFrameMillis;
    fps          = 1000.0/deltaT;
    lFrameMillis = cFrameMillis;
  }
  
  public float GetFPS(){
    return fps;
  }
  
  public String UpdateAndGetFPS(int deltaFrame){
    if(frameCount%deltaFrame==0){lastFPS = nf(fps,2,2);}
    UpdateFPS();
    return lastFPS;
  }
  
  public void UpdateAndPrintFPS(){
    UpdateFPS();
    println("FPS = " + fps);
  }
} // Ends class FPSUtil
