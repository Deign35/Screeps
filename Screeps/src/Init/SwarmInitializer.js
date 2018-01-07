require('Init_SwarmEnums');
require('Init_SwarmConsts');
require('Init_SwarmObjects');
require('Init_Globals');
require('Init_Prototypes');

let InitializeTick = function () {
    Overmind.EnsureInit();
    for (let ManagerNameId in Managers_Enum) {
        global[Managers_Enum[ManagerNameId]].Load();
    }

    return OK;
};

let CompleteTick = function () {
    for (let ManagerNameId in Managers_Enum) {
        global[Managers_Enum[ManagerNameId]].Save();
    }
    Overmind.Complete();
}

module.exports.InitSwarmData = InitializeTick;
module.exports.SaveSwarmData = CompleteTick;