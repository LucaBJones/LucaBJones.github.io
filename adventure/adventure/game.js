const levels =  [

		// level 0
		["flag" , "rock" , "" , "" , "" ,
		 "fenceside" , "rock" , "" ,"" , "rider" ,
		 "" , "tree" , "animate" , "animate" , "animate" , 
		 "" , "water" , "" , "" , "" , 
		 "" , "fenceup" , "" , "horseup" , "" 
		],
		//level 1
		["flag" , "tree" , "" , "rider" , "" ,
		 "" , "rock" , "" ,"water" , "" ,
		 "fenceside" , "tree" , "animate" , "animate" , "animate" , 
		 "" , "water" , "" , "water" , "" , 
		 "" , "" , "" , "water" , "horseup" 
		],
		//level 2
		["fenceup" , "fenceside" , "fenceside" , "fenceside" , "fenceside" ,
		 "" , "" , "fenceup" ,"" , "fenceup" ,
		 "fenceup" , "" , "" , "fenceside" , "fenceup" , 
		 "fenceup" , "" , "" , "" , "fenceup" , 
		 "fenceup" , "" , "horseup" , "rider" , "fenceup" 
		]
		]; // end of levels

const gridBoxes = document.querySelectorAll("#gameBoard div");
const noPassObstacles = ["rock" , "tree" , "water"];
var currentLevel = 0;	// starting level
var riderOn = false; // is the rider on?
var currentLocationOfHorse = 0;
var currentAnimation;	// allows 1 animation per level
var widthOfBoard = 5;

// start game
window.addEventListener("load" , function () {
	loadLevel();
});

// move horse
window.addEventListener("keydown" , getKey); // event listener

// get the key from user
function getKey(e) {
	switch (e.keyCode) {
		
		case 37:// left arrow
			if (currentLocationOfHorse % widthOfBoard !== 0) {
				tryToMove("left");
			} // if
			break;
		case 38:// up arrow
			if (currentLocationOfHorse - widthOfBoard >= 0) {
				tryToMove("up");
			} // if
		break;
		case 39:// right arrow
			if (currentLocationOfHorse % widthOfBoard < widthOfBoard - 1) {
				tryToMove("right");
			} // if
			break;
		case 40:// down arrow
			if (currentLocationOfHorse + widthOfBoard <= widthOfBoard * widthOfBoard) {
				tryToMove("down");
			} // if
			break;
	} // switch
} // getKey

