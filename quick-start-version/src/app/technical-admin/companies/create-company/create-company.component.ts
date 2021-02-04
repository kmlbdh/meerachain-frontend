import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { AuthserverService } from 'src/app/Shared/Authentication/authserver.service';
import { RegisterModule } from 'src/app/Shared/Authentication/RegisterModule';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';
import { SubType } from 'src/app/Shared/Enums/SubType';
import { SystemApiKeys } from 'src/app/Shared/Enums/SystemApiKeys';
import { CompanyAccountsCreationLimitation } from 'src/app/Shared/CompanyAccountsCreationLimitation/CompanyAccountsCreationLimitationModel';
import { UserType } from 'src/app/Shared/Enums/UserType';

export class FormInput {
  email: any;
  password: any;
  confirmPassword: any;
  requiredInput: any;
  url: any;
  phone: any;
  cmbGear: any;
  address: any;
  file: any;
  switcher: any;
}
@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.scss']
})
export class CreateCompanyComponent implements OnInit {

  infoForm: FormGroup;
  infoForm1: FormGroup;
  PGHead;
  formInput: FormInput;
  form: any;
  cardLoad = false;
  public isSubmit: boolean;
  public isSubmit1: boolean;
  frmType; idEdit;
  constructor(private fbuilder: FormBuilder, private _router: Router, private route: ActivatedRoute, private authserverService: AuthserverService, private thirdPartytoastyService: ThirdPartytoastyService) {

    this.route.queryParams
      .subscribe(params => {
        console.log(params.new);
        this.frmType = params.t
         if (this.frmType == 'e') {
          this.PrepareForm({});
          this.isSubmit = false;
          this.isSubmit1 = false;
          this.cardLoad = true;
          this.authserverService.getsingleuserbyid(params.i, SystemApiKeys.TechnicalAdmin_AddCompany).subscribe((z: any) => {
            console.log(z,"z");
            this.idEdit = params.i;
            z.password = "fake01";
            z.ConPassword = "fake01";
            this.PrepareForm(z);
            this.cardLoad = false;
          })
          this.PGHead = "Edit Company";
        } else {
            this.PrepareForm({});
            this.isSubmit = false;
            this.isSubmit1 = false;
            this.PGHead = "Create New Company"
            let z = new RegisterModule;
            z.userType = params.ut;
            // this.PrepareForm(z);
        }
      });
  }

