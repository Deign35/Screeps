/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.behaviour.HARVESTER');
 * mod.thing == 'a thing'; // true
 */

const DELIVERER = {
    DELIVER_REASON: 'DeliveryTarget',
    resetCreepRoleMemory: function(creepId) {
        Game.Brain.Targets.removeTargetReason(creepId, this.DELIVER_REASON);
        delete Memory[Game.Brain.MainMemory.MEM_TYPE.Creeps][creepId]['Building'];
    },
    run: function(creep) {
        let result = this.EnsureCreepTarget(creep);
        if(result == OK) {
            result = this.tryDeliver(creep);
        }
        return result;
    },
    EnsureCreepTarget: function(creep) {
        let something = Memory.targets[creep.id]['targetReasons'][this.DELIVER_REASON];
        if(!something || something == 0) {
            let target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { 
                filter: function(structure) {
                    return ((structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_EXTENSION) &&
                    structure.energy < structure.energyCapacity);
                }
            });
            if(!target) {
                target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { 
                    filter: function(structure) {
                        return (structure.structureType == STRUCTURE_LINK && structure.memory['DepositNode']);
                    }
                });
                
                if(!target) {
                    target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                    if(!target) {
                        target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                            filter: function(structure) {
                                return (structure.energy && structure.energy < structure.energyCapacity);
                            }
                        });
                        
                        if(!target) {
                            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                filter: function(structure) {
                                    return (structure.store && structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
                                }
                            });
                        }
                    } else {
                        creep.memory['Building'] = true;
                    }
                }
            }
            
            if(target) {
                Game.Brain.Targets.addTarget(creep.id, target.id, this.DELIVER_REASON);
            } else {
                console.log('no delivery target found');
                return ERR_NOT_FOUND;
            }
        }
        return OK;
    },
    
    tryDeliver: function(creep) {
        let target = Game.getObjectById(Memory.targets[creep.id]['targetReasons'][this.DELIVER_REASON]);
        let result;
        
        if(creep.memory['Building']) {
            result = creep.build(target);
        } else {
            result = creep.transfer(target, RESOURCE_ENERGY);
        }
        
        if(result == ERR_NOT_IN_RANGE) {
            result = creep.moveTo(target);
            if(result == OK) {
                result = ERR_NOT_IN_RANGE;
            }
        }
        
        return result;
    },
    onDelete: function(creepId) {
    },
};

module.exports = DELIVERER;