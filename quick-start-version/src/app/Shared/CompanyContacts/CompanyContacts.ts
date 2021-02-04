import { SubType } from '../Enums/SubType';

export class CompanyContacts {
    companyId: any;
    company: any;
    authId: any;
    auth: any;
    subType: SubType;

    constructor(init?: Partial<CompanyContacts>) {
        Object.assign(this, init);
    }
}