const REPAIRER = {
    REPAIR_REASON: 'RepairTarget',
    resetCreepRoleMemory: function(creepId) {
        Game.Brain.Targets.removeTargetReason(creepId, this.DELIVER_REASON);
        Memory.REPAIR = false;
    },
    run: function(creep) {
        let result = this.EnsureCreepTarget(creep);
        if(result == OK) {
            result = this.tryDeliver(creep);
        }
        return result;
    },
    EnsureCreepTarget: function(creep) {
        let something = Memory.targets[creep.id]['targetReasons'][this.REPAIR_REASON];
        if(!something || something == 0) {
            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(structure) {
                    return (structure.hits < structure.hitsMax) && structure.structureType == STRUCTURE_CONTAINER;
                }
            });
            
            if(target) {
                Game.Brain.Targets.addTarget(creep.id, target.id, this.REPAIR_REASON);
            } else {
                console.log('no repair target found');
                return ERR_NOT_FOUND;
            }
        }
        return OK;
    },
    
    tryDeliver: function(creep) {
        let target = Game.getObjectById(Memory.targets[creep.id]['targetReasons'][this.REPAIR_REASON]);
        let result = creep.repair(target);
        
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

module.exports = REPAIRER;