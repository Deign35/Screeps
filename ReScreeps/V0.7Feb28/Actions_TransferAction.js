"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwarmCodes = require("Consts_SwarmCodes");
const ActionBase_1 = require("Actions_ActionBase");
class TransferAction extends ActionBase_1.ActionWithTarget {
    constructor(creep, target, ResourceType = RESOURCE_ENERGY, Amount) {
        super(creep, target);
        this.ResourceType = ResourceType;
        this.Amount = Amount;
        //Amount unused.
    }
    get BlockValue() { return TransferAction.SimultaneousActionValue; }
    get EnergyBlockValue() { return 5; }
    ActionImplemented() {
        let carryAmount = this.AssignedCreep.carry[this.ResourceType] || 0;
        let targetAllows = 0;
        if (this.Target.storeCapacity) {
            targetAllows = this.Target.storeCapacity - _.sum(this.Target.store);
        }
        else if (this.Target.carryCapacity) {
            targetAllows = this.Target.carryCapacity - _.sum(this.Target.carry);
        }
        else if (this.Target.energyCapacity) {
            targetAllows = this.Target.energyCapacity - this.Target.energy;
        }
        let amount = Math.min(carryAmount, targetAllows);
        let result = this.AssignedCreep.transfer(this.Target, this.ResourceType, amount);
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
            //case(ERR_INVALID_TARGET): Target is not a valid transfer object.
            case (ERR_FULL):
                actionResponse = SwarmCodes.E_TARGET_INELLIGIBLE;
                break;
            case (ERR_NOT_IN_RANGE):
                actionResponse = SwarmCodes.C_MOVE;
                break;
            //case(ERR_INVALID_ARGS): The resources amount is incorrect.
            default: console.log('FAILED ACTION[TransferAction] -- ' + result);
        }
        return actionResponse;
    }
    ValidateAction() {
        let result = SwarmCodes.C_NONE;
        if (_.sum(this.AssignedCreep.carry) == 0) {
            result = SwarmCodes.E_ACTION_UNNECESSARY;
        }
        else if (this.Target.carryCapacity) {
            let creepCarry = _.sum(this.Target.carry);
            if (creepCarry == this.Target.carryCapacity) {
                result = SwarmCodes.E_TARGET_INELLIGIBLE;
            }
        }
        else if (this.ResourceType == RESOURCE_ENERGY && this.Target.energyCapacity) {
            if (this.Target.energy == this.Target.energyCapacity) {
                result = SwarmCodes.E_TARGET_INELLIGIBLE;
            }
        }
        else if (this.Target.storeCapacity) {
            let storeCarry = _.sum(this.Target.store);
            if (storeCarry == this.Target.storeCapacity) {
                result = SwarmCodes.E_TARGET_INELLIGIBLE;
            }
        }
        else {
            console.log('SHOULD NOT BE HERE');
            console.log('this.Target: ' + JSON.stringify(this.Target));
            result = SwarmCodes.E_INVALID;
        }
        if (result == SwarmCodes.C_NONE) {
            if (!this.AssignedCreep.pos.isNearTo(this.Target)) {
                return SwarmCodes.C_MOVE;
            }
        }
        return result;
    }
}
TransferAction.SimultaneousActionValue = 0;
exports.TransferAction = TransferAction;
//# sourceMappingURL=TransferAction.js.map
