Room.prototype.InitMemory = function () {
    StartFunction('Room.InitMemory');
    this.Brain = {};
    this.TaskMaster = new TaskMaster(this.name, {});

    // Create contracts for each source.
    const sources = this.find(FIND_SOURCES);

    for (let i = 0, length = sources.length; i < length; i++) {
        // if i have enough energy and a storage/container to drop on to.
        this.TaskMaster.PostNewTask(TaskMaster.CreateTaskFromProfile(TaskProfile_Enum.PrimeHarvester, [id, sources[i].pos]));
    }

    const upgraderTask = TaskMaster.CreateTaskFromProfile(TaskProfile_Enum.Upgrader);
    // do things like make the body
    this.TaskMaster.PostNewTask(upgraderTask);

    const sweeperTask = TaskMaster.CreateTaskFromProfile(TaskProfile_Enum.Sweeper);
    // do things like make the body
    this.TaskMaster.PostNewTask(sweeperTask);

    EndFunction();
    return OK;
};

Room.prototype.Init = function () {
    StartFunction('Room.Init');
    const constructionSites = this.find(FIND_MY_CONSTRUCTION_SITES);
    for (let index in constructionSites) {
    }
    this.maxSpawnEnergy = (this.find(FIND_MY_SPAWNS).length * 300) +
        (this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION } }).length * Consts.HiveDefaults[this.controller.level].ExtensionCapacity);
    EndFunction();
}

Room.prototype.Activate = function () {
    StartFunction('Room.Activate');

    EndFunction();
    return OK;
};

Room.prototype.Complete = function () {
    StartFunction('Room.Complete');

    EndFunction();
    return OK;
};
