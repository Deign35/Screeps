const Initializer = require('SwarmInitializer');

const MainLoop = function () {
    StartFunction('MainLoop');

    // Tell all creeps to do their current job or request a new one.
    CreepManager.ActivateCreeps();
    // Structures check on their status and request a job.
    StructureManager.ActivateStructures();
    // Rerun any creeps that have new jobs.
    CreepManager.ActivateReruns();
    // Spawning creeps for new jobs that are still unfilled.
    HiveManager.ActivateHives();
    // shrug
    SwarmManager.ActivateSwarm();

    EndFunction();
};

const EntryPoint = function () {
    try {
        if (Initializer.Init() == OK) {
            MainLoop();
        } else {
            console.log("UNABLE TO RUN LOOP DUE TO INIT TAKING TOO LONG!!!!");
            Memory.InitOverRun += 1;
        }
        Initializer.Complete();
    } catch(error) {
        console.log('Error: ' + error);
        Debug.CallStack.OutputStackTrace();
        //Memory.RESET = true;
        throw error;
    } finally {
        Debug.CallStack.Clear();
    }
}

module.exports.loop = EntryPoint;