import { client } from '$services/redis';
import { itemsKey, itemsByViewsKey, itemsViewsKey } from '$services/keys';

export const incrementView = async (itemId: string, userId: string) => {
  // use HyperLogLog to check if a view is genuine (not a refresh by the same user)
  const inserted = await client.pfAdd(itemsViewsKey(itemId), userId);

  if (inserted) {
    return Promise.all([
      // update the item's hash, increasse item's views by 1
      client.hIncrBy(itemsKey(itemId), 'views', 1),
      // update the 'items:views' sorted set, increasse item's views by 1
      client.zIncrBy(itemsByViewsKey(), 1, itemId),
    ]);
  }
};
