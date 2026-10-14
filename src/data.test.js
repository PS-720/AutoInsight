import { describe, expect, it } from 'vitest';
import { cars, discussions, posts, reviews } from './data';

describe('AutoInsight demo data', () => {
  it('contains the collections required by the frontend', () => {
    expect(cars.length).toBeGreaterThan(0);
    expect(discussions.length).toBeGreaterThan(0);
    expect(posts.length).toBeGreaterThan(0);
    expect(reviews.length).toBeGreaterThan(0);
  });

  it('keeps car records usable by the catalog cards', () => {
    expect(cars.every(car => car.id && car.brand && car.model && car.image)).toBe(true);
  });
});
