// to avoid typing errors, use the below functions to generate keys
export const pageCacheKey = (id: string) => `pagecache#${id}`;
export const usersKey = (userId: string) => `users#${userId}`;
export const sessionsKey = (sessionId: string) => `sessions#${sessionId}`;
export const usernamesUniqueKey = () => 'usernames:unique';
export const userLikesKey = (userId: string) => `users:likes#${userId}`;
export const usernamesKey = () => 'usernames';

// items
export const itemsKey = (itemId: string) => `items#${itemId}`;
export const itemsByViewsKey = () => 'items:views';
export const itemsByEndingAtKey = () => 'items:endingAt';
export const itemsViewsKey = (itemId: string) => `items:views#${itemId}`;
