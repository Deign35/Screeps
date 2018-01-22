class IDisposable {
    constructor() { }
    dispose(): void { }
}

function using<T extends IDisposable>(resource: T, func: (resource: T) => void) {
    try {
        func(resource);
    } finally {
        resource.dispose();
    }
}

global['IDisposable'] = IDisposable;
global['using'] = using;