"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwarmCodes = require("Consts_SwarmCodes");
const ImperatorBase_1 = require("Imperators_ImperatorBase");
const UpgradeAction_1 = require("Actions_UpgradeAction");
const MoveToPositionAction_1 = require("Actions_MoveToPositionAction");
class ControllerImperator extends ImperatorBase_1.ImperatorBase {
    ActivateCreep(creepData) {
        let creep = Game.creeps[creepData.creepName];
        if (creep.spawning) {
            return SwarmCodes.C_NONE;
        }
        if(creep.ticksToLive < 150 && creep.carry.energy == 0) { creep.suicide(); return; }
        // This is very fragile, if the creep is in another room, this breaks!
        let controller = Game.getObjectById(creepData.controllerTarget);
        let upgradeAction = new UpgradeAction_1.UpgradeAction(creep, controller);
        let upgradeResult = upgradeAction.ValidateAction();
        if (upgradeResult == SwarmCodes.C_MOVE) {
            new MoveToPositionAction_1.MoveToPositionAction(creep, controller.pos).Run(true);
        }
        else if(!creepData.fetching) {
            if(creep.pos.getRangeTo(controller) > 2) {
                creep.moveTo(controller);
            }
            upgradeAction.Run();
        }
        return SwarmCodes.C_NONE;
    }
}
exports.ControllerImperator = ControllerImperator;
//# sourceMappingURL=ControllerImperator.js.map
