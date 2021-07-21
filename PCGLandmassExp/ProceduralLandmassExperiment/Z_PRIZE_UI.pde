/*======================================================================
|>>> PROCESSING TAB : UI System
+-----------------------------------------------------------------------
| Contents:
|  - Interface UIConstants
|  - Class UIColorScheme
|  - Class UIManager
|  - Class ActionManager 
|  - Class UIObject (and subtypes)
|  - Class MethodRelay
+=====================================================================*/
import java.lang.reflect.*;

class UIManager{
  
  // VFX
  PFont font;
  int defaultTextSize = 18;
  
  // Constants that define UI Events
  int lMouseClick   = 1;
  int lMouseRelease = 2;
  int rMouseClick   = 3;
  int rMouseRelease = 4;
  int mouseHover    = 5;
  int frameUpdate   = 6; // As I recall, was used for BuildButton
  
  // Structs for UIAction and binding definitions
  HashMap<String, MethodRelay> actions = new HashMap();
  HashMap<String, UIObject> listeners = new HashMap();
  String[] keyBindings = new String[256];
  
  // Root struct for all UIContainers and UIObjects
  ArrayList<UIObject> allObjects = new ArrayList<UIObject>();
  ArrayList<UIContainer> containers = new ArrayList<UIContainer>();
  
  public UIManager(){
    font = createFont("Consolas Bold",32);
    textFont(font,defaultTextSize);
    for(int i=0; i<keyBindings.length; i++){keyBindings[i]=null;}
  } // Ends Constructor
  
  void render(){
    textAlign(CENTER,CENTER);      
    for(UIContainer c : containers){
      c.render();
    } 
  } // Ends Function render    
  
  /*====================================================================================
  >>> Listening for and Responding to UI Events
  ====================================================================================*/
  
  void update(){
    for(UIContainer c : containers){
      if(mouseOverMe(c.xLoc,c.yLoc,c.wide,c.tall)){
        c.update(mouseHover);
      } 
    }  
  } // Ends Function update

  void mousePress(int button){
    for(UIContainer c : containers){     
      if(mouseOverMe(c.xLoc,c.yLoc,c.wide,c.tall)){
        switch(button){
          case LEFT : c.update(lMouseClick); break;  
          case RIGHT: c.update(rMouseClick); break;
          default :  break;
        }   
      }
    }
  } // Ends Function mousePress
  
  void mouseRelease(int button){
    for(UIContainer c : containers){      
      if(mouseOverMe(c.xLoc,c.yLoc,c.wide,c.tall)){
        switch(button){
          case LEFT : c.update(lMouseRelease); break;  
          case RIGHT: c.update(rMouseRelease); break;
          default :  break;
        }   
      }
    }
  } // Ends Function mouseRelease
  
  /*====================================================================================
  >>> Getting Mouse Coordinates and Checking Cell Bounds
  ====================================================================================*/  
    
  PVector getMouseCell(int cellSize){
    return new PVector( int((mouseY)/cellSize), int((mouseX)/cellSize) );
  } // Ends Function getMouseCell
  
  boolean mouseOverMe(float x, float y, float w, float t){
    if(mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+t){return true;}
    return false;
  } // Ends Function mouseOverMe
  
  boolean checkInBounds(int r, int c, int cellsWide, int cellsTall){
    return (r>=0 && r<cellsTall && c>=0 && c<cellsWide);
  } // Ends Function checkInBounds
  
  /*====================================================================================
  >>> Adding and Binding Components
  ====================================================================================*/
    
  void newContainer(int x, int y, int w, int t, String n){
    UIContainer c = new UIContainer(x,y,w,t,n,this, 'v');
    allObjects.add(c);
    containers.add(c);
  }
  
  UIContainer getContainer(String name){
    for(UIContainer c : containers){if(c.name.equals(name)){return c;}}
    return null;
  }
  
  void addClickButton(int xRel, int yRel, int wide, int tall, String container, String name){
    UIContainer c = getContainer(container);
    if(c==null){println("UIManager/addClickButton : Container with name \"" + container + "\" not found");return;}
    ClickButton temp = new ClickButton(xRel,yRel,wide,tall,name,this);
    allObjects.add(temp);
    c.addItem(temp);
  }
  
  void addClickButton(int xRel, int yRel, int wide, int tall, String container, String name, String action){
    addClickButton(xRel,yRel,wide,tall,container,name);
    bindUIObjectWithAction(name, action);
  }  
  
  
  void bindKeyWithAction(char k, String actionID){
    if(k>255||k<0){println("UIManager/bindKeyWithAction : Invalid Input '"+k+"'"); return;}
    MethodRelay act = actions.get(actionID);
    if(act==null){println("Action '" + actionID + "' does not exist.");return;}  
    keyBindings[k] = actionID;
  }
  
