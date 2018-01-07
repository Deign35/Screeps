class HiveMind { // Controls the different jobs needed around a given Hive(room)
    constructor(roomName, taskMemory) {
        this.TaskMemory = taskMemory;
        this.name = 'HiveMind[' + roomName + ']';
        this.PendingTasks = [];
        this.PendingRequests = [];
    }

    PostNewTask(task) {
        const id = task.taskArgs[TaskArgs_Enum.TaskId];
        StartFunction(this.name + '.PostNewTask: ' + id);

        if (this.TaskMemory[id]) {
            console.log('Task being reissued... Is this desired?');
            Memory.DebugData[this.name] = task;
        } else {
            this.TaskMemory[id] = task.ToData();
            this.PendingTasks.push(id);
        }

        EndFunction();
        return OK;
    }

    RequestTask(delegate) {
        this.PendingRequests.push(delegate);
    }

    UpdateTasks() {
        /* Valid TaskResults:
            Continue,
            Retry,
            Done,
            Reassign,

        for(task in tasks)
            do{
                result = task.Evalute()
            } while(result == Retry);

            if(result == Continue) { continue; }
            if(result == Done) { delete this.TaskMemory[task.id] }
            if(result == Reassign) { PendingTasks.push(task.id); }
        */
        /*
        StartFunction(this.name + '.UpdateTasks()');
        for (const id in this.TaskMemory) {
            let task = Task.FromData(this.TaskMemory[id]);
            let result = this.EvaluateTask(task);
            this.TaskMemory[id] = task.ToData();
            if (result == TaskResults_Enum.Incomplete) {
                // Do nothing
                continue;
            } else if (result == TaskResults_Enum.Complete) {
                // What else needs to be done here?
                delete this.TaskMemory[id];
            } else if (result == TaskResults_Enum.ContractorRequired) {
                this.PendingTasks.push(this.TaskMemory[id]);
            }
        }
        EndFunction();*/
    }

    EvaluateTask(task) {
        return task.Evaluate();
    }

    ResolvePendingTasks() {
        StartFunction(this.name + '.ResolvePendingTasks()');
        while (this.PendingTasks.length > 0 && this.PendingRequests.length > 0) {
            const task = Task.FromData(this.TaskMemory[this.PendingTasks.shift()]);
            // TODO: Find a way to pick the best option instead of just first to go.
            const delegate = this.PendingRequests.shift();
            delegate.Callback(task);
            this.TaskMemory[task.taskId] = task.ToData();
        }
        EndFunction();
        return OK;
    }
}
HiveMind.CreateTaskFromProfile = require('Tasks_TaskProfiles');

module.exports = HiveMind;