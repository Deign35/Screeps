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

Task.prototype.Evaluate = function () { return TaskResults_Enum.Incomplete; };

module.exports = Task;