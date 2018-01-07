const TaskProfiles = {};

const DefaultProfile = function (taskId) {
    const newTask = new Task();
    newTask.SetArgument(TaskArgs_Enum.TaskId, taskId);
    newTask.SetArgument(TaskArgs_Enum.Body, [MOVE, MOVE, CARRY, CARRY, WORK]);

    const ActionList = [];
    const RetrieveCommand = {
        Commands: [{ Action: CreepCommand_Enum.Withdraw },
        { Action: CreepCommand_Enum.ReqTransfer },
        { Action: CreepCommand_Enum.Harvest }]
    }
    ActionList.push(RetrieveCommand);

    const DeliverCommand = {
        Commands: [{ Action: CreepCommand_Enum.Transfer },
        { Action: CreepCommand_Enum.Build },
        { Action: CreepCommand_Enum.Upgrade }]
    }
    ActionList.push(DeliverCommand);
    newTask.SetArgument(TaskArgs_Enum.ActionList, ActionList);

    return newTask;
}
TaskProfiles[TaskProfile_Enum.Default] = DefaultProfile;

// Idea for harvester/Source, Detect the position around the source with the most moveable space.  Put the container there.
const PrimeHarvesterProfile = function (sourceId, anchorPos) {
    const newTask = new Task();
    newTask.SetArgument(TaskArgs_Enum.TaskId, 'PH_' + sourceId);
    newTask.SetArgument(TaskArgs_Enum.FixedTargets, [sourceId]);
    newTask.SetArgument(TaskArgs_Enum.AnchorPos, anchorPos);
    newTask.SetArgument(TaskArgs_Enum.Body, CreateBody([[5, WORK],]));

    const ActionList = [];
    const GoToCommand = { Commands: [{ Action: CreepCommand_Enum.WaitAt, Location: TaskArgs_Enum.AnchorPos }] };
    ActionList.push(GoToCommand);

    const HarvestCommand = { Commands: [{ Action: CreepCommand_Enum.Harvest, FixedTarget: 0  }] };
    ActionList.push(HarvestCommand);
    newTask.SetArgument(TaskArgs_Enum.ActionList, ActionList);

    return newTask;
}
TaskProfiles[TaskProfile_Enum.PrimeHarvester] = PrimeHarvesterProfile;

const TransporterProfile = function (routeId, size, resourceType) {
    const newTask = new Task();
    newTask.SetArgument(TaskArgs_Enum.TaskId, 'Transporter_' + routeId);
    newTask.SetArgument(TaskArgs_Enum.Resource, resourceType);
    newTask.SetArgument(TaskArgs_Enum.Body, CreateBody([[size, MOVE], [size, CARRY]]));

    const ActionList = [];
    const RetrieveCommand = {
        Commands: [{ Action: CreepCommand_Enum.Withdraw },
        { Action: CreepCommand_Enum.Pickup }]
    };
    ActionList.push(RetrieveCommand);

    const DeliverCommand = { Commands: [{ Action: CreepCommand_Enum.Deliver }] };
    ActionList.push(DeliverCommand);
    newTask.SetArgument(TaskArgs_Enum.ActionList, ActionList);

    return newTask;
}
TaskProfiles[TaskProfile_Enum.Transporter] = TransporterProfile;

const UpgraderProfile = function () {
    const newTask = new Task();

    newTask.SetArgument(TaskArgs_Enum.TaskId, 'Upgrader');

    const ActionList = [];
    const RetrieveCommand = {
        Commands: [{ Action: CreepCommand_Enum.Withdraw },
        { Action: CreepCommand_Enum.ReqTransfer },
        { Action: CreepCommand_Enum.Harvest }]
    }
    ActionList.push(RetrieveCommand);

    const UpgradeCommand = { Commands: [{ Action: CreepCommand_Enum.Upgrade }] };
    ActionList.push(UpgradeCommand);
    newTask.SetArgument(TaskArgs_Enum.ActionList, ActionList);

    return newTask;
}
TaskProfiles[TaskProfile_Enum.Upgrader] = UpgraderProfile;

const SweeperProfile = function (anchorPos) {
    const newTask = new Task();

    newTask.SetArgument(TaskArgs_Enum.TaskId, 'Sweeper');
    newTask.SetArgument(TaskArgs_Enum.AnchorPos, anchorPos);

    const ActionList = [];
    const SweepCommand = { Commands: [{ Action: CreepCommand_Enum.Pickup }] };
    ActionList.push(SweepCommand);

    const WaitCommand = { Commands: [{ Action: CreepCommand_Enum.WaitAt, Location: TaskArgs_Enum.AnchorPos }] };
    ActionList.push(WaitCommand);
    newTask.SetArgument(TaskArgs_Enum.ActionList, ActionList);

    return newTask;


}
TaskProfiles[TaskProfile_Enum.Sweeper] = SweeperProfile;

const RequestTaskProfile = function (profile, args) {
    for (const profileType in TaskProfiles) {
        if (profile == profileType) {
            return TaskProfiles[profile](args);
        }
    }

    return ERR_INVALID_ARGS;
}
module.exports = RequestTaskProfile; // Eventually this should be able to store and load custom profiles.