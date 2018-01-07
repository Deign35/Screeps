const TaskProfiles = {};

const InitTaskProfile = function () {
    const taskArgs = {};
    taskArgs.Cache = {};
    taskArgs.Cache[TaskMemory_Enum.ActionIndex] = 0;
    taskArgs.Cache[TaskMemory_Enum.RetryCount] = 0;
    taskArgs.Cache['Targets'] = {};

    return taskArgs;
};

const DefaultProfile = function (taskId) {
    const taskArgs = InitTaskProfile();

    taskArgs[TaskArgs_Enum.TaskId] = taskId;
    taskArgs[TaskArgs_Enum.Body] = [MOVE, MOVE, CARRY, CARRY, WORK];

    taskArgs[TaskArgs_Enum.ActionList] = [{
        Commands: [{ Action: CreepCommand_Enum.Withdraw },
        { Action: CreepCommand_Enum.ReqTransfer },
        { Action: CreepCommand_Enum.Harvest }]
    }, {
        Commands: [{ Action: CreepCommand_Enum.Transfer },
        { Action: CreepCommand_Enum.Build },
        { Action: CreepCommand_Enum.Upgrade }]
        }];

    return OK;
}
TaskProfiles[TaskProfile_Enum.Default] = DefaultProfile;//{ Profile: GeneralProfile, Args: [TaskArgs_Enum.TaskId, TaskArgs_Enum.SourceId, TaskArgs_Enum.ActionList] };

const PrimeHarvesterProfile = function (taskId, sourceId, anchorPos) {
    const taskArgs = InitTaskProfile();

    taskArgs[TaskArgs_Enum.TaskId] = taskId;
    taskArgs[TaskArgs_Enum.FixedTargets] = [sourceId,];
    taskArgs[TaskArgs_Enum.AnchorPos] = anchorPos;

    taskArgs[TaskArgs_Enum.ActionList] = [{ Commands: [{ Action: CreepCommand_Enum.Harvest, FixedTarget: 0 }] }];
    taskArgs[TaskArgs_Enum.Body] = CreateBody([[5, WORK],]);

    return OK;
}
TaskProfiles[TaskProfile_Enum.PrimeHarvester] = PrimeHarvesterProfile;

const TransporterProfile = function (taskId, size, resourceType) {
    const taskArgs = InitTaskProfile();

    taskArgs[TaskArgs_Enum.TaskId] = taskId;
    taskArgs[TaskArgs_Enum.Size] = size;
    taskArgs[TaskArgs_Enum.Resource] = resourceType;
    taskArgs[TaskArgs_Enum.Body] = CreateBody([[size, MOVE], [size, CARRY]]);
    taskArgs[TaskArgs_Enum.ActionList] = [{
        Commands: [{ Action: CreepCommand_Enum.Withdraw },
        { Action: CreepCommand_Enum.Pickup }],
    }, {
        Commands: [{ Action: CreepCommand_Enum.Deliver }]
    }];

    return OK;
}
TaskProfiles[TaskProfile_Enum.Transporter] = TransporterProfile;

const RequestTaskProfile = function (profile, args) {
    for (const profileType in TaskProfiles) {
        if (profile == profileType) {
            return TaskProfiles[profile](args);
        }
    }

    return ERR_INVALID_ARGS;
}
module.exports = RequestTaskProfile; // Eventually this should be able to store and load custom profiles.