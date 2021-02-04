import { RegisterModule } from '../Authentication/RegisterModule';
import { PreDefinedAutoDataModel } from '../PreDefinedAutoData/PreDefinedAutoDataModel';

export class InlandShipperAuth {
    InlandShipperId: any;
    inlandShipper: RegisterModule;
    scanningRate: any;
    dangerousRate: any;
    currencyId: any;
    currency: PreDefinedAutoDataModel;
    note: any;
    contractDate:any;


    constructor(init?: Partial<InlandShipperAuth>) {
        Object.assign(this, init);
    }
}
