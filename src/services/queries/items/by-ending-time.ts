import { itemsKey, itemsByEndingAtKey } from '$services/keys';
import { client } from '$services/redis';
import { deserialize } from './deserialize';

export const itemsByEndingTime = async (
  order: 'DESC' | 'ASC' = 'DESC',
  offset = 0, // number to skip
  count = 10
) => {
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

  console.log(ids);
};
