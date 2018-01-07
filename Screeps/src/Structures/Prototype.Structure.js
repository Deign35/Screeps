Structure.prototype.Activate = function () { };

Structure.prototype.InitMemory = function () { };

Structure.prototype.ContractSigned = function (creep) { };

Structure.prototype.ConstructionSiteContractCallback = function (contract) {
    return ContractResults_Enum.Complete;
}

require('Prototype.StructureSpawn');
require('Prototype.StructureController');