import { AstData } from "./AstData";
import { AstNodeType } from "./AstNodeType";

export class AstText extends AstData {
    public constructor(data: string) {
        super(data);
        this.type = AstNodeType.TEXT;
    }
}
