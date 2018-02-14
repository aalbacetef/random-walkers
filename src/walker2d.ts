function add(a, b ) {
  if( a.length !== b.length ) {
    throw new Error('Lengths must be the same');
  }
  return a.map( (elem, indx) => elem + b[indx] );
}

export class Walker2D {

  // drawing stuff that should be moved out
  drawScale = 1.3;
  canvas = null;
  ctx = null;

  // execution attr
  maxIter = 2000;
  delay = false;

  // state
  L: number;
  steps = [];
  trail = [];
  currPos: [number, number];


  // @TODO we will want this to be flexible
  width = 800;
  height= 600;
  iter = 0;

  hooks = {
    update() { return; },
    end() { return; }
  };

  constructor(L = 3, maxIter = 1000, seedPoint, delay = false) {
    // set walker props
    this.L = L;
    this.maxIter = maxIter;

    // add seed
    let seed = seedPoint;
    if (seed.length === 0) {
      seed = [ this.width * 0.5, this.height * 0.5 ];
    }
    this.trail.push( seed );
    this.steps[seed[0]] = [];
    this.steps[seed[0]][seed[1]] = seed;
    this.currPos = seed;

    this.delay = delay;
  }

  get currDist() {
    // this could be slightly tweaked to handle n-dimensions
    let [x, y] = this.currPos;
    let [x0, y0] = this.trail[0];
    let r = [x - x0, y - y0];
    return Math.sqrt( (r[0] * r[0]) + (r[1] * r[1]) ).toFixed(2);
  }
  start()     { this.loop(); }
  end()       { return this.hooks.end(); }
  emitState() { return this.hooks.update(); }

  setHooks(params) {
    if( params.hasOwnProperty('update') ) {
      this.hooks.update = params.update.bind(this);
    }
    if( params.hasOwnProperty('end') ) {
      this.hooks.end = params.end.bind(this);
    }
  }

  genStep() {
    let rand = Math.random();
    let L = this.L;
    let newStep;
    let tick = 1.0 / 4;

    // @TODO if this part is taken out, then we can allow different step sizes
    // considering tick = 1 / len(stepLUT) all that changes is the stepLUT
    const stepLUT = [
      [ -L, 0],
      [L, 0 ],
      [0, -L ],
      [0, L ]
    ];

    newStep = stepLUT[Math.floor(rand / tick)];

    return newStep;
  }


  // @TODO tweak for a 3D (or n-dim) case
  inBounds(nextPos) {
    const [x, y] = nextPos;
    const xAxis = (x >= 0 && x <= this.width);
    const yAxis = (y >= 0 && y <= this.height);

    return xAxis && yAxis;
  }
  inHistory(nextPos) {
    const [x, y] = nextPos;

    let x_i = Math.round( x / this.L );
    let y_i = Math.round( y / this.L  );

    // tests
    const empty = this.steps.length === 0;
    const firstX = typeof this.steps[x_i] === 'undefined';
    const firstY = !firstX && typeof this.steps[x_i][y_i] === 'undefined';

    return !(empty || firstX || firstY);
  }

  addStep(nextPos) {
    this.currPos = nextPos;
    let [x, y] = this.currPos;
    let steps = this.steps;
    let trail = this.trail;
    const L = this.L;

    let x_i = Math.round( x / this.L );
    let y_i = Math.round( y / this.L  );

    // correct computation error
    x = x_i * L;
    y = y_i * L;

    if ( typeof steps[x_i] === 'undefined' ) {
      steps[x_i] = [];
    }

    // sparse array, we need to put something there, might as well put the position tuple.
    steps[x_i][y_i] = [x, y];
    trail.push([x, y]); // now we can step back
  }

  isValidStep(nextStep) { return this.inBounds(nextStep); }



  // core of the walker
  loop() {

    let nextStep = this.genStep();
    let next;
    let cnt = 0;
    let safeguard = 20;
    let found = false;


    // get the next valid step or if necessary, signal termination (i.e: trapped)
    try {
      while(!found) {
        next = add(this.currPos, nextStep );
        // @TODO this is the small bit that changes.
        found = this.isValidStep(next);
        if( !found ) {
          nextStep = this.genStep();
        }
        cnt++;
        if( cnt >= safeguard) { throw new Error('infinite loop detected'); }
      }
    } catch(err) {
      console.log('ending');
      this.end();
      return false;
    }

    // update state and notify
    this.addStep( next );
    this.emitState();

    // end condition
    if( this.trail.length >= this.maxIter ) {
      this.end();
      return false;
    }

    // restart loop
    if( this.delay ) { // will be true for any number above 0
      setTimeout( () => this.loop, this.delay );
    } else {
      this.loop();
    }

  }

}
