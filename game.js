$j = jQuery.noConflict()
use_namespace('createjs.*')

//   /$$$$$$  /$$        /$$$$$$  /$$$$$$$   /$$$$$$  /$$             /$$    /$$  /$$$$$$  /$$$$$$$  /$$$$$$  /$$$$$$  /$$$$$$$  /$$       /$$$$$$$$  /$$$$$$
//  /$$__  $$| $$       /$$__  $$| $$__  $$ /$$__  $$| $$            | $$   | $$ /$$__  $$| $$__  $$|_  $$_/ /$$__  $$| $$__  $$| $$      | $$_____/ /$$__  $$
// | $$  \__/| $$      | $$  \ $$| $$  \ $$| $$  \ $$| $$            | $$   | $$| $$  \ $$| $$  \ $$  | $$  | $$  \ $$| $$  \ $$| $$      | $$      | $$  \__/
// | $$ /$$$$| $$      | $$  | $$| $$$$$$$ | $$$$$$$$| $$            |  $$ / $$/| $$$$$$$$| $$$$$$$/  | $$  | $$$$$$$$| $$$$$$$ | $$      | $$$$$   |  $$$$$$
// | $$|_  $$| $$      | $$  | $$| $$__  $$| $$__  $$| $$             \  $$ $$/ | $$__  $$| $$__  $$  | $$  | $$__  $$| $$__  $$| $$      | $$__/    \____  $$
// | $$  \ $$| $$      | $$  | $$| $$  \ $$| $$  | $$| $$              \  $$$/  | $$  | $$| $$  \ $$  | $$  | $$  | $$| $$  \ $$| $$      | $$       /$$  \ $$
// |  $$$$$$/| $$$$$$$$|  $$$$$$/| $$$$$$$/| $$  | $$| $$$$$$$$         \  $/   | $$  | $$| $$  | $$ /$$$$$$| $$  | $$| $$$$$$$/| $$$$$$$$| $$$$$$$$|  $$$$$$/
//  \______/ |________/ \______/ |_______/ |__/  |__/|________/          \_/    |__/  |__/|__/  |__/|______/|__/  |__/|_______/ |________/|________/ \______/

// const canvas = document.querySelector("#stage")
var debug = false,
	showSplashScreen = true,
	doSaveGame = false,
	sf1Options = {
		v           : 1,
		coordX      : debug?215:125,
		coordY      : debug?86:100,
		systemX     : -7800,
		systemY     : -5700,
		stars       : starData,
		planetTypes : planetTypes,
		nebulas     : nebulaData,
		fluxes      : fluxData,
		fluxLog		: [],
		money       : 2000,
		date  		: {minute:0,hour:0,day:1,month:1,year:4620},
		questions   : ['THEMSELVES','OTHER RACES','THE ANCIENTS','OLD EMPIRE','GENERAL INFO']
	},
	sf2Options = {
		v           : 2,
		coordX      : 34.2,
		coordY      : 74.2,
		systemX     : -5000,
		systemY     : -500,
		stars       : starData2,
		planetTypes : planetTypes2,
		nebulas     : nebulaData2,
		fluxes      : fluxData2,
		fluxLog		: [],
		money       : 2000,
		date  		: {minute:0,hour:0,day:1,month:1,year:4620},
		questions   : ['THEMSELVES','OTHER RACES','THE PAST','TRADE','GENERAL INFO']
	},
	gameSave				 = {},
	game                     = sf1Options,
	stage                    = new Stage('stage'),
	shipIcon                 = new Container(),
	viewScreenContainer      = new Container(),
	titleContainer           = new Container(),
	utilityScreenContainer   = new Container(),
	controlButtonsContainer  = new Container(),
	dialogScreenContainer    = new Container(),
	viewScreenContents       = new Container(),
	starmapContainer         = new Container(),
	starmapCoordsContainer   = new Container(),
	starsContainer           = new Container(),
	popupContainer           = new Container(),
	popupBody                = new Container(),
	popupButtons             = new Container(),
	starSystemMapContainer   = new Container(),
	starSystemContainer      = new Container(),
	topNebulaContainer 		 = new Container(),
	popupWidth               = 800,
	popupHeight              = 800,
	currentPlanetType        = 0,
	currentPlanetOrbitNumber = 0,
	currentPlanetNumber      = 0,
	planetsInCurrentSystem   = [],
	stars                    = new Shape(),
	warningKlaxon 			 = new Shape(),
	warningLight 			 = new Shape(),
	daysBetweenFlare         = 65536,
	windowWidth              = 1600,
	windowHeight             = 900,
	grey                     = '#aaa',
	darkGrey                 = '#999'
	blue                     = '#0080FF',
	white					 = '#fff',
	black					 = '#000',
	starmapScale             = 10,
	shipmapScale             = 200,
	systemMapScale           = 1,
	systemScale              = 50,
	xOffset                  = 0,
	yOffset                  = 0,
	borderWidth              = 2,
	borderRadius             = 8,
	sideBarWidth             = 300,
	systemRadius             = ((sideBarWidth-5)*systemScale)/2,
	utilityScreenWidth       = sideBarWidth-5,
	utilityScreenHeight      = utilityScreenWidth,
	controlWidth             = sideBarWidth-5,
	controlHeight            = 120,
	dialogScreenWidth        = sideBarWidth-5,
	dialogScreenHeight       = 100,
	cargoPodStorageCapacity  = 100,
	isDocked                 = 0,
	isOnPlanet               = 1,
	isInOrbit                = 2,
	isInSystem               = 3,
	isInHyperspace           = 4,
	isInEncounter            = 5,
	isCommunicating          = 6,
	isInStarmap              = 7,
 	shipClass = {
 		standard : {engineClassMax:5,shieldClassMax:5,armorClassMax:5,laserClassMax:5,missileClassMax:5,plasmaClassMax:0,cargoPodsMax:10,jumpPodsMax:0,blastoPodsMax:0},
 		expanded : {engineClassMax:5,shieldClassMax:5,armorClassMax:5,laserClassMax:5,missileClassMax:5,plasmaClassMax:1,cargoPodsMax:10,jumpPodsMax:2,blastoPodsMax:4}
 	},
 	shipOptions = {
 		class               : shipClass.standard,
 		status              : debug?isInSystem:isDocked,
 		atPlanet            : false,
 		shieldsUp           : false,
 		weaponsArmed        : false,
 		shieldsVal          : 0,
 		armorVal            : 40,
 		cargoPods           : 4,
 		blastoPods          : 0,
 		jumpPods            : 0,
 		enginesOn           : false,
 		orientation         : 180,
 		fuelType            : 'endurium',
 		cargoHold           : {'endurium' : {type:'fuel',mass:20}},
 		engineClass         : 1,
 		shieldClass         : 1,
 		armorClass          : 1,
 		laserClass          : 1,
 		missileClass        : 0,
 		plasmaClass         : 0,
 		hp                  : 100,
 		hpMax               : 100,
 		isInEncounter       : false,
 		isCommunicating 	: false
 	},
 	ship = shipOptions,
 	isInNebula = false,
 	getStatus = ['Docked at Starport','On Planet Surface','In Orbit','In System Flight','In Hyperspace','In Encounter','Communicating','Starmap'],
 	hasCultureBouy = false,
 	hasDebris = false,
	font = 'Verdana',
	gpsDirections = new Shape(),
	mood = 0,
	positionVal = returnText(game.coordX+'x'+game.coordY,20,blue),
	destinationVal = returnText(game.coordX+'x'+game.coordY,20,blue),
	distanceVal = returnText('',20,blue),
	fuelVal = returnText('',20,blue),
	cursor = new Shape(),
	spectralClasses = {O:'blue',B:blue,A:'green',F:'white',G:'yellow',K:'orange',M:'red'}
	spectralClassSize = {O:1.6,B:1.5,A:1,F:0.5,G:0.6,K:0.7,M:1.3}
	statements = [
		['I want to be your friend.','Will you be my friend?'],
		['You smell like fear and death!','Prepare to join the Arth Empire alien scum!'],
		['Oh please be merciful!','We grovel at your feet!']
	],
	// themselvesQuestions = [
	// 	['Please tell us about yourselves.','We would appreciate information about your race.'],					
	// 	['We desire information about your pathetic species.','You will tell us about your race or we will destroy you!'],					
	// 	['If it is not too mch to ask, we beg that you tell us something about your illustrious selves.','Please brighten our day with some meager tidbit of information about your magnificent race!']
	// ],
	// othersQuestions = [
	// 	['others-friendly 1?','others-friendly 2?'],					
	// 	['others-hostile 1?','others-hostile 2?'],					
	// 	['others-obsequious 1?','others-obsequious 2?']
	// ],
	// pastQuestions = [
	// 	['past-friendly 1?','past-friendly 2?'],					
	// 	['past-hostile 1?','past-hostile 2?'],					
	// 	['past-obsequious 1?','past-obsequious 2?']
	// ],
	// oldEmpireQuestions = [
	// 	['oldEmpire-friendly 1?','oldEmpire-friendly 2?'],					
	// 	['oldEmpire-hostile 1?','oldEmpire-hostile 2?'],					
	// 	['oldEmpire-obsequious 1?','oldEmpire-obsequious 2?']
	// ],
	starDataKeys =  Object.keys(game.stars),
	fluxDataKeys =  Object.keys(game.fluxes),
	doorOpening = 0,
	openDoors=false,
	closeDoors=false,
	doorWidth = 580,
	doorHeight = 380/2,
	clearOfStarport=false,
	scratches = [],
	starPortButtons = new Container(),
	bw = buttonGroupWidth(780,10,5),//(((doorWidth)-20)/5),
	dockingBayBtn = drawButton({label:'Docking Bay',width:bw,onClick:handleDockingBayButtonClick}),
	opsBtn = drawButton({x:bw+10,label:'OPERATIONS',width:bw,onClick:handleOperationsButtonClick}),
	shipConfigBtn = drawButton({x:(bw+10)*2,label:'SHIPYARD',width:bw,onClick:handleShipConfigButtonClick}),
	crewBtn = drawButton({x:(bw+10)*3,label:'CREW',width:bw,onClick:handleCrewButtonClick}),
	tradeDepotBtn = drawButton({x:(bw+10)*4,label:'TRADE DEPOT',width:bw,onClick:handleTradeDepotButtonClick}),
	orbitPlanetButton = drawButton({x:(windowWidth/2)-60,y:(windowHeight/2)-100,label:'Orbit Planet',width:120,onClick:handleOrbitPlanetButtonClick}),
	dockWithStarPortButton = drawButton({x:(windowWidth/2)-60,y:(windowHeight/2)-100,label:'Dock with Starport',width:180,onClick:handleDockWithStarPortButtonClick}),
	
	orbitPlanetButton.visible=false,
	dockWithStarPortButton.visible=false,

	tbw = buttonGroupWidth(295,10,2),
	
	toggleShieldsButton = drawButton({label:'Shields',width:tbw,onClick:handleToggleShieldsButtonClick}),
	toggleWeaponsButton = drawButton({x:tbw+10,label:'weapons',width:tbw,onClick:handleToggleWeaponsButtonClick}),
	showStarmapButton = drawButton({y:50*1,label:'Starmap',width:295,onClick:handleStarmapButtonClick}),
	distressCallButton = drawButton({y:50*2,width:295,label:'send distress call',onClick:handleDistressCallButtonClick}),
	engineerButton = drawButton({y:50*3,label:'engineering',width:295,onClick:handleEngineerButtonClick}),
	medicalButton = drawButton({y:50*4,label:'medical',width:295,onClick:handleMedicalButtonClick}),
	optionsButton = drawButton({y:50*5,label:'settings',width:295,onClick:handleOptionsButtonClick}),
	dialogTextArray = [],
	commsTextArray = [],
	raceNames = Object.keys(personelRaces)
	
controlButtonsContainer.addChild(toggleShieldsButton,toggleWeaponsButton,showStarmapButton,distressCallButton,engineerButton,medicalButton,optionsButton)
starPortButtons.addChild(dockingBayBtn,opsBtn,shipConfigBtn,crewBtn,tradeDepotBtn)
controlButtonsContainer.x=windowWidth-sideBarWidth
controlButtonsContainer.y=utilityScreenHeight+10+dialogScreenHeight+10
function shipIsDocked(){return ship.status==isDocked}
function shipIsOnPlanet(){return ship.status==isOnPlanet}
function shipIsInOrbit(){return ship.status==isInOrbit}
function shipIsInSystem(){return ship.status==isInSystem}
function shipIsInHyperspace(){return ship.status==isInHyperspace}
function shipIsInEncounter(){return ship.isInEncounter}
function shipIsCommunicating(){console.log('shipIsCommunicating()',ship.isCommunicating); return ship.isCommunicating}
function shipFuelVal(){return ship.cargoHold[ship.fuelType].mass}
function shipCargoAmt(){
	var amnt = 0,
		cargoItems = Object.keys(ship.cargoHold)
	for (var i = 0; i < cargoItems.length; i++) {
		amnt+=ship.cargoHold[cargoItems[i]].mass
	}
	return amnt
}
function shipCargoSpaceRemaining(){return (ship.cargoPods*cargoPodStorageCapacity)-shipCargoAmt()}

function handleOptionsButtonClick(event){
	console.log('handleOptionsButtonClick')
}
function handleDockingBayButtonClick(event){
	buildDockingBayPopup()
}
function handleOperationsButtonClick(event){
	buildOperations('NOTICES',null)
}
function handleShipConfigButtonClick(event){
	buildShipConfigPopup(null)
}
function handleCrewButtonClick(event){
	buildPersonelPopup('HUMAN')
}
function handleTradeDepotButtonClick(event){
	buildTradeDepotPopup()
}
function handleOrbitPlanetButtonClick(){
	buildOrbitPopup()					
}
function handleStarmapButtonClick(){
	buildStarmapPopup()
}
function handleEngineerButtonClick(){
	buildEngineeringPopup()
}
function handleMedicalButtonClick(){
	buildMedicalPopup()
}
function handleDockWithStarPortButtonClick(){
	dockWithStarPort()
}
var youAreHere = drawShip({
	color:'cyan',
	drawShields:false,
	drawWeapons:false,
	drawPods:false,
	scale:0.1,
	lod:3,
	animateShields:false
})



//  /$$   /$$ /$$$$$$$$ /$$$$$$ /$$       /$$$$$$ /$$$$$$$$ /$$     /$$       /$$$$$$$$ /$$   /$$ /$$   /$$  /$$$$$$  /$$$$$$$$ /$$$$$$  /$$$$$$  /$$   /$$  /$$$$$$
// | $$  | $$|__  $$__/|_  $$_/| $$      |_  $$_/|__  $$__/|  $$   /$$/      | $$_____/| $$  | $$| $$$ | $$ /$$__  $$|__  $$__/|_  $$_/ /$$__  $$| $$$ | $$ /$$__  $$
// | $$  | $$   | $$     | $$  | $$        | $$     | $$    \  $$ /$$/       | $$      | $$  | $$| $$$$| $$| $$  \__/   | $$     | $$  | $$  \ $$| $$$$| $$| $$  \__/
// | $$  | $$   | $$     | $$  | $$        | $$     | $$     \  $$$$/        | $$$$$   | $$  | $$| $$ $$ $$| $$         | $$     | $$  | $$  | $$| $$ $$ $$|  $$$$$$
// | $$  | $$   | $$     | $$  | $$        | $$     | $$      \  $$/         | $$__/   | $$  | $$| $$  $$$$| $$         | $$     | $$  | $$  | $$| $$  $$$$ \____  $$
// | $$  | $$   | $$     | $$  | $$        | $$     | $$       | $$          | $$      | $$  | $$| $$\  $$$| $$    $$   | $$     | $$  | $$  | $$| $$\  $$$ /$$  \ $$
// |  $$$$$$/   | $$    /$$$$$$| $$$$$$$$ /$$$$$$   | $$       | $$          | $$      |  $$$$$$/| $$ \  $$|  $$$$$$/   | $$    /$$$$$$|  $$$$$$/| $$ \  $$|  $$$$$$/
//  \______/    |__/   |______/|________/|______/   |__/       |__/          |__/       \______/ |__/  \__/ \______/    |__/   |______/ \______/ |__/  \__/ \______/


