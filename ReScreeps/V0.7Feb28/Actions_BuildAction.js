"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionBase_1 = require("Actions_ActionBase");
const SwarmCodes = require("Consts_SwarmCodes");
class BuildAction extends ActionBase_1.ActionWithTarget {
    get BlockValue() { return BuildAction.SimultaneousActionValue; }
    get EnergyBlockValue() { return 2; }
    ActionImplemented() {
        let result = this.AssignedCreep.build(this.Target);
        let actionResponse = SwarmCodes.C_NONE;
        switch (result) {
            case (OK):
                actionResponse = SwarmCodes.C_NONE;
                break;
            //case(ERR_NOT_OWNER): Not the owner of this object.
            //case(ERR_BUSY): Creep is still being spawned.
            case (ERR_NOT_ENOUGH_RESOURCES):
                actionResponse = SwarmCodes.E_REQUIRES_ENERGY;
                break;
            //case(ERR_INVALID_TARGET): Target is not a valid constructionsite.
            case (ERR_NOT_IN_RANGE):
                actionResponse = SwarmCodes.C_MOVE;
                break;
            //case(ERR_NO_BODYPART): No work body parts on this creep.
            //case(ERR_RCL_NOT_ENOUGH): Need higher room control
            default: console.log('FAILED ACTION[BuildAction] -- ' + result);
        }
        return actionResponse;
    }
    ValidateAction() {
        if (!this.AssignedCreep.pos.inRangeTo(this.Target, 1)) {
            return SwarmCodes.C_MOVE;
        }
        // Sum!
        if (this.AssignedCreep.carry.energy == 0) {
            return SwarmCodes.E_REQUIRES_ENERGY;
        }
        return SwarmCodes.C_NONE;
    }
}
BuildAction.SimultaneousActionValue = 3;
exports.BuildAction = BuildAction;
//# sourceMappingURL=BuildAction.js.map
