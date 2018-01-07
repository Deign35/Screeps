const ConstructSwarmJobs = function() {
    let SwarmJobs = {};
    SwarmJobs[CreepJobs_Enum.Worker] = [WORK, WORK, CARRY, MOVE];
    SwarmJobs[CreepJobs_Enum.Harvester] = [WORK, WORK, CARRY, MOVE];
    SwarmJobs[CreepJobs_Enum.Carrier] = [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
    SwarmJobs[CreepJobs_Enum.AllPurpose] = [WORK, WORK, CARRY, MOVE];
    SwarmJobs[CreepJobs_Enum.Repairer] = [WORK, CARRY, CARRY, CARRY, MOVE];

    return SwarmJobs;
}

const SwarmJobs = ConstructSwarmJobs();
module.exports = SwarmJobs;