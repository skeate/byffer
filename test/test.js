import * as Byffer from '../src/byffer';
import chai from 'chai';
chai.should();

describe('ccw', () => {
  it('should correctly determine if something is ccw', () => {
    let ccwTriangle = [
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 1}
    ];
    let cwTriangle = [
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: 1, y: 1}
    ];
    Byffer.ccw(ccwTriangle).should.equal(true);
    Byffer.ccw(cwTriangle).should.equal(false);
  })
})

describe('expandLine', () => {
  it('should return the right number of points', () => {
    let flatShape = Byffer.expandLine(
      [{x: 0, y: 0}, {x: 1, y: 0}],
      5,
      {steps: 1}
    );
    let angledShape = Byffer.expandLine(
      [{x: 1, y: 2}, {x: 3, y: 4}],
      5,
      {steps: 3}
    );
    flatShape.length.should.equal(6);
    angledShape.length.should.equal(10);
  });

  it('should be counter-clockwise if radius is positive, cw otherwise', () => {
    let flatShape = Byffer.expandLine(
      [{x: 0, y: 0}, {x: 1, y: 0}],
      5
    );
    let flatShapeNegative = Byffer.expandLine(
      [{x: 0, y: 0}, {x: 1, y: 0}],
      -5
    );
    Byffer.ccw(flatShape).should.equal(true);
    Byffer.ccw(flatShapeNegative).should.equal(false);
  });

  it('should return the correct points', () => {
    let flatShape = Byffer.expandLine(
      [{x: 0, y: 0}, {x: 1, y: 0}],
      5,
      {steps: 1}
    );
    flatShape.should.deep.equal([
      {x:  0, y:  5},
      {x: -5, y:  0},
      {x:  0, y: -5},
      {x:  1, y: -5},
      {x:  6, y:  0},
      {x:  1, y:  5}
    ]);
  });
});

describe('combineShapes', () => {
  it('should return the correct points', () => {
    /* Shapes will look like
     *   ┌───┐
     * ┌─┼─┐ │
     * │ └─┼─┘
     * └───┘
     * So combined, should be
     *   ┌───┐
     * ┌─┘   │
     * │   ┌─┘
     * └───┘
     */
    let squareA = [
      {x: 0, y: 0},
      {x: 2, y: 0},
      {x: 2, y: 2},
      {x: 0, y: 2},
      {x: 0, y: 0}
    ];
    let squareB = [
      {x: 1, y: 1},
      {x: 3, y: 1},
      {x: 3, y: 3},
      {x: 1, y: 3},
      {x: 1, y: 1}
    ];
    Byffer.combineShapes(squareA, squareB).should.deep.equal([
      {x: 0, y: 0},
      {x: 2, y: 0},
      {x: 2, y: 1},
      {x: 3, y: 1},
      {x: 3, y: 3},
      {x: 1, y: 3},
      {x: 1, y: 2},
      {x: 0, y: 2},
      {x: 0, y: 0}
    ]);
  });
});

describe.skip('expandLines', () => {
  it('should return the right number of points', () => {
    let square = [
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 1},
      {x: 0, y: 0}
    ];
    let expandedSquare = Byffer.expandLines(square, 1, {steps: 1});
    expandedSquare.length.should.equal(8);
  });
});
