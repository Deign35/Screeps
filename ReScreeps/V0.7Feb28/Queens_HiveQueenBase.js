"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NestQueenBase_1 = require("Queens_NestQueenBase");
const SpawnConsul_1 = require("Consuls_SpawnConsul");
const HarvestConsul_1 = require("Consuls_HarvestConsul");
const ControllerConsul_1 = require("Consuls_ControllerConsul");
const ConstructionConsul_1 = require("Consuls_ConstructionConsul");
const DistributionConsul_1 = require("Consuls_DistributionConsul");
class HiveQueenBase extends NestQueenBase_1.NestQueenBase {
    Save() {
        this.Upgrader.Save();
        this.Spawner.Save();
        super.Save();
    }
    AssignIdleCreeps(idleCreeps) {
        for (let i = 0, length = idleCreeps.length; i < length; i++) {
            if (idleCreeps[i].getActiveBodyparts(WORK) == 0) {
                this.Distributor.AssignCreep(idleCreeps[i]);
                continue;
            }
            if (idleCreeps[i].getActiveBodyparts(WORK) > 1) {
                this.Collector.AssignCreep(idleCreeps[i]);
                continue;
            }
            if (this.Nest.find(FIND_MY_CONSTRUCTION_SITES)) {
                this.Builder.AssignCreep(idleCreeps[i]);
                continue;
            }
            this.Upgrader.AssignCreep(idleCreeps[i]);
        }
    }
    ActivateNest() {
        this.ValidateCouncil();
        this.ActivateCouncil();
        this.CheckForSpawnRequirements();
        let requirements = this.Spawner.GetNextSpawns(1);
        if (requirements.length > 0) {
            if (this.Nest.energyAvailable >= requirements[0].energyNeeded && requirements[0].neededBy) {
                let spawnedCreep = this.Spawner.SpawnCreep();
                if (spawnedCreep) {
                    if (spawnedCreep.requestorID == HarvestConsul_1.HarvestConsul.ConsulType) {
                        this.Collector.AssignSpawn(spawnedCreep.creepName);
                    }
                    else if (spawnedCreep.requestorID == ControllerConsul_1.ControllerConsul.ConsulType) {
                        this.Upgrader.AssignSpawn(spawnedCreep.creepName);
                    }
                    else if (spawnedCreep.requestorID == ConstructionConsul_1.ConstructionConsul.ConsulType) {
                        this.Builder.AssignSpawn(spawnedCreep.creepName);
                    }
                    else if (spawnedCreep.requestorID == DistributionConsul_1.DistributionConsul.ConsulType) {
                        this.Distributor.AssignSpawn(spawnedCreep.creepName);
                    }
                }
            }
        }
    }
    LoadNestCouncil() {
        this.CreepConsulList = [];
        this.Distributor = new DistributionConsul_1.DistributionConsul(DistributionConsul_1.DistributionConsul.ConsulType, this);
        this.CreepConsulList.push(this.Distributor);
        this.Collector = new HarvestConsul_1.HarvestConsul(HarvestConsul_1.HarvestConsul.ConsulType, this);
        this.CreepConsulList.push(this.Collector);
        this.Upgrader = new ControllerConsul_1.ControllerConsul(ControllerConsul_1.ControllerConsul.ConsulType, this);
        this.CreepConsulList.push(this.Upgrader);
        this.Builder = new ConstructionConsul_1.ConstructionConsul(ConstructionConsul_1.ConstructionConsul.ConsulType, this);
        this.CreepConsulList.push(this.Builder);
        this.Spawner = new SpawnConsul_1.SpawnConsul(SpawnConsul_1.SpawnConsul.ConsulType, this);
    }
    ValidateCouncil() {
        this.Spawner.ValidateConsulState();
        super.ValidateCouncil();
    }
    ActivateSupportConsuls() {
        this.Upgrader.ActivateConsul();
        super.ActivateSupportConsuls();
    }
}
exports.HiveQueenBase = HiveQueenBase;
//# sourceMappingURL=HiveQueenBase.js.map