function rifi(min,max){
    return randomIntFromInterval(min,max)
}
function rdfi(min,max){
    return randomDecFromInterval(min,max)
}
function rae(a){
    return randomFromArray(a)
}
function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min)
}
function randomDecFromInterval(min,max){
    return round(Math.random()*(max-min+1)+min,1)
}
function randomFromArray(a){
    return a[randomIntFromInterval(0,(a.length - 1))]
}
function convertSFCoordsToScreenCoords(sfX,sfY,scale){
	var x = (sfX+xOffset)*scale,
		y = (220-(sfY+yOffset))*scale
	return {x:x,y:y}
}
function convertScreenCoordsToSFCoords(sfX,sfY,scale){
	var x = Math.round(sfX/scale)-xOffset,
		y = Math.round(220-(sfY/scale))-yOffset
	return {x:x,y:y}
}

function returnText(text,size,color){
	return new Text(makeCap(text),size+'px '+font,color)
}
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0)
    return Math.round(value * multiplier) / multiplier
}
function burnFuel(amount){
	decreaseFuel(amount/ship.engineClass)
}
function decreaseFuel(amount){
	decreaseCargoItemMass(ship.fuelType,amount)
}
function increaseFuel(amount){
	increaseCargoItemMass(ship.fuelType,amount)
}
function increaseCargoItemMass(item,amount){
	if(amount<shipCargoSpaceRemaining())
		ship.cargoHold[item].mass += amount
	else
		ship.cargoHold[item].mass += round(shipCargoSpaceRemaining(),1)
	
}
function buttonGroupWidth(groupWidth,gutter,numberOfButtons){
	return (groupWidth-((numberOfButtons-1)*gutter))/numberOfButtons
}
function decreaseCargoItemMass(item,amount){
	if(amount>ship.cargoHold[item].mass)
		delete ship.cargoHold[item]
	else
		ship.cargoHold[item].mass = round(ship.cargoHold[item].mass - amount,1)
}
function landOnPlanet(lat,long){
	ship.status = isOnPlanet
}
function enterStarSystem(){
	ship.status = isInSystem								        	
	var padding = -400,
		systemDiameter = -1*((sideBarWidth-5)*systemScale),
		systemRadius = systemDiameter/2 //136*systemScale
	if(ship.orientation==0){
		game.systemX = systemRadius-padding
		game.systemY = systemDiameter-padding
	}
	if(ship.orientation==45){
		game.systemX = padding
		game.systemY = systemDiameter-padding
	}
	if(ship.orientation==90){
		game.systemX = padding
		game.systemY = systemRadius-padding
	}
	if(ship.orientation==135){
		game.systemX = padding
		game.systemY = padding
	}
	if(ship.orientation==180){
		game.systemX = systemRadius-padding
		game.systemY = padding
	}
	if(ship.orientation==225){
		game.systemX = systemDiameter-padding
		game.systemY = padding
	}
	if(ship.orientation==270){
		game.systemX = systemDiameter-padding
		game.systemY = systemRadius-padding
	}
	if(ship.orientation==315){
		game.systemX = systemDiameter-padding
		game.systemY = systemDiameter-padding
	}
	//stage.update()
}
function enterHyperspace(dir){
	ship.status = isInHyperspace
	ship.enginesOn = false
	if(dir==270){
		game.coordX -= 0.7
	}else if(dir==90){
		game.coordX += 0.7
	}else if(dir==0){
		game.coordY += 0.7
	}else if(dir==180){
		game.coordY -= 0.7
	}else if(dir==45){
		game.coordX += 0.7
		game.coordY += 0.7		
	}else if(dir==135){
		game.coordX += 0.7
		game.coordY -= 0.7		
	}else if(dir==225){
		game.coordX -= 0.7
		game.coordY -= 0.7		
	}else if(dir==315){
		game.coordX -= 0.7
		game.coordY += 0.7		
	}
	addTextToDialog('Entering hyperspace.')
	buildShipUI()
}
function enterEncounter(){
	ship.isInEncounter = true
	buildShipUI()
}
function beginCommunications(){
	//ship.status = isCommunicating
	ship.isCommunicating=true
}
function leaveStarPort(){
	ship.status = isInSystem
	ship.enginesOn = false
	ship.orientation = 180
	openDoors=true
	buildDockingBayPopup()
	addTextToDialog('Leaving Starport...')
}
function dockWithStarPort(){
	ship.status = isDocked
	ship.atPlanet = false
	ship.enginesOn = false
	doorOpening = 200
	closeDoors=true
	buildShipUI()
	addTextToDialog('Welcome to Starport')
	buildDockingBayPopup()
}
function launchIntoOrbit(){
	ship.status = isInOrbit
	buildShipUI()
	addTextToDialog('Leaving planet surface...')
}
function init(){
    ship.status = isDocked	
	ship.atPlanet = false
	// Check browser support
	if (typeof(Storage) !== "undefined") {
	    // Retrieve
	    gameSave = JSON.parse(localStorage.getItem("gameSave"))
	    console.log("gameSave", gameSave);
	    if(gameSave!=null){	 
		    game=gameSave.game
		    ship=gameSave.ship
			showSplashScreen = false
			if(game.questions == null) game.questions = sf1Options.questions
			// ship.status = 4
			// if(ship.status==5)ship.status=isInSystem
			// if(game.date == null) game.date = {minute:0,hour:0,day:1,month:1,year:4620}
			// if(ship.isInEncounter==null)ship.isInEncounter=true
			
			doSaveGame=true
			if(shipIsDocked()){
				closePopup()
				buildShipUI()
				addTextToDialog('Welcome to Starport')				
				buildDockingBayPopup()	
			}else if(shipIsInSystem() || shipIsCommunicating()){
		    	buildShipUI()
			}else if(shipIsInHyperspace() || shipIsCommunicating()){
				buildShipUI()
			}else if(shipIsInEncounter()){
				buildShipUI()
			}
			collisionDetection()	
		}else{
			console.log('new game')
			gameSave = {}
			game = sf1Options
			ship = shipOptions
			buildShipUI()
			buildSplashScreenPopup()
		}		
	} else {
	    console.log("Sorry, your browser does not support Web Storage...");
	}
}
function planetIsStarport(){ 
	return currentPlanetType==58
} 

function handleHailButtonClick(){
	closePopup()
	beginCommunications() 
	buildCommsPopup()
	addTextToDialog('Sorry Sir, I can\'t find the microphone.')
}
function handleStatementButtonClick(){
	addTextToComms(rae(statements[mood]))
	buildCommsPopup()
}
function handleQuestionButtonClick(){
	popupButtons.removeAllChildren()
	var bw = buttonGroupWidth(780,10,5)
	for (var i = 0; i < game.questions.length; i++) {		
		var btn = drawButton({x:(bw+10)*(i),width:bw,label:game.questions[i],onClick:handleAskQuestionButtonClick})	
		popupButtons.addChild(btn)
	}
	// var themselvesButton = drawButton({width:200,label:'themselves',onClick:handleQuestionButtonClick})	
	// 	othersButton = drawButton({width:200,label:'other races',onClick:handleQuestionButtonClick})
	// 	ancientsButton = drawButton({width:200,label:'the ancients',onClick:handleQuestionButtonClick})
	// 	othersButton = drawButton({width:200,label:'other races',onClick:handleQuestionButtonClick})
	// popupButtons.addChild(themselvesButton,othersButton)
}
function handlePostureButtonClick(){}
function handleAskQuestionButtonClick(event){
	var subject = event.currentTarget.name
	console.log("subject", subject);
	addTextToComms(rae(questions[subject][mood]))
	buildCommsPopup()
}
// function handleOthersButtonClick(){
// 	addTextToComms(rae(questions['OTHER RACES'][mood]))
// 	buildCommsPopup()
// }
// function handlePastButtonClick(){
// 	addTextToComms(rae(questions['THE PAST'][mood]))
// 	buildCommsPopup()
// }
// function handleOldEmpireButtonClick(){
// 	addTextToComms(rae(oldEmpireQuestions[mood]))
// 	buildCommsPopup()
// }
function handleFriendlyButtonClick(){
	mood = 0
	//ship.status = isCommunicating 
	ship.isCommunicating = true
	addTextToDialog('Thank you Sir, I think you are very friendly too.')
}
function handleHostileButtonClick(){
	mood = 1
	// ship.status = isCommunicating 
	ship.isCommunicating = true
	addTextToDialog('Well, that was just rude!')
}
function handleObsequiousButtonClick(){
	mood = 2
	// ship.status = isCommunicating 
	ship.isCommunicating = true
	addTextToDialog('Pull yourself together Sir!')
}
function handleTerminateButtonClick(){
	closePopup()
	ship.isCommunicating=false
	addTextToComms('Good bye')
	buildShipUI()
}
function addTextToDialog(text){
	if(dialogTextArray.length>=6){	
		dialogTextArray.splice(0,1)
	}
	dialogTextArray.push(text)
}
function addTextToComms(text){
	if(commsTextArray.length>=9){	
		commsTextArray.splice(0,1)
	}
	commsTextArray.push(text)
}


//  /$$$$$$$  /$$   /$$ /$$$$$$ /$$       /$$$$$$$        /$$$$$$$$ /$$   /$$ /$$   /$$  /$$$$$$  /$$$$$$$$ /$$$$$$  /$$$$$$  /$$   /$$  /$$$$$$
// | $$__  $$| $$  | $$|_  $$_/| $$      | $$__  $$      | $$_____/| $$  | $$| $$$ | $$ /$$__  $$|__  $$__/|_  $$_/ /$$__  $$| $$$ | $$ /$$__  $$
// | $$  \ $$| $$  | $$  | $$  | $$      | $$  \ $$      | $$      | $$  | $$| $$$$| $$| $$  \__/   | $$     | $$  | $$  \ $$| $$$$| $$| $$  \__/
// | $$$$$$$ | $$  | $$  | $$  | $$      | $$  | $$      | $$$$$   | $$  | $$| $$ $$ $$| $$         | $$     | $$  | $$  | $$| $$ $$ $$|  $$$$$$
// | $$__  $$| $$  | $$  | $$  | $$      | $$  | $$      | $$__/   | $$  | $$| $$  $$$$| $$         | $$     | $$  | $$  | $$| $$  $$$$ \____  $$
// | $$  \ $$| $$  | $$  | $$  | $$      | $$  | $$      | $$      | $$  | $$| $$\  $$$| $$    $$   | $$     | $$  | $$  | $$| $$\  $$$ /$$  \ $$
// | $$$$$$$/|  $$$$$$/ /$$$$$$| $$$$$$$$| $$$$$$$/      | $$      |  $$$$$$/| $$ \  $$|  $$$$$$/   | $$    /$$$$$$|  $$$$$$/| $$ \  $$|  $$$$$$/
// |_______/  \______/ |______/|________/|_______/       |__/       \______/ |__/  \__/ \______/    |__/   |______/ \______/ |__/  \__/ \______/


function buildShipUI(){	
	console.log('buildShipUI')
	stage.removeAllChildren()	
	buildShipViewScreen()
	buildUtilityScreen()
	if(shipIsInHyperspace() || shipIsCommunicating()){
		buildStatus()
	}else if(shipIsInSystem() || shipIsCommunicating()){
		buildStarSystem(systemMapScale)
	}
	if(shipIsInEncounter()){
		buildEncounterPopup()
	}
	buildDialogScreen()
	stage.addChild(viewScreenContainer,utilityScreenContainer,dialogScreenContainer,controlButtonsContainer,popupContainer)
	if(shipIsDocked()){
		// disableButton(toggleShieldsButton)
		// disableButton(toggleWeaponsButton)
		// disableButton(showStarmapButton)
	}
}
function disableButton(btn){
	btn.removeAllEventListeners('click')
	btn.children[0].set({alpha:0.5})
	console.log("btn", btn)
}
function buildEncounterPopup(){
	ship.enginesOn = false
	showPopup({title:'encounter'})
	var endEncounterButton = drawButton({label:'end encounter',width:120,onClick:handleEndEncounterButtonClick})
		hailButton = drawButton({x:130,label:'hail',width:120,onClick:handleHailButtonClick})
	popupButtons.addChild(endEncounterButton,hailButton)
}
function buildStarmapPopup(){
	showPopup({title:'STARMAP',width:windowWidth,height:windowHeight,x:0,y:0})
	buildStarmap(windowWidth,windowHeight)
	popupBody.addChild(starmapContainer)
}
function buildSplashScreenPopup(){
	//stage.removeAllChildren()
	showPopup({title:'STARFLIGHT',width:windowWidth,height:windowHeight,x:0,y:0})
	var playGameButton = drawButton({x:700,width:200,label:'Play Game',onClick:handlePlayGameButtonClick})
	popupButtons.addChild(playGameButton)
}
function handlePlayGameButtonClick(){	
// 	gameSave = {}
// 	game = sf1Options
// 	ship = shipOptions
	doSaveGame=true
	init()
}
function handleEndEncounterButtonClick(){
	closePopup()
	ship.isInEncounter = false
	ship.isCommunicating = false
	buildShipUI()
}

//   /$$$$$$  /$$   /$$ /$$$$$$ /$$$$$$$        /$$   /$$ /$$$$$$
//  /$$__  $$| $$  | $$|_  $$_/| $$__  $$      | $$  | $$|_  $$_/
// | $$  \__/| $$  | $$  | $$  | $$  \ $$      | $$  | $$  | $$
// |  $$$$$$ | $$$$$$$$  | $$  | $$$$$$$/      | $$  | $$  | $$
//  \____  $$| $$__  $$  | $$  | $$____/       | $$  | $$  | $$
//  /$$  \ $$| $$  | $$  | $$  | $$            | $$  | $$  | $$
// |  $$$$$$/| $$  | $$ /$$$$$$| $$            |  $$$$$$/ /$$$$$$
//  \______/ |__/  |__/|______/|__/             \______/ |______/

function buildShipViewScreen(){
	viewScreenContainer.removeAllChildren()
	starsContainer.removeAllChildren()
	viewScreenContents.removeAllChildren()
	viewScreenContainer.x=0
	viewScreenContainer.y=0

	var viewScreenBG = new Shape()
	viewScreenBG.graphics.beginFill('#000').dr(0,0,windowWidth,windowHeight)
	viewScreenContents.addChild(viewScreenBG)
	viewScreenContainer.addChild(viewScreenContents) //,streaksContainer)			
	
	if(shipIsInHyperspace() || shipIsCommunicating()){
		drawStars(windowWidth,windowHeight,shipmapScale)
		drawFluxPoints(shipmapScale)
	}else if(shipIsInSystem() || shipIsCommunicating()){					
		buildStarSystem(systemScale,game.systemX,game.systemY)
	}
	shipIcon = drawShip({
		drawShields    : true,
		drawWeapons    : true,
		drawPods       : false,
		scale          : 0.3,
		lod            : 3,
		animateShields : false
	})
	shipIcon.regX = 50
	shipIcon.regY = 70
	shipIcon.rotation = ship.orientation
	shipIcon.x = windowWidth>sideBarWidth*3?windowWidth/2:((windowWidth - sideBarWidth)/2)
	shipIcon.y = (windowHeight/2)
	changeCoords(game.coordX,game.coordY)
	
	if(!shipIsDocked()){
		viewScreenContents.addChild(starsContainer,shipIcon,topNebulaContainer,orbitPlanetButton,dockWithStarPortButton)
	}
	viewScreenContents.addChild(titleContainer)
	viewScreenBG.removeAllEventListeners("click")
	viewScreenBG.addEventListener("click", handleViewScreenClick)
}

