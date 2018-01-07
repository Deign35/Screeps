const MemoryId = 'SwarmManagerMemory';
const SwarmManager = {
    InitManagerMemory: function () {
        StartFunction('SwarmManager.InitManagerMemory');

        EndFunction();
        return OK;
    },
    Init: function () {
        StartFunction('SwarmManager.Init');
        this.ManagerData = MemoryManager.LoadData(MemoryId);

        EndFunction();
        return OK;
    },
    Complete: function () {
        StartFunction('SwarmManager.Complete');

        MemoryManager.SaveData(MemoryId, this.ManagerData);
        EndFunction();
        return OK;
    },
    ActivateSwarm: function () {
        StartFunction('SwarmManager.ActivateSwarm');

        EndFunction();
        return OK;
    }
};

module.exports = SwarmManager;