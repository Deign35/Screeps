/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.behaviour.HARVESTER');
 * mod.thing == 'a thing'; // true
 */

const UPGRADER = {
    UPGRADE_CONTROLLER_REASON: 'ControllerUpgrade',
    resetCreepRoleMemory: function(creepId) {
        Game.Brain.Targets.removeTargetReason(creepId, this.UPGRADE_CONTROLLER_REASON);
        
        return OK;
    },
    run: function(creep) {
        return this.tryUpgrade(creep);
    },
    tryUpgrade: function(creep) {
        if(creep.carry.energy == 0) {
            console.log('no energy');
            return ERR_NOT_ENOUGH_ENERGY;
        }
        
        let targetController = creep.room.controller;
        if(!targetController) {
            console.log('no controller');
            return ERR_NOT_FOUND;
        }
        
        let result = creep.upgradeController(targetController);
        if(result == ERR_NOT_IN_RANGE) {
            result = creep.moveTo(targetController);
            if(result == OK) {
                result = ERR_NOT_IN_RANGE;
            }
        }
        
        return result;
    },
    onDelete: function(creepId) {
        return OK;
    },
};

module.exports = UPGRADER;