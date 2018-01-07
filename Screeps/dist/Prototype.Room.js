Room.prototype.InitMemory = function () {
    StartFunction('Room.InitHiveMemory');
    this.Brain = {};
    this.Brain.ContractData = {};
    this.Brain.UnfilledContracts = [];

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

// To be used by only those jobs that can't not exist, such as UpgradeController needing an upgrader
// sweeper, source harvester, repairer.
Room.prototype.PerpetualContractCallback = function (contract) {
    StartFunction('Room.PerpetualContractCallback');
    let result = ContractResults_Enum.Continue;

    if (!contract.Contractor || !Game.creeps[contract.Contractor]) {
        result = ContractResults_Enum.Respawn;
    }

    EndFunction();
    return result;
}

Room.prototype.Init = function () {
    StartFunction('Room.Init');
    const constructionSites = this.find(FIND_MY_CONSTRUCTION_SITES);
    for (let index in constructionSites) {
        if (!this.Brain.ContractData[constructionSites[index].id]) {
            this.CreateRoomContract(constructionSites[index].CreateBuildContract());
        }
    }
    this.maxSpawnEnergy = (this.find(FIND_MY_SPAWNS).length * 300) +
        (this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION } }).length * Consts.HiveDefaults[this.controller.level].ExtensionCapacity);
    EndFunction();
}

Room.prototype.EvaluateContract = function (contract) {
    StartFunction('Room.EvaluateContract(' + contract.id + ')');
    let result = ContractResults_Enum.Continue;
    if (contract.Contractor && !Game.creeps[contract.Contractor]) {
        delete contract.Contractor;
        this.CreateContract(contract);
    }

    if (contract.CallbackType == CallbackType_Enum.GameObject) {
        const callbackObject = Game.getObjectById(contract.id);
        if (callbackObject) {
            result = callbackObject[contract.Callback].apply(callbackObject, [contract]);
        } else {
            result = ContractResults_Enum.Respawn;
        }
    } else if (contract.CallbackType == CallbackType_Enum.Manager) {
        //[contract.Callback].ContractCallback(contract);
    } else if (contract.CallbackType == CallbackType_Enum.Room) {
        result = this[contract.Callback](contract);
    }

    EndFunction();
    return result;
};

Room.prototype.Activate = function () {
    StartFunction('Room.Activate');
    for (let index in this.Brain.ContractData) {
        if (_.indexOf(this.Brain.UnfilledContracts, index) != -1) {
            continue;
        }
        const result = this.EvaluateContract(this.Brain.ContractData[index]);
        if (result == ContractResults_Enum.Continue) {
            continue;
        }

        if (result == ContractResults_Enum.Respawn) {
            // Set aside for now.
            this.Brain.UnfilledContracts.push(this.Brain.ContractData[index].id);
        }

        if (result == ContractResults_Enum.Complete) {
            delete this.Brain.ContractData[index];
        }
    }
    EndFunction();
    return OK;
};

Room.prototype.Complete = function () {
    StartFunction('Room.Complete');
    const contracts = this.Brain.UnfilledContracts;
    this.Brain.UnfilledContracts = [];

    for (const index in contracts) {
        const contract = this.Brain.ContractData[contracts[index]];
        if (contract.Contractor) {
            CreepManager.GiveCreepAJob(contract.Contractor, contract);
        } else {
            let spawn;
            if (contract.AnchorPos) {
                spawn = contract.AnchorPos.findClosestByRange(FIND_MY_SPAWNS);
            } else {
                spawn = this.find(FIND_MY_SPAWNS)[0];
            }

            if (!spawn) {
                this.Brain.UnfilledContracts.push(contract.id);
                console.log("WTFWTFWTF");
                continue;
            }

            let bodyBuild = RoomFunctions.ConstructBodyForSpawning(contract.PreferredBodyType, this.maxSpawnEnergy);
            if (spawn.spawnCreep(bodyBuild, 'TestSpawn', { dryRun: true }) == OK) {
                const newCreepName = spawn.name + '_' + Game.time;
                spawn.spawnCreep(bodyBuild, newCreepName);
                CreepManager.GiveCreepAJob(newCreepName, contract);
                this.Brain.ContractData[contract.id] = contract;
            } else {
                this.Brain.UnfilledContracts.push(contract.id);
            }
        }
    }

    EndFunction();
    return OK;
};

Room.prototype.CreateContract = function (contract) {
    this.Brain.ContractData[contract.id] = contract;
    if (!contract.Contractor) {
        this.Brain.UnfilledContracts.push(contract.id);
    }
};

Room.prototype.CreateRoomContract = function (contract) {
    contract.CallbackType = CallbackType_Enum.Room;
    contract.Callback = 'PerpetualContractCallback';
    this.CreateContract(contract);
};

Room.prototype.RequestContractJob = function (creep) {
    //UGLY!!!!
    if (creep.Brain.ContractId) {
        CreepManager.GiveCreepAJob(creep.name, this.Brain.ContractData[creep.Brain.ContractId]);
    } else if (this.Brain.UnfilledContracts.length > 0) {
        // Already have a job for this creep.
        const contract = this.Brain.ContractData[this.Brain.UnfilledContracts.shift()];
        CreepManager.GiveCreepAJob(creep.name, contract);
    } else {

        let contractArgs = {
            id: this.name + 'General_' + Game.time,
            PreferredBodyType: CreepBodyType_Enum.AllPurpose,
            DoOne: true, // BAD NAME
            ToDoList: [
                CreepManager.CreateNewCommand(CreepCommand_Enum.Transfer, null, ['target', 'energy']),
                CreepManager.CreateNewCommand(CreepCommand_Enum.Build, null, ['target']),
                CreepManager.CreateNewCommand(CreepCommand_Enum.Upgrade, null, ['target']),
            ],
        }
        this.CreateRoomContract(contractArgs);
        CreepManager.GiveCreepAJob(creep.name, contractArgs);
    }
};