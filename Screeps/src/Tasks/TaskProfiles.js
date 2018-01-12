const TaskProfiles = {};

const DefaultProfile = function ([taskId, roomName, transferCallback]) {
    let defaultTask = new Task();
    defaultTask.SetArgument(TaskArgs_Enum.TaskId, taskId);
    defaultTask.SetArgument(TaskArgs_Enum.Body, [MOVE, CARRY, WORK]);

    let fixedTargets = [];
    fixedTargets.push(Game.rooms[roomName].controller.id);
    defaultTask.SetArgument(TaskArgs_Enum.FixedTargets, fixedTargets);

    const ActionList = [];
    let harvestProfileArgs = [];
    harvestProfileArgs.push(CreepTargetType_Enum.Find);
    harvestProfileArgs.push(FIND_SOURCES);
    ActionList.push(HiveMind.CreateActionFromProfile(CreepCommand_Enum.Harvest, new Array(CreepTargetType_Enum.Find, FIND_SOURCES)));
    ActionList.push(HiveMind.CreateActionFromProfile(CreepCommand_Enum.Transfer, new Array(roomName, transferCallback)));
    ActionList.push(HiveMind.CreateActionFromProfile(CreepCommand_Enum.Build, new Array(roomName)));
    ActionList.push(HiveMind.CreateActionFromProfile(CreepCommand_Enum.Upgrade, 0));

    defaultTask.SetArgument(TaskArgs_Enum.ActionList, ActionList);

    return defaultTask;
}
TaskProfiles[TaskProfile_Enum.Default] = DefaultProfile;

// Idea for harvester/Source, Detect the position around the source with the most moveable space.  Put the container there.
const PrimeHarvesterProfile = function ([sourceId, anchorPos]) {
    const newTask = new Task();
    newTask.SetArgument(TaskArgs_Enum.TaskId, 'PH_' + sourceId);
    let fixedTargets = [];
    fixedTargets.push(sourceId);
    newTask.SetArgument(TaskArgs_Enum.FixedTargets, fixedTargets);
    newTask.SetArgument(TaskArgs_Enum.AnchorPos, anchorPos);
    newTask.SetArgument(TaskArgs_Enum.Body, CreateBody([[5, WORK], [1, MOVE]]));

    const ActionList = [];
    const GoToCommand = { Commands: [{ Action: CreepCommand_Enum.WaitAt, Location: TaskArgs_Enum.AnchorPos }] };
    ActionList.push(GoToCommand);

    const HarvestCommand = { Commands: [{ Action: CreepCommand_Enum.Harvest, FixedTarget: 0 }] };
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

const UpgraderProfile = function ([taskId, roomName]) {
    let upgraderTask = new Task();
    upgraderTask.SetArgument(TaskArgs_Enum.TaskId, taskId);
    upgraderTask.SetArgument(TaskArgs_Enum.Body, [MOVE, CARRY, WORK]);

    let fixedTargets = [];
    fixedTargets.push(Game.rooms[roomName].controller.id);
    upgraderTask.SetArgument(TaskArgs_Enum.FixedTargets, fixedTargets);

    const ActionList = [];
    // Harvest needs to just pick nearest -- CreepTargetType_Enum.Nearest
    let harvestProfileArgs = [];
    harvestProfileArgs.push(CreepTargetType_Enum.Find);
    harvestProfileArgs.push(FIND_SOURCES);
    ActionList.push(HiveMind.CreateActionFromProfile(CreepCommand_Enum.Harvest, harvestProfileArgs));
    ActionList.push(HiveMind.CreateActionFromProfile(CreepCommand_Enum.Upgrade, 0));

    upgraderTask.SetArgument(TaskArgs_Enum.ActionList, ActionList);

    return upgraderTask;
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