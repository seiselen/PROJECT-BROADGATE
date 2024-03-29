/*======================================================================
|>>> GENERAL/STANDARD UTIL CODE (VIA BROADGATE II/III PROJECTS)
+-----------------------------------------------------------------------
| Description: Common util functions (and their state) that are commonly
|              used among a number of the Broadgate II and III projects.
|              Intended to either standalone support a project, and/or
|              serve as a starting point until more customized/modular
|              analogous features are implemented. Likewise intended to
|              serve ALL all BG-III, ZAC, StAgE, and Fea [sub]projects.
| History:     Some of these functions were (are?) installed within the
|              'main.js' file of the BG-II project template code. While 
|              they remained there for smaller BG-II projects; they were
|              moved into their own 'util.js' files for larger projects.      
| Goal/Vision: This code is the next step in this process to gather all
|              common util code into a single library that can serve as
|              many projects as possible (including compatability with
|              older projects); while the code therein remains as lean, 
|              simple, general, and easy-to-use as possible (for both
|              older AND new[er] projects).
|
|              Furthermore, as this file will now act as a library: the
|              goal is for it to [fundamentally] exist as 'singleton' as
|              possible; such that [new] projects should NO LONGER get a
|              copy of it; but instead link to it. The purpose of this 
|              protocol is to establish this file as the 'official' one
|              of its kind (if not the only one in existence): such that
|              additions, upgrades, repairs, and other modification can 
|              be made to this one file as to instantly effect (ideally
|              beneficially) all projects which link thereto.
+-----------------------------------------------------------------------
|# PENDING DEPRECATION NOTICE
|  > A/O December 2022, there is intent ergo plans to convert this code
|    into an ES6 JS Module ᴀᴋᴀ 'Michael Jackson Script' file; alongside
|    relocating it to a different repo (a/o 12/23/2022 - that of my GH
|    homepage). Though I plan to keep this version thereafter (indeed I
|    MUST for all BROADGATE projects using it, and which are not [yet?]
|    implemented as JS Module apps themselves): additions/maintenance
|    will likely be done in the new MJS version and that version alone.
+=====================================================================*/


//######################################################################
//###[ Canvas 'Gizmo' Utils ]###########################################
//######################################################################


/*----------------------------------------------------------------------
|>>> Function drawFPS
+---------------------------------------------------------------------*/
function drawFPS(){
  // Draw Semi-Transparent Background Rect
  noStroke(); fill(0,128); rectMode(CORNER); rect(0,height-32,80,32);
  // Draw Text displaying the current FPS (rounded down to nearest int)
  textSize(18); textAlign(LEFT,CENTER); strokeWeight(2); stroke(0); fill(255); text("FPS: "+round(frameRate()), 8, height-14);
} // Ends Function drawFPS

/*----------------------------------------------------------------------
|>>> Function drawCanvasBorder
+---------------------------------------------------------------------*/
function drawCanvasBorder(){
  noFill(); stroke(60); strokeWeight(4); 
  rectMode(CORNER); rect(0,0,width,height);
} // Ends Function drawCanvasBorder


/*----------------------------------------------------------------------
|>>> Function drawCanvasCrosshair
+---------------------------------------------------------------------*/
function drawCanvasCrosshair(lineColor="#FF3C0040",lineThick=4){
  stroke(lineColor); strokeWeight(lineThick); 
  line(0,height/2,width,height/2); // Horizontal Line
  line(width/2,0,width/2,height);  // Vertical Line
} // Ends Function drawCanvasCrosshair


/*----------------------------------------------------------------------
|>>> Function drawGrid
+-----------------------------------------------------------------------
|> TODO Note: Too ambitious with the parms? Should scale back?
+---------------------------------------------------------------------*/
function drawGrid(spacing=10,lineColor="#ffffff",lineThick=2){
  let nH = int(height/spacing);
  let nV = int(width/spacing);
  stroke(lineColor); strokeWeight(lineThick);
  for(let i=0; i<nH; i++){line(0,spacing*i,width,spacing*i);}
  for(let i=0; i<nV; i++){line(spacing*i,0,spacing*i,height);}
} // Ends Function drawGrid


