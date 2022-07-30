import { pageCacheKey } from '$services/keys';
import { client } from '$services/redis';

const cacheRoutes = ['/about', '/privacy', '/auth/signin', '/auth/signup'];

export const getCachedPage = (route: string) => {
	if (cacheRoutes.includes(route)) {
		// redis key example: 'pagecache#/about'
		return client.get(pageCacheKey(route));
	}
	return null;
};

export const setCachedPage = (route: string, page: string) => {
	if (cacheRoutes.includes(route)) {
		// set cached page to expire after 2 seconds
		client.set(pageCacheKey(route), page, { EX: 2 });
	}
};
