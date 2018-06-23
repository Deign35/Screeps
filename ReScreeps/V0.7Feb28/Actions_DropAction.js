"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionBase_1 = require("Actions_ActionBase");
const SwarmCodes = require("Consts_SwarmCodes");
class DropAction extends ActionBase_1.ActionWithPosition {
    constructor(creep, targetPos, ResourceType = RESOURCE_ENERGY, Amount = 0) {
        super(creep, targetPos);
        this.ResourceType = ResourceType;
        this.Amount = Amount;
        if (Amount == 0) {
            Amount = creep.carry[ResourceType] || 0;
        }
    }
    get BlockValue() { return DropAction.SimultaneousActionValue; }
    get EnergyBlockValue() { return 6; }
    ActionImplemented() {
        if (!this.AssignedCreep.pos.isEqualTo(this.TargetPos)) {
            //We're here!
            return SwarmCodes.C_MOVE;
        }
        let result = this.AssignedCreep.drop(this.ResourceType, this.Amount);
        let actionResponse = SwarmCodes.C_NONE;
        switch (result) {
            case (OK):
                actionResponse = SwarmCodes.C_NONE;
                break;
            //case(ERR_NOT_OWNER): Not the owner of this object.
            //case(ERR_BUSY): Creep is still being spawned.
            case (ERR_NOT_ENOUGH_RESOURCES):
                actionResponse = SwarmCodes.E_ACTION_UNNECESSARY;
                break;
            default: console.log('FAILED ACTION[DropAction] -- ' + result);
        }
        return actionResponse;
    }
    ValidateAction() {
        // Sum!
        if (this.AssignedCreep.carry[this.ResourceType] < this.Amount) {
            return SwarmCodes.E_ACTION_UNNECESSARY;
        }
        return SwarmCodes.C_NONE;
    }
}
DropAction.SimultaneousActionValue = 0;
exports.DropAction = DropAction;
//# sourceMappingURL=DropAction.js.map