//try to move horse
function tryToMove(direction) {
	
	//location before move
	let oldLocation = currentLocationOfHorse;
	
	// class of location before move
	let oldClassName = gridBoxes[oldLocation].className;
	
	let nextLocation = 0; // location we wish to move to
	let nextClass = "";    // class of location we wish to move to
	
	let nextLocation2 = 0;
	let nextClass2 = "" ;
	
	let newClass = "";    // new class to switch to if move successful
	
	switch (direction) {
		case "left":
			nextLocation = currentLocationOfHorse - 1;
			break;
		case "right":
			nextLocation =  currentLocationOfHorse + 1;
			break;
		case "up":
			nextLocation = currentLocationOfHorse - widthOfBoard;
			break;
		case "down":
			nextLocation = currentLocationOfHorse + widthOfBoard;
			break;
	} // switch
	
	nextClass = gridBoxes[nextLocation].className;
	
	//if the obstacle is not passable, don't move
	if (noPassObstacles.includes(nextClass)) { return; }
	
	// if it's a fence, and there is no rider, don't move
	if (!riderOn && nextClass.includes("fence")) { return; }
	
	// if there is a fence, move two spaces with animation
	if (nextClass.includes("fence")) {
		
		if (riderOn) {
			gridBoxes[currentLocationOfHorse].className = "";
			oldClassName = gridBoxes[nextLocation].className;
			
			// if the horse isn't jumping in the right direction, don't move
			if ((direction == "left" || direction == "right") && nextClass.includes("side")) {
				gridBoxes[currentLocationOfHorse].classList.add("horserider" + direction);
				console.log(newClass + currentLocationOfHorse);
				return;
			} else if ((direction == "up" || direction == "down") && nextClass.includes("up")) {
				gridBoxes[currentLocationOfHorse].classList.add("horserider" + direction);
				console.log(newClass + currentLocationOfHorse + gridBoxes[currentLocationOfHorse].classList);
				return;
			} // else if
			
			// set values according to direction
			if (direction == "left" && nextClass.includes("up")) {
				nextClass = "jumpleft";
				nextClass2 = "horseriderleft";
				nextLocation2 = nextLocation - 1;
				if (nextLocation % widthOfBoard == 0) {
					gridBoxes[currentLocationOfHorse].classList.add("horserider" + direction);
					return;
				} // if
			} else if (direction == "right" && nextClass.includes("up")) {
				nextClass = "jumpright";
				nextClass2 = "horseriderright";
				nextLocation2 = nextLocation + 1;
				if (nextLocation % widthOfBoard == widthOfBoard - 1) {
					gridBoxes[currentLocationOfHorse].classList.add("horserider" + direction);
					return;
				} // if
			} else if (direction == "up" && nextClass.includes("side")) {
				nextClass = "jumpup";
				nextClass2 = "horseriderup";
				nextLocation2 = nextLocation - widthOfBoard;
				if (nextLocation - widthOfBoard < 0) {
					gridBoxes[currentLocationOfHorse].classList.add("horserider" + direction);
					return;
				} // if
			} else if (direction == "down" && nextClass.includes("side")) {
				nextClass = "jumpdown";
				nextClass2 = "horseriderdown";
				nextLocation2 = nextLocation + widthOfBoard;
				if (nextLocation + widthOfBoard >= widthOfBoard * widthOfBoard) {
					gridBoxes[currentLocationOfHorse].classList.add("horserider" + direction);
					return;
				} // if
			}
			
			// if there is an impassible object, don't move
			if (noPassObstacles.includes(gridBoxes[nextLocation2].className)) {
				gridBoxes[currentLocationOfHorse].classList.add("horserider" + direction);
				return;
			} // if	

			// if there is an impassible object, don't move
			if (gridBoxes[nextLocation2].className.includes("fence")) {
				gridBoxes[currentLocationOfHorse].classList.add("horserider" + direction);
				return;
			} // if				
			
			
			
			// show horse jumping
			gridBoxes[nextLocation].className = nextClass;
			
			// disables eventListener
			window.removeEventListener("keydown" , getKey);
			
			setTimeout(function () {
				
				// set jump back to just a fence
				gridBoxes[nextLocation].className = oldClassName;
				
				// update current location of horse to be two spaces past take off
				currentLocationOfHorse = nextLocation2;
				
				// get class of box after jump
				nextClass = gridBoxes[currentLocationOfHorse].className;
				
				// show horse and rider after landing
				gridBoxes[currentLocationOfHorse].className = nextClass2;
				
				// if next box is a flag, go up a level
				levelUp(nextClass);
				
				// re-enables eventListener
				window.addEventListener("keydown" , getKey);
				
			} , 350);
			
			
			return;
		} // if riderOn
		
	} // if class has fence
	
	// if there is a rider, add rider
	if (nextClass == "rider") {
		riderOn = true;
	} // if
	
	// if there is a bridge in the old location, keep it
	if (oldClassName.includes("bridge")) {
		gridBoxes[oldLocation].className = "bridge";
	} else {
		gridBoxes[oldLocation].className = "";
	} // else
	
	// build name of new class 
	newClass = (riderOn) ? "horserider" : "horse";
	newClass += direction;
	
	// if there is a bridge in the next location, keep it
	if (gridBoxes[nextLocation].classList.contains("bridge")) {
		newClass += "bridge";
	} // if
	
	// move 1 spaces
	currentLocationOfHorse = nextLocation;
	gridBoxes[currentLocationOfHorse].className = newClass;
	
	// if it is an enemy
	if (nextClass.includes("enemy")) {
		document.getElementById("lose").style.display = "block";
		window.removeEventListener("keydown" , getKey);
		return;
	} // if
	
	// move up to next level if needed
	levelUp(nextClass);
	
} // tryToMove

// move up a level
function levelUp(nextClass) {
	if(nextClass == "flag" && riderOn) {
		document.getElementById("levelup").style.display = "block";
		clearTimeout(currentAnimation);
		setTimeout(function () {
			document.getElementById("levelup").style.display = "none";
			currentLevel++;
			if(currentLevel == levels.length){
				console.log("you beat the game");
			} else {
				loadLevel();
			} // else
		} , 1000);
	} // if
} // levelUp
	
// load levels 0 - maxlevel
function loadLevel() {
	let levelMap = levels[currentLevel];
	let animateBoxes;
	riderOn = false;
	
	// load the board
	for(i = 0; i < gridBoxes.length; i++ ) {
		gridBoxes[i].className = levelMap[i];
		if (levelMap[i].includes("horse")) {
			currentLocationOfHorse = i;
		} // if
	
	} // for
	
	animateBoxes = document.querySelectorAll(".animate");
	animateEnemy(animateBoxes , 0 , "right");
	
} // loadLevel

// animate enenmy left to right (could add up and down to this)
// boxes - array of grid boxes that include animation
// index - current location of animation
// direction - current direction of animation 
function animateEnemy(boxes , index , direction) {
	
	// exit the function
	if (boxes.length <= 0) { return; }
	
	// update the images
	if (direction == "right") {
		boxes[index].classList.add("enemyright");
	} else {
		boxes[index].classList.add("enemyleft");		
	} // else
	
	// remove images from other boxes
	for(i = 0; i < boxes.length; i++) {
		if (i != index ) {
			boxes[i].classList.remove("enemyleft");
			boxes[i].classList.remove("enemyright");		
		} // if
	} // for
	
	if (boxes[index].className.includes("horse")) {
		document.getElementById("lose").style.display = "block";
		window.removeEventListener("keydown" , getKey);
		return;
	} // if
	
	// moving right
	if (direction == "right") {
		
		// turn around if hit right side
		if(index == boxes.length - 1){
			index--;
			direction = "left";
		} else {
			index++;
		} // else
		
	// moving left	
	} else {
		
		// turn around if hit right side
		if (index == 0) {
			index++;
			direction = "right";
		} else {
			index--;
		} // else
	} // else
	
	currentAnimation =  setTimeout(function () {
		animateEnemy(boxes , index , direction);
	} , 750);
	
} // animateEnemy