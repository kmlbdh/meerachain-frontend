export class OrderContainers {
    id:any;
    orderId: any;
    order: any;
    containerNumber: any;
    customsAgentId: any;
    customsAgent: any;
    containerTypeId: any;
    containerType: any;
    delayedContainersDays: any;
    sealNumber: any;
    netWeight: any;
    totalWeight: any;
    goodsDescription: any;
    goodDangerous: any;
    actualArrival: any;
    exitDate: any;
    arrivalDateToCompany: any;
    arrivalTruckNumber: any;
    arrivalHourToCompany: any;
    supervisorGaurd: any;
    returnedDateToPort: any;
    isScanned: any;
    isCleared: any;
    scanningHour: any;
    scanByText: any;
    warehousesId:any;
    warehouses:any;
    inlandShipperId :any;
    inlandShipper :any;
    forwarderId:any;
    actualRate:any;
    truckPaymentId:any;
    constructor(init?: Partial<OrderContainers>) {
        Object.assign(this, init);
    }
}