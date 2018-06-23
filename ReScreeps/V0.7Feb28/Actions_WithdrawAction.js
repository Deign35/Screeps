"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionBase_1 = require("Actions_ActionBase");
const SwarmCodes = require("Consts_SwarmCodes");
class WithdrawAction extends ActionBase_1.ActionWithTarget {
    constructor(creep, target, ResourceType = RESOURCE_ENERGY, Amount = 0) {
        super(creep, target);
        this.ResourceType = ResourceType;
        this.Amount = Amount;
        let targetCarry = 0;
        if (this.Target.storeCapacity) {
            targetCarry = this.Target.store[ResourceType] || 0;
        }
        else if (this.Target.energyCapacity) {
            targetCarry = this.Target.energy || 0;
        }
        else if (this.Target.mineralCapacity) {
            if (ResourceType == RESOURCE_ENERGY) {
                targetCarry = this.Target.energy;
            }
            else {
                targetCarry = this.Target.mineralAmount;
            }
        }
        if (Amount <= 0) {
            Amount = Math.min(targetCarry, creep.carryCapacity - _.sum(creep.carry));
        }
        else {
            Amount = Math.min(targetCarry, this.Amount);
        }
    }
    get BlockValue() { return WithdrawAction.SimultaneousActionValue; }
    get EnergyBlockValue() { return 4; }
    ActionImplemented() {
        let result = this.AssignedCreep.withdraw(this.Target, this.ResourceType, this.Amount);
        let actionResponse = SwarmCodes.C_NONE;
        switch (result) {
            case (OK):
                actionResponse = SwarmCodes.C_NONE;
                break;
            //case(ERR_NOT_OWNER): Not the owner of this object.
            //case(ERR_BUSY): Creep is still being spawned.
            case (ERR_NOT_ENOUGH_RESOURCES):
                actionResponse = SwarmCodes.E_TARGET_INELLIGIBLE;
                break;
            //case(ERR_INVALID_TARGET): Target is not a valid constructionsite.
            case (ERR_FULL):
                actionResponse = SwarmCodes.E_ACTION_UNNECESSARY;
                break;
            case (ERR_NOT_IN_RANGE):
                actionResponse = SwarmCodes.C_MOVE;
                break;
            //case(ERR_INVALID_ARGS): The resources amount or type is incorrect.
            default: console.log('FAILED ACTION[WithdrawAction] -- ' + result);
        }
        return actionResponse;
    }
    ValidateAction() {
        let validationResult = SwarmCodes.C_NONE;
        if (_.sum(this.AssignedCreep.carry) == this.AssignedCreep.carryCapacity) {
            validationResult = SwarmCodes.E_ACTION_UNNECESSARY;
        }
        else if (this.Target.energyCapacity) {
            if (this.Target.energy == 0) {
                validationResult = SwarmCodes.E_TARGET_INELLIGIBLE;
            }
        }
        else if (this.Target.storeCapacity) {
            if (!this.Target.store[this.ResourceType]) {
                validationResult = SwarmCodes.E_TARGET_INELLIGIBLE;
            }
        }
        else if (this.Target) {
            if (this.ResourceType == RESOURCE_ENERGY) {
                validationResult = this.Target.energy > 0 ? SwarmCodes.C_NONE : SwarmCodes.E_TARGET_INELLIGIBLE;
            }
            else {
                if (this.Target.mineralType != this.ResourceType) {
                    validationResult = SwarmCodes.E_TARGET_INELLIGIBLE;
                }
                else {
                    // Amount already verified by constructor.
                }
            }
        }
        if (validationResult == SwarmCodes.C_NONE) {
            if (!this.AssignedCreep.pos.isNearTo(this.Target)) {
                return SwarmCodes.C_MOVE;
            }
        }
        return validationResult;
    }
}
WithdrawAction.SimultaneousActionValue = 0;
exports.WithdrawAction = WithdrawAction;
//# sourceMappingURL=WithdrawAction.js.map
