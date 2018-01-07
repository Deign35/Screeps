const MemoryManager = {
    InitManagerMemory: function () {
        StartFunction('InitManagerMemory');
        console.log('BEGIN: Reset Brain Memory');
        let initResult = OK;

        Memory.DataDump = [];
        Memory.Bank = {};
        Memory.creeps = {};
        for (const ManagerNameId in Managers_Enum) {
            if (initResult == OK && ManagerNameId != Managers_Enum.MemoryManager) {
                initResult = global[Managers_Enum[ManagerNameId]].InitManagerMemory();
            }
        }

        if (initResult == OK) {
            Memory.INIT = true;
            if (Memory.RESET) {
                delete Memory.RESET;
            }
            Memory.InitOverRun = 0;
        }

        console.log('END: Reset Brain Memory[' + initResult + ']');
        EndFunction();
        return initResult;
    },

    LoadOverlord: function () {
        StartFunction('MemoryManager.Init()');
        let initResult = OK;
        if (!Memory.INIT || Memory.RESET) {
            Memory.INIT = false;
            initResult = this.InitManagerMemory();
            if (!Memory.INIT) {
                console.log('Unable to initialize memory[' + initResult.toString() + ']');
            }
        }

        EndFunction();
        return initResult;
    },
    SaveOverlord: function () {
        StartFunction('MemoryManager.Complete()');

        EndFunction();
        return OK;
    },

    SaveData: function (requesterId, saveData) {
        Memory.Bank[requesterId] = saveData;
        return OK;
    },
    LoadData: function (requesterId) {
        return Memory.Bank[requesterId] || { };
    },/*
    DeleteData: function(requesterId) {
        delete Memory.Bank[requesterId];
    },
    CopyData: function(fromId, toId) {
        this.SaveData(toId, this.LoadData(fromId));
    },
    TransferData: function(fromId, toId) {
        this.CopyData(fromId, toId);
        this.DeleteData(fromId);
    }*/
};

module.exports = MemoryManager;