function buildUtilityScreen(){
	// //console.log("buildUtilityScreen")				
	utilityScreenContainer.removeAllChildren()
	utilityScreenContainer.x= windowWidth-sideBarWidth//+2
	utilityScreenContainer.y=2
	var utilityScreen = new Shape()
	utilityScreen.graphics.beginStroke(blue).ss(borderWidth).beginFill('#000').rr(0,0,utilityScreenWidth,utilityScreenHeight,borderRadius)
	utilityScreenContainer.addChild(utilityScreen)			
}
function buildDialogScreen(){
	console.log('buildDialogScreen')
	dialogScreenContainer.removeAllChildren()
	dialogScreenContainer.x= windowWidth-sideBarWidth//+2
	dialogScreenContainer.y=utilityScreenHeight+10
	var dialogScreen = new Shape()
	dialogScreen.graphics.beginStroke(blue).ss(borderWidth).beginFill('#000').rr(0,0,sideBarWidth-5,dialogScreenHeight,borderRadius)
	dialogScreenContainer.addChild(dialogScreen)
	for (var i = 0; i < dialogTextArray.length; i++) {
		var text = dialogTextArray[i]		
		var dialogText = new Text(text,'12px '+font,'white')
		dialogText.x=5
		dialogText.y=5+(i*15)
		dialogText.lineWidth = sideBarWidth-10
		dialogScreenContainer.addChild(dialogText)
	}
}
//   /$$$$$$  /$$$$$$$$ /$$$$$$  /$$$$$$$  /$$      /$$  /$$$$$$  /$$$$$$$
//  /$$__  $$|__  $$__//$$__  $$| $$__  $$| $$$    /$$$ /$$__  $$| $$__  $$
// | $$  \__/   | $$  | $$  \ $$| $$  \ $$| $$$$  /$$$$| $$  \ $$| $$  \ $$
// |  $$$$$$    | $$  | $$$$$$$$| $$$$$$$/| $$ $$/$$ $$| $$$$$$$$| $$$$$$$/
//  \____  $$   | $$  | $$__  $$| $$__  $$| $$  $$$| $$| $$__  $$| $$____/
//  /$$  \ $$   | $$  | $$  | $$| $$  \ $$| $$\  $ | $$| $$  | $$| $$
// |  $$$$$$/   | $$  | $$  | $$| $$  | $$| $$ \/  | $$| $$  | $$| $$
//  \______/    |__/  |__/  |__/|__/  |__/|__/     |__/|__/  |__/|__/



function buildStarmap(w,h){		
	drawStars(w,h,starmapScale)
	drawFluxLines(starmapScale)
	drawCursor(-100,-100)
	var screenXY = convertSFCoordsToScreenCoords(game.coordX,game.coordY,starmapScale)
	youAreHere.x=screenXY.x
	youAreHere.y=screenXY.y
	youAreHere.regX = 50
	youAreHere.regY = 70
	youAreHere.rotation = ship.orientation
	var labelY=5,
		valY=35,
		exitButton = drawButton({x:windowWidth-150,y:5,label:'EXIT STARMAP',width:130,onClick:handleExitStarmapClick}),
		infoSectionWidth = (windowWidth/4),
		infoSectionTextAlign = 'right',
		position = returnText('position',20,blue),
		destination = returnText('destination',20,blue),
		distance = returnText('distance',20,blue),
		fuel = returnText('fuel',20,blue),
		starmapUI = new Container(),
		starmapUIbg = new Shape()

	position.x=infoSectionWidth-(infoSectionWidth/2)
	position.y=5
	position.textAlign='center'
	positionVal.text = Math.floor(game.coordX)+'x'+Math.floor(game.coordY)
	positionVal.x=infoSectionWidth-(infoSectionWidth/2)
	positionVal.y=valY
	positionVal.textAlign='center'
	
	destination.x=infoSectionWidth*2-(infoSectionWidth/2)
	destination.y=5
	destination.textAlign='center'
	destinationVal.x=infoSectionWidth*2-(infoSectionWidth/2)
	destinationVal.y=valY
	destinationVal.textAlign='center'
	
	distance.x=infoSectionWidth*3-(infoSectionWidth/2)
	distance.y=5
	distance.textAlign='center'
	distanceVal.x=infoSectionWidth*3-(infoSectionWidth/2)
	distanceVal.y=valY
	distanceVal.textAlign='center'
	
	fuel.x=infoSectionWidth*4-(infoSectionWidth/2)
	fuel.y=5
	fuel.textAlign='center'
	fuelVal.x=infoSectionWidth*4-(infoSectionWidth/2)
	fuelVal.y=valY
	fuelVal.textAlign='center'	
	
	starmapUI.removeAllChildren()
	starmapUI.x=5
	starmapUI.y=windowHeight-85
	
	starmapUIbg.graphics.beginFill('black').dr(0,0,windowWidth-20,105)
	starmapUI.addChild(position,destination,distance,fuel,positionVal,destinationVal,distanceVal,fuelVal)
	
	// var dimensions = new Shape()
	// dimensions.graphics.beginStroke(blue).ss(3)
	// 	.mt(20,0).lt(20,windowHeight).lt(windowWidth,windowHeight)				
	
	starmapContainer.addChild(starsContainer,starmapUI,exitButton,starmapCoordsContainer,cursor,youAreHere)
	starsContainer.addEventListener('click',handleStarmapClick)
}
function handleExitStarmapClick(event){
	closePopup()
	buildShipUI()
	if(shipIsDocked()) buildDockingBayPopup()
}
function handleStarmapClick(event){
    var coordScreenXY = convertSFCoordsToScreenCoords(game.coordX,game.coordY,starmapScale)
	var destSFXY = convertScreenCoordsToSFCoords(event.stageX-10,event.stageY-10,starmapScale)
	var x = destSFXY.x
		y = destSFXY.y
	var destScreenXY = convertSFCoordsToScreenCoords(x,y,starmapScale)	
	destinationVal.text = Math.floor(x)+'x'+Math.floor(y)
	var a = Math.abs(game.coordX-x),
		b = Math.abs(game.coordY-y),
		c=(a*a)+(b*b),
		dist=round(Math.sqrt(c),1)
	distanceVal.text = dist
	fuelVal.text = round(dist*(1/ship.engineClass),1)
	cursor.x=event.stageX-10
	cursor.y=event.stageY-10
}

//  /$$$$$$$  /$$   /$$ /$$$$$$ /$$       /$$$$$$$         /$$$$$$   /$$$$$$  /$$      /$$ /$$$$$$$   /$$$$$$  /$$   /$$ /$$$$$$$$ /$$   /$$ /$$$$$$$$ /$$$$$$
// | $$__  $$| $$  | $$|_  $$_/| $$      | $$__  $$       /$$__  $$ /$$__  $$| $$$    /$$$| $$__  $$ /$$__  $$| $$$ | $$| $$_____/| $$$ | $$|__  $$__//$$__  $$
// | $$  \ $$| $$  | $$  | $$  | $$      | $$  \ $$      | $$  \__/| $$  \ $$| $$$$  /$$$$| $$  \ $$| $$  \ $$| $$$$| $$| $$      | $$$$| $$   | $$  | $$  \__/
// | $$$$$$$ | $$  | $$  | $$  | $$      | $$  | $$      | $$      | $$  | $$| $$ $$/$$ $$| $$$$$$$/| $$  | $$| $$ $$ $$| $$$$$   | $$ $$ $$   | $$  |  $$$$$$
// | $$__  $$| $$  | $$  | $$  | $$      | $$  | $$      | $$      | $$  | $$| $$  $$$| $$| $$____/ | $$  | $$| $$  $$$$| $$__/   | $$  $$$$   | $$   \____  $$
// | $$  \ $$| $$  | $$  | $$  | $$      | $$  | $$      | $$    $$| $$  | $$| $$\  $ | $$| $$      | $$  | $$| $$\  $$$| $$      | $$\  $$$   | $$   /$$  \ $$
// | $$$$$$$/|  $$$$$$/ /$$$$$$| $$$$$$$$| $$$$$$$/      |  $$$$$$/|  $$$$$$/| $$ \/  | $$| $$      |  $$$$$$/| $$ \  $$| $$$$$$$$| $$ \  $$   | $$  |  $$$$$$/
// |_______/  \______/ |______/|________/|_______/        \______/  \______/ |__/     |__/|__/       \______/ |__/  \__/|________/|__/  \__/   |__/   \______/

var popupBodyWidth = 0,
	col12=0,
	col11=0,
	col10=0,
	col9=0,
	col8=0,
	col7=0,
	col6=0,
	col5=0,
	col4=0,
	col3=0,
	col2=0,
	col1=0
function showPopup(options){
	options = options==null?{}:options
	options.width = options.width==null?popupWidth:options.width
	options.height = options.height==null?popupHeight:options.height
	popupBodyWidth = options.width-20
	col12=popupBodyWidth
	col11=popupBodyWidth*(11/12)
	col10=popupBodyWidth*(10/12)
	col9=popupBodyWidth*(9/12)
	col8=popupBodyWidth*(8/12)
	col7=popupBodyWidth*(7/12)
	col6=popupBodyWidth*(6/12)
	col5=popupBodyWidth*(5/12)
	col4=popupBodyWidth*(4/12)
	col3=popupBodyWidth*(3/12)
	col2=popupBodyWidth*(2/12)
	col1=popupBodyWidth*(1/12)

	popupContainer.removeAllChildren()
	popupBody.removeAllChildren()
	popupButtons.removeAllChildren()
	var w = options.width
		h = options.height
	popupContainer.regX= options.x==null?w/2:0
	popupContainer.x= options.x==null?windowWidth/2:options.x
	popupContainer.y=options.y==null?30:options.y
	popupBody.x=10
	popupBody.y=10
	popupButtons.x=10
	popupButtons.y = h-50

	var popupBg = new Shape()
	popupBg.graphics.beginStroke(blue).ss(5).beginFill('rgba(0,0,0,1)')
		.rr(0,0,w,h,borderRadius)
	var popupTitle = new Text(makeCap(options.title),'18px '+font,'white')
	popupTitle.x=options.width/2
	popupTitle.y=borderRadius
	popupTitle.textAlign='center'
	popupTitle.baseLine='top'
	var closeButton = drawButton({x:options.width-35,y:borderRadius,label:'X',width:25,onClick:handleHidePopup})
	popupContainer.addChild(popupBg,popupBody,popupButtons,popupTitle)
	popupContainer.visible=false
	popupContainer.visible=true
}
function closePopup(){
	popupContainer.visible=false
}
function handleHidePopup(event){
	closePopup()
}
var planetInfoContainer = new Container()
function buildOrbitPopup(){	
	ship.enginesOn = false
	showPopup({title:'ORBIT',width: 800, height:800})
	var planet = new Shape(),
		planetType = planetTypes[currentPlanetType],
		oi = currentPlanetOrbitNumber,
		i = currentPlanetNumber,
		bw = buttonGroupWidth(780,10,4),
		leaveOrbitBtn = drawButton({x:0,y:0,label:'LEAVE ORBIT',width:bw,onClick:handleLeaveOrbitButtonClick}),
		scanPlanetBtn = drawButton({x:(bw+10)*1,y:0,label:'SCAN PLANET',width:bw,onClick:handleScanPlanetButtonClick}),
		reccomendPlanetBtn = drawButton({x:(bw+10)*2,y:0,label:'reccomend PLANET',width:bw,onClick:handleReccomendPlanetButtonClick}),
		selectSiteBtn = drawButton({x:(bw+10)*3,y:0,label:'select site',width:bw,onClick:handleReccomendPlanetButtonClick})
		pcx = col6,
		pcy = 400,
		pr = planetType.size*50,
		cp1x=pcx-(pr/1.5),
		cp1y=pcy-(pr/1.5),
		cp2x=pcx-(pr/1.5),
		cp2y=pcy+(pr/1.5),
		btx=pcx,
		bty=pcy+pr,
		lt1x=pcx-pr,
		lt1y=pcy+pr,
		lt2x=pcx-pr,
		lt2y=pcy-pr,
		lt3x=pcx,
		lt3y=pcy-pr,
		planets = game.stars[Math.floor(game.coordX)+'x'+Math.floor(game.coordY)].planetTypes,
		pColor = planetColors[game.planetTypes[planets[i]].color],
		planetTypeVal = returnText('Planet type: '+game.planetTypes[currentPlanetType].description,18,blue)
	planet.graphics
		//.beginRadialGradientFill(['#000','hsl('+pColor.h+','+pColor.s+'%,'+(pColor.l-((8-oi)*10))+'%)'],[0,1],pcx,pcy,pr,pcx,pcy,pr/4)
		.beginFill(planetType.color)
		.dc(pcx,pcy,planetType.size*50)
	planet.regX = pcx
	planet.regY = pcy
	planet.x=pcx
	planet.y=pcy
	planetInfoContainer.removeAllChildren()
	planetInfoContainer.addChild(planetTypeVal)
	planetInfoContainer.visible=false
	popupButtons.addChild(leaveOrbitBtn,scanPlanetBtn,reccomendPlanetBtn,selectSiteBtn)
	popupBody.addChild(planet,planetInfoContainer)
}
function handleReccomendPlanetButtonClick(event){

}
function handleScanPlanetButtonClick(event){
	planetInfoContainer.visible=true
}
function handleLeaveOrbitButtonClick(event){				
	closePopup()
	ship.enginesOn = true
	ship.status = isInSystem
	stage.update()
}
function buildOperations(mode,noticeIndex){
	mode=mode==null?'NOTICES':mode
	showPopup({title:'OPERATIONS'})
	if(mode=='NOTICES'){
		if(noticeIndex==null){
			for (var i = 0; i < starportNotices.length; i++) {
				var notice = starportNotices[i]
				if(notice.year <= game.date.year && notice.month <= game.date.month && notice.day <= game.date.day){
					var dateIssued = returnText(notice.day+'-'+notice.month+'-'+notice.year,12,'white'),
						desc = returnText('NOTICE',16,'white'),
						readBtn = drawButton({x:0,y:50+i*50,label:'READ',width:100,onClick:handleReadNoticeButtonClick,name:i})
					desc.x = col2
					desc.y=50+i*50
					dateIssued.textAlign='right'
					dateIssued.x=col12
					dateIssued.y=50+i*50					
					popupBody.addChild(readBtn,desc,dateIssued)
				}
			}
		}else{
			var notice = starportNotices[noticeIndex],
				note = new Text(notice.body,'16px '+font,'white')			
			note.lineWidth = 800-20
			popupBody.addChild(note)
		}
	}
	popupButtons.addChild(starPortButtons)
}
function handleReadNoticeButtonClick(event){
	buildOperations('NOTICES',parseInt(event.currentTarget.name))
}
function handleRaceSelectClick(event){
	var currentRace = event.currentTarget.name,
		currentRaceIndex = raceNames.indexOf(currentRace),
		nextRaceIndex = currentRaceIndex==raceNames.length-1?0:currentRaceIndex+1
	buildPersonelPopup(raceNames[nextRaceIndex])
}

var starField = new Container()		
for (var i = 0; i < 40; i++) {
	var star = new Shape()
	star.graphics.f('white').dc(rifi(5,doorWidth-5),rifi(5,(doorHeight*2)-5),rifi(1,2))
	starField.addChild(star)
}

var caution = new Text('CAUTION','40px lcd','rgba(0,255,255,0.5)')
//caution.filters = [blur(caution)]
var pressurizedArea = new Text('PRESSURIZED AREA','20px lcd','rgba(0,255,255,0.5)')
//pressurizedArea.filters = [blur(pressurizedArea)]
var standardAirlock = new Text('STANDARD AIRLOCK PROCEDURES APPLY','20px lcd','rgba(0,255,255,0.5)')
//standardAirlock.filters = [blur(standardAirlock)]
var proceduresApply = new Text('PROCEDURES APPLY','20px lcd','rgba(0,255,255,0.5)')
//proceduresApply.filters = [blur(proceduresApply)]
var countdownTimer = new Text('','80px lcd','rgba(255,255,255,0.5)')
//countdownTimer.filters = [blur(countdownTimer)]
//
for (var i = 0; i < 20; i++) {
	var x=rifi(10,doorWidth-10)
		y=rifi(10,doorHeight*2-10)
		l=rifi(5,30)
		dev=rifi(-2,2)
	scratches.push({x:x,y:y,x2:x+dev,y2:y+l})
}


