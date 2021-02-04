import { Component, OnInit } from '@angular/core';
import { RegisterModule } from 'src/app/Shared/Authentication/RegisterModule';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormInput } from 'src/app/technical-admin/companies/create-company/create-company.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthserverService } from 'src/app/Shared/Authentication/authserver.service';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';
import { SystemApiKeys } from 'src/app/Shared/Enums/SystemApiKeys';
import { UserType } from 'src/app/Shared/Enums/UserType';
import { CustomValidators } from 'ng2-validation';
import { SubType } from 'src/app/Shared/Enums/SubType';
import { SupplierAuth } from 'src/app/Shared/SupplierAuth/SupplierAuth';
import { CompanyUsersManagerService } from 'src/app/Shared/CompanyUsersManager/company-users-manager.service';
import { TupleTypes } from 'src/app/Shared/Enums/TupleTypes';
import { CompanyPreDefinedAutoDataService } from '../CompanyPreDefinedAutoData/company-pre-defined-auto-data.service';
import { CompanyPreDefinedAutoData } from '../CompanyPreDefinedAutoData/CompanyPreDefinedAutoData';
import { ShippingType } from 'src/app/Shared/Enums/ShippingType';
import { InlandShipperAuth } from 'src/app/Shared/InlandShipperAuth/InlandShipperAuth';
import { DatePipe, formatDate } from '@angular/common';
import { OrdersService } from 'src/app/Shared/Orders/orders.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-contacts',
  templateUrl: './create-contacts.component.html',
  styleUrls: ['./create-contacts.component.scss']
})
export class CreateContactsComponent implements OnInit {
  Options = [];
  isEdit;
  tupleTypes;
  infoForm: FormGroup;
  infoForm1: FormGroup;
  infoForm2: FormGroup;


  PGHead;
  formInput: FormInput;
  form: any;
  cardLoad = false;
  public isSubmit: boolean;
  public isSubmit1: boolean;
  public isSubmit2: boolean;

  frmType; idEdit;
  subTypes = [];
  shippingTypes = [];
  loadItemsBelogToSupllierChange = false;
  containersForRate: any = [];
  lstWarehouses = [];

  constructor(private fbuilder: FormBuilder, private ordersService: OrdersService, private companyPreDefinedAutoDataService: CompanyPreDefinedAutoDataService,
    private _router: Router, private route: ActivatedRoute, private companyUsersManagerService: CompanyUsersManagerService,
    private thirdPartytoastyService: ThirdPartytoastyService, public datepipe: DatePipe) {
     this. containersForRate= [];
  
    this.tupleTypes = TupleTypes;
    this.route.queryParams
      .subscribe(params => {
        console.log(params.new);
        this.frmType = params.t
        if (this.frmType == 'e') {
          this.PrepareForm({});
          this.isSubmit = false;
          this.isSubmit1 = false;
          this.isSubmit2 = false;

          this.cardLoad = true;
          this.companyUsersManagerService.updateuser(params.i).subscribe((z: any) => {
            console.log("editObj", z);
            this.idEdit = params.i;
            z.contact.password = "fake011.!";
            z.contact.ConPassword = "fake011.!";
            z.contact.supplierAuth = z.supplierAuth;
            z.contact.inlandShipperAuth = z.inlandShipperAuth;
            if (z.contact.inlandShipperAuth) {
              let dFormat = 'yyyy-MM-dd';
              z.contact.inlandShipperAuth.contractDate = this.datepipe.transform(z.contact.inlandShipperAuth.contractDate, dFormat);
            }
            this.PrepareForm(z.contact);
            this.cardLoad = false;
            this.loadOptions(TupleTypes.Country, z.autoloadallcompanypredefined); /*TupleTypes.Country Just a dummy parameter Not required*/
          })
          this.PGHead = "Edit Contact";
        } else {
          this.PrepareForm({});
          this.isSubmit = false;
          this.isSubmit1 = false;
          this.isSubmit2 = false;

          this.PGHead = "Create New Contact"
          let z = new RegisterModule;
          z.userType = params.ut;
          // this.PrepareForm(z);
        }
      });

    this.PrepareTypes();
    this.PrepareShippingTypes();
    /*value: string;
        label: string;*/

  }
  lstCompaniesBasedTypes = {}
  loadCompanyBasedType() {
    if(this.infoForm.controls.subTypeRoles.value && this.infoForm.controls.subTypeRoles.value.length > 0){
      this.companyUsersManagerService.getLstCompaniesBasedType(this.infoForm.controls.subTypeRoles.value[0]).subscribe(z => {
        this.lstCompaniesBasedTypes[this.infoForm.controls.subTypeRoles.value[0]] = z
      })
    }
  }
  PrepareTypes() {
    this.subTypes = Object.keys(SubType).filter(key => !isNaN(Number(SubType[key])));
    var tmp = this.subTypes;
    this.subTypes = [];
    this.subTypes = tmp.map((z, i) => {
      return {
        value: i,
        label: z
      }
    })
  }
  PrepareShippingTypes() {
    this.shippingTypes = Object.keys(ShippingType).filter(key => !isNaN(Number(ShippingType[key])));
    var tmp = this.shippingTypes;
    this.shippingTypes = [];
    this.shippingTypes = tmp.map((z, i) => {
      return {
        value: i + "",
        label: z
      }
    })

  }
  ngOnInit() {
    this.ordersService.initOrderPage().subscribe((z: any) => {
      this.lstWarehouses = z.warehouses.map((itm) => {
        return {
          value: '' + itm.id,
          label: itm.name
        }
      });
    }
    )
  }