/*----------------------------------------------------------------------
|>>> Function drawStripedRect
+-----------------------------------------------------------------------
| Description: Draws series of diagonal lines over some rect-sized area,
|              producing an effect similar to that of a 'hazard stripe'.
| Input Parms: > xPos | yPos | wide | tall => self-explanatory!
|              > sNum => number of stripes that the rect is partitioned
|                        into, s.t. the number of lines drawn (sans the 
|                        border rect) is [sNum-1] via duality. IOW: if 
|                        the caller passes [8] as input to sNum: 7 lines
|                        will partition the area into 8 regions split
|                        into stripes of even [equal] diagonal length.
|              > diag => direction of lines, s.t. 'u' -> upwards slope
|                        and 'd' -> downwards slope.
|              > sWgt => stroke weight [of lines], 'Nuff Said
|              > sCol => stroke color of lines, 'Nuff Said
| Input Note:  I'm NOT going to spend [any more] time realizing argument
|              variability handling; i.e. caller has FULL responsibility
|              to enter <undefined> for parm inputs they wish to 'skip'
|              input for (of which only the last 3 have default values).
|              IOW: There's only so much OCD to satisfy with a language
|              that lacks explicit (and 'vanilla') function overloading!
+-----------------------------------------------------------------------
| Implementation Notes >>>
+---------------------------------------------------------------------*/
function drawStripedRect(xPos, yPos, wide, tall, sNum=8, sCol="#FFFFFFFF", sWgt=2, diag='u'){
  let lNum = sNum/2; let dW = wide/lNum; let dT = tall/lNum;
  strokeWeight(sWgt); noFill(); stroke(sCol);
  push(); translate(xPos,yPos);
    rect(0,0,wide,tall);
    switch(diag){
      case 'u': for(let i=1; i<lNum; i++){line(0,i*dW,i*dT,0);line(wide-(i*dW),tall,wide,tall-(i*dT));} if(sNum%2==0){line(0,tall,wide,0);} break;
      case 'd': for(let i=1; i<lNum; i++){line(0,tall-(i*dT),i*dW,tall);line(wide-(i*dW),0,wide,i*dT);} if(sNum%2==0){line(0,0,wide,tall);} break;
    }
  pop();
} // Ends Function drawStripedRect


/*----------------------------------------------------------------------
|>>> Function drawArrowhead
+-----------------------------------------------------------------------
| Description: Draws an arrowhead (i.e. triangle) shape centered at the
|              specified position, of the specified length and width 1/2
|              thereof, and rotated at the specified orientation vector
| Input Parms: > x/y: (x,y) coordinate of location i.e. origin of arrow
|              > len:  length (in canvas/pixel units) of the arrow
|              > ori:  p5.Vector of orientation i.e. direction of arrow
|              > colr: p5.Color of arrow to pass into p5 <fill(...)>
+---------------------------------------------------------------------*/
function drawArrowhead(x,y,len,ori,colr){
  let len2 = len/2;
  noStroke();fill(colr);
  push();translate(x,y);rotate(ori.heading());translate(len/6,0);
    beginShape();vertex(len2,0);vertex(-len2,-len2);vertex(-len2,len2);endShape(CLOSE);
  pop();
} // Ends Function drawArrowhead


//######################################################################
//###[ Mouse+Canvas Related Utils ]#####################################
//######################################################################


/*----------------------------------------------------------------------
|>>> Function mouseInCanvas
+---------------------------------------------------------------------*/
function mouseInCanvas(){
  return (mouseX>0)&&(mouseY>0)&&(mouseX<width)&&(mouseY<height);
} // Ends Function mouseInCanvas

