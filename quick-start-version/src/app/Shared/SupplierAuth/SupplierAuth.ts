import { RegisterModule } from '../Authentication/RegisterModule';
import { PreDefinedAutoDataModel } from '../PreDefinedAutoData/PreDefinedAutoDataModel';
import { PreDefinedAutoDataService } from '../PreDefinedAutoData/pre-defined-auto-data.service';
import { ShippingType } from '../Enums/ShippingType';

export class SupplierAuth {
    supId: any;
    suplier: RegisterModule;
    containerTypeId: any;
    containerType: PreDefinedAutoDataModel;
    shippingType: ShippingType;
    incotermsId: any;
    incoterms: PreDefinedAutoDataModel;
    preparationDays: any;
    currencyId: any;
    currency: PreDefinedAutoDataModel;
    goodsDescription: any;
    portId: any;
    port: PreDefinedAutoDataModel;
    lstItemsIds:Array<number>;
    constructor(init?: Partial<SupplierAuth>) {
        Object.assign(this, init);
    }
}