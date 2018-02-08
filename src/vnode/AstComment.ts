import { AstData } from "./AstData";
import { AstNodeType } from "./AstNodeType";

export class AstComment extends AstData {
    public constructor() {
        super();
        this.type = AstNodeType.COMMENT;
    }
}
