import { itemsKey, userLikesKey } from '$services/keys';
import { client } from '$services/redis';
import { getItems } from './items';

export const userLikesItem = async (itemId: string, userId: string) => {
  // SISMEMBER users:likes#userId itemId
  return client.sIsMember(userLikesKey(userId), itemId);
};

export const likedItems = async (userId: string) => {
  // fetch all the item IDs from this user's liked set
  const ids = await client.sMembers(userLikesKey(userId));

  // fetch all the item hashes with those IDs and return as an array
  return getItems(ids);
};

export const likeItem = async (itemId: string, userId: string) => {
  // SADD users:likes#userId itemId (should return 1)
  const inserted = await client.sAdd(userLikesKey(userId), itemId);

  // if inserted successfully (inserted === 1)
  if (inserted) {
    // increase items hash 'likes' by 1: HINCRBY items#idemId likes 1
    return client.hIncrBy(itemsKey(itemId), 'likes', 1);
  }
};

export const unlikeItem = async (itemId: string, userId: string) => {
  // SREM users:likes#userId itemId (should return 1)
  const removed = await client.sRem(userLikesKey(userId), itemId);

  // if removed successfully (removed === 1)
  if (removed) {
    // HINCRBY items#idemId likes -1
    return client.hIncrBy(itemsKey(itemId), 'likes', -1);
  }
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
  // find set intersection
  const ids = await client.sInter([userLikesKey(userOneId), userLikesKey(userTwoId)]);

  return getItems(ids);
};
