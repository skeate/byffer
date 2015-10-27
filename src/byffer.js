export const EUCLIDEAN = 1;
export const SPHERICAL = 2;
export const HYPERBOLIC = 3;

function roundTo(x, places) {
  let exp = Math.pow(10, places);
  return Math.round(x * exp) / exp;
}

export function ccw(points) {
  if (points.length < 3) return false;
  let sum = 0;
  let i, len;
  for (i = 1, len = points.length; i <= len; i++) {
    sum += (points[i % len].x - points[i-1].x) * (points[i % len].y + points[i-1].y);
  }
  return sum < 0;
}

/**
 * Produces a polygon that is (roughly) the perimeter of all points within
 * `radius` of the line. Basically looks like a capsule.
 *
 * @param {Array<Point>} points Two objects with x and y properties
 * representing the endpoints of the line.
 * @param {Number} radius The size of the area around the line to enclose
 * @param {Object} options
 * @param {Number} options.surface The surface type, one of `Byffer.{EUCLIDEAN,
 * SPHERICAL, HYPERBOLIC}`. Defaults to `Byffer.EUCLIDEAN`.
 * @param {Number} options.steps The number of points to approximate the
 * semicircle at the ends, not counting the two on either end. For example, if
 * this is 1, you'll get triangular endcaps. Defaults to 20.
 * @param {Number} options.precision The number of decimal places to round
 * numbers to. Defaults to 5.
 * @returns {Array<Point>}
 */
export function expandLine([a, b], radius, {surface=EUCLIDEAN, steps=20, precision=5}={}) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const slope = dy / dx;
  const normal = -1/slope;
  let getCorners = (point, m, starting) => {
    let _dx = (m < 0 ? -1 : 1) * Math.sqrt((radius * radius) / (m * m + 1));
    let _dy = m * _dx;
    if (isNaN(_dy)) _dy = radius;
    let points = [
      {x: point.x + _dx, y: point.y + _dy},
      {x: point.x - _dx, y: point.y - _dy}
    ];
    if (!starting) points.reverse();
    if (dx > 0) {
      return _dy > 0 ? points : points.reverse();
    }
    else if (dx < 0) {
      return _dy < 0 ? points : points.reverse();
    }
    else if (dy < 0) {
      return _dx < 0 ? points : points.reverse();
    }
    else {
      return _dx > 0 ? points : points.reverse();
    }
  };
  let corners = getCorners(a, normal, true).concat(getCorners(b, normal, false));
  // consider simple case: steps = 1.
  // this means we want one point in addition to the two on either end of the
  // semicircle. 3 dots, two sections of 90deg each. but in radians for passing
  // to Math.trig funcs
  const angle = Math.PI / (steps + 1);
  let getIntermediates = (center, firstPoint) => {
    const baseAngle = Math.atan((firstPoint.y - center.y) / (firstPoint.x - center.x));
    let intermediates = [];
    for (let i = 1; i <= steps; i++) {
      let nextAngle = baseAngle + angle * i;
      intermediates.push({
        x: roundTo(Math.cos(nextAngle) * radius + center.x, precision),
        y: roundTo(Math.sin(nextAngle) * radius + center.y, precision)
      });
    }
    return intermediates;
  };
  let intermediatesA = getIntermediates(a, corners[0]);
  let intermediatesB = getIntermediates(b, corners[2]);
  let points = [
    corners[0],
    ...intermediatesA,
    corners[1],
    corners[2],
    ...intermediatesB,
    corners[3]
  ];
  return radius > 0 ? points : points.reverse();
}

/**
 * Produces a polygon that is (roughly) the perimeter of all points within
 * `radius` of the line. Basically looks like a capsule.
 *
 * @param {Array<Point>} points The points of the polygon or polyline to expand
 * @param {Number} radius The size of the area around the line to enclose
 * @param {Object} options
 * @param {Number} options.surface The surface type, one of `Byffer.{EUCLIDEAN,
 * SPHERICAL, HYPERBOLIC}`. Defaults to `Byffer.EUCLIDEAN`.
 * @param {Number} options.steps The number of points to approximate the
 * semicircle at the ends, not counting the two on either end. For example, if
 * this is 1, you'll get triangular endcaps. Defaults to 20.
 * @param {Number} options.precision The number of decimal places to round
 * numbers to. Defaults to 5.
 * @returns {Array<Point>}
 */
export function expandLines(points, radius, {surface=EUCLIDEAN, steps=20, precision=5}={}) {
  let buffers = [];
  for (let i = 1, len = points.length; i < len; i++) {
    buffers.push(expandLine([points[i], points[i-1]], radius, {surface, steps, precision}));
  }
  return buffers.reduce((a, b) => a.concat(b));
}

export function combineShapes(shapeA, shapeB) {
  let copyAndLabel = shape => (p, i, a) => {
    return {
      ...p,
      shape,
      adjacent: [
        (i + 1) % a.length,
        (i - 1 + a.length) % a.length
      ]
    }
  };
  let labeled = [shapeA.map(copyAndLabel(0)), shapeB.map(copyAndLabel(1))];
  let interesting = new Heap(labeled[0].concat(labeled[1]), (a, b) => a.x < b.x);
  while (interesting.length) {
    let next = interesting.pop();
    console.log(next);
    console.log( labeled[next.shape][next.adjacent[0]] )
    console.log( labeled[next.shape][next.adjacent[1]] )
  }
}
