import { RegisterModule } from '../Authentication/RegisterModule';

export class Warehouses {
    id: number;
    companyId: string;
    company: RegisterModule;
    name: string;
    description: string;
    userCreatorId: string;
    userCreator: RegisterModule;
    CreateDate: Date;
}