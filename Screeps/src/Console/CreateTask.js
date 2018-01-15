const CreateTask = {};

CreateTask['ByProfile'] = function (profile, roomName) {
    let newTask = TaskProfiles.CreateTaskFromConsole(profile, roomName);
    let room = Game.rooms[roomName].AddTask(newTask);
}

CreateTask['Custom'] = function (room) {
    let defaultTask = new Task();
    defaultTask.SetArgument(TaskArgs_Enum.TaskId, 'CustomTask_' + Game.time);
    defaultTask.SetArgument(TaskArgs_Enum.Body, [MOVE, CARRY, WORK]);

    const ActionList = [];
    ActionList.push(ActionTemplates.CreateActionFromEnum(CreepCommand_Enum.Harvest, new Array(CreepTargetType_Enum.Find, FIND_SOURCES)));
    ActionList.push(ActionTemplates.CreateActionFromEnum(CreepCommand_Enum.Transfer, new Array(roomName, transferCallback)));
    ActionList.push(ActionTemplates.CreateActionFromEnum(CreepCommand_Enum.Build, new Array(roomName)));
    ActionList.push(ActionTemplates.CreateActionFromEnum(CreepCommand_Enum.Upgrade, 0));

    defaultTask.SetArgument(TaskArgs_Enum.ActionList, ActionList);
}

CreateTask['CreateStructure'] = function (x, y, roomName, structureType) {
    let room = Game.rooms[roomName];
    room.createConstructionSite(x, y, structureType);

    let constructionTask = new Task();
    constructionTask.SetArgument(TaskArgs_Enum.TaskId, 'CreateStructure_' + Game.time);
    constructionTask.SetArgument(TaskArgs_Enum.Body, [MOVE, MOVE, CARRY, WORK]);

    const ActionList = [];
    ActionList.push(ActionTemplates.CreateActionFromEnum(CreepCommand_Enum.Harvest, new Array(CreepTargetType_Enum.Find, FIND_SOURCES)));
    
    let buildAction = {};
    buildAction[ActionArgs_Enum.Action] = CreepCommand_Enum.Build;
    buildAction[ActionArgs_Enum.TargetType] = CreepTargetType_Enum.AtPosition;
    buildAction[ActionArgs_Enum.TargetArg] = new Array(new RoomPosition(x, y, roomName), LOOK_CONSTRUCTION_SITES);
    buildAction[ActionArgs_Enum.ArgsList] = new Array(ActionArgs_Enum.TargetType);
    ActionList.push(buildAction);

    constructionTask.SetArgument(TaskArgs_Enum.ActionList, ActionList);

    room.AddTask(constructionTask);
}

module.exports = CreateTask;