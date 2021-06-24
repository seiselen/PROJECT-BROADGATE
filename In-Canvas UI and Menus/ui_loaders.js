
function initUI(){
  /*--------------------------------------------------------------------
  //>>> Demo: Click and Toggle Button
  +-------------------------------------------------------------------*/
  let nClickButton = new UIClickButton(vec2(20,20),vec2(100,30), "Click Me")
  .bindAction(() => int_nClicks.inc())
  .setPredefStyle("click");

  let nClickLabel = new UILabel(vec2(140,20),vec2(100,30))
  .bindCallback(() => ("Clicks = " + int_nClicks.val))
  .setPredefStyle("label2");

  let exToggleButton = new UIToggleButton(vec2(20,60),vec2(100,30), "Toggle Me")
  .bindState(testBool)
  .setPredefStyle("toggle");

  let exToggleLabel = new UIToggleLabel(vec2(140,60),vec2(100,30))
  .bindCallback(() => testBool.val)
  .setPredefStyle("label_toggle");

  let clickToggleContainer = new UIContainer(vec2(20,20),vec2(260,110))
  .addChildren([nClickButton, nClickLabel, exToggleButton, exToggleLabel]);

  /*--------------------------------------------------------------------
  //>>> Demo: Health Label and Inc/Dec Buttons
  +-------------------------------------------------------------------*/
  let healthLabel = new UILabel(vec2(20,20),vec2(220,50))
  .bindCallback(() => ("Health = " + int_health.val))
  .setPredefStyle("label")
  .setStyle("col_bground",color(216,60,0));

  let healthIncButton = new UIClickButton(vec2(20,90),vec2(100,30), "Health +1")
  .bindAction(() => int_health.inc())
  .setPredefStyle("click");

  let healthDecButton = new UIClickButton(vec2(140,90),vec2(100,30), "Health -1")
  .bindAction(() => int_health.dec())
  .setPredefStyle("click");

  let healthContainer = new UIContainer(vec2(20,200),vec2(260,140))
  .addChildren([healthLabel, healthIncButton, healthDecButton]);

  /*--------------------------------------------------------------------
  //>>> Demo: Armor Label and Inc/Dec Buttons
  +-------------------------------------------------------------------*/
  let armorLabel = new UILabel(vec2(20,20),vec2(220,50))
  .bindCallback(() => ("Armor = " + int_armor.val))
  .setPredefStyle("label")
  .setStyle("col_bground",color(60,180,0));

  let armorIncButton = new UIClickButton(vec2(20,90),vec2(100,30), "Armor +1")
  .bindAction(() => int_armor.inc())
  .setPredefStyle("click");

  let armorDecButton = new UIClickButton(vec2(140,90),vec2(100,30), "Armor -1")
  .bindAction(() => int_armor.dec())
  .setPredefStyle("click");

  let armorContainer = new UIContainer(vec2(20,200),vec2(260,140))
  .addChildren([armorLabel, armorIncButton, armorDecButton]);

  /*--------------------------------------------------------------------
  //>>> Demo: Buttons to hide xor unhide Armor xor Health UIContainers
  +-------------------------------------------------------------------*/
  let showAHLabel = new UILabel(vec2(20,5),vec2(40,50), "Show:")
  .setPredefStyle("label3")
  .setStyle("textSize",24);

  let showArmorButton = new UIClickButton(vec2(100,5),vec2(60,30), "Armor")
  .bindAction(() => {armorContainer.setHidden(false); healthContainer.setHidden(true);})
  .setPredefStyle("click");

  let showHealthButton = new UIClickButton(vec2(170,5),vec2(60,30), "Health")
  .bindAction(() => {armorContainer.setHidden(true); healthContainer.setHidden(false);})
  .setPredefStyle("click");

  let showHideContainer = new UIContainer(vec2(20,160),vec2(260,40))
  .addChildren([showAHLabel, showArmorButton, showHealthButton]);

  /*--------------------------------------------------------------------
  //>>> Demo: Test/Experiment towards UILabelButtonPair
  +-------------------------------------------------------------------*/

  let moneyLabel = new UILabel(vec2(20,20),vec2(220,50))
  .bindCallback(() => ("Money = $" + int_money.val))
  .setPredefStyle("label")
  .setStyle("col_bground",color(60,60,60))
  .setStyle("col_text",color(255,180,0))  
  .setStyle("textSize",27);

  let buyOptLab_1 = new UILabel(vec2(20,80),vec2(40,50), "Option 1 ($300)")
  .bindCallback(() => (buyItem_1.name + " ($" + buyItem_1.cost + ")"))
  .setPredefStyle("label3")
  .setStyle("textSize",21)
  .setStyle("textOff",[45,-9]);

  let buyOptBut_1 = new UIBuyButton(vec2(180,80),vec2(60,30), "-BUY-")
  .bindAction(() => int_money.dec(buyItem_1.cost))
  .bindQuery(() => buyItem_1.canAfford())
  .setPredefStyle("click")
  .setStyle("col_border2",color(60,60,60,128));



  let buyOptContainer = new UIContainer(vec2(20,380),vec2(260,350))
  .addChildren([moneyLabel, buyOptLab_1, buyOptBut_1]);






  /*--------------------------------------------------------------------
  //>>> Initialization of root UIContainer
  +-------------------------------------------------------------------*/
  mainUIPanel = new UIContainer(vec2(250,25),vec2(300,750))
  .addChildren([clickToggleContainer, showHideContainer, healthContainer, armorContainer, buyOptContainer]);

}