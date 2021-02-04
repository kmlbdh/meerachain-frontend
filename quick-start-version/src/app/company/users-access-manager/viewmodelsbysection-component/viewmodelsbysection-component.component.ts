import { Component, OnInit } from '@angular/core';
import { UserManagementService } from 'src/app/Shared/UserManagement/user-management.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-viewmodelsbysection-component',
  templateUrl: './viewmodelsbysection-component.component.html',
  styleUrls: ['./viewmodelsbysection-component.component.scss']
})
export class ViewmodelsbysectionComponentComponent implements OnInit {
  topSelected = 0;
  cvmFor = 'add';
  TopSearchObj: any = {};
  lstModels: any = [];
  FfilterOptions = [
    { label: 'Items Views', value: 0 },
    { label: 'Orders Views', value: 1 },
    // { label: 'Paid', value: 2 },
    // { label: 'Recent Cleared', value: 3 },
  ]
  constructor(private userManagementService: UserManagementService, private route: ActivatedRoute, private _router: Router) {
    this.userManagementService.refreshSearc.subscribe(z =>{
      if(z == "true"){
        this.changeViewModel(this.modelSelecion)
      }
    })
  }
  editViewMode(index) {
    this._router.navigate([`./impostorcompany/usersaccessmanager/editview/${this.lstModels[index].id}`]);
  }
  changeViewModel(modelsectionid) {

    this.loadViewModels(modelsectionid)
  }
  modelSelecion = '0';
  ngOnInit() {
    console.log('intit ViewmodelsbysectionComponent');
    this.modelSelecion = this.route.snapshot.paramMap.get("modelsectionid");
    this.changeViewModel(this.modelSelecion)
    this.route.params.subscribe(z => {
      this.modelSelecion = z.modelsectionid;
      this.changeViewModel(this.modelSelecion)
      // console.log(z,z,z,z);
    })
  }
  loadViewModels(modelsectionid) {
    this.TopSearchObj = { value: modelsectionid, label: this.FfilterOptions.find(z => z.value == modelsectionid).label, load: true }
    this.userManagementService.getViewsModels(this.TopSearchObj.value).subscribe((z: any) => {
      console.log('getViewsModels', z);
      z.forEach((model, i) => {
        this.userManagementService.propsData[this.TopSearchObj.value].forEach((mainprop) => {
          mainprop['props'].forEach(prop => {
            z[i].filterObject = model.filterObject.replace(prop.value, prop.label);
          });
        });
      });
      this.lstModels = z;
    })

    console.log(this.TopSearchObj.value);
  }
}
