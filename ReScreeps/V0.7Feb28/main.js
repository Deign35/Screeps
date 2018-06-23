"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SwarmCodes = require("Consts_SwarmCodes");
const SwarmQueen_1 = require("Queens_SwarmQueen");
exports.loop = function () {
    if (initSwarm() != SwarmCodes.C_NONE) {
        console.log('CATASTROPHIC END!!!!!!');
        return;
    }
    
    let swarmQueen = SwarmQueen_1.SwarmQueen.LoadSwarmData();
    swarmQueen.Activate();
    swarmQueen.Save();
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    } // Temp solution
    try {
        experimentalCode();
        if(Game.flags['Flag1']) {
            if(Game.rooms['E26N21'].controller.level >= 5){
                Game.rooms['E26N21'].createConstructionSite(Game.flags['Flag1'].pos, STRUCTURE_TOWER);
                Game.flags['Flag1'].remove();
            }
        }
    } catch(e) {
        console.log('E: ' + e.message);
    }
};

const initSwarm = function () {
    let initResult = SwarmCodes.C_NONE;
    if (!Memory.INIT) {
        console.log('InitSwarmlord');
        for (let name in Memory) {
            //if(name == 'creeps' || name == 'flags' || name == 'rooms' || name == 'spawns') { continue; }
            delete Memory[name];
        }
        let startInit = Game.cpu.getUsed();
        // Load managers here
        SwarmQueen_1.SwarmQueen.InitializeSwarm();
        if (initResult == SwarmCodes.C_NONE) {
            Memory.INIT = true;
        }
        console.log('Reset Swarmlord Completed[' + initResult + '] in ' + (Game.cpu.getUsed() - startInit) + ' cpu cycles.');
    }
    return initResult;
};

