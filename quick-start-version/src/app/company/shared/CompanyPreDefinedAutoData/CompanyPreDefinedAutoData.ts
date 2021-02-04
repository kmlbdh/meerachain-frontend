export class CompanyPreDefinedAutoData{
    originId: any;
    preDefinedAutoData: any;
    companyId: any;
    company: any;
    tupleType: any;
    name:string;
    constructor(init?: Partial<CompanyPreDefinedAutoData>) {
        Object.assign(this, init);
    }
}