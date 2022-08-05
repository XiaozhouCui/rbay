import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
  // set hash in redis: HSET car color red year 1950
  await client.hSet('car1', {
    color: 'red',
    year: 1950,
    owner: null || '', // node-redis cannot process 'null' value
    service: undefined || '',
  });
  await client.hSet('car2', {
    color: 'green',
    year: 1955,
  });
  await client.hSet('car3', {
    color: 'blue',
    year: 1960,
  });

  // pipeline: run multiple commands at the same time
  const commands = [1, 2, 3].map((id) => client.hGetAll(`car${id}`));

  const results = await Promise.all(commands);

  console.log(results);

  // when looking for a non-exist hash, it will return an empty object instead of null
  // const car = await client.hGetAll('car#5ho8f1'); // result is {}
};
run();
