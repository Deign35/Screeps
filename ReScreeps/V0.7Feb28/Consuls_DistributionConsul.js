"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConsulBase_1 = require("Consuls_ConsulBase");
const DistributionImperator_1 = require("Imperators_DistributionImperator");
const CONSUL_TYPE = 'Distribution';
const REFILLER_DATA = 'R_DATA';
const DISTRIBUTION_REQUESTS = 'D_REQ';
class DistributionConsul extends ConsulBase_1.CreepConsul {
    static get ConsulType() { return CONSUL_TYPE; }
    get consulType() { return CONSUL_TYPE; }
    Save() {
        this.SetData(DISTRIBUTION_REQUESTS, this.DeliveryRequests);
        this.SetData(REFILLER_DATA, this.CreepData);
        super.Save();
    }
    Load() {
        if (!super.Load()) {
            return false;
        }
        this.DeliveryRequests = this.GetData(DISTRIBUTION_REQUESTS);
        this.CreepData = this.GetData(REFILLER_DATA);
        this.Imperator = new DistributionImperator_1.DistributionImperator();
        return true;
    }
    ValidateConsulState() {
        if (this.DeliveryRequests.length == 0 || Game.time % 31 == 0) {
            this.ScanRoom();
        }
        for (let i = 0; i < this.CreepData.length; i++) {
            let creep = Game.creeps[this.CreepData[i].creepName];
            if (!creep) {
                this.CreepData.splice(i--, 1);
                continue;
            }
            if (this.CreepData[i].fetching) {
                if (creep.carry[RESOURCE_ENERGY] > 0) {
                    this.Queen.Collector.ReleaseManagedCreep(creep.name);
                    this.CreepData[i].fetching = false;
                }
            }
            else if (creep.carry[RESOURCE_ENERGY] == 0) {
                this.Queen.Collector.AssignManagedCreep(creep, false);
                this.CreepData[i].fetching = true;
            }
            // THIS IS FUGLY
            if(this.CreepData[i].creepName == 'SPAWNER' ||
            (i == 0 && !this.CreepData[i].creepName != 'SPAWNER')) {
                Game.rooms['E26N21'].visual.text('XXX', creep.pos);
                let target = Game.getObjectById(this.CreepData[i].target);
                if(!target) {
                    let structures = this.Queen.Nest.find(FIND_STRUCTURES, {
                        filter: function (struct) {
                            return (struct.structureType == STRUCTURE_EXTENSION ||
                                struct.structureType == STRUCTURE_SPAWN ||
                                struct.structureType == STRUCTURE_TOWER) &&
                                struct.energy < struct.energyCapacity;
                        }
                    });
                    structures.sort((a, b) => {
                        let aDist = a.pos.getRangeTo(creep);
                        let bDist = b.pos.getRangeTo(creep);
                        return aDist < bDist ? -1 : 1;
                    });
                    if(structures.length > 0) {
                        this.CreepData[i].target = structures[0].id;
                    }
                }
            } else {
                let target = Game.getObjectById(this.CreepData[i].target);
                if (!target) {
                    target = this.GetSpawnRefillerTarget(this.CreepData[i], i < 1);
                }
                if (target) {
                    this.CreepData[i].target = target.id;
                }
            }
        }
    }
    InitMemory() {
        super.InitMemory();
        this.CreepData = [];
        this.DeliveryRequests = [];
    }
    ReleaseCreep(creepName) {
        for (let i = 0, length = this.CreepData.length; i < length; i++) {
            if (this.CreepData[i].creepName == creepName) {
                if (this.CreepData[i].fetching) {
                    this.Queen.Collector.ReleaseManagedCreep(creepName);
                }
                this.CreepData.splice(i, 1);
                break;
            }
        }
    }
    GetSpawnDefinition() {
        let def = {
            body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
            creepName: (Game.time + '_DIST').slice(-8),
            requestorID: this.consulType,
            targetTime: Game.time,
        };
        if(!Game.creeps['SPAWNER']) {
            def.creepName = 'SPAWNER';
        }
        return def;
    }
    GetNextSpawn() {
        if (!this.CreepRequested && this.CreepData.length < 7) {
            return true;
        }
        return false;
    }
    _assignCreep(creepName) {
        this.CreepData.push({ creepName: creepName, refillList: [], fetching: false, target: '' });
    }
    SetDelivererTargets(creepData) {
        let creep = Game.creeps[creepData.creepName];
        let cap = creep.carryCapacity;
        let newList = [];
        let cummulativeTotal = 0;
        if (this.DeliveryRequests.length > 0) {
            let request = this.DeliveryRequests[0];
            newList.push(request);
            this.DeliveryRequests.splice(0, 1);
        }
        creepData.refillList = newList;
    }
    GetSpawnRefillerTarget(creepData, isFirst) {
        if(creepData.refillList.length == 0) {
            this.SetDelivererTargets(creepData);
            if(creepData.refillList.length == 0) {
            this.ScanRoom();
            this.SetDelivererTargets(creepData)
                if(creepData.refillList.length == 0) {
                    console.log('quite impossible');
                    return Game.rooms['E26N21'].storage;
            }
            }
        }
        // Set the target, have the target remain as is..
        while (creepData.refillList.length > 0) {
            let targetID = creepData.refillList[0].id;
            let target = Game.getObjectById(targetID);
            if(!target) {
                creepData.refillList.splice(0,1); 
                this.SetDelivererTargets(creepData);
                continue;
            }
            if ((target.energyCapacity && target.energy * 2 < target.energyCapacity) ||
                (target.carryCapacity && target.carry.energy * 2 < target.carryCapacity) ||
                (target.storeCapacity && target.store.energy * 4 < target.storeCapacity)) {
                return target;
            }
            else {
                this.SetDelivererTargets(creepData);
            }
        }
        console.log('shouldnt be here wtf')
        return Game.rooms['E26N21'].storage;
    }
    ScheduleResourceDelivery(target, amount, time = Game.time, resourceType) {
        let request = { id: target.id, amount: amount, time: time };
        if (resourceType) {
            request.resourceType = resourceType;
        }
        this.DeliveryRequests.push(request);
    }
    ScanRoom() {
        this.DeliveryRequests = [];
        try {
        let upgraders = this.Queen.Upgrader.CreepData;
        for(let i = 0, length = upgraders.length; i < length; i++) {
            let upgrader = Game.creeps[upgraders[i].creepName];
            if(upgrader && upgrader.ticksToLive > 150) {
                this.ScheduleResourceDelivery(upgrader, upgrader.carryCapacity);
            }
        }
        let constructors = this.Queen.Builder.CreepData;
        for(let i = 0, length = constructors.length; i < length; i++) {
            let builder = Game.creeps[constructors[i].creepName];
            if(builder) {
                this.ScheduleResourceDelivery(builder, builder.carryCapacity);
            }
        }
        } catch (e) {
            console.log('oops! - ' + JSON.stringify(e));
        }
    }
}
exports.DistributionConsul = DistributionConsul;
//# sourceMappingURL=DistributionConsul.js.map
