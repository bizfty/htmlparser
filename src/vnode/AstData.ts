import { AstNode } from "./AstNode";

export class AstData extends AstNode {
    private _data: string;
    public constructor(data: string) {
        super();
        this._data = data;
    }
    public get data(): string {
        return this._data;
    }

    public set data(value: string) {
        this._data = value;
    }
}
