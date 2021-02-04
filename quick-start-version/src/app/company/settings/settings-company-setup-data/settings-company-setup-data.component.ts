import { Component, OnInit } from '@angular/core';
import { CacheService } from 'src/app/Shared/Cacheing/cache.service';
import { LookupsService } from 'src/app/Shared/Lookups/lookups.service';
import { PreDefinedAutoDataService } from 'src/app/Shared/PreDefinedAutoData/pre-defined-auto-data.service';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';
import { CompanyPreDefinedAutoDataService } from '../../shared/CompanyPreDefinedAutoData/company-pre-defined-auto-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-settings-company-setup-data',
  templateUrl: './settings-company-setup-data.component.html',
  styleUrls: ['./settings-company-setup-data.component.scss']
})
export class SettingsCompanySetupDataComponent implements OnInit {

  // warehouse
  contactsNeeded = [2, 3];
  predefinedDataLookups = {}
  predefinedDataNeeded = [8, 0, 5, 1];
  selectedNewFreeTrade;
  contactLookups = {}
  lstWarehouse: any = [];
  model: any = {};
  lstFreeTraidCountries: any = [];
  constructor(private LookupsService: LookupsService, private thirdPartytoastyService: ThirdPartytoastyService, private companyPreDefinedAutoDataService: CompanyPreDefinedAutoDataService) {
    this.contactsNeeded.forEach(type => {
      if (!this.contactLookups[type]) {
        this.LookupsService.companycontactbasedtype(type).subscribe(z => {
          this.contactLookups[type] = z;
        })
      }
    });


    this.predefinedDataNeeded.forEach(type => {
      if (!this.predefinedDataLookups[type]) {
        this.LookupsService.companypredefineddata(type).subscribe(z => {
          this.predefinedDataLookups[type] = z;
        })
      }
    });


    this.LookupsService.companywarehouse().subscribe(z => {
      this.lstWarehouse = z;
    });


    this.companyPreDefinedAutoDataService.getCompanySetupData().subscribe(z => {
      console.log('getCompanySetupData', z);
      this.model = z;
      if (this.model) {

        this.model['destinationPortId'] = this.emptyIfNull(String(this.model['destinationPortId']))
        this.model['dischargePortId'] = this.emptyIfNull(String(this.model['dischargePortId']))
        this.model['localCrossingId'] = this.emptyIfNull(String(this.model['localCrossingId']))
        this.model['originOfGoodsId'] = this.emptyIfNull(String(this.model['originOfGoodsId']))
        this.model['exportCountryId'] = this.emptyIfNull(String(this.model['exportCountryId']))
        this.model['warehouseId'] = this.emptyIfNull(String(this.model['warehouseId']))
        this.model['systemCurrencyId'] = this.emptyIfNull(String(this.model['systemCurrencyId']))

      } else {
        this.model = {};
      }
    })
    this.companyPreDefinedAutoDataService.getCompanySetupDataFreeTraidContries().subscribe(z => {
      this.lstFreeTraidCountries = z;
      console.log('this.lstFreeTraidContries', this.lstFreeTraidCountries);

    })
  }
  emptyIfNull(val) {
    return val == "undefined" ? "" : val;
  }
  ngOnInit() {
  }

  save() {
    this.thirdPartytoastyService.addToastDefault('wait');
    this.model['lstFreeTraidCountries'] = this.lstFreeTraidCountries.map(z => { return { countryId: z.countryId } })
    this.companyPreDefinedAutoDataService.addeditcompanysetupdata(this.model).subscribe(z => {
      this.thirdPartytoastyService.addToastDefault('success', 'Edit');
    })
  }



  addNewFreeTradeCompany(selectedNewFreeTrade) {
    // debugger
    if (this.lstFreeTraidCountries.find(z => z.countryId == selectedNewFreeTrade)) {
      alert("This Item Already Exists!");
      this.selectedNewFreeTrade = '';
      return
    }
    let county = this.predefinedDataLookups[5].find(z => z.value == selectedNewFreeTrade)
    if (county) {
      this.lstFreeTraidCountries.push({ countryId: county.value, country: { name: county.label } });
    }
    this.selectedNewFreeTrade = '';
  }
  deleteFreeTradeCountry(index) {
    Swal({
      title: 'Are you sure?',
      text: '',
      type: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete.value == true) {
        this.lstFreeTraidCountries.splice(index, 1);
      }
    });
  }
}
