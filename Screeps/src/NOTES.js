/*
A job can assign several creeps to for itself with different roles.
3 creeps go to build a thing.  1 who carries a lot of energy, and 2 that take the energy and construct with it.

Or, assimalateRoom
5 creeps
2 builders, 1 upgrader, 1 carrier, 1 Sentry

Harvest source
3 creeps
1 to harvest, 1 to carry, 1 to build a container for the harvester.
After container is completed, 3rd creep converts to carry. (or both 2 and 3 convert to new job.)
if the harvester has a container, it transfers the energy to the container.
If the harvester doesn't have a container, it will gather until it is full and will transfer energy
to anyone that requests for it.
If the harvester is full and the source is not depleted, a new creep should be spawned.


Jobs:
Carrier,
Harvester, <-- This job is created by a source that doesn't have a harvester.
                If the source doesn't have a completed container, a generic worker,
                a carrier.
Upgrader, <-- Job requested by the StructureController.
Builder, <-- This job is created by a construction site.  structureType will determine NumBuilders.
Defender,

Body_Types:
Carrier, { 1: [CARRY, CARRY, MOVE, MOVE], 3: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]}
Worker, { 1: [WORK, MOVE, CARRY], 3: [WORK, WORK, WORK, CARRY, MOVE, MOVE]}
Defender,
Harvester, {1: [WORK, WORK, CARRY, MOVE], 3: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], 6: [WORK * 20, CARRY, MOVE]
Body part counts could be tied to current capacity instead of by RCL.

DefaultBodyTypes = {};
DefaultBodyTypes[Jobs_Enum.Carrier] = Body_Types_Enum.Carrier;
DefaultBodyTypes[Jobs_Enum.Harvester] = Body_Types_Enum.Harvester;
DefaultBodyTypes[Jobs_Enum.Upgrader] = Body_Types_Enum.Worker;
DefaultBodyTypes[Jobs_Enum.Builder] = Body_Types_Enum.Worker;


Starter war tactic, send in melee units to destroy movement body parts, then let towers destroy the rest, or even let them decay





A supplier job that is requested by the worker that targets itself.  (ALERT): This may lead to a callback missing error.  This should smoothly be handled via CancelCommands.
*/