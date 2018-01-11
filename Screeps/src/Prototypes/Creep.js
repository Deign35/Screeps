Creep.prototype.ExecuteCommand = function (task) {
    StartFunction('Creep[' + this.id + '].ExecuteCommand(' + task.GetArgument(TaskArgs_Enum.TaskId) + ')');

    const actionList = task.taskArgs[TaskArgs_Enum.ActionList];

    let command = actionList[taskMem[TaskMemory_Enum.ActionIndex]];
    let argsList = command[ActionArgs_Enum.ArgList];
    let args = [];
    let target = {};
    while (argsList.length > 0) {
        let arg = argsList.pop();
        if (arg == ActionArgs_Enum.TargetType) {
            if (command.TargetType == CreepTargetType_Enum.FixedTarget) {
                target = Game.getObjectById(task[TaskArgs_Enum.FixedTargets][command.TargetArg]);
                args.push(target);
            } else if (command.TargetType == CreepTargetType_Enum.TargetList) {
                console.log('NOT IMPLEMENTED');
            } else if (command.TargetType == CreepTargetType_Enum.Callback) {
                target = Game.getObjectById(command.TargetArg.Callback(task));
                args.push(target);
            }
        }
        if (arg == ActionArgs_Enum.ResourceType) {
            args.push(command[ActionArgs_Enum.ResourceType]);
        }
    }

    const actionResult = this['' + command['Action']].apply(this, args);
    this.DefaultCreepCommandResponse(task, target, actionResult);
    
    EndFunction();
    return OK;
}

Creep.prototype.DefaultCreepCommandResponse = function (task, target, taskResult) {
    StartFunction('Creep.DefaultCreepCommandResponse');

    const expectedResponses = command[ActionArgs_Enum.Responses];
    if (!expectedResponses[actionResult]) {
        console.log('DO NOT KNOW HOW TO PROCESS THIS');
        throw Error('Task to do ' + command['Action'] + ' couldnt handle response ' + actionResult);
    }

    const response = expectedResponses[actionResult];

    if (response == CreepCommandResponse_Enum.Move) {
        // (TODO): Need to find a good way to cache this.
        let moveResult = this.moveTo(task.Cache[TaskMemory_Enum.TargetPos], {
            visualizePathStyle: {
                fill: 'transparent',
                stroke: 'green', // Const?
                //lineStyle: 'undefined',
                strokeWidth: .2,
                opacity: .7
            },
            reusePath: 5,

        });
        // Do the move check here and translate responseResult to something else if needed.
        // i.e. if NO PATH -> response = Next
        /*if (moveResult == ERR_NO_PATH) {
            response = CreepCommandResponse_Enum.Next;
        }*/

        console.log('MoveResult: ' + moveResult);
    }
    if (response == CreepCommandResponse_Enum.CheckCarryIsFull) {

    }

    if (response == CreepCommandResponse_Enum.Retry) {
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
        runAgain = this.room.RequestContractJob(this);
        // Request a new command from it's hive.  this.room is not good!
        // perhaps the creep shouldn't associate to a specific hive anyway???
    }

    //console.log('Command: ' + command.Command + ' result: ' + commandResult + ' response: ' + response + ' runAgain: ' + runAgain);
    EndFunction();
    return runAgain;
}*/

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