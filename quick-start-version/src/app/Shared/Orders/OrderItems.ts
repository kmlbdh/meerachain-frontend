export class OrderItems {
    id: any;
    orderId: any;
    order: any;
    itemId:any;
    name: any;
    quantity: any;
    unitId: any;
    unit: any;
    price: any;
    currencyId: any;
    currency: any;
    note: any;
    totalPrice: any;
    constructor(init?: Partial<OrderItems>) {
        Object.assign(this, init);
    }
}