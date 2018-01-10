const Task = function Task() {
    this.taskArgs = {};
    this.Cache = {
        Targets: {}
    };
    this.Cache[TaskMemory_Enum.ActionIndex] = 0;
    this.Cache[TaskMemory_Enum.CommandIndex] = 0;
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
    if (!this.Cache[TaskMemory_Enum.SlaveCallback]) { return TaskResults_Enum.ContractorRequired; }
    // Need a callback delegate here.  Perhaps directly to the object the request was made for/by?
    // Or does the callback delegate go to the task fulfiller?
    const creep = Game.creeps[this.Cache[TaskMemory_Enum.SlaveCallback]];
    if (creep.spawning) { return OK;}
    creep.Brain = Overmind.LoadData(creep.name);
    creep.ExecuteCommand(this);
    Overmind.SaveData(creep.name, creep.Brain);
    return TaskResults_Enum.Incomplete;
};

module.exports = Task;