import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	// set hash in redis: HSET car color red year 1950
	await client.hSet('car', {
		color: 'red',
		year: 1950,
		engine: { clylinders: 8 },
		owner: null || '', // node-redis cannot process 'null' value
		service: undefined || ''
	});

	const car = await client.hGetAll('car');

	// when looking for a non-exist hash, it will return an empty object instead of null
	// const car = await client.hGetAll('car#5ho8f1'); // result is {}

	if (Object.keys(car).length === 0) {
		console.log('Car not found, respond with 404');
		return;
	}

	console.log(car);
};
run();
