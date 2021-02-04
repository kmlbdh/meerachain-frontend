import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserManagementService } from 'src/app/Shared/UserManagement/user-management.service';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';

@Component({
  selector: 'app-create-view-model-component',
  templateUrl: './create-view-model-component.component.html',
  styleUrls: ['./create-view-model-component.component.scss']
})
export class CreateViewModelComponentComponent implements OnInit {
  @Input() viewModelId; // Model Id like Items-Orders - ...
  @Input() pageFor;
  infoForm: FormGroup;
  PH;
  errorvalue;
  disabledNgOnChange = false;
  propsData = {};
  constructor(private fbuilder: FormBuilder, private thirdPartytoastyService: ThirdPartytoastyService, private route: ActivatedRoute, private userManagementService: UserManagementService) {
    console.log("init this.viewModelId", this.viewModelId);
    this.propsData = this.userManagementService.propsData;

    console.log('--------CreateViewModel------');

  }

  ngOnInit() {
    var viewmodelid = this.route.snapshot.paramMap.get("viewmodelid")
    console.log("viewmodelid Edit", viewmodelid);
    if (viewmodelid) {
      this.PH = undefined;
      this.userManagementService.getSingleViewModel(viewmodelid).subscribe((z: any) => {
        this.viewModelId = z.viewModelType;
        this.pageFor = "edit"
        this.prepareForm(z);
      })
    }
  }
  displayPropOnTab(lstStr, propIndex, viewModelType) { //value ...
    if (lstStr) {
      let lstTab = [];
      if (lstStr != "" && lstStr != 'all') {
        lstStr.split(',').forEach(f => {
          this.userManagementService.propsData[viewModelType][propIndex]['props'].map(z => {
            if (f == z.value) {
              lstTab.push({ label: z.label, value: z.value, display: z.label })
            }
          })
        });
      } else if (lstStr == 'all') {
        this.userManagementService.propsData[viewModelType][propIndex]['props'].map(z => {
          lstTab.push({ label: z.label, value: z.value, display: z.label })
        })
      }
      return lstTab
    } else return [];
  }

  prepareForm(itm: any = {}) {
    this.infoForm = this.fbuilder.group({
      "id": [itm.id, Validators.compose([])],
      "name": [itm.name, Validators.compose([])],
      "description": [itm.description, Validators.compose([])],
      "viewModelType": [this.viewModelId, Validators.compose([])],
    });
    if (this.propsData[this.viewModelId].length == 1) {
      this.infoForm.addControl(this.propsData[this.viewModelId][0]['key'], new FormControl(this.displayPropOnTab(itm.filterObject, 0, itm.viewModelType)))
      this.infoForm.addControl("allProp" + this.propsData[this.viewModelId][0]['key'], new FormControl(itm['filterObject'] ? itm['filterObject'].split(',').length == this.userManagementService.propsData[this.viewModelId][0]['allCounter'] : false))
      this.frmC["allProp" + this.propsData[this.viewModelId][0]['key']].valueChanges.subscribe(z => { //isAll Check Change
        if (z) {
          this.infoForm.controls[this.propsData[this.viewModelId][0]['key']]
            .setValue(
              this.displayPropOnTab(this.userManagementService.propsData[this.viewModelId][0]['props'].map(z => z.value).join(','), 0, this.viewModelId)
            );
          console.log(this.displayPropOnTab(this.userManagementService.propsData[this.viewModelId][0]['props'].map(z => z.value).join(','), 0, this.viewModelId));
        }
      })
    } else {

      if (typeof itm.filterObject == 'undefined') {
        itm = {};
        itm.filterObject = "";
      }
      this.propsData[this.viewModelId].forEach((modelProp, modelPropIndex) => {
        let tempPropData = this.propsData[this.viewModelId][modelPropIndex];
        var propsValue = [];
        if (typeof itm.filterObject != 'undefined' && itm.filterObject != "") {
          propsValue = this.displayPropOnTab(JSON.parse(itm.filterObject)[tempPropData['key']], modelPropIndex, itm.viewModelType)
        }
        console.log(propsValue);

        this.infoForm.addControl(tempPropData['key'], new FormControl(propsValue))
        this.infoForm.addControl("allProp" + tempPropData['key'], new FormControl(itm['filterObject'] ? itm['filterObject'].split(',').length == tempPropData['allCounter'] : false))
        this.frmC["allProp" + tempPropData['key']].valueChanges.subscribe(z => { //isAll Check Change
          if (z) {
            this.infoForm.controls[tempPropData['key']]
              .setValue(
                this.displayPropOnTab(tempPropData['props'].map(z => z.value).join(','), modelPropIndex, this.viewModelId)
              );

            console.log(this.displayPropOnTab(tempPropData['props'].map(z => z.value).join(','), modelPropIndex, this.viewModelId));
          }
        })
      });
    }
    console.log(this.infoForm);

  }
  ngOnChanges(changes) {
    console.log(changes);
    if (changes.viewModelId.currentValue != changes.viewModelId.previousValue ||
      changes.pageFor.currentValue != changes.pageFor.previousValue) {
      // console.log(this.propsData = this.userManagementService.propsData[changes.viewModelId.currentValue]);
      if (this.pageFor == 'add') {
        this.PH = 'Add New View Model';
        this.prepareForm({})
      }
    }
  }
  addupdateViewModels() {
    if (this.infoForm.valid) {
      let obj;
      if (this.propsData[this.viewModelId].length == 1) {
        obj = this.infoForm.value;
        obj['filterObject'] = this.infoForm.controls[this.propsData[this.viewModelId][0]['key']].value.map(z => z.value).join(',');
        if (obj['filterObject'].split(',').length == 10) {
          obj['filterObject'] = 'all';
        }
      } else {
        obj = this.infoForm.value;
        obj['filterObject'] = {}
        this.propsData[this.viewModelId].forEach((modelProp, modelPropIndex) => {
          obj[this.propsData[this.viewModelId][modelPropIndex]['key']] = {};
          obj['filterObject'][this.propsData[this.viewModelId][modelPropIndex]['key']]
            = this.infoForm.controls[this.propsData[this.viewModelId][modelPropIndex]['key']].value.map(z => z.value).join(',');
          console.log("isAll",
            obj['filterObject'][this.propsData[this.viewModelId][modelPropIndex]['key']].split(',').length
            == this.propsData[this.viewModelId][modelPropIndex]['props'].length,
            obj['filterObject'][this.propsData[this.viewModelId][modelPropIndex]['key']].split(',').length,
            this.propsData[this.viewModelId][modelPropIndex]['props'].length);

          if (obj['filterObject'][this.propsData[this.viewModelId][modelPropIndex]['key']].split(',').length
            == this.propsData[this.viewModelId][modelPropIndex]['props'].length) {
            obj['filterObject'][this.propsData[this.viewModelId][modelPropIndex]['key']] = 'all';
          }
        });
        // obj['filterObject'] += ',id'; must include on server side 
        obj['filterObject'] = JSON.stringify(obj['filterObject'])
      }
      this.thirdPartytoastyService.addToastDefault('wait');
      this.userManagementService.addupdateViewModels(obj).subscribe(z => {
        this.infoForm.reset();
        this.userManagementService.refreshSearc.next("true");
        this.thirdPartytoastyService.addToastDefault('success', 'Add');
        this.errorvalue = null;
      }, e => {
        this.thirdPartytoastyService.addToastDefault('error')
        this.errorvalue = e.error;
      })
    }
  }
  get frmC() {
    return this.infoForm.controls;
  }

}
