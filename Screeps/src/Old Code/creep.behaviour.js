const HARVESTER = require('creep.behaviour.HARVESTER');
const UPGRADER = require('creep.behaviour.UPGRADER');
const GATHERER = require('creep.behaviour.GATHERER');
const DELIVERER = require('creep.behaviour.DELIVERER');
const REPAIRER = require('creep.behaviour.REPAIRER');

const Behaviour = {
    HARVESTER: HARVESTER,
    UPGRADER: UPGRADER,
    GATHERER: GATHERER,
    DELIVERER: DELIVERER,
    REPAIRER: REPAIRER,
    resetCreepRoleMemory: function(creepId) {
        let creepMemory = Memory[Game.Brain.MainMemory.MEM_TYPE.Creeps][creepId];
        if(creepMemory && creepMemory.roleId) {
            var roleId = Game.Creeps.CreepRoles.RoleIdToName[creepMemory.roleId]
            this[roleId].resetCreepRoleMemory(creepId);
        }
    },
    run: function(creep) {
        const creepRoles = Game.Creeps.CreepRoles;
        let creepMemory = Memory[Game.Brain.MainMemory.MEM_TYPE.Creeps][creep.id];
        var roleId = creepRoles.RoleIdToName[creepMemory.roleId];
        if(!roleId) {
            roleId = creepRoles.RolePriority[0];
        }
        
        let result = this[roleId].run(creep);
        if(result == ERR_FULL) {
            // Choose a target
        } else if(result == ERR_NOT_ENOUGH_RESOURCES) {
            //creepRoles.setRole(creep.id, creepRoles.RoleNameToId['HARVESTER']);
        }
        
        return result;
    },
    onDelete: function(creepId) {
        const CreepMemType = Game.Brain.MainMemory.MEM_TYPE.Creeps;
        let creepMemory = Memory[Game.Brain.MainMemory.MEM_TYPE.Creeps][creepId];
        if(creepMemory && creepMemory.roleId) {
            var roleId = Game.Creeps.CreepRoles.RoleIdToName[creepMemory.roleId]
            Game.Creeps.CreepRoles.unsetRole(creepId);
            this[roleId].resetCreepRoleMemory(creepId);
            this[roleId].onDelete(creepId);
        }
        Game.Brain.Targets.deleteTargetObject(creepId);
        Game.Brain.MainMemory.DeleteEntity(creepId);
        
        Memory[CreepMemType]['ids'] = Memory[CreepMemType]['ids'].filter( entityId => {
            return entityId != creepId;
        });
        
        Game.Creeps.Behaviour.resetCreepRoleMemory(creepId);
        Game.Brain.Targets.deleteTargetObject(creepId);
    },
};


module.exports = Behaviour;