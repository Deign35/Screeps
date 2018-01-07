const DEBUG = true;
const ENABLE_PERF_LOGGING = true;

const Brain = require('brain');
const Creeps = require('creep');
const Tools = require('tools');

module.exports.loop = function () {
    Game.Brain = Brain;
    Game.Creeps = Creeps;
    Game.Tools = Tools;
    if(Brain.EnsureBrainInit() != OK) {
        Memory.RESET = true;
        return;
    }
    Memory.RESET = true;
    
    if(ENABLE_PERF_LOGGING) {
        Tools.CheckEnergyConsumption();
    }
    if(!DEBUG) {
        var room = Game.rooms[Brain.MainMemory.GetMainRoomName()]; // Good enough until more than 1 room (which is sooon)
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        if(!room.controller.safeMode && room.controller.safeModeAvailable && hostiles.length > 0) {
            for(var i = 0; i < hostiles.length; i++) {
                if(hostiles[i].owner != 'Invader') {
                    Game.notify('Intruder[' + hostiles[i].owner + '] detected, activating safe mode', 0);
                    room.controller.activateSafeMode();
                    break;
                }
            }
        }
    }
    
    const CreepMemType = Brain.MainMemory.MEM_TYPE.Creeps;
    let creepIds =  Brain.MainMemory.GetEntityIds(CreepMemType);
    for(var memId in creepIds) {
        let id = creepIds[memId];
        let creep = Game.getObjectById(id);
        if(!creep && id != 0) { // Creep no longer exists
            Creeps.Behaviour.onDelete(id);
            delete Memory[CreepMemType][id];
            console.log('Clearing non-existing creep memory:', id);
        } else if(!creep.spawning) {
            creep.memory = Brain.MainMemory.GetCreepMemory(id);
            var actResult = Creeps.Behaviour.run(creep);
            /*if(actResult == ERR_INVALID_ARGS) {
                //What do!??!!??!!
            } else if(actResult == ERR_FULL) {
                console.log(creep.memory.HasDelivered);
                if(creep.memory.HasDelivered > 2) {
                    delete creep.memory.HasDelivered;
                    Creeps.CreepRoles.setRole(creep.id, Creeps.CreepRoles.RoleNameToId['UPGRADER']);
                } else {
                    creep.memory.HasDelivered += 1;
                    Creeps.CreepRoles.setRole(creep.id, Creeps.CreepRoles.RoleNameToId['DELIVERER']);
                }
            } else if(actResult != OK && actResult != ERR_NOT_IN_RANGE) {
                if(Memory[Brain.MainMemory.MEM_TYPE.Creeps][creep.id]['roleId'] == Creeps.CreepRoles.RoleNameToId['HARVESTER']) {
                    Creeps.CreepRoles.setRole(creep.id, Creeps.CreepRoles.RoleNameToId['GATHERER']);
                } else {
                    Creeps.CreepRoles.setRole(creep.id, Creeps.CreepRoles.RoleNameToId['HARVESTER']);
                }
            }*/
            
            if(actResult != OK && actResult != ERR_NOT_IN_RANGE && actResult != ERR_TIRED) {
                if(creep.memory.roleId == Creeps.CreepRoles.RoleNameToId['HARVESTER']) {
                    if(actResult == ERR_FULL) {
                        if(Memory.REPAIR != true) {
                            Creeps.CreepRoles.setRole(creep.id, Creeps.CreepRoles.RoleNameToId['REPAIRER']);
                            Memory.REPAIR = true;
                        } else if(creep.memory.HasDelivered > 2) {
                            delete creep.memory.HasDelivered;
                            Creeps.CreepRoles.setRole(creep.id, Creeps.CreepRoles.RoleNameToId['UPGRADER']);
                        } else {
                            creep.memory.HasDelivered += 1;
                            Creeps.CreepRoles.setRole(creep.id, Creeps.CreepRoles.RoleNameToId['DELIVERER']);
                        }
                    } else if(actResult == ERR_NOT_FOUND || actResult == ERR_NOT_ENOUGH_RESOURCES) {
                        Creeps.CreepRoles.setRole(creep.id, Creeps.CreepRoles.RoleNameToId['GATHERER']);
                    } else { console.log('UNHANDLED ERROR RESULT1: ' + actResult); }
                } else if(creep.memory.roleId == Creeps.CreepRoles.RoleNameToId['GATHERER']) {
                    if(actResult == ERR_FULL) {
                        if(Memory.REPAIR == false) {
                            Creeps.CreepRoles.setRole(creep.id, Creeps.CreepRoles.RoleNameToId['REPAIRER']);
                            Memory.REPAIR = true;
                        } else if(creep.memory.HasDelivered > 2) {
                            delete creep.memory.HasDelivered;
                            Creeps.CreepRoles.setRole(creep.id, Creeps.CreepRoles.RoleNameToId['UPGRADER']);
                        } else {
                            creep.memory.HasDelivered += 1;
                            Creeps.CreepRoles.setRole(creep.id, Creeps.CreepRoles.RoleNameToId['DELIVERER']);
                        }
                    } else if(actResult == ERR_NOT_FOUND || actResult == ERR_NOT_ENOUGH_RESOURCES || actResult == ERR_INVALID_TARGET) { 
                        Creeps.CreepRoles.setRole(creep.id, Creeps.CreepRoles.RoleNameToId['GATHERER'], true);
                    } else if(actResult == ERR_NO_PATH) {
                        let newTarget = Game.getObjectById('0ed27f7105b20909173d9b44');
                        Brain.Targets.removeTargetReason(creep.id, 'GathererTarget2');
                        Brain.Targets.addTarget(creep.id, newTarget.id, 'GathererTarget2');
                        
                        
                        
                    } else { console.log('UNHANDLED ERROR RESULT2: ' + actResult); }
                } else if(creep.memory.roleId == Creeps.CreepRoles.RoleNameToId['DELIVERER']) {
                    if(actResult == ERR_NOT_FOUND || actResult == ERR_FULL) { 
                            delete creep.memory.HasDelivered;
                            Creeps.CreepRoles.setRole(creep.id, Creeps.CreepRoles.RoleNameToId['UPGRADER']);
                    } else if(actResult == ERR_NOT_ENOUGH_RESOURCES) {
                        Creeps.CreepRoles.setRole(creep.id, Creeps.CreepRoles.RoleNameToId['HARVESTER']);
                    } else if(actResult == ERR_INVALID_TARGET) {
                            Creeps.CreepRoles.setRole(creep.id, Creeps.CreepRoles.RoleNameToId['DELIVERER'], true);
                    } else { console.log('UNHANDLED ERROR RESULT3: ' + actResult); }
                } else if(creep.memory.roleId == Creeps.CreepRoles.RoleNameToId['UPGRADER']) {
                    if(actResult == ERR_NOT_ENOUGH_RESOURCES) {
                        Creeps.CreepRoles.setRole(creep.id, Creeps.CreepRoles.RoleNameToId['HARVESTER']);
                    } else { console.log('UNHANDLED ERROR RESULT4: ' + actResult); }
                } else if(creep.memory.roleId == Creeps.CreepRoles.RoleNameToId['REPAIRER']) {
                    if(actResult == ERR_NOT_ENOUGH_RESOURCES) {
                        Creeps.CreepRoles.setRole(creep.id, Creeps.CreepRoles.RoleNameToId['HARVESTER']);
                    } else { console.log('UNHANDLED ERROR RESULT4: ' + actResult); }
                } else {
                    console.log('UNKNOWN ROLEID: ' + creep.memory.roleId);
                }
            }
        }
    }
    
    if(creepIds.length < 12) {
        let creepBody = [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK]; // 3m + 3c + 2w = 500
        let spawner = Game.spawns['Spawn1']; 
        if(spawner.spawnCreep(creepBody, 'TestWorker', { dryRun: true }) == OK) {
            let newCreep = spawner.spawnCreep(creepBody, (spawner.name + Game.time), { });
        }
    }
    
    Memory.RESET = false;
    delete Memory.RESET;
    return OK;
}