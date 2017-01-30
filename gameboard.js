function gameboard() {
var grid = document.getElementById("grid");
grid.class = "grid";

function makegrid(r,c) 
{	
	for (i=0; i<r; i++)
	{
		var row = document.createElement('tr');
		row.className = "row";
		for (j=0; j<c; j++)
		{

			var cell = document.createElement('td');
			//if ((i + j) % 2 == 0) cell.className = "celleven";
			//else cell.className = "cellodd"
			cell.className = "cell";
			cell.id = "divcell" + j.toString() + i.toString();

			var link = document.createElement('a');
			link.r = j;
			link.c = i;
			link.addEventListener("click", function(e) { click(this.r,this.c) }, false);  // Looking ahead
			// The below is if I want to include images for the grid
			
			var img = document.createElement('img');
			img.src = "images/lead.png";
			img.id = "cell" + j.toString() + i.toString();	
			img.className = "cellimg";		
			img.state = 0;
			
			link.appendChild(img);
			
			cell.appendChild(link);
			row.appendChild(cell);
		
		}
		grid.appendChild(row);	
	}
}

makegrid(9,9)


elements = ["images/wildcard.png", "images/bomb.png", "images/air.png", "images/earth.png", "images/water.png", "images/fire.png", "images/alum.png", "images/antimony.png", "images/aquavitae.png",
									"images/bismuth.png", "images/borax.png", "images/copper.png", "images/iron.png", "images/jove.png", "images/lodestone.png", "images/nitre.png",
									"images/oil.png", "images/realgar.png", "images/salgemmae.png", "images/salt.png", "images/silver.png", "images/sulfur.png", "images/tin.png", 
									"images/trident.png", "images/verdigris.png", "images/vinegar.png", "images/wax.png"];

/*
	var header = document.getElementById("header");
	var loginname = localStorage.getItem("loginname");
	var lasttime = localStorage.getItem("lastlogintime");
	if (loginname != "" && loginname != null)
		header.innerHTML = "(Last login: " + lasttime + ") Hello " + loginname + "!  (<button id='dumb' onclick=javascript:clearinfo()>Click here</button> to erase local data.)"; 
	else header.innerHTML = "";
	*/

}

function clearinfo()
{
	localStorage.removeItem("loginname");
	localStorage.removeItem("lastlogintime");
	var header = document.getElementById("header");
	var loginname = localStorage.getItem("loginname");
	var lasttime = localStorage.getItem("lastlogintime");
	if (loginname != "" && loginname != null)
		header.innerHTML = "(Last login: " + lasttime + ") Hello " + loginname + "!  (<a onclick=javascript:clearinfo()>Click here</a> to erase local data.)"; 
	else header.innerHTML = "";

}
									
function updateboard()
{
	document.getElementById("gamescore").innerHTML = "Score: " + score;
	document.getElementById("gamelevel").innerHTML = "Level: " + level;
	
	for (i=0; i<9; i++)
		for (j=0; j<9; j++)
		{
			var cell = document.getElementById("cell" + i + "" + j);
			if (cell.state == 33)
			{
				cell.src = "images/gold.png";
				cell.style.backgroundColor = "#ffffff";
			}
			else if (cell.state == 0)
			{
				cell.src = "images/lead.png";
				cell.style.backgroundColor = "#ffffff";			
			}
		}
	var df = document.getElementById("drossfluid");
	var waste = document.getElementById("dross");
	if (waste.state == 0)
	{
		df.src = "images/lead.png";	
	} else if (waste.state == 1)
	{
		df.src = "images/low.png";	
	} else if (waste.state == 2)
	{
		df.src = "images/med.png";	
	} else if (waste.state == 3)
	{
		df.src = "images/high.png";	
	}
	
	//reportdebug("Waste.state:" + waste.state + " wasteimg:" + df.src);

}

