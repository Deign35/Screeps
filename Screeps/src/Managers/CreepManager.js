const MemoryId = 'CreepManagerMemory';
const ContractDelegate = new Delegate(CallbackType_Enum.Manager, 'CreepManager', 'ContractCallback');

const CreepManager = {
    InitManagerMemory: function () {
        StartFunction('CreepManager.InitManagerMemory');
        this.ManagerData = {};

        this.ManagerData['Creeps'] = {};
        for (let name in Game.creeps) {
            this.ManagerData['Creeps'][name] = {};
        }

        MemoryManager.SaveData(MemoryId, this.ManagerData);
        EndFunction();
        return OK;
    },

    Load: function () {
        StartFunction('CreepManager.Init');
        this.ManagerData = MemoryManager.LoadData(MemoryId);
        this.creepsToRetry = {};
        this.creeps = {}

        for (const name in this.ManagerData['Creeps']) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                delete this.ManagerData['Creeps'][name];
                continue;
            }

            this.creeps[name] = Game.creeps[name];
            this.creeps[name].Brain = this.ManagerData['Creeps'][name];
        }

        EndFunction();
        return OK;
    },
    Save: function () {
        StartFunction('CreepManager.Complete');
        MemoryManager.SaveData(MemoryId, this.ManagerData);
        EndFunction();
        return OK;
    },

    ActivateCreeps: function () {
        StartFunction('CreepManager.ActivateCreeps');
        for (let name in Game.creeps) {
            Game.creeps[name].Activate();
        }
        EndFunction();
        return OK;
    },

    ActivateReruns: function () {
        StartFunction('CreepManager.ActivateReruns');
        for (let id in this.creepsToRetry) {
            if (this.creepsToRetry[id]) {
                this.creepsToRetry[id].Activate();
            }
        }
        EndFunction();
        return OK;
    },

    ContractCallback: function (contract) {
        StartFunction('CreepManager.ContractCallback');
        //Here we assign a creep this contract.
        EndFunction();
        return OK;
    },
};

module.exports = CreepManager;