export class OrderShippings {
    orderId: any;
    order: any;
    orderShippingsStatus: any;
    shippingCompanyRefrence: any;
    openingShippingOrderDate: any;
    shippingDate: any;
    forwarderId: any;
    forwarder: any;
    shippingLine: any;
    foreignAgent: any;
    delayedContainerDays: any;
    bOLNo: any;
    vessel: any;
    shippingPrice: any;
    craneFees: any;
    deliveryCost: any;
    isDirectShipping: any;
    departureDate: any;
    
    constructor(init?: Partial<OrderShippings>) {
        Object.assign(this, init);
    }
}