import { AstNode } from "./AstNode";
import { AstNodeType } from "./AstNodeType";

export class AstTag extends AstNode {
    private _name: string;
    private _attrs?: {[name: string]: string};
    private _children?: AstNode[];

    public constructor() {
        super();
        this.type = AstNodeType.TAG;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get attrs(): { [p: string]: string } {
        return this._attrs;
    }

    public set attrs(value: { [p: string]: string }) {
        this._attrs = value;
    }

    public get children(): AstNode[] {
        return this._children;
    }

    public set children(value: AstNode[]) {
        this._children = value;
    }
}