/*----------------------------------------------------------------------
|>>> Function mousePtToVec
+---------------------------------------------------------------------*/
function mousePtToVec(){
  return createVector(mouseX, mouseY);
} // Ends Function mousePtToVec


//######################################################################
//###[ Vector Creation Utils ]##########################################
//######################################################################


/*----------------------------------------------------------------------
|>>> Functions vec2, vec3
+-----------------------------------------------------------------------
| Description: Shorthand (syntactic sugar) for the creation of 2D and 3D
|              p5.Vector objects. Historically used to reduce the length
|              of chars needed to create vectors within a constructor or
|              otherwise function call. For Example...
|     
|              > Via this (pseudocode) description of a circle object:
|                  class Circle(position[x,y], inRadius, outRadius)
|              > This initialization:
|                  let aCirc = new Circle(vec2(12,25), 32, 128);
|              > Beats this one:
|                  let aCirc = new Circle(createVector(12,25), 32, 128);
|
|              Also as with syntactic sugar: it might be 'frivolous' and
|              in fact has not had MUCH use with BG-II projects; as I've
|              gone without for the smaller ones while the larger ones
|              [eventually] realize their own means for getting/passing
|              p5.Vectors into constructors and functions. However, the
|              purpose of this standard utils library is to offer such
|              'early-level' support for any project when needed.
+-----------------------------------------------------------------------
| Implementation Notes >>>
| 
| # On Default Parmeter Values: 
|   > All parms of both functions have default values of zero [0]; such
|     that if no input is provided thereto (i.e. "let myVec = vec2()"):
|     a p5.Vector of coordinates {x:0, y:0, z:0} will be returned. 
|   > This follows both the P5JS convention of a parameterless call to
|     'createVector' returning the same coordinates; and the analogous
|     convention for parameterless Vector2 and Vector3 calls in Unity3D.
| # On 'vec2' p5.Vector 3rd Coord:
|   > The p5.Vector class supports 3D vectors; thus all instances have
|     values for 3 spatial coordinates {x,y,z}. Consequently: calls to
|     'vec2' will return p5.Vector instances whose 'z' coordinate has a
|     default value of zero [0]. This typically has no side effects for
|     using them in a strictly 2D context, as the 'z' coordinate value 
|     can simply be ignored (or even used for other purposes, as I've
|     done {with either a BG-II project and/or TD-P5JS, I forget ATM}).
+---------------------------------------------------------------------*/
function vec2(x=0,y=0)    {return createVector(x,y);}
function vec3(x=0,y=0,z=0){return createVector(x,y,z);}

/*----------------------------------------------------------------------
|>>> Function distSq
+-----------------------------------------------------------------------
| Implementation Note: LOOK...Quasi-Overriding CAN be better realized!
+---------------------------------------------------------------------*/
function distSq(p1,p2,q1,q2){
  if(arguments.length==2){return distSq(p1.x, p1.y, p2.x, p2.y);}
  else{let dx=q1-p1; let dy=q2-p2; return (dx*dx)+(dy*dy);}
} // Ends Function distSq

/*----------------------------------------------------------------------
|>>> Function randPtOnCanvas
+---------------------------------------------------------------------*/
function randPtOnCanvas(){
  return createVector(int(random(width)),int(random(height)));
} // Ends Function randPtOnCanvas

/*----------------------------------------------------------------------
|>>> Function canvasMidpoint
+---------------------------------------------------------------------*/
function canvasMidpoint(){
  return createVector(width/2,height/2);
} // Ends Function canvasMidpoint


//######################################################################
//###[ Array-Related Utils ]############################################
//######################################################################


