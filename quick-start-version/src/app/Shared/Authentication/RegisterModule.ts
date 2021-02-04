import { CompanyAccountsCreationLimitation } from '../CompanyAccountsCreationLimitation/CompanyAccountsCreationLimitationModel';
import { InlandShipperAuth } from '../InlandShipperAuth/InlandShipperAuth';
import { SupplierAuth } from '../SupplierAuth/SupplierAuth';

export class RegisterModule {
    id: string;
    userName: any;
    password: any;
    contactNumber: any;
    englishName: any;
    website: any;
    telephoneNumber: any;
    otherTelephoneNumber: any;
    localName: any;
    address: any;
    taxNumber: any;
    email: any;
    faxNumber: any;
    contactPerson: any;
    bankDetails: any;
    note: any;
    userType: any;
    lstCompAccLimits:Array<CompanyAccountsCreationLimitation>;
    rolesName:Array<string>;
    supplierAuth:SupplierAuth;
    inlandShipperAuth:InlandShipperAuth;

    constructor(init?: Partial<RegisterModule>) {
        Object.assign(this, init);
    }
}