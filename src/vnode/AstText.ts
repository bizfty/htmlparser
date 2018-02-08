import { AstData } from "./AstData";
import { AstNodeType } from "./AstNodeType";

export class AstText extends AstData {
    public constructor() {
        super();
        this.type = AstNodeType.TEXT;
    }
}
