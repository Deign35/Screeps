"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwarmMemory_1 = require("Tools_SwarmMemory");
const HiveQueen_1 = require("Queens_HiveQueen");
class SwarmQueen extends SwarmMemory_1.QueenMemory {
    Activate() {
        for (let name in this.HiveQueens) {
            this.HiveQueens[name].ActivateNest();
        }
    }
    Save() {
        let queenList = [];
        for (let name in this.HiveQueens) {
            this.HiveQueens[name].Save();
            queenList.push(name);
        }
        this.SetData('HiveQueenData', queenList);
        super.Save();
    }
    Load() {
        if (!super.Load()) {
            return false;
        }
        this.HiveQueens = {};
        let HiveQueenData = this.GetData('HiveQueenData') || [];
        for (let i = 0, length = HiveQueenData.length; i < length; i++) {
            this.HiveQueens[HiveQueenData[i]] = new HiveQueen_1.HiveQueen(HiveQueenData[i]);
        }
        return true;
    }
    static LoadSwarmData() {
        return new SwarmQueen('SwarmQueen');
    }
    static InitializeSwarm() {
        // If the swarm has already been initialized and is still in memory, this will be a noop
        // due to how _SwarmMemory works.
        // The only effect this could have is adding rooms that you didn't previously add.
        // In that sense, it is safe to call, but explicitly adding the room would be better perf-wise.
        let newSwarm = new SwarmQueen('SwarmQueen');
        newSwarm.Save();
        newSwarm.Load();
        for (let name in Game.rooms) {
            let room = Game.rooms[name];
            if (!room.controller || !room.controller.my) {
                continue;
            }
            newSwarm.HiveQueens[name] = new HiveQueen_1.HiveQueen(name);
        }
        // Initialize each HiveQueen
        newSwarm.Save();
    }
}
exports.SwarmQueen = SwarmQueen;
//# sourceMappingURL=SwarmQueen.js.map
