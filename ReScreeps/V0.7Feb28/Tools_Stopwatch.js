"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Stopwatch {
    constructor() {
        this.cummulativeTime = 0;
        this.startTime = Game.time;
        this.laps = [];
    }
    Reset() {
        this.laps = [];
        this.startTime = 0;
        this.cummulativeTime = 0;
    }
    Start() {
        if (this.startTime == 0) {
            this.startTime = Game.cpu.getUsed();
        }
    }
    Stop() {
        if (this.startTime > 0) {
            this.cummulativeTime += Game.cpu.getUsed() - this.startTime;
            this.startTime = 0;
        }
    }
    Lap() {
        if (this.startTime > 0) {
            let lapTime = Game.cpu.getUsed() - this.startTime;
            this.cummulativeTime += lapTime;
            this.startTime = lapTime - this.startTime;
            this.laps.push(lapTime);
        }
    }
}
exports.Stopwatch = Stopwatch;
//# sourceMappingURL=Stopwatch.js.map
