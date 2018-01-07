const MemoryManager = {
    InitManagerMemory: function () {
        StartFunction('InitManagerMemory');
        console.log('BEGIN: Reset Brain Memory');
        let ResetResult = OK;

        //Temp fix for now:
        Memory.DebugData = {};
        Memory.Bank = {};
        Memory.creeps = {};
        for (let i = 0, length = Managers_Enum.length; i < length; i++) {
            if (ResetResult == OK && ManagerNameId != Managers_Enum.MemoryManager) {
                ResetResult = global[Managers_Enum[ManagerNameId]].InitManagerMemory();
            }
        }

        if (ResetResult == OK) {
            Memory.INIT = true;
            if (Memory.RESET) {
                delete Memory.RESET;
            }
            Memory.InitOverRun = 0;
        }

        console.log('END: Reset Brain Memory[' + ResetResult + ']');
        EndFunction();
        return ResetResult;
    },

    Init: function () {
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
    Complete: function () {
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