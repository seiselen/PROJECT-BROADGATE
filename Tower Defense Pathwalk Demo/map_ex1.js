/*======================================================================
| Project:  Simple Tower Defense Map and Pathwalk Demo 01
| Author:   Steven Eiselen, CFHS/UArizona Computer Science
| Language: Javascript with P5JS Library
+-----------------------------------------------------------------------
| Description: (QAD) Implements a JavaScript array representation of a
|              "map file" and structure/formatting thereof. Used as an
|              alternative to a text file (which I would otherwise use 
|              t'were this a Java/Unity Project) as I recall Browsers 
|              don't like to play with .txt's in terms of read/write if
|              the source is run local without emulating a localhost; as
|              seen with similar issues in loading images, JSON, etc.\
|
| Recap Note:  As mentioned in class, JavaScript 'ignores' the comments
|              and newlines between the elements of this array. Thus as
|              shown below: we can use comments to explain each of its 
|              contents, define 'valid' values and data representations,
|              and other notes without 'breaking anything' by doing so.
*=====================================================================*/
var MAP_EX1 = [
  // [#rows, #cols] in this map
  [12,16],

  // Map Layout (cell types) s.t.:
  //   '#' -> border
  //   'X' -> map decor
  //   '-' -> buildable
  //   '@' -> enemy path
  "################",
  "#---------XXXXX#",
  "@@@@X-------XXX#",
  "#--@XX-------XX#",
  "#--@@@--@@@@--X#",
  "#----@--@XX@--X#",
  "#X---@--@--@---#",
  "#X---@XX@--@@@-#",
  "#XX--@@@@--XX@-#",
  "#XXX--------X@@@",
  "#XXXXX---------#",
  "################",

  // 'forward' path of enemies [NOT CHECKED!]
  [ [2,0],[2,1],[2,2],[2,3],[3,3],[4,3],[4,4],[4,5],
    [5,5],[6,5],[7,5],[8,5],[8,6],[8,7],[8,8],[7,8],
    [6,8],[5,8],[4,8],[4,9],[4,10],[4,11],[5,11],[6,11],
    [7,11],[7,12],[7,13],[8,13],[9,13],[9,14],[9,15]
  ]

];