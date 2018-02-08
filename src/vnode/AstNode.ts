import { AstNodeType } from "./AstNodeType";

export class AstNode {
    private _type: AstNodeType;
    private _next: AstNode;
    private _prev: AstNode;
    private _parent: AstNode;
    private _startIndex: number;
    private _endIndex: number;

    public get type(): AstNodeType {
        return this._type;
    }

    public set type(value: AstNodeType) {
        this._type = value;
    }

    public get next(): AstNode {
        return this._next;
    }

    public set next(value: AstNode) {
        this._next = value;
    }

    public get prev(): AstNode {
        return this._prev;
    }

    public set prev(value: AstNode) {
        this._prev = value;
    }

    public get parent(): AstNode {
        return this._parent;
    }

    public set parent(value: AstNode) {
        this._parent = value;
    }

    public get startIndex(): number {
        return this._startIndex;
    }

    public set startIndex(value: number) {
        this._startIndex = value;
    }

    public get endIndex(): number {
        return this._endIndex;
    }

    public set endIndex(value: number) {
        this._endIndex = value;
    }
}
