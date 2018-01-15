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
harvestResponses[ERR_NO_TARGETS] = CreepCommandResponse_Enum.Next;
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
upgradeResponses[ERR_NO_TARGETS] = CreepCommandResponse_Enum.Next;
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
transferResponses[ERR_NO_TARGETS] = CreepCommandResponse_Enum.Next;
transferResponses[ERR_NOT_ENOUGH_RESOURCES] = CreepCommandResponse_Enum.Reset;
ActionTemplates[ActionArgs_Enum.Responses][CreepCommand_Enum.Transfer] = transferResponses;

ActionTemplates[CreepCommand_Enum.Build] = function () {
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
buildResponses[ERR_NO_TARGETS] = CreepCommandResponse_Enum.Next;
buildResponses[ERR_NOT_ENOUGH_RESOURCES] = CreepCommandResponse_Enum.Reset;
buildResponses[ERR_NOT_IN_RANGE] = CreepCommandResponse_Enum.Move;
ActionTemplates[ActionArgs_Enum.Responses][CreepCommand_Enum.Build] = buildResponses;

ActionTemplates[CreepCommand_Enum.Pickup] = function () {
    let pickupAction = {};
    pickupAction[ActionArgs_Enum.Action] = CreepCommand_Enum.Pickup;
    pickupAction[ActionArgs_Enum.TargetType] = CreepTargetType_Enum.Find;
    pickupAction[ActionArgs_Enum.TargetArg] = FIND_DROPPED_RESOURCES;
    pickupAction[ActionArgs_Enum.ArgsList] = new Array(ActionArgs_Enum.TargetType);

    return pickupAction;
}

const pickupResponses = {};
pickupResponses[OK] = CreepCommandResponse_Enum.ReqTarget;  // ??
pickupResponses[ERR_FULL] = CreepCommandResponse_Enum.Next;
pickupResponses[ERR_NO_TARGETS] = CreepCommandResponse_Enum.Next;
pickupResponses[ERR_NOT_IN_RANGE] = CreepCommandResponse_Enum.Move;
ActionTemplates[ActionArgs_Enum.Responses][CreepCommand_Enum.Pickup] = pickupResponses;

ActionTemplates[CreepCommand_Enum.Repair] = function () { // Probably a callback is best.
    let repairAction = {};
    repairAction[ActionArgs_Enum.Action] = CreepCommand_Enum.Repair;
    repairAction[ActionArgs_Enum.TargetType] = CreepTargetType_Enum.Find;
    repairAction[ActionArgs_Enum.TargetArg] = FIND_DROPPED_RESOURCES;
    repairAction[ActionArgs_Enum.ArgsList] = new Array(ActionArgs_Enum.TargetType);

    return repairAction;
}

const repairResponses = {};
repairResponses[OK] = CreepCommandResponse_Enum.Continue;
repairResponses[ERR_NO_TARGETS] = CreepCommandResponse_Enum.Next;
repairResponses[ERR_NOT_IN_RANGE] = CreepCommandResponse_Enum.Move;
repairResponses[ERR_NOT_ENOUGH_RESOURCES] = CreepCommandResponse_Enum.Next;
ActionTemplates[ActionArgs_Enum.Responses][CreepCommand_Enum.Repair] = repairResponses;

ActionTemplates[CreepCommand_Enum.Withdraw] = function () { // Probably a callback is best.
    let withdrawAction = {};
    withdrawAction[ActionArgs_Enum.Action] = CreepCommand_Enum.Withdraw;
    withdrawAction[ActionArgs_Enum.TargetType] = CreepTargetType_Enum.Find;
    withdrawAction[ActionArgs_Enum.TargetArg] = FIND_DROPPED_RESOURCES;
    withdrawAction[ActionArgs_Enum.ArgsList] = new Array(ActionArgs_Enum.TargetType);

    return withdrawAction;
}

const withdrawResponses = {};
withdrawResponses[OK] = CreepCommandResponse_Enum.Continue;
withdrawResponses[ERR_NO_TARGETS] = CreepCommandResponse_Enum.Next;
withdrawResponses[ERR_NOT_IN_RANGE] = CreepCommandResponse_Enum.Move;
withdrawResponses[ERR_NOT_ENOUGH_RESOURCES] = CreepCommandResponse_Enum.Next;
ActionTemplates[ActionArgs_Enum.Responses][CreepCommand_Enum.Withdraw] = withdrawResponses;

ActionTemplates['CreateActionFromEnum'] = function (creepCommand, args) {
    for (const templateCommand in ActionTemplates) {
        if (creepCommand == templateCommand) {
            return ActionTemplates[creepCommand](args);
        }
    }

    return ERR_INVALID_ARGS;
};

module.exports = ActionTemplates;