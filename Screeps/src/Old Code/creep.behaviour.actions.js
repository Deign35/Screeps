/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.behaviour.actions');
 * mod.thing == 'a thing'; // true
 */
 
const maxSearchDistance = 50;
const toolsTargets = require('tools.targets');

creepActions = {
    ResetActionMemory: function(creep) {
        delete creep.memory.isHarvesting;
        delete creep.memory.pickingUp;
        if(creep.memory.targetId) {
            toolTargets.removeTarget(creep.id, creep.memory.targetId);
            delete creep.memory.targetId;
        }
    },
    tryGetEnergy: function(creep) {
        if(creep.carry.energy == creep.carryCapacity) {
            ResetActionMemory();
            return ERR_FULL;
        }
        
        let target = Game.getObjectById(creep.memory.targetId);
        if(!target) { //Attempt to acquire one.
            ResetActionMemory();
            target = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1, { filter: function(droppedEnergy) { return Memory.targets[droppedEnergy.id]['isTargetedBy'].length > 0; }});
            if(target) { // Pick it up
                creep.memory.isPickingUp = true;
            } else { //Check for things to pull from.
                target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, 1, {
                            filter: function(structure) {
                                return (structure.structureType == STRUCTURE_STORAGE ||
                                       structure.structureType == STRUCTURE_CONTAINER) &&
                                       (structure.store < structure.storeCapacity);
                            }
                }); // Acquire new Target
                
                if(!target) {
                    target = creep.pos.findClosestByRange(FIND_SOURCES, {filter: function(source) { return source.energy > 0; } });
                    creep.memory.isHarvesting = !!(target);
                }
            }
        }
        
        return getEnergy(creep, target);
    },
    getEnergy: function(creep, target) {
        let getResult = ERR_INVALID_ARGS;
        if(creep.memory.isHarvesting) {
            getResult = creep.harvest(target);
        } else if(target) {
            if(creep.memory.pickingUp) {
                getResult = creep.pickup(target);
            } else {
                getResult = creep.withdraw(target, RESOURCE_ENERGY);
            }
        } else {
            getResult = ERR_NOT_FOUND;
        }
        
        return getResult;
    },
    tryDeliverEnergy: function(creep) {
        
    }
};
module.exports = creepActions;