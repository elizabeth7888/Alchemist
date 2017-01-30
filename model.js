//function gameworld() 
//{
	var level = 0;
	var score = 0;
	var rankings = [[0, "Greenhorn"], [10000, "Bungler"], [20000, "Dabbler"], [35000, "Junior Apprentice"], [50000, "Apprentice"], 
							 [80000, "Senior Apprentice"], [120000, "Presdigitator"], [160000, "Hedge Wizard"], [200000, "Concoctionist"], 
							 [250000, "Thaumaturge"], [350000, "Transmuter"], [400000, "Conjurer"], [480000, "Third Class Wizard"], 
							 [560000, "Second Class Wizard"], [640000, "First Class Wizard"], [740000, "Grand Wizard"], [840000, "Third Class Alchemist"],
							 [940000, "Second Class Alchemist"], [1050000, "First Class Alchemist"], [1200000, "Master Alchemist"], 
							 [1500000, "Grand Alchemist"], [1750000, "Supreme Alchemist"]];
	
	// Tile states: 
	//  - There are 25 regular tiles, 1-25 (Air, Oil, Wax...)
	//  - 0 is lead
	//  - -1 is bomb
	//  - 26 is wildcard
	//  - 33 is gold
	var nextitem = document.getElementById("nextitem");
	nextitem.state = 26;  // Starting state
	nextitem.colour = 0;  // Color state
	var waste = document.getElementById("dross");
	waste.state = 0
		// State 0 = empty
		// State 1 = 1/3 full
		// State 2 = 2/3 full
		// State 3 = full
		// State 4 = Lose game
	elementList = [26, -1, 1, 2, 3, 4];  // Starting element list
	colorList = ["#ffffff","red","green","blue","magenta","yellow","cyan",
					"orange","white","gray","pink","black","purple"];
	colorlevel = 4;  // Starting color level
	
	function click(r,c)
	{
		reportdebug("You have clicked gridpoint " + r + ", " + c + "."); 
		if (r == 9 && c == 9)  // Are we trying to throw a perfectly good wildcard away?  Nuh-uh.  Cannot.
			{
				if (document.getElementById("nextitem").state == 26) return;
				getNext();	// If we made it here, then we can throw it away.
				increasewaste();			
				
			}
			else {
				if (!checkifOK(r,c)) return; 
				decreasewaste();
				var cell = document.getElementById("cell" + r.toString() + c.toString());
				var dcell = document.getElementById("divcell" + r.toString() + c.toString());
								
				dcell.style.backgroundColor = document.getElementById("nextitem").style.backgroundColor;
				cell.style.backgroundColor = document.getElementById("nextitem").style.backgroundColor;

				if (document.getElementById("nextitem").state == -1)
				{
					cell.state = 33;	
					document.getElementById("bomb").play();			
				}	else 
				{
					cell.src = document.getElementById("nextitemimg").src;
					cell.state = document.getElementById("nextitem").state;
					dcell.style.backgroundColor = document.getElementById("nextitem").style.backgroundColor;
					cell.style.backgroundColor = document.getElementById("nextitem").style.backgroundColor;
					document.getElementById("tick").play();
				}
				reportdebug("Cell changed to " + cell.state + ", " + dcell.style.backgroundColor);
				updatescore(50);

				checkforcomplete(r,c);
				getNext();
				
			}
			updateboard();
	}
	
	function updatescore(pts)
	{
		score += pts;
		//document.getElementById("gamescore").innerHTML = "Score: " + score;
		for (i=0; i<rankings.length; i++)
		{
			if (rankings[i][0] <= score) document.getElementById("gamerank").innerHTML = "Rank: " + rankings[i][1];
		}
		updateboard(); 
	}
	
	function increasewaste()
	{
		waste.state += 1;
		if (waste.state == 4)
			losegame();	
		reportdebug("Increasing waste to " + waste.state);
		document.getElementById("waste").play();
	}
	
	function decreasewaste()
	{
		if (waste.state > 0)
			waste.state -= 1;
		reportdebug("Decreasing waste to " + waste.state);
	}
	
	function checkforcomplete(r, c)
	{
		var count = 0;
		// r, c is the last clicked grid tile
		// Checking all the tiles in the column
		for (var i=0; i<9; i++)
		{
			var cell = document.getElementById("cell" + r.toString() + i.toString());
			if (cell.state != 0 && cell.state != 33)
				count += 1;		
		}
		
		if (count == 9)
		{
			count = 0;
			// Let's check the column too, see if we have a rare cross-pattern cancellation
			for (i=0; i<9; i++)
			{
				var cell = document.getElementById("cell" + i.toString() + c.toString());
				if (cell.state != 0 && cell.state != 33)
					count += 1;
			}		
			if (count == 9)
			{
				for (i=0; i<9; i++)
				{
					document.getElementById("cell" + i.toString() + c.toString()).state = 33;
				}
				updatescore(550);
				updateboard();
			}
			for (i=0; i<9; i++)
			{
				document.getElementById("cell" + r.toString() + i.toString()).state = 33;
			}
			document.getElementById("magic").play();
			updatescore(450);
			updateboard();
			waste.state = 0;	
		}
		
		// Checking all the tiles in the column
		count = 0;
		for (var i=0; i<9; i++)
		{
			var cell = document.getElementById("cell" + i.toString() + c.toString());
			if (cell.state != 0 && cell.state != 33)
				count += 1;		
		}
		if (count == 9)
		{
			for (i=0; i<9; i++)
			{
				document.getElementById("cell" + i.toString() + c.toString()).state = 33;
			}
			document.getElementById("magic").play();
			updatescore(450);
			updateboard();
			waste.state = 0;	
		}
		// Let's now check the entire board
		count = 0;
		for (i=0; i<9; i++)
			for (var j=0; j<9; j++)
			{
				if (document.getElementById("cell" + i.toString() + j.toString()).state != 0)
					count += 1;
			}
		if (count == 81)
		{
			advancelevel();
			waste.state = 0;
			updatescore(4000);		
		}
		
	}
	
	function checkifOK(r,c)
	{

			var count = 0; 
			for (i=0; i<9; i++)
				for (j=0; j<9; j++)
				{
					var cell = document.getElementById("cell" + j.toString() + i.toString());
					if (cell.state == 0 || cell.state == 33) 
						count = count + 1;
				}
			if (count == 81) return true;

			var nextitem = document.getElementById("nextitem");
			var cell = document.getElementById("cell" + r.toString() + c.toString());
			var nextitemimg = document.getElementById("nextitemimg");

			if (nextitem.state == -1) // Bomb 
			{
				if (cell.state == 33 || cell.state == 0) return false;				
				else return true;
			}
			if (cell.state != 33 && cell.state != 0) return false;
			count = 0;
			if (r > 0)
			{
				var tcell = document.getElementById("cell" + (r-1).toString() + c.toString());
				var tdcell = document.getElementById("divcell" + (r-1).toString() + c.toString());
				if (nextitem.state != 26 
				 && nextitem.state != tcell.state 
				 && tdcell.style.backgroundColor != nextitem.style.backgroundColor 
				 && tcell.state != 33
				 && tcell.state != 0
				 && tcell.state != 26)
				 	return false;
				if (tcell.state == 33 || tcell.state == 0) count = count + 1;			
			}
			if (r < 8)
			{
				var tcell = document.getElementById("cell" + (r+1).toString() + c.toString());
				var tdcell = document.getElementById("divcell" + (r+1).toString() + c.toString());
				if (nextitem.state != 26 
				 && nextitem.state != tcell.state 
				 && tdcell.style.backgroundColor != nextitem.style.backgroundColor 
				 && tcell.state != 33
				 && tcell.state != 0
				 && tcell.state != 26)
				 	return false;
				if (tcell.state == 33 || tcell.state == 0) count = count + 1;			
			}
			if (c > 0)
			{
				var tcell = document.getElementById("cell" + (r).toString() + (c-1).toString());
				var tdcell = document.getElementById("divcell" + (r).toString() + (c-1).toString());
				if (nextitem.state != 26 
				 && nextitem.state != tcell.state 
				 && tdcell.style.backgroundColor != nextitem.style.backgroundColor 
				 && tcell.state != 33
				 && tcell.state != 0
				 && tcell.state != 26)
				 	return false;
				if (tcell.state == 33 || tcell.state == 0) count = count + 1;			
			}
			if (c < 8)
			{
				var tcell = document.getElementById("cell" + r.toString() + (c+1).toString());
				var tdcell = document.getElementById("divcell" + r.toString() + (c+1).toString());
				if (nextitem.state != 26 
				 && nextitem.state != tcell.state 
				 && tdcell.style.backgroundColor != nextitem.style.backgroundColor 
				 && tcell.state != 33
				 && tcell.state != 0
				 && tcell.state != 26)
				 	return false;
				if (tcell.state == 33 || tcell.state == 0) count = count + 1;			
			}
			if (count == 4) return false;
			if ((r==0 || r==8) && count == 3) return false;
			if ((c==0 || c==8) && count == 3) return false;
			if (((r==0 && c==0) || (r==0 && c == 8) || (r==8 && c==0) || (r==8 && c==8)) && count == 2) return false;
			
			return true;
	}
	
	function updateElementList()
	{
		if (level == 0)
		{
			elementList = [26, -1, 1, 2, 3, 4];  // Starting element list
			colorList = ["#ffffff","red","green","blue","magenta","yellow","cyan",
					"orange","white","gray","pink","black","purple"];
			colorlevel = 4;  // Starting color level
		}
		if (level == 1)
		{
			elementList = [26, -1, 1, 2, 3, 4];
			colorlevel = 4;
		} else if (level == 2)
		{
			elementList = [26, -1, 1, 2, 3, 4];
			colorlevel = 5;
		} else if (level == 3)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5];
			colorlevel = 5;
		} else if (level == 4)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6];
			colorlevel = 5;
		} else if (level == 5)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7];
			colorlevel = 5;
		} else if (level == 6)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7];
			colorlevel = 6;
		} else if (level == 7)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8];
			colorlevel = 6;
		} else if (level == 8)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9];
			colorlevel = 6;
		} else if (level == 9)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
			colorlevel = 6;
		} else if (level == 10)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
			colorlevel = 7;
		} else if (level == 11)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
			colorlevel = 7;
		} else if (level == 12)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
			colorlevel = 7;
		} else if (level == 13)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
			colorlevel = 7;
		} else if (level == 14)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
			colorlevel = 8;
		} else if (level == 15)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
			colorlevel = 8;
		} else if (level == 16)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
			colorlevel = 8;
		} else if (level == 17)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
			colorlevel = 8;
		} else if (level == 18)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
			colorlevel = 9;
		} else if (level == 19)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
			colorlevel = 9;
		} else if (level == 20)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
			colorlevel = 9;
		} else if (level == 21)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
			colorlevel = 9;
		} else if (level == 22)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
			colorlevel = 10;
		} else if (level == 23)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
			colorlevel = 10;
		} else if (level == 24)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
								21];
			colorlevel = 10;
		} else if (level == 25)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
								21, 22];
			colorlevel = 10;
		} else if (level == 26)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
								21, 22];
			colorlevel = 11;
		} else if (level == 27)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
								21, 22, 23];
			colorlevel = 11;
		} else if (level == 28)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
								21, 22, 23, 24];
			colorlevel = 11;
		} else if (level == 29)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
								21, 22, 23, 24, 25];
			colorlevel = 11;
		} else if (level >= 30)
		{
			elementList = [26, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
								21, 22, 23, 24, 25];
			colorlevel = 12;
		}	
	}
	
	function advancelevel()
	{
		// Maybe do a celebratory animation here?
		for (var i=0; i<9; i++)
			for (var j=0; j<9; j++)
				document.getElementById("cell" + i.toString() + j.toString()).state = 0;
		level += 1;		
		updateboard();
		// Now comes the ugly part...
		updateElementList();
		initRound();
	}
	
	function getNext()
	{
		var item = Math.floor(Math.random() * (elementList.length - 1));
		var col = Math.floor(Math.random() * colorlevel) + 1;
		var count = 0;
		for (i=0; i<9; i++)
			for (j=0; j<9; j++)
					if (document.getElementById("cell" + i.toString() + j.toString()).state == 0 || document.getElementById("cell" + i.toString() + j.toString()).state == 33) count += 1;
		if (count == 81) item = 0;// Check if grid empty, if empty, then assign next item to be wild
			
		if (item == 0 || item == 1) // We got wild or bomb 
		{
			col = 0;  
			if (item == 0) element = elements[0];
			else element = elements[1];
			if (item == 0)
				document.getElementById("nextitem").state = 26;
			else document.getElementById("nextitem").state = -1;
		}
		else 
		{
			element = elements[elementList[item+1]];
			document.getElementById("nextitem").state = elementList[item+1];
		}
		document.getElementById("nextitemimg").src = element;
		document.getElementById("nextitem").style.backgroundColor=colorList[col];
		//reportdebug("item:" + item + " col:" + col + " element:" + element);
		if (item == 1) document.getElementById("nextitem").style.backgroundColor=colorList[0];
 		
	}
	
	function initRound()
	{
		var colorNum = 0;
		var elementNum = 0;
		document.getElementById("nextitemimg").src = elements[elementNum];
		document.getElementById("nextitem").state = 26;
		nextitem.backgroundColor = colorList[colorNum]
		waste.state = 0;
		for (i=0; i<9; i++)
			for (j=0; j<9; j++)
					document.getElementById("cell" + i.toString() + j.toString()).state = 0;
		updateboard();
	}
	
	function cleanboard()
	{
		for (var i=0; i<9; i++)
		 for (var j=0; j<9; j++)
		  document.getElementById("cell" + i.toString() + j.toString()).state = 0;
	}
	
	function startGame()
	{
		var delay = 10000;
		score = 0;
		//updatescore(0);
		initRound();
		//cleanboard();
		if (firsttime == true) 
		{
			title();
			setTimeout(hidetitle,delay);
			firsttime = false;
		}
		popup_show();
		document.getElementById("debugtxt").value = "You have yet to click a grid tile.";
		//document.getElementById("debugtxt").addEventListener("mousedown", function(e) { movedebug(); }, false);
		//document.getElementById("debugtxt").addEventListener("click", function(e) { clickdebug(e); }, false);
		//window.addEventListener("mouseup", onMouseUp, false);
		document.getElementById("nextitemimg").src = elements[0];
		document.getElementById("clearstorage").addEventListener("click", function(e) { localStorage.clear(); 
																									document.getElementById("clearstorage").innerHTML = "Cleared!";
																									setTimeout(function(){ document.getElementById("clearstorage").innerHTML = "Click here to clear local storage.<br>(Highscores and saved games)";},1000);
																									document.getElementById("loadgamediv").style.display = "none"; }, false);
		if (!localStorage.savedgame || localStorage.savedgame == null)
			document.getElementById("loadgamediv").style.display = "none";
		else 
			document.getElementById("loadgamediv").style.display = "block";
		
		document.getElementById("savegame").addEventListener("click",
				function(e) {savegame(); 
				document.getElementById("savegame").innerHTML = "Saved!";
				setTimeout(function(){ document.getElementById("savegame").innerHTML = "Save Game";},1000);}, false)
	}
	
	function savegame()
	{
		var j = {"grid":{"states":[], "colors":[]}, "name":document.getElementById("name").value, "score":score, 
		"level":level, "waste":document.getElementById("dross").state, 
		"nextitem":{"state":document.getElementById("nextitem").state, "color":document.getElementById("nextitem").style.backgroundColor }};
		for (var c=0; c<9; c++)		
			for (var r=0; r<9; r++)
			{
				j.grid.states.push( document.getElementById("cell" + r.toString() + c.toString()).state );
				j.grid.colors.push( document.getElementById("divcell" + r.toString() + c.toString()).style.backgroundColor );			
			}
		localStorage.savedgame = JSON.stringify(j);
	}
	
	function LevelChooser()
	{
		document.getElementById("abc_levels").style.display = "block";	
		document.getElementById("OK").addEventListener("click", function(e) { CloseLevelChooser(); }, false);  
	}
	
	function CloseLevelChooser()
	{
		level = document.getElementById("levelselect").value-1;
		score = 0;
		updatescore(500 * level);
		document.getElementById("abc_levels").style.display = "none";	
		advancelevel();
	}

	function hidetitle()
	{
		document.getElementById("titleanimation").style.display = "none";
		document.getElementById("intro").pause();
	}

	function popup_show()
	{
			document.getElementById("clicktut").addEventListener("click", function(e) { do_tutorial(); });
			document.getElementById("abc").style.display = "block";
		//	document.getElementById("debug").addEventListener("click", function(e) { level=-1; advancelevel(); popup_hide();}, false);
			document.getElementById("beginner").addEventListener("click", function(e) {  level=0; advancelevel(); tutprompt_show(); popup_hide();}, false);
			document.getElementById("intermediate").addEventListener("click", function(e) {  level=10; score = 0; updatescore(40000); advancelevel(); popup_hide();}, false);
			document.getElementById("advanced").addEventListener("click", function(e) {  level=20; score = 0; updatescore(80000); advancelevel(); popup_hide();}, false);
			document.getElementById("custom").addEventListener("click", function(e) { LevelChooser(); popup_hide();}, false);		
			document.getElementById("loadgame").addEventListener("click", function(e) { loadSavedGame(); popup_hide(); }, false);
			var loginname = localStorage.getItem("loginname");
			var namefield = document.getElementById("name");
			namefield.value = loginname;
	}
	
	function popup_hide()
	{
			document.getElementById("abc").style.display = "none";
			var namebox = document.getElementById("name");
			if (namebox.value == "") namebox.value = "the unknown alchemist";
			reportdebug("Welcome " + namebox.value + " to Alchemist!");
			document.getElementById("header").innerHTML = "Does " + document.getElementById("name").value + " have what it takes to become an Alchemist?";
			updateboard();
	}
	
	function losegame()
	{
		reportdebug("You lost the game!");
		document.getElementById("fail").play();
		document.getElementById("abc_endgame").style.display = "block";
		document.getElementById("newgamebutton").addEventListener("click",function(e) { document.getElementById("abc_endgame").style.display = "none"; startGame(); });
		loadScoreboard();		
	}
	
	function reportdebug( txt )
	{
		document.getElementById("debugtxt").value = document.getElementById("debugtxt").value + '\n' + txt; 	
	}
	
	var mousex = 0;
	var mousey = 0;
	var offsetx = 0;
	var offsety = 0;

	//document.addEventListener('mousemove',onMouseMove, false);
	
	function onMouseMove(e)
	{
		x = e.clientX;
		y = e.clientY;	
		var dbg = document.getElementById("debugtxt");
		dbg.style.top = (y - offsety) + "px";
		dbg.style.left = (x - offsetx) + "px";
	}	
	
	function onMouseUp()
	{
		window.removeEventListener("mousemove",onMouseMove,false);
	}
	
	function clickdebug(e)
	{
		x = e.clientX;
		y = e.clientY;	

		document.getElementById("debugtxt").value += "\nOw, you clicked me!";
		offsety = y - parseInt(document.getElementById("debugtxt").style.top.slice(0,-2));
		offsetx = x - parseInt(document.getElementById("debugtxt").style.left.slice(0,-2));
	}
	
	function movedebug()
	{
		window.addEventListener("mousemove",onMouseMove, false);
	}
	
	var firsttime = false;	// Make true to enable starting animation.
	startGame();

//}
//gameworld();


//loadScoreboard();
