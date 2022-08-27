import { itemsKey, itemsByEndingAtKey } from '$services/keys';
import { client } from '$services/redis';
import { deserialize } from './deserialize';

export const itemsByEndingTime = async (
  order: 'DESC' | 'ASC' = 'DESC',
  offset = 0, // number to skip
  count = 10
) => {
  // get sorted set of item ids by ending time
  const ids = await client.zRange(
    itemsByEndingAtKey(),
    // unix time from now to infinity
    Date.now(),
    '+inf',
    {
      BY: 'SCORE',
      LIMIT: {
        offset,
        count,
      },
    }
  );

  // loop through all item ids to get full item details (item hashes) as serialized data
  const results = await Promise.all(ids.map((id) => client.hGetAll(itemsKey(id))));

  // return the deserialized items
  return results.map((item, i) => deserialize(ids[i], item));
};
