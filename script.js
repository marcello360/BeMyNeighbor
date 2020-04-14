var list_data = {
	all : {
		id : 0,
		first : 1,
		last : 394
	},
	gen1 : {
		id : 1,
		first : 1,
		last : 7
	},
	gen2 : {
		id: 2,
		first : 8,
		last : 14
	},
	gen3 : {
		id : 3,
		first : 15,
		last : 29
	},
	gen4 : {
		id : 4,
		first : 30,
		last : 42
	},
	gen5 : {
		id : 5,
		first : 43,
		last : 48
	},
	gen6 : {
		id : 6,
		first : 49,
		last : 71
	},
	gen7 : {
		id: 7,
		first : 72,
		last : 80
	},
	gen8 : {
		id : 8,
		first : 81,
		last : 84
	},
	gen9 : {
		id : 9,
		first : 85,
		last : 100
	},
	gen10 : {
		id : 10,
		first : 101,
		last : 111
	},
	gen11 : {
		id : 11,
		first : 112,
		last : 127
	},
	gen12 : {
		id: 12,
		first : 128,
		last : 143
	},
	gen13 : {
		id : 13,
		first : 144,
		last : 152
	},
	gen14 : {
		id : 14,
		first : 153,
		last : 164
	},
	gen15 : {
		id : 15,
		first : 165,
		last : 182
	},
	gen16 : {
		id : 16,
		first : 183,
		last : 190
	},
	gen17 : {
		id: 17,
		first : 191,
		last : 200
	},
	gen18 : {
		id : 18,
		first : 201,
		last : 207
	},
	gen19 : {
		id : 19,
		first : 208,
		last : 214
	},
	gen20 : {
		id : 20,
		first : 215,
		last : 229
	},
	gen21 : {
		id : 21,
		first : 230,
		last : 237
	},
	gen22 : {
		id: 22,
		first : 238,
		last : 246
	},
	gen23 : {
		id : 23,
		first : 247,
		last : 253
	},
	gen24 : {
		id : 24,
		first : 254,
		last : 268
	},
	gen25 : {
		id : 25,
		first : 269,
		last : 276
	},
	gen26 : {
		id : 26,
		first : 277,
		last : 279
	},
	gen27 : {
		id: 27,
		first : 280,
		last : 289
	},
	gen28 : {
		id : 28,
		first : 290,
		last : 302
	},
	gen29 : {
		id : 29,
		first : 303,
		last : 317
	},
	gen30 : {
		id : 30,
		first : 318,
		last : 338
	},
	gen31 : {
		id : 31,
		first : 339,
		last : 344
	},
	gen32 : {
		id: 32,
		first : 345,
		last : 358
	},
	gen33 : {
		id : 33,
		first : 359,
		last : 376
	},
	gen34 : {
		id : 34,
		first : 377,
		last : 383
	},
	gen35 : {
		id : 35,
		first : 384,
		last : 394
	}

};

var maxPokemon = list_data.all.last;
var pokemonList = [];
var topGridImgArray = document.querySelectorAll('#grid img');
var TESTING = false;

Array.removeRandom = function(array) {
	var _randIndex = Math.floor(Math.random() * array.length);
	return array.splice(_randIndex, 1)[0];
}

//recursive method to load each image
function loadImage(index) {
	if(index > maxPokemon) { //reached last image
		document.getElementById('loader-screen').style.display = 'none';
		document.getElementById('game').style.display = 'block';
		document.getElementById('settings').style.display = 'inline-block';
		return;
	}
	
	var _tmpImage = new Image();
	_tmpImage.onload = function() {
		
		//update progress bar
		var _percentageNode = document.getElementById('percentage').querySelector('span');
		var _fillNode = document.getElementById('percentage-fill');
		
		_percentageNode.innerText = index/maxPokemon*100;
		_fillNode.style.width = ''+index/maxPokemon*100+'%';
		loadImage(index + 1);
	};
	_tmpImage.src = 'images/' + index + '.png';
}

function createIntegerArray(startValue, endValue) {
	var _array = [];
	for(i = startValue; i <= endValue; i++) {
		_array.push(i);
	}
	return _array;
}

//returns a List containing the pokemon selected based on which settings are checked
function getPokemonList() {
	if(TESTING) {
		return createIntegerArray(list_data.test.first, list_data.test.last);
	}
	
	if(document.getElementById('gen-all').checked) {
		return createIntegerArray(list_data.all.first, list_data.all.last);
	}
	
	var list = [];
	var inputs = document.getElementsByClassName('gen-checkbox');
	//add each generation that is checked to the list
	for(i = 0; i < inputs.length; i++) {
		if(inputs[i].checked) {
			var generation = inputs[i].value;
			var dataObj = list_data['gen'+generation];
			
			list = list.concat(createIntegerArray(dataObj.first, dataObj.last));
		}
	}
	
	return list;
}

