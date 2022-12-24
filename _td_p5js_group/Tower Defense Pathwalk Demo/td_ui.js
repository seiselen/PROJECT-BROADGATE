/*======================================================================
| Project:  Simple Tower Defense Map and Pathwalk Demo 01
| Author:   Steven Eiselen, CFHS/UArizona Computer Science
| Language: Javascript with P5JS Library
+-----------------------------------------------------------------------
| Description:  Contains function definitions for the UI, including:
|                - LOADERS which initialize the DOM buttons, place them
|                  in the UI <div> element, and 'bind' 'handler' methods
|                  to their 'OnMousePress' event; and
|                - HANDLERS which 'handle' the OnMousePress event with
|                  the desired behavior
*=====================================================================*/
function initButtons(){

  createButton('Show Cell Coords')
  .parent(select('#ui'))
  .mousePressed(uiHandle_showCellCoords);

  createButton('Show Header Coords')
  .parent(select('#ui'))
  .mousePressed(uiHandle_showHeaderCoords);

  createButton('Show Map Path')
  .parent(select('#ui'))
  .mousePressed(uiHandle_showMapPath);

  createButton('Add Agent')
  .parent(select('#ui'))
  .mousePressed(uiHandle_addAgent);

}

function uiHandle_showCellCoords(){   map.toggle_ShowCellCoords();}
function uiHandle_showHeaderCoords(){ map.toggle_ShowHeaderCoords();}
function uiHandle_showMapPath(){      map.toggle_ShowMapPath();}
function uiHandle_addAgent(){         createAgent(true);}