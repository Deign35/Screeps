ConstructionSite.prototype.ConstructionSiteContractCallback = function (contract) {
    let result = ContractResults_Enum.Continue;

    if (!contract.Contractor || !Game.creeps[contract.Contractor]) {
        result = ContractResults_Enum.Respawn;
    }

    return result;
};

ConstructionSite.prototype.CreateBuildContract = function () {
    return {
        id: this.id,
        CallbackType: CallbackType_Enum.GameObject,
        Callback: 'ConstructionSiteContractCallback',
        PreferredBodyType: CreepBodyType_Enum.Worker,
        ToDoList: [
            CreepManager.CreateNewCommand(CreepCommand_Enum.Build, this.id, ['target']),
        ],
    };
}