warningLight.graphics
	.beginRadialGradientFill(['white','rgba(125,100,0,0.5)','rgba(0,0,0,0)'], [0,0.35,1], 0,0,0, 0,0, 100)
	.mt(-100,-300)
	.lt(-5,0)
	.lt(-100,300)
	.lt(100,300)
	.lt(5,0)
	.lt(100,-300).ef()
warningKlaxon.graphics
	.f('#222')
	.dc(0,0,20)
	// .f('#950')
	// .dc(0,0,15)
warningLight.x=600
warningLight.y=100
warningLight.visible=false
var warningLight2 = warningLight.clone()
warningLight2.x=200
warningKlaxon.x=600
warningKlaxon.y=100
function drawStarportDoors(){
	popupBody.removeAllChildren()
	var topDoor = new Shape(),
		topHalf = new Shape(),
		bottomDoor = new Shape(),
		floor = new Shape(),
		doorCont = new Container(),
		spotlight = new Shape(),
		signage = new Container(),
		signageBg = new Shape()

	signage.x=-110
	signage.y=-200
	spotlight.graphics.beginRadialGradientFill(['rgba(255,255,255,0)','rgba(0,0,0,0.8)'], [0, 1], doorWidth/2,50, 50, doorWidth/2,doorHeight, 200)
		// top door shadow
		.dr(0,0,doorWidth,doorHeight-doorOpening)
		// bottom door shadow
		.dr(0,doorHeight+doorOpening,doorWidth,doorHeight-doorOpening)
		//floor shadow
		.dr(-110,doorHeight*2,doorWidth+200,(doorHeight+18)-doorOpening)
		//.dr(0+(doorOpening/2),((doorHeight*2)+(doorHeight))-doorOpening,100,30)
		// roof shadow
		.dr(-110,-200,doorWidth+200,200)
	
	topDoor.graphics.beginStroke('#777').ss(5).beginFill('#888')
		.dr(0,0-doorOpening,doorWidth,doorHeight).ef()				
	
	topHalf.graphics
		.f('#000')
		.dr(-110,-200,doorWidth+200,200)
	
	bottomDoor.graphics.beginStroke('darkgrey').ss(3).beginFill('#888')					
		.dr(0,doorHeight+doorOpening,doorWidth,doorHeight)
	floor.graphics
		//.s('#555').ss(1)
		.f('#726a50')					
		.mt(-210,doorHeight*2+150)
		.lt(-20,doorHeight*2+20)
		.lt(doorWidth+20,doorHeight*2+20)
		.lt(190+doorWidth,doorHeight*2+150)
		.cp()
		.es()
		.s('#222').ss(10)
		.mt(0,doorHeight*2+155)
		.lt(100,doorHeight*2+50)
		.lt(250,doorHeight*2+50)
		.es()
		.s('#222').ss(10)
		.mt(350,doorHeight*2+50)
		.lt(500,doorHeight*2+50)
		.lt(600,doorHeight*2+155)
		.f('#877d5d')
		.dr(-20,doorHeight*2+10,doorWidth+40,10)
	
	for (var i = 0; i < scratches.length; i++) {
		var s =scratches[i]
		if(s.y<doorHeight){
			topDoor.graphics.beginStroke('#666').ss(1)
			.mt(s.x,s.y-doorOpening)
			.lt(s.x2,s.y2-doorOpening)//.cp()
		}				
		if(s.y>doorHeight){
			bottomDoor.graphics.beginStroke('#666').ss(1)
			.mt(s.x,s.y+doorOpening)
			.lt(s.x2,s.y2+doorOpening)//.cp()
		}
	}
	signageBg.graphics.f('#222').dr(0,0,80,40).f('#114').s('#222').ss(4).rr(-40,-100,160,90,8)
	signageBg.regX=40
	signageBg.x=400
	signageBg.y=160

	caution.x = 200
    caution.y = 60
    caution.textAlign='center'
    caution.textBaseLine = 'bottom'
    
	pressurizedArea.x = 210
    pressurizedArea.y = 110
    pressurizedArea.textAlign='center'
    pressurizedArea.textBaseLine = 'bottom'
    // 
	standardAirlock.x = 210
    standardAirlock.y = 150
    standardAirlock.textAlign='center'
    standardAirlock.textBaseLine = 'bottom'
    standardAirlock.lineWidth = 200
    standardAirlock.lineHeight = 20

	proceduresApply.x = 580
    proceduresApply.y = 170
    proceduresApply.textAlign='center'
    proceduresApply.textBaseLine = 'bottom'

    countdownTimer.x=400
    countdownTimer.y=70
    countdownTimer.visible=false
    countdownTimer.textAlign='center'
    countdownTimer.textBaseLine = 'middle'

    var startX = doorWidth/2,
    	startY = doorHeight
    var topLogo = drawLogoTop(startX,(startY-2)-doorOpening,'yellow',10,true,10)
    var bottomLogo = drawLogoBottom(startX,(startY+2)+doorOpening,'yellow',10,true,10)
    
    // standardAirlock.clip=new Graphics().dr(0,doorHeight,doorWidth,doorHeight)
    //proceduresApply.clip=new Graphics().dr(0,doorHeight,doorWidth,doorHeight)
	topLogo.clip=new Graphics().dr(0,0,doorWidth,doorHeight)
	topDoor.clip=new Graphics().dr(0,0,doorWidth,doorHeight)
    bottomDoor.clip=new Graphics().dr(0,doorHeight,doorWidth,doorHeight)
    bottomLogo.clip=new Graphics().dr(0,doorHeight,doorWidth,doorHeight)
    floor.clip=new Graphics().dr(-110,doorHeight*2,780,300)
    signage.addChild(signageBg,caution,pressurizedArea,standardAirlock,countdownTimer,warningLight,warningKlaxon)
    doorCont.addChild(starField,bottomDoor,bottomLogo,topHalf,topDoor,topLogo,floor,spotlight,signage)
    doorCont.regX=doorWidth/2
    doorCont.x=popupWidth/2
    doorCont.y=200
    popupBody.addChild(doorCont)
}
function buildDockingBayPopup(){
	showPopup({title:'STARPORT'})
	var sun = new Shape(),
		sunX = 300,
		sunY = 20
	sun.graphics
		.beginRadialGradientFill(['white','yellow','#000'], [0,0.5,1], sunX, sunY, 25,  sunX, sunY, 45)
		.dc(sunX,sunY,50)
			
	starField.addChild(sun)
	drawStarportDoors()
	var launchBtn = drawButton({x:10,y:10,label:'LAUNCH',width:106,onClick:handleLaunchButtonClick})
	if(doorOpening<10) popupBody.addChild(launchBtn)
	buildStatus()
	popupButtons.addChild(starPortButtons)
}
function handleLaunchButtonClick(event){			
	leaveStarPort()
}
function buildCargoPopup(){
	showPopup({title:'CARGO'})
	buildStatus()
	var cargoItems = Object.keys(ship.cargoHold),
		itemHead = returnText('ITEM',14,blue),
		volumeHead = returnText('VOLUME',14,blue),
		valueHead = returnText('VALUE',14,blue)
	volumeHead.x=col8
	valueHead.x=col10
	popupBody.addChild(itemHead,volumeHead,valueHead)
	for (var i = 0; i < cargoItems.length; i++) {
		var item = ship.cargoHold[cargoItems[i]],
			itemLabel = returnText(cargoItems[i],12,'white'),
			itemMass = returnText(item.mass,12,'white'),
			itemValue = returnText(elementValues[cargoItems[i]],12,'white')
		itemLabel.y=i*15+25
		itemMass.x=col8
		itemValue.x=col10
		itemMass.y=i*15+25
		itemValue.y=i*15+25
		popupBody.addChild(itemLabel,itemMass,itemValue)
	}
}
function buildTradeDepotPopup(){
	showPopup({title:'TRADE DEPOT'})
	popupButtons.addChild(starPortButtons)
}			
function buildCommsPopup(){
	showPopup({title:'communications'})
	var bw = buttonGroupWidth(780,10,2),
		commScreen = new Shape(),
		commAlienCommsContainer = new Container(),
		commDialogScreen = new Shape(),
		commDialogScreenContainer = new Container(),
		bw = buttonGroupWidth(780,10,4),
		statementButton = drawButton({width:bw,label:'statement',onClick:handleStatementButtonClick}),
		questionButton = drawButton({x:bw+10,width:bw,label:'question',onClick:handleQuestionButtonClick}),
		postureButton = drawButton({x:bw*2+20,width:bw,label:'posture',onClick:handlePostureButtonClick}),
		terminateButton = drawButton({x:bw*3+30,width:bw,label:'terminate',onClick:handleTerminateButtonClick})

	commScreen.graphics.s(blue).ss(borderWidth).rr(0,40,780,480,borderRadius)
	commDialogScreen.graphics.s(blue).ss(borderWidth).rr(0,530,780,200,borderRadius)
	
	for (var i = 0; i < commsTextArray.length; i++) {
		var text = commsTextArray[i]		
		var commsText = new Text(text,'18px '+font,'white')
		// console.log('commsText',commsText.getMetrics())
		commsText.x=5
		commsText.y=5+(i*22)
		commsText.lineWidth = 760
		commDialogScreenContainer.addChild(commsText)
	}
	commDialogScreenContainer.x=10
	commDialogScreenContainer.y=530
	commAlienCommsContainer.x=10
	commAlienCommsContainer.y=50
	commAlienCommsContainer.addChild(drawSpeminCommScreen())
	popupButtons.addChild(statementButton,questionButton,postureButton,terminateButton)
	popupBody.addChild(commScreen,commDialogScreen,commDialogScreenContainer,commAlienCommsContainer)
}		
function handleDistressCallButtonClick(event){
		//console.log('TODO: SEND DISTRESS SIGNAL')
		increaseFuel(20)
		buildStatus()
		addTextToDialog('Sorry Sir, we don\'t have a distress signal yet.')
		closePopup()
		//buildShipViewScreen()
}
function buildEngineeringPopup(){
	showPopup({title:'TRADE DEPOT'})
}		
function buildMedicalPopup(){
	showPopup({title:'TRADE DEPOT'})
}

function buildShipConfigPopup(part){
	var shipBuildout = {
		'ENGINES':{class:ship.engineClass,max:ship.class.engineClassMax},
		'SHIELDS':{class:ship.shieldClass,max:ship.class.shieldClassMax},
		'ARMOR':{class:ship.armorClass,max:ship.class.armorClassMax},
		'LASERS':{class:ship.laserClass,max:ship.class.laserClassMax},
		'MISSILES':{class:ship.missileClass,max:ship.class.missileClassMax},
		'PLASMA':{class:ship.plasmaClass,max:ship.class.plasmaClassMax},
		'CARGO PODS':{class:1,max:ship.class.cargoPodsMax},
		'JUMP PODS'	:{class:1,max:ship.class.jumpPodsMax},
		'BLASTO PODS':{class:1,max:ship.class.blastoPodsMax}
	}
	part=part==null?'ENGINES':part
	showPopup({title:'SHIP CONFIG'})
	popupButtons.addChild(starPortButtons)
	buildStatus()
	var shipFramework = drawShip({
		drawShields:true,
		drawWeapons:true,
		drawPods:true,
		scale:4.5,
		lod:3,
		animateShields:true
	})
	var classHead= returnText(part,20,blue),
		sellHead= returnText('SELL',14,blue),
		buyHead= returnText('Buy',14,blue),					
		
		partCosts = shipConfigCosts[part],
		parts = Object.keys(shipConfigCosts),

		moneyVal = returnText('YOUR ACCOUNT BALANCE IS: '+game.money+' MU',16,'white')
	classHead.textAlign='center'
	classHead.x=780/2
	sellHead.x=350
	buyHead.x=420
	var partsTableContainer = new Container()
	partsTableContainer.y=80
	// partsTableContainer.addChild(classHead,sellHead,buyHead,moneyVal)
	partsTableContainer.addChild(classHead)
	popupBody.addChild(partsTableContainer,moneyVal,shipFramework)

	for (var i = 0; i < parts.length; i++) {
		btn = drawButton({x:0,y:i*50,label:parts[i],width:120,onClick:handleSelectClick})
		if(shipBuildout[parts[i]].max>0) partsTableContainer.addChild(btn)
	}

	for (var i = 0; i < partCosts.length; i++) {
		var yVal=50+(i*50)
			classLabel = returnText('Class '+(i+1)+' ',14,'white'),
			sellPriceVal = returnText(partCosts[i]*0.8,12,'white'),
			buyPriceVal = returnText(partCosts[i],12,'white'),

			buyButton = drawButton({x:250,y:yVal-10,label:'BUY for '+partCosts[i]+' MU',width:200,onClick:handleBuyClick,name:part+'-'+(i+1)}),
			sellButton = drawButton({x:250,y:yVal-10,label:'SELL for '+partCosts[i]*0.8+' MU',width:200,onClick:handleSellClick,name:part+'-'+(i+1)}),

		classLabel.x=170 //230
		sellPriceVal.x=350
		buyPriceVal.x=420
		classLabel.y=yVal
		sellPriceVal.y=yVal
		buyPriceVal.y=yVal
		partsTableContainer.addChild(classLabel)
		if(part.split(' ').length==1){
			if(shipBuildout[part].class==(i+1)){
				// partsTableContainer.addChild(sellPriceVal,sellButton)
				partsTableContainer.addChild(sellButton)
			}else if(shipBuildout[part].class==0){
				// partsTableContainer.addChild(buyPriceVal,buyButton)
				partsTableContainer.addChild(buyButton)
			}
		}else{ 
			sellButton.x=480
			//partsTableContainer.addChild(sellPriceVal,sellButton,buyPriceVal,buyButton)
			partsTableContainer.addChild(sellButton,buyButton)
		}
	}
	shipFramework.y=550
	shipFramework.x=400
	shipFramework.regX=50
	shipFramework.regY=70
	shipFramework.rotation=90
	moneyVal.y=50
	// moneyVal.x=480

}
function handleBuyClick(event){
	var part = event.currentTarget.name.split('-')[0],
		classNumber = event.currentTarget.name.split('-')[1],
		doCashTrasfer = false

	if(part=='ENGINES'){
		ship.engineClass=classNumber
		doCashTrasfer=true
	}else if(part=='SHIELDS'){
		ship.shieldClass=classNumber
		doCashTrasfer=true
	}else if(part=='ARMOR'){
		ship.armorClass=classNumber
		doCashTrasfer=true
	}else if(part=='LASERS'){
		ship.laserClass=classNumber
		doCashTrasfer=true
	}else if(part=='MISSILES'){
		ship.missileClass=classNumber
		doCashTrasfer=true
	}else if(part=='PLASMA'){
		ship.plasmaClass=classNumber
		doCashTrasfer=true
	}else if(part=='CARGO PODS'){
		if(ship.cargoPods<ship.class.cargoPodsMax){
			ship.cargoPods++
			doCashTrasfer=true
		}
	}else if(part=='JUMP PODS'){
		if(ship.jumpPods<ship.class.jumpPodsMax){
			ship.jumpPods++
			doCashTrasfer=true
		}
	}else if(part=='BLASTO PODS'){
		if(ship.blastoPods<ship.class.blastoPodsMax){
			ship.blastoPods++
			doCashTrasfer=true
		}
	}

	if(doCashTrasfer){
		game.money -= shipConfigCosts[part][classNumber-1]
		buildShipConfigPopup(part)
	}
}
function handleSellClick(event){
	var part = event.currentTarget.name.split('-')[0],
		classNumber = event.currentTarget.name.split('-')[1],
		doCashTrasfer = false

	if(part=='ENGINES'){
		ship.engineClass=0
		doCashTrasfer=true
	}else if(part=='SHIELDS'){
		ship.shieldClass=0
		doCashTrasfer=true
	}else if(part=='ARMOR'){
		ship.armorClass=0
		doCashTrasfer=true
	}else if(part=='LASERS'){
		ship.laserClass=0
		doCashTrasfer=true
	}else if(part=='MISSILES'){
		ship.missileClass=0
		doCashTrasfer=true
	}else if(part=='PLASMA'){
		ship.plasmaClass=0
		doCashTrasfer=true
	}else if(part=='CARGO PODS'){
		if(ship.cargoPods>1){
			ship.cargoPods--
			doCashTrasfer=true
		}
	}else if(part=='JUMP PODS'){
		if(ship.jumpPods>0){
			ship.jumpPods--
			doCashTrasfer=true
		}
	}else if(part=='BLASTO PODS'){
		if(ship.blastoPods>0){
			ship.blastoPods--
			doCashTrasfer=true
		}
	}
	if(doCashTrasfer){
		game.money += shipConfigCosts[part][classNumber-1]*0.8
		buildShipConfigPopup(part)
	}
}

