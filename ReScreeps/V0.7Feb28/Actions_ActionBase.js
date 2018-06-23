"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwarmCodes = require("Consts_SwarmCodes");
class ActionBase {
    constructor(AssignedCreep) {
        this.AssignedCreep = AssignedCreep;
    }
    get EnergyBlockValue() { return 0; }
    Run(autoMove = true) {
        let jobResult = this.ActionImplemented();
        if (autoMove && jobResult == SwarmCodes.C_MOVE) {
            this.Move(this.GetMovePosition());
        }
        return jobResult;
    }
    Move(pos) {
        this.AssignedCreep.moveTo(pos);
    }
}
exports.ActionBase = ActionBase;
class ActionWithPosition extends ActionBase {
    constructor(creep, TargetPos) {
        super(creep);
        this.TargetPos = TargetPos;
    }
    GetMovePosition() {
        return this.TargetPos;
    }
}
exports.ActionWithPosition = ActionWithPosition;
class ActionWithTarget extends ActionBase {
    constructor(creep, Target) {
        super(creep);
        this.Target = Target;
    }
    GetMovePosition() {
        return this.Target.pos;
    }
}
exports.ActionWithTarget = ActionWithTarget;
//# sourceMappingURL=ActionBase.js.map
