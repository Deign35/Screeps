const MainMemory = require('brain.memory');
module.exports.MainMemory = MainMemory;
const Targets = require('brain.targets');
module.exports.Targets = Targets;

module.exports.EnsureBrainInit = function() {
    return MainMemory.EnsureMemoryInit();
};