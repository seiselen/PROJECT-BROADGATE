/*----------------------------------------------------------------------
|>>> Function importDECFrameList 
+-----------------------------------------------------------------------
| Description: Inputs string array of sprites in 'Quasi-DECORATE' format
|              (whose image file[name]s are assumed to exist), outputs 
|              p5.Image array composed of the corresponding sprites. The
|              output is used as input to instantiate a SSpriteAnimClip 
|              object to render the sprite animation composed thereof;
|              as to avoid needing to use SLADE alongside [continuously]
|              launching GZDoom to design, test, and debug animations.
| In. Syntax:  The 'Quasi-DECORATE' format is defined as a string array
|              whose elements are each composed of the following syntax,
|              as to closely (i.e. quasi) match that of ZDoom's DECORATE 
|              format: {<sprite name> <frame letter> <tic duration>}.
| In. Limits:  The following are input constraints; i.e. "why you can't
|              copy-paste DECORATE code straight from SLADE, ergo stuff
|              that needs to consequently be processed manually". These
|              are mostly (if not fully) due to the bare-bones/KISS/QAD 
|              input parsing; such that I (or another Doom modder/coder
|              who stumbles upon this) could technically upgrade/expand
|              such functionality to realize fully-procedural parsing.
|               o <Action Function> and <Successor State> which proceed
|                 the aforementioned 3 elements must be REMOVED.
|               o Instructions such as <Goto> and <Loop>, state headers 
|                 i.e. 'Reload:', blank lines, comment lines, and other
|                 non-sprite animation lines must be REMOVED.
|               o Only rotations of zero (i.e. image filenames with a
|                 suffix of '0' before ".png") are currently supported.
| In. Example: Consider/Compare the following input array alongside its
|              DECORATE counterpart (s.t. '...' implies DECORATE code
|              irrelevant to the example but relevant WRT the context):
|                - - - - - - - - - - - - -+- - - - - - - - - - - - -
|                                         | Fire:
|                    importDECFrameList([ |   ...
|                      "WEAP A 1",        |   WEAP A 1
|                      "WEAP B 2",        |   WEAP B 2 <AKA> WEAP BB 1
|                      "WEAP C 1",        |   WEAP C 1
|                      "WEAP D 1"         |   WEAP D 1
|                    ]);                  |   ...
|                - - - - - - - - - - - - -+- - - - - - - - - - - - -
+-----------------------------------------------------------------------
|> Additional Input Constraints (which MAY/WILL be resolved sooner):
|   o Sequential frame letters i.e. "WEAP ABCCCDE 2" are NOT supported at
|     this time; as the parser is extremely trivial/QAD and will be for
|     the forseeable future.
|   o Offsets also aren't supported at this time; but probably will be
|     before this QAD version is done, so yolo.
+---------------------------------------------------------------------*/
function importDECFrameList(list){
  let retArr = [];
  let curEntry,curImage,curTics;
  for (let i=0; i<list.length; i++) {
    curEntry = list[i].split(" ").map(v => v.trim());
    //> AGAIN: NO DATA VALIDATION I.E. INPUT CHECKING ATM TO KISS!
    curImage = loadImage("sprites/"+curEntry[0]+curEntry[1]+'0'+".png")
    curTics  = parseInt(curEntry[2]);
    for (let tics=0; tics<curTics; tics++){retArr.push(curImage);}
  }
  return retArr;
} // Ends Function importDECFrameList 


class SpriteAnimClip{
  constructor(sprites){
    this.frames   = sprites;
    this.nFrames  = this.frames.length;
    this.curFrame = -1;
    this.bBox     = {posX:-1,posY:-1,wide:-1,tall:-1};
    this.doLoop; 
    this.setLoop();
    this.setBBox();
    this.strk_border = color(0,255,0);
    this.sWgt_border = 1;
  }

  setLoop(val=true){
    this.doLoop=val;
  } // Ends Function setLoop

  setBBox(pos=null,dim=null){
    //> Position via input (as [x,y]px) XOR canvas midpoint
    if(pos&&pos.length==2){
      this.bBox.posX=pos[0]; this.bBox.posY=pos[1];
    }
    else{
      this.bBox.posX=width/2; this.bBox.posY=height/2;
    }
    //> Dims via input (as [wide,tall]px) XOR max thereof \forall frames
    if(dim&&dim.length==2){
      this.bBox.wide=dim[0]; this.bBox.tall=dim[1];
    }
    else{ 
      this.frames.forEach((img)=>{
        this.bBox.wide=max(this.bBox.wide,img.width);
        this.bBox.tall=max(this.bBox.tall,img.height);        
      });
    }
  } // Ends Function setBBox



  advance(){
    this.curFrame = (this.curFrame+1)%this.nFrames;
  } // Ends Function advance

  render(){
    imageMode(CENTER); rectMode(CENTER); push();translate(this.bBox.posX,this.bBox.posY);
    if (!this.curFrame<0){image(this.frames[this.curFrame],0,0);}
    rect(0,0,this.bBox.wide,this.bBox.tall);
    pop();
  } // Ends Function render

} // Ends Class SpriteAnimClip