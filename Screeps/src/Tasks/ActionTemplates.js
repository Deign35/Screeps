const ActionTemplates = {};

ActionTemplates[CreepCommand_Enum.Harvest] = function ([targetType, targetArg]) {
    let harvestAction = {};
    harvestAction[ActionArgs_Enum.Action] = CreepCommand_Enum.Harvest;
    harvestAction[ActionArgs_Enum.TargetType] = CreepTargetType_Enum.FixedTarget;
    harvestAction[ActionArgs_Enum.TargetArg] = fixedTargetIndex;

    let harvestArgs = [];
    harvestArgs.push(ActionArgs_Enum.TargetType);
    harvestAction[ActionArgs_Enum.ArgsList] = harvestArgs;

    let harvestResponses = {};
    harvestResponses[ERR_NOT_IN_RANGE] = CreepCommandResponse_Enum.Move;
    harvestResponses[ERR_NOT_ENOUGH_RESOURCES] = CreepCommandResponse_Enum.Continue;
    harvestResponses[OK] = CreepCommandResponse_Enum.Continue;
    harvestResponses[ERR_FULL] = CreepCommandResponse_Enum.Next;
    harvestAction[ActionArgs_Enum.Responses] = harvestResponses;

    return harvestAction;
};

ActionTemplates[CreepCommand_Enum.Upgrade] = function (fixedTargetIndex) {
    let upgradeAction = {};
    upgradeAction[ActionArgs_Enum.Action] = CreepCommand_Enum.Upgrade;
    upgradeAction[ActionArgs_Enum.TargetType] = CreepTargetType_Enum.FixedTarget;
    upgradeAction[ActionArgs_Enum.TargetArg] = fixedTargetIndex;
    let upgradeArgs = [];
    upgradeArgs.push(ActionArgs_Enum.TargetType);
    upgradeAction[ActionArgs_Enum.ArgsList] = upgradeArgs;

    let upgradeResponses = {};
    upgradeResponses[OK] = CreepCommandResponse_Enum.Continue;
    upgradeResponses[ERR_INVALID_TARGET] = CreepCommandResponse_Enum.ReqTarget;
    upgradeResponses[ERR_NOT_ENOUGH_RESOURCES] = CreepCommandResponse_Enum.Reset;
    upgradeResponses[ERR_NOT_IN_RANGE] = CreepCommandResponse_Enum.Move;
    upgradeAction[ActionArgs_Enum.Responses] = upgradeResponses;

    return upgradeAction;
}

ActionTemplates[CreepCommand_Enum.Transfer] = function ([roomName, callbackId]) {
    let transferAction = {};
    transferAction[ActionArgs_Enum.Action] = CreepCommand_Enum.Transfer;
    transferAction[ActionArgs_Enum.TargetType] = CreepTargetType_Enum.Callback;
    transferAction[ActionArgs_Enum.TargetArg] = new Delegate(CallbackType_Enum.Room, roomName, callbackId);
    transferAction[ActionArgs_Enum.ResourceType] = RESOURCE_ENERGY;
    let transferArgs = [];
    transferArgs.push(ActionArgs_Enum.TargetType);
    transferArgs.push(ActionArgs_Enum.ResourceType);
    transferAction[ActionArgs_Enum.ArgsList] = transferArgs;

    let transferResponses = {};
    transferResponses[ERR_INVALID_TARGET] = CreepCommandResponse_Enum.Next;
    transferResponses[ERR_NOT_ENOUGH_RESOURCES] = CreepCommandResponse_Enum.Reset;
    transferResponses[ERR_FULL] = CreepCommandResponse_Enum.ReqTarget;
    transferResponses[ERR_NOT_IN_RANGE] = CreepCommandResponse_Enum.Move;
    transferResponses[OK] = CreepCommandResponse_Enum.Continue;
    transferAction[ActionArgs_Enum.Responses] = transferResponses;

    return transferAction;
}

ActionTemplates[CreepCommand_Enum.Build] = function ([roomName, callbackId]) {
    let buildAction = {};
    buildAction[ActionArgs_Enum.Action] = CreepCommand_Enum.Build;
    buildAction[ActionArgs_Enum.TargetType] = CreepTargetType_Enum.Callback;
    buildAction[ActionArgs_Enum.TargetArg] = new Delegate(CallbackType_Enum.Room, roomName, callbackId);
    buildAction[ActionArgs_Enum.ResourceType] = RESOURCE_ENERGY;
    let buildArgs = [];
    buildArgs.push(ActionArgs_Enum.TargetType);
    buildArgs.push(ActionArgs_Enum.ResourceType);
    buildAction[ActionArgs_Enum.ArgsList] = buildArgs;

    let buildResponses = {};
    buildResponses[ERR_INVALID_TARGET] = CreepCommandResponse_Enum.Next;
    buildResponses[ERR_NOT_ENOUGH_RESOURCES] = CreepCommandResponse_Enum.Reset;
    buildResponses[ERR_FULL] = CreepCommandResponse_Enum.ReqTarget;
    buildResponses[ERR_NOT_IN_RANGE] = CreepCommandResponse_Enum.Move;
    buildResponses[OK] = CreepCommandResponse_Enum.Continue;
    buildAction[ActionArgs_Enum.Responses] = buildResponses;

    return buildAction;
}


module.exports = function (creepCommand, args) {
    for (const templateCommand in ActionTemplates) {
        if (creepCommand == templateCommand) {
            return ActionTemplates[creepCommand](args);
        }
    }

    return ERR_INVALID_ARGS;
};