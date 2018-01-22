export interface IError {
    readonly name: string;
    readonly message: string;
    readonly stack: string[];
};

export class AlreadyWrappedError implements IError {
    public readonly name: string = 'AlreadyWrappedError';
    constructor(public message: string, public stack: string[]) { }
}