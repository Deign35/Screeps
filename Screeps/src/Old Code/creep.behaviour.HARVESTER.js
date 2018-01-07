/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.behaviour.HARVESTER');
 * mod.thing == 'a thing'; // true
 */
 
const toolsTargets = require('tools.targets');
const tools = require('tools.std');

const HARVEST_SOURCE_REASON = 'ForHarvesting';
const CONTAINER_DELIVERY_REASON = 'ForSourceDelivery';
const SOURCE_CONTAINER_PAIR = 'SourceContainerPair';
const HARVESTER = {
    resetCreepRoleMemory: function(creepId) {
        Game.Brain.Targets.removeTargetReason(creepId, HARVEST_SOURCE_REASON);
        Game.Brain.Targets.removeTargetReason(creepId, CONTAINER_DELIVERY_REASON);
        delete Memory[Game.Brain.MainMemory.MEM_TYPE.Creeps][creepId]['DeliveryAdjust'];
        
        return OK;
    },
    run: function(creep) {
        let actionResult = this.tryHarvest(creep);
        if(actionResult == OK) {
            actionResult = this.tryDeliver(creep);
            if(actionResult == ERR_NOT_IN_RANGE && creep.carry.energy == creep.carryCapacity) {
                tools.SetAlert('deliveryTarget not in range, switching tasks.');
                actionResult = OK;
            }
        }

        if(creep.carry.energy == creep.carryCapacity) {
            console.log('Creep energy full');
            actionResult = ERR_FULL;
        }
        return actionResult;
    },
    tryHarvest: function(creep) {
        if(!Memory.targets[creep.id]['targetReasons'][HARVEST_SOURCE_REASON]) {
            Game.Creeps.Behaviour.resetCreepRoleMemory(creep.id);
            let newTarget = creep.pos.findClosestByRange(FIND_SOURCES, {
                            filter: function(source) {
                                let sourceTargetedBy = Memory.targets[source.id]['isTargetedBy'];
                                if(sourceTargetedBy) {
                                    for(let i in sourceTargetedBy) {
                                        if(sourceTargetedBy[i] == HARVEST_SOURCE_REASON) {
                                            return false;
                                        }
                                    }
                                } 
                                
                                return true;
                            }
            });
            
            if(!newTarget) {
                console.log('NO SOURCES TO WORK ON.  REASSIGN MY JOB!');
                return ERR_NOT_FOUND;
            }

            Game.Brain.Targets.addTarget(creep.id, newTarget.id, HARVEST_SOURCE_REASON);
        }
        
        const sourceTarget = Game.getObjectById(Memory.targets[creep.id]['targetReasons'][HARVEST_SOURCE_REASON]);
        //Try harvest
        let harvestResult = creep.harvest(sourceTarget);
        if(harvestResult == ERR_NOT_IN_RANGE) {
            harvestResult = creep.moveTo(sourceTarget);
            if(harvestResult == OK) {
                harvestResult = ERR_NOT_IN_RANGE;
            }
        }
        
        return harvestResult;
    },
    tryDeliver: function(creep) {
        if(!Memory.targets[creep.id]['targetReasons'][CONTAINER_DELIVERY_REASON]) {
            let deliveryTarget = creep.pos.findInRange(FIND_STRUCTURES, 2, {
                                filter: function(structure) {
                                    return structure.structureType == STRUCTURE_STORAGE ||
                                           structure.structureType == STRUCTURE_CONTAINER;
                                }
            });
            if(!deliveryTarget || deliveryTarget.length == 0) {
                return OK;
            }
            Game.Brain.Targets.addTarget(creep.id, deliveryTarget[0].id, CONTAINER_DELIVERY_REASON);
            Game.Brain.Targets.addTarget(Memory.targets[creep.id]['targetReasons'][HARVEST_SOURCE_REASON][0], deliveryTarget[0].id, this.SOURCE_CONTAINER_PAIR);
        }
        const deliveryTarget = Game.getObjectById(Memory.targets[creep.id]['targetReasons'][CONTAINER_DELIVERY_REASON]);
        let deliveryResult = creep.transfer(deliveryTarget, RESOURCE_ENERGY);
        if(deliveryResult == ERR_NOT_IN_RANGE) {
            if(!Memory[Game.Brain.MainMemory.MEM_TYPE.Creeps][creep.id]['DeliveryAdjust']) {
                Memory[Game.Brain.MainMemory.MEM_TYPE.Creeps][creep.id]['DeliveryAdjust'] = 0;
            }
            
            if(Memory[Game.Brain.MainMemory.MEM_TYPE.Creeps][creep.id]['DeliveryAdjust']< 3) {
                deliveryResult = creep.moveTo(deliveryTarget);
                Memory[Game.Brain.MainMemory.MEM_TYPE.Creeps][creep.id]['DeliveryAdjust'] += 1;
            }
        }
        
        return deliveryResult;
    },
    onDelete: function(creepId) {
        return OK;
    },
};

module.exports = HARVESTER;