/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.behaviour.HARVESTER');
 * mod.thing == 'a thing'; // true
 */

const GATHERER = {
    GATHER_REASON: 'GathererTarget2',
    resetCreepRoleMemory: function(creepId) {
        Game.Brain.Targets.removeTargetReason(creepId, this.GATHER_REASON);
        delete Game.Brain.MainMemory.GetCreepMemory(creepId).isPickingUp;
        delete Game.Brain.MainMemory.GetCreepMemory(creepId).isHarvesting;
    },
    run: function(creep) {
        return this.tryGetEnergy(creep);
    },
    
    tryGetEnergy: function(creep) {
        if(creep.carry.energy == creep.carryCapacity) {
            Game.Creeps.Behaviour.resetCreepRoleMemory(creep.id);
            return ERR_FULL;
        }
        let something = Memory.targets[creep.id]['targetReasons'][this.GATHER_REASON];
        if(!something || something == 0) { //Attempt to acquire one.
            Game.Creeps.Behaviour.resetCreepRoleMemory(creep.id);
            let target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: function(droppedEnergy) { return !Memory.targets[droppedEnergy.id] || Memory.targets[droppedEnergy.id]['isTargetedBy'].length == 0; }});
            if(target) { // Pick it up
                creep.memory.isPickingUp = true;
            } else { //Check for things to pull from.
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: function(structure) {
                                return (structure.structureType == STRUCTURE_STORAGE ||
                                       structure.structureType == STRUCTURE_CONTAINER ||
                                       (structure.structureType == STRUCTURE_LINK && structure.memory['WithdrawNode'])) &&
                                       (structure.store[RESOURCE_ENERGY] > 100);
                            }
                }); // Acquire new Target
                if(!target) {
                    target = creep.pos.findClosestByPath(FIND_SOURCES, {filter: function(source) { return source.energy > 0; } });
                    if(!target) {
                        return ERR_NOT_FOUND;
                    } else {
                        creep.memory.isHarvesting = true;
                    }
                }
            }
            
            if(target) {
                Game.Brain.Targets.addTarget(creep.id, target.id, this.GATHER_REASON);
            } else {
                console.log('Nothing found');
            }
        }
        
        let gatherTarget = Game.getObjectById(Memory.targets[creep.id]['targetReasons'][this.GATHER_REASON]);
        let getResult = this.getEnergy(creep, gatherTarget);
        if(getResult == ERR_NOT_IN_RANGE) {
            getResult = creep.moveTo(gatherTarget);
            if(getResult == OK) {
                getResult = ERR_NOT_IN_RANGE;
            }
        }
        
        return getResult;
    },
    getEnergy: function(creep, target) {
        let getResult = ERR_INVALID_ARGS;
        if(creep.memory.isHarvesting) {
            getResult = creep.harvest(target);
        } else if(target) {
            if(creep.memory.pickingUp) {
                getResult = creep.pickup(target);
                if(getResult == OK) {
                    creep.memory.pickingUp = false;
                }
            } else {
                getResult = creep.withdraw(target, RESOURCE_ENERGY);
            }
        } else {
            getResult = ERR_NOT_FOUND;
        }
        
        return getResult;
    },
    
    onDelete: function(creepId) {
    },
};

module.exports = GATHERER;