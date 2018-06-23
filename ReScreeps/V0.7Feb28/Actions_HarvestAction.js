"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwarmCodes = require("Consts_SwarmCodes");
const ActionBase_1 = require("Actions_ActionBase");
class HarvestAction extends ActionBase_1.ActionWithTarget {
    get BlockValue() { return HarvestAction.SimultaneousActionValue; }
    ActionImplemented() {
        let result = this.AssignedCreep.harvest(this.Target);
        let actionResponse = SwarmCodes.C_NONE;
        switch (result) {
            case (OK):
                actionResponse = SwarmCodes.C_NONE;
                break;
            //case(ERR_NOT_OWNER): Not the owner of this object.
            //case(ERR_BUSY): Creep is still being spawned.
            //case(ERR_NOT_FOUND): No extractor on a mineral.
            case (ERR_NOT_ENOUGH_RESOURCES):
                actionResponse = SwarmCodes.E_TARGET_INELLIGIBLE;
                break;
            //case(ERR_INVALID_TARGET): Target is not a valid harvest object.
            case (ERR_NOT_IN_RANGE):
                actionResponse = SwarmCodes.C_MOVE;
                break;
            //case(ERR_NO_BODYPART): No work body parts on this creep.
            default: console.log('FAILED ACTION[HarvestAction] -- ' + result);
        }
        return actionResponse;
    }
    ValidateAction() {
        if (this.AssignedCreep.carryCapacity > 0 && _.sum(this.AssignedCreep.carry) == this.AssignedCreep.carryCapacity) {
            return SwarmCodes.E_ACTION_UNNECESSARY;
        }
        let validTarget = false;
        if (this.Target.energyCapacity) {
            validTarget = this.Target.energy > 0;
        }
        else if (this.Target.mineralAmount) {
            validTarget = this.Target.mineralAmount > 0;
        }
        if (!validTarget) {
            return SwarmCodes.E_TARGET_INELLIGIBLE;
        }
        if (!this.AssignedCreep.pos.isNearTo(this.Target.pos)) {
            return SwarmCodes.C_MOVE;
        }
        return SwarmCodes.C_NONE;
    }
}
HarvestAction.SimultaneousActionValue = 1;
exports.HarvestAction = HarvestAction;
//# sourceMappingURL=HarvestAction.js.map
