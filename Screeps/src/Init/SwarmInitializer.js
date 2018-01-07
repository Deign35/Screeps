require('Init_SwarmEnums');
require('Init_SwarmConsts');
require('Init_SwarmObjects');
require('Init_Globals');
require('Init_Prototypes');

let InitializeTick = function () {
    MemoryManager.LoadOverlord();
    for (let ManagerNameId in Managers_Enum) {
        global[Managers_Enum[ManagerNameId]].Load();
    }

    return OK;
};

let CompleteTick = function () {
    for (let ManagerNameId in Managers_Enum) {
        global[Managers_Enum[ManagerNameId]].Save();
    }
    MemoryManager.SaveOverlord();
}

module.exports.InitSwarmData = InitializeTick;
module.exports.SaveSwarmData = CompleteTick;