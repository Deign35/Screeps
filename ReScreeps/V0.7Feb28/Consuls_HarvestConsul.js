"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwarmCodes = require("Consts_SwarmCodes");
const HarvestImperator_1 = require("Imperators_HarvestImperator");
const BootstrapImperator_1 = require("Imperators_BootstrapImperator");
const ConsulBase_1 = require("Consuls_ConsulBase");
const CONSUL_TYPE = 'Collector';
const SOURCE_DATA = 'S_Data';
const TRACKER_PREFIX = 'Track_';
const TEMP_DATA = 'T_DATA';
class HarvestConsul extends ConsulBase_1.CreepConsul {
    static get ConsulType() { return CONSUL_TYPE; }
    get consulType() { return CONSUL_TYPE; }
    Save() {
        this.SetData(TEMP_DATA, this._tempData);
        this.SetData(SOURCE_DATA, this.CreepData);
        super.Save();
    }
    Load() {
        if (!super.Load()) {
            return false;
        }
        this.CreepData = this.GetData(SOURCE_DATA);
        this._tempData = this.GetData(TEMP_DATA);
        this.TempWorkers = [];
        for (let id in this._tempData) {
            let tempCreep = Game.creeps[id];
            if (!tempCreep) {
                console.log('Temp Creep deleted cause it was dead[' + id + ']: ' + JSON.stringify(this._tempData));
                delete this._tempData[id];
                continue;
            }
            this.TempWorkers.push(tempCreep);
        }
        this.Imperator = new HarvestImperator_1.HarvestImperator();
        return true;
    }
    ValidateConsulState() {
        this.ScanRoom();
    }
    InitMemory() {
        super.InitMemory();
        this.CreepData = [];
        this._tempData = {};
        let foundSources = this.Parent.Nest.find(FIND_SOURCES);
        for (let i = 0, length = foundSources.length; i < length; i++) {
            this.CreepData.push(this.InitSourceData(foundSources[i]));
        }
        this.ScanRoom();
    }
    ScanRoom() {
        for (let i = 0, length = this.CreepData.length; i < length; i++) {
            let data = this.CreepData[i];
            let sourceTarget = Game.getObjectById(data.id);
            if (data.creepName && !Game.creeps[data.creepName]) {
                data.creepName = '';
            }
            if (data.constructionSite && !Game.getObjectById(data.constructionSite)) {
                data.constructionSite = undefined;
            }
            if (data.containerID) {
                if (!Game.getObjectById(data.containerID)) {
                    data.containerID = undefined;
                }
            }
            this.CreepData[i] = data;
        }
    }
    GetNextSpawn() {
        // Calculates the distance to new sources
        // Orders creation of new screep so that they will arrive at the harvest node
        // just a few ticks before the previous one dies.
        if (!this.CreepRequested) {
            for (let i = 0, length = this.CreepData.length; i < length; i++) {
                if (!this.CreepData[i].creepName) {
                    return true;
                }
            }
        }
        return false;
    }
    AssignManagedCreep(creep, acceptsDelivery = false) {
        if (!this._tempData[creep.name]) {
            this._tempData[creep.name] = ''; //target id
            if(acceptsDelivery) {
                this.Queen.Distributor.ScheduleResourceDelivery(creep, creep.carryCapacity);
            }
        }
    }
    ReleaseManagedCreep(creepName) {
        if (this._tempData[creepName]) {
            delete this._tempData[creepName];
            for (let i = 0, length = this.TempWorkers.length; i < length; i++) {
                if (this.TempWorkers[i].name == creepName) {
                    this.TempWorkers.splice(i, 1);
                    return;
                }
            }
        }
        console.log("Release Managed Creep with name[" + creepName + "]: was not assigned to harvest consul");
    }
    _assignCreep(creepName) {
        if (this.CreepData.length == 0) {
            return;
        }
        for (let i = 0, length = this.CreepData.length; i < length; i++) {
            if (!this.CreepData[i].creepName || !Game.creeps[this.CreepData[i].creepName]) {
                this.CreepData[i].creepName = creepName;
                return;
            }
        }
        // If we're here, then this creep has no place, return it to the nest.
        console.log("Assign regular Creep with name[" + creepName + "]: had no where to focus harvesting.");
        this.ReleaseCreep(creepName);
        this.Parent.Upgrader.AssignSpawn(creepName); // this is really shitty.
    }
    ReleaseCreep(creepName) {
        for (let i = 0, length = this.CreepData.length; i < length; i++) {
            if (this.CreepData[i].creepName && this.CreepData[i].creepName == creepName) {
                this.CreepData[i].creepName = '';
                break;
            }
        }
    }
    GetSpawnDefinition() {
        let spawnBody = [WORK, WORK, CARRY, MOVE];
        let availableCap = this.Queen.Nest.energyCapacityAvailable;
        // if the target source has a container, then different body without carry.
        switch (true) {
            case (availableCap < 550):
                spawnBody = [WORK, WORK, CARRY, MOVE];
                break;
            case (availableCap < 800):
                spawnBody = [WORK, WORK, WORK, WORK, WORK, MOVE];
                break;
            default:
                spawnBody = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];
                break;
        }
        return {
            creepName: 'Harv' + ('' + Game.time).slice(-3),
            body: spawnBody,
            targetTime: Game.time - 500,
            requestorID: this.consulType,
        };
    }
    InitSourceData(source) {
        let sourceData = {};
        sourceData.x = source.pos.x;
        sourceData.y = source.pos.y;
        sourceData.id = source.id;
        sourceData.lastEnergy = source.energy;
        sourceData.spawnBuffer = 0; // This is how soon a creep must be spawned to get to the source at the right moment.
        let structures = this.Queen.Nest.lookForAtArea(LOOK_STRUCTURES, sourceData.y - 1, sourceData.x - 1, sourceData.y + 1, sourceData.x + 1, true);
        let container = _.filter(structures, (struct) => {
            return struct.structure.structureType == STRUCTURE_CONTAINER;
        });
        if (container.length > 0) {
            sourceData.containerID = container[0].structure.id;
        }
        else {
            let constructionSites = this.Queen.Nest.lookForAtArea(LOOK_CONSTRUCTION_SITES, sourceData.y - 1, sourceData.x - 1, sourceData.y + 1, sourceData.x + 1, true);
            let site = _.filter(constructionSites, (site) => {
                return site.constructionSite.structureType == STRUCTURE_CONTAINER;
            });
            if (site.length > 0) {
                sourceData.constructionSite = site[0].constructionSite.id;
            }
        }
        return sourceData;
    }
    ActivateConsul() {
        // Request hive harvesters from the nestqueen.
        let sourceData = this.CreepData;
        for (let i = 0, length = sourceData.length; i < length; i++) {
            let data = sourceData[i];
            if (data.creepName && Game.creeps[data.creepName]) {
                if (!data.containerID) {
                    let bootStrapper = new BootstrapImperator_1.BootstrapImperator();
                    bootStrapper.ActivateHarvester(data, Game.creeps[data.creepName]);
                }
                else {
                    this.Imperator.ActivateHarvester(data, Game.creeps[data.creepName]);
                }
            }
        }
        let tempWorkers = this.TempWorkers;
        let last = Memory.last || 0;
        let curIndex = Game.time % this.CreepData.length;
        for (let id in tempWorkers) {
            if (tempWorkers[id].spawning) {
                continue;
            }
            let targetId = this._tempData[tempWorkers[id].name];
            let target = Game.getObjectById(targetId) || undefined;
            let cycleProtection = 0;
            do {
                if (cycleProtection++ > this.CreepData.length) {
                    console.log('fuck you');
                    break;
                }
                if (!target) {
                    // find a target by cycling through
                    let data = this.CreepData[last ? 0 : 1];
                    last = !last;
                    if (data.containerID) {
                        target = Game.getObjectById(data.containerID);
                        if (target.store[RESOURCE_ENERGY] < 20) {
                            console.log('container energy: ' + target.store[RESOURCE_ENERGY]);
                            target = undefined;
                        }
                    }
                    if (!target && tempWorkers[id].getActiveBodyparts(WORK) > 0) {
                        target = Game.getObjectById(data.id);
                    }
                    if (!target && data.creepName) {
                        target = Game.creeps[data.creepName];
                    }
                }
                if (target) {
                    if (target.storeCapacity) {
                        if (target.store[RESOURCE_ENERGY] < 20) {
                            target = undefined;
                            continue;
                        }
                    }
                    else if (target.carryCapacity) {
                        if (target.carry[RESOURCE_ENERGY] < 10) {
                            target = undefined;
                            continue;
                        }
                    }
                    else {
                        target = undefined;
                        continue;
                    }
                    //let targetId = this.Consul._tempData[tempWorkers[id].name];
                    //let target: RoomObject | undefined = Game.getObjectById(targetId) || undefined;
                    this._tempData[tempWorkers[id].name] = target.id;
                    break;
                }
            } while (!target);
            this.Imperator.ActivateTempWorker(tempWorkers[id], target);
        }
        Memory.last = last;
        return SwarmCodes.C_NONE; // unused
    }
}
exports.HarvestConsul = HarvestConsul;
//# sourceMappingURL=HarvestConsul.js.map
