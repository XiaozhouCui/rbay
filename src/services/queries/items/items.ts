import type { CreateItemAttrs } from '$services/types';
import { client } from '$services/redis';
import { serialize } from './serialize';
import { genId } from '$services/utils';
import { itemsKey } from '$services/keys';
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

  await client.hSet(itemsKey(id), serialized);

  return id;
};
