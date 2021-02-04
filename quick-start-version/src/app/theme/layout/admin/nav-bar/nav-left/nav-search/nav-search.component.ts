import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/Shared/Authentication/authentication.service';

@Component({
  selector: 'app-nav-search',
  templateUrl: './nav-search.component.html',
  styleUrls: ['./nav-search.component.scss']
})
export class NavSearchComponent implements OnInit {
  public searchInterval: any;
  public searchWidth: number;
  public searchWidthString: string;
  isImportCompany = false;
  constructor(private authenticationService:AuthenticationService) {
    this.searchWidth = 0;


    if (authenticationService.roleMatch(['ImpostorCompany', 'AccToCompany'])){
      this.isImportCompany = true
    }
  }

  ngOnInit() {
  }

  searchOn() {
    document.querySelector('#main-search').classList.add('open');
    this.searchInterval = setInterval(() => {
      if (this.searchWidth >= 170) {
        clearInterval(this.searchInterval);
        return false;
      }
      this.searchWidth = this.searchWidth + 30;
      this.searchWidthString = this.searchWidth + 'px';
    }, 35);
  }

  searchOff() {
    this.searchInterval = setInterval(() => {
      if (this.searchWidth <= 0) {
        document.querySelector('#main-search').classList.remove('open');
        clearInterval(this.searchInterval);
        return false;
      }
      this.searchWidth = this.searchWidth - 30;
      this.searchWidthString = this.searchWidth + 'px';
    }, 35);
  }

}
