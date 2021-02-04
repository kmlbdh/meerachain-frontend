import { Component, OnInit } from '@angular/core';
import { LookupsService } from 'src/app/Shared/Lookups/lookups.service';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';
import { CompanyPreDefinedAutoDataService } from '../../shared/CompanyPreDefinedAutoData/company-pre-defined-auto-data.service';

@Component({
  selector: 'app-currency-balance',
  templateUrl: './currency-balance.component.html',
  styleUrls: ['./currency-balance.component.scss']
})
export class CurrencyBalanceComponent implements OnInit {

  haveSystemCurrencyId
  systemCurrencyId
  predefinedDataLookups = {}
  predefinedDataNeeded = [1];
  lstComapnyCurrencyBalance: any = []
  newCurrencyBalance: any = {};
  constructor(private LookupsService: LookupsService, private thirdPartytoastyService: ThirdPartytoastyService, private companyPreDefinedAutoDataService: CompanyPreDefinedAutoDataService) {

    this.companyPreDefinedAutoDataService.getCompanySetupData().subscribe(z => {
      this.haveSystemCurrencyId = z.systemCurrencyId ? true : false;
      this.systemCurrencyId = z.systemCurrencyId;
    })
    this.companyPreDefinedAutoDataService.getCompanyCurrencyBalance().subscribe(z => {
      this.lstComapnyCurrencyBalance = z;
    })
    this.predefinedDataNeeded.forEach(type => {
      if (!this.predefinedDataLookups[type]) {
        this.LookupsService.companypredefineddata(type).subscribe(z => {
          this.predefinedDataLookups[type] = z;
        })
      }
    });
    this.refreshList();
  }
  refreshList() {

    this.companyPreDefinedAutoDataService.getCompanyCurrencyBalance().subscribe(z => {
      this.lstComapnyCurrencyBalance = z;
    })
  }
  ngOnInit() {
  }
  errorvalue;
  deleteCompanyCurrencyBalance(r) {
    if (confirm("Are You Sure?")) {
      this.companyPreDefinedAutoDataService.deleteCompanyCurrencyBalance(r.date, r.systemCurrencyId).subscribe(z => {
        this.refreshList();
      });
    }
  }
  addNew(event) {

    if (this.newCurrencyBalance.systemCurrencyId && this.newCurrencyBalance.rate && this.newCurrencyBalance.systemCurrencyId != this.systemCurrencyId) {
      this.companyPreDefinedAutoDataService.addCompanyCurrencyBalance(this.newCurrencyBalance).subscribe(z => {
        this.refreshList();
        this.closeCreateModel(event)
      })
    } else {
      this.errorvalue = "";
      if (!this.newCurrencyBalance.systemCurrencyId) this.errorvalue += "Please Select Currency \n";
      if (!this.newCurrencyBalance.rate) this.errorvalue += "Please Set Currency Rate";
      if (this.newCurrencyBalance.systemCurrencyId == this.systemCurrencyId) this.errorvalue += "You can't select system currency";
    }

  }
  closeCreateModel(event) {
    (((event.target.parentElement.parentElement).parentElement).parentElement).classList.remove('md-show');
  }
  modelTitle
  openmodel(row = null) {
    this.errorvalue = "";
    if (row == null) {
      this.modelTitle = "Add New Currency Balance"
      this.newCurrencyBalance = {}
    } else {
      this.modelTitle = "Edit Currency Balance"
    }
    document.querySelector('#modal-8').classList.add('md-show');
  }
}
