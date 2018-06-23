"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SwarmObject {
    constructor(_instance) {
        this._instance = _instance;
    }
    get pos() { return this._instance.pos; }
    get room() { return this._instance.room; }
    get id() { return this._instance.id; }
}
exports.SwarmObject = SwarmObject;
class NotifiableSwarmObject extends SwarmObject {
    NotifyWhenAttacked(enabled) {
        this._instance.notifyWhenAttacked(enabled);
    }
}
exports.NotifiableSwarmObject = NotifiableSwarmObject;
//# sourceMappingURL=SwarmObject.js.map
