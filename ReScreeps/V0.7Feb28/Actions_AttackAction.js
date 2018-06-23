"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionBase_1 = require("Actions_ActionBase");
const SwarmCodes = require("Consts_SwarmCodes");
class AttackAction extends ActionBase_1.ActionWithTarget {
    get BlockValue() { return AttackAction.SimultaneousActionValue; }
    ActionImplemented() {
        let result = this.AssignedCreep.attack(this.Target);
        let actionResponse = SwarmCodes.C_NONE;
        switch (result) {
            //case(OK): actionResponse = SwarmEnums.CRT_None; break;
            //case(ERR_NOT_OWNER): Not the owner of this object.
            //case(ERR_BUSY): Creep is still being spawned.
            //case(ERR_INVALID_TARGET): Target is not a valid attackable object.
            case (ERR_NOT_IN_RANGE):
                actionResponse = SwarmCodes.C_MOVE;
                break;
            //case(ERR_NO_BODYPART): No attack body parts on this creep.
            // This means that the body part I was expecting to have is gone!!!
            default: console.log('FAILED ACTION[AttackAction] -- ' + result);
        }
        return actionResponse;
    }
    ValidateAction() { return SwarmCodes.C_NONE; }
}
AttackAction.SimultaneousActionValue = 2;
exports.AttackAction = AttackAction;
//# sourceMappingURL=AttackAction.js.map