  PrepareForm(userinfo) {
    this.infoForm = this.fbuilder.group({
      "id": [userinfo.id, Validators.compose([])],
      "contactNumber": [userinfo.contactNumber, Validators.compose([Validators.required])],
      "englishName": [userinfo.englishName, Validators.compose([Validators.required, Validators.minLength(3)])],
      "website": [userinfo.website, Validators.compose([])],
      "telephoneNumber": [userinfo.telephoneNumber, Validators.compose([])],
      "otherTelephoneNumber": [userinfo.otherTelephoneNumber, Validators.compose([])],
      "localName": [userinfo.localName, Validators.compose([])],
      "address": [userinfo.address, Validators.compose([])],
      "taxNumber": [userinfo.taxNumber, Validators.compose([])],
      "email": [userinfo.email, Validators.compose([Validators.required])],
      "faxNumber": [userinfo.faxNumber, Validators.compose([])],
      "contactPerson": [userinfo.contactPerson, Validators.compose([])],
      "bankDetails": [userinfo.bankDetails, Validators.compose([])],//RichText
      "note": [userinfo.note, Validators.compose([])],
      "relatedAuthId": [userinfo.relatedAuthId, Validators.compose([])],
      "subTypeRoles": [userinfo.subTypeRoles, Validators.compose([Validators.required])],//Sys ??
      "userName": [Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)],//Sys ??
      "password": [Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '.' + 'A' + '123'],//Sys ??
    });
    this.subTypeRolesChanges(userinfo, this.frmC.subTypeRoles.value);
    this.infoForm.controls.subTypeRoles.valueChanges.subscribe((z: Array<number>) => {
      this.subTypeRolesChanges(userinfo, z);
        this.loadCompanyBasedType()
    });
    this.loadCompanyBasedType()

  }
  subTypeRolesChanges(userinfo, z: Array<number>) {
    // console.log(this.infoForm.controls.subTypeRoles, !this.frmC.subTypeRoles.valid && (this.frmC.subTypeRoles.dirty || this.frmC.subTypeRoles.touched || this.isSubmit));
    // console.log(z.find(i => i == SubType.Supplier), 'z.find(i => i == SubType.Supplier)');
    if (typeof z != 'undefined' && z != null && z.find(i => i == SubType.Supplier) == 0) {
      if (typeof userinfo.supplierAuth == 'undefined') userinfo.supplierAuth = new SupplierAuth();
      this.prepareSupplierForm(userinfo);
    } else {
      this.infoForm1 = undefined;
    }

    //for inlandshipper
    if (typeof z != 'undefined' && z != null && z.find(i => i == SubType["Inland Shipper"]) == 2) {
      if (typeof userinfo.inlandShipperAuth == 'undefined') userinfo.inlandShipperAuth = new InlandShipperAuth();
      this.prepareInlandShipperForm(userinfo);
    } else {
      this.infoForm2 = undefined;
    }
  }
  loadOptions(tupleTypes: TupleTypes, lsts?) {
    if (typeof this.Options[tupleTypes] == 'undefined') {
      this.cardLoad = true;
      this.refreshOptions(lsts);
    } else {
      this.cardLoad = false;
    }
  }
  refreshOptions(lsts?) {
    this.Options = [];
    if (typeof lsts == 'undefined' || lsts == null) {
      this.companyPreDefinedAutoDataService.loadallcompanypredefined(SystemApiKeys.Company_AddNewContacts_Supplier).subscribe((z: CompanyPreDefinedAutoData[]) => {
        console.log(z);
        z.forEach(itm => {
          if (typeof this.Options[itm.tupleType] == 'undefined') this.Options[itm.tupleType] = [];
          this.Options[itm.tupleType].push({
            value: '' + itm.originId,
            label: itm.name
          });
          this.cardLoad = false;
        });
        console.log('Options', this.Options);
      });
    } else {
      lsts.forEach(itm => {
        if (typeof this.Options[itm.tupleType] == 'undefined') this.Options[itm.tupleType] = [];
        this.Options[itm.tupleType].push({
          value: '' + itm.originId,
          label: itm.name
        });
        this.cardLoad = false;
      });
      this.Options[0] = [];
      console.log('Options', this.Options);
    }
  }
  prepareSupplierForm(userinfo) {
    console.log('userinfo', userinfo);
    this.infoForm1 = this.fbuilder.group({
      "supId": [userinfo.supplierAuth.supId, Validators.compose([])],
      "containerTypeId": [userinfo.supplierAuth.containerTypeId + "", Validators.compose([])],
      "shippingType": [userinfo.supplierAuth.shippingType + "", Validators.compose([])],
      "incotermsId": [userinfo.supplierAuth.incotermsId + "", Validators.compose([])],
      "preparationDays": [userinfo.supplierAuth.preparationDays, Validators.compose([])],
      "currencyId": [userinfo.supplierAuth.currencyId + "", Validators.compose([])],
      "goodsDescription": [userinfo.supplierAuth.goodsDescription, Validators.compose([])],
      "portId": [userinfo.supplierAuth.portId + "", Validators.compose([])],
      "lstItemsIds": [userinfo.lstItemsIds],
    });
  }
  prepareInlandShipperForm(userinfo) {
    console.log('userinfo', userinfo);
    this.infoForm2 = this.fbuilder.group({
      "InlandShipperId": [userinfo.inlandShipperAuth.InlandShipperId, Validators.compose([])],
      "scanningRate": [userinfo.inlandShipperAuth.scanningRate, Validators.compose([Validators.required])],
      "dangerousRate": [userinfo.inlandShipperAuth.dangerousRate, Validators.compose([Validators.required])],
      "note": [userinfo.inlandShipperAuth.note || "" + "", Validators.compose([])],
      "contractDate": [userinfo.inlandShipperAuth.contractDate || formatDate(new Date(), 'yyyy-MM-dd', 'en') + "", Validators.compose([])],
      "currencyId": [userinfo.inlandShipperAuth.currencyId+"", Validators.compose([Validators.required])],

    });
    this.prepareContainerRateForm(userinfo);
  }
  prepareContainerRateForm(userinfo) {
    if (userinfo.containersForRate) {
      console.log(userinfo.containersForRate);
        // this.containersForRate = userinfo.containersForRate;
         userinfo.containersForRate.forEach(element => {
          this.containersForRate.push({
            "warehouseId": element.warehouseId+"",
            "containerTypeId": element.containerTypeId+"",
            "dischargePortId":element.dischargePortId+"",
            "rate":element.rate,
          })

         });
    }
  }
 
  // addContainerRate() {
  //   this.containersForRate.push(this.infoForm3.value);
  //   console.log(this.containersForRate)
  // }
  // deleteContainerRate(index) {
  //   this.containersForRate.splice(index, 1);
  // }

 

  get frmC() {
    return this.infoForm.controls;
  }
  get frmC1() {
    return this.infoForm1.controls;
  }
  get frmC2() {
    return this.infoForm2.controls;
  }
 
  saveEdit() {
    var User = { ...this.infoForm.value };
    if (this.infoForm1 && this.infoForm2) {
      User = { ...this.infoForm.value, supplierAuth: this.infoForm1.value, inlandShipperAuth: this.infoForm2.value, containersForRate: this.containersForRate };
    }
    else if (this.infoForm1) {
      User = { ...this.infoForm.value, supplierAuth: this.infoForm1.value };
    }
    else if (this.infoForm2) {
      console.log(this.containersForRate)

      User = { ...this.infoForm.value, inlandShipperAuth: this.infoForm2.value, containersForRate: this.containersForRate };
    }
    this.cardLoad = true;
    this.thirdPartytoastyService.addToastDefault('wait');

    this.companyUsersManagerService.updateuserPost(User)
      .subscribe(z => {
        this._router.navigate(['./impostorcompany/contacts']);

        this.thirdPartytoastyService.addToastDefault('success', 'Edit');
        this.cardLoad = false;
        //this.infoForm.reset();
        //this.infoForm1.reset();
      }, e => {
        console.log(e);
        this.errorvalue = e.error;
        this.thirdPartytoastyService.addToastDefault('error')
        this.cardLoad = false;

      })
  }
  ItemsBelogToSupllierChange(val) {
    this.infoForm1.controls.lstItemsIds.setValue(val);
  }
  errorvalue;
  save() {

    this.infoForm.controls.userName.setValue(Math.random().toString(36).substring(2, 15) + this.infoForm.controls.englishName.value.substring(0, 2) + Math.random().toString(36).substring(2, 15));
    this.infoForm.controls.password.setValue(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '.' + 'A' + '123');

    this.loadItemsBelogToSupllierChange = true;
    console.log({ ...this.infoForm.value });
    var User = { ...this.infoForm.value };
    if (this.infoForm1 && this.infoForm2) {
      User = { ...this.infoForm.value, supplierAuth: this.infoForm1.value, inlandShipperAuth: this.infoForm2.value, containersForRate: this.containersForRate };
    }
    else if (this.infoForm1) {
      User = { ...this.infoForm.value, supplierAuth: this.infoForm1.value };
    }
    else if (this.infoForm2) {
      User = { ...this.infoForm.value, inlandShipperAuth: this.infoForm2.value, containersForRate: this.containersForRate };
    }
    this.cardLoad = true;
    this.thirdPartytoastyService.addToastDefault('wait');
    this.companyUsersManagerService.RegisterUser(User)
      .subscribe(z => {
        this._router.navigate(['/impostorcompany/contacts']);
        this.thirdPartytoastyService.addToastDefault('success', 'Add');
        this.cardLoad = false;
        //this.infoForm.reset();
        //this.infoForm1.reset();
      }, e => {
        console.log(e);
        this.errorvalue = e.error;
        this.thirdPartytoastyService.addToastDefault('error')
        this.cardLoad = false;

      })
  }
  editing = {};
  rowSaveIcon = [];

  openrowedit(rowIndex) {
    this.rowSaveIcon[rowIndex] = true;
    this.editing[rowIndex + '-' + 'warehouseId'] = true;
    this.editing[rowIndex + '-' + 'containerTypeId'] = true;
    this.editing[rowIndex + '-' + 'dischargePortId'] = true;
    this.editing[rowIndex + '-' + 'rate'] = true;
  }
  saverowedit(rowIndex) {
    this.rowSaveIcon[rowIndex] = false;
    Object.keys(this.editing).forEach((el: string) => {
      if (el.indexOf(rowIndex) != -1) {
        this.editing[el] = false;
      }
    });
   
  }
  allContainersvalid=true;

  deleterow(rowIndex) {
    this.containersForRate.splice(rowIndex, 1);
    this.checkContainers();
  }
  addnewrow(rowIndex, TF = false) {
    this.allContainersvalid=false;
    this.containersForRate.splice(rowIndex + 1, 0, { });
    if (!TF) this.openrowedit(rowIndex);
    else this.openrowedit(rowIndex + 1);

}
checkContainers(){
 this.allContainersvalid=true;

this.containersForRate.forEach(element => {
  if(!element.warehouseId || !element.containerTypeId || !element.dischargePortId || !element.rate) 
  {
   this.allContainersvalid=false;
  }
  
});
}

ConfirmDelete(index) {
  var txt ="delete this container rate ?";
  Swal({
    title: 'Are you sure?',
    text: txt,
    type: 'warning',
    showCloseButton: true,
    showCancelButton: true
  }).then((willDelete) => {
    if (willDelete.value == true) {
      this.deleterow(index);
    }
  });
}
}


