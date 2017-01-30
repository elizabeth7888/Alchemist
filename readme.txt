How XML is used in Assignment 6:

	An HttpXML request is made to load scoreboard.xml into the document.  This 
	data is then used to load in the default high score list.  When the game 
	ends, the player's score is merged into the list for them to see how they 
	compare with legendary alchemists.  I plan to store the high score data in 
	the future using localStorage, but still load a default list if there is no
	localStorage using XML.
	
How JSON is used to load data into the grid:

	An HttpXML request is made to load the savedgame.json into the document.
	When you click the "load game" button at the starting screen, it will parse
	the JSON string and will update the gameboard with the name, score, level, 
	rank, grid tiles, next item tile, and waste state.  I plan to shift this
	over to localStorage, storing the game state as a JSON string.