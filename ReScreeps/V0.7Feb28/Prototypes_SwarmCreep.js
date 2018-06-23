"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwarmObject_1 = require("Prototypes_SwarmObject");
const CARRY_TOTAL = 'CT';
const CURRENT_PATH = 'CP';
class SwarmCreep extends SwarmObject_1.NotifiableSwarmObject {
    constructor() {
        super(...arguments);
        // Instead of T extends Creep, what about different classes??
        this.data = {};
    }
    get carryTotal() {
        if (!this.data[CARRY_TOTAL]) {
            this.data[CARRY_TOTAL] = _.sum(this._instance.carry);
        }
        return this.data[CARRY_TOTAL];
    }
    get curPath() {
        if (!this.data[CURRENT_PATH]) {
            this.data[CURRENT_PATH] = 'NOT CONFIGURED';
        }
        return this.data[CURRENT_PATH];
    }
    get endTickEnergy() {
        // This should utilize calls to things like Drop/Harvest/Pickup etc... and calculate if reactions aught to be
        // enacted as a result of being invalid next tick.
        return 0;
    }
    Attack(target) {
        this._instance.attack(target);
    }
}
exports.SwarmCreep = SwarmCreep;
//# sourceMappingURL=SwarmCreep.js.map
