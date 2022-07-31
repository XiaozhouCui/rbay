import type { CreateItemAttrs } from '$services/types';

export const serialize = (attrs: CreateItemAttrs) => {
  return {
    ...attrs,
    // convert JS DateTime to unix time in milliseconds, easy to store in redis
    createdAt: attrs.createdAt?.toMillis() || '',
    endingAt: attrs.endingAt?.toMillis() || ''
  };
};
