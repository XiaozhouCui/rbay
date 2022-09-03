import type { CreateBidAttrs } from '$services/types';
import { DateTime } from 'luxon';

// Add a new record into the bid history LIST
export const createBid = async (attrs: CreateBidAttrs) => {};

// Returns bid history for a single item in order of increasing time
export const getBidHistory = async (itemId: string, offset = 0, count = 10) => {
  return [];
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
