"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwarmCodes = require("Consts_SwarmCodes");
const ImperatorBase_1 = require("Imperators_ImperatorBase");
const HarvestAction_1 = require("Actions_HarvestAction");
const MoveToPositionAction_1 = require("Actions_MoveToPositionAction");
const RepairAction_1 = require("Actions_RepairAction");
const BuildAction_1 = require("Actions_BuildAction");
const WithdrawAction_1 = require("Actions_WithdrawAction");
const RequestTransfer_1 = require("Actions_RequestTransfer");
const PickupAction_1 = require("Actions_PickupAction");
class HarvestImperator extends ImperatorBase_1.ImperatorBase {
    ActivateCreep(creep) {
        throw new Error("Method not implemented.");
    }
    // Activate temp worker as a different function
    // temp worker can try to withdraw from the container first.
    ActivateHarvester(data, harvester) {
        if (harvester.spawning) {
            return;
        }
        let sourceTarget = Game.getObjectById(data.id);
        let moveTarget = Game.getObjectById(data.containerID);
        if (moveTarget) {
            if (!harvester.pos.isEqualTo(moveTarget.pos)) {
                new MoveToPositionAction_1.MoveToPositionAction(harvester, moveTarget.pos).Run(true);
                return;
            }
        }
        let harvestAction = new HarvestAction_1.HarvestAction(harvester, sourceTarget);
        // Do a container check, where if it exists, do an express version that doesn't go through this logic.
        let harvestResult = harvestAction.ValidateAction();
        switch (harvestResult) {
            case (SwarmCodes.C_NONE): break;
            case (SwarmCodes.E_ACTION_UNNECESSARY):
                if (data.creepName == harvester.name) {
                    if (data.constructionSite) {
                        harvestAction = new BuildAction_1.BuildAction(harvester, Game.getObjectById(data.constructionSite));
                    }
                    else if (data.containerID) {
                        let container = Game.getObjectById(data.containerID);
                        if (container.hits < container.hitsMax) {
                            harvestAction = new RepairAction_1.RepairAction(harvester, container);
                        }
                    }
                }
                break; // Creep's carry is full
            case (SwarmCodes.E_TARGET_INELLIGIBLE): break; // Target is empty.
            case (SwarmCodes.C_MOVE):
                if (!moveTarget) {
                    new MoveToPositionAction_1.MoveToPositionAction(harvester, sourceTarget.pos).Run(true);
                }
                break;
        }
        if (harvestResult != SwarmCodes.C_MOVE) {
            harvestResult = harvestAction.Run();
            // Dont care about the result
        }
    }
    ActivateTempWorker(creep, target) {
        let action;
        if (!target) {
            return;
        }
        if (target.energyCapacity) {
            // Have to mine
            action = new HarvestAction_1.HarvestAction(creep, target);
        }
        else if (target.storeCapacity) {
            // go go withdraw!
            action = new WithdrawAction_1.WithdrawAction(creep, target);
        }
        else if (target.carryCapacity) {
            //Need to request a transfer when we get there.
            action = new RequestTransfer_1.RequestTransferAction(creep, target);
        }
        if (!action) {
            return;
        }
        let actionResult = action.ValidateAction();
        switch (actionResult) {
            case (SwarmCodes.C_NONE): break;
            case (SwarmCodes.E_REQUIRES_ENERGY):
            case (SwarmCodes.C_MOVE):
                new MoveToPositionAction_1.MoveToPositionAction(creep, target.pos).Run(true);
                return;
            case (SwarmCodes.E_TARGET_INELLIGIBLE):
            case (SwarmCodes.E_ACTION_UNNECESSARY):
                // Move this creep out of the way
                //let direction = creep.pos.getDirectionTo(target.pos) + 4;
                //if (direction > 9) { direction -= 8; }
                //creep.move(direction as DirectionConstant);
                break;
        }
        if(actionResult != SwarmCodes.C_MOVE){
            let recs = target.pos.lookFor(LOOK_RESOURCES);
            if(recs.length > 0 && recs[0].resourceType == RESOURCE_ENERGY) {
                action = new PickupAction_1.PickupAction(creep, recs[0])
            }
            action.Run();
        }
    }
}
exports.HarvestImperator = HarvestImperator;
//# sourceMappingURL=HarvestImperator.js.map
