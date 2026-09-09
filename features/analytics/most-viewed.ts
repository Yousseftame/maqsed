export const MOST_VIEWED_THRESHOLD = 20;

export function isMostViewed(views: unknown) {
  return (Number(views) || 0) >= MOST_VIEWED_THRESHOLD;
}
