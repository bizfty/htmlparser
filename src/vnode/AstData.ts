import { AstNode } from "./AstNode";

export class AstData extends AstNode {
    private _data: string;

    public get data(): string {
        return this._data;
    }

    public set data(value: string) {
        this._data = value;
    }
}