  void bindUIObjectWithAction(String objID, String actionID){
    for(UIObject o : allObjects){
      if(o.name.equals(objID)){
        MethodRelay act = actions.get(actionID);
        if(act==null){println("Action '" + actionID + "' does not exist.");return;}
        o.action = actionID;
      }
    }
  }
  // UIManager.bindButton("name", "action", ['listenType'])
  

  
  // More Express way to register both an action and the key it's bound to. 
  // Should add support for UIObjects as well  
  void registerKeyAndNewAction(char k, Object obj, String name, Class... args){
    registerNewAction(obj, name, args);
    //registerKeyWithAction(k, name);
  } // Ends registerKeyAndNewAction
  

  
  void keyboardEvent(char k){
    if(keyBindings[k]==null){println("ActionManager/notifyViaKeyboard : Key '"+k+"' does not map to an action!"); return;}
    actions.get(keyBindings[k]).execute(); 
  } // Ends Function notifyViaKeyboard

  void registerListenerWithAction(String name, UIObject o){
    listeners.put(name, o);
  } // Ends Function registerListenerWithAction
  
  void updateListenerWithBoolean(String name, boolean val){
    ((ToggleButton)listeners.get(name)).setToggle(val);
  } // Ends Function updateListenerWithBoolean
  
  void updateListenerWithString(String action, String val){
    listeners.get(action).setText(val);
  } // Ends Function updateListenerWithString
    
  public void registerNewAction(Object obj, String name, Class... args){ 
    MethodRelay newAction = new MethodRelay(obj,name,args);
    actions.put(name, newAction);
  } // Ends Function registerNewAction
  
  void notifyAction(String action, char command){
    MethodRelay act = actions.get(action);
    if(act==null){println("Action '" + action + "' does not exist.");return;}
    if(command=='_'){actions.get(action).execute();}
    else{actions.get(action).execute(command);}
  } // Ends Function notifyViaStringKey
  
  
  
  
  
  
  /*----------------------------------------------------------------------
|>>> Class UIColorScheme
+---------------------------------------------------------------------*/
class UIColorScheme{
  color backgroundColor; // Color when not clicked or toggled
  color foregroundColor; // Transparent Color when clicked or toggled
  color borderColor;     // Color for border of parent object
  color textColor;       // Color of text label
  int   textSize;        // text size
  
  public UIColorScheme(){
    this.backgroundColor = color(0,120,255);
    this.foregroundColor = color(255,255,255,50); 
    this.borderColor     = color(0,255,0);
    this.textColor       = color(255,255,255);
    this.textSize        = defaultTextSize;
  }
  
  void prebakedHeaderLabel(){
    backgroundColor = color(255,120,0);
    borderColor     = color(255,255,255,0);   
  }  
  
  void prebakedStaticLabel(){
    backgroundColor = color(255,255,255,0);
    borderColor     = color(255,255,255,0);   
  }
  
  void prebakedDynamicLabel(){
    backgroundColor = color(255,120,0);
    borderColor     = color(255,255,255,0);  
  } 
  
} // Ends Class UIColorScheme
  
  
  /*----------------------------------------------------------------------
|>>> Class UIObject
+---------------------------------------------------------------------*/
class UIObject{
  UIManager parent;
  int xLoc, yLoc, xLocMid, yLocMid, wide, tall;
  UIColorScheme col;
  String name,text;
  boolean activated     = false;
  boolean mouseOver     = false;  
  
  // For Executing Actions via ActionManager
  String action = "none";
  char  command = '_';
  
