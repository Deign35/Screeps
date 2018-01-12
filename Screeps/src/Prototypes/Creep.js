Creep.prototype.ExecuteTask = function (task) {
    StartFunction('Creep[' + this.id + '].ExecuteTask(' + task.GetArgument(TaskArgs_Enum.TaskId) + ')');
    const ExecutionResult = {};

    const actionList = task.GetArgument(TaskArgs_Enum.ActionList);

    let command = actionList[task.Cache[TaskMemory_Enum.ActionIndex]];
    let argsList = command[ActionArgs_Enum.ArgsList];
    let args = [];
    for (let i = 0, length = argsList.length; i < length; i++) {
        let arg = argsList[i];
        if (arg == ActionArgs_Enum.TargetType) {
            let target = this.FindTarget(command[ActionArgs_Enum.TargetType], command[ActionArgs_Enum.TargetArg]);
            args.push(target);

            if (!target) {
                ExecutionResult[TaskExecutionResult_Enum.ActionResult] = ERR_INVALID_TARGET;
                return ExecutionResult;
            }
            ExecutionResult[TaskExecutionResult_Enum.Target] = target;
        }
        if (arg == ActionArgs_Enum.ResourceType) {
            args.push(command[ActionArgs_Enum.ResourceType]);
        }
    }

    ExecutionResult[TaskExecutionResult_Enum.ActionCommand] = command[ActionArgs_Enum.Action];
    ExecutionResult[TaskExecutionResult_Enum.ActionResult] = this[command[ActionArgs_Enum.Action]].apply(this, args);
    EndFunction();
    return ExecutionResult;
}

Creep.prototype.Activate = function () {
    StartFunction('Creep[' + this.name + '].Activate');
    if (this.spawning) { return OK; }

    if (!this.Brain.CurrentCommand.Command) {
        // Request a job from the hive.
        if (this.room.controller.my) {
            this.room.SignContract(this);
        } else {
            // need to request assignment from the swarm of where to go. for now though...
            // (ALERT): if command suicide is failing, it's probably because i didn't construct the command right.  add the other params.
            this.Brain.CurrentCommand = CreepManager.CreateNewCommand(CreepCommand_Enum.Suicide); //, null, [], {});
        }
    } else {
        while (this.ExecuteCommand(this.Brain.CurrentCommand));
    }

    EndFunction();
    return OK;
};

Creep.prototype.FindTarget = function(targetType, targetArg) {
    let target = {};
    if (targetType == CreepTargetType_Enum.FixedTarget) {
        target = Game.getObjectById(targetArg);
    } else if (targetType == CreepTargetType_Enum.Callback) {
        let callbackDelegate = Delegate.FromData(targetArg);
        let callbackArgs = [];
        callbackArgs.push(task);
        callbackArgs.push(command);
        callbackDelegate.Callback(callbackArgs);
        target = Game.getObjectById(task.Cache[TaskMemory_Enum.TargetId]);
    } else if (command[ActionArgs_Enum.TargetType] == CreepTargetType_Enum.Find) {
        // If path is blocked, they can't get to the source.
        // Using findClosestByPath is slower, but works better.
        target = this.pos.findClosestByRange(command[ActionArgs_Enum.TargetArg]);
        //Memory.DataDump.push()
    } else if (command[ActionArgs_Enum.TargetType] == CreepTargetType_Enum.NearestStructure) {
        // find the structure closets based on targetArg
        console.log('NOT IMPLEMENTED');
    }
}

const prototypeFolderName = 'Prototypes_Creep_';
require(prototypeFolderName + 'CustomCommands');
require(prototypeFolderName + 'BasicCommands');
require(prototypeFolderName + 'FindTarget');