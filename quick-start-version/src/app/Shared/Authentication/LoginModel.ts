export class LoginModel {
    UserName: any;
    Password: any;
    constructor(init?: Partial<LoginModel>) {
        Object.assign(this, init);
    }
}   