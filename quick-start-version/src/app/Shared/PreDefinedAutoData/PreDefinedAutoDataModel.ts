export class PreDefinedAutoDataModel {
    id: any;
    name: any;
    description: any;
    tupleType: any;
    
    constructor(init?: Partial<PreDefinedAutoDataModel>) {
        Object.assign(this, init);
    }
}