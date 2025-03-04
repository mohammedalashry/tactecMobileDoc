// components/TacticalPadComponents/utils/pathUtils.ts
import {SkPath, SkRect} from '@shopify/react-native-skia';

/**
 * Checks if a point is near a path within a threshold
 * @param x - X coordinate of the point
 * @param y - Y coordinate of the point
 * @param path - The Skia path to check against
 * @param threshold - Distance threshold (default: 8)
 * @returns boolean - True if the point is within threshold of the path
 */
export const isPointNearPath = (
  x: number,
  y: number,
  path: SkPath,
  threshold: number = 8,
): boolean => {
  // Quick bounds check for optimization
  const bounds: SkRect = path.getBounds();
  if (
    x < bounds.x - threshold ||
    x > bounds.x + bounds.width + threshold ||
    y < bounds.y - threshold ||
    y > bounds.y + bounds.height + threshold
  ) {
    return false;
  }

  // If path has very few points, skip detailed check
  const numPoints = path.countPoints();
  if (numPoints < 2) return false;

  // Check distance to each segment in the path
  for (let i = 0; i < numPoints - 1; i++) {
    const point1 = path.getPoint(i);
    const point2 = path.getPoint(i + 1);

    // Get distance to the line segment
    const distanceToSegment = distanceToLineSegment(
      x,
      y,
      point1.x,
      point1.y,
      point2.x,
      point2.y,
    );

    if (distanceToSegment <= threshold) {
      return true;
    }
  }

  return false;
};

/**
 * Calculates distance from a point to a line segment
 */
export const distanceToLineSegment = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number => {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  // Avoid division by zero
  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    // Point is closest to the start point
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    // Point is closest to the end point
    xx = x2;
    yy = y2;
  } else {
    // Point is closest to the middle of the segment
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
};
