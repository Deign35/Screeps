const MemoryId = 'BlankManagerMemory';
const BlankManager = {
    Init: function () {
        StartFunction('BlankManager.Init');
        this.ManagerData = MemoryManager.LoadData(MemoryId);

        EndFunction();
        return OK;
    },
    InitManagerMemory: function () {
        StartFunction('BlankManager.InitManagerMemory');

        EndFunction();
        return OK;
    },
    Complete: function () {
        StartFunction('BlankManager.Complete');

        MemoryManager.SaveData(MemoryId, this.ManagerData);
        EndFunction();
        return OK;
    },
};

module.exports = BlankManager;