import Heap from 'diesal/lib/Heap';

/**
 * Breaks a shape down into edges, in the form of SweepEvents.
 * @param {Array<Object>} shape The shape to decompose
 * @returns {Array<SweepEvent>} a list of SweepEvents
 */
export function decomposeShape(shape) {
  let sweepEvents = [];
  // abuse reduce a bit to get points pairwise, wrapping around
  shape.reduce((a, b) => {
    let left = {
      left: true
    };
    let right = {
      left: false,
      other: left
    };
    left.other = right;
    [left.point, right.point] = (a.x < b.x) ? [a, b] : [b, a];
    return b;
  }, shape[shape.length - 1]);
}

export function combineShapes(shapeA, shapeB) {
  let edges = decomposeShape(shapeA).concat(decomposeShape(shapeB));
}

