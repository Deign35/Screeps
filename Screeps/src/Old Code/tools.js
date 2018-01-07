/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('tools');
 * mod.thing == 'a thing'; // true
 */
module.exports = {
    CheckEnergyConsumption: function() {
        const Brain = Game.Brain;
        const SourcesMemory = Memory[Brain.MainMemory.MEM_TYPE.Sources];
        const mainRoom = Game.rooms[Brain.MainMemory.GetConstsMemory('mainRoom')];
        for(let i = 0; i < SourcesMemory.ids.length; i++) {
            let source = Game.getObjectById(SourcesMemory.ids[i]);
            let sourceMemory = SourcesMemory[source.id];
            if(source.energy < 10 && !sourceMemory.emptyMsgSent) {
                sourceMemory.emptyMsgSent = true;
                console.log('Source[' + source.id + '] has been depleted with ' + source.ticksToRegeneration + ' ticks remaining');
            }
            if(source.ticksToRegeneration < 2 && !(sourceMemory.emptyMsgSent)) {
                console.log('Source[' + source.id + '] not depleted.  Remaining energy wasted[' + source.energy + ']');
            }
            
            if(source.energy > 1000 && (sourceMemory.emptyMsgSent)) {
                console.log('Source[' + source.id + '] replenished');
                delete sourceMemory.emptyMsgSent;
            }
            return ERR_INVALID_TARGET;
        }
        return OK;
    },
};