function title()
{
	var col = "3498db";
	var colstate = 0; //increasing
	var txtsize = 10;
	var ta = document.getElementById("titleanimation");
	ta.addEventListener("click", function(e) { ta.style.display = "none"; }, false);
	document.getElementById("intro").play();
	function Tile() 
	{
		this.left = Math.floor(Math.random() * window.innerWidth - 40);
		this.top = Math.floor(Math.random() * window.innerHeight - 40);
		this.color = colorList[Math.floor(Math.random() * (colorList.length - 1) + 1)];
		this.element = elements[Math.floor(Math.random() * (elements.length - 2) + 2)];
		this.lifetime = Math.floor(Math.random() * 50 + 10);
		this.life = 0; 
	}
	var tiles = [];
	function nextframeanim()
	{
		
		function addHexColor(c1, c2) {
	  		var hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
	  		while (hexStr.length < 6) { hexStr = '0' + hexStr; } // Zero pad.
  	  		return hexStr;
		}	
		function subHexColor(c1, c2) {
	  		var hexStr = (parseInt(c1, 16) - parseInt(c2, 16)).toString(16);
	  		while (hexStr.length < 6) { hexStr = '0' + hexStr; } // Zero pad.
  	  		return hexStr;
		}		
		var ta = document.getElementById("titleanimation");
		
		ta.innerHTML = "(Click to skip intro.)<div id='animationtxt'>Alchemist</div>";
		
		var at = document.getElementById("animationtxt");
				 
		if (ta.style.display == "none") return;
		
		if (colstate == 0)
		{
			col = addHexColor(col, "010000");
			if (col == "ff98db") colstate = 1;		
		}
		else if (colstate == 1) 
		{
			col = addHexColor(col, "000001");
			if (col == "ff98ff") colstate = 2;
		}
		else if (colstate == 2)
		{
			col = subHexColor(col, "010000");
			if (col == "0098ff") colstate = 3;		
		}
		else if (colstate == 3)
		{
			col = subHexColor(col, "000001");
			if (col == "009800") colstate = 0;		
		}
		
		txtsize += 1;
		at.style.textShadow = "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #"+col+", 0 0 30px #"+col+", 0 0 40px #"+col+", 0 0 55px #"+col+", 0 0 75px #"+col;
		at.style.fontSize = "" + Math.pow(txtsize,0.85) + "px";
		
				

		while (tiles.length < 5)
		{
			newtile = new Tile();
			tiles.push(newtile);
		}

		
		for (i=0; i<tiles.length; i++)
		{
		   tiles[i].life += 1;
			ta.innerHTML += "<div id='tile" 
									+ i.toString() 
									+ j.toString() 
									+ "' style='position:absolute; top:"
									+ tiles[i].top
									+ "px; left:"
									+ tiles[i].left 
									+ "px; background-color:"
									+ tiles[i].color 
									+ ";overflow:hidden'><img src="
									+ tiles[i].element
									+ " class='blurred'></div>";
			
		}

		for (i=0; i<tiles.length; i++)
			if (tiles[i].life >= tiles[i].lifetime)
			{
				var temp = tiles[i];
				delete tiles[i];
				tiles.splice(i,1);
				delete temp;
			}

	 	setTimeout(nextframeanim,10);	
		
	}

	document.getElementById("titleanimation").style.display = "block";
	setTimeout(nextframeanim,10);	
}
	

gameboard();

function setupDross()
{
	var dross = document.getElementById("dross");
	var linkdross = document.createElement('a');
	linkdross.r = 9;
	linkdross.c = 9;
	linkdross.addEventListener("click", function(e) { click(this.r, this.c) }, false);	
	// The following is image-related objects	
	
	var imgdross = document.createElement('img');
	imgdross.src = "images/dross.png";
	imgdross.id = "drosscover";
	var imgfluid = document.createElement('img');
	imgfluid.src = "images/lead.png";
	imgfluid.width = 60;
	imgfluid.height = 60;
	imgfluid.id = "drossfluid";
	linkdross.appendChild(imgdross);
	linkdross.appendChild(imgfluid);
	
	dross.appendChild(linkdross);	
}

//setupDross();

