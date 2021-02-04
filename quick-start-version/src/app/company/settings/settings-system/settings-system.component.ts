import { Component, OnInit } from '@angular/core';
import { TupleTypes } from 'src/app/Shared/Enums/TupleTypes';
import { PreDefinedAutoDataService } from 'src/app/Shared/PreDefinedAutoData/pre-defined-auto-data.service';
import { CompanyPreDefinedAutoData } from '../../shared/CompanyPreDefinedAutoData/CompanyPreDefinedAutoData';
import { CompanyPreDefinedAutoDataService } from '../../shared/CompanyPreDefinedAutoData/company-pre-defined-auto-data.service';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';
import Swal from 'sweetalert2';
import { SystemApiKeys } from 'src/app/Shared/Enums/SystemApiKeys';

@Component({
  selector: 'app-settings-system',
  templateUrl: './settings-system.component.html',
  styleUrls: ['./settings-system.component.scss']
})
export class SettingsSystemComponent implements OnInit {
  selectedItem = [];
  Options = [];
  tripleData = [];
  cardLoad = [];
  lstTypeBased = [];
  constructor(private preDefinedAutoDataService: PreDefinedAutoDataService, private companyPreDefinedAutoDataService: CompanyPreDefinedAutoDataService, private thirdPartytoastyService: ThirdPartytoastyService) {
    this.tripleData = Object.keys(TupleTypes).filter(key => !isNaN(Number(TupleTypes[key])));
    this.cardLoader(true);
    this.companyPreDefinedAutoDataService.loadallcompanypredefined(SystemApiKeys.Nothing).subscribe((z: Array<CompanyPreDefinedAutoData>) => {
      z.forEach(el => {
        if (typeof this.lstTypeBased[el.tupleType] == 'undefined') {
          this.lstTypeBased[el.tupleType] = [];
        }
        this.lstTypeBased[el.tupleType].push(el);
      })
      console.log(this.lstTypeBased);
      this.cardLoader(false);
    });


  }
  cardLoader(TF, type?) {
    if (typeof type == 'undefined' || type == null) {
      for (var i = 0; i <= this.tripleData.length; i++) this.cardLoad[i] = TF;
    } else {
      this.cardLoad[type] = TF;
    }
  }
  ngOnInit() {
  }
  loadOptions(i) {
    console.log(i);
    console.log(typeof this.Options[i]);
    if (typeof this.Options[i] == 'undefined') {
      this.cardLoad[i] = true;
      this.preDefinedAutoDataService.loadallpredefinedbasedtype(i).subscribe(z => {
        this.Options[i] = z.map(z => {
          return {
            value: '' + z.id,
            label: z.name
          }
        });
        this.cardLoad[i] = false;
      });
    } else {
      this.cardLoad[i] = false;
    }


  }

  addNew(type, value) {
    this.thirdPartytoastyService.addToastDefault('wait');
    this.companyPreDefinedAutoDataService.addnew(new CompanyPreDefinedAutoData({ 'originId': value, tupleType: type,name:this.Options[type].find(z => z.value == value).label })).subscribe((z: Array<CompanyPreDefinedAutoData>) => {
      this.refreshlsttypebasedtype(type, z);
      this.selectedItem[type] = '';
      this.thirdPartytoastyService.addToastDefault('success', 'Add');
    }, e => this.thirdPartytoastyService.addToastDefault('error'))
  }
  refreshlsttypebasedtype(type, data) {
    
    this.lstTypeBased[type] = [];//reset array or initialize if undefined
    data.forEach(el => {
      this.lstTypeBased[type].push(el);
    })
  }
  deleteBelongType(type, Itmid) {
    Swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to find it into system auto complete!',
      type: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete.value == true) {
        this.thirdPartytoastyService.addToastDefault('wait');
        this.companyPreDefinedAutoDataService.delete(type,Itmid).subscribe(z => {
          this.refreshlsttypebasedtype(type, z);
          this.thirdPartytoastyService.addToastDefault('success','delete');
        });
      }
    });
  }
}
