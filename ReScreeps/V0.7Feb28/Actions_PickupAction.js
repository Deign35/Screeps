"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionBase_1 = require("Actions_ActionBase");
const SwarmCodes = require("Consts_SwarmCodes");
class PickupAction extends ActionBase_1.ActionWithTarget {
    get BlockValue() { return PickupAction.SimultaneousActionValue; }
    ActionImplemented() {
        let result = this.AssignedCreep.pickup(this.Target);
        let actionResponse = SwarmCodes.C_NONE;
        switch (result) {
            case (OK):
                actionResponse = SwarmCodes.C_NONE;
                break;
            //case(ERR_NOT_OWNER): Not the owner of this object.
            //case(ERR_BUSY): Creep is still being spawned.
            //case(ERR_INVALID_TARGET): Target is not a valid constructionsite.
            case (ERR_FULL):
                actionResponse = SwarmCodes.E_ACTION_UNNECESSARY;
                break;
            case (ERR_NOT_IN_RANGE):
                actionResponse = SwarmCodes.C_MOVE;
                break;
            default: console.log('FAILED ACTION[PickupAction] -- ' + result);
        }
        return actionResponse;
    }
    ValidateAction() {
        if (_.sum(this.AssignedCreep.carry) == this.AssignedCreep.carryCapacity) {
            return SwarmCodes.E_ACTION_UNNECESSARY;
        }
        return SwarmCodes.C_NONE;
    }
}
PickupAction.SimultaneousActionValue = 0;
exports.PickupAction = PickupAction;
//# sourceMappingURL=PickupAction.js.map