function handleupgradeEngineClick(event){
	var partClass = event.currentTarget.name
	
	game.money += shipConfigCosts.engines[ship.engineClass-1]*0.8
	ship.engineClass = parseInt(partClass.split(' ')[1])
	game.money -= shipConfigCosts.engines[ship.engineClass-1]
	buildShipConfigPopup('ENGINE')

}
function handleSelectClick(event){
	var part = event.currentTarget.name
	buildShipConfigPopup(part)
}
function buildPersonelPopup(race){
	showPopup({title:'CREW',height:800})
	popupButtons.addChild(starPortButtons)
	buildStatus()
	var raceInfo = personelRaces[race],
		raceInfoFontSize = 16,

		vitalityLabel = returnText('VITALITY:',raceInfoFontSize,blue),
		raceLabel = returnText('RACE:',raceInfoFontSize,blue),
		durabilityLabel = returnText('DURABILITY:',raceInfoFontSize,blue),
		learningRateLabel = returnText('LEARNING RATE:',raceInfoFontSize,blue),
		
		vitalityVal = returnText('100%',raceInfoFontSize,'white'),
		raceVal = drawButton({x:0,y:0,label:race,width:80,onClick:handleRaceSelectClick,height:20}), //returnText(race,raceInfoFontSize,'white'),
		durabilityVal = returnText(raceInfo.durability,raceInfoFontSize,'white'),
		learningRateVal = returnText(raceInfo.learningRate,raceInfoFontSize,'white'),
	
		scienceLabel = returnText('SCIENCE:',raceInfoFontSize,blue),
		navigationLabel = returnText('NAVIGATION:',raceInfoFontSize,blue),
		engineeringLabel = returnText('ENGINEERING:',raceInfoFontSize,blue),
		communicationsLabel = returnText('COMMUNICATIONS:',raceInfoFontSize,blue),
		medicineLabel = returnText('MEDICINE:',raceInfoFontSize,blue),

		scienceVal = returnText(raceInfo.science.min,raceInfoFontSize,'white'),
		navigationVal = returnText(raceInfo.navigation.min,raceInfoFontSize,'white'),
		engineeringVal = returnText(raceInfo.engineering.min,raceInfoFontSize,'white'),
		communicationsVal = returnText(raceInfo.communications.min,raceInfoFontSize,'white'),
		medicineVal = returnText(raceInfo.medical.min,raceInfoFontSize,'white'),

		typeLabel = returnText('TYPE:',raceInfoFontSize,blue),
		heightLabel = returnText('AVERAGE HEIGHT:',raceInfoFontSize,blue),
		weightLabel = returnText('AVERAGE WEIGHT:',raceInfoFontSize,blue),

		typeVal = returnText(raceInfo.type,raceInfoFontSize,'white'),
		heightVal = returnText(raceInfo.height+' M',raceInfoFontSize,'white'),
		weightVal = returnText(raceInfo.weight+' KG',raceInfoFontSize,'white'),

		statsValsX = 140,
		skillsValsX = 165,
		valY = 20

	vitalityLabel.y=0
	raceLabel.y=valY
	durabilityLabel.y=valY*2
	learningRateLabel.y=valY*3

	vitalityVal.x=statsValsX
	vitalityVal.y=0
	raceVal.x=statsValsX
	raceVal.y=valY
	durabilityVal.x=statsValsX
	durabilityVal.y=valY*2
	learningRateVal.x=statsValsX
	learningRateVal.y=valY*3

	scienceLabel.y=0
	navigationLabel.y=valY
	engineeringLabel.y=valY*2
	communicationsLabel.y=valY*3
	medicineLabel.y=valY*4

	scienceVal.x=skillsValsX
	navigationVal.x=skillsValsX
	engineeringVal.x=skillsValsX
	communicationsVal.x=skillsValsX
	medicineVal.x=skillsValsX
	scienceVal.y=0
	navigationVal.y=valY
	engineeringVal.y=valY*2
	communicationsVal.y=valY*3
	medicineVal.y=valY*4

	typeLabel.y=0
	heightLabel.y=valY
	weightLabel.y=valY*2
	typeVal.y=0
	heightVal.y=valY
	weightVal.y=valY*2
	typeVal.x=skillsValsX
	heightVal.x=skillsValsX
	weightVal.x=skillsValsX

	var skillsContainer = new Container(),
		statsContainer = new Container(),
		infoContainer = new Container(),
		raceBodyContainer = drawCreatureBody(race),
		raceBodyBg = new Shape(),
		bgScale = 1.5
	raceBodyBg.graphics.beginStroke('black').ss(1).f('white')
		.dr(0,0,300*bgScale,360*bgScale)
		.mt(0,50*bgScale).lt(300*bgScale,50*bgScale)
		.mt(0,100*bgScale).lt(300*bgScale,100*bgScale)
		.mt(0,150*bgScale).lt(300*bgScale,150*bgScale)
		.mt(0,200*bgScale).lt(300*bgScale,200*bgScale)
		.mt(0,250*bgScale).lt(300*bgScale,250*bgScale)
		.mt(0,300*bgScale).lt(300*bgScale,300*bgScale)
		.mt(0,350*bgScale).lt(300*bgScale,350*bgScale)
	raceBodyBg.regX = (300*bgScale)
	raceBodyBg.regY = 360*bgScale
	raceBodyBg.x=780
	raceBodyBg.y=730
	raceBodyContainer.regX = 50
	raceBodyContainer.regY = 120
	raceBodyContainer.x=600
	raceBodyContainer.y=725
	raceBodyContainer.scaleX = raceInfo.height*bgScale//raceInfo.height*bgScale
	raceBodyContainer.scaleY = raceInfo.height*bgScale//raceInfo.height*bgScale
	statsContainer.y=150 //x=250
	infoContainer.y=300 //150

	skillsContainer.addChild(scienceLabel,navigationLabel,engineeringLabel,communicationsLabel,medicineLabel,scienceVal,navigationVal,engineeringVal,communicationsVal,medicineVal)
	statsContainer.addChild(vitalityLabel,vitalityVal,raceLabel,durabilityLabel,learningRateLabel,raceVal,durabilityVal,learningRateVal)
	infoContainer.addChild(typeLabel,heightLabel,weightLabel,typeVal,heightVal,weightVal)
	popupBody.addChild(raceBodyBg,skillsContainer,statsContainer,infoContainer,raceBodyContainer)
}
function buildStatus(){
	//console.log("buildStatus")
	var statusContainer = new Container(),
		fontSize = '14px',
		meterWidth = 15
	var statusTitle = new Text('SHIP STATUS','16px '+font,'white')
	statusTitle.x=15
	statusTitle.y=5

	var data1 = new Text(game.date.day+'.'+game.date.hour+'-'+game.date.month+'-'+game.date.year,fontSize+' '+font,blue)
	data1.x=sideBarWidth - 15
	data1.y=5
	data1.textAlign = 'right'

	var data2 = new Text(ship.shieldClass>0?'CLASS '+ship.shieldClass+' SHIELDS':'- EMPTY -',fontSize+' '+font,ship.shieldsUp&&ship.shieldClass>0?'red':grey)
	data2.x=sideBarWidth - 15
	data2.y=20
	data2.textAlign = 'right'

	var data3 = new Text(ship.laserClass>0?'CLASS '+ship.laserClass+' LASER':'- EMPTY -',fontSize+' '+font,ship.weaponsArmed&&ship.laserClass>0?'red':grey)
	data3.x=sideBarWidth - 15
	data3.y=35
	data3.textAlign = 'right'

	var data4 = new Text(ship.missileClass>0?'CLASS '+ship.missileClass+' MISSiLE':'- EMPTY -',fontSize+' '+font,ship.weaponsArmed&&ship.missileClass>0?'red':grey)
	data4.x=sideBarWidth - 15
	data4.y=50
	data4.textAlign = 'right'

	var data5 = new Text(ship.plasmaClass>0?'CLASS '+ship.plasmaClass+' PLASMA':'- EMPTY -',fontSize+' '+font,ship.weaponsArmed&&ship.plasmaClass>0?'red':grey)
	data5.x=sideBarWidth - 15
	data5.y=65
	data5.textAlign = 'right'

	var data6 = new Text('- EMPTY -',fontSize+' '+font,grey)
	data6.x=sideBarWidth - 15
	data6.y=80
	data6.textAlign = 'right'

	var data7 = new Text('- EMPTY -',fontSize+' '+font,grey)
	data7.x=sideBarWidth - 15
	data7.y=95
	data7.textAlign = 'right'

	var data8 = new Text('CLASS '+ship.engineClass+' ENGINES',fontSize+' '+font,blue)//Text('',fontSize+' '+font,blue)
	data8.x=sideBarWidth - 15
	data8.y=110
	data8.textAlign = 'right'

	var data9 = new Text('FUEL: '+shipFuelVal(),fontSize+' '+font,shipFuelVal()>10?blue:shipFuelVal()>5?'orange':'red')//Text('',fontSize+' '+font,blue)
	data9.x=sideBarWidth - 15
	data9.y=125
	data9.textAlign = 'right'


	var shipContainer = new Container()
	shipContainer.x = 10
	shipContainer.y = 5//40
	var shipShape = drawShip({
		drawShields:true,
		drawWeapons:true,
		drawPods:true,
		scale:1.4,
		lod:3,
		animateShields:true
	})
	shipShape.x = 160
	shipShape.y = 190
	shipShape.regX = 50
	shipShape.regY = 60
	shipShape.rotation=90
	var meterY = 0,
		shieldBar = drawMeter('S','red','grey',ship.shieldsVal,meterWidth)
		armorBar = drawMeter('A','yellow','grey',ship.armorVal,meterWidth)
		fuelBar = drawMeter('F',blue,shipFuelVal()>10?'grey':shipFuelVal()>5?'orange':'red',(shipFuelVal()/(ship.cargoPods*cargoPodStorageCapacity))*100,meterWidth)
		cargoBar = drawMeter('C',grey,'grey',(shipCargoAmt()/(ship.cargoPods*cargoPodStorageCapacity))*100,meterWidth)
	// var damageBar = drawMeter('H','green','grey',(ship.hp/ship.hpMax)*100,meterWidth)
	shieldBar.y = meterY
	armorBar.x = meterWidth+10
	armorBar.y = meterY
	fuelBar.x = armorBar.x*2
	fuelBar.y = meterY
	cargoBar.x = armorBar.x*3
	cargoBar.y = meterY
	// damageBar.x = armorBar.x*4
	shipContainer.addChild(shipShape,shieldBar,armorBar,fuelBar,cargoBar) //,damageBar)
	statusContainer.addChild(shipContainer,data1,data2,data3,data4,data5,data6,data7,data8,data9)

	if(utilityScreenContainer.children.length>1) utilityScreenContainer.removeChildAt(1)
	utilityScreenContainer.addChild(statusContainer)
}
function handleToggleShieldsButtonClick(){
	//console.log('TODO: YELLOW ALERT')		
	var reply = ''
	if(ship.shieldClass>0){
			console.log("isInNebula", isInNebula);
		if(!isInNebula){
			reply = 'Yes sir,'
			ship.shieldsUp = !ship.shieldsUp
			if(ship.shieldsUp){
				reply+=' raising shields.'	
				burnFuel(0.1)
			}else{
				reply+=' lowering shields.'	
			}
		}else{
			reply = 'We cannot raise shields in nebulas.'
		}
	}else{
		reply = 'We have No shields sir.'
	}
	buildStatus()
	addTextToDialog(reply)
	buildShipViewScreen()
}
function handleToggleWeaponsButtonClick(){
	//console.log('TODO: RED ALERT')
	var reply = ''
	if(ship.laserClass>0||ship.missileClass>0||ship.plasmaClass>0){
		reply = 'Yes Sir,'
		ship.weaponsArmed = !ship.weaponsArmed
		if(ship.weaponsArmed){
			reply += ' weapons armed!'
		}else{
			reply += ' weapons disarmed!'
		}					
	}
	buildStatus()
	addTextToDialog(reply)
	buildShipViewScreen()
}

//  /$$$$$$$  /$$   /$$ /$$$$$$ /$$       /$$$$$$$         /$$$$$$  /$$$$$$$$ /$$$$$$  /$$$$$$$         /$$$$$$  /$$     /$$ /$$$$$$  /$$$$$$$$ /$$$$$$$$ /$$      /$$
// | $$__  $$| $$  | $$|_  $$_/| $$      | $$__  $$       /$$__  $$|__  $$__//$$__  $$| $$__  $$       /$$__  $$|  $$   /$$//$$__  $$|__  $$__/| $$_____/| $$$    /$$$
// | $$  \ $$| $$  | $$  | $$  | $$      | $$  \ $$      | $$  \__/   | $$  | $$  \ $$| $$  \ $$      | $$  \__/ \  $$ /$$/| $$  \__/   | $$   | $$      | $$$$  /$$$$
// | $$$$$$$ | $$  | $$  | $$  | $$      | $$  | $$      |  $$$$$$    | $$  | $$$$$$$$| $$$$$$$/      |  $$$$$$   \  $$$$/ |  $$$$$$    | $$   | $$$$$   | $$ $$/$$ $$
// | $$__  $$| $$  | $$  | $$  | $$      | $$  | $$       \____  $$   | $$  | $$__  $$| $$__  $$       \____  $$   \  $$/   \____  $$   | $$   | $$__/   | $$  $$$| $$
// | $$  \ $$| $$  | $$  | $$  | $$      | $$  | $$       /$$  \ $$   | $$  | $$  | $$| $$  \ $$       /$$  \ $$    | $$    /$$  \ $$   | $$   | $$      | $$\  $ | $$
// | $$$$$$$/|  $$$$$$/ /$$$$$$| $$$$$$$$| $$$$$$$/      |  $$$$$$/   | $$  | $$  | $$| $$  | $$      |  $$$$$$/    | $$   |  $$$$$$/   | $$   | $$$$$$$$| $$ \/  | $$
// |_______/  \______/ |______/|________/|_______/        \______/    |__/  |__/  |__/|__/  |__/       \______/     |__/    \______/    |__/   |________/|__/     |__/


var screen = new Shape(),
	ss = new Shape()
