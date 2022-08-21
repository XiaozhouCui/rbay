import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usersKey, usernamesUniqueKey, usernamesKey } from '$services/keys';

// use 'usernames' sorted set to look up their ID
export const getUserByUsername = async (username: string) => {};

// Once we get the user ID, use the ID to get the user's hash, then compare passwords
export const getUserById = async (id: string) => {
  const user = await client.hGetAll(usersKey(id));

  return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
  const id = genId(); // hexadecimal string, e.g. "3a9c03e7f2"

  // see if the usuername is already in the set of unsernames
  // redis: SISMEMBER usernames:unique <username>
  const exists = await client.sIsMember(usernamesUniqueKey(), attrs.username);

  // if so, throw an error
  if (exists) {
    throw new Error('Username is taken');
  }

  // otherwise, continue to create user account (user's hash)
  await client.hSet(usersKey(id), serialize(attrs));
  // add to redis usernames set: SADD usernames:unique <username> (should return 1)
  await client.sAdd(usernamesUniqueKey(), attrs.username);
  // add a new record to the 'unsernames' sorted set
  await client.zAdd(usernamesKey(), {
    value: attrs.username,
    score: parseInt(id, 16), // convert hexadecimal string into a number
  });

  return id;
};

const serialize = (user: CreateUserAttrs) => {
  return {
    username: user.username,
    password: user.password,
  };
};

const deserialize = (id: string, user: { [key: string]: string }) => {
  return {
    id,
    username: user.username,
    password: user.password,
  };
};
