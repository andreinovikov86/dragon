import './styles.scss';
import Battles from './Battles';

// Initialises Battles API
const battles = new Battles();

// Remember references to the DOM elements used later
const battleContainer = document.getElementById('battle');
const infoContainer = document.getElementById('battle-id');
const weatherContainer = document.getElementById('weather');
const scoreContainer = document.getElementById('score-value');
const percentContainer = document.getElementById('win-percent');
const knightContainer = document.getElementById('knight-name');
const attackContainer = document.getElementById('knight-attack');
const armorContainer = document.getElementById('knight-armor');
const agilityContainer = document.getElementById('knight-agility');
const enduranceContainer = document.getElementById('knight-endurance');
const scaleThicknessContainer = document.getElementById('dragon-thickness');
const clawSharpnessContainer = document.getElementById('dragon-sharpness');
const wingStrengthContainer = document.getElementById('dragon-strength');
const fireBreathContainer = document.getElementById('dragon-breath');
const resultContainer = document.getElementById('battle-result');
const selector = document.getElementById('select-value');

let wins = 0;
let loses = 0;

// Add listener to start button
const startButton = document.getElementById('start-button');
const listener = () => {
	startBattles();
}
startButton.addEventListener('click', listener);

const startBattles = async() => {
	startButton.removeEventListener('click', listener);
	for (let i = 1; i <= selector[selector.selectedIndex].value; i++) {
		await startNewGame();
		await delay(2000);
	}
	startButton.addEventListener('click', listener);
}

const clearLastBattle = () => {
	battleContainer.classList.add('hidden');
	infoContainer.innerHTML = '';
	weatherContainer.innerHTML = '';

	knightContainer.innerHTML = '';
	attackContainer.innerHTML = '';
	armorContainer.innerHTML = '';
	agilityContainer.innerHTML = '';
	enduranceContainer.innerHTML = '';

	scaleThicknessContainer.innerHTML = '';
	clawSharpnessContainer.innerHTML = '';
	wingStrengthContainer.innerHTML = '';
	fireBreathContainer.innerHTML = '';

	resultContainer.innerHTML = '';
}

const updateGameInfo = (gameId, weather) => {
	infoContainer.innerHTML = gameId;
	weatherContainer.innerHTML = 'Weather: ' + weather;
}

const updateScoreInfo = () => {
	scoreContainer.innerHTML = wins + ':' + loses;
	percentContainer.innerHTML = Math.round(wins / (wins + loses) * 100) + '%';
}

const updateKnightInfo = (knight) => {
	knightContainer.innerHTML = knight.name;
	attackContainer.innerHTML = knight.attack;
	armorContainer.innerHTML = knight.armor;
	agilityContainer.innerHTML = knight.agility;
	enduranceContainer.innerHTML = knight.endurance;
}

const updateDragonInfo = (dragon) => {
	scaleThicknessContainer.innerHTML = dragon.scaleThickness;
	clawSharpnessContainer.innerHTML = dragon.clawSharpness;
	wingStrengthContainer.innerHTML = dragon.wingStrength;
	fireBreathContainer.innerHTML = dragon.fireBreath;
}

const updateResults = (message) => {
	resultContainer.innerHTML = message;
	battleContainer.classList.remove('hidden');
}

const startNewGame = async() => {
	let results = {};

	await clearLastBattle();

	try {
		results = await battles.getGame();
	} catch (error) {
		displayError(error);
	}

	updateKnightInfo(results.knight);
	await checkWeather(results);
};

const checkWeather = async(game) => {
	let results = {};

	try {
		results = await battles.getWeather(game.gameId);
	} catch (error) {
		displayError(error);
	}

	updateGameInfo(game.gameId, results.message._text);
	await generateDragon(game, results);
};

const generateDragon = async(game, weather) => {
	let results = {};

	try {
		results = await battles.getDragon(game.knight, weather);
	} catch (error) {
		displayError(error);
	}

	if (results.dragon) updateDragonInfo(results.dragon);
	await startBattle(game.gameId, results);
};

const startBattle = async(game, weather) => {
	let results = {};

	try {
		results = await battles.getResult(game, weather);
	} catch (error) {
		displayError(error);
	}
	if (results.status === 'Victory') {
		wins++;
	} else {
		loses++;
	}
	updateResults(results.status + '!!! ' + results.message);
	updateScoreInfo();
};

const delay = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Display error message
const displayError = (message) => {
	alert(message);
};
