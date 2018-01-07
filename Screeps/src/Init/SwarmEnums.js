const Enums = {
    Managers_Enum: {
        HiveManager: 'HiveManager',
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

    TaskResults_Enum: {
        Complete: 'COMPLETE',
        ContractorRequired: 'CONTRACTOR',
        Incomplete: 'INCOMPLETE',
        NextCommand: 'NEXT',
    },

    CallbackType_Enum: {
        GameObject: 'GAMEOBJECT',
        Id: 'ID',
        Room: 'ROOM',
    },

    CreepBodyType_Enum: {
        AllPurpose: 'ALLPURPOSE',
        Worker: 'WORKER',
    },

    TaskArgs_Enum: {
        ActionList: 'actionList',
        AnchorPos: 'anchorPos',
        Body: 'body',
        FixedTargets: 'fixedTargets',
        MaxDist: 'maxDist',
        Memory: 'memory',
        MinDist: 'minDist',
        Resource: 'resource',
        Size: 'size',
        TaskId: 'taskId',
        TaskProfile: 'taskProfile',
    },
    TaskMemory_Enum: {
        ActionIndex: 'actionIndex',
        RetryCount: 'retryCount',
    },
    TaskProfile_Enum: {
        Default: 'default',
        PrimeHarvester: 'primeHarvester',
        Sweeper: 'sweeper',
        Transporter: 'transporter',
        Upgrader: 'upgrader',
    },
};

for (let enumType in Enums) {
    global[enumType] = Object.freeze(Enums[enumType]);
}