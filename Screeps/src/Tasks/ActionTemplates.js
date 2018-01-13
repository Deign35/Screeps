const ActionTemplates = {};
ActionTemplates[ActionArgs_Enum.Responses] = {};

ActionTemplates[CreepCommand_Enum.Harvest] = function ([targetType, targetArg]) {
    let harvestAction = {};
    harvestAction[ActionArgs_Enum.Action] = CreepCommand_Enum.Harvest;
    harvestAction[ActionArgs_Enum.TargetType] = targetType;
    harvestAction[ActionArgs_Enum.TargetArg] = targetArg;
    harvestAction[ActionArgs_Enum.ArgsList] = new Array(ActionArgs_Enum.TargetType);

    return harvestAction;
};
const harvestResponses = {};

harvestResponses[OK] = CreepCommandResponse_Enum.Continue;
harvestResponses[ERR_FULL] = CreepCommandResponse_Enum.Next;
harvestResponses[ERR_NOT_IN_RANGE] = CreepCommandResponse_Enum.Move;
harvestResponses[ERR_NOT_ENOUGH_RESOURCES] = CreepCommandResponse_Enum.ReqTarget;
harvestResponses[ERR_INVALID_TARGET] = CreepCommandResponse_Enum.ReqTarget;
ActionTemplates[ActionArgs_Enum.Responses][CreepCommand_Enum.Harvest] = harvestResponses;

ActionTemplates[CreepCommand_Enum.Upgrade] = function (fixedTargetIndex) {
    let upgradeAction = {};
    upgradeAction[ActionArgs_Enum.Action] = CreepCommand_Enum.Upgrade;
    upgradeAction[ActionArgs_Enum.TargetType] = CreepTargetType_Enum.FixedTarget;
    upgradeAction[ActionArgs_Enum.TargetArg] = fixedTargetIndex;
    upgradeAction[ActionArgs_Enum.ArgsList] = new Array(ActionArgs_Enum.TargetType);

    return upgradeAction;
}

const upgradeResponses = {};
upgradeResponses[OK] = CreepCommandResponse_Enum.Continue;
upgradeResponses[ERR_NOT_IN_RANGE] = CreepCommandResponse_Enum.Move;
upgradeResponses[ERR_INVALID_TARGET] = CreepCommandResponse_Enum.ReqTarget;
upgradeResponses[ERR_NOT_ENOUGH_RESOURCES] = CreepCommandResponse_Enum.Reset;
ActionTemplates[ActionArgs_Enum.Responses][CreepCommand_Enum.Upgrade] = upgradeResponses;

ActionTemplates[CreepCommand_Enum.Transfer] = function ([roomName, callbackId]) {
    let transferAction = {};
    transferAction[ActionArgs_Enum.Action] = CreepCommand_Enum.Transfer;
    transferAction[ActionArgs_Enum.TargetType] = CreepTargetType_Enum.Callback;
    transferAction[ActionArgs_Enum.TargetArg] = new Delegate(CallbackType_Enum.Room, roomName, callbackId);
    transferAction[ActionArgs_Enum.ResourceType] = RESOURCE_ENERGY;
    transferAction[ActionArgs_Enum.ArgsList] = new Array(ActionArgs_Enum.TargetType, ActionArgs_Enum.ResourceType);

    return transferAction;
}

const transferResponses = {};
transferResponses[OK] = CreepCommandResponse_Enum.Continue;
transferResponses[ERR_FULL] = CreepCommandResponse_Enum.ReqTarget;
transferResponses[ERR_NOT_IN_RANGE] = CreepCommandResponse_Enum.Move;
transferResponses[ERR_INVALID_TARGET] = CreepCommandResponse_Enum.Next;
transferResponses[ERR_NOT_ENOUGH_RESOURCES] = CreepCommandResponse_Enum.Reset;
ActionTemplates[ActionArgs_Enum.Responses][CreepCommand_Enum.Transfer] = transferResponses;

ActionTemplates[CreepCommand_Enum.Build] = function (roomName) {
    let buildAction = {};
    buildAction[ActionArgs_Enum.Action] = CreepCommand_Enum.Build;
    buildAction[ActionArgs_Enum.TargetType] = CreepTargetType_Enum.Find;
    buildAction[ActionArgs_Enum.TargetArg] = FIND_MY_CONSTRUCTION_SITES;
    buildAction[ActionArgs_Enum.ArgsList] = new Array(ActionArgs_Enum.TargetType);

    return buildAction;
}

const buildResponses = {};
buildResponses[OK] = CreepCommandResponse_Enum.Continue;
buildResponses[ERR_FULL] = CreepCommandResponse_Enum.ReqTarget;
buildResponses[ERR_INVALID_TARGET] = CreepCommandResponse_Enum.Next;
buildResponses[ERR_NOT_ENOUGH_RESOURCES] = CreepCommandResponse_Enum.Reset;
buildResponses[ERR_NOT_IN_RANGE] = CreepCommandResponse_Enum.Move;
ActionTemplates[ActionArgs_Enum.Responses][CreepCommand_Enum.Build] = buildResponses;

ActionTemplates['CreateActionFromEnum'] = function (creepCommand, args) {
    for (const templateCommand in ActionTemplates) {
        if (creepCommand == templateCommand) {
            return ActionTemplates[creepCommand](args);
        }
    }

    return ERR_INVALID_ARGS;
};

module.exports = ActionTemplates;