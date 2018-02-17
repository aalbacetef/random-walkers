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
var Walker2DStep8 = /** @class */ (function (_super) {
    __extends(Walker2DStep8, _super);
    function Walker2DStep8() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Walker2DStep8.prototype.genStep = function () {
        var rand = Math.random();
        var L = this.L;
        var newStep;
        var possibleSteps = 8.0;
        var tick = 1 / possibleSteps;
        // LUT for random number -> step
        var stepLUT = [
            [-L, 0],
            [-L, L],
            [0, L],
            [L, L],
            [L, 0],
            [L, -L],
            [0, -L]
        ];
        newStep = stepLUT[Math.floor(rand / tick)];
        return newStep;
    };
    return Walker2DStep8;
}(walker2d_1.Walker2D));
exports.Walker2DStep8 = Walker2DStep8;
//# sourceMappingURL=walker2d_8.js.map