const Task = function Task() {
    this.taskArgs = {};
    this.Cache = {
        Targets: {}
    };
    this.Cache[TaskMemory_Enum.ActionIndex] = 0;
    this.Cache[TaskMemory_Enum.RetryCount] = 0;
};
Task.prototype.SetArgument = function(argId, value) {
    this.taskArgs[argId] = value;
}

Task.prototype.GetArgument = function (argId) {
    return this.taskArgs[argId] || {}; // default empty obj????
}

Task.prototype.ToData = function () {
    const TaskData = {
        TaskArgs: this.taskArgs,
        Cache: this.Cache,
    }

    return TaskData;
}

Task.FromData = function (taskData) {
    let newTask = new Task();
    newTask.taskArgs = taskData['TaskArgs'];
    newTask.Cache = taskData['Cache'];
    return newTask;
}

Task.prototype.Evaluate = function () {
    // Need a callback delegate here.  Perhaps directly to the object the request was made for/by?
    // Or does the callback delegate go to the task fulfiller?
    if (Memory.Check) {
        return TaskResults_Enum.Incomplete;
    }
    Memory.Check = true;
    return TaskResults_Enum.ContractorRequired;
};

module.exports = Task;