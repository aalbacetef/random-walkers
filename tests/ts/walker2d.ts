import { Walker2D } from '../../index';

// @TODO Will need to test case with L != 1 (maybe a floating point?)

// tslint:disable
describe('testing the main features of the walker2d', function(){

  it('should initialize currPos correctly', function(){

    // initialize a random walker at [0, 0]
    let testWalker = new Walker2D(
      1, // L
      1000, // maxIters
      [ 0, 0] // intialPosition
    );

    // ensure we are the point we expect
    expect( testWalker.currPos ).toEqual([0 , 0]);

    console.log('Passed test');
  });

  describe('testing that the walker cannot go out of bounds', function(){

    // initialize a random walker at [0, 0]
    let testWalker = new Walker2D(
      1, // L
      1000, // maxIters
      [ 0, 0] // intialPosition
    );

    it('should not be able to take on negative x-values', function() {
      // starting at [0, 0] with L = 1 means nextStep === nextPos
      let nextStep = [-1, 0];
      expect( testWalker.inBounds(nextStep) ).toBe(false);
    });

    it('should not have x-values that exceed the width', function() {
      // starting at [0, 0] with L = 1 means nextStep === nextPos
      let nextStep = [0, -1];
      expect( testWalker.inBounds(nextStep)).toBe(false);
    });

    it('should not be able to on negative y-values', function() {
      // starting at [0, 0] with L = 1 means nextStep === nextPos
      let nextStep = [0, -1];
      expect( testWalker.inBounds(nextStep)).toBe(false);
    });

    it('should not have y-values that exceed the height', function() {
      // starting at [0, 0] with L = 1 means nextStep === nextPos
      let nextStep = [0, -1];
      expect( testWalker.inBounds(nextStep)).toBe(false);
    });


  });


});
