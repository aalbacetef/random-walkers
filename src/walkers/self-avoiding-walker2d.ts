import { Walker2D } from "./walker2d";

export class SelfAvoidingWalker2D extends Walker2D {

  addStep(nextPos) {

    this.currPos = nextPos;
    let [x, y] = this.currPos;
    let steps = this.steps;

    let x_i = Math.round( x / this.L );
    let y_i = Math.round( y / this.L  );

    if ( typeof steps[x_i] === 'undefined' ) {
      steps[x_i] = [];
    }

    // disallow adding a step that has lready been taken
    if (typeof steps[x_i][y_i] === 'undefined' ) {
      // sparse array, we need to put something there, might as well put the position tuple.
      steps[x_i][y_i] = [x, y];
      this.trail.push([x, y]); // now we can step back
    } else {
      // for now throw an error (this should've been caught earlier)
      throw new Error(`Already been here, ${x}, ${y} \n ${steps}`);
    }
  }

  isValidStep(nextStep) {
    return this.inBounds(nextStep) && !this.inHistory(nextStep);
  }
}
