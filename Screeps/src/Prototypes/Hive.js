Room.prototype.TransferTargetCallback = function (task, command) {
    StartFunction('Room.TransferTargetCallback');
    if (!task.Cache[TaskMemory_Enum.TargetId]) {
        if (command[ActionArgs_Enum.Action] == CreepCommand_Enum.Transfer) {
            // Use the room to find a creep that should receive a transfer.

            const foundStructures = this.find(FIND_STRUCTURES, {
                filter: function (structure) {
                    console.log("CHECKING: " + structure.structureType);
                    if (structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_LINK ||
                        structure.structureType == STRUCTURE_TOWER) {
                        console.log('structureType found + energy/capacity: ' + structure.energy + '/' + structure.energyCapacity);
                        return structure.energy < structure.energyCapacity;
                    }
                    if (structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_STORAGE) {
                        console.log('structureType found + energy/capacity: ' + structure.store[RESOURCE_ENERGY] + '/' + structure.storeCapacity);
                        // Idea: add a storeCapacity array instead of the one number
                        return structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    }
                    console.log('structureType failed...');
                    return false;
                }
            });
            const closest = Game.creeps[task.Cache[TaskMemory_Enum.Slave]].pos.findClosestByRange(foundStructures);
            if (closest) {
                task.Cache[TaskMemory_Enum.TargetId] = closest.id;
                task.Cache[TaskMemory_Enum.TargetPos] = closest.pos;
            }
        }
    }
    EndFunction();
    return OK;
};

Room.prototype.InitMemory = function () {
    StartFunction('Room.InitMemory');
    this.Brain = {};
    this.Brain.PrevConstructionSites = [];
    this.HiveMind = new HiveMind(this.name, {});

    // Create contracts for each source.
    const sources = this.find(FIND_SOURCES);

    for (let i = 0, length = sources.length; i < length; i++) {
        // if i have enough energy and a storage/container to drop on to.
        let sourceHarvesterTask = new Task();
        sourceHarvesterTask.SetArgument(TaskArgs_Enum.TaskId, 'Harvester_' + sources[i].id);
        sourceHarvesterTask.SetArgument(TaskArgs_Enum.Body, [MOVE, CARRY, WORK]);
        //sourceHarvesterTask.SetArgument(TaskArgs_Enum.AnchorPos, sources[i].pos);

        let fixedTargets = [];
        fixedTargets.push(sources[i].id);
        sourceHarvesterTask.SetArgument(TaskArgs_Enum.FixedTargets, fixedTargets);

        const ActionList = [];
        let harvestAction = {};
        harvestAction[ActionArgs_Enum.Action] = CreepCommand_Enum.Harvest;
        harvestAction[ActionArgs_Enum.TargetType] = CreepTargetType_Enum.FixedTarget;
        harvestAction[ActionArgs_Enum.TargetArg] = 0;

        let harvestArgs = [];
        harvestArgs.push(ActionArgs_Enum.TargetType);
        harvestAction[ActionArgs_Enum.ArgsList] = harvestArgs;

        let harvestResponses = {};
        harvestResponses[ERR_NOT_IN_RANGE] = CreepCommandResponse_Enum.Move;
        harvestResponses[ERR_NOT_ENOUGH_RESOURCES] = CreepCommandResponse_Enum.Continue;
        harvestResponses[OK] = CreepCommandResponse_Enum.Continue;
        harvestResponses[ERR_FULL] = CreepCommandResponse_Enum.Next;
        harvestAction[ActionArgs_Enum.Responses] = harvestResponses;

        ActionList.push(harvestAction);

        let transferAction = {};
        transferAction[ActionArgs_Enum.Action] = CreepCommand_Enum.Transfer;
        transferAction[ActionArgs_Enum.ArgsList] = [ActionArgs_Enum.TargetType, ActionArgs_Enum.ResourceType];
        transferAction[ActionArgs_Enum.TargetType] = CreepTargetType_Enum.Callback;
        transferAction[ActionArgs_Enum.TargetArg] = new Delegate(CallbackType_Enum.Room, this.name, 'TransferTargetCallback');
        transferAction[ActionArgs_Enum.ResourceType] = RESOURCE_ENERGY;
        let transferArgs = [];
        transferArgs.push(ActionArgs_Enum.TargetType);
        transferArgs.push(ActionArgs_Enum.ResourceType);
        transferAction[ActionArgs_Enum.ArgsList] = transferArgs;

        let transferResponses = {};
        transferResponses[ERR_INVALID_TARGET] = CreepCommandResponse_Enum.Next;
        transferResponses[ERR_NOT_ENOUGH_RESOURCES] = CreepCommandResponse_Enum.Next;
        transferResponses[ERR_FULL] = CreepCommandResponse_Enum.ReqTarget;
        transferResponses[ERR_NOT_IN_RANGE] = CreepCommandResponse_Enum.Move;
        transferResponses[OK] = CreepCommandResponse_Enum.Continue;
        transferAction[ActionArgs_Enum.Responses] = transferResponses;

        ActionList.push(transferAction);

        sourceHarvesterTask.SetArgument(TaskArgs_Enum.ActionList, ActionList);
        this.HiveMind.PostNewTask(sourceHarvesterTask);
    }

    /*const upgraderTask = HiveMind.CreateTaskFromProfile(TaskProfile_Enum.Upgrader);
    upgraderTask.SetArgument(TaskArgs_Enum.Body, CreateBody([...([1, WORK], [2, MOVE], [2, CARRY])]));
    // do things like make the body
    this.HiveMind.PostNewTask(upgraderTask);

    const sweeperTask = HiveMind.CreateTaskFromProfile(TaskProfile_Enum.Sweeper, [this.controller.pos]);
    sweeperTask.SetArgument(TaskArgs_Enum.Body, CreateBody([...([1, WORK], [2, MOVE], [2, CARRY])]));
    // do things like make the body
    this.HiveMind.PostNewTask(sweeperTask);

    //Temporary GenPop
    for (let i = 0; i < 5; i++) {
        this.HiveMind.PostNewTask(HiveMind.CreateTaskFromProfile(TaskProfile_Enum.Default, [('GenPop_' + i)]));
    }*/

    this.Brain.TaskMemory = this.HiveMind.TaskMemory;

    EndFunction();
    return OK;
};