function draw_popup_levels()
{
	var levselect = document.getElementById("levelselect");
	for (i=1; i<=30; i++)
	{
		var opt = document.createElement("option");
		opt.text = "" + i;
		levselect.add(opt);	
	}
	document.getElementById("levelselectOK");
}

function loadScoreboard()
{
   
 	var entrylimit = 10;
	var scoreboard = [];
  	var htmlstr = "<table class='invisible'><tr><td><b>Player Name</b></td><td><b>Score</b></td><td><b>Rank</b></td></tr>";
	var sb = document.getElementById("scoreboard");
	if (!localStorage.scoreboard || localStorage == null)
	{

		var request = new XMLHttpRequest();
	   request.open("GET", "scoreboard.xml", false);
  		request.send(null);
   
   /*
   if (request.status != 200) {
		alert("Request failed " + request.status + ": " + request.statusText);
		return;
   }
   */
   
   	var xmldoc = request.responseXML;
   	var scores = xmldoc.getElementsByTagName("player");
   
 
   
   	for (var i=0; i<scores.length; i++)
   	{
   	
   		var entry = scores[i];
   		var Name = entry.getAttribute("name");
   		var Score = entry.getElementsByTagName("score")[0].firstChild.data;
   		var Rank = entry.getElementsByTagName("rank")[0].firstChild.data;
			scoreboard.push({name:Name, score:Score, rank:Rank});
		}
	

	}
	else 
	{
		//alert(localStorage.scoreboard);
		var sbd = JSON.parse( localStorage.scoreboard );
		//alert(localStorage.scoreboard);
		for (var i=0; i<entrylimit-1; i++)
		{
			scoreboard.push({name:sbd.scoreboard[i].name, score:sbd.scoreboard[i].score, rank:sbd.scoreboard[i].rank});	
		}
	}	
	
	var Name = document.getElementById("name").value;
	var Score = score;
	var Rank = "Doobie";
	for (i=0; i<rankings.length; i++)
	{
		if (rankings[i][0] <= score) Rank = rankings[i][1];
	}
			
	
	scoreboard.push({name:Name, score:String(Score), rank:Rank});
	scoreboard.sort(function(a,b) { return parseInt(a.score) < parseInt(b.score) });

	for (var i=0; i<scoreboard.length; i++)
	{
   	htmlstr += "<tr><td class='invisible'>" + scoreboard[i].name + "</td><td class='invisible'>" + scoreboard[i].score + "</td><td class='invisible'>" + scoreboard[i].rank + "</td></tr>";  
   }
	htmlstr += "</table>";
	sb.innerHTML = htmlstr;   
   scoreboard.pop();
   
   jsonsb = {"scoreboard":scoreboard};
   localStorage.scoreboard = JSON.stringify(jsonsb);
}

function loadSavedGame()
{
/*   var localRequest = new XMLHttpRequest();
   localRequest.open("GET", "savedgame.json");
   localRequest.onreadystatechange = function() 
   {*/
	//	if (localRequest.readyState == 4)// && localRequest.status == 200) 
	//	{
			var jsongame = JSON.parse(localStorage.savedgame);
			document.getElementById("name").value = jsongame.name;
			score = jsongame.score;
			level = jsongame.level;
			waste.state = jsongame.waste;
			document.getElementById("nextitem").state = jsongame.nextitem.state;
			document.getElementById("nextitem").style.backgroundColor=jsongame.nextitem.color;
			document.getElementById("header").innerHTML = "Does " + jsongame.name + " have what it takes to become an Alchemist?";

			for (var i=0; i<9; i++)
			{
				for (var j=0; j<9; j++)
				{
					var indx = 9*i + j;
					var cell = document.getElementById("cell" + j.toString() + i.toString());
					var divcell = document.getElementById("divcell" + j.toString() + i.toString());
					
					cell.state = jsongame.grid.states[indx];
					cell.style.backgroundColor = jsongame.grid.colors[indx];
					divcell.style.backgroundColor = jsongame.grid.colors[indx];
					
					if (jsongame.grid.states[indx] == 26)
						cell.src = elements[0];
					else
						cell.src = elements[jsongame.grid.states[indx]];
					
				}			
			}			
			var nimg = document.getElementById("nextitemimg");
			if (jsongame.nextitem.state == -1)
				nimg.src = "images/bomb.png";
			else if (jsongame.nextitem.state == 26)
				nimg.src = "images/wildcard.png";
			else 
				nimg.src = elements[jsongame.nextitem.state];  	
			
			updateElementList();
			//alert(jsongame.nextitem.color);		
			updatescore(0);
			localStorage.removeItem("savedgame");
		//}
   //};	
   //localRequest.send(null);
}

