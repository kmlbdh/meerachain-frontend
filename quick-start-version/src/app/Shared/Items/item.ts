export class Item {
    id: any;
    englishName: any;
    arabicName: any;
    hebrewName: any;
    unitId: any;
    unit: any;
    hScode: any;
    customsRate: any;
    CreateDate: any;
    categoryId: any;
    category: any;
    companyId: any;
    company: any;
    lstSuppliers: any;
    constructor(init?: Partial<Item>) {
        Object.assign(this, init);
    }
}