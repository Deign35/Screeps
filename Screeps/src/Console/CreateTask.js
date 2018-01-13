const CreateTask = {};

CreateTask['ByProfile'] = function (profile, room) {
    TaskProfiles.CreateTaskFromConsole(profile, room);
}

module.exports = CreateTask;