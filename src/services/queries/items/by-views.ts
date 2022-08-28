import { itemsByViewsKey, itemsKey } from '$services/keys';
import { client } from '$services/redis';
import { deserialize } from './deserialize';

// return the sorted items with most views
export const itemsByViews = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
  // SORT items:views BY nosort DESC GET # GET items#*->name GET items#*->views GET items#*->endingAt GET items#*->imageUrl GET items#*->price LIMIT 0 10
  let results: any = await client.sort(itemsByViewsKey(), {
    // '*' represent each looped id in items:views
    GET: [
      '#',
      `${itemsKey('*')}->name`,
      `${itemsKey('*')}->views`,
      `${itemsKey('*')}->endingAt`,
      `${itemsKey('*')}->imageUrl`,
      `${itemsKey('*')}->price`,
    ],
    BY: 'nosort',
    DIRECTION: order,
    LIMIT: { offset, count }, // skip 0 items and get the next 10 items
  });

  // console.log(results); // ['ff7ad9', 'Chair', '7', '1661050862930', '9.99', nextItem...];

  // parse the sort output
  const items = [];
  while (results.length) {
    // in each loop, take out 6 elements from the results array, until it is empty
    const [id, name, views, endingAt, imageUrl, price, ...rest] = results;
    const item = deserialize(id, { name, views, endingAt, imageUrl, price });
    items.push(item);
    results = rest;
  }

  return items;
};
