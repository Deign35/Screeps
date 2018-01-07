Room.prototype.InitMemory = function () {
    StartFunction('Room.InitMemory');
    this.Brain = {};
    this.Brain.PrevConstructionSites = [];
    this.HiveMind = new HiveMind(this.name, {});

    // Create contracts for each source.
    const sources = this.find(FIND_SOURCES);

    for (let i = 0, length = sources.length; i < length; i++) {
        // if i have enough energy and a storage/container to drop on to.
        this.HiveMind.PostNewTask(HiveMind.CreateTaskFromProfile(TaskProfile_Enum.PrimeHarvester, [id, sources[i].pos]));
    }

    const upgraderTask = HiveMind.CreateTaskFromProfile(TaskProfile_Enum.Upgrader);
    // do things like make the body
    this.HiveMind.PostNewTask(upgraderTask);

    const sweeperTask = HiveMind.CreateTaskFromProfile(TaskProfile_Enum.Sweeper, [this.controller.pos]);
    // do things like make the body
    this.HiveMind.PostNewTask(sweeperTask);

    //Temporary GenPop
    for (let i = 0; i < 5; i++) {
        this.HiveMind.PostNewTask(HiveMind.CreateTaskFromProfile(TaskProfile_Enum.Default, [('GenPop_' + i)]));
    }

    console.log('pingping');
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
    this.Brain.TaskMemory = this.HiveMind.TaskMemory;
    EndFunction();
    return OK;
};
