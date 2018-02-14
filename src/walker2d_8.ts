import { Walker2D } from "./walker2d";

export class Walker2DStep8 extends Walker2D {
  genStep() {
    let rand = Math.random();
    let L = this.L;
    let newStep;
    const possibleSteps = 8.0;
    let tick = 1 / possibleSteps;

    // LUT for random number -> step
    const stepLUT = [
      [ -L,  0],
      [ -L,  L],
      [  0,  L],
      [  L,  L],
      [  L,  0],
      [  L, -L],
      [  0, -L]
    ];

    newStep = stepLUT[ Math.floor( rand / tick ) ];

    return newStep;
  }
}
