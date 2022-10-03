import type { CreateItemAttrs } from '$services/types';
import { client } from '$services/redis';
import { serialize } from './serialize';
import { genId } from '$services/utils';
import { itemsKey, itemsByPriceKey, itemsByViewsKey, itemsByEndingAtKey } from '$services/keys';
import { deserialize } from './deserialize';

export const getItem = async (id: string) => {
  const item = await client.hGetAll(itemsKey(id));

  if (Object.keys(item).length === 0) {
    return null;
  }

  return deserialize(id, item);
};

export const getItems = async (ids: string[]) => {
  // pipeline: run multiple commands at the same time
  const commands = ids.map((id) => client.hGetAll(itemsKey(id)));

  const results = await Promise.all(commands);

  return results.map((result, i) => {
    if (Object.keys(result).length === 0) {
      return null;
    }

    return deserialize(ids[i], result);
  });
};

export const createItem = async (attrs: CreateItemAttrs) => {
  const id = genId();

  // convert DateTime into unix time
  const serialized = serialize(attrs);

  // use pipeline to process multiple commands when creating an item
  await Promise.all([
    // create the item's hash
    client.hSet(itemsKey(id), serialized),
    // add a record to the 'items:views' sorted set
    client.zAdd(itemsByViewsKey(), {
      value: id,
      score: 0, // a new item initially has 0 views
    }),
    // add a record to the 'items:endingAt' sorted set
    client.zAdd(itemsByEndingAtKey(), {
      value: id,
      score: attrs.endingAt.toMillis(), // unix timestamp
    }),
    // add a record to the 'items:price' sorted set for the price of all items
    client.zAdd(itemsByPriceKey(), {
      value: id,
      score: 0, // initial price is 0 before first bid
    }),
  ]);

  return id;
};
