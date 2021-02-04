export class TruckPayment {
    truckPaymentId:any;
    inlandShipperId:any;
    note:any;
    paymentDate:any;
    totalRate:any;
    companyId:any;
    currencyId:any;

    constructor(init?: Partial<TruckPayment>) {
        Object.assign(this, init);
    }
} 