/*----------------------------------------------------------------------
|>>> Function arr2Equals
+-----------------------------------------------------------------------
|> Overview: Evaluates first two elements of the input arrays, returning
|            true if their values match (via JavaScript 'loose' equality 
|            <vs> 'strict' i.e. '==' <vs> '==='). As a neat side-effect
|            of not asserting both arrays contain exactly two elements:
|            either could contain more; such that this will STILL return
|            true as long as their first two elements' values match. For
|            example, at the time this was typed: my pathfinding utility
|            for 2D tilemap grid worlds utilizes this function whenever
|            comparing an Array[2] of [row, column] coords to a map cell
|            with an Array[5] of [row, column, cost, heuristic, parent]
|            encompassing a 'search node' i.e. the pathfinding state of
|            a map cell; which this method handles nicely! However: NOTE
|            that it does NOT handle invalid input at the present time 
|            (i.e. Array[1], null, etc.); so 'caller beware' thereto.
+---------------------------------------------------------------------*/
function arr2Equals(v1,v2){
  return(v1[0] == v2[0] && v1[1] == v2[1]);
} // Ends Function arr2Equals

/*----------------------------------------------------------------------
|>>> Function arrayValsEqual
+-----------------------------------------------------------------------
|> Overview: Determines if the input arrays are equal, defined by values
|            of their elements being equal. Thus: returns false if their
|            lengths differ xor on first mismatch occurence; else true.
+---------------------------------------------------------------------*/
function arrayValsEqual(arr1, arr2){
  if(arr1.length != arr2.length){return false;}
  for (let i=0; i<arr1.length; i++){if (arr1[i] != arr2[i]){return false;}}
  return true; 
} // Ends Function arrayValsEqual


//######################################################################
//###[ MISC. FUNCTIONS (I.E. [CURRENTLY] UNGROUPED ]####################
//######################################################################


/*======================================================================
|>>> Function Mini-Group Involving Color Vals
+-----------------------------------------------------------------------
|# Implementation Notes:
|  > On 11/24/2022, six methods were added to this group; encompassing 
|    {hex6⭤ int[3]⭤ p5.color} conversion methods that are more 'easy
|    access' for quick {p→q} conversion (i.e. in a separate project that
|    does NOT use p5js nor p5.colors) therebetween.
+======================================================================*/
function colorRGBAToHex(colVal){
  return hex(colVal.levels,2).join('');
} // Ends Function colorRGBAToHex

function colorHexToRGBA(colVal){
  if(colVal[0]=='#'){colVal = colVal.substring(1);}
  return unhex(colVal.match(/.{1,2}/g));
} // Ends Function colorHexToRGBA

function hex6_to_int3(h6){
  return ((h6[0]=='#')?h6.slice(1):h6).match(/(..)/g).map(h=>{return unhex(h)});
}

function int3_to_hex6(i3){
  return `#${i3.map(i=>{return hex(i,2);}).join('')}`;
}

function hex6_to_color(h6){
  return color(hex6_to_int3(h6));
}

function color_to_hex6(col){
  return int3_to_hex6(color_to_int3(col));
}

function color_to_int3(col){
  return col.levels.slice(0,-1);
}

function int3_to_color(i3){
  return color(...i3);
}

/*----------------------------------------------------------------------
|>>> Function bucket
+-----------------------------------------------------------------------
|> Overview: Maps float of range (0.0…1.0] to int of range [1,…,nParts].
+---------------------------------------------------------------------*/
function bucket(val,nParts){
  return ceil(val*nParts);
} // Ends Function bucket



/*----------------------------------------------------------------------
|>>> Function distManh (Manhattan Distance)
+-----------------------------------------------------------------------
|> Overview: Returns Manhattan Distance between two sets of coordinates.
+---------------------------------------------------------------------*/
function distManh(x1, y1, x2, y2){
  return abs(x1 - x2) + abs(y1 - y2)
} // Ends Function distManh

// Wrapper Method using the full word 'Manhattan' as a JIC
function distManhattan(x1, y1, x2, y2){
  return distManh(x1, y1, x2, y2);
} // Ends Function distManhattan

