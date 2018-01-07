const Behaviour = require('creep.behaviour');
module.exports.Behaviour = Behaviour;

let getCreepMemory = function() { return Memory[Game.Brain.MainMemory.MEM_TYPE.Creeps]; }
const RoleMemoryId = 'RoleList';
const CreepRoles = {
    setRole: function(creepId, roleId, force = false) {
        let creepMemory = Game.Brain.MainMemory.GetCreepMemory(creepId);
        if(creepMemory.roleId) {
            let curRole = creepMemory.roleId;
            if(!force && curRole == roleId) {
               return OK; 
            }
            this.unsetRole(creepId, curRole);
            //console.log('Unset(' + curRole + ') & Set(' + roleId + ')');
        }

        
        creepMemory.roleId = roleId;
        getCreepMemory()[RoleMemoryId][this.RoleIdToName[roleId]].push(creepId);
        return OK;
    },
    
    unsetRole: function(creepId, curRole) {
        if(creepId == null) {
            Memory.RESET = true;
            return OK;
        }
        if(Game.Brain.MainMemory.GetCreepMemory(creepId) && !curRole) {
            curRole = Game.Brain.MainMemory.GetCreepMemory(creepId).roleId;
        }
        if(!curRole) { return OK; }
        if(curRole && getCreepMemory()[creepId].roleId == curRole) {
            Behaviour.resetCreepRoleMemory(creepId);
        const creepMemType = Game.Brain.MainMemory.MEM_TYPE.Creeps;
        Memory[creepMemType][RoleMemoryId][curRole] = Memory[creepMemType][RoleMemoryId][this.RoleIdToName[curRole]].filter( entityId => {
            return entityId != creepId;
        });
            if(curRole) {
                delete getCreepMemory()[creepId].roleId;
                let idList = getCreepMemory()[RoleMemoryId][this.RoleIdToName[curRole]];
                for(let i in idList) {
                    if(creepId == idList[i]) {
                        delete idList[i];
                        break;
                    }
                }
            }
        }
    },

    RolePriority: [ 
        'HARVESTER',
        'GATHERER',
        'DELIVERER',
        'UPGRADER',
        'REPAIRER',
    ],
    RoleNameToId: {
        HARVESTER: 0x01,
        UPGRADER: 0x02,
        GATHERER: 0x04,
        DELIVERER: 0x08,
        REPAIRER: 0x10,
    },
    
    RoleIdToName: {
        0x01: 'HARVESTER',
        0x02: 'UPGRADER',
        0x04: 'GATHERER',
        0x08: 'DELIVERER',
        0x10: 'REPAIRER',
    },
    NumRoles: 4,
};
module.exports.CreepRoles = CreepRoles;

let ClearCreepMemory = function() {
    let BrainMemory = Game.Brain.MainMemory;
    if(Memory[BrainMemory.MEM_TYPE.Creeps]) {
        delete Memory[BrainMemory.MEM_TYPE.Creeps];
    }
    
    Memory[BrainMemory.MEM_TYPE.Creeps] = { ids: [], RoleList: { } };
    for(let i in CreepRoles.RolePriority) {
        Memory[BrainMemory.MEM_TYPE.Creeps][RoleMemoryId][CreepRoles.RolePriority[i]] = [ ];
    } 
};

module.exports.ClearCreepMemory = ClearCreepMemory;