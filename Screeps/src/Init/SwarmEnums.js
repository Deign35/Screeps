const Enums = {
    Managers_Enum: {
        MemoryManager: 'MemoryManager', // Must be first
        HiveManager: 'HiveManager', // Must be before CreepManager (let's replace this) //Unconfirmed, but should be ok to move around now.
        StructureManager: 'StructureManager',
        CreepManager: 'CreepManager',
    },

    CreepCommand_Enum: {
        // Basic Commands
        Attack: 'attack',
        Build: 'build',
        Dismantle: 'dismantle',
        Drop: 'drop',
        Harvest: 'harvest',
        Heal: 'heal',
        Pickup: 'pickup',
        RangedAttack: 'rangedAttack',
        RangedHeal: 'rangedHeal',
        Repair: 'repair',
        Say: 'say',
        Suicide: 'suicide',
        Transfer: 'transfer',
        Upgrade: 'upgradeController',
        Withdraw: 'withdraw',

        // Advanced Commands
        ReqTransfer: 'reqTransfer',
        Deliver: 'deliver',
        WaitAt: 'waitAt',
        /*FindWithdraw: 'findWithdraw',
        FindTransfer: 'findTransfer',*/
    },

    CreepCommandResponse_Enum: {
        Move: 'MOVE',
        Next: 'NEXT',
        CancelCommands: 'CANCEL',
        Retry: 'RETRY',
        Continue: 'CONTINUE',

        RequireTarget: 'REQUIRE_TARGET',
        RequireResources: 'REQUIRE_RESOURCES',
        Custom: 'CUSTOM',
        Complete: 'COMPLETE',
    },

    ContractResults_Enum: {
        Complete: 'COMPLETE',
        Incomplete: 'INCOMPLETE',
        ContractorRequired: 'CONTRACTOR',
    },

    CallbackType_Enum: {
        Id: 'ID',
        GameObject: 'GAMEOBJECT',
        Room: 'ROOM',
    },

    CreepBodyType_Enum: {
        Worker: 'WORKER',
        AllPurpose: 'ALLPURPOSE',
    },

    TaskArgs_Enum: {
        ActionList: 'actionList',
        AnchorPos: 'anchorPos',
        Memory: 'memory',
        FixedTargets: 'fixedTargets',
        TaskId: 'taskId',
        Body: 'body',
        MaxDist: 'maxDist',
        MinDist: 'minDist',
        Size: 'size',
        Resource: 'resource',
        TaskProfile: 'taskProfile',
    },
    TaskMemory_Enum: {
        ActionIndex: 'actionIndex',
        RetryCount: 'retryCount',
    },
    TaskProfile_Enum: {
        Default: 'default',
        PrimeHarvester: 'primeHarvester',
        Transporter: 'transporter',
        Upgrader: 'upgrader',
        Sweeper: 'sweeper',
    },

    /*
    CreepJob_Enum: {
        Worker: 'worker',
        Harvester: 'harvester',
        Carrier: 'carrier',
        AllPurpose: 'allPurpose',
        Repairer: 'repairer',

        // War jobs
        Guard: 'guard',
        Archer: 'archer',
        Healer: 'healer',
        WarCarrier: 'warCarrier',
    },*/
};

for (let enumType in Enums) {
    global[enumType] = Object.freeze(Enums[enumType]);
}