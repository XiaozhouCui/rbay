import { userLikesKey } from '$services/keys';
import { client } from '$services/redis';

export const userLikesItem = async (itemId: string, userId: string) => {
  // SISMEMBER users:likes#userId itemId
  return client.sIsMember(userLikesKey(userId), itemId);
};

export const likedItems = async (userId: string) => {};

export const likeItem = async (itemId: string, userId: string) => {
  // add to redis likes set: SADD users:likes#userId itemId
  await client.sAdd(userLikesKey(userId), itemId);
};

export const unlikeItem = async (itemId: string, userId: string) => {
  // remove from redis likes set: SREM users:likes#userId itemId
  await client.sRem(userLikesKey(userId), itemId);
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {};