initilizeGame = function() {
	//preload pokemon images
	loadImage(1);
	
	//set event handelers
	var nodes = document.getElementsByClassName('egg');
	for(i = 0; i < nodes.length; i++) {
		nodes[i].onclick = startGame;	
	}
	
	document.getElementById('gen-all').onchange = function(e) {
		nodes = document.getElementsByClassName('gen-checkbox');

		if(this.checked) { //disabled all other generation checkboxes
			for(i = 0; i < nodes.length; i++) {
				nodes[i].checked = false;
				nodes[i].disabled = true;
			}
		} else { //enable all other generation checkboxes
			for(i = 0; i < nodes.length; i++) {
				nodes[i].removeAttribute('disabled');
			}
		}
	}
	
	document.getElementById('button-skip').onclick = skip;
	document.getElementById('button-undo').onclick = undo;
	document.getElementById('button-reset').onclick = resetGame;
}

displayPokemon = function() {
	if(TESTING) {
		console.log('------- length: ' + pokemonList.length);
	}
	var _myListElement = document.getElementById('pkmnList');
	_myListElement.innerHTML = '';
	for(i = 0; i < pokemonList.length; i++) {
		var tmpNode = document.createElement('li');
		tmpNode.innerHTML = pokemonList[i];
		_myListElement.appendChild(tmpNode);
		if(TESTING)
			console.log(pokemonList[i]);
	}
	
}

skip = function() {
	var _dexNumber = document.querySelector('#pkm2 img').getAttribute('dexnumber');
	pokemonList.push(_dexNumber);
	generatePokemon(document.querySelector('#pkm1 img'), false);
}

undo = function() {
		/* remove most recent node from undoList
		
	   check if the savedChoice id number matches the randomly generated
	   number for either choice
			if it does, then do not add the matchingChoice back into the list
			otherwise, add both currentChoices into the list
	
		next update the src of each location's choice
	
		check if we are at the top 10 choices and update that number as well
		
		update elminated text
		
		check if we need to disable the undo button (list is null)
	*/
	var _history = undoArray.pop();
	var _pkm1 = document.querySelector('#pkm1 img');
	var _pkm2 = document.querySelector('#pkm2 img');
	
	_history.saved = _history[1];
	_history.deleted = _history[0];
	
	//check if we need to remove the saved pokemon from the array (to prevent duplicates)
	if(_history.saved.value != _pkm1.getAttribute('dexnumber') &&
	   _history.saved.value != _pkm2.getAttribute('dexnumber')) {
	   pokemonList.splice(pokemonList.indexOf(_history.saved.value), 1);
	}
	
	//check if we need to add the currently displayed pokemon back into the array
	if(_history.saved.value != _pkm1.getAttribute('dexnumber') &&
		_history.deleted.value != _pkm1.getAttribute('dexnumber')) {
		pokemonList.push(_pkm1.getAttribute('dexnumber'));
	}
	if(_history.saved.value != _pkm2.getAttribute('dexnumber') &&
		_history.deleted.value != _pkm2.getAttribute('dexnumber')) {
		pokemonList.push(_pkm2.getAttribute('dexnumber'));
	}
  

   //update the top 10 grid
   if(pokemonList.length + 1 <= topGridImgArray.length)
	{
		topGridImgArray[pokemonList.length].src = 'images/fill.png';
	}
   
   //update the eliminated count
   document.querySelector('#choice span#remaining').innerText = maxPokemon - pokemonList.length - 2;
   
   
   //pokemonList, etc. should be ready now, so let's update the pokemon
   document.querySelector('#' + _history.saved.sourceId + ' img').src = 'images/'+_history.saved.value + '.png';
   document.querySelector('#' + _history.saved.sourceId + ' img').setAttribute('dexnumber', _history.saved.value);
   document.querySelector('#' + _history.saved.sourceId + ' img').title = _history.saved.value;
   document.querySelector('#' + _history.deleted.sourceId + ' img').src = 'images/'+_history.deleted.value + '.png';
   document.querySelector('#' + _history.deleted.sourceId + ' img').setAttribute('dexnumber', _history.deleted.value);
   document.querySelector('#' + _history.deleted.sourceId + ' img').title = _history.deleted.value;
   
   if(undoArray.length == 0)
   		document.getElementById('button-undo').disabled = true;
   
   if(TESTING) {
	   console.log('action: undo pressed');
	   console.log(_history.deleted.value + '  ' + _history.saved.value);
	   displayPokemon();
   }
}

