Room.prototype.TransferTargetCallback = function (task, command) {
    StartFunction('Room.TransferTargetCallback');
    if (!task.Cache[TaskMemory_Enum.TargetId]) {
        if (command[ActionArgs_Enum.Action] == CreepCommand_Enum.Transfer) {
            // Use the room to find a creep that should receive a transfer.

            const foundStructures = this.find(FIND_STRUCTURES, {
                filter: function (structure) {
                    if (structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_LINK ||
                        structure.structureType == STRUCTURE_TOWER) {
                        return structure.energy < structure.energyCapacity;
                    }
                    if (structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_STORAGE) {
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

    this.HiveMind.PostNewTask(TaskProfiles.CreateTaskFromEnum(TaskProfile_Enum.Upgrader, new Array('Upgrader_' + this.name, this.name)));
    for (let i = 0; i < 5; i++) {
        this.HiveMind.PostNewTask(TaskProfiles.CreateTaskFromEnum(TaskProfile_Enum.Default, new Array(this.name + '_GP_' + i, this.name, 'TransferTargetCallback')));
    }

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

    for (let i = 0, length = newSites.length; i < length; i++) {

    }

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
            let pendingTask = Task.FromData(this.HiveMind.TaskMemory[this.HiveMind.PendingTasks[i]]);
            let spawn = Game.spawns['Spawn1'];
            if (spawn.spawnCreep(pendingTask.GetArgument(TaskArgs_Enum.Body), 'Worker', { dryRun: true }) == OK) {
                const name = spawn.name + '_' + Game.time;
                spawn.spawnCreep(pendingTask.GetArgument(TaskArgs_Enum.Body), name);
                this.HiveMind.RequestTask(new Delegate(CallbackType_Enum.Room, this.name, 'SpawnCallback'));
                break;

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