Room.prototype.Init = function () {
    StartFunction('Room.Init');
    this.HiveMind = new HiveMind(this.name, this.Brain.TaskMemory);

    //Construction sites shouldn't be "found"
    const allSites = _.map(this.find(FIND_MY_CONSTRUCTION_SITES), 'id');
    const newSites = _.without(allSites, this.Brain.PrevConstructionSites);
    this.Brain.PrevConstructionSites = allSites;

    /*for (let i = 0, length = newSites.length; i < length; i++) {
        const builderTask = HiveMind.CreateTaskFromProfile(TaskProfile_Enum.Default, ['CS_' + newSites[i]]);
        // stuff
        this.HiveMind.PostNewTask(builderTask);
    }*/

    EndFunction();
    return OK;
}

Room.prototype.Activate = function () {
    StartFunction('Room.Activate');
    this.HiveMind.UpdateTasks();
    EndFunction();
    return OK;
};

Room.prototype.Complete = function () {
    StartFunction('Room.Complete');
    this.HiveMind.ResolvePendingTasks();
    if (this.HiveMind.PendingTasks.length > 0) {
        for (let i = 0; i < this.HiveMind.PendingTasks.length; i++) {
            // Try to spawn a creep for each pending task.
            let pendingTask = this.HiveMind.PendingTasks[i];
            if (Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], 'Worker', { dryRun: true }) == OK) {
                const name = 'Spawn1_' + Game.time;
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], name);
                this.HiveMind.RequestTask(new Delegate(CallbackType_Enum.Room, this.name, 'SpawnCallback'));
                /*let newBrain = {};
                newBrain.CommandData = {}; // For saving data for the current command
                newBrain['CurrentCommand'] = {};
                Overmind.SaveData(name, newBrain);*/
                break;

                // This is the hive...
                // Set the creep up with a job.
                // What about creeps moving between rooms, do they still need a creep manager?
                // Or is assigning the creep to the new room going to be good enough?
                // 
            }
        }
    } else if (this.HiveMind.PendingRequests.length > 0) {
        const unemployedCreeps = this.HiveMind.PendingRequests;
        for (let i = 0; i < this.HiveMind.PendingRequests.length; i++) {
            // Try to find a job for the creep.
        }
    }

    this.HiveMind.ResolvePendingTasks();
    this.Brain.TaskMemory = this.HiveMind.TaskMemory;
    EndFunction();
    return OK;
};

Room.prototype.SpawnCallback = function (task) {
    // I dont have access to the creep information anymore.  Should take care of that some other way.
    task.Cache[TaskMemory_Enum.Slave] = 'Spawn1_' + Game.time;
}