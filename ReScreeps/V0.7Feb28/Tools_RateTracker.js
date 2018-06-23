"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwarmMemory_1 = require("Tools_SwarmMemory");
const DEPTH = 'Depth';
const WIDTH = 'Width';
const TRACE = 'Trace';
class RateTracker extends SwarmMemory_1.ChildMemory {
    Save() {
        this.SetData(DEPTH, this.Depth);
        this.SetData(WIDTH, this.Width);
        this.SetData(TRACE, this.tracer);
        super.Save();
    }
    Load() {
        if (!super.Load()) {
            return false;
        }
        this.Depth = this.GetData(DEPTH) || 3;
        this.Width = this.GetData(WIDTH) || 10;
        this.tracer = this.GetData(TRACE) || [[]];
        return true;
    }
    InsertData(inVal) {
        this.insertAt(inVal, 0);
    }
    GetRate() {
        if (this.tracer.length < this.Depth - 1) {
            return 0;
        }
        let cummulative = _.sum(this.tracer[this.Depth - 1]);
        return cummulative / this.tracer[this.Depth - 1].length;
    }
    insertAt(inVal, level) {
        this.tracer[level].push(inVal);
        if (this.tracer[level].length >= this.Width) {
            if (level < this.Depth - 1) {
                if (this.tracer.length == level + 1) {
                    this.tracer.push([]);
                }
                let sumForDepth = _.sum(this.tracer[level]);
                this.insertAt(sumForDepth / this.tracer[level].length, level + 1);
                this.tracer[level] = [];
            }
            else {
                this.tracer[level].splice(0, 1);
            }
        }
    }
}
exports.RateTracker = RateTracker;
//# sourceMappingURL=RateTracker.js.map
