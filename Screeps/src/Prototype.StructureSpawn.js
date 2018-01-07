/*if (!StructureSpawn.prototype._spawnCreep) {
    StructureSpawn.prototype._spawnCreep = StructureSpawn.prototype.spawnCreep;
    StructureSpawn.prototype.spawnCreep = function (body, name, args) {
        let spawnResult = this._spawnCreep(body, name, args);

        if ((!args || args['dryRun']) && spawnResult == OK) {
            // Get the todolist somehow else.  Probably just passed in with spawn.
            let ToDoList = [];
            //ToDoList.push(CreepManager.CreateNewCommand(CreepCommand_Enum.Harvest, null, ['target'], {}));
            //ToDoList.push(CreepManager.CreateNewCommand(CreepCommand_Enum.Upgrade, null, ['target'], {}));
            ToDoList.push(CreepManager.CreateNewCommand(CreepCommand_Enum.Harvest, null, ['target'], {}));
            ToDoList.push(CreepManager.CreateNewCommand(CreepCommand_Enum.Transfer, null, ['target', 'energy'], {}));
            ToDoList.push(CreepManager.CreateNewCommand(CreepCommand_Enum.Build, null, ['target']));
            ToDoList.push(CreepManager.CreateNewCommand(CreepCommand_Enum.Upgrade, null, ['target'], {}));

            const jobMemory = {
                Looping: true,
                ToDoList: ToDoList,
            }
            CreepManager.GiveCreepAJob(name, jobMemory);
        }

        return spawnResult;
    };
}
*/