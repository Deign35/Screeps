Creep.prototype.ExecuteCommand = function (command) {
    StartFunction('Creep[' + this.id + '].ExecuteCommand(' + command.Command + ')');
    let actionResult = OK;

    let commandExe = command;
    let commandTarget = 'target';
    if (this.Brain.CommandData['ResourceCommand']) {
        commandTarget = 'resourceTarget';
        commandExe = this.Brain.CommandData['ResourceCommand'];
    }

    let commandArgs = Object.create(commandExe.CommandArgs);
    const commandRequiresTarget = commandArgs[0] == commandTarget;
    if (commandRequiresTarget && !this.Brain.CommandData[commandTarget]) {
        if (commandExe.CommandTarget != null) {
            this.SetTarget(Game.getObjectById(commandExe.CommandTarget));
        }

        // Default is to do a FindTarget given the command.
        if (!this.Brain.CommandData[commandTarget]) {
            actionResult = this.FindTarget(commandExe);
        }
    }

    if (actionResult == OK) {
        if (commandRequiresTarget) {
            commandArgs[0] = Game.getObjectById(this.Brain.CommandData['target']);
            this.CommandTarget = commandArgs[0];
        }

        actionResult = this[commandExe.Command].apply(this, commandArgs);
    } else {
        // Need to set up to handle Next/RunAgain? (i dont think so)
    }
    const response = this.DefaultCreepCommandResponse(commandExe, actionResult);

    EndFunction();
    return response;
}

Creep.prototype.DefaultCreepCommandResponse = function (command, commandResult) {
    StartFunction('Creep.DefaultCreepCommandResponse');
    let runAgain = false;
    let response = (command.CommandResponse && command.CommandResponse[commandResult]) || Consts.CreepCommandResponseDefaults[commandResult];
    //console.log('Command: ' + command.Command + ' result: ' + commandResult + ' response: ' + response);

    if (response == CreepCommandResponse_Enum.Move) {
        // (TODO): Need to find a good way to cache this.
        let moveResult = this.moveTo(this.CommandTarget, {
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
        if (moveResult == ERR_NO_PATH) {
            response = CreepCommandResponse_Enum.Next;
        }
    }

    if (response == CreepCommandResponse_Enum.RequireTarget) {
        delete this.Brain.CommandData['target'];
        runAgain = true;
        response = CreepCommandResponse_Enum.Retry;
    }

    if (response == CreepCommandResponse_Enum.RequireResources) {
        if (!this.Brain.CommandData['HasObtainedResources']) {
            runAgain = true;
            response = CreepCommandResponse_Enum.Retry;
            //this.Brain.CommandData['RequiresResources'] = true;
            // (TODO): Find a place to get resources.
            this.Brain.CommandData['ResourceCommand'] = CreepManager.CreateNewCommand(CreepCommand_Enum.Harvest, null, ['resourceTarget']);
        } else {
            response = CreepCommandResponse_Enum.Next;
            delete this.Brain.CommandData['HasObtainedResources'];
        }
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