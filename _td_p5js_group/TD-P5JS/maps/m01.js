/*======================================================================
|>>> Map Info Definition
+-----------------------------------------------------------------------
| Description: Defines the map, various level info thereof, etc. in the
|              form of a JavaScript array. I would typically define this
|              via a .txt file: but most (if not all) browsers refuse to
|              access them vis-a-vis to CORS policy; and I'm too lazy to
|              launch a virtual server to make them happy... especially 
|              as there's an okay [better?] workaround as shown here.
+-----------------------------------------------------------------------
| Data Schema: Per array indices, as follows:
|  > [0]      = Array2 composed of [#rows, #cols] in this map
|  > [1...12] = String sequence encompassing map layout (cell type) info
|  > [13]     = Array2 array composed of enemy path (as [row,col], and
|               NOT validated {i.e. mapper has to be sure it's correct})
|  > [14]     = [Enemy] Wave schedule (as an Array2 array whose elements
|               are [<Unit Type>,<# to spawn>] [string,number] pairings.
|
| Cell Type Schema: 
|  > '#' => [edge] border
|  > 'X' => map decor  (i.e. tower cannot be built upon)
|  > '-' => buildable  (i.e. tower could be built upon)
|  > '@' => enemy path (i.e. over which enemies travel)
+-----------------------------------------------------------------------
| TODOs:
|  > Maybe turn it into an object with {key:value pairings}? Note that a
|    demo definiton is provided at the end of this file.
+=====================================================================*/
var m01 = [
  [12,16],
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
  [ [2,0],[2,1],[2,2],[2,3],[3,3],[4,3],[4,4],[4,5],[5,5],[6,5],[7,5],[8,5],[8,6],[8,7],[8,8],[7,8],[6,8],[5,8],[4,8],[4,9],[4,10],[4,11],[5,11],[6,11],[7,11],[7,12],[7,13],[8,13],[9,13],[9,14],[9,15] ],

  [ ["STD_4",4], ["STD_5",5], ["STD_1",1], ["STD_3",3], ["STD_4",4], ["STD_2",2], ["STD_6",6], ["STD_8",1] ]
]; // Ends Map Definition 'm01'