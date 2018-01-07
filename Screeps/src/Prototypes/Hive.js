Room.prototype.InitMemory = function () {
    StartFunction('Room.InitHiveMemory');
    this.Brain = {};
    this.TaskMaster = new TaskMaster(this.name, {});

    // Create contracts for each source.
    const sources = this.find(FIND_SOURCES);

    for (let index in sources) {
        let contractArgs = {
            id: sources[index].id,
            PreferredBodyType: CreepBodyType_Enum.Worker, // Change this to harvester eventually.
            ToDoList: [
                CreepManager.CreateNewCommand(CreepCommand_Enum.Harvest, sources[index].id, ['target']),
                CreepManager.CreateNewCommand(CreepCommand_Enum.Transfer, null, ['target', 'energy']),
                CreepManager.CreateNewCommand(CreepCommand_Enum.Upgrade, null, ['target']),
            ],
        };
        this.CreateRoomContract(contractArgs);
    }

    const upgraderName = this.name + '_Upgrader';
    this.CreateRoomContract({
        id: upgraderName,
        PreferredBodyType: CreepBodyType_Enum.Worker,
        ToDoList: [
            CreepManager.CreateNewCommand(CreepCommand_Enum.Upgrade, this.controller.id, ['target']),
        ],
    });

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