function buildStarSystem(scale,x,y){
	console.log("x", x)
	console.log("y", y)
	// console.log("buildStarSystem")			
	// console.log("scale", scale)
	planetsInCurrentSystem=[]
	if(scale==systemMapScale){
		starSystemMapContainer.removeAllChildren()
	}else{
		starSystemContainer.removeAllChildren()
	}
	game.coordX = Math.floor(game.coordX)
	game.coordY = Math.floor(game.coordY)
	console.log("game.coordX", game.coordX)
	console.log("game.coordY", game.coordY)
	var star = new Shape(),
		starInfo = game.stars[game.coordX+'x'+game.coordY],
		starSystemRadius = ((sideBarWidth-5)*scale)/2,
		planets = starInfo.planetTypes,
		orbits = starInfo.orbits,
		//orbitDist = scale==systemMapScale?17:25,
		i = 0

		console.log("starSystemRadius", starSystemRadius)
		console.log("orbitRadius", (8*17)*scale)

	
	star.graphics
		.beginRadialGradientFill([spectralClasses[starInfo.spectralClass],'rgba(0,0,0,0)'], [0, 1], starSystemRadius, starSystemRadius, (8*spectralClassSize[starInfo.spectralClass])*scale, starSystemRadius, starSystemRadius, (10*spectralClassSize[starInfo.spectralClass])*scale)
		.dc(
			starSystemRadius,
			starSystemRadius,
			(10*spectralClassSize[starInfo.spectralClass])*scale
		).ef()
	star.name='sun'
	for(var ssi = 0; ssi < 5; ssi++){
		//var sunspot = new Shape(),
			cx = rifi(starSystemRadius - (2*scale),starSystemRadius + (2*scale))
			cy = rifi(starSystemRadius - (2*scale),starSystemRadius + (2*scale))
			r = rifi(3,10)
		if(scale > systemMapScale) star.graphics.beginRadialGradientFill(['black','rgba(0,0,0,0)'],[0,1],cx,cy,r/2,cx,cy,r)
			.dc(cx,cy,r).ef()
	}
	for (var oi = 0; oi < orbits.length; oi++) {
		if(orbits[oi]){
			var planet = new Shape(),
				orbitRadius = ((8-oi)*17)*scale //((8-oi)*orbitDist)*scale,
				pcx = starSystemRadius-orbitRadius,
				pcy = starSystemRadius,
				pr = scale==systemMapScale?4:(game.planetTypes[planets[i]].size*scale)/2,
				cp1x=pcx-(pr/1.5),
				cp1y=pcy-(pr/1.5),
				cp2x=pcx-(pr/1.5),
				cp2y=pcy+(pr/1.5),
				btx=pcx,
				bty=pcy+pr,
				lt1x=pcx-pr,
				lt1y=pcy+pr,
				lt2x=pcx-pr,
				lt2y=pcy-pr,
				lt3x=pcx,
				lt3y=pcy-pr

			// if(scale==systemMapScale){
				planet.graphics.beginStroke('grey').ss(1)
					// orbit
					.dc(
						starSystemRadius,
						starSystemRadius,
						orbitRadius
					).es()
			// }
			// planet
			planetsInCurrentSystem.push(game.planetTypes[planets[i]])	

			var pColor = planetColors[game.planetTypes[planets[i]].color]			
			if(scale == systemMapScale){
				planet.graphics.beginFill(game.planetTypes[planets[i]].color)
					.dc(
						pcx,
						pcy,
						pr
					).ef()
			}else{
				
				planet.graphics
					// .f(game.planetTypes[planets[i]].color).s('black').ss(1)
					// .beginRadialGradientFill(['rgb(0,0,0)','hsl('+pColor.h+','+pColor.s+'%,'+(pColor.l-((8-oi)*10))+'%)'],[0,1],pcx,pcy,pr+2,pcx+(pr/2),pcy,pr/4) 
					.beginRadialGradientFill(['rgb(0,0,0)','hsl('+pColor.h+','+pColor.s+'%,'+(80-((8-oi)*10))+'%)'],[0,1],pcx,pcy,pr+2,pcx+(pr/2),pcy,pr/4) 
					// .beginRadialGradientFill(['rgb(0,0,0)',game.planetTypes[planets[i]].color,'hsl('+pColor.h+','+pColor.s+'%,'+(80-((8-oi)*10))+'%)'],[0,0.2,1],pcx,pcy,pr-2,pcx+(pr/2),pcy,pr/6) 
					// .beginRadialGradientFill(['rgb(0,0,0)','rgba(0,0,0,0)'],[0,1],pcx+(pr/4),pcy,pr,pcx+(pr/2),pcy,pr/4) 
					.dc(
						pcx,
						pcy,
						pr
					).ef()
			}
			// planet.graphics
			// 	.f(game.planetTypes[planets[i]].color)
			// 	.dc(
			// 		pcx,
			// 		pcy,
			// 		pr
			// 	).ef()
			// nightside
			// if(scale>systemMapScale){
			// 	planet.graphics.beginFill('rgba(0,0,0,0.5)')
			// 		.mt(lt3x,lt3y)
			// 		.bt(cp1x,cp1y,cp2x,cp2y,btx,bty)
			// 		.lt(lt1x,lt1y)
			// 		.lt(lt2x,lt2y)
			// 		.lt(lt3x,lt3y)
			// 		.ef()
			// }
			planet.regX=starSystemRadius
			planet.regY=starSystemRadius
			planet.rotation=((game.date.day+((game.date.month-1)*30))*(i/3))*((oi+game.planetTypes[planets[i]].size)*planets[i])
			planet.x=starSystemRadius
			planet.y=starSystemRadius
			planet.name='planet '+oi+'-'+i
			planet.id=planets[i]
			if(scale==systemMapScale)
				starSystemMapContainer.addChild(planet)
			else
				starSystemContainer.addChild(planet)
			i++
		}
		
	}
 	var dust = new Shape()
	dust.graphics
		.beginRadialGradientFill([spectralClasses[starInfo.spectralClass],'rgba(0,0,0,0)'],[0,1],starSystemRadius,starSystemRadius,10,starSystemRadius,starSystemRadius,starSystemRadius) 
		//.f(spectralClasses[starInfo.spectralClass])
		.dc(
			starSystemRadius,
			starSystemRadius,
			starSystemRadius
		)
	dust.alpha=starInfo.nextFlareInDays>1000?0.5:0.1
	dust.name='dust'
	dust.mouseEnabled = false
	
	if(scale==systemMapScale)
		starSystemMapContainer.addChild(dust)
	else
		starSystemContainer.addChild(dust)
	
	if(starInfo.nextFlareInDays>1000 && scale>1){
		for (var di = 0; di < 2000; di++) {
			var debris = new Shape()
			debris.graphics
				.f(spectralClasses[starInfo.spectralClass])
				.dc(
					rifi(0,((8*17)*2)*scale),
					rifi(0,((8*17)*2)*scale),
					rifi(2,10)
				)
			debris.alpha=0.5
			debris.name = 'debris'
			starSystemContainer.addChild(debris)
		}
		
	}
	screen.graphics.beginStroke('white').dr(100,100,windowWidth/50,windowHeight/50)
	ss.graphics.beginStroke('blue').dr(100,100,(starSystemRadius*2)/50,(starSystemRadius*2)/50)
	if(scale==systemMapScale){
		// youAreHere.x = systemX/20 //(starSystemRadius*2)+(-1*(systemX/20))
		// youAreHere.y = systemY/20 //(starSystemRadius*2)+systemY/20
		youAreHere.regX = 50
		youAreHere.regY = 70
		youAreHere.rotation = ship.orientation
		starSystemMapContainer.addChild(star, youAreHere)	
		if(utilityScreenContainer.children.length>1) utilityScreenContainer.removeChildAt(1)
		utilityScreenContainer.addChild(starSystemMapContainer)
	}else{
		youAreHere.x = -1*(x/systemScale) //(starSystemRadius*2)+(-1*(systemX/20))
		youAreHere.y = -1*(y/systemScale)
		starSystemContainer.addChild(star)	
		//var largestOrbitRadius = (8*17)*scale
		starSystemContainer.x = x +(windowWidth/2)//==0?(windowWidth/2)-starSystemRadius:x
		starSystemContainer.y = y +(windowHeight/2)//==0?(windowHeight/2)-starSystemRadius:y	
		// console.log("starSystemContainer.x", starSystemContainer.x)				
		// console.log("starSystemContainer.y", starSystemContainer.y)
		ss.x = (x+(windowWidth/2))/50
		ss.y = (y+(windowHeight/2))/50
		starsContainer.removeAllChildren()
		starsContainer.addChild(starSystemContainer)
		if(debug)starsContainer.addChild(screen,ss)
	}
}
function dialog(text){
	var dialogText = new Text(text,'12px '+font,'white')
	dialogScreenContainer.removeChildAt(1)
	dialogScreenContainer.addChild(dialogText)
}

//  /$$$$$$$  /$$$$$$$   /$$$$$$  /$$      /$$       /$$$$$$$$ /$$   /$$ /$$   /$$  /$$$$$$  /$$$$$$$$ /$$$$$$  /$$$$$$  /$$   /$$  /$$$$$$
// | $$__  $$| $$__  $$ /$$__  $$| $$  /$ | $$      | $$_____/| $$  | $$| $$$ | $$ /$$__  $$|__  $$__/|_  $$_/ /$$__  $$| $$$ | $$ /$$__  $$
// | $$  \ $$| $$  \ $$| $$  \ $$| $$ /$$$| $$      | $$      | $$  | $$| $$$$| $$| $$  \__/   | $$     | $$  | $$  \ $$| $$$$| $$| $$  \__/
// | $$  | $$| $$$$$$$/| $$$$$$$$| $$/$$ $$ $$      | $$$$$   | $$  | $$| $$ $$ $$| $$         | $$     | $$  | $$  | $$| $$ $$ $$|  $$$$$$
// | $$  | $$| $$__  $$| $$__  $$| $$$$_  $$$$      | $$__/   | $$  | $$| $$  $$$$| $$         | $$     | $$  | $$  | $$| $$  $$$$ \____  $$
// | $$  | $$| $$  \ $$| $$  | $$| $$$/ \  $$$      | $$      | $$  | $$| $$\  $$$| $$    $$   | $$     | $$  | $$  | $$| $$\  $$$ /$$  \ $$
// | $$$$$$$/| $$  | $$| $$  | $$| $$/   \  $$      | $$      |  $$$$$$/| $$ \  $$|  $$$$$$/   | $$    /$$$$$$|  $$$$$$/| $$ \  $$|  $$$$$$/
// |_______/ |__/  |__/|__/  |__/|__/     \__/      |__/       \______/ |__/  \__/ \______/    |__/   |______/ \______/ |__/  \__/ \______/

function drawCreatureBody(race){
	if(race == 'HUMAN')
		return drawHumanBody()
	else if(race=='VELOX')
		return drawVeloxBody()
	else if(race == 'THRYNN')
		return drawThrynnBody()
	else if(race == 'ELOWAN')
		return drawElowanBody()
	else if(race == 'ANDROID')
		return drawAndroidBody()
}

function blur(s){
    var blurFilter = new createjs.BlurFilter(4, 4, 2)
    s.filters = [blurFilter]
    var bounds = blurFilter.getBounds()
    s.cache(-200+bounds.x, -200+bounds.y, 2000+bounds.width, 2000+bounds.height)
}
function drawLogo(startX,startY,color,scale,outline){
	var top = drawLogoTop(startX,startY,color,scale,outline),
		bottom = drawLogoBottom(startX,startY,color,scale,outline)
	var cont = new Container()
	cont.addChild(top,bottom)	

	return cont
}

function drawCursor(x,y){
	var gapSize=5,spokeLength=15+gapSize
	cursor.graphics
		.beginStroke('white').mt(0,-gapSize).lt(0,-spokeLength).es()
		.beginStroke('white').mt(gapSize,0).lt(spokeLength,0).es()
		.beginStroke('white').mt(0,gapSize).lt(0,spokeLength).es()
		.beginStroke('white').mt(-gapSize,0).lt(-spokeLength,0).es()
	cursor.rotation=45
	cursor.x=-100
	cursor.y=-100
}

function drawLogoTop(startX,startY,color,scale,outline){
	var topLogo = new Shape()
    topLogo.graphics.beginStroke('#444').ss(outline?1*scale:0).beginFill(color)
    	//.mt(startX,startY)
    	.mt(startX-2*scale,startY)
    	.lt(startX-2*scale,startY-3*scale)
    	.lt(startX-4*scale,startY-3*scale)
    	.lt(startX-5*scale,startY-2*scale)
    	.lt(startX-5*scale,startY-1*scale)
    	.lt(startX-8*scale,startY-1*scale)
    	.lt(startX-8*scale,startY-4*scale)
    	.lt(startX-4*scale,startY-6*scale)
    	.lt(startX+4*scale,startY-6*scale)
    	.lt(startX+8*scale,startY-4*scale)
    	.lt(startX+8*scale,startY-1*scale)
    	.lt(startX+5*scale,startY-1*scale)
    	.lt(startX+5*scale,startY-2*scale)
    	.lt(startX+4*scale,startY-3*scale)
    	.lt(startX+2*scale,startY-3*scale)
    	.lt(startX+2*scale,startY)
    	//.cp()
    return topLogo
}

function drawLogoBottom(startX,startY,color,scale,outline){
	var topLogo = new Shape()
    topLogo.graphics.beginStroke('#444').ss(outline?1*scale:0).beginFill(color)
    	//.mt(startX,startY)
    	.mt(startX-2*scale,startY)
    	.lt(startX-2*scale,startY+3*scale)
    	.lt(startX-4*scale,startY+3*scale)
    	.lt(startX-5*scale,startY+2*scale)
    	.lt(startX-5*scale,startY+1*scale)
    	.lt(startX-8*scale,startY+1*scale)
    	.lt(startX-8*scale,startY+4*scale)
    	.lt(startX-4*scale,startY+6*scale)
    	.lt(startX+4*scale,startY+6*scale)
    	.lt(startX+8*scale,startY+4*scale)
    	.lt(startX+8*scale,startY+1*scale)
    	.lt(startX+5*scale,startY+1*scale)
    	.lt(startX+5*scale,startY+2*scale)
    	.lt(startX+4*scale,startY+3*scale)
    	.lt(startX+2*scale,startY+3*scale)
    	.lt(startX+2*scale,startY)
    return topLogo
}

function drawButton(options){
	options.x = options.x==null?0:options.x
	options.y = options.y==null?0:options.y
	options.color = options.color==null?'darkblue':options.color
	options.strokeColor = options.strokeColor==null?blue:options.strokeColor
	options.strokeWidth = options.strokeWidth==null?borderWidth:options.strokeWidth
	options.label = options.label==null?'button':options.label
	options.labelColor = options.labelColor==null?'white':options.labelColor
	options.fontSize = options.fontSize==null?14:options.fontSize
	options.font = options.font==null?font:options.font
	options.width = options.width==null?100:options.width
	options.height = options.height==null?40:options.height
	options.cornerRadius = options.cornerRadius==null?borderRadius:options.cornerRadius
	options.name = options.name==null?options.label:options.name

	var button = new Shape(),
		buttonLabel = new Text(makeCap(options.label),options.fontSize+'px '+options.font,options.labelColor)	,
		buttonCont = new Container()
	button.graphics
		.s(options.strokeColor).ss(options.strokeWidth)
		.f(options.color)
		.rr(0,0,options.width,options.height,options.cornerRadius)
		.ef()
    buttonLabel.x=options.width/2
    buttonLabel.y=options.height/2
    buttonLabel.textAlign = 'center'
    buttonLabel.textBaseline = 'middle'
    buttonLabel.lineWidth = options.width-10
    buttonLabel.maxWidth = options.width-10
    
    buttonCont.x=options.x
    buttonCont.y=options.y
    buttonCont.addChild(button,buttonLabel)
    buttonCont.name = options.name
    buttonCont.addEventListener("click", options.onClick)
    return buttonCont	
}

//  /$$$$$$$  /$$$$$$$   /$$$$$$  /$$      /$$        /$$$$$$  /$$   /$$ /$$$$$$ /$$$$$$$
// | $$__  $$| $$__  $$ /$$__  $$| $$  /$ | $$       /$$__  $$| $$  | $$|_  $$_/| $$__  $$
// | $$  \ $$| $$  \ $$| $$  \ $$| $$ /$$$| $$      | $$  \__/| $$  | $$  | $$  | $$  \ $$
// | $$  | $$| $$$$$$$/| $$$$$$$$| $$/$$ $$ $$      |  $$$$$$ | $$$$$$$$  | $$  | $$$$$$$/
// | $$  | $$| $$__  $$| $$__  $$| $$$$_  $$$$       \____  $$| $$__  $$  | $$  | $$____/
// | $$  | $$| $$  \ $$| $$  | $$| $$$/ \  $$$       /$$  \ $$| $$  | $$  | $$  | $$
// | $$$$$$$/| $$  | $$| $$  | $$| $$/   \  $$      |  $$$$$$/| $$  | $$ /$$$$$$| $$
// |_______/ |__/  |__/|__/  |__/|__/     \__/       \______/ |__/  |__/|______/|__/