const experimentalCode = function () {
    let towersIds = Memory.towers;
    let towers = [];
    for(let i = 0, length = towersIds.length; i<length; i++){
        towers.push(Game.getObjectById(towersIds[i]));
        Game.rooms['E26N21'].visual.circle(towers[i].pos, {
            radius: 17,
            opacity: 0.05,
        } );
    }
    if(Memory.repTargets.length == 0) {
        let repTargets = Game.rooms['E26N21'].find(FIND_STRUCTURES, {
            filter: function(structure) {
                return structure.structureType == STRUCTURE_ROAD &&
                    (structure.hitsMax - structure.hits) >= 500;
            }
        });
        for(let i = 0, length = repTargets.length; i < length; i++) {
            Memory.repTargets.push(repTargets[i].id);
        }
    }
    
    let hostiles = Game.rooms['E26N21'].find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
        hostiles = hostiles.filter((a) => {
            if(a.pos.x <= 1 || a.pos.x >= 48){
                return false;
            }
            if(a.pos.y <= 1 || a.pos.y >= 48) {
                return false;
            }
            for(let i = 0, length = towers.length; i < length; i++) {
                if(towers[i].pos.getRangeTo(a.pos) < 17) {
                    return true;
                }
            }
            return false;
        });
        hostiles.sort((a, b) => {
            let aHeal = a.getActiveBodyparts(HEAL);
            let bHeal = b.getActiveBodyparts(HEAL);
            if(aHeal > 0) {
                if(bHeal > 0) {
                    if(aHeal != bHeal) {
                        return aHeal > bHeal ? -1 : 1;
                    }
                } else {
                    return -1;
                }
            } else if(bHeal > 0) {
                return 1;
            }
            let aAttack = a.getActiveBodyparts(ATTACK);
            let bAttack = b.getActiveBodyparts(ATTACK);
            if(aAttack > 0) {
                if(bAttack > 0) {
                    if(aAttack != bAttack) {
                        return aAttack > bAttack ? -1 : 1;
                    }
                } else {
                    return -1;
                }
            } else if(bAttack > 0) {
                return 1;
            }
            
            return 0;
        });
        for(let i = 0, length = towers.length; i < length; i++) {
            let attResult = ERR_INVALID_TARGET;
            while(attResult != OK && hostiles.length > 0) {
                let target = hostiles.splice(0, 1)[0];
                attResult = towers[i].attack(target);
            }
        }
        
    } else if(Game.rooms['E26N21'].energyAvailable == Game.rooms['E26N21'].energyCapacityAvailable) {
        for(let i = 0, length = towers.length; i < length; i++) {
            if(towers[i].energy >= towers[i].energyCapacity * 0.70) {
                let repTarget = Game.getObjectById(Memory.repTargets[0]);
                if(repTarget) {
                    if(repTarget.hits < repTarget.hitsMax) {
                        towers[i].repair(repTarget);
                    } else {
                        Memory.repTargets.splice(0, 1);
                    }
                } else {
                    Memory.repTargets.splice(0, 1);
                }
            }
        }
    }
    Game.rooms['E26N21'].visual.text(("CPU: " + Game.cpu.getUsed()).slice(0, 10), 26, 24, { color: 'black', backgroundColor: 'white', font: 0.8 })
    Game.rooms['E26N21'].visual.text(("MEM: " + RawMemory.get().length).slice(0, 10), 26, 25, { color: 'black', backgroundColor: 'white', font: 0.8 })
    Game.rooms['E26N21'].visual.text(("B: " + Game.cpu.bucket), 26, 26, { color: 'black', backgroundColor: 'white', font: 0.8 })

        if(false) {
        let roomVis = Game.rooms['E26N21'].visual;
        for(let i = 0; i < 10; i++) {
            roomVis.line(i * 5, 0, i * 5, 49)
            roomVis.line(0, i * 5, 49, i * 5);
        }
    }
    
    let count = Memory['TestAttack']['Count'] || 1;
    if(true) {
        if(!Memory['TestAttack'] || Memory['TestAttack']['Reset']) { Memory['TestAttack'] = {Count: count+1}; }
        let r = Game.rooms['E26N21'];
        let healPos = new RoomPosition(1, 30, 'E27N21');
        let healPos2 = new RoomPosition(1, 28, 'E27N21');
        let hPos = new RoomPosition(47, 31, 'E26N21');
        let hPos2 = new RoomPosition(47, 30, 'E26N21')
        let restPos = new RoomPosition(48, 30, 'E26N21');
        let aPos = new RoomPosition(2, 29, 'E27N21');
        let tPos = new RoomPosition(5, 28, 'E27N21');
        
        let aWait = new RoomPosition(41, 33, 'E26N21');
        let hWait = new RoomPosition(40, 33, 'E26N21');
        let hWait2 = new RoomPosition(41, 31, 'E26N21');
        
        let a = Game.creeps['Attacker'];
        let h = Game.creeps['Healer'];
        let h2 = Game.creeps['Healer2'];
        if(!(a && h && h2)) {
            if(Memory['TestAttack']['SpawnComplete']) {
                Memory['TestAttack']['AttackComplete'] = true;
            }
            if(a) { a.moveTo(new RoomPosition(41, 33, 'E26N21')); }
            if(h) { h.moveTo(new RoomPosition(37, 23, 'E26N21')); }
            if(h2) { h2.moveTo(new RoomPosition(36, 23, 'E26N21')); }
        }
        if(!Memory['TestAttack']['AttackComplete']) {
            if(!Memory['TestAttack']['PositioningComplete']) {
                if(a) { a.moveTo(aWait); }
                if(h) {
                    h.moveTo(hWait);
                    if(h.hits < h.hitsMax) {
                            Game.getObjectById('5a929421309d305cb9ee37b1').heal(h);
                        h.heal(h);
                    } else if(h2 && h2.hits < h2.hitsMax) {
                            Game.getObjectById('5a929421309d305cb9ee37b1').heal(h2);
                        if(h.heal(h2) == ERR_NOT_IN_RANGE) {
                            h.rangedHeal(h2);
                        }
                    } else if(a && a.hits < a.hitsMax) {
                            Game.getObjectById('5a929421309d305cb9ee37b1').heal(a);
                        if(h.heal(a) == ERR_NOT_IN_RANGE) {
                            h.rangedHeal(a);
                        }
                    }
                }
                if(h2) {
                    h2.moveTo(hWait2);
                    if(h2.hits < h2.hitsMax) {
                        h2.heal(h2);
                    } else if(h && h.hits < h.hitsMax) {
                        if(h2.heal(h) == ERR_NOT_IN_RANGE) {
                            h2.rangedHeal(h);
                        }
                    } else if(a && a.hits < a.hitsMax) {
                        if(h2.heal(a) == ERR_NOT_IN_RANGE) {
                            h2.rangedHeal(a);
                        }
                    }
                }
                if(!Memory['TestAttack']['SpawnComplete']) {
                    if(!Memory['TestAttack']['IterationBegun']) {
                        if(r.energyAvailable == r.energyCapacityAvailable) {// Wait for a good time to start
                            console.log('Set IterationBegun');
                            Memory['TestAttack']['IterationBegun'] = true;
                            return;
                        }
                    } else {
                        if(!Game.creeps['Attacker']) {
                            Game.spawns['Spawn1'].spawnCreep(
                                [TOUGH,TOUGH,TOUGH,TOUGH,
                                 TOUGH,TOUGH,TOUGH,TOUGH,
                                 TOUGH,TOUGH,TOUGH,TOUGH,
                                 TOUGH,TOUGH,TOUGH,TOUGH,
                                 TOUGH,TOUGH,TOUGH,TOUGH,//200
                                 TOUGH,TOUGH,TOUGH,TOUGH,
                                 TOUGH,TOUGH,TOUGH, //270 -- 27
                                 RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,//720 -- 30
                                 MOVE, MOVE, MOVE, MOVE,
                                 MOVE, MOVE, MOVE, MOVE,    //1120 -- 38 / 8
                                 MOVE, MOVE, ], 'Attacker'); //1220 -- 40 / 10
                        } else {
                            if(!Game.creeps['Healer']) {
                                Game.spawns['Spawn1'].spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE], 'Healer'); // 930
                            } else if(!Game.creeps['Healer2']) {
                                Game.spawns['Spawn1'].spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE], 'Healer2'); // 930
                            } else {
                                console.log('Set SpawnComplete');
                                Memory['TestAttack']['SpawnComplete'] = true;
                            }
                        }
                    }
                } else {
                    let cs = a.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                    if(cs.length > 0) {
                        a.rangedAttack(cs[0]);
                    }
                    let posCount = 0;
                    if(a.pos.isEqualTo(aWait)) { posCount++; }
                    if(h.pos.isEqualTo(hWait)) { posCount++; }
                    if(h2.pos.isEqualTo(hWait2)) { posCount++; }
                    
                    if(posCount == 3) {
                        //console.log('Set PositioningComplete');
                        //Memory['TestAttack']['PositioningComplete'] = true;
                    }
                }
            } else {
                if(!a || !h || !h2) {
                    console.log('Set AttackComplete');
                    Memory['TestAttack']['AttackComplete'] = true;
                } else {
                    if(h.hits < h.hitsMax) {
                        h.heal(h);
                        h.moveTo(hPos);
                    } else {
                        if(h2.hits < h2.hitsMax && h.room.name == h2.room.name) {
                            h.heal(h2);
                            h.moveTo(h2);
                        } else {
                            if(a.room.name == 'E26N21') {
                                if(a.hits < a.hitsMax) {
                                    h.moveTo(hPos);
                                } else {
                                    h.moveTo(a);
                                }
                            } else {
                                h.moveTo(healPos);
                            }
                            h.heal(a);
                        }
                    }
                    if(h2.hits < h2.hitsMax) {
                        h2.heal(h2);
                        h2.moveTo(hPos2);
                    } else {
                        if(h.hits < h.hitsMax && h.room.name == h2.room.name) {
                            h2.heal(h);
                            h2.moveTo(h);
                        } else {
                            if(a.room.name == 'E26N21') {
                                if(a.hits < a.hitsMax) {
                                    h2.moveTo(hPos2);
                                }
                                h2.moveTo(a);
                            } else {
                                h2.moveTo(healPos2);
                            }
                            h2.heal(a);
                        }
                    }
                    if(a.room.name == 'E26N21') {
                        a.rangedMassAttack();
                        if(a.hits == a.hitsMax) {
                            a.moveTo(aPos);
                            h.moveTo(a);
                            h2.moveTo(a);
                        } else {
                            a.moveTo(restPos);
                        }
                    } else {
                        let cs = a.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                        if(cs.length > 0) {
                            a.rangedAttack(cs[0]);
                        }
                        a.room.visual.text(a.hits, a.pos);
                        if(a.hits <= 2500) {
                            a.moveTo(restPos);
                            a.rangedMassAttack();
                        } else {
                            if(a.pos.isEqualTo(aPos)) {
                                 let targets = tPos.lookFor(LOOK_CREEPS);
                                if(targets.length > 0 || a.hits < a.hitsMax) {
                                    if(targets.length > 0) {
                                        a.rangedAttack(targets[0]);
                                    } else {
                                        a.rangedMassAttack();
                                    }
                                } else {
                                    a.rangedMassAttack();
                                }
                            } else {
                                 let targets = aPos.lookFor(LOOK_STRUCTURES);
                                if(targets.length > 0 || a.hits < a.hitsMax) {
                                    if(targets.length > 0) {
                                        a.rangedAttack(targets[0]);
                                    } else {
                                        a.rangedMassAttack();
                                    }
                                } else {
                                    a.rangedMassAttack();
                                }
                                a.moveTo(aPos);
                            }
                        }
                    }
                }
            }
        } else {
            Memory['TestAttack']['Reset'] =true;
        }
    }
}
//# sourceMappingURL=main.js.map
