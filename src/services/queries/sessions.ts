import { sessionsKey } from '$services/keys';
import { client } from '$services/redis';
import type { Session } from '$services/types';

export const getSession = async (id: string) => {
  const session = await client.hGetAll(sessionsKey(id));

  // if no session found, redis will return {}
  if (Object.keys(session).length === 0) {
    return null; // returning null means not signed in
  }

  return deserialize(id, session);
};

export const saveSession = async (session: Session) => {};

const deserialize = (id: string, session: { [key: string]: string }) => {
  return {
    id,
    userId: session.userId,
    username: session.username
  };
};