function drawShip(options){
	var shipCont = new Container(),
		shipShape = new Shape(),
		baseColor = options.color!=null?options.color:'#555',
		lightColor = options.color!=null?options.color:'#888',
		darkColor = options.color!=null?options.color:'#333',
		hullY = 0			

	if(ship.missileClass>0 && options.drawWeapons){
		shipShape.graphics.beginFill('grey').dc(20,95,5).dc(80,95,5).ef()
		if(ship.weaponsArmed)shipShape.graphics.beginFill('red').dr(15,85+hullY,3,8).dr(82,85,3,8).ef()
	}
	shipShape.graphics
		.beginFill(baseColor)
		.beginStroke(darkColor)
		// left engine
		.rr(20,90+hullY,15,40,5)
		.beginFill(darkColor)
		.rr(23,93+hullY,9,34,3)
		// right engine
		.beginFill(baseColor)
		.rr(65,90+hullY,15,40,5)
		.beginFill(darkColor)
		.rr(68,93+hullY,9,34,3)
		// hull
		.beginFill(baseColor)
		.dr(30,80+hullY,40,20)
		// neck
		.beginFill(darkColor)
		.dr(45,30,10,50+hullY)
		// wings
		.beginFill(baseColor)
		.mt(50,30)
		.lt(25,30)
		.lt(25,27)
		.lt(40,15)
		.lt(60,15)
		.lt(75,27)
		.lt(75,30)
		// bridge
		.beginRadialGradientFill([lightColor,baseColor], [0, 1], 50, 20, 0, 50, 20, 15)
		.dc(50,20,15).ef().es()
		.beginFill(darkColor)
		.mt(40,20)
		.qt(40,10,50,10)
		.qt(60,10,60,20)
		.lt(55,20)
		.qt(55,15,50,15)
		.qt(45,15,45,20)
		.lt(40,20)

	if(ship.laserClass>0 && options.drawWeapons){
		shipShape.graphics.beginFill('grey').dc(50,92,5).ef()
		if(ship.weaponsArmed)shipShape.graphics.beginFill('red').dr(45,83+hullY,3,8).dr(52,83,3,8).ef()
	}
	if(ship.plasmaClass>0 && options.drawWeapons){
		shipShape.graphics.beginFill('grey').dc(50,25,5).ef()
		if(ship.weaponsArmed)shipShape.graphics.beginFill('red').dr(48,15,4,10).ef()
	}
	var engineFlare = new Shape()
	engineFlare.name='engineFlare'
	//if(ship.enginesOn)shipShape.graphics
	engineFlare.graphics.beginLinearGradientFill(['white','purple','rgba(0,0,0,0)'], [0,0.25,1], 0, 130, 0, 160)
		.de(20,130,15,40)
		.de(65,130,15,40)
		.ef()

	if(ship.shieldsUp && options.drawShields && ship.shieldClass>0){
		var shieldCoords = [50,-10,90,-10,90,80,90,160,50,160,10,160,10,80,10,-10,50,-10]
		shipShape.graphics
			.beginStroke('red')
			.ss(!options.animateShields?5:ship.shieldsVal<20?1:Math.round(ship.shieldsVal/20))
			.mt(50,-10)
			.qt(90,-10,90,80)
			.qt(90,160,50,160)
			.qt(10,160,10,80)
			.qt(10,-10,50,-10)
			.es()
	}

	var x,y
	if(options.drawPods){
		for (var i = 0; i < ship.cargoPods; i++) {
			if(isEven(i)){
				x = 40
				y = i*3+35
			}else{
				x = 55
			}	
			shipShape.graphics.beginFill('grey').dr(x,y,5,5)
			if(!isEven(i))
				shipShape.graphics.beginFill('grey').dr(x-2,y+2,2,1)
			else			
				shipShape.graphics.beginFill('grey').dr(x+5,y+2,2,1)			
		}
		for (var i = 0; i < ship.blastoPods; i++) {
			if(isEven(i)){
				x = 40
				y = i*3+65
			}else{
				x = 55
			}	
			shipShape.graphics.beginFill('white').dr(x,y,5,5)						
		}
		for (var i = 0; i < ship.jumpPods; i++) {
			if(isEven(i)){
				x = 40
				y = i*3+75
			}else{
				x = 55
			}	
			shipShape.graphics.beginFill(blue).dr(x,y,5,5)						
		}
	}
	engineFlare.visible = ship.enginesOn
	shipCont.addChild(shipShape,engineFlare)
	shipCont.scaleX = options.scale
	shipCont.scaleY = options.scale
	return shipCont
}

function drawStars(w,h,scale){
	starsContainer.removeAllChildren()
	xOffset = (-1*round(game.coordX-((w/scale)/2),1))	
	yOffset = ((220-game.coordY)-((h/scale)/2))	
	var starmapBg = new Shape()
	starmapBg.graphics.beginFill('rgba(0,0,0,0.5)').dr(0,0,w-20,h-95).ef().es()
	starmapBg.name = 'bg'
	starsContainer.addChild(starmapBg)
	starsContainer.x=0
	starsContainer.y=0
	starmapCoordsContainer.removeAllChildren()
	for (var i = 0; i < starDataKeys.length; i++) {
		var starInfo = game.stars[starDataKeys[i]]
		var starScreenXY = convertSFCoordsToScreenCoords(starInfo.x,starInfo.y,scale)
		var star = new Shape()
		//stars.graphics.beginFill(spectralClasses[starInfo.spectralClass])
		star.name = 'star '+starInfo.x+'x'+starInfo.y
		//var starRadius = 
		star.graphics
			.beginRadialGradientFill(['white',spectralClasses[starInfo.spectralClass],'rgba(0,0,0,0)'], [0,0.5,1], starScreenXY.x, starScreenXY.y, 0.25*scale, starScreenXY.x, starScreenXY.y, 0.5*scale)
			// .beginFill(spectralClasses[starInfo.spectralClass])
			.dc(
				starScreenXY.x,
				starScreenXY.y,
				scale>10?0.5*scale:8
			)
		if(scale<10) star.clip=new Graphics().dr(0,0,w-20,h-95)
		starsContainer.addChild(star)
		var coords = new Text(starInfo.x+'x'+starInfo.y,'10px '+font,'white')
		coords.x = starScreenXY.x
		coords.y = starScreenXY.y
		//starmapCoordsContainer.addChild(coords)
	}
	if(scale>10) topNebulaContainer.removeAllChildren()
	for (var i = 0; i < game.nebulas.length; i++) {
		var nebulaScreenXY = convertSFCoordsToScreenCoords(game.nebulas[i].x,game.nebulas[i].y,scale)
		var nebula = new Shape()
		//stars.graphics.beginFill('green')
		nebula.name = 'nebula'		
		nebula.graphics
			.beginRadialGradientFill(['green','rgba(0,0,0,0)'], [0,1], nebulaScreenXY.x, nebulaScreenXY.y, (game.nebulas[i].radius*0.5)*scale, nebulaScreenXY.x, nebulaScreenXY.y, (game.nebulas[i].radius*1)*scale)
			//.beginFill('green')
			.dc(
				nebulaScreenXY.x,
				nebulaScreenXY.y,
				(game.nebulas[i].radius)*scale
			)
		nebula.clip=new Graphics().dr(0,0,w-20,h-95)
		nebula.alpha=scale>10?0.5:1
		starsContainer.addChild(nebula)
		if(scale>10){
			topNebulaContainer.addChild(nebula.clone())
		}
	}
	// var encounterPoint = new Shape()
	// encounterPoint.graphics.f('white').dc(convertSFCoordsToScreenCoords(125,102,scale).x,convertSFCoordsToScreenCoords(125,102,scale).y,100)
	// encounterPoint.name='encounter 125x102'
	// starsContainer.addChild(encounterPoint)
}
function drawFluxPoints(scale){
	for (var i = 0; i < fluxDataKeys.length; i++) {
		var fluxInfo = game.fluxes[fluxDataKeys[i]]
		var fluxScreenXY = convertSFCoordsToScreenCoords(fluxInfo.x,fluxInfo.y,scale)
		var flux = new Shape()
		flux.name = 'flux '+fluxInfo.x+'x'+fluxInfo.y
		flux.graphics
			.beginRadialGradientFill(['#26003f','rgba(0,0,0,0)'],[0,1],fluxScreenXY.x,fluxScreenXY.y,3,fluxScreenXY.x,fluxScreenXY.y,30)
			//.beginFill('black')
			.dc(fluxScreenXY.x,fluxScreenXY.y,30)
		
		// for (var ii = 0; ii < 10; ii++) {						
		// 	flux.graphics.beginFill('grey')
		// 		.dc(
		// 			fluxScreenXY.x + rifi(-30,30),
		// 			fluxScreenXY.y + rifi(-30,30),
		// 			2
		// 		)
		// }
		starsContainer.addChild(flux)
	}
}
function drawFluxLines(scale){					        	
	for (var i = 0; i < game.fluxLog.length; i++) {
		var fd = game.fluxes[game.fluxLog[i]],
			sc = convertSFCoordsToScreenCoords(fd.x,fd.y,scale),
			c = convertSFCoordsToScreenCoords(parseInt(game.fluxLog[i].split('x')[0]),parseInt(game.fluxLog[i].split('x')[1]),scale)
			
		var fluxLine = new Shape()
		fluxLine.graphics.beginStroke('grey').ss(1)
			.mt(c.x,c.y).lt(sc.x,sc.y).es()
		starsContainer.addChild(fluxLine)
		//console.log("game.fluxLog[i]", game.fluxLog[i])
		//console.log("fd", fd)
	}

}
function drawMeter(label,color,textColor,val,w){
	var cont = new Container(),
		meter = new Shape(),
		meterLabel = new Text(label,'20px '+font,textColor)
		meterVal = new Text(Math.round(val)+'%','8px '+font,textColor)
	if(val>0)meter.graphics.beginFill(color).rr(0,(100-val),w,val,2).ef()
	meterLabel.x=0
	meterLabel.y=110
	meterVal.x=0
	meterVal.y=105
	cont.addChild(meter,meterLabel,meterVal)
	return cont
}


//  /$$$$$$$$ /$$$$$$  /$$$$$$  /$$   /$$ /$$$$$$$$ /$$$$$$$
// |__  $$__/|_  $$_/ /$$__  $$| $$  /$$/| $$_____/| $$__  $$
//    | $$     | $$  | $$  \__/| $$ /$$/ | $$      | $$  \ $$
//    | $$     | $$  | $$      | $$$$$/  | $$$$$   | $$$$$$$/
//    | $$     | $$  | $$      | $$  $$  | $$__/   | $$__  $$
//    | $$     | $$  | $$    $$| $$\  $$ | $$      | $$  \ $$
//    | $$    /$$$$$$|  $$$$$$/| $$ \  $$| $$$$$$$$| $$  | $$
//    |__/   |______/ \______/ |__/  \__/|________/|__/  |__/


//createjs.Ticker.on("tick", stage)
var i = 0,seconds=0
var doorSpeed = 2
var tkr = createjs.Ticker
tkr.framerate = 24
tkr.addEventListener("tick", handleTick)
var doCheck = true
function handleTick(event){
    if (!event.paused) {
	    // Store
	    if(doSaveGame){
		    gameSave.game 		 = game
		    gameSave.ship        = ship 
	    	localStorage.setItem('gameSave', JSON.stringify(gameSave));
	    }
    	if(openDoors){
    		warningLight.visible=true
    		warningLight.rotation = warningLight.rotation+20>360?0:warningLight.rotation+20
    		doorOpening+=doorSpeed
        	if(doorOpening<doorHeight){   
		        drawStarportDoors()
		    }					    	
	    	if(doorOpening>100){
			    caution.visible=false
			    pressurizedArea.visible=false
				standardAirlock.visible=false
				proceduresApply.visible=false
	    	}	
	    	if(doorOpening>200){
	    		countdownTimer.visible=true
	    		countdownTimer.text = '5'
	    	}
	    	if(doorOpening>200+(24*doorSpeed)){
	    		countdownTimer.text = '4'
	    	}
	    	if(doorOpening>200+(48*doorSpeed)){
	    		countdownTimer.text = '3'
	    	}
	    	if(doorOpening>200+(72*doorSpeed)){
	    		countdownTimer.text = '2'
	    	}
	    	if(doorOpening>200+(96*doorSpeed)){
	    		countdownTimer.text = '1'
	    	}
	    	if(doorOpening>200+(120*doorSpeed)){
	    		countdownTimer.visible=false
	    	}
		    if(doorOpening>200+(120*doorSpeed)){
		    	closePopup()
		    	buildShipUI()
		    	openDoors=false
		    	warningLight.visible=false
		    }
		}
	    caution.alpha=rdfi(0.5,0.8)
	    pressurizedArea.alpha=rdfi(0.5,0.8)
		standardAirlock.alpha=rdfi(0.5,0.8)
		proceduresApply.alpha=rdfi(0.5,0.8)
		//countdownTimer.alpha=rdfi(0.5,0.8)
	    if(closeDoors){
	    	if(doorOpening>0){
		        doorOpening-=doorSpeed
		        drawStarportDoors()
		    }
		    if(doorOpening<100){
			    caution.visible=true
			    pressurizedArea.visible=true
				standardAirlock.visible=true
				proceduresApply.visible=true
		    }
		    if(doorOpening<=0){
		    	closeDoors=false
		    	warningLight.visible=false
		    }
	    } 
			if(ship.enginesOn){
        		moveShip(ship.orientation)
        		//returnToBridge()
        	}
        // 4 times a second
        if(i==0 || i==6 || i==12 || i == 18){			        	
	        //if(doCheck){
			    
			    if(tooHot&&doCheck){	
	        		console.log('too hot')				    	
			    	//showPopup({title:'Too Close to Sun!',width:200,height:50})
	        		doCheck=false
			    }else{
	        		console.log('not too hot')	
			    	doCheck=!tooHot
			    	//if(!tooHot)closePopup()
			    }
	        //}
		    if(getDistFromSun()<800){
		    	tooHot = true
		    }else{
		    	tooHot = false
		    }
        	if(shipIsInHyperspace() || shipIsInEncounter() || shipIsInSystem())
        		//collisionDetection()
        	if(shipIsInSystem()){
        		var exitPoint = -400
        		if(game.systemX>0+exitPoint){ 
        			enterHyperspace(ship.orientation)
        		}else if(game.systemX<-1*((sideBarWidth-5)*systemScale)-exitPoint ){
        			enterHyperspace(ship.orientation)
        		}else if(game.systemY<-1*((sideBarWidth-5)*systemScale)-exitPoint ){
        			enterHyperspace(ship.orientation)
        		}else if(game.systemY>0+exitPoint){
        			enterHyperspace(ship.orientation)
        		}
        	}
        	if(ship.shieldClass>0 && ship.shieldsUp) ship.shieldsVal = ship.shieldsVal<100?ship.shieldsVal+5:100
        	if(ship.shieldClass>0 && !ship.shieldsUp) ship.shieldsVal = ship.shieldsVal>0?ship.shieldsVal-20:0
        }
        // twice a second
        if(i==0 || i==12){ 
        }
        // once a second
        if(i==0){

        	if(ship.shieldsVal<100 && ship.shieldClass>0){
        		if(shipIsInHyperspace()) buildStatus()
        	}
        	//if(shipIsInHyperspace()){
	        	game.date.minute+=1
	        	if(game.date.minute==60){
	        		game.date.minute=0
		        	game.date.hour+=1
		        	if(game.date.hour==24){
		        		game.date.hour=0
		        		game.date.day+=1
		        		if(game.date.day==31){
		        			game.date.day=1
		        			game.date.month+=1
		        			if(game.date.month==13){
		        				game.date.year+=1
		        			}
		        		}
		        	}
		        }
	        	if(shipIsInHyperspace()) buildStatus()
	        	//if(game.date.minute % 10 == 0) if(dialogTextArray.length>0) dialogTextArray.splice(0,1)
	        //}
        }

	//isInNebula = false
        var top = 24
        i = i<top?i+1:0
        // if(debug){
	        $j('#debugInfo').html(
	        	'<div>Time '+game.date.hour+':'+game.date.minute+' '+game.date.day+'/'+game.date.month+'/'+game.date.year+'</div>'+
	        	'<div>Ship Status: '+getStatus[ship.status]+'</div>'+
	        	// '<div>System Coords: '+systemX+' x '+systemY+'</div>'+
	        	'<div>System Coords: '+game.systemX+' x '+game.systemY+'</div>'+
	        	'<div>Distance to Sun: '+getDistFromSun()+'</div>'+
	        	'<div>Temp: '+(1750-(getDistFromSun()/1))+'</div>'+
	        	'<div>Planet Type: '+game.planetTypes[currentPlanetType].description+'</div>'+
	        	'<div>Planet Orbit Number: '+currentPlanetOrbitNumber+'</div>'+
	        	'<div>Planet Number: '+currentPlanetNumber+'</div>'+
	        	'<div>DoorOpening: '+doorOpening+'</div>'
	        )
	    // }
    }
	buildDialogScreen()
    stage.update()
}
var tooHot=false
function getDistFromSun(){
	var a = (((sideBarWidth-5)*systemScale)/2)+game.systemX
		b = (((sideBarWidth-5)*systemScale)/2)+game.systemY
	return Math.round(Math.sqrt((a*a)+(b*b)))
}
function atStar(starName){
	ship.enginesOn = false
	game.coordX = starName.split(' ')[1].split('x')[0]
	game.coordY = starName.split(' ')[1].split('x')[1]
	enterStarSystem(starName.split(' ')[1])	
	addTextToDialog('Exiting hyperspace. Entering star system.')
	buildShipUI()
}
var doAtPlanetCheck = true
	
