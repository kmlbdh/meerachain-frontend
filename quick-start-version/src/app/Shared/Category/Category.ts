import { RegisterModule } from '../Authentication/RegisterModule';

export class Category {
    id: number;
    companyId: string;
    company: RegisterModule;
    name: string;
    description: string;
    CreateDate: Date;
}