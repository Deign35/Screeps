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
            let target = {};
            if (command[ActionArgs_Enum.TargetType] == CreepTargetType_Enum.FixedTarget) {
                target = Game.getObjectById(task.GetArgument(TaskArgs_Enum.FixedTargets)[command[ActionArgs_Enum.TargetArg]]);
                args.push(target);
            } else if (command[ActionArgs_Enum.TargetType] == CreepTargetType_Enum.TargetList) {
                console.log('NOT IMPLEMENTED');
            } else if (command[ActionArgs_Enum.TargetType] == CreepTargetType_Enum.Callback) {
                let callbackDelegate = Delegate.FromData(command[ActionArgs_Enum.TargetArg]);
                let callbackArgs = [];
                callbackArgs.push(task);
                callbackArgs.push(command);
                callbackDelegate.Callback(callbackArgs);
                target = Game.getObjectById(task.Cache[TaskMemory_Enum.TargetId]);
                args.push(target);
            } else if (command[ActionArgs_Enum.TargetType] == CreepTargetType_Enum.Find) {
                // this.room.find(targetArg);
            } else if (command[ActionArgs_Enum.TargetType] == CreepTargetType_Enum.NearestStructure) {
                // find the structure closets based on targetArg
            }

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

    ExecutionResult[TaskExecutionResult_Enum.ActionResult] = this[command[ActionArgs_Enum.Action]].apply(this, args);
    EndFunction();
    return ExecutionResult;
}

Creep.prototype.DefaultCreepCommandResponse = function (task, target, actionResult) {
    StartFunction('Creep.DefaultCreepCommandResponse');
    let command = task.GetArgument(TaskArgs_Enum.ActionList)[task.Cache[TaskMemory_Enum.ActionIndex]];

    const expectedResponses = command[ActionArgs_Enum.Responses];
    if (!expectedResponses[actionResult]) {
        console.log('DO NOT KNOW HOW TO PROCESS THIS');
        throw Error('Task to do ' + command[ActionArgs_Enum.Action] + ' couldnt handle response ' + actionResult);
    }

    const response = expectedResponses[actionResult];

    if (response == CreepCommandResponse_Enum.Move) {
        // (TODO): Need to find a good way to cache this.
        let pathResult = this.pos.findPathTo(target, {
            visualizePathStyle: {
                fill: 'transparent',
                stroke: 'green', // Const?
                //lineStyle: 'undefined',
                strokeWidth: .2,
                opacity: .7
            },
            reusePath: 5,

        });
        let moveResult = this.moveByPath(pathResult);
        // Do the move check here and translate responseResult to something else if needed.
        // i.e. if NO PATH -> response = Next
        /*if (moveResult == ERR_NO_PATH) {
            response = CreepCommandResponse_Enum.Next;
        }*/

        console.log('MoveResult: ' + moveResult);
    }
    if (response == CreepCommandResponse_Enum.ReqTarget) {
        delete task.Cache[TaskMemory_Enum.TargetId];
        delete task.Cache[TaskMemory_Enum.TargetPos];
        response = CreepCommandResponse_Enum.Retry;
    }

    if (response == CreepCommandResponse_Enum.Continue) {
        // do nothing
    }

    if (response == CreepCommandResponse_Enum.Retry) {
        if (task.Cache[TaskMemory_Enum.RetryCount] < 5) {
            task.Cache[TaskMemory_Enum.RetryCount] += 1;
        } else {
            response = CreepCommandResponse_Enum.Next;
            console.log(this.name + ' retry max.(' + command.id + ')');
            task.Cache[TaskMemory_Enum.RetryCount] = 0;
        }
    } else {
        task.Cache[TaskMemory_Enum.RetryCount] = 0;
    }

    if (response == CreepCommandResponse_Enum.Complete) {
        // Need to end the task completely.  It is complete.
    }

    if (response == CreepCommandResponse_Enum.Next) {
        task.Next();
    }

    /*if (response == CreepCommandResponse_Enum.Retry) {
        if (this.Brain['retryCount'] < 5) {
            this.Brain['retryCount'] += 1;
        } else {
            this.Brain.CommandData = {};
            response = CreepCommandResponse_Enum.Next;
            console.log(this.name + ' retry max.(' + command.id + ')');
            this.Brain['retryCount'] = 0;
        }
    } else {
        this.Brain['retryCount'] = 0;
    }

    if (response == CreepCommandResponse_Enum.Next) {
        runAgain = true;
        if (this.Brain.CommandData['RequiresResources']) {
            this.Brain.CommandData['RequiresResources'] = false;
            delete this.Brain.CommandData['ResourceCommand'];
            delete this.Brain.CommandData['resourceTarget'];

            this.Brain.CommandData['HasObtainedResources'] = true;
        } else {
            delete this.Brain.CommandData['target'];
            this.Brain.CurrentCommand = this.Brain.ToDoList.shift();
            if (!this.Brain.CurrentCommand || this.Brain.CurrentCommand == null) {
                response = CreepCommandResponse_Enum.CancelCommands;
            }
        }
    }

    if (response == CreepCommandResponse_Enum.CancelCommands) {
        /*if (!this.Brain.BrokenCommand) {
            this.Brain.BrokenCommand = {};
        }
        this.Brain.BrokenCommand[Game.time] = this.Brain.CurrentCommand;
        //console.log('Command: ' + command.Command + ' result: ' + commandResult + ' response: ' + response + ' responseResult: ' + responseResult);
        //console.log(this.Brain.CommandData['target']);
        //this.Brain.CurrentCommand = CreepManager.CreateNewCommand('say', null, ['Job Canceled: ' + this.Brain.CurrentCommand.Command + ': ' + commandResult]);*/
        //runAgain = this.room.RequestContractJob(this);
        // Request a new command from it's hive.  this.room is not good!
        // perhaps the creep shouldn't associate to a specific hive anyway???
    //}

    //console.log('Command: ' + command.Command + ' result: ' + commandResult + ' response: ' + response + ' runAgain: ' + runAgain);
    EndFunction();
    return OK;
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
const prototypeFolderName = 'Prototypes_Creep_';
require(prototypeFolderName + 'CustomCommands');
require(prototypeFolderName + 'BasicCommands');
require(prototypeFolderName + 'FindTarget');