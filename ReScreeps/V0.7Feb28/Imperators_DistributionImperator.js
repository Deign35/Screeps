"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwarmCodes = require("Consts_SwarmCodes");
const ImperatorBase_1 = require("Imperators_ImperatorBase");
const MoveToPositionAction_1 = require("Actions_MoveToPositionAction");
const TransferAction_1 = require("Actions_TransferAction");
class DistributionImperator extends ImperatorBase_1.ImperatorBase {
    ActivateCreep(creepData) {
        let creep = Game.creeps[creepData.creepName];
        let transferResult = SwarmCodes.C_NONE;
        if(!creep) { return; }
        if(creepData.creepName == 'SPAWNER') {
            creep.room.visual.text('S: ' + creep.carry.energy, 26,10);
        }
        if(creep.ticksToLive < 150 && creep.carry.energy <= 10) {
            creep.suicide();
            return;
        }
        if (creep && !creepData.fetching) {
            let target = Game.getObjectById(creepData.target);
            if (!target) {
                return SwarmCodes.C_NONE;
            } // This should not return from here.
            let action = new TransferAction_1.TransferAction(creep, target);
            creep.say(creepData.target.slice(-5));
            transferResult = action.ValidateAction();
            switch (transferResult) {
                case (SwarmCodes.C_NONE): break;
                case (SwarmCodes.E_INVALID): break;
                case (SwarmCodes.E_TARGET_INELLIGIBLE): break;
                case (SwarmCodes.C_MOVE):
                    new MoveToPositionAction_1.MoveToPositionAction(creep, target.pos).Run(true);
                    break;
            }
            if (transferResult != SwarmCodes.C_MOVE) {
                transferResult = action.Run();
                switch (transferResult) {
                    case (SwarmCodes.C_NONE):
                        break;
                    case (SwarmCodes.E_TARGET_INELLIGIBLE):
                    case (SwarmCodes.E_ACTION_UNNECESSARY):
                        console.log('DistributionResult: ' + transferResult); // What happens i wonder?
                        break;
                }
                creepData.refillList.splice(0, 1);
                creepData.target = '';
            }
        }
        else
        {
            if(creep && creep.name == 'SPAWNER') {
                if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage);
                }
            }
        }
        return transferResult;
    }
}
exports.DistributionImperator = DistributionImperator;
//# sourceMappingURL=DistributionImperator.js.map
