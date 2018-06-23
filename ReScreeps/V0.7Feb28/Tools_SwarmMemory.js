"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class _SwarmMemory {
    constructor(id, Parent) {
        this.id = id;
        this.Parent = Parent;
        this._cache = {}; // this probably shouldn't be initialized like this
        if (!this.Load()) {
            this.InitMemory();
            this.Save();
            this.Load();
        }
    }
    GetData(id) {
        return this._cache[id];
    }
    SetData(id, data) {
        this._cache[id] = data;
    }
    RemoveData(id) {
        delete this._cache[id];
    }
    SnapshotData() {
        if (!this._snapshot) {
            this._snapshot = {};
            Object.assign(this._snapshot, this._cache);
        }
    }
    ReloadSnapshot(del = false) {
        if (this._snapshot) {
            Object.assign(this._cache, this._snapshot);
            if (del) {
                this.ResetSnapshotData();
            }
        }
    }
    ResetSnapshotData() {
        this._snapshot = undefined;
    }
    InitMemory() {
        this._cache = {};
    }
}
exports._SwarmMemory = _SwarmMemory;
class QueenMemory extends _SwarmMemory {
    constructor(id) {
        super(id);
    }
    Save() {
        if (this._snapshot) {
            console.log('SNAPSHOT NOT RESET, RELOADING OLD DATA[' + this.id + ']');
            this.ReloadSnapshot(true);
        }
        Memory[this.id] = this._cache;
        delete this._cache;
    }
    Load() {
        this._cache = Memory[this.id];
        if (!this._cache) {
            return false;
        }
        return true;
    }
}
exports.QueenMemory = QueenMemory;
class ChildMemory extends _SwarmMemory {
    constructor(id, Parent) {
        super(id, Parent);
        this.Parent = Parent;
    }
    Save() {
        if (this._snapshot) {
            console.log('SNAPSHOT NOT RESET, RELOADING OLD DATA[' + this.Parent.id + '.' + this.id + ']');
            this.ReloadSnapshot(true);
        }
        this.Parent.SetData(this.id, this._cache);
        delete this._cache;
    }
    Load() {
        this._cache = this.Parent.GetData(this.id);
        if (!this._cache) {
            return false;
        }
        return true;
    }
}
exports.ChildMemory = ChildMemory;
//# sourceMappingURL=SwarmMemory.js.map
