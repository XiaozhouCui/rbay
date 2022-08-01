import type { Item } from '$services/types';
import { DateTime } from 'luxon';

export const deserialize = (id: string, item: { [key: string]: string }): Item => {
  return {
    id,
    name: item.name,
    ownerId: item.ownerId,
    imageUrl: item.imageUrl,
    description: item.description,
    highestBidUserId: item.highestBidUserId,
    createdAt: DateTime.fromMillis(parseInt(item.createdAt)),
    endingAt: DateTime.fromMillis(parseInt(item.endingAt)),
    views: parseInt(item.views),
    likes: parseInt(item.likes),
    bids: parseInt(item.bids),
    price: parseFloat(item.price),
  };
};
