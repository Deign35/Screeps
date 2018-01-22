export class IDisposable {
    dispose(): void { }
}

export class Cache extends IDisposable {
    readonly memId: string;
    constructor (id: string) {
        super();
        this.memId = id;
        this.Load();
    }
    Load(): void {

    }
    Save(): void {

    }
}