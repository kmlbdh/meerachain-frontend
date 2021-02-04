export class CompanyAccountsCreationLimitation {
    companyId: any;
    company: any;
    subType: any;
    limitTo: any;
    currentCounter: any;
    defaultDischargePortId: any;
    defaultDischargePort: any;
    constructor(init?: Partial<CompanyAccountsCreationLimitation>) {
        Object.assign(this, init);
    }
}

