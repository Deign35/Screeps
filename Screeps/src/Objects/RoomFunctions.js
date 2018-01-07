const SourceToMineralRatio = 5;
const RoomFunctions = {
    GetHarvestSource: function (room) {
        // Need to check for energy 0
        let targetSource = room.sources[room.Brain.HarvestQueue.shift()];
        room.Brain.HarvestQueue.push(targetSource.id);

        return targetSource;
    },

    ConstructBodyForSpawning: function (bodyType, maxEnergy) {
        switch (bodyType) {
            case CreepBodyType_Enum.Worker:
                if (maxEnergy >= 900) {
                    return [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]; // 6w + 2c + 4m = 900
                } else if (maxEnergy >= 450) {
                    return [WORK, WORK, WORK, CARRY, MOVE, MOVE]; // 3W + 1c + 2m = 450
                } else {
                    return [WORK, WORK, CARRY, MOVE];
                }
            case CreepBodyType_Enum.AllPurpose:
                if (maxEnergy >= 900) {
                    return [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; // 4W + 4c + 6m = 900
                } else if (maxEnergy >= 650) {
                    return [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]; // 4W + 2c + 3m = 650
                } else if (maxEnergy >= 450) {
                    return [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]; // 2W + 2C + 3m = 450
                } else {
                    return [WORK, WORK, CARRY, MOVE];
                }
            default:
                return [WORK, CARRY, MOVE, MOVE];
        }
    }
};

module.exports = RoomFunctions;