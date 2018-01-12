const ActionTemplates = {};
ActionTemplates[Responses] = {};

ActionTemplates[CreepCommand_Enum.Harvest] = function ([targetType, targetArg]) {
    let harvestAction = {};
    harvestAction[ActionArgs_Enum.Action] = CreepCommand_Enum.Harvest;
    harvestAction[ActionArgs_Enum.TargetType] = targetType;
    harvestAction[ActionArgs_Enum.TargetArg] = targetArg;
    harvestAction[ActionArgs_Enum.ArgsList] = new Array(ActionArgs_Enum.TargetType);

    return harvestAction;
};

ActionTemplates[Responses][CreepCommand_Enum.Harvest] = {};
ActionTemplates[Responses][CreepCommand_Enum.Harvest][OK] = CreepCommandResponse_Enum.Continue;
ActionTemplates[Responses][CreepCommand_Enum.Harvest][ERR_FULL] = CreepCommandResponse_Enum.Next;
ActionTemplates[Responses][CreepCommand_Enum.Harvest][ERR_NOT_IN_RANGE] = CreepCommandResponse_Enum.Move;
ActionTemplates[Responses][CreepCommand_Enum.Harvest][ERR_NOT_ENOUGH_RESOURCES] = CreepCommandResponse_Enum.ReqTarget;
ActionTemplates[Responses][CreepCommand_Enum.Harvest][ERR_INVALID_TARGET] = CreepCommandResponse_Enum.ReqTarget;

ActionTemplates[CreepCommand_Enum.Upgrade] = function (fixedTargetIndex) {
    let upgradeAction = {};
    upgradeAction[ActionArgs_Enum.Action] = CreepCommand_Enum.Upgrade;
    upgradeAction[ActionArgs_Enum.TargetType] = CreepTargetType_Enum.FixedTarget;
    upgradeAction[ActionArgs_Enum.TargetArg] = fixedTargetIndex;
    upgradeAction[ActionArgs_Enum.ArgsList] = new Array(ActionArgs_Enum.TargetType);

    return upgradeAction;
}

ActionTemplates[Responses][CreepCommand_Enum.Upgrade] = {};
ActionTemplates[Responses][CreepCommand_Enum.Upgrade][OK] = CreepCommandResponse_Enum.Continue;
ActionTemplates[Responses][CreepCommand_Enum.Upgrade][ERR_NOT_IN_RANGE] = CreepCommandResponse_Enum.Move;
ActionTemplates[Responses][CreepCommand_Enum.Upgrade][ERR_INVALID_TARGET] = CreepCommandResponse_Enum.ReqTarget;
ActionTemplates[Responses][CreepCommand_Enum.Upgrade][ERR_NOT_ENOUGH_RESOURCES] = CreepCommandResponse_Enum.Reset;

ActionTemplates[CreepCommand_Enum.Transfer] = function ([roomName, callbackId]) {
    let transferAction = {};
    transferAction[ActionArgs_Enum.Action] = CreepCommand_Enum.Transfer;
    transferAction[ActionArgs_Enum.TargetType] = CreepTargetType_Enum.Callback;
    transferAction[ActionArgs_Enum.TargetArg] = new Delegate(CallbackType_Enum.Room, roomName, callbackId);
    transferAction[ActionArgs_Enum.ResourceType] = RESOURCE_ENERGY;
    transferAction[ActionArgs_Enum.ArgsList] = new Array(ActionArgs_Enum.TargetType, ActionArgs_Enum.ResourceType);

    return transferAction;
}

ActionTemplates[Responses][CreepCommand_Enum.Transfer] = {};
ActionTemplates[Responses][CreepCommand_Enum.Transfer][OK] = CreepCommandResponse_Enum.Continue;
ActionTemplates[Responses][CreepCommand_Enum.Transfer][ERR_FULL] = CreepCommandResponse_Enum.ReqTarget;
ActionTemplates[Responses][CreepCommand_Enum.Transfer][ERR_NOT_IN_RANGE] = CreepCommandResponse_Enum.Move;
ActionTemplates[Responses][CreepCommand_Enum.Transfer][ERR_INVALID_TARGET] = CreepCommandResponse_Enum.Next;
ActionTemplates[Responses][CreepCommand_Enum.Transfer][ERR_NOT_ENOUGH_RESOURCES] = CreepCommandResponse_Enum.Reset;


ActionTemplates[CreepCommand_Enum.Build] = function (roomName) {
    let buildAction = {};
    buildAction[ActionArgs_Enum.Action] = CreepCommand_Enum.Build;
    buildAction[ActionArgs_Enum.TargetType] = CreepTargetType_Enum.Find;
    buildAction[ActionArgs_Enum.TargetArg] = FIND_MY_CONSTRUCTION_SITES;
    buildAction[ActionArgs_Enum.ArgsList] = new Array(ActionArgs_Enum.TargetType);

    return buildAction;
}

ActionTemplates[Responses][CreepCommand_Enum.Build] = {};
ActionTemplates[Responses][CreepCommand_Enum.Build][OK] = CreepCommandResponse_Enum.Continue;
ActionTemplates[Responses][CreepCommand_Enum.Build][ERR_FULL] = CreepCommandResponse_Enum.ReqTarget;
ActionTemplates[Responses][CreepCommand_Enum.Build][ERR_INVALID_TARGET] = CreepCommandResponse_Enum.Next;
ActionTemplates[Responses][CreepCommand_Enum.Build][ERR_NOT_ENOUGH_RESOURCES] = CreepCommandResponse_Enum.Reset;
ActionTemplates[Responses][CreepCommand_Enum.Build][ERR_NOT_IN_RANGE] = CreepCommandResponse_Enum.Move;

ActionTemplates['CreateActionFromEnum'] = function (creepCommand, args) {
    for (const templateCommand in ActionTemplates) {
        if (creepCommand == templateCommand) {
            return ActionTemplates[creepCommand](args);
        }
    }

    return ERR_INVALID_ARGS;
};

module.exports = ActionTemplates;