const Task = function Task() {
    this.taskArguments = {}; // Change the name of taskArgs to ensure no one is attempting to access it directly.
    this.InitCache();
};

Task.prototype.InitCache = function() {
    this.Cache = {};
    this.Cache[TaskMemory_Enum.TargetList] = [];
    this.Cache[TaskMemory_Enum.ActionIndex] = 0;
    this.Cache[TaskMemory_Enum.RetryCount] = 0;
}

Task.prototype.SetArgument = function(argId, value) {
    this.taskArguments[argId] = value;
}

Task.prototype.GetArgument = function (argId) {
    return this.taskArguments[argId] || {}; // default empty obj????
}

Task.prototype.ToData = function () {
    const TaskData = {
        TaskArgs: this.taskArguments,
        Cache: this.Cache,
    }

    return TaskData;
}

Task.FromData = function (taskData) {
    let newTask = new Task();
    newTask.taskArguments = taskData['TaskArgs'];
    newTask.Cache = taskData['Cache'];
    return newTask;
}

Task.prototype.Evaluate = function () {
    if (!this.Cache[TaskMemory_Enum.Slave]) { return TaskResults_Enum.ContractorRequired; }
    // Need a callback delegate here.  Perhaps directly to the object the request was made for/by?
    // Or does the callback delegate go to the task fulfiller?
    const creep = Game.creeps[this.Cache[TaskMemory_Enum.Slave]];
    if (!creep) { return TaskResults_Enum.ContractorRequired; }
    if (creep.spawning) { return OK; }
    StartFunction('Task.Evaluate');
    let taskResult = TaskResults_Enum.Incomplete;

    let executionResult = creep.ExecuteTask(this);
    let command = this.GetArgument(TaskArgs_Enum.ActionList)[this.Cache[TaskMemory_Enum.ActionIndex]];
    let response = CreepCommandResponse_Enum.Retry;

    const customResponses = command[ActionArgs_Enum.Responses];
    if (customResponses && customResponses[executionResult[TaskExecutionResult_Enum.ActionResult]]) {
        response = customResponses[executionResult[TaskExecutionResult_Enum.ActionResult]];
    } else {
        const defaultResponses = ActionTemplates[ActionArgs_Enum.Responses][executionResult[TaskExecutionResult_Enum.ActionCommand]];

        if (!defaultResponses[executionResult[TaskExecutionResult_Enum.ActionResult]]) {
            console.log('DO NOT KNOW HOW TO PROCESS THIS');
            throw Error('Task to do ' + command[ActionArgs_Enum.Action] + ' couldnt handle response ' + executionResult[TaskExecutionResult_Enum.ActionResult]);
        }

        response = defaultResponses[executionResult[TaskExecutionResult_Enum.ActionResult]];
    }

    if (response == CreepCommandResponse_Enum.Move) {
        // (TODO): Need to find a good way to cache this.
        let pathResult = creep.pos.findPathTo(executionResult[TaskExecutionResult_Enum.Target].pos, {
            visualizePathStyle: {
                fill: 'transparent',
                stroke: 'green', // Const?
                //lineStyle: 'undefined',
                strokeWidth: .2,
                opacity: .7
            },
            reusePath: 5,

        });
        let moveResult = creep.moveByPath(pathResult);
        // Do the move check here and translate responseResult to something else if needed.
        // i.e. if NO PATH -> response = Next
        /*if (moveResult == ERR_NO_PATH) {
            response = CreepCommandResponse_Enum.Next;
        }*/
        taskResult = TaskResults_Enum.Incomplete;
    }
    if (response == CreepCommandResponse_Enum.ReqTarget) {
        delete this.Cache[TaskMemory_Enum.TargetId];
        delete this.Cache[TaskMemory_Enum.TargetPos];
        response = CreepCommandResponse_Enum.Retry;
    }

    if (response == CreepCommandResponse_Enum.Continue) {
        // do nothing
        taskResult = TaskResults_Enum.Incomplete;
    }

    if (response == CreepCommandResponse_Enum.Retry) { // Uncertain if Retry works or not.  Needs confirmation.
        console.log(this.Cache[TaskMemory_Enum.RetryCount]);
        if (this.Cache[TaskMemory_Enum.RetryCount] < 5) {
            this.Cache[TaskMemory_Enum.RetryCount] += 1;
            taskResult = TaskResults_Enum.Incomplete;
        } else {
            response = CreepCommandResponse_Enum.Complete;
            console.log(this.name + ' retry max.(' + command.id + ')');
            this.Cache[TaskMemory_Enum.RetryCount] = 0;
        }
    } else {
        this.Cache[TaskMemory_Enum.RetryCount] = 0;
    }

    if (response == CreepCommandResponse_Enum.Complete) {
        // Need to end the task completely.  It is complete.
        taskResult = TaskResults_Enum.Complete;
    }

    if (response == CreepCommandResponse_Enum.Next) {
        let actionIndex = this.Cache[TaskMemory_Enum.ActionIndex];
        let slave = this.Cache[TaskMemory_Enum.Slave];
        this.InitCache();

        const actionCount = this.GetArgument(TaskArgs_Enum.ActionList).length;
        if (++actionIndex == actionCount) {
            actionIndex = 0;
        }

        this.Cache[TaskMemory_Enum.ActionIndex] = actionIndex;
        this.Cache[TaskMemory_Enum.Slave] = slave;
        taskResult = TaskResults_Enum.Retry;
    }

    if (response == CreepCommandResponse_Enum.Reset) {
        let slave = this.Cache[TaskMemory_Enum.Slave];
        this.InitCache();
        this.Cache[TaskMemory_Enum.Slave] = slave;
        taskResult = TaskResults_Enum.Incomplete;
    }

    EndFunction();
    return taskResult;
};

module.exports = Task;