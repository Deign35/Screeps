Room.prototype.InitMemory = function () {
    StartFunction('Room.InitMemory');
    this.Brain = {};
    this.Brain.PrevConstructionSites = [];
    this.HiveMind = new HiveMind(this.name, {});

    // Create contracts for each source.
    const sources = this.find(FIND_SOURCES);

    for (let i = 0, length = sources.length; i < length; i++) {
        // if i have enough energy and a storage/container to drop on to.
        this.HiveMind.PostNewTask(HiveMind.CreateTaskFromProfile(TaskProfile_Enum.PrimeHarvester, [sources[i].id, sources[i].pos]));
    }

    const upgraderTask = HiveMind.CreateTaskFromProfile(TaskProfile_Enum.Upgrader);
    upgraderTask.SetArgument(TaskArgs_Enum.Body, CreateBody([...[1, WORK], [2, MOVE], [2, CARRY]]));
    // do things like make the body
    this.HiveMind.PostNewTask(upgraderTask);

    const sweeperTask = HiveMind.CreateTaskFromProfile(TaskProfile_Enum.Sweeper, [this.controller.pos]);
    sweeperTask.SetArgument(TaskArgs_Enum.Body, CreateBody([...[1, WORK], [2, MOVE], [2, CARRY]]));
    // do things like make the body
    this.HiveMind.PostNewTask(sweeperTask);

    //Temporary GenPop
    for (let i = 0; i < 5; i++) {
        this.HiveMind.PostNewTask(HiveMind.CreateTaskFromProfile(TaskProfile_Enum.Default, [('GenPop_' + i)]));
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
        const builderTask = HiveMind.CreateTaskFromProfile(TaskProfile_Enum.Default, ['CS_' + newSites[i]]);
        // stuff
        this.HiveMind.PostNewTask(builderTask);
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
            let pendingTask = this.HiveMind.PendingTasks[i];
            if (Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], 'Worker', { dryRun: true }) == OK) {
                const name = 'Spawn1_' + Game.time;
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], name);
                this.HiveMind.RequestTask(new Delegate(CallbackType_Enum.Room, this.name, 'SpawnCallback'));
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
    //task.CacheData = {};
    console.log('callback');
    task.Cache[TaskMemory_Enum.SlaveCallback] = 'Spawn1_' + Game.time;
}