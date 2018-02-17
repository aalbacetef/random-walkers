"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var walker2d_1 = require("./walker2d");
var SelfAvoidingWalker2D = /** @class */ (function (_super) {
    __extends(SelfAvoidingWalker2D, _super);
    function SelfAvoidingWalker2D() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelfAvoidingWalker2D.prototype.addStep = function (nextPos) {
        this.currPos = nextPos;
        var _a = this.currPos, x = _a[0], y = _a[1];
        var steps = this.steps;
        var x_i = Math.round(x / this.L);
        var y_i = Math.round(y / this.L);
        if (typeof steps[x_i] === 'undefined') {
            steps[x_i] = [];
        }
        // disallow adding a step that has lready been taken
        if (typeof steps[x_i][y_i] === 'undefined') {
            // sparse array, we need to put something there, might as well put the position tuple.
            steps[x_i][y_i] = [x, y];
            this.trail.push([x, y]); // now we can step back
        }
        else {
            // for now throw an error (this should've been caught earlier)
            throw new Error("Already been here, " + x + ", " + y + " \n " + steps);
        }
    };
    SelfAvoidingWalker2D.prototype.isValidStep = function (nextStep) {
        return this.inBounds(nextStep) && !this.inHistory(nextStep);
    };
    return SelfAvoidingWalker2D;
}(walker2d_1.Walker2D));
exports.SelfAvoidingWalker2D = SelfAvoidingWalker2D;
//# sourceMappingURL=self-avoiding-walker2d.js.map