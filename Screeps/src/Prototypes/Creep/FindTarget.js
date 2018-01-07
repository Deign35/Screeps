var FindTargetFunctions = {};
FindTargetFunctions['Default'] = function (creep, findParam, args) {
    StartFunction('FindTargetFunctions.Default');
    let findResult = ERR_NOT_FOUND;
    let closest = creep.pos.findClosestByRange(findParam, args);

    if (closest) {
        creep.SetTarget(closest);
        findResult = OK;
    }

    EndFunction();
    return findResult;

};
FindTargetFunctions[CreepCommand_Enum.Attack] = function (creep) {
    return this['Default'](creep, FIND_HOSTILE_CREEPS);
};
FindTargetFunctions[CreepCommand_Enum.Build] = function (creep) {
    return this['Default'](creep, FIND_MY_CONSTRUCTION_SITES);
};
FindTargetFunctions[CreepCommand_Enum.Dismantle] = function (creep) {
    return this['Default'](creep, FIND_HOSTILE_STRUCTURES);
};
FindTargetFunctions[CreepCommand_Enum.Drop] = function (creep) {
    return ERR_NOT_FOUND;
};
FindTargetFunctions[CreepCommand_Enum.Harvest] = function (creep) {
    // Need to request a harvest source from the room.  This can easily include minerals, but for now,
    // keep with just sources.
    return this['Default'](creep, FIND_SOURCES, {
        filter: function (source) {
            return source.energy > 0;
        }
    });
};
FindTargetFunctions[CreepCommand_Enum.Heal] = function (creep) {
    return ERR_NOT_FOUND;
};
FindTargetFunctions[CreepCommand_Enum.Pickup] = function (creep) {
    // Need to request a pickup resource from the room.
    return this['Default'](creep, FIND_DROPPED_RESOURCES);
};
FindTargetFunctions[CreepCommand_Enum.RangedAttack] = function (creep) {
    return ERR_NOT_FOUND;
};
FindTargetFunctions[CreepCommand_Enum.RangedHeal] = function (creep) {
    return ERR_NOT_FOUND;
};
FindTargetFunctions[CreepCommand_Enum.Transfer] = function (creep) {
    // This does not account for resource type.  Currently only energy.
    return this['Default'](creep, FIND_MY_STRUCTURES, {
        filter: function (structure) {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_TOWER) &&
                structure.energy < structure.energyCapacity;
        }
    });
};
FindTargetFunctions[CreepCommand_Enum.Upgrade] = function (creep) {
    let targetRoom = creep.GetTargetRoom();
    if (targetRoom.controller && targetRoom.controller.my) {
        creep.SetTarget(targetRoom.controller);
        return OK;
    }

    return ERR_NOT_FOUND;
};
FindTargetFunctions[CreepCommand_Enum.Withdraw] = function (creep) {
    return ERR_NOT_FOUND;
};

Creep.prototype.FindTarget = function (command) {
    StartFunction('Creep.FindTarget(' + command.Command + ')');
    let findResult = ERR_NOT_FOUND;
    if (FindTargetFunctions[command.Command]) {
        findResult = FindTargetFunctions[command.Command](this);
    }

    EndFunction();
    return findResult;
};
Creep.prototype.GetTargetRoom = function () {
    // This is WRONG!
    return this.Brain.CommandData['targetRoom'] ? Game.rooms[this.Brain.CommandData['targetRoom']] : this.room;
};
Creep.prototype.SetTarget = function (target) {
    this.Brain.CommandData['target'] = target.id;
    this.CommandTarget = target;
};