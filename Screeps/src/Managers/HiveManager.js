const MemoryId = 'HiveManagerMemory';
const HiveManager = {
    InitManagerMemory: function () {
        StartFunction('HiveManager.InitManagerMemory');
        let result = OK;
        this.ManagerData = {};

        this.ManagerData['Hives'] = {};
        console.log('HiveManager.Init[Hives]: ' + (Game.rooms.length || 0));
        for (let roomId in Game.rooms) {
            result = this.AddNewHive(Game.rooms[roomId]);
        }

        Overmind.SaveData(MemoryId, this.ManagerData);
        EndFunction();
        return result;
    },
    Load: function () {
        StartFunction('HiveManager.Load');
        this.ManagerData = Overmind.LoadData(MemoryId);

        for (let name in this.ManagerData['Hives']) {
            let room = Game.rooms[name];
            room.Brain = this.ManagerData['Hives'][name];
            room.Init();
        }

        EndFunction();
        return OK;
    },
    Save: function () {
        StartFunction('HiveManager.Save');

        for (let name in this.ManagerData['Hives']) {
            let room = Game.rooms[name];
            room.Complete();
            this.ManagerData['Hives'][name] = room.Brain;
        }

        Overmind.SaveData(MemoryId, this.ManagerData);
        EndFunction();
        return OK;
    },

    ActivateHives: function () {
        StartFunction('HiveManager.ActivateHives');
        let result = OK;

        for (let name in this.ManagerData['Hives']) {
            result = Game.rooms[name].Activate();
            if (result != OK) {
                Memory.DataDump.push({
                    Err: 'HiveManager.ActivateHives[hive].Activate() -> ' + result,
                    RoomBrain: Game.rooms[name].Brain,
                    TimeStamp: Game.time + '_' + Game.cpu.getUsed(),
                });
                console.log(name + ' has failed with code: ' + result);
            }
        }

        EndFunction();
        return result;
    },

    AddNewHive: function (hive) {
        StartFunction('HiveManager.AddNewHive');
        let result = OK;

        if (!this.ManagerData['Hives'][hive.name] && hive.controller.my) {
            hive.Brain = {};
            result = hive.InitMemory();
            if (result == OK) {
                console.log('Hive[' + hive.name + '] assimilated into the swarm.');
                this.ManagerData['Hives'][hive.name] = hive.Brain;
            }
        }

        EndFunction();
        return result;
    },
};

module.exports = HiveManager;