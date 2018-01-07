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

const TaskMaster = function TaskMaster(roomName, taskManagerMemory) {
    StartFunction('TaskMaster.ctor(' + roomName + ')');

    this.TaskMemory = taskManagerMemory;
    this.DebugId = 'TaskMaster[' + roomName + ']';
    this.PendingTasks = [];
    this.PendingRequests = [];

    this.PostNewTask = function (taskArgs) {
        StartFunction(DebugId + '.PostNewTask: ' + taskArgs.id);

        if (this.TaskMemory[taskArgs.id]) {
            console.log('Task being reissued... Is this desired?');
            Memory.DebugData[this.DebugId] = taskArgs;
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
        StartFunction(DebugId + '.UpdateTasks()');
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
        StartFunction(DebugId + '.ResolvePendingTasks()');

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

TaskMaster.prototype.CreateTask = require('TaskProfiles');

module.exports = TaskMaster;