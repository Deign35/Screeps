const Enums = {
    Managers_Enum: {
        HiveManager: 'HiveManager',
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
        Move: 'MV',
        Next: 'NX',
        CancelCommands: 'XX',
        Retry: 'RE',
        Continue: 'CN',
        Reset: 'RS',

        CheckPosition: 'CP',
        ReqTarget: 'RT',
        Complete: 'CM',
    },

    CreepTargetType_Enum: {
        FixedTarget: 'FT1',
        TargetList: 'TL',
        Callback: 'CB',
        NearestStructure: 'NS',
        Find: 'FD',
    },

    TaskResults_Enum: {
        Complete: 'CM',
        ContractorRequired: 'CR',
        Incomplete: 'IN',
        Retry: 'RT',
    },

    ActionArgs_Enum: {
        Action: 'AC',
        ArgsList: 'AL',
        Responses: 'RE',
        ResourceType: 'RT',
        TargetArg: 'TA',
        TargetType: 'TT',
    },

    CallbackType_Enum: {
        GameObject: 'GO',
        Room: 'RM',
    },

    CreepBodyType_Enum: {
        AllPurpose: 'AP',
        Worker: 'WR',
    },

    TaskArgs_Enum: {
        ActionList: 'AL',
        ActionResponses: 'AR',
        AnchorPos: 'AP',
        Body: 'BO',
        FixedTargets: 'FT',
        MaxDist: 'MD',
        Memory: 'ME',
        MinDist: 'mD',
        Resource: 'RE',
        Size: 'SZ',
        TaskId: 'TI',
        TaskProfile: 'TP',
    },

    TaskMemory_Enum: {
        ActionIndex: 'AI',
        CommandIndex: 'CI',
        RetryCount: 'RC',
        Slave: 'SV',
        TargetId: 'TI',
        TargetList: 'TL',
        TargetPos: 'TP',
    },

    TaskProfile_Enum: {
        Default: 'DE',
        PrimeHarvester: 'PH',
        Sweeper: 'SW',
        Transporter: 'TR',
        Upgrader: 'UP',
    },

    TaskExecutionResult_Enum: {
        ActionResult: 'actionResult',
        Target: 'target',
    },

    // Offensive Unit names: Stinger, Roach, Wasp, Devourer, 
};

for (let enumType in Enums) {
    global[enumType] = Object.freeze(Enums[enumType]);
}