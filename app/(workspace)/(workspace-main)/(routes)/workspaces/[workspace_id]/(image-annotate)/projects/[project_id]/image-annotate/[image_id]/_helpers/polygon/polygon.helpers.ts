import { Polygon } from '../../_types/types';

const hasArea = (vertices: Polygon) => {
  let doubleArea = 0;
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    doubleArea += vertices[i][0] * vertices[j][1];
    doubleArea -= vertices[j][0] * vertices[i][1];
  }

  return Math.abs(doubleArea / 2) > 0;
};

export const isPolygonValid = (vertices: Polygon) =>
  vertices.length >= 3 && hasArea(vertices);

export const getClampedCoordinates = (
  coordinates: Polygon,
  [minX, minY]: Polygon[0],
  [maxX, maxY]: Polygon[0],
) => {
  const clamp = coordinates.reduce(
    ([clampX, clampY], [x, y]) => {
      // 현재 X와 허용된 최소 X의 차이
      const diffMinX = x - minX;
      // 현재 X와 허용된 최대 X의 차이
      const diffMaxX = maxX - x;
      // 현재 Y와 허용된 최소 Y의 차이
      const diffMinY = y - minY;
      // 현재 Y와 허용된 최대 Y의 차이
      const diffMaxY = maxY - y;

      // 점이 너무 왼쪽으로 갈 경우
      if (diffMinX < 0) {
        return [Math.min(diffMinX, clampX), clampY];
      }

      // 점이 너무 오른쪽으로 갈 경우
      if (diffMaxX < 0) {
        return [Math.max(-diffMaxX, clampX), clampY];
      }

      // 점이 너무 아래로 갈 경우
      if (diffMinY < 0) {
        return [clampX, Math.min(diffMinY, clampY)];
      }

      // 점이 너무 위로 갈 경우
      if (diffMaxY < 0) {
        return [clampX, Math.max(-diffMaxY, clampY)];
      }

      return [clampX, clampY];
    },
    [0, 0],
  );

  // 주어진 X,Y 좌표가 허용된 최대값보다 크거나
  // 최소값보다 작을 경우 제한된 좌표를 반환
  if (clamp[0] !== 0 || clamp[1] !== 0) {
    return coordinates.map(([x, y]) => [x - clamp[0], y - clamp[1]]);
  }

  return coordinates;
};
