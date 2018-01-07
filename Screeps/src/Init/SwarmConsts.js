const Consts = {};
Consts.DEBUG_MODE = true;

const HCC = function HiveControllerConsts(rampHitMax, extensionCapacity, experienceToUpgrade, allowedStructures, controllerDowngradeValue) {
    this.RampartHitMax = rampHitMax;
    this.ExtensionCapacity = extensionCapacity;
    this.ExperienceToUpgrade = experienceToUpgrade;
    this.ControllerDowngradeValue = controllerDowngradeValue;
    this.AllowedStructures = allowedStructures;
}

Consts.HiveDefaults = [];
for (let i = 0; i < 9; i++) {
    let controllerStructures = {};
    for (let structureType in CONTROLLER_STRUCTURES) {
        controllerStructures[structureType] = (CONTROLLER_STRUCTURES[structureType][i] ? CONTROLLER_STRUCTURES[structureType][i] : 0);
    }
    const newHiveDefault = new HCC((RAMPART_HITS_MAX[i] ? RAMPART_HITS_MAX[i] : 0),
                                      EXTENSION_ENERGY_CAPACITY[i],
                                      (CONTROLLER_LEVELS[i] ? CONTROLLER_LEVELS[i] : 0),
                                      Object.freeze(controllerStructures),
                                      (CONTROLLER_DOWNGRADE[i] ? CONTROLLER_DOWNGRADE[i] : 0)
    );

    Consts.HiveDefaults.push(Object.freeze(newHiveDefault));
}

const CreepCommandResponseDefaults = {};
CreepCommandResponseDefaults[OK] = CreepCommandResponse_Enum.Continue; // 0
CreepCommandResponseDefaults[ERR_NOT_OWNER] = CreepCommandResponse_Enum.CancelCommands; // -1
CreepCommandResponseDefaults[ERR_NO_PATH] = CreepCommandResponse_Enum.Next; // -2
CreepCommandResponseDefaults[ERR_NAME_EXISTS] = CreepCommandResponse_Enum.Retry; // -3
CreepCommandResponseDefaults[ERR_BUSY] = CreepCommandResponse_Enum.Retry; // -4
CreepCommandResponseDefaults[ERR_NOT_FOUND] = CreepCommandResponse_Enum.Next; // -5
CreepCommandResponseDefaults[ERR_NOT_ENOUGH_RESOURCES] = CreepCommandResponse_Enum.RequireResources; // -6
CreepCommandResponseDefaults[ERR_INVALID_TARGET] = CreepCommandResponse_Enum.RequireTarget; // -7
CreepCommandResponseDefaults[ERR_FULL] = CreepCommandResponse_Enum.Next; // -8
CreepCommandResponseDefaults[ERR_NOT_IN_RANGE] = CreepCommandResponse_Enum.Move; // -9
CreepCommandResponseDefaults[ERR_INVALID_ARGS] = CreepCommandResponse_Enum.Next; // -10
CreepCommandResponseDefaults[ERR_TIRED] = CreepCommandResponse_Enum.Continue; // -11
CreepCommandResponseDefaults[ERR_NO_BODYPART] = CreepCommandResponse_Enum.Next; // -12
// no -13
CreepCommandResponseDefaults[ERR_RCL_NOT_ENOUGH] = CreepCommandResponse_Enum.CancelCommands; // -14
CreepCommandResponseDefaults[ERR_GCL_NOT_ENOUGH] = CreepCommandResponse_Enum.CancelCommands; // -15

Consts['CreepCommandResponseDefaults'] = CreepCommandResponseDefaults;

global['Consts'] = Consts;