  public UIObject(int x, int y, int w, int t, String n, UIManager u){
    this.xLoc = x; this.yLoc = y; this.wide = w; this.tall = t;
    this.name = n; this.text = n;
    this.xLocMid = xLoc+(wide/2);
    this.yLocMid = yLoc+(tall/2);
    this.parent = u;
    this.col    = new UIColorScheme();
  } // Ends Constructor
  public void bindAction(String act){
    this.action = act;
  } // Ends Function bindAction  
  public void bindAction(String act, char cmnd){
    this.action = act;
    this.command = cmnd;
  } // Ends Function bindAction
  public void setText(String s){
    text=s;
  } // Ends Function setText
  public void resetMidPoints(){
    this.xLocMid = xLoc+(wide/2);
    this.yLocMid = yLoc+(tall/2);
  }
  public void update(int event){
  } // Ends Function update
  public void render(){
    strokeWeight(1);stroke(col.borderColor);fill(col.backgroundColor);rect(xLoc,yLoc,wide,tall);
    fill(col.textColor);textSize(col.textSize);text(text,xLocMid, yLocMid);
  } // Ends Function render
} // Ends Parent Class UIObject


/*----------------------------------------------------------------------
|>>> Class ClickButton
+---------------------------------------------------------------------*/
class ClickButton extends UIObject{
  public ClickButton(int x, int y, int w, int t, String n, UIManager u){
    super(x,y,w,t,n,u); 
  } // Ends Constructor
  public void update(int event){
    if(event == lMouseClick){activated=true; parent.notifyAction(action, command);}
    else if(event == lMouseRelease){activated=false;}
  } // Ends Function update
  public void render(){
    super.render();
    if(activated && parent.mouseOverMe(xLoc,yLoc,wide,tall)){fill(col.foregroundColor);rect(xLoc,yLoc,wide,tall);}
    else{activated=false;}
  } // Ends Function render
} // Ends Class ClickButton


/*----------------------------------------------------------------------
|>>> Class ToggleButton
+---------------------------------------------------------------------*/
class ToggleButton extends UIObject{
  public ToggleButton(int x, int y, int w, int t, String n, UIManager u){
    super(x,y,w,t,n,u); 
  } // Ends Constructor
  public void update(int event){
    if(event == lMouseClick){parent.notifyAction(action, command);}
  } // Ends Function update
  public void setToggle(boolean b){this.activated = b;}
  public void render(){
    super.render();
    if(activated){fill(col.foregroundColor);rect(xLoc,yLoc,wide,tall);}
  } // Ends Function render
} // Ends Class ToggleButton


/*----------------------------------------------------------------------
|>>> Class UILabel
+---------------------------------------------------------------------*/
class UILabel extends UIObject{
  public UILabel(int x, int y, int w, int t, String n, UIManager u){
    super(x,y,w,t,n,u); 
  } // Ends Constructor
  public void update(){
  } // Ends Function update
  public void render(){
    super.render();
  } // Ends Function render
} // Ends Class UILabel


/*----------------------------------------------------------------------
|>>> Class UImage
+---------------------------------------------------------------------*/
class UImage extends UIObject{
  PImage img;
  public UImage(int x, int y, int w, int t, String n, UIManager u, PImage i){
    super(x,y,w,t,n,u);
    this.img = i;
  } // Ends Constructor
  public void update(){
  } // Ends Function update
  public void render(){
    image(img,xLoc,yLoc,wide,tall);
  } // Ends Function Render
} // Ends Class UImage


/*----------------------------------------------------------------------
|>>> Class UImage
+---------------------------------------------------------------------*/
class UIContainer extends UIObject{
  ArrayList<UIObject> contents = new ArrayList<UIObject>();
  char orientation;
  int curDim;
  boolean hidden = false;
  boolean debugShowBBox = true;
  
  public UIContainer(int x, int y, int w, int t, String n, UIManager u, char orient){
    super(x,y,w,t,n,u);
    if(orient!='h' && orient!='v'){println("Invalid orientation input! Setting to horizontal."); this.orientation='h';}
    else this.orientation=orient;
  } // Ends Constructor
  
  // FOR THIS VERSION - I WILL DO MANUAL POSITION PLACEMENT TO SUPPORT MULTIPLE TAB OPTIONS
  // IOW - I will give responsibility to the loader and myself to place them...
  public void addItem(UIObject o){
    o.xLoc+=this.xLoc;
    o.yLoc+=this.yLoc;
    o.resetMidPoints();
    contents.add(o);
  } // Ends Function addItem
  
  public void hideOrUnhide(){
    hidden=!hidden;
  }

  public void update(int action){
    if(hidden){return;}
    for(UIObject o : contents){
      if(parent.mouseOverMe(o.xLoc, o.yLoc, o.wide, o.tall)){o.update(action);}
    }
  } // Ends Function update
  
  public void render(){
    if(debugShowBBox){noFill();stroke(255,120,0);rect(xLoc,yLoc,wide,tall);}
    if(hidden){return;}
    for(UIObject o : contents){ o.render();}
  } // Ends Function Render
} // Ends Class UIContainer


/*----------------------------------------------------------------------
|>>> Class MethodRelay
+---------------------------------------------------------------------*/
public class MethodRelay{
  private Object handlerObject = null; // Gets the PApplet Class ID
  private Method handlerMethod = null; // Is the method via the string
  public String handlerMethodName;
  private Class[] parameters = null;

  MethodRelay(Object obj, String name){this(obj, name, (Class[])null);}
  MethodRelay(Object obj, String name, Class... args) {
    try {
      handlerMethodName = name;
      parameters = args;
      handlerMethod = obj.getClass().getMethod(handlerMethodName, parameters);
      handlerObject = obj;
    } 
    catch (Exception e) {
      println("Unable to find the function -");print(handlerMethodName + "( ");
      if(parameters != null) {for (Class c : parameters)print(c.getSimpleName() + " ");println(")");}
    }
  } // Ends Constructor
  void execute() {execute((Object[])null);}
  void execute(Object... data) {
    if (handlerObject != null) {
      try {handlerMethod.invoke(handlerObject, data);} 
      catch (Exception e) {println("Error on invoke" + e.toString());}
    }
  } // Ends Function Execute
} // Ends Class MethodRelay
  

} // Ends Class UIManager