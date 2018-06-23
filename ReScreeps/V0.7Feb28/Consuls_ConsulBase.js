"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwarmMemory_1 = require("Tools_SwarmMemory");
const REQUESTED_CREEP = 'R_Creep';
class ConsulBase extends SwarmMemory_1.ChildMemory {
    get Queen() { return this.Parent; }
    constructor(id, parent) {
        super(id, parent);
    }
    Load() {
        if (!super.Load()) {
            return false;
        }
        this.Queen.Nest = Game.rooms[this.Queen.id];
        return true;
    }
    InitMemory() {
        super.InitMemory();
        this.Queen.Nest = Game.rooms[this.Queen.id];
    }
    static get ConsulType() { return 'SwarmCodes.E_NOT_IMPLEMENTED'; }
}
exports.ConsulBase = ConsulBase;
class CreepConsul extends ConsulBase {
    Save() {
        if (this.CreepRequested) {
            this.SetData(REQUESTED_CREEP, this.CreepRequested);
        }
        super.Save();
    }
    Load() {
        if (!super.Load()) {
            return false;
        }
        this.CreepRequested = this.GetData(REQUESTED_CREEP);
        return true;
    }
    ActivateConsul() {
        for (let i = 0, length = this.CreepData.length; i < length; i++) {
            this.Imperator.ActivateCreep(this.CreepData[i]);
        }
    }
    AssignSpawn(creepName) {
        this.ForgetSpawn(creepName);
        this._assignCreep(creepName);
    }
    AssignCreep(creep) {
        this._assignCreep(creep.name);
    }
    ForgetSpawn(creepName) {
        if (creepName && creepName != this.CreepRequested) {
            console.log('CREEP NAME NO MATCH');
            throw 'Assignment bad!!!!';
        }
        delete this.CreepRequested;
        this.RemoveData(REQUESTED_CREEP);
    }
}
exports.CreepConsul = CreepConsul;
//# sourceMappingURL=ConsulBase.js.map
