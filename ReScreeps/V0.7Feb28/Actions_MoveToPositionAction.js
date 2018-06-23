"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionBase_1 = require("Actions_ActionBase");
const SwarmCodes = require("Consts_SwarmCodes");
class MoveToPositionAction extends ActionBase_1.ActionWithPosition {
    get BlockValue() { return MoveToPositionAction.SimultaneousActionValue; }
    ActionImplemented() {
        let response = SwarmCodes.C_MOVE;
        if (this.AssignedCreep.pos.isEqualTo(this.TargetPos)) {
            response = SwarmCodes.E_ACTION_UNNECESSARY;
        }
        return response;
    }
    ValidateAction() {
        if (this.AssignedCreep.pos.isEqualTo(this.TargetPos)) {
            return SwarmCodes.E_ACTION_UNNECESSARY;
        }
        return SwarmCodes.C_NONE;
    }
}
MoveToPositionAction.SimultaneousActionValue = 0;
exports.MoveToPositionAction = MoveToPositionAction;
//# sourceMappingURL=MoveToPositionAction.js.map
