"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwarmCodes = require("Consts_SwarmCodes");
const SwarmMemory_1 = require("Tools_SwarmMemory");
const HarvestConsul_1 = require("Consuls_HarvestConsul");
const ConstructionConsul_1 = require("Consuls_ConstructionConsul");
const DistributionConsul_1 = require("Consuls_DistributionConsul");
const ASSIGNED_CREEPS = 'A_DATA';
const WHITE_LIST = {
    Healer: true,
    Healer2: true,
    Attacker: true,
}
class NestQueenBase extends SwarmMemory_1.QueenMemory {
    Save() {
        this.Collector.Save();
        this.Builder.Save();
        this.Distributor.Save();
        this.SetData(ASSIGNED_CREEPS, this.AssignedCreeps);
        super.Save();
    }
    Load() {
        if (!super.Load()) {
            return false;
        }
        this.Nest = Game.rooms[this.id];
        this.AssignedCreeps = this.GetData(ASSIGNED_CREEPS) || [];
        this.LoadNestCouncil();
        if (Game.time % 10 == 0) {
            let idleCreeps = this.FindIdleCreeps();
            this.AssignIdleCreeps(idleCreeps);
        }
        return true;
    }
    InitMemory() {
        super.InitMemory();
        this.Nest = Game.rooms[this.id];
        this.LoadNestCouncil();
        this.InitializeNest();
    }
    FindIdleCreeps() {
        let idleCreeps = [];
        for (let creepName in Game.creeps) {
            if(WHITE_LIST[creepName]) { continue; }
            let creepFound = false;
            for (let i = 0, length = this.CreepConsulList.length; i < length; i++) {
                for (let j = 0, length2 = this.CreepConsulList[i].CreepData.length; j < length2; j++) {
                    if (this.CreepConsulList[i].CreepData[j].creepName == creepName) {
                        creepFound = true;
                    }
                    if (creepFound) {
                        break;
                    }
                }
                if (creepFound) {
                    break;
                }
            }
            if (creepFound) {
                continue;
            }
            idleCreeps.push(Game.creeps[creepName]);
        }
        return idleCreeps;
    }
    LoadNestCouncil() {
        this.CreepConsulList = [];
        this.Distributor = new DistributionConsul_1.DistributionConsul(DistributionConsul_1.DistributionConsul.ConsulType, this);
        this.CreepConsulList.push(this.Distributor);
        this.Collector = new HarvestConsul_1.HarvestConsul(HarvestConsul_1.HarvestConsul.ConsulType, this);
        this.CreepConsulList.push(this.Collector);
        this.Builder = new ConstructionConsul_1.ConstructionConsul(ConstructionConsul_1.ConstructionConsul.ConsulType, this);
        this.CreepConsulList.push(this.Builder);
    }
    ValidateCouncil() {
        for (let i = 0, length = this.CreepConsulList.length; i < length; i++) {
            this.CreepConsulList[i].ValidateConsulState();
        }
    }
    ActivateCouncil() {
        this.ActivateRequiredConsuls();
        if (Game.cpu.bucket > 500 || Game.shard.name == 'sim') {
            this.ActivateSupportConsuls();
        }
        return SwarmCodes.C_NONE;
    }
    ActivateRequiredConsuls() {
        this.Collector.ActivateConsul();
        this.Distributor.ActivateConsul();
    }
    ActivateSupportConsuls() {
        this.Builder.ActivateConsul();
    }
}
exports.NestQueenBase = NestQueenBase;
//# sourceMappingURL=NestQueenBase.js.map
