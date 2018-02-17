"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function add(a, b) {
    if (a.length !== b.length) {
        throw new Error('Lengths must be the same');
    }
    return a.map(function (elem, indx) { return elem + b[indx]; });
}
var Walker2D = /** @class */ (function () {
    function Walker2D(L, maxIter, seedPoint, delay) {
        if (L === void 0) { L = 3; }
        if (maxIter === void 0) { maxIter = 1000; }
        if (delay === void 0) { delay = false; }
        // drawing stuff that should be moved out
        this.drawScale = 1.3;
        this.canvas = null;
        this.ctx = null;
        // execution attr
        this.maxIter = 2000;
        this.delay = false;
        this.steps = [];
        this.trail = [];
        // @TODO we will want this to be flexible
        this.width = 800;
        this.height = 600;
        this.iter = 0;
        this.hooks = {
            update: function () { return; },
            end: function () { return; }
        };
        // set walker props
        this.L = L;
        this.maxIter = maxIter;
        // add seed
        var seed = seedPoint;
        if (seed.length === 0) {
            seed = [this.width * 0.5, this.height * 0.5];
        }
        this.trail.push(seed);
        this.steps[seed[0]] = [];
        this.steps[seed[0]][seed[1]] = seed;
        this.currPos = seed;
        this.delay = delay;
    }
    Object.defineProperty(Walker2D.prototype, "currDist", {
        get: function () {
            // this could be slightly tweaked to handle n-dimensions
            var _a = this.currPos, x = _a[0], y = _a[1];
            var _b = this.trail[0], x0 = _b[0], y0 = _b[1];
            var r = [x - x0, y - y0];
            return Math.sqrt((r[0] * r[0]) + (r[1] * r[1])).toFixed(2);
        },
        enumerable: true,
        configurable: true
    });
    Walker2D.prototype.start = function () { this.loop(); };
    Walker2D.prototype.end = function () { return this.hooks.end(); };
    Walker2D.prototype.emitState = function () { return this.hooks.update(); };
    Walker2D.prototype.setHooks = function (params) {
        if (params.hasOwnProperty('update')) {
            this.hooks.update = params.update.bind(this);
        }
        if (params.hasOwnProperty('end')) {
            this.hooks.end = params.end.bind(this);
        }
    };
    Walker2D.prototype.genStep = function () {
        var rand = Math.random();
        var L = this.L;
        var newStep;
        var tick = 1.0 / 4;
        // @TODO if this part is taken out, then we can allow different step sizes
        // considering tick = 1 / len(stepLUT) all that changes is the stepLUT
        var stepLUT = [
            [-L, 0],
            [L, 0],
            [0, -L],
            [0, L]
        ];
        newStep = stepLUT[Math.floor(rand / tick)];
        return newStep;
    };
    // @TODO tweak for a 3D (or n-dim) case
    Walker2D.prototype.inBounds = function (nextPos) {
        var x = nextPos[0], y = nextPos[1];
        var xAxis = (x >= 0 && x <= this.width);
        var yAxis = (y >= 0 && y <= this.height);
        return xAxis && yAxis;
    };
    Walker2D.prototype.inHistory = function (nextPos) {
        var x = nextPos[0], y = nextPos[1];
        var x_i = Math.round(x / this.L);
        var y_i = Math.round(y / this.L);
        // tests
        var empty = this.steps.length === 0;
        var firstX = typeof this.steps[x_i] === 'undefined';
        var firstY = !firstX && typeof this.steps[x_i][y_i] === 'undefined';
        return !(empty || firstX || firstY);
    };
    Walker2D.prototype.addStep = function (nextPos) {
        this.currPos = nextPos;
        var _a = this.currPos, x = _a[0], y = _a[1];
        var steps = this.steps;
        var trail = this.trail;
        var L = this.L;
        var x_i = Math.round(x / this.L);
        var y_i = Math.round(y / this.L);
        // correct computation error
        x = x_i * L;
        y = y_i * L;
        if (typeof steps[x_i] === 'undefined') {
            steps[x_i] = [];
        }
        // sparse array, we need to put something there, might as well put the position tuple.
        steps[x_i][y_i] = [x, y];
        trail.push([x, y]); // now we can step back
    };
    Walker2D.prototype.isValidStep = function (nextStep) { return this.inBounds(nextStep); };
    // core of the walker
    Walker2D.prototype.loop = function () {
        var _this = this;
        var nextStep = this.genStep();
        var next;
        var cnt = 0;
        var safeguard = 20;
        var found = false;
        // get the next valid step or if necessary, signal termination (i.e: trapped)
        try {
            while (!found) {
                next = add(this.currPos, nextStep);
                // @TODO this is the small bit that changes.
                found = this.isValidStep(next);
                if (!found) {
                    nextStep = this.genStep();
                }
                cnt++;
                if (cnt >= safeguard) {
                    throw new Error('infinite loop detected');
                }
            }
        }
        catch (err) {
            this.end();
            return false;
        }
        // update state and notify
        this.addStep(next);
        this.emitState();
        // end condition
        if (this.trail.length >= this.maxIter) {
            this.end();
            return false;
        }
        // restart loop
        if (this.delay) {
            setTimeout(function () { return _this.loop; }, this.delay);
        }
        else {
            this.loop();
        }
    };
    return Walker2D;
}());
exports.Walker2D = Walker2D;
//# sourceMappingURL=walker2d.js.map