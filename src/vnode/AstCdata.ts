import { AstData } from "./AstData";
import { AstNodeType } from "./AstNodeType";

export class AstCdata extends AstData {
    public constructor(data: string) {
        super(data);
        this.type = AstNodeType.CDATA;
    }
}
