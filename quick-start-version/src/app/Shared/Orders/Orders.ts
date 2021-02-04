export class Orders {
    id: any;
    supplierId: any;
    suplier: any;
    numberOfContainers: any;
    loadingPortId: any;
    loadingPort: any;
    shippmentType: any;
    orderCreationDate: any;
    containerTypeId: any;
    containerType: any;
    currencyId: any;
    currency: any;
    shippingType: any;
    orderDescription: any;
    incotermsId: any;
    incoterms: any;
    arrivalDateToPort: any;
    totalPriceItems: any;
    totalQuantityItems: any;
    companyId: any;
    company: any;
    userCreatorId: any;
    userCreator: any;
    orderStatus: any;
    CreateDate: any;
    orderItems: [];
    orderContainers: [];
    orderGenerals: any;
    orderCustoms: any;
    orderShippings: any;
    isCleared:any;
    is_deleted:any;
    constructor(init?: Partial<Orders>) {
        Object.assign(this, init);
    }
}