startGame = function() {
	//generate the pokemon list we will use.
	pokemonList = getPokemonList();
	
	//show the playing board
	document.getElementById('settings').style.display = 'none';
	document.getElementById('grid').style.display = 'block';
	document.getElementById('button-reset').style.display = 'block';
	
	//update the maximum pokemon number
	maxPokemon = pokemonList.length;
	document.querySelector('#choice span#total').innerText = maxPokemon;
	//update the minimum pokemon number
	document.querySelector('#choice span#remaining').innerText = maxPokemon - pokemonList.length;
	
	//set the eggs to two random pokemon
	generatePokemon(document.querySelector('#pkm1 img'), false);
	
	//enable the skip and undo buttons
	document.getElementById('button-skip').removeAttribute('disabled');
}

resetGame = function() {
	document.getElementById('grid').style.display = 'none';
	document.getElementById('remaining').innerHTML = '---';
	document.getElementById('total').innerHTML = '---';
	document.getElementById('settings').style.display = 'inherit';
	document.getElementById('button-reset').style.display = 'none';
	document.getElementById('button-skip').disabled = true;
	document.getElementById('button-undo').disabled = true;
	document.querySelector('#pkm1 img').src = 'images/egg.png';
	document.querySelector('#pkm2 img').src = 'images/egg.png';
	document.querySelector('#pkm1 img').onclick = startGame;
	document.querySelector('#pkm2 img').onclick = startGame;
	document.querySelector('#pkm1 img').removeAttribute('dexnumber');
	document.querySelector('#pkm2 img').removeAttribute('dexnumber');
	pokemonList = [];
	undoArray = [];
}

/*undoArray[ {value: 1, action: 'delete', sourceId: callLocation},
			 {value: 1, action: 'save', sourceId: callLocation} ]
	 );

	value: dexnumber
	action: 'delete' or 'save'
	sourceId: 'pkm1' or 'pkm2'
*/
var undoArray = [];

generatePokemon = function(callLocation, updateUndo) {	
	
	var uncalledLocation;
	
	if(callLocation.parentNode.id == 'pkm1') 
		uncalledLocation = document.querySelector('#pkm2 img');
	else if(callLocation.parentNode.id == 'pkm2') {
		uncalledLocation = document.querySelector('#pkm1 img');
	}
	
	
	//update the undo list
	if(updateUndo) {
		var unlikedPkm = {
			value: uncalledLocation.getAttribute('dexnumber'),
			action: 'delete',
			sourceId: uncalledLocation.parentNode.id
		};
		
		var likedPkm = {
			value: callLocation.getAttribute('dexnumber'),
			action: 'save',
			sourceId: callLocation.parentNode.id	
		};
		
		undoArray.push([unlikedPkm, likedPkm]);
	} else {
		callLocation.className = '';
		uncalledLocation.className ='';
	}
	
	//need to update the top list before changing the displayed src
	if(pokemonList.length + 1 <= topGridImgArray.length)
	{
		topGridImgArray[pokemonList.length].src = uncalledLocation.src;
	}
	
	if(pokemonList.length > 0) {
		
		var pkmId = Array.removeRandom(pokemonList);
		
		//add the liked pokemon back into the list
		if(callLocation.getAttribute('dexnumber')) {
			pokemonList.push(callLocation.getAttribute('dexnumber'));
		}
		
		//update pkm1 and pkm2
		callLocation.src = 'images/' + pkmId + '.png';
		callLocation.setAttribute('dexnumber', pkmId);
		callLocation.onclick = function(e) { generatePokemon(this, true); };
		callLocation.title = callLocation.getAttribute('dexnumber');
		
		pkmId = Array.removeRandom(pokemonList);
		
		uncalledLocation.src = 'images/' + pkmId + '.png';
		uncalledLocation.setAttribute('dexnumber', pkmId);
		uncalledLocation.onclick = function(e) { generatePokemon(this, true); };
		uncalledLocation.title = uncalledLocation.getAttribute('dexnumber');
		
		//update pokemon remaining
		document.querySelector('#choice span#remaining').innerText = maxPokemon - pokemonList.length - 2;
		if(TESTING) {
			console.log('action: generated pokemon');
			console.log(callLocation.getAttribute('dexnumber') + '  ' + uncalledLocation.getAttribute('dexnumber'));
			displayPokemon();
		}
	} else {
		//no pokemon left in list
		callLocation.onclick = '';
		uncalledLocation.onclick = '';
		uncalledLocation.className = 'hidden';
		document.querySelector('#choice span#remaining').innerText = maxPokemon;
	}
	
	if(document.getElementById('button-undo').disabled && undoArray.length > 0)
		document.getElementById('button-undo').disabled = false;
	
}

document.body.onload = initilizeGame();

