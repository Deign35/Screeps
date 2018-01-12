if (Consts.DEBUG_MODE) {
    global['Debug'] = require('Init_Debug');
} else {
    global['Debug'] = {
        CallStack: {
            OutputStackTrace: function () { return OK; }, Push: function () { return OK; }, Pop: function () { return OK; }, Clear: function () { return OK; },
        }
    }
}// Debug must be set first.

require('Init_GlobalFunctions');
global['Overmind'] = require('Init_Overmind');
global['ActionTemplates'] = require('Tasks_ActionTemplates');
global['TaskProfiles'] = require('Tasks_TaskProfiles');

for (let ManagerNameId in Managers_Enum) {
    global[Managers_Enum[ManagerNameId]] = require('Managers_' + Managers_Enum[ManagerNameId]);
}