"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionBase_1 = require("Actions_ActionBase");
const SwarmCodes = require("Consts_SwarmCodes");
class SayAction extends ActionBase_1.ActionBase {
    constructor(creep, SayString) {
        super(creep);
        this.SayString = SayString;
    }
    get BlockValue() { return SayAction.SimultaneousActionValue; }
    ActionImplemented() {
        this.AssignedCreep.say(this.SayString);
        return SwarmCodes.C_NONE;
    }
    GetMovePosition() {
        throw new Error("Method not implemented.");
    }
    ValidateAction() {
        return SwarmCodes.C_NONE;
    }
}
SayAction.SimultaneousActionValue = 0;
exports.SayAction = SayAction;
//# sourceMappingURL=SayAction.js.map
