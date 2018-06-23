"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConsulBase_1 = require("Consuls_ConsulBase");
const CONSUL_TYPE = 'HiveConsul';
class HiveConsul extends ConsulBase_1.ConsulBase {
    static get ConsulType() { return CONSUL_TYPE; }
    get consulType() { return CONSUL_TYPE; }
    get Queen() { return this.Parent; }
    constructor(id, parent) {
        super(id, parent);
    }
    ValidateConsulState() {
        throw new Error("Method not implemented.");
    }
    ActivateConsul() {
        throw new Error("Method not implemented.");
    }
}
exports.HiveConsul = HiveConsul;
//# sourceMappingURL=HiveConsul.js.map