  ngOnInit() {
  }
  PrepareForm(userinfo) {
    this.infoForm = this.fbuilder.group({
      "contactNumber": [userinfo.contactNumber, Validators.compose([])],
      "englishName": [userinfo.englishName, Validators.compose([Validators.required, Validators.minLength(3)])],
      "website": [userinfo.website, Validators.compose([])],
      "telephoneNumber": [userinfo.telephoneNumber, Validators.compose([])],
      "otherTelephoneNumber": [userinfo.otherTelephoneNumber, Validators.compose([])],
      "localName": [userinfo.localName, Validators.compose([Validators.minLength(3)])], 
      "address": [userinfo.address, Validators.compose([])],
      "taxNumber": [userinfo.taxNumber, Validators.compose([])],
      "email": [userinfo.email, Validators.compose([])],
      "faxNumber": [userinfo.faxNumber, Validators.compose([])],
      "contactPerson": [userinfo.contactPerson, Validators.compose([])],
      "bankDetails": [userinfo.bankDetails, Validators.compose([])],//RichText
      "note": [userinfo.note, Validators.compose([])],//RichText
      "lstCompAccLimits": [0],//Sys
      "userType": [userinfo.userType],//Sys
      // "AuthType": [userinfo.AuthType, Validators.compose([Validators.required, Validators.minLength(3)])],
    });
    let TFcreate = typeof userinfo.lstCompAccLimits == 'undefined';
    let TFlstCompAccLimits = userinfo.lstCompAccLimits == null;
    console.log("!TFcreate", !TFcreate);
    
    this.infoForm1 = this.fbuilder.group({
      "userName": [userinfo.userName, Validators.compose([Validators.required, Validators.minLength(3)])],
      "password": [userinfo.password, Validators.compose([Validators.required, Validators.minLength(3)])],
      "Supplier": [!TFcreate && !TFlstCompAccLimits && typeof userinfo.lstCompAccLimits.find(z => z.subType == SubType['Supplier']) != 'undefined' ? userinfo.lstCompAccLimits.find(z => z.subType == SubType.Supplier).limitTo : ''],
      "Forwarder": [!TFcreate && !TFlstCompAccLimits && typeof userinfo.lstCompAccLimits.find(z => z.subType == SubType['Forwarder']) != 'undefined' ? userinfo.lstCompAccLimits.find(z => z.subType == SubType.Forwarder).limitTo : ''],
      "InlandShipper": [!TFcreate && !TFlstCompAccLimits && typeof userinfo.lstCompAccLimits.find(z => z.subType == SubType['Inland Shipper']) != 'undefined' ? userinfo.lstCompAccLimits.find(z => z.subType == SubType['Inland Shipper']).limitTo : ''],
      "CustomAgent": [!TFcreate && !TFlstCompAccLimits && typeof userinfo.lstCompAccLimits.find(z => z.subType == SubType['Custom Agent']) != 'undefined' ? userinfo.lstCompAccLimits.find(z => z.subType == SubType['Custom Agent']).limitTo : ''],
      "Employee": [!TFcreate && !TFlstCompAccLimits && typeof userinfo.lstCompAccLimits.find(z => z.subType == SubType['Employee']) != 'undefined' ? userinfo.lstCompAccLimits.find(z => z.subType == SubType.Employee).limitTo : ''],

      "TFSupplier": [!TFcreate && !TFlstCompAccLimits && typeof userinfo.lstCompAccLimits.find(z => z.subType == SubType['Supplier']) != 'undefined'],
      "TFForwarder": [!TFcreate && !TFlstCompAccLimits && typeof userinfo.lstCompAccLimits.find(z => z.subType == SubType['Forwarder']) != 'undefined'],
      "TFInlandShipper": [!TFcreate && !TFlstCompAccLimits && typeof userinfo.lstCompAccLimits.find(z => z.subType == SubType['Inland Shipper']) != 'undefined'],
      "TFCustomAgent": [!TFcreate && !TFlstCompAccLimits && typeof userinfo.lstCompAccLimits.find(z => z.subType == SubType['Custom Agent']) != 'undefined'],
      "TFEmployee": [!TFcreate && !TFlstCompAccLimits && typeof userinfo.lstCompAccLimits.find(z => z.subType == SubType['Employee']) != 'undefined'],

      //currentCounter
      "cCSupplier": [!TFcreate && !TFlstCompAccLimits && typeof userinfo.lstCompAccLimits.find(z => z.subType == SubType['Supplier']) != 'undefined' ? userinfo.lstCompAccLimits.find(z => z.subType == SubType['Supplier']).currentCounter : 0],
      "cCForwarder": [!TFcreate && !TFlstCompAccLimits && typeof userinfo.lstCompAccLimits.find(z => z.subType == SubType['Forwarder']) != 'undefined' ? userinfo.lstCompAccLimits.find(z => z.subType == SubType['Forwarder']).currentCounter : 0],
      "cCInlandShipper": [!TFcreate && !TFlstCompAccLimits && typeof userinfo.lstCompAccLimits.find(z => z.subType == SubType['Inland Shipper']) != 'undefined' ? userinfo.lstCompAccLimits.find(z => z.subType == SubType['Inland Shipper']).currentCounter : 0],
      "cCCustomAgent": [!TFcreate && !TFlstCompAccLimits && typeof userinfo.lstCompAccLimits.find(z => z.subType == SubType['Custom Agent']) != 'undefined' ? userinfo.lstCompAccLimits.find(z => z.subType == SubType['Custom Agent']).currentCounter : 0],
      "cCEmployee": [!TFcreate && !TFlstCompAccLimits && typeof userinfo.lstCompAccLimits.find(z => z.subType == SubType['Employee']) != 'undefined' ? userinfo.lstCompAccLimits.find(z => z.subType == SubType['Employee']).currentCounter : 0],
    });

    this.infoForm1.addControl('ConPassword', new FormControl(userinfo.password, Validators.compose([Validators.required, Validators.minLength(3), CustomValidators.equalTo(this.frmC1.password)])))
  }
  get frmC() {
    return this.infoForm.controls;
  }
  get frmC1() {
    return this.infoForm1.controls;
  }
  prepareCompanyLimitation(registerModel:RegisterModule){
    registerModel.lstCompAccLimits = [];
    if(this.frmC1.TFSupplier.value == true){
      registerModel.lstCompAccLimits.push(new CompanyAccountsCreationLimitation({subType:SubType['Supplier'],limitTo:this.frmC1.Supplier.value,currentCounter:this.frmC1.cCSupplier.value}));
    }
    if(this.frmC1.TFForwarder.value == true){
      registerModel.lstCompAccLimits.push(new CompanyAccountsCreationLimitation({subType:SubType['Forwarder'],limitTo:this.frmC1.Forwarder.value,currentCounter:this.frmC1.cCForwarder.value}));
    }
    if(this.frmC1.TFInlandShipper.value == true){
      registerModel.lstCompAccLimits.push(new CompanyAccountsCreationLimitation({subType:SubType['Inland Shipper'],limitTo:this.frmC1.InlandShipper.value,currentCounter:this.frmC1.cCInlandShipper.value}));
    }
    if(this.frmC1.TFCustomAgent.value == true){
      registerModel.lstCompAccLimits.push(new CompanyAccountsCreationLimitation({subType:SubType['Custom Agent'],limitTo:this.frmC1.CustomAgent.value,currentCounter:this.frmC1.cCCustomAgent.value}));
    }
    if(this.frmC1.TFEmployee.value == true){
      registerModel.lstCompAccLimits.push(new CompanyAccountsCreationLimitation({subType:SubType['Employee'],limitTo:this.frmC1.Employee.value,currentCounter:this.frmC1.cCEmployee.value}));
    }
    return registerModel;

  }
  saveEdit() {
    var registerModel:RegisterModule = new RegisterModule({ ...this.infoForm.value, ...this.infoForm1.value, id: this.idEdit });

    console.log("registerModel",this.prepareCompanyLimitation(registerModel));
    this.cardLoad = true;
    this.thirdPartytoastyService.addToast({ title: 'Process', msg: 'Please wait...', timeout: 5000, closeOther: true, type: 'wait' })
    this.authserverService.updateuserinfo(this.prepareCompanyLimitation(registerModel))
      .subscribe((z:any) => {
        this._router.navigate(['./technicaladmin/companies/cu'], {
          queryParams: { t: 'e', i: this.idEdit }
        });
        z.password = "fake01";
        z.ConPassword = "fake01";
        this.PrepareForm(z);

        this.thirdPartytoastyService.addToast({ title: 'Edited success', msg: '', timeout: 3000, closeOther: true, type: 'success' })
        this.cardLoad = false;
      }, e => {
        this.thirdPartytoastyService.addToast({ title: 'Process faild', msg: '', timeout: 3000, closeOther: true, type: 'error' })
        this.cardLoad = false;

      })
  }
  save() {
    var registerModel:RegisterModule = new RegisterModule({ ...this.infoForm.value, ...this.infoForm1.value, });

    this.cardLoad = true;
    this.thirdPartytoastyService.addToast({ title: 'Process', msg: 'Please wait...', timeout: 5000, closeOther: true, type: 'wait' })
    console.log("registerModel",this.prepareCompanyLimitation(registerModel));
    this.authserverService.RegisterUser(this.prepareCompanyLimitation(registerModel))
      .subscribe(z => {
        this._router.navigate(['/technicaladmin/companies']);
        this.thirdPartytoastyService.addToast({ title: 'Added success', msg: '', timeout: 3000, closeOther: true, type: 'success' })
        this.cardLoad = false;
        this.infoForm.reset();
        this.infoForm1.reset();
      }, e => {
        console.log(e);
        this.thirdPartytoastyService.addToast({ title: 'Process faild', msg: '', timeout: 3000, closeOther: true, type: 'error' })
        this.cardLoad = false;

      })
  }

}
