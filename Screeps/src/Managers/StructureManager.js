const MemoryId = 'StructureManagerMemory';
const StructureManager = {
    InitManagerMemory: function () {
        StartFunction('StructureManager.InitManagerMemory');
        this.ManagerData = {};

        this.ManagerData['Structures'] = {};
        const allStructures = Game.structures;
        for (const index in allStructures) {
            const structure = allStructures[index];
            structure.Brain = {};
            //structure.InitMemory();
            this.ManagerData['Structures'][structure.id] = structure.Brain;
        }

        MemoryManager.SaveData(MemoryId, this.ManagerData);
        EndFunction();
        return OK;
    },
    Load: function () {
        StartFunction('StructureManager.Init');
        this.ManagerData = MemoryManager.LoadData(MemoryId);

        this.structures = {};
        for (const id in this.ManagerData['Structures']) {
            if (!Game.structures[id]) {
                delete this.ManagerData['Structures'][id];
                // Alert building destroyed!
            }

            this.structures[id] = Game.structures[id];
            this.structures[id].Brain = this.ManagerData['Structures'][id];
        }

        EndFunction();
        return OK;
    },
    Save: function () {
        StartFunction('StructureManager.Complete');

        MemoryManager.SaveData(MemoryId, this.ManagerData);
        EndFunction();
        return OK;
    },
    ActivateStructures: function() {
        StartFunction('StructureManager.Activate');

        for (const index in this.structures) {
            if (this.structures[index].Activate) {
                this.structures[index].Activate();
            }
        }

        EndFunction();
        return OK;
    },
};

module.exports = StructureManager;