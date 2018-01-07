const MemoryId = 'CreepManagerMemory';

// Managers -> Lords
// CreepLord
// HiveLord
// StructureLord
// Structure -> ?? 
// Creeps -> ??
const CreepManager = { // Is this class redundant with the HiveMind?
    InitManagerMemory: function () {
        StartFunction('CreepManager.InitManagerMemory');
        this.ManagerData = {};

        this.ManagerData['Creeps'] = {};
        console.log('CreepManager.Init[Creeps]: ' + Game.creeps.length || 0);
        for (const name in Game.creeps) {
            console.log('CreepManager.InitCreep[' + name + ']');
            this.ManagerData['Creeps'][name] = {};
        }

        MemoryManager.SaveData(MemoryId, this.ManagerData);
        EndFunction();
        return OK;
    },

    Load: function () {
        StartFunction('CreepManager.Load');
        this.ManagerData = MemoryManager.LoadData(MemoryId);

        for (const name in this.ManagerData['Creeps']) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                delete this.ManagerData['Creeps'][name];
                continue;
            }

            let creep = Game.creeps[name];
            creep.Brain = this.ManagerData['Creeps'][name];
        }

        EndFunction();
        return OK;
    },
    Save: function () {
        StartFunction('CreepManager.Complete');

        for (const name in this.ManagerData['Creeps']) {
            let creep = Game.creeps[name];
            this.ManagerData['Creeps'][name] = creep.Brain;
        }

        MemoryManager.SaveData(MemoryId, this.ManagerData);
        EndFunction();
        return OK;
    },

    ActivateCreeps: function () {
        StartFunction('CreepManager.ActivateCreeps');
        for (const name in this.ManagerData['Creeps']) {
            Game.creeps[name].Activate();
        }
        EndFunction();
        return OK;
    },
};

module.exports = CreepManager;