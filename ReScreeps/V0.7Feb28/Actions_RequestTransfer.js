"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionBase_1 = require("Actions_ActionBase");
const SwarmCodes = require("Consts_SwarmCodes");
class RequestTransferAction extends ActionBase_1.ActionWithTarget {
    get BlockValue() { return RequestTransferAction.SimultaneousActionValue; }
    ActionImplemented() {
        let result = this.Target.transfer(this.AssignedCreep, RESOURCE_ENERGY);
        let actionResponse = SwarmCodes.C_NONE;
        switch (result) {
            case (OK):
                actionResponse = SwarmCodes.C_NONE;
                break;
            case (ERR_NOT_OWNER): throw 'Not the owner of this object.';
            case (ERR_NOT_ENOUGH_RESOURCES):
                actionResponse = SwarmCodes.C_NONE;
                break;
            //case(ERR_INVALID_TARGET): Target is not a valid attackable object.
            //case (ERR_NOT_IN_RANGE): actionResponse = SwarmCodes.C_MOVE; break;
            //case(ERR_NO_BODYPART): No attack body parts on this creep.
            // This means that the body part I was expecting to have is gone!!!
            default: console.log('FAILED ACTION[RequestTransferAction] -- ' + result);
        }
        return actionResponse;
    }
    ValidateAction() {
        if (!this.Target.pos.isNearTo(this.AssignedCreep)) {
            return SwarmCodes.C_MOVE;
        }
        if (this.Target.carry[RESOURCE_ENERGY] > 0) {
            return SwarmCodes.C_NONE;
        }
        return SwarmCodes.E_REQUIRES_ENERGY;
    }
}
RequestTransferAction.SimultaneousActionValue = 0;
exports.RequestTransferAction = RequestTransferAction;
//# sourceMappingURL=RequestTransfer.js.map
