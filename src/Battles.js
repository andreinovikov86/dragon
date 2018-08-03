import axios from 'axios';
import convert from 'xml-js';

const AQUARIUS = 'HVA';
const FUNDEFINEDG = 'FUNDEFINEDG';
const REGULAR_NORMAL_WEATHER = 'NMR';
const STORM = 'SRO';
const THE_LONG_DRY = 'T E';

const battlesAjax = axios.create({
		baseURL: 'https://www.dragonsofmugloar.com'
	});

export default class Battles {
	constructor() {}

	// New game from API
	async getGame() {
		//console.info('start new game');
		let query = `/api/game/`;

		const { data } = await battlesAjax.get(query);
		if (data.Error) {
			throw data.Error;
		}

		return data;
	}

	// Current weather from API by its game id.
	async getWeather(gameId) {
		//console.info('get weather');
		let query = `/weather/api/report/${gameId}`;

		const { data } = await battlesAjax.get(query);
		if (data.Error) {
			throw data.Error;
		}

		return convert.xml2js(data, {
			ignoreDeclaration: true,
			compact: true
		}).report;
	}

	// Returns a dragon for current weather and knight's skills
	async getDragon(knight, weather) {
		let dragon = {
			'dragon': {
				'scaleThickness': 5,
				'clawSharpness': 5,
				'wingStrength': 5,
				'fireBreath': 5
			}
		};

		switch (weather.code._text) {
		case REGULAR_NORMAL_WEATHER:
			let skills = {
				'scaleThickness': knight.attack - 1,
				'clawSharpness': knight.armor - 1,
				'wingStrength': knight.agility - 1,
				'fireBreath': knight.endurance - 1
			};
			let min = 'scaleThickness';
			let max = 'fireBreath';
			for (let prop in skills) {
				if (skills[prop] > skills[max])
					max = prop;
				if (skills[prop] < skills[min])
					min = prop;
			}
			skills[max] += 3;
			skills[min]++;
			dragon = {
				'dragon': skills
			};
			break;
		case AQUARIUS:
			dragon = {
				'dragon': {
					'scaleThickness': 5,
					'clawSharpness': 10,
					'wingStrength': 5,
					'fireBreath': 0
				}
			};
			break;
		case THE_LONG_DRY:
		case FUNDEFINEDG:
			break;
		case STORM:
			dragon = {};
			break;
		default:
		}

		return dragon;
	}

	// Result for a game from API by its game id and own dragon.
	async getResult(gameId, message) {
		//console.info('get game result');
		let query = `/api/game/${gameId}/solution`;

		const { data } = await battlesAjax.put(query, message);
		if (data.Error) {
			throw data.Error;
		}

		return data;
	}
}
