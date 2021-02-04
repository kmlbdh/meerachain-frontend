import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';
import { CompanyPreDefinedAutoDataService } from '../../shared/CompanyPreDefinedAutoData/company-pre-defined-auto-data.service';
import { CompanyUsersManagerService } from 'src/app/Shared/CompanyUsersManager/company-users-manager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemsService } from 'src/app/Shared/Items/items.service';
import { FormInput } from 'src/app/technical-admin/companies/create-company/create-company.component';
import { Item } from 'src/app/Shared/Items/item';
import { PermissionsManagerService } from 'src/app/Shared/Permissions/permissions-manager.service';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent implements OnInit {
  Options = [];
  tupleTypes;
  infoForm: FormGroup;
  PGHead = 'Add New Item';
  form: any;
  cardLoad = false;
  public isSubmit: boolean;
  frmType; idEdit;
  lstUnits = [];
  lstSuppliers = [];
  lstCategories = [];
  show: string = " ";
  showItem;
  pageAutoCompleteData(z) {
    this.lstUnits = z.units;
    this.lstSuppliers = z.suppliers;
    this.lstCategories = z.categories;
  }
  constructor(private fbuilder: FormBuilder, private permissionsManagerService: PermissionsManagerService, private companyPreDefinedAutoDataService: CompanyPreDefinedAutoDataService, private _router: Router, private route: ActivatedRoute, private itemsService: ItemsService, private thirdPartytoastyService: ThirdPartytoastyService) {

    // this.addItemPrepare();
    this.route.queryParams
      .subscribe(params => {
        this.frmType = params.t
        if (this.frmType == 'e') {
          this.isSubmit = false;
          this.cardLoad = true;
          this.itemsService.oncraetepageinit().subscribe((z: any) => {
            this.pageAutoCompleteData(z);
          });
          this.getAutharizationLevel('edit')
          this.PrepareForm({});
          this.itemsService.oneditpageinit(params.i).subscribe((z: any) => {
            // this.pageAutoCompleteData(z);  
            this.PrepareForm(z.item);
            this.idEdit = params.i;
            this.cardLoad = false;
            this.show = z.show;
          })
          this.PGHead = "Edit Item";
        } else if (this.frmType == 's') {
          this.isSubmit = false;
          this.cardLoad = true;
          this.getAutharizationLevel('show')
          this.itemsService.showitemdetails(params.i).subscribe((z: any) => {
            if (z.item.lstSuppliersNames)
              z.item.lstSuppliersNames = z.item.lstSuppliersNames.join(', ');
            this.showItem = z.item;
            this.cardLoad = false;
            this.show = z.show;

          })
          this.PGHead = `Show Item #${params.i}`;
        }
        else {
          this.itemsService.oncraetepageinit().subscribe((z: any) => {
            this.pageAutoCompleteData(z);
          });
          this.isSubmit = false;
          this.PGHead = "Create New Item"
          this.getAutharizationLevel('add')
          this.PrepareForm({});
        }
      });


  }
  private addItemPrepare() {

  }
  ngOnInit() {
  }

  fileds;
  getAutharizationLevel(mode) {
    if (!this.fileds) {
      this.fileds = this.permissionsManagerService.getOrderPartsFileds('items', mode)['showEditable'];
    }
  }

  PrepareForm(itm) {
    this.infoForm = this.fbuilder.group({
      "id": [itm.id],
      "englishName": [itm.englishName, this.fileds['englishName'].validation],
      "arabicName": [itm.arabicName],
      "hebrewName": [itm.hebrewName],
      "unitId": [typeof itm.unitId == 'undefined' ? null : itm.unitId + '', this.fileds['unitId'].validation],
      "hScode": [itm.hScode, this.fileds['hScode'].validation],
      "customsRate": [itm.customsRate, this.fileds['customsRate'].validation],
      "categoryId": [typeof itm.categoryId == 'undefined' ? null : itm.categoryId + '', this.fileds['categoryId'].validation],
      "description": [itm.description],
      'lstSuppliers': [itm.lstSuppliers ? itm.lstSuppliers.map(z => z.supplierId) : []]
    });
  }
  get frmC() {
    return this.infoForm.controls;
  }
  close() {
    this._router.navigate(['./impostorcompany/items']);
  }
  errorvalue;
  saveEdit() {
    if (this.infoForm.valid) {
      var itm = { ...this.infoForm.value };
      this.cardLoad = true;
      this.thirdPartytoastyService.addToastDefault('wait');
      itm.lstSuppliers = [];
      this.frmC.lstSuppliers.value.forEach(supid => {
        itm.lstSuppliers.push({ supplierId: supid });
      });
      this.itemsService.edit(itm)
        .subscribe(z => {
          this._router.navigate(['./impostorcompany/items'], {
            queryParams: { t: 'e', i: this.idEdit }
          });
          this.thirdPartytoastyService.addToastDefault('success', 'Edit');
          this.cardLoad = false;
        }, e => {
          this.errorvalue = e.error;
          this.thirdPartytoastyService.addToastDefault('error')
          this.cardLoad = false;
        })
    } else {
      this.isSubmit = true;
      this.thirdPartytoastyService.addToastDefault('error')
    }
  }
  addnew() {
    if (this.infoForm.valid) {
      var itm = new Item({ ...this.infoForm.value });
      itm.lstSuppliers = [];
      this.frmC.lstSuppliers.value.forEach(supid => {
        itm.lstSuppliers.push({ supplierId: supid });
      });
      this.cardLoad = true;
      this.thirdPartytoastyService.addToastDefault('wait');
      this.itemsService.addNew(itm)
        .subscribe(z => {
          this._router.navigate(['/impostorcompany/items']);
          this.thirdPartytoastyService.addToastDefault('success', 'Add');
          this.cardLoad = false;
        }, e => {
          this.errorvalue = e.error;
          this.thirdPartytoastyService.addToastDefault('error')
          this.cardLoad = false;
        })
    } else {

      this.isSubmit = true;
      this.thirdPartytoastyService.addToastDefault('error')
    }
  }

}
