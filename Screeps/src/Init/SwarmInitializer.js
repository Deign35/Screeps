require('Init_SwarmEnums');
require('Init_SwarmConsts');
require('Init_SwarmObjects');
require('Init_Globals');
require('Init_Prototypes');

let SwarmInit = function () {
    for (let ManagerNameId in Managers_Enum) {
        global[Managers_Enum[ManagerNameId]].Init();
    }

    return OK;
};

let SwarmComplete = function () {
    for (let ManagerNameId in Managers_Enum) {
        global[Managers_Enum[ManagerNameId]].Complete();
    }
}

module.exports.Init = SwarmInit;
module.exports.Complete = SwarmComplete;