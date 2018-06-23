"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwarmObject_1 = require("Prototypes_SwarmObject");
const STORE_TOTAL = 'StoreTotal';
class SwarmStructure extends SwarmObject_1.NotifiableSwarmObject {
    constructor() {
        super(...arguments);
        this.data = {};
    }
    get hits() { return this._instance.hits; }
    ;
    get hitsMax() { return this._instance.hitsMax; }
    ;
    get structureType() { return this._instance.structureType; }
    ;
    Destroy() {
        this._instance.destroy();
    }
    IsActive() {
        this._instance.isActive;
    }
}
exports.SwarmStructure = SwarmStructure;
class SwarmContainer extends SwarmStructure {
    constructor() {
        super(...arguments);
        this.data = {};
    }
    get store() { return this._instance.store; }
    ;
    get storeCapacity() { return this._instance.storeCapacity; }
    ;
    get ticksToDecay() { return this._instance.ticksToDecay; }
    ;
    // Instead of T extends Creep, what about different classes??
    get carryTotal() {
        if (!this.data[STORE_TOTAL]) {
            this.data[STORE_TOTAL] = _.sum(this._instance.store);
        }
        return this.data[STORE_TOTAL];
    }
}
exports.SwarmContainer = SwarmContainer;
class SwarmRoad extends SwarmStructure {
    get ticksToDecay() { return this._instance.ticksToDecay; }
    ;
}
exports.SwarmRoad = SwarmRoad;
class SwarmWall extends SwarmStructure {
}
exports.SwarmWall = SwarmWall;
// Other non-owned Structuretypes: StructurePowerBank, StructurePortal
class OwnedSwarmStructure extends SwarmStructure {
    get my() { return this._instance.my; }
    ;
    get owner() { return this._instance.owner; }
    ;
}
exports.OwnedSwarmStructure = OwnedSwarmStructure;
//# sourceMappingURL=SwarmStructure.js.map
