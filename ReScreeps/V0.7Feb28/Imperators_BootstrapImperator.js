"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwarmCodes = require("Consts_SwarmCodes");
const ImperatorBase_1 = require("Imperators_ImperatorBase");
const MoveToPositionAction_1 = require("Actions_MoveToPositionAction");
const HarvestAction_1 = require("Actions_HarvestAction");
const BuildAction_1 = require("Actions_BuildAction");
const CONSUL_TYPE = 'H_Consul';
class BootstrapImperator extends ImperatorBase_1.ImperatorBase {
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
        let moveTarget = Game.getObjectById(data.constructionSite || data.containerID);
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
            case (SwarmCodes.C_NONE):
                if (!data.constructionSite && !data.containerID) {
                    let foundCS = harvester.pos.lookFor(LOOK_CONSTRUCTION_SITES);
                    if (foundCS && foundCS.length > 0) {
                        if (foundCS[0].structureType == STRUCTURE_CONTAINER) {
                            data.constructionSite = foundCS[0].id;
                        }
                    }
                    else {
                        let foundS = harvester.pos.lookFor(LOOK_STRUCTURES);
                        if (foundS && foundS.length > 0 && foundS[0].structureType == STRUCTURE_CONTAINER) {
                            data.containerID = foundS[0].id;
                        }
                        else {
                            harvester.room.createConstructionSite(harvester.pos, STRUCTURE_CONTAINER);
                        }
                    }
                }
                break;
            case (SwarmCodes.E_ACTION_UNNECESSARY):
                if (data.creepName == harvester.name) {
                    if (data.constructionSite) {
                        harvestAction = new BuildAction_1.BuildAction(harvester, Game.getObjectById(data.constructionSite));
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
}
exports.BootstrapImperator = BootstrapImperator;
//# sourceMappingURL=BootstrapImperator.js.map
