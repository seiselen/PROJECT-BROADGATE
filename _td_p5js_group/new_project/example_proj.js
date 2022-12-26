import { UIContainer } from "./lib_ui_objects/ui_container.js";
import { UIClickButton } from "./lib_ui_objects/ui_button_click.js";
import { UIToggleButton } from "./lib_ui_objects/ui_button_toggle.js";
import { UIBuyButton } from "./lib_ui_objects/ui_button_click_buy.js";
import { UILabel } from "./lib_ui_objects/ui_label.js";


function initExamplePanel(){
  /*--------------------------------------------------------------------
  //>>> Demo: Click and Toggle Button
  +-------------------------------------------------------------------*/
  sessionStorage.setItem('nClicks','0')  
  let nClickButton = new UIClickButton(vec2(20,20),vec2(100,30), "Click Me")
  .bindAction(() => {console.log("I have been clicked"); sessionStorage.setItem('nClicks',parseInt(sessionStorage.getItem('nClicks'))+1)})

  let nClickLabel = new UILabel(vec2(140,20),vec2(100,30))
  .bindCallback(() => (`# Clicks ⮕ [${sessionStorage.getItem('nClicks')}]`))
  .setStyle('fill_bg',color(60,60,60,120));


  sessionStorage.setItem('toggledValue','OFF')
  let showGridToggle = new UIToggleButton(vec2(20,60),vec2(100,30), "Show Grid")
  .bindValueGetter(()=>{return sessionStorage.getItem('toggledValue')==='ON'})
  .bindValueSetter(()=>{let curVal = sessionStorage.getItem('toggledValue'); sessionStorage.setItem('toggledValue',(curVal==='ON')?'OFF':'ON')})

  let clickToggleContainer = new UIContainer(vec2(20,20),vec2(260,110))
  .addChildren([nClickButton,nClickLabel,showGridToggle]);

  /*--------------------------------------------------------------------
  //>>> Demo: Health Label and Inc/Dec Buttons
  +-------------------------------------------------------------------*/
  sessionStorage.setItem('healthVal','0')  

  let healthLabel = new UILabel(vec2(20,20),vec2(220,50))
  .bindCallback(_=>(`Health ⮕ ${sessionStorage.getItem('healthVal')}`))
  .setStyles([
    ['txtSize',32],
    ['fill_bg',color(216,60,0)],
    ['txtOffY',-6]
  ]);

  let healthIncButton = new UIClickButton(vec2(20,90),vec2(100,30), "Health +1")
  .bindAction(_=>{sessionStorage.setItem('healthVal',parseInt(sessionStorage.getItem('healthVal'))+1)})
  .setStyles([
    ['colr_01',color(0,0,0)],
    ['fill_bg',color(144,144,144)]
  ]);

  let healthDecButton = new UIClickButton(vec2(140,90),vec2(100,30), "Health -1")
  .bindAction(_=>{sessionStorage.setItem('healthVal',parseInt(sessionStorage.getItem('healthVal'))-1)})
  .setStyles([
    ['colr_01',color(0,0,0)],
    ['fill_bg',color(144,144,144)]
  ]);  


  let healthContainer = new UIContainer(vec2(20,200),vec2(260,140))
  .addChildren([healthLabel, healthIncButton, healthDecButton]);

  /*--------------------------------------------------------------------
  //>>> Demo: Armor Label and Inc/Dec Buttons
  +-------------------------------------------------------------------*/
  sessionStorage.setItem('armorVal','0')  

  let armorLabel = new UILabel(vec2(20,20),vec2(220,50))
  .bindCallback(_=>(`Armor ⮕ ${sessionStorage.getItem('armorVal')}`))
  .setStyles([
    ['txtSize',32],
    ['fill_bg',color(60,180,0)],
    ['txtOffY',-6]
  ]);

  let armorIncButton = new UIClickButton(vec2(20,90),vec2(100,30), "Armor +1")
  .bindAction(_=>{sessionStorage.setItem('armorVal',parseInt(sessionStorage.getItem('armorVal'))+1)})
  .setStyles([
    ['colr_01',color(0,0,0)],
    ['fill_bg',color(144,144,144)]
  ]);

  let armorDecButton = new UIClickButton(vec2(140,90),vec2(100,30), "Armor -1")
  .bindAction(_=>{sessionStorage.setItem('armorVal',parseInt(sessionStorage.getItem('armorVal'))-1)})
  .setStyles([
    ['colr_01',color(0,0,0)],
    ['fill_bg',color(144,144,144)]
  ]);

  let armorContainer = new UIContainer(vec2(20,200),vec2(260,140))
  .addChildren([armorLabel, armorIncButton, armorDecButton]);

  /*--------------------------------------------------------------------
  //>>> Demo: Buttons to hide xor unhide Armor xor Health UIContainers
  +-------------------------------------------------------------------*/

  let showAHLabel = new UILabel(vec2(20,5),vec2(40,50), "Show:")
  .setStyles([
    ['txtSize',24],
    ['strk_01',color(255,0)],
    ['fill_bg',color(255,0)],
    ['txtOffY',-16]  
  ]);

  healthContainer.setHidden(true);

  let showArmorButton = new UIClickButton(vec2(100,5),vec2(60,30), "Armor")
  .bindAction(() => {armorContainer.setHidden(false); healthContainer.setHidden(true);})
  .setStyles([
    ['colr_01',color(0,0,0)],
    ['fill_bg',color(144,144,144)]
  ]);

  let showHealthButton = new UIClickButton(vec2(170,5),vec2(60,30), "Health")
  .bindAction(() => {armorContainer.setHidden(true); healthContainer.setHidden(false);}) 
  .setStyles([
    ['colr_01',color(0,0,0)],
    ['fill_bg',color(144,144,144)]
  ]);

  let showHideContainer = new UIContainer(vec2(20,160),vec2(260,40))
  .addChildren([showAHLabel, showArmorButton, showHealthButton]);

  /*--------------------------------------------------------------------
  //>>> Demo: Test/Experiment towards UILabelButtonPair
  +-------------------------------------------------------------------*/
  sessionStorage.setItem('itemCost','150');
  sessionStorage.setItem('curMoney','800');      

  let moneyLabel = new UILabel(vec2(20,20),vec2(220,50))
  .bindCallback(_=>(`Money ⮕ ${sessionStorage.getItem('curMoney')}`))
  .setStyles([
    ['txtSize',27],
    ['colr_01',color(255,180,0)],
    ['strk_01',color(255,0)],
    ['fill_bg',color(60,60,60)],
    ['txtOffY',-8]  
  ]);

  let buyOptLab_1 = new UILabel(vec2(70,80),vec2(40,50), `Cost = ($${sessionStorage.getItem('itemCost')})`)
  .setStyles([
    ['txtSize',21],
    ['strk_01',color(255,0)],
    ['fill_bg',color(255,0)],
    ['txtOffY',-16]  
  ]);


  let buyOptBut_1 = new UIBuyButton(vec2(180,80),vec2(60,30), "-BUY-")
  .bindAction(_=>{sessionStorage.setItem('curMoney',parseInt(sessionStorage.getItem('curMoney'))-parseInt(sessionStorage.getItem('itemCost')))})
  .bindQuery(_=>(parseInt(sessionStorage.getItem('curMoney'))>=parseInt(sessionStorage.getItem('itemCost'))))

  let buyOptContainer = new UIContainer(vec2(20,380),vec2(260,350))
  .addChildren([moneyLabel, buyOptLab_1, buyOptBut_1]);

  /*--------------------------------------------------------------------
  //>>> Initialization of root UIContainer
  +-------------------------------------------------------------------*/
  return new UIContainer(vec2(150,25),vec2(300,750))
  .addChildren([
    clickToggleContainer,
    healthContainer,
    armorContainer,
    showHideContainer,
    buyOptContainer
  ]);

} // Ends Function initExamplePanel

export default initExamplePanel;