function dummy()
{
	document.getElementById("nextitemimg").src = "images/air.png";
	document.getElementById("nextitem").style.backgroundColor= "red";
	for (c=0; c<9; c++)
	{
		document.getElementById("cell3" + c).src = "images/gold.png";
	}
	document.getElementById("cell44").src = "images/wildcard.png";
	document.getElementById("cell45").src = "images/earth.png";
	document.getElementById("cell45").style.backgroundColor = "green";
	document.getElementById("cell54").src = "images/earth.png";
	document.getElementById("cell54").style.backgroundColor = "blue";
	document.getElementById("cell64").src = "images/water.png";
	document.getElementById("cell64").style.backgroundColor = "blue";
	document.getElementById("cell74").src = "images/water.png";
	document.getElementById("cell74").style.backgroundColor = "magenta";
	document.getElementById("cell73").src = "images/water.png";
	document.getElementById("cell73").style.backgroundColor = "yellow";
	document.getElementById("gamescore").innerHTML = "Score: 4500";
}

window.requestAnimFrame = function(tick) {
		window.setTimeout(tick, 1000 / 60);	
	}
	
function tutprompt_show()
{	
	document.getElementById("tutprompt").style.display = "block";
	document.getElementById("yes").addEventListener("click", function (e) { do_tutorial(); document.getElementById("tutprompt").style.display = "none";}, false);
	document.getElementById("no").addEventListener("click", function (e) { document.getElementById("tutprompt").style.display = "none";}, false);
}

function do_tutorial()
{
	for (var i=1; i<8; i++)
		document.getElementById("tut" + i).style.display = "none";
	
	document.getElementById("tutorialdiv").style.display = "block";
	document.getElementById("tut1").style.display = "block";
	document.getElementById("tut1img").addEventListener("click", function(e) { do_tutorial2(); }, false);
}

function do_tutorial2()
{
	document.getElementById("tut1").style.display = "none";
	document.getElementById("tut2").style.display = "block";
	document.getElementById("tut2img").addEventListener("click", function(e) { do_tutorial3(); }, false);
}

function do_tutorial3()
{
	document.getElementById("tut2").style.display = "none";
	document.getElementById("tut3").style.display = "block";
	document.getElementById("tut3img").addEventListener("click", function(e) { do_tutorial4(); }, false);
}

function do_tutorial4()
{
	document.getElementById("tut3").style.display = "none";
	document.getElementById("tut4").style.display = "block";
	document.getElementById("tut4img").addEventListener("click", function(e) { do_tutorial5(); }, false);
}

function do_tutorial5()
{
	document.getElementById("tut4").style.display = "none";
	document.getElementById("tut5").style.display = "block";
	document.getElementById("tut5img").addEventListener("click", function(e) { do_tutorial6(); }, false);
}

function do_tutorial6()
{
	document.getElementById("tut5").style.display = "none";
	document.getElementById("tut6").style.display = "block";
	document.getElementById("tut6img").addEventListener("click", function(e) { do_tutorial7(); }, false);
}

function do_tutorial7()
{
	document.getElementById("tut6").style.display = "none";
	document.getElementById("tut7").style.display = "block";
	document.getElementById("tut7img").addEventListener("click", function(e) { document.getElementById("tut7").style.display = "none"; 
		document.getElementById("tutorialdiv").style.display = "none";}, false);
}


//dummy();