function atPlanet(planetType,planetName){
	var planetNameInfo = planetName.split(' ')

	currentPlanetType = planetType
	if(planetNameInfo.length>1){
		currentPlanetOrbitNumber =planetNameInfo[1].split('-')[0]
		currentPlanetNumber =planetNameInfo[1].split('-')[1]
	}
	ship.atPlanet = true
	if(planetType==58){
		dockWithStarPortButton.visible=true
	}else{
		orbitPlanetButton.visible=true
	}
	if(doAtPlanetCheck){
	}
	doAtPlanetCheck=false
}

function inNebula(){
	isInNebula = true
	ship.shieldsUp = false
	ship.status = isInHyperspace
}
function atDust(){
	atNothing()
}
function atNothing(){
	ship.atPlanet = false
	doAtPlanetCheck = true
	//returnToBridge()
	orbitPlanetButton.visible=false
	dockWithStarPortButton.visible=false
	currentPlanetType = 0
	currentPlanetOrbitNumber = 0
	currentPlanetNumber = 0
}
function atFlux(fluxName){
	var fluxCoords = fluxName.split(' ')[1]
	var fc = game.fluxes[fluxCoords]
	game.fluxLog.push(fluxCoords)
	if(ship.orientation == 0)
		changeCoords(fc.x,fc.y+0.3)
	else if(ship.orientation == 45)
		changeCoords(fc.x+0.3,fc.y+0.3)
	else if(ship.orientation == 90)
		changeCoords(fc.x+0.3,fc.y)
	else if(ship.orientation == 135)
		changeCoords(fc.x+0.3,fc.y-0.3)
	else if(ship.orientation == 180)
		changeCoords(fc.x,fc.y-0.3)
	else if(ship.orientation == 225)
		changeCoords(fc.x-0.3,fc.y-0.3)
	else if(ship.orientation == 270)
		changeCoords(fc.x-0.3,fc.y)
	else if(ship.orientation == 315)
		changeCoords(fc.x-0.3,fc.y+0.3)
	ship.enginesOn=false
}
function collisionDetection(){
	var underShip = starsContainer.getObjectUnderPoint(windowWidth/2,windowHeight/2,1)
	// console.log("underShip", underShip);
    if(underShip!=null){
        if(underShip.name.includes('star')){			        	
			atStar(underShip.name)
        }else if(underShip.name.includes('planet')){			        	
			atPlanet(underShip.id,underShip.name)
        }else if(underShip.name.includes('nebula')){			        	
			inNebula()
        }else if(underShip.name.includes('flux')){			        	
			atFlux(underShip.name)
        }else if(underShip.name.includes('dust')){			        	
			atDust()
        }else if(underShip.name.includes('encounter')){			        	
			enterEncounter()
        }
    }else{
    	atNothing()
    }
}			
function flipX(part){
    var newPart = part.clone(true)
    newPart.rotation = part.rotation * -1
    newPart.scaleX = -1
    newPart.x = (part.x*-1)+200
    return newPart
}
function flipY(part){
    var newPart = part.clone(true)
    newPart.rotation = part.rotation * -1
    newPart.scaleY = -1
    return newPart
}
function isEven(n) {
   return n % 2 == 0
}
function isOdd(n) {
   return Math.abs(n % 2) == 1
}
function makeCap(t){
    
    return t!=null && is.string(t)?t.toUpperCase():t
} 

//  /$$   /$$ /$$$$$$$$ /$$     /$$ /$$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$$  /$$$$$$$
// | $$  /$$/| $$_____/|  $$   /$$/| $$__  $$ /$$__  $$ /$$__  $$| $$__  $$| $$__  $$
// | $$ /$$/ | $$       \  $$ /$$/ | $$  \ $$| $$  \ $$| $$  \ $$| $$  \ $$| $$  \ $$
// | $$$$$/  | $$$$$     \  $$$$/  | $$$$$$$ | $$  | $$| $$$$$$$$| $$$$$$$/| $$  | $$
// | $$  $$  | $$__/      \  $$/   | $$__  $$| $$  | $$| $$__  $$| $$__  $$| $$  | $$
// | $$\  $$ | $$          | $$    | $$  \ $$| $$  | $$| $$  | $$| $$  \ $$| $$  | $$
// | $$ \  $$| $$$$$$$$    | $$    | $$$$$$$/|  $$$$$$/| $$  | $$| $$  | $$| $$$$$$$/
// |__/  \__/|________/    |__/    |_______/  \______/ |__/  |__/|__/  |__/|_______/


var keycodeConvert = {49:1,50:2,51:3,52:4,53:5,54:6,55:7,56:8,57:9,65:'a',66:'b',67:'c',68:'d',69:'e',70:'f',71:'g',72:'h',73:'i',74:'j',75:'k',76:'l',77:'m',78:'n',79:'o',80:'p',81:'q',82:'r',83:'s',84:'t',85:'u',86:'v',87:'w',88:'x',89:'y',90:'z',32:'space',37:'left',38:'up',39:'right',40:'down',13:'enter',97:1,98:2,99:3,100:4,101:5,102:6,103:7,104:8,105:9}
$j(document).keydown(function(e){
    var key = keycodeConvert[e.keyCode]        
    if(key == 'up'){
        ship.enginesOn = true
        // buildShipUI()
    }        
    if(key == 'left'){
        ship.orientation -= 45
        ship.enginesOn = false
        // buildShipUI()
    }        
    if(key == 'right'){
        ship.orientation += 45
        ship.enginesOn = false
        // buildShipUI()
    }        
    if(key == 'down'){
        ship.enginesOn = false
        // buildShipUI()
    }   
    if(key == 1 || key == 'z'){
        moveShip(225)
    }    
    if(key == 2 || key == 'x'){
        moveShip(180)
    }    
    if(key == 3 || key == 'c'){
        moveShip(135)
    }    
    if(key == 4 || key == 'a'){
        moveShip(270)
    }    
    if(key == 5 || key == 's'){
        moveShip()
    }    
    if(key == 6 || key == 'd'){
        moveShip(90)
    }    
    if(key == 7 || key == 'q'){
        moveShip(315)
    }    
    if(key == 8 || key == 'w'){
        moveShip(0)
    }    
    if(key == 9 || key == 'e'){
        moveShip(45)
    }  
    if(key == 'space' || key == 'enter'){
        if(ship.atPlanet){
        	if(currentPlanetType==58){
				dockWithStarPort()	
			}else{
				buildOrbitPopup()	
			}
        }
    }
})

function handleViewScreenClick(event){
	var name = event.currentTarget.name
	var x = event.stageX,
		y = event.stageY,
		w = (windowWidth - utilityScreenWidth),
		h = windowHeight,
		l = w/3,
		t = h/3,
		r = w-(w/3),
		b = h-(h/3)
	// up left 7
	if(x<l && y<t)moveShip(315)

	// up 8
	if(x>l && x<r && y<t)moveShip(0)

	// up right 9
	if(x>r && y<t)moveShip(45)

	// right 6
	if(x>r && y>t && y<b)moveShip(90)

	// down right 3
	if(x>r && y>b)moveShip(135)

	// down 2
	if(x>l && x<r && y>b)moveShip(180)

	// down left 1
	if(x<l && y>b)moveShip(225)

	// left 4
	if(x<l && y>t && y<b)moveShip(270)

	// stop 5
	if(x>l && x<r && y>t && y<b)moveShip()

	// if(y>midy && x>0)moveShip(180)
	// if(y<midy && x>0)moveShip(0)
	
}
//                                               /$$$$$$  /$$       /$$             /$$$ /$$$
//                                              /$$__  $$| $$      |__/            /$$_/|_  $$
//  /$$$$$$/$$$$   /$$$$$$  /$$    /$$ /$$$$$$ | $$  \__/| $$$$$$$  /$$  /$$$$$$  /$$/    \  $$
// | $$_  $$_  $$ /$$__  $$|  $$  /$$//$$__  $$|  $$$$$$ | $$__  $$| $$ /$$__  $$| $$      | $$
// | $$ \ $$ \ $$| $$  \ $$ \  $$/$$/| $$$$$$$$ \____  $$| $$  \ $$| $$| $$  \ $$| $$      | $$
// | $$ | $$ | $$| $$  | $$  \  $$$/ | $$_____/ /$$  \ $$| $$  | $$| $$| $$  | $$|  $$     /$$/
// | $$ | $$ | $$|  $$$$$$/   \  $/  |  $$$$$$$|  $$$$$$/| $$  | $$| $$| $$$$$$$/ \  $$$ /$$$/
// |__/ |__/ |__/ \______/     \_/    \_______/ \______/ |__/  |__/|__/| $$____/   \___/|___/
//                                                                     | $$
//                                                                     | $$
//                                                                     |__/		
function moveShip(dir){		
	console.log('moveShip()')
	// only move in space
	if(shipIsInHyperspace() || shipIsInEncounter() || shipIsInSystem()){
    	// only move if you have fuel
    	if(shipFuelVal()>0){
    		
	    	// stop ship
	    	if(is.undefined(dir)){
	    		ship.enginesOn=false
	    	}else{
	    		ship.orientation = dir
	    		if(ship.orientation!=dir){
	    			// change direction and keep moving
	    			ship.enginesOn = true
	    			
	    		}else{
	    			// move ship in direction on first tap
	    			ship.enginesOn = true
	    			var moveDist = 0.1 //0.02*ship.engineClass			
		        	if(dir==225){
		        		// down left
		        		// if(shipIsInHyperspace()){
		        		// 	starsContainer.x += 10
		        		// 	starsContainer.y -= 10
		        		// }
		        		changeCoords(game.coordX-moveDist,game.coordY-moveDist)
		        	}else if(dir==180){
		        		// down
		        		// if(shipIsInHyperspace()){
		        		// 	starsContainer.y -= 10
		        		// }
		        		changeCoords(game.coordX,game.coordY-moveDist)
		        	}else if(dir==135){
		        		// down right
		        		// if(shipIsInHyperspace()){
		        		// 	starsContainer.x -= 10
		        		// 	starsContainer.y -= 10
		        		// }
		        		changeCoords(game.coordX+moveDist,game.coordY-moveDist)
		        	}else if(dir==270){
		        		//  left
		        		// if(shipIsInHyperspace()){
		        		// 	starsContainer.x += 10
		        		// }
		        		changeCoords(game.coordX-moveDist,game.coordY)
		        	}else if(dir==90){
		        		// right
		        		// if(shipIsInHyperspace()){
		        		// 	starsContainer.x -= 10
		        		// }
		        		changeCoords(game.coordX+moveDist,game.coordY)	
		        	}else if(dir==315){
		        		// up left
		        		// if(shipIsInHyperspace()){
		        		// 	starsContainer.x += 10
		        		// 	starsContainer.y += 10
		        		// }
		        		changeCoords(game.coordX-moveDist,game.coordY+moveDist)
		        	}else if(dir==0){
		        		// up
		        		// if(shipIsInHyperspace()){
		        		// 	starsContainer.y += 10
		        		// }
		        		changeCoords(game.coordX,game.coordY+moveDist)
		        	}else if(dir==45){
		        		// up right
		        		// if(shipIsInHyperspace()){
		        		// 	starsContainer.x -= 10
		        		// 	starsContainer.y += 10
		        		// }
		        		changeCoords(game.coordX+moveDist,game.coordY+moveDist)
		        	}
			    	if(ship.enginesOn && shipIsInHyperspace()){
			    		burnFuel(moveDist)
			    	}else{
			    		ship.enginesOn = true
			    	}
		    	}	
	    	} 
        }else{
    		ship.enginesOn=false
        }
        if(shipIsInHyperspace()){
        	buildShipUI()
        // 	if(dir==90)starsContainer.x -= 10
        // 	if(dir==0) starsContainer.y -= 10
        // 	if(dir==180)starsContainer.y += 10
        // 	if(dir==270)starsContainer.x += 10
        }
    	if(shipIsInSystem()){
    		youAreHere.x = -1*(game.systemX/systemScale)
			youAreHere.y = -1*(game.systemY/systemScale)
			youAreHere.rotation = ship.orientation
   			starSystemContainer.x = game.systemX+(windowWidth/2)
			starSystemContainer.y = game.systemY+(windowHeight/2)
			ss.x = (game.systemX+(windowWidth/2))/50
			ss.y = (game.systemY+(windowHeight/2))/50
			shipIcon.rotation = ship.orientation
			shipIcon.getChildByName('engineFlare').visible=ship.enginesOn
			
        }
        collisionDetection()
	}
}
function changeCoords(x,y){		    	
	titleContainer.removeAllChildren()
	if(shipIsInHyperspace()){
		game.coordX=round(x,2)
		game.coordY=round(y,2)
	}else if(shipIsInSystem()){
		var systemMoveDist = ship.atPlanet?systemScale/40:systemScale/(10/ship.engineClass)
		
		if(ship.orientation==0){
			game.systemY += systemMoveDist
		}
		if(ship.orientation==45){
			game.systemX -= systemMoveDist
			game.systemY += systemMoveDist
		}
		if(ship.orientation==90){
			game.systemX -= systemMoveDist
		}
		if(ship.orientation==135){
			game.systemX -= systemMoveDist
			game.systemY -= systemMoveDist
		}
		if(ship.orientation==180){
			game.systemY -= systemMoveDist
		}
		if(ship.orientation==225){
			game.systemX += systemMoveDist
			game.systemY -= systemMoveDist
		}
		if(ship.orientation==270){
			game.systemX += systemMoveDist
		}
		if(ship.orientation==315){
			game.systemX += systemMoveDist
			game.systemY += systemMoveDist
		}
	}
	
	var coordXText = new Text(Math.round(game.coordX),'22px '+font,blue)
	var coordYText = new Text(Math.round(game.coordY),'22px '+font,blue)
	var coordText = new Text('x','22px '+font,blue)
	var logo = drawLogo(20,15,blue,2,false)
	logo.addEventListener('click',handleLogoClick)
	var shipName = new Text('ISS INTREPID','22px '+font,blue)
	coordXText.textAlign='right'
	coordYText.textAlign='left'
	coordText.textAlign='center'
	coordXText.x=windowWidth/2-10
	coordYText.x=windowWidth/2+10
	coordText.x=windowWidth/2
	coordXText.y=2
	coordYText.y=2
	coordText.y=2
	shipName.x=40
	shipName.y=2

	titleContainer.addChild(logo,shipName,coordXText,coordYText,coordText)
}
function handleLogoClick(event){
	console.log('clicked logo')
	localStorage.clear()
	init()
}


