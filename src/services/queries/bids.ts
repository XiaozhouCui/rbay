import { bidHistoryKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateBidAttrs } from '$services/types';
import { DateTime } from 'luxon';
import { getItem } from './items/items';

// Add a new record into the item's bid history LIST
export const createBid = async (attrs: CreateBidAttrs) => {
  const item = await getItem(attrs.itemId);
  // validating bids
  if (!item) {
    throw new Error('Item does not exist');
  }
  if (item.price >= attrs.amount) {
    throw new Error('Bid too low');
  }
  if (item.endingAt.diff(DateTime.now()).toMillis() < 0) {
    throw new Error('Item closed to bidding');
  }

  const serialized = serializeHistory(attrs.amount, attrs.createdAt.toMillis());
  // RPUSH history#a1 25:16612345095
  return client.rPush(bidHistoryKey(attrs.itemId), serialized);
};

// Returns bid history for a single item in order of increasing time
export const getBidHistory = async (itemId: string, offset = 0, count = 10) => {
  // in Redis LIST, -1 is the index of last item, 0 is first
  const startIndex = -1 * offset - count;
  const endIndex = -1 - offset;

  // LRANGE history#a1 -10 -1, get the latest 10 bids
  const range = await client.lRange(bidHistoryKey(itemId), startIndex, endIndex);

  return range.map((bid) => deserializeHistory(bid));
};

const serializeHistory = (amount: number, createdAt: number) => {
  // createdAt is unix time in milisec, ":" is just a separater
  return `${amount}:${createdAt}`;
};

const deserializeHistory = (stored: string) => {
  const [amount, createdAt] = stored.split(':');
  return {
    amount: parseFloat(amount),
    createdAt: DateTime.fromMillis(parseInt(createdAt)),
  };
};
