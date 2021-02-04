export class OrderCustoms {
    orderId: any;
    order: any;
    customsAgentId: any;
    customsAgent: any;
    documentReceived: any;
    documentApproved: any;
    customsFileOpeningDate: any;
    customsFileNumber: any;
    agentPaymentDate: any;
    localCrossingId: any;
    localCrossing: any;
    inlandShipperId: any;
    inlandShipper: any;
    customesDeclarationNumber: any;
    customsPaymentDate: any;
    isCleared: any;
    isScanned:any;
    constructor(init?: Partial<OrderCustoms>) {
        Object.assign(this, init);
    }
}