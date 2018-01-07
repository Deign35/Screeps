const MemoryId = 'HiveManagerMemory';
const HiveManager = {
    InitManagerMemory: function () {
        StartFunction('HiveManager.InitManagerMemory');
        let result = OK;
        this.ManagerData = {};

        this.ManagerData['Hives'] = {};
        for (let roomId in Game.rooms) {
            if (Game.rooms[roomId].controller.my) {
                result = this.AddNewHive(Game.rooms[roomId]);
                if (result != OK) {
                    break;
                }
            }
        }

        MemoryManager.SaveData(MemoryId, this.ManagerData);
        EndFunction();
        return result;
    },
    Init: function () {
        StartFunction('HiveManager.Init');
        this.ManagerData = MemoryManager.LoadData(MemoryId);

        for (let name in this.ManagerData['Hives']) {
            let room = Game.rooms[name];
            room.Brain = this.ManagerData['Hives'][name];
            room.Init();
            this.ManagerData['Hives'][name] = room.Brain;
        }

        EndFunction();
        return OK;
    },
    Complete: function () {
        StartFunction('HiveManager.Complete');

        for (let name in this.ManagerData['Hives']) {
            let room = Game.rooms[name];
            room.Complete();
            this.ManagerData['Hives'][name] = room.Brain;
        }

        MemoryManager.SaveData(MemoryId, this.ManagerData);
        EndFunction();
        return OK;
    },

    ActivateHives: function () {
        StartFunction('HiveManager.ActivateHives');
        let result = OK;

        for (let name in this.ManagerData['Hives']) {
            result = Game.rooms[name].Activate();
            if (result != OK) {
                console.log(name + ' has failed with code: ' + result);
                break;
            }
        }

        EndFunction();
        return result;
    },

    AddNewHive: function (hive) {
        StartFunction('HiveManager.AddNewHive');
        let result = OK;

        if (!this.ManagerData['Hives'][hive.name]) {
            hive.Brain = {};
            result = hive.InitMemory();
            if (result == OK) {
                this.ManagerData['Hives'][hive.name] = hive.Brain;
            }
        }

        EndFunction();
        return result;
    },
};

module.exports = HiveManager;