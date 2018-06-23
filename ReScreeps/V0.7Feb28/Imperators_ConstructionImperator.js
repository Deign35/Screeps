"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwarmCodes = require("Consts_SwarmCodes");
const ImperatorBase_1 = require("Imperators_ImperatorBase");
const BuildAction_1 = require("Actions_BuildAction");
const MoveToPositionAction_1 = require("Actions_MoveToPositionAction");
class ConstructionImperator extends ImperatorBase_1.ImperatorBase {
    ActivateCreep(creepData) {
        let creep = Game.creeps[creepData.creepName];
        if (creepData.target == '') {
            return SwarmCodes.C_NONE;
        }
        let site = Game.constructionSites[creepData.target];
        if (!site) {
            return SwarmCodes.C_NONE;
        }
        let buildAction = new BuildAction_1.BuildAction(creep, site);
        let buildResult = buildAction.ValidateAction();
        if (buildResult == SwarmCodes.C_MOVE) {
            new MoveToPositionAction_1.MoveToPositionAction(creep, site.pos).Run(true);
        }
        else {
            buildAction.Run();
        }
        return SwarmCodes.C_NONE;
    }
}
exports.ConstructionImperator = ConstructionImperator;
//# sourceMappingURL=ConstructionImperator.js.map
