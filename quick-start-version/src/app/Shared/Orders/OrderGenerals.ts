export class OrderGenerals {
    orderId: any;
    order: any;
    orderRefrence: any;
    originOfGoods: any;
    exportCountryId: any;
    exportCountry: any;
    paymentTerms: any;
    readyDate: any;
    orderIsUrgent: any;
    transshipmentAllowed: any;
    netWeight: any;
    totalWeight: any;
    numberOfPackages: any;
    cubicVolume: any;
    destinationPortId: any;
    destinationPort: any;
    dischargePortId: any;
    dischargePort: any;
    warehousesId: any;
    warehouses: any;
    constructor(init?: Partial<OrderGenerals>) {
        Object.assign(this, init);
    }
}