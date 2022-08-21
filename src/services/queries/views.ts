import { client } from '$services/redis';
import { itemsKey, itemsByViewsKey } from '$services/keys';

export const incrementView = async (itemId: string, userId: string) => {
  return Promise.all([
    // update the item's hash, increasse item's views by 1
    client.hIncrBy(itemsKey(itemId), 'views', 1),
    // update the 'items:views' sorted set, increasse item's views by 1
    client.zIncrBy(itemsByViewsKey(), 1, itemId),
  ]);
};
