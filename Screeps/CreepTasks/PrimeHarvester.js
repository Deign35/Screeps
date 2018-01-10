// Idea for harvester/Source, Detect the position around the source with the most moveable space.  Put the container there.
const PrimeHarvesterProfile = function (sourceId, anchorPos) {
    const newTask = new Task();
    newTask.SetArgument(TaskArgs_Enum.TaskId, 'PH_' + sourceId);
    newTask.SetArgument(TaskArgs_Enum.FixedTargets, [sourceId]);
    newTask.SetArgument(TaskArgs_Enum.AnchorPos, anchorPos);
    newTask.SetArgument(TaskArgs_Enum.Body, CreateBody([[6, WORK],[1, MOVE]]));

    const ActionList = [];
    const GoToCommand = { Commands: [{ Action: CreepCommand_Enum.WaitAt, Location: TaskArgs_Enum.AnchorPos }] };
    ActionList.push(GoToCommand);

    const HarvestCommand = { Commands: [{ Action: CreepCommand_Enum.Harvest, FixedTarget: 0 }] };
    ActionList.push(HarvestCommand);
    newTask.SetArgument(TaskArgs_Enum.ActionList, ActionList);

    return newTask;
}

// have callbacks for various return calls?
// will every creep type have a giant config file?

// How to state-ify it using enums and calls to generic evaluations (like ActionList)