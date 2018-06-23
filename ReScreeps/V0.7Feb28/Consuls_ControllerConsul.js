"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConsulBase_1 = require("Consuls_ConsulBase");
const SwarmConsts = require("Consts_SwarmConsts");
const ControllerImperator_1 = require("Imperators_ControllerImperator");
const CONSUL_TYPE = 'Controller';
const UPGRADER_IDS = 'U_IDs';
const RCL_UPGRADER_RATIO = {
    1: { numUpgraders: 1, body: [WORK, CARRY, CARRY, MOVE] },
    2: { numUpgraders: 8, body: [WORK, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE] },
    3: { numUpgraders: 5, body: [WORK, WORK, WORK, MOVE, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, MOVE] },
    4: { numUpgraders: 5, body: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE] },
    5: { numUpgraders: 8, body: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE] },
    6: { numUpgraders: 2, body: [WORK, WORK, WORK, MOVE, WORK, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, WORK, MOVE] },
    7: { numUpgraders: 2, body: [WORK, WORK, WORK, MOVE, WORK, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, WORK, MOVE] },
    8: {
        numUpgraders: 1,
        body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
};
class ControllerConsul extends ConsulBase_1.CreepConsul {
    get Queen() { return this.Parent; }
    static get ConsulType() { return CONSUL_TYPE; }
    get consulType() { return CONSUL_TYPE; }
    Save() {
        this.SetData(UPGRADER_IDS, this.CreepData);
        super.Save();
    }
    Load() {
        if (!super.Load()) {
            return false;
        }
        this.Controller = this.Queen.Nest.controller;
        this.CreepData = this.GetData(UPGRADER_IDS) || [];
        this.Imperator = new ControllerImperator_1.ControllerImperator();
        return true;
    }
    ValidateConsulState() {
        if (!this.Controller.my && // I dont control it
            (!this.Controller.reservation ||
                this.Controller.reservation.username != SwarmConsts.MY_USERNAME)) {
            console.log('Lost control of this nest');
            // Need to update the NestQueen and on up.
        }
        for (let i = 0; i < this.CreepData.length; i++) {
            let creep = Game.creeps[this.CreepData[i].creepName];
            if (!creep) {
                this.CreepData.splice(i--, 1);
                continue;
            }
            if (this.CreepData[i].fetching) {
                if (creep.carry[RESOURCE_ENERGY] > 0) {
                    this.CreepData[i].fetching = false;
                }
            }
            else if (creep.carry[RESOURCE_ENERGY] == 0) {
                //this.Queen.Collector.AssignManagedCreep(creep, true);
                this.CreepData[i].fetching = true;
            }
        }
    }
    InitMemory() {
        super.InitMemory();
        if (!this.Queen.Nest.controller) {
            throw 'ATTEMPTING TO ADD CONTROLLERCONSUL TO A ROOM WITH NO CONTROLLER';
        }
        this.CreepData = [];
        this.SetData(UPGRADER_IDS, this.CreepData);
    }
    GetNextSpawn() {
        if (!this.CreepRequested) {
            if (this.CreepData.length < RCL_UPGRADER_RATIO[this.Controller.level].numUpgraders) {
                return true;
            }
        }
        return false;
    }
    GetSpawnDefinition() {
        let spawnArgs = {};
        spawnArgs.creepName = (Game.time + '_Upg').slice(-7);
        spawnArgs.requestorID = this.consulType;
        spawnArgs.body = RCL_UPGRADER_RATIO[this.Controller.level].body;
        spawnArgs.targetTime = Game.time;
        return spawnArgs;
    }
    _assignCreep(creepName) {
        this.CreepData.push({ creepName: creepName, fetching: false, controllerTarget: this.Queen.Nest.controller.id });
    }
    ReleaseCreep(creepName) {
        for (let i = 0, length = this.CreepData.length; i < length; i++) {
            if (this.CreepData[i].creepName == creepName) {
                if (this.CreepData[i].fetching) {
                    this.Queen.Collector.ReleaseManagedCreep(creepName);
                }
                this.CreepData.splice(i, 1);
                return;
            }
        }
    }
}
exports.ControllerConsul = ControllerConsul;
//# sourceMappingURL=ControllerConsul.js.map
