const mainMemory = {
    GetMainRoomName: function() {
        return Memory[this.MEM_TYPE.Consts]['mainRoom'];
    },
    EnsureMemoryInit: function() {
        if(!Memory.INIT || Memory.RESET) {
            var initResult = this.ResetBrainMemory();
            if(!Memory.INIT || Memory.RESET) {
                console.log('Unable to initialize memory[' + initResult.toString() + ']');
                return initResult;
            }
        }
        
        delete Memory.creeps;
        this.ValidateCurrentMemoryState();
        return OK;
    },
    ValidateCurrentMemoryState: function() {
        for(let i in Game.creeps) {
            let creep = Game.creeps[i];
            if(!creep.id || creep.spawning) { continue; }
            if(!this.GetCreepMemory(creep.id)) {
                this.AddNewEntity(creep, { }, MEM_TYPE.Creeps);
                creep.memory = Memory[MEM_TYPE.Creeps][creep.id];
                creep.targets = Memory[MEM_TYPE.Targets][creep.id];
                Game.Creeps.CreepRoles.setRole(creep.id, Game.Creeps.CreepRoles.RoleNameToId['HARVESTER']);
            } else {
                creep.memory = Memory[MEM_TYPE.Creeps][creep.id];
                creep.targets = Memory[MEM_TYPE.Targets][creep.id];
            }
        }
        let structures = Game.rooms[this.GetMainRoomName()].find(FIND_STRUCTURES);
        for(let i in structures) {
            let structure = structures[i];
            if(!Memory[MEM_TYPE.Structures][structure.id]) {
                this.AddNewEntity(structure, { }, MEM_TYPE.Structures);
            }
        }
    },
    ResetBrainMemory: function() { console.log('Game Memory being reset');
        if(Memory.flags) {
            delete Memory.flags;
        }
        if(Memory.rooms) {
            delete Memory.rooms;
        }
        if(Memory.spawns) {
            delete Memory.spawns;
        }
        if(Memory.consts) {
            delete Memory.consts;
        }
        Memory.consts = { ids: ['mainRoom'],
                          mainRoom: Game.rooms.sim.name };
        
        if(Memory.alerts) {
            delete Memory.alerts;
        }
        Memory.alerts = { length: 0 };
        
        if(Memory[this.MEM_TYPE.Structures]) {
            delete Memory[this.MEM_TYPE.Structures];
        }
        Memory[this.MEM_TYPE.Structures] = { ids: [], structureTypeToId: { }};
        
        if(Memory[this.MEM_TYPE.Sources]) {
            delete Memory[this.MEM_TYPE.Sources];
        }
        Memory[this.MEM_TYPE.Sources] = { ids: []};
        
        Game.Brain.Targets.clearTargetMemory();
        Game.Creeps.ClearCreepMemory();

        // Rooms
        const mainRoom = Game.rooms[this.GetConstsMemory('mainRoom')];
        Game.Brain.Targets.createNewTarget(mainRoom.name);
        
        // Sources
        let sources = mainRoom.find(FIND_SOURCES);
        for(let sourceIndex in sources) {
            let source = sources[sourceIndex];
            let defaultMem = { emptyMsgSent: false,
                               beingHarvested: false };
            this.AddNewEntity(source, defaultMem, this.MEM_TYPE.Sources);
        }
        
        // Structures
        const structures = mainRoom.find(FIND_MY_STRUCTURES);
        for(let structureIndex in structures) {
            let structure = structures[structureIndex];
            this.AddNewEntity(structure, { structureType: structure.structureType }, this.MEM_TYPE.Structures);
            if(!Memory[this.MEM_TYPE.Structures]['structureTypeToId'][structure.structureType]) {
                Memory[this.MEM_TYPE.Structures]['structureTypeToId'][structure.structureType] = [ ];
            }
            Memory[this.MEM_TYPE.Structures]['structureTypeToId'][structure.structureType].push(structure.id);
        }

        // Creeps
        for(let creepName in Game.creeps) {
            let creep = Game.creeps[creepName];
            this.AddNewEntity(creep, {}, this.MEM_TYPE.Creeps);
            Game.Creeps.CreepRoles.setRole(creep.id, Game.Creeps.CreepRoles.RoleNameToId['HARVESTER']);
        }

        if(Memory[this.MEM_TYPE.Sources]['ids'].length == 0) {
            console.log('NO SOURCES DETECTED');
            return ERR_NOT_FOUND;
        }
        
        if(!Memory[this.MEM_TYPE.Structures]['structureTypeToId'][STRUCTURE_SPAWN]) {
            console.log('NO SPAWNER DETECTED');
            return ERR_NOT_FOUND;
        }

        Memory.INIT = true;
        delete Memory.RESET;
        return OK;
    },
    MEM_TYPE: {
        Alerts: 'alerts',
        Targets: 'targets',
        
        Consts: 'consts',
        Creeps: 'Screeps',
        Sources: 'sources',
        Structures: 'structures',
        Unknown: 'UNKNOWN_ENTITY',
    },
    GetCreepMemory: function(creepId) {
        return Memory[this.MEM_TYPE.Creeps][creepId];
    },
    GetStructureMemory: function(structureId) {
        return Memory[this.MEM_TYPE.Structures][structureId];
    },
    GetSourceMemory: function(sourceId) {
        return Memory[this.MEM_TYPE.sources][sourceId];
    },
    GetConstsMemory: function(constId) {
        return Memory[this.MEM_TYPE.Consts][constId];
    },
    GetEntityMemory: function(memType, entityId) {
        if(memType) {
            return Memory[memType][entityId];
        }
    },
    GetEntityIds: function(memType) {
        if(memType == this.MEM_TYPE.Structures ||
           memType == this.MEM_TYPE.Sources ||
           memType == this.MEM_TYPE.Creeps) {
            return Memory[memType]['ids'];
        }
        
        return [];
    },
    
    AddNewEntity: function(entity, defaultMem, entityMemType) {
        if(!entityMemType) {
            entityMemType = MEM_TYPE.Unknown; 
        }
        if(!defaultMem) {
            defaultMem = { };
        }

        Memory[entityMemType][entity.id] = defaultMem;
        Memory[entityMemType].ids.push(entity.id);
        Game.Brain.Targets.createNewTarget(entity.id);
    },
    DeleteEntity: function(entityId, entityMemType) {
        if(entityId == null) {
            console.log('brain.memory.DeleteEntity failed due to null creepId');
            Memory.RESET = true;
            return ERR_INVALID_ARGS;
        }
        let entityIds = this.GetEntityIds(entityMemType);
        let index = -1;
        for(let id in entityIds) {
            if(entityId == entityIds[id]) {
                index = id;
                break;
            }
        }
        if(index != -1) {
            Memory[entityMemType]['ids'] = entityIds.filter( entityId2 => {
                return entityId2 != entityId;
            });
            return OK;
        }
        return ERR_NOT_FOUND;
    },
    
    SetAlert: function(alertMessage) {
        if(!Memory.alerts[Game.time]) {
            Memory.alerts[Game.time] = [];
        }
        
        Memory.alerts[Game.time].push(alertMessage);
    },
    
};

const MEM_TYPE = mainMemory.MEM_TYPE;

module.exports = mainMemory;