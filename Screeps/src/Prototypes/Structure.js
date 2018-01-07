Structure.prototype.Activate = function () { };

Structure.prototype.InitMemory = function () { };

Structure.prototype.ContractSigned = function (creep) { };

Structure.prototype.ConstructionSiteContractCallback = function (contract) {
    return ContractResults_Enum.Complete;
}

const prototypeFolderName = 'Prototypes_Structure_';
require(prototypeFolderName + 'StructureSpawn');
require(prototypeFolderName + 'StructureController');
require(prototypeFolderName + 'ConstructionSite');