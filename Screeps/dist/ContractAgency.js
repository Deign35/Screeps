const InitTaskData = function (taskArgs) {
    StartFunction('InitTaskData');
    let taskData = {};

    taskData['cache'] = {}; // For saving data for the current command
    taskData['retryCount'] = 0;
    taskData['taskId'] = taskArgs.id;
    taskData['ToDoList'] = [...taskArgs.ToDoList];
    taskData['CurrentCommand'] = taskData['ToDoList'].shift();

    EndFunction();
    return taskData;
};

const MemoryId_Stub = 'TaskMaster_';
const TaskMaster = function TaskMaster(room) {
    StartFunction('TaskMaster.ctor(' + room.name + ')');

    this.RoomName = room.name
    this.StartFunctionId = 'TaskMaster[' + this.TaskMasterId + ']';
    this.TaskMasterId = MemoryId_Stub + RoomName;
    this.TaskMemory = MemoryManager.LoadData(this.TaskMasterId);
    this.PendingTasks = [];
    this.PendingRequests = [];

    this.Save = () => { MemoryManager.SaveData(this.TaskMasterId, this.TaskMemory); };

    this.PostNewTask = function (taskArgs) {
        StartFunction(StartFunctionId + '.PostNewTask: ' + taskArgs.id);

        if (this.TaskMemory[taskArgs.id]) {
            console.log('Task being reissued... Is this desired?');
            Memory.DebugData[this.TaskMasterId] = taskArgs;
        } else {
            this.TaskMemory[taskArgs.id] = InitTaskData(taskArgs);
            this.PendingTasks.push(taskArgs.id);
        }

        EndFunction();
        return OK;
    }

    this.RequestTask = function (delegate) {
        this.PendingRequests.push(delegate);
    }

    this.UpdateTasks = function () {
        StartFunction(StartFunctionId + '.UpdateTasks()');
        for (const id in this.TaskMemory) {
            let result = EvaluteTask(this.TaskMemory[id]); // Contract.Evaluate();

            if (result == ContractResults_Enum.Incomplete) {
                // Do nothing
                continue;
            } else if (result == ContractResults_Enum.Complete) {
                // What else needs to be done here?
                delete this.TaskMemory[id];
            } else if(result == ContractResults_Enum.ContractorRequired) {
                this.PendingTasks.push(this.TaskMemory[id]);
            }
        }

        EndFunction();
    }

    this.EvaluateTask = function (task) {
        return result == ContractResults_Enum.Continue;
    }

    this.ResolvePendingTasks = function () {
        StartFunction(StartFunctionId + '.ResolvePendingTasks()');

        while (this.PendingTasks.length > 0 && this.PendingRequests.length > 0) {
            const task = this.PendingTasks.shift();
            // TODO: Find a way to pick the best option instead of just first to go.
            const delegate = this.PendingRequests.shift();
            delegate.Callback(task);
        }

        EndFunction();
        return OK;
    }

    EndFunction();
};

TaskMaster.prototype['NewTasks'] = {};
TaskMaster.prototype.NewTasks[TaskType_Enum.General] = function (taskId, sourceId) {
    StartFunction(StartFunctionId + '.NewTasks[MakeSourceHarvesterTask]');
    const taskArgs = {};
    taskArgs.Memory[TaskMemory_Enum.ActionIndex] = 0;
    taskArgs.Memory[TaskMemory_Enum.RetryCount] = 0;

    taskArgs[TaskArgs_Enum.TaskId] = taskId;
    taskArgs[TaskArgs_Enum.SourceId] = sourceId;
    taskArgs[TaskArgs_Enum.ActionIndex] = 0;

    taskArgs[TaskArgs_Enum.ActionList] = [{
        Commands: [{ Action: CreepCommand_Enum.Withdraw}, {
            Action: CreepCommand_Enum.ReqTransfer}] }, {
            Commands: [{ Action: CreepCommand_Enum.Transfer},
            { Action: CreepCommand_Enum.Build},
            { Action: CreepCommand_Enum.Upgrade, Target = Game.rooms[this.roomName].controller.id }]}];

    EndFunction();
    return OK;
}

// Must have a container to drop on to.
TaskMaster.NewTasks[TaskType_Enum.PrimeHarvester] = function (taskId, sourceId, targetPos) {
    StartFunction(StartFunctionId + '.NewTasks[PrimeHarvester]');
    const taskArgs = {};

    taskArgs[TaskArgs_Enum.Memory] = {};
    taskArgs.Memory[TaskMemory_Enum.ActionIndex] = 0;
    taskArgs.Memory[TaskMemory_Enum.RetryCount] = 0;

    taskArgs[TaskArgs_Enum.TaskId] = taskId;
    taskArgs[TaskArgs_Enum.SourceId] = sourceId;
    taskArgs[TaskArgs_Enum.AnchorPos] = targetPos;
    taskArgs[TaskArgs_Enum.ActionIndex] = 0;

    taskArgs[TaskArgs_Enum.ActionList] = [{ Commands: [{ Action: CreepCommand_Enum.Harvest, Target = 'sourceId' }] }];

    EndFunction();
    return OK;
};

module.exports = TaskMaster;