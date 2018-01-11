const Overmind = {
    InitOvermind: function () {
        StartFunction('InitOvermind');
        const startInit = Game.cpu.getUsed();
        console.log('Reset Overmind Begin');
        let initResult = OK;

        Memory.DataDump = [];
        Memory.Overmind = {};
        //Memory.creeps = {};
        for (const ManagerNameId in Managers_Enum) {
            if (initResult == OK) {
                initResult = global[Managers_Enum[ManagerNameId]].InitManagerMemory();
            }
        }

        if (initResult == OK) {
            if (Memory.RESET) {
                delete Memory.RESET;
            }
            Memory.InitOverRun = 0;
        } else {
            Memory.RESET = true;
            delete Memory.Overmind;
        }

        console.log('Reset Overmind Completed[' + initResult + '] in ' + (Game.cpu.getUsed() - startInit) + ' ticks.');
        EndFunction();
        return initResult;
    },

    EnsureInit: function () {
        StartFunction('Overmind.EnsureInit()');
        let initResult = OK;
        if (!Memory.Overmind || Memory.RESET) {
            initResult = this.InitOvermind();
        }

        EndFunction();
        return initResult;
    },
    Complete: function () {
        StartFunction('Overmind.Complete()');

        EndFunction();
        return OK;
    },

    SaveData: function (requesterId, saveData) {
        Memory.Overmind[requesterId] = saveData;
        return OK;
    },
    LoadData: function (requesterId) {
        return Memory.Overmind[requesterId] || { };
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

module.exports = Overmind;