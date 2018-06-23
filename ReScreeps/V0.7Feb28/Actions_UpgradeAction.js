"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwarmCodes = require("Consts_SwarmCodes");
const ActionBase_1 = require("Actions_ActionBase");
class UpgradeAction extends ActionBase_1.ActionWithTarget {
    get BlockValue() { return UpgradeAction.SimultaneousActionValue; }
    get EnergyBlockValue() { return 1; }
    ActionImplemented() {
        let result = this.AssignedCreep.upgradeController(this.Target);
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
            //case(ERR_INVALID_TARGET): Target is not a valid transfer object.
            case (ERR_NOT_IN_RANGE):
                actionResponse = SwarmCodes.C_MOVE;
                break;
            //case(ERR_NO_BODYPART): No work body parts on this creep.
            default: console.log('FAILED ACTION[UpgradeAction] -- ' + result);
        }
        return actionResponse;
    }
    ValidateAction() {
        let result = SwarmCodes.C_NONE;
        if (this.AssignedCreep.carry.energy == 0) {
            result = SwarmCodes.E_REQUIRES_ENERGY;
        }
        if (!this.AssignedCreep.pos.inRangeTo(this.Target, 3)) {
            result = SwarmCodes.C_MOVE;
        }
        return result;
    }
}
UpgradeAction.SimultaneousActionValue = 0;
exports.UpgradeAction = UpgradeAction;
//# sourceMappingURL=UpgradeAction.js.map
