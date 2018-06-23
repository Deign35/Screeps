"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConsulBase_1 = require("Consuls_ConsulBase");
const ConstructionImperator_1 = require("Imperators_ConstructionImperator");
const CONSUL_TYPE = 'Constructor';
const BUILDER_DATA = 'B_Data';
const SITE_DATA = 'S_Data';
class ConstructionConsul extends ConsulBase_1.CreepConsul {
    static get ConsulType() { return CONSUL_TYPE; }
    get consulType() { return CONSUL_TYPE; }
    Save() {
        this.SetData(BUILDER_DATA, this.CreepData);
        this.SetData(SITE_DATA, this.siteData);
        super.Save();
    }
    Load() {
        if (!super.Load()) {
            return false;
        }
        this.CreepData = this.GetData(BUILDER_DATA) || [];
        this.siteData = this.GetData(SITE_DATA) || {};
        this.Imperator = new ConstructionImperator_1.ConstructionImperator();
        return true;
    }
    ValidateConsulState() {
        let allSites = this.Queen.Nest.find(FIND_CONSTRUCTION_SITES);
        let validSites = {};
        for (let id in this.siteData) {
            let siteId = this.siteData[id].siteId;
            if (allSites[siteId]) {
                validSites[siteId] = allSites[siteId];
                delete allSites[siteId];
            }
            else {
                if (this.siteData[id].requestor != this.consulType) {
                    // notify the original requestor.
                }
                delete this.siteData[id];
                continue;
            }
        }
        for (let id in allSites) {
            //new sites.
            this.AddSiteForConstruction({ siteId: allSites[id].id, requestor: this.consulType });
            validSites[allSites[id].id] = Game.getObjectById(allSites[id].id);
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
            else if (!this.CreepData[i].fetching && creep.carry[RESOURCE_ENERGY] == 0) {
                //this.Queen.Collector.AssignManagedCreep(creep, true);
                this.CreepData[i].fetching = true;
            }
            //Check that the construction site is valid
            if (!validSites[this.CreepData[i].target]) {
                if (Object.keys(this.siteData).length == 0) {
                    this.Queen.ReleaseControl(creep);
                    this.ReleaseCreep(creep.name);
                    continue;
                }
                this.CreepData[i].target = this.siteData[Object.keys(this.siteData)[0]].siteId;
            }
        }
    }
    AddSiteForConstruction(request) {
        this.siteData[request.siteId] = request;
    }
    _assignCreep(creepName) {
        if (!creepName) {
            throw "ASSIGNMENT IS EMPTY";
        }
        let builderKeys = Object.keys(this.siteData);
        for (let i = 0, length = this.CreepData.length; i < length; i++) {
            if (this.CreepData[i].creepName == creepName) {
                return;
            }
        }
        if (builderKeys.length == 0) {
            this.CreepData.push({ creepName: creepName, target: '', fetching: false });
        }
        else {
            this.CreepData.push({ creepName: creepName, target: this.siteData[Object.keys(this.siteData)[0]].siteId, fetching: false });
        }
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
    GetSpawnDefinition() {
        return {
            creepName: 'Build_' + ('' + Game.time).slice(-3),
            body: [WORK, WORK, 
            CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE],
            targetTime: Game.time,
            requestorID: this.consulType,
        };
    }
    GetNextSpawn() {
        if (this.CreepRequested) {
            return false;
        }
        return Object.keys(this.siteData).length > 0 && Object.keys(this.CreepData).length < 1;
    }
}
exports.ConstructionConsul = ConstructionConsul;
//# sourceMappingURL=ConstructionConsul.js.map
