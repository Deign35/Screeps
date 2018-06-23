"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConsulBase_1 = require("Consuls_ConsulBase");
const MinHeap_1 = require("Tools_MinHeap");
const CONSUL_TYPE = 'Spawn_Consul';
const SPAWN_DATA = 'S_DATA';
const SPAWN_QUEUE = 'S_QUEUE';
const RELATIVE_TIME = 'R_TIME';
class SpawnConsul extends ConsulBase_1.ConsulBase {
    constructor() {
        super(...arguments);
        this.consulType = SpawnConsul.ConsulType;
    }
    ActivateConsul() {
        //throw new Error("Method not implemented.");
    }
    static get ConsulType() { return CONSUL_TYPE; }
    Save() {
        if (this.SpawnQueue.Peek()) {
            this.Queen.Nest.visual.text(this.Queen.Nest.energyAvailable + ' of ' + this.SpawnQueue.Peek().calculatedCost, 34, 16);
        }
        else {
            this.Queen.Nest.visual.text(this.Queen.Nest.energyAvailable + ' of ' + this.Queen.Nest.energyCapacityAvailable, 34, 16);
        }
        this.SetData(SPAWN_DATA, this.SpawnData);
        let serializedQueue = MinHeap_1.MinHeap.CompressHeap(this.SpawnQueue, SpawnConsul.SerializeSpawnRequest);
        this.SetData(SPAWN_QUEUE, serializedQueue);
        super.Save();
    }
    Load() {
        if (!super.Load()) {
            return false;
        }
        this.SpawnData = this.GetData(SPAWN_DATA);
        let serializedQueue = this.GetData(SPAWN_QUEUE);
        this.ActiveSpawnNames = {};
        let expiredSpawns = [];
        for (let i = 0; i < serializedQueue.length; i++) {
            let creepdata = (SpawnConsul.DeserializeSpawnRequest(serializedQueue[i][0]));
            if (creepdata) {
                if (creepdata.targetTime < Game.time - 1000) {
                    serializedQueue.splice(i--, 1);
                }
                this.ActiveSpawnNames[creepdata.creepName] = creepdata.creepName;
            }
        }
        this.SpawnQueue = MinHeap_1.MinHeap.DeserializeHeap(serializedQueue, SpawnConsul.DeserializeSpawnRequest);
        this.RelativeTime = this.GetData(RELATIVE_TIME);
        return true;
    }
    ValidateConsulState() {
        //throw new Error("Method not implemented.");
    }
    InitMemory() {
        super.InitMemory();
        this.SpawnQueue = new MinHeap_1.MinHeap();
        this.ScanRoom();
    }
    ScanRoom() {
        let spawns = this.Queen.Nest.find(FIND_MY_SPAWNS);
        this.SpawnData = [];
        for (let i = 0, length = spawns.length; i < length; i++) {
            this.AddSpawner(spawns[i]);
        }
        let extensions = this.Queen.Nest.find(FIND_MY_STRUCTURES, {
            filter: function (struct) {
                return struct.structureType == STRUCTURE_EXTENSION ||
                    struct.structureType == STRUCTURE_TOWER;
            }
        });
    }
    SpawnCreep() {
        let spawnData = this.SpawnQueue.Peek();
        if (!spawnData) {
            return;
        }
        if (this.Queen.Nest.energyAvailable >= SpawnConsul.CalculateEnergyCost(spawnData)) {
            let spawnToUse;
            for (let i = 0; i < this.SpawnData.length; i++) {
                let spawn = Game.spawns[this.SpawnData[i].id];
                if (!spawn) {
                    this.SpawnData.splice(i--, 1);
                    continue;
                }
                if (spawn.spawning) {
                    continue;
                }
                if (spawnToUse && spawnData.targetPos) {
                    let xDist1 = spawnToUse.pos.x - spawnData.targetPos.x;
                    let yDist1 = spawnToUse.pos.y - spawnData.targetPos.y;
                    let xDist2 = spawn.pos.x - spawnData.targetPos.x;
                    let yDist2 = spawn.pos.y - spawnData.targetPos.y;
                    if ((xDist1 * xDist1 + yDist1 * yDist1) > (xDist2 * xDist2 + yDist2 * yDist2)) {
                        spawnToUse = spawn;
                    }
                }
                else {
                    spawnToUse = spawn;
                }
            }
            if (spawnToUse) {
                if (Game.creeps[spawnData.creepName]) {
                    spawnData.creepName += ('' + Game.time).slice(-3);
                }
                if (spawnToUse.spawnCreep(spawnData.body, spawnData.creepName, { dryRun: true }) == OK) {
                    spawnToUse.spawnCreep(spawnData.body, spawnData.creepName);
                    return this.SpawnQueue.Pop();
                }
            }
        }
        return;
    }
    AddSpawner(spawner) {
        if (spawner.room.name != this.Queen.Nest.name) {
            return;
        }
        let newSpawnData = {
            x: spawner.pos.x,
            y: spawner.pos.y,
            id: spawner.name
        };
        this.SpawnData.push(newSpawnData);
    }
    AddSpawnToQueue(spawnArgs) {
        if (!this.SpawnQueue.Peek()) {
            this.RelativeTime = Game.time;
            this.SetData(RELATIVE_TIME, this.RelativeTime);
        }
        this.SpawnQueue.Push(spawnArgs, spawnArgs.targetTime - this.RelativeTime - (spawnArgs.body.length * 3));
    }
    GetNextSpawns(numLookAhead) {
        let requirements = [];
        let peeked = [];
        for (let i = 0; i < numLookAhead; i++) {
            if (this.SpawnQueue.Peek()) {
                peeked.push(this.SpawnQueue.Pop());
                // Have to pop this off to get to the first 3
            }
            else {
                break;
            }
        }
        for (let i = 0, length = peeked.length; i < length; i++) {
            let newReq = { energyNeeded: SpawnConsul.CalculateEnergyCost(peeked[i]), neededBy: peeked[i].targetTime };
            requirements.push(newReq);
            // Add it back to the list
            this.AddSpawnToQueue(peeked[i]);
        }
        return requirements;
    }
    static CalculateEnergyCost(spawnData) {
        if (spawnData.calculatedCost) {
            return spawnData.calculatedCost;
        }
        let totalCost = 0;
        let body = spawnData.body;
        for (let i = 0, length = body.length; i < length; i++) {
            totalCost += BODYPART_COST[body[i]];
        }
        spawnData.calculatedCost = totalCost;
        return totalCost;
    }
    static SerializeSpawnRequest(spawnData) {
        return JSON.stringify(spawnData);
    }
    static DeserializeSpawnRequest(data) {
        let spawnArgs = JSON.parse(data);
        return spawnArgs;
    }
}
exports.SpawnConsul = SpawnConsul;
//# sourceMappingURL=SpawnConsul.js.map
