"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConsulBase_1 = require("Consuls_ConsulBase");
const CONSUL_TYPE = 'Spawn_Consul';
const REQUEST_DATA = 'R_DATA';
class Respawner extends ConsulBase_1.ConsulBase {
    constructor() {
        super(...arguments);
        this.consulType = Respawner.ConsulType;
    }
    static get ConsulType() { return CONSUL_TYPE; }
    Save() {
        this.SetData(REQUEST_DATA, this.RequestData);
        super.Save();
    }
    Load() {
        if (!super.Load()) {
            return false;
        }
        this.RequestData = this.GetData(REQUEST_DATA);
        return true;
    }
    ValidateConsulState() {
        throw new Error("Method not implemented.");
    }
    ActivateConsul() {
        throw new Error("Method not implemented.");
    }
    SetSpawnSchedule(requestData) {
    }
}
exports.Respawner = Respawner;
//# sourceMappingURL=Respawner.js.map