/*----------------------------------------------------------------------
|>>> Function distMaxDimVal (Max Coord-To-Coord Val)
+-----------------------------------------------------------------------
|> Overview: Returns the L-∞ (L-Infinity) Norm Distance, 'Nuff Said
+---------------------------------------------------------------------*/
function distMaxDimVal(x1, y1, x2, y2){
  return max(abs(x1-x2),abs(y1-y2));
} // Ends Function distManhattan


/*----------------------------------------------------------------------
|>>> Function Group: 'Vector Dist'      (Distance Between 2D p5.Vectors)
+-----------------------------------------------------------------------
| Overview: Implements various distance metrics between 2D p5.Vectors.
+-----------------------------------------------------------------------
|# Implementation Note:
|  > The following are mappings between some of the functions and their
|    corresponding geometric shapes and 'L[ ] Norm' analogs/AKAs/etc.:
|    ⬥ vectorEuclideanDist → Circle  → L2 Norm
|    ⬥ vectorManhattanDist → Diamond → L1 Norm
|    ⬥ vectorMaxDimValDist → Square  → L∞ Norm
+---------------------------------------------------------------------*/
function vectorEuclideanDist(p,q){return p5.Vector.dist(p,q);}
function vectorManhattanDist(p,q){return distManh(p.x,p.y,q.x,q.y);}
function vectorMaxDimValDist(p,q){return distMaxDimVal(p.x,p.y,q.x,q.y);}




/*----------------------------------------------------------------------
|>>> Function charLengthOf            (Character Length Of <Some Thing>)
+-----------------------------------------------------------------------
| Overview: Outputs value corresponding to character length of whatever 
|           is input; plus additional spaces WRT input-specified margin
|           (A/A); based on the currently supported (i.e. implemented)
|           means/semantics of doing so. If a value for 'margin' is NOT
|           specified, its default value is zero, i.e. no contribution.
|           These semantics are conveniently enumerated/described below
|           (which Steve BETTER MAINTAIN whenever anything is modified,
|           added, etc. as to correctly reflect accordingly...duh!)
| In Parms: - thing:  The thing you want the length of, 'Nuff Said!
|           - margin: A number, else it's set to [0] (zero), which also
|                     means that it does NOT accept numbers in the form
|                     of an unparsed string (e.g. '8'). If a float (e.g.
|                     [3.14]), <Math.floor()> will be called upon it for
|                     obvious reasons. On the plus side... a caller can
|                     enter negative values for oppposite effect!
+-----------------------------------------------------------------------
|# CURRENT OUTPUT SEMANTICS ᴀᴋᴀ RULES (i.e. what this does WRT input)
|  • undefined: (margin), and that's it!
|  • ---- null: (margin), and that's also it!
|  • - boolean: (margin) plus length of chars of corresponging. string;
|               i.e. [true]→['true']→[4] and [false]→['false']→[5].
|  • -- string: (margin) plus the number of chars in the string, sans of
|               course the null terminator because JS don't have 'em!
|  • -- number: (margin) plus the number of integer digits WRT the floor
|               of the input value; e.g. [99.999]→[2].
|  • --- array: (margin) plus length of the string produced by callling
|               <join(', ')> thereupon; and I ain't responsible for the
|               [COUNTLESS] degenerate xor even syntax error producing
|               ways this can go wrong: so caller beware!
+---------------------------------------------------------------------*/
function charLengthOf(thing,margin=0){
  switch(typeof(margin)==='number'){case true: margin=Math.floor(margin); break; case false: margin=0; break;}
  if(typeof(margin)!=='number'){margin=0;} 
  if(thing===undefined||thing===null){return margin;}
  return margin + ((thing===null||thing===undefined) ? 0 :
    (typeof(thing)==='boolean') ? thing.toString() :    
    (typeof(thing)==='string')  ? thing.length :
    (typeof(thing)==='number')  ? Math.ceil(Math.log10(Math.floor(thing+1))) :
    (Array.isArray(thing))      ? thing.join(', ').length : 
    thing.toString().length
  );
} // Ends Function charLengthOf