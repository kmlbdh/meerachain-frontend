import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ServerService } from '../../shared/server.service';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ToastyService, ToastOptions, ToastData } from 'ng2-toasty';
import { AuthserverService } from 'src/app/Shared/Authentication/authserver.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {
  isMobile;
  position = 'bottom-right';
  title: string;
  msg: string;
  showClose = true;
  theme = 'bootstrap';
  type = 'default';
  closeOther = false;
  cardLoad = false;
  typeChangeFilter = 1;
  constructor(private _router: Router, private toastyService: ToastyService, private authserverService: AuthserverService) {
    this.page.pageNumber = 0;
    this.page.size = 10;

  }
  ngOnInit() {
    this.setPage({ offset: 0 });
    if (window.innerWidth < 1024) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }
  page: any = {};
  rows = [];
  txtFilterEnglishName = '';
  lastTxtFilterEnglishName = '';
  pageSize = 10;
  pageInfo;
  @ViewChild('myTable', {}) table: any;
  ColumnMode = ColumnMode;
  setPage(pageInfo = null) {
    this.cardLoad = true;
    this.pageInfo = pageInfo == null ? this.pageInfo : pageInfo;
    this.page.pageNumber = this.pageInfo.offset;
    this.pageInfo.pageSize = this.pageSize;
    this.page.size = this.pageSize;
    console.log(this.pageInfo, this.page);

    this.authserverService.loadAllAccBasedUserType(this.typeChangeFilter, typeof this.pageInfo.offset == 'undefined' ? '' : this.pageInfo.offset,
      typeof this.pageInfo.pageSize == 'undefined' ? '' : this.pageInfo.pageSize,
      this.txtFilterEnglishName.length >= 3 ? this.txtFilterEnglishName : "").subscribe((pagedData: any) => {
        this.page.totalPages = pagedData.totalPages;
        this.page.totalElements = pagedData.totalElements;
        this.rows = pagedData.data;
        console.log(this.page, this.rows);
        this.cardLoad = false;

        this.lastTxtFilterEnglishName = this.txtFilterEnglishName;
      });
  }
  updateSize(){
    this.setPage();
  }
  updateFilter() {
    console.log('updateFilter', this.txtFilterEnglishName);
      this.setPage();
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
  onSelectedCompany(comId, action) {
    console.log(comId);

    if (action == 'Edit') {
      this._router.navigate(['./technicaladmin/companies/cu'], {
        queryParams: { t: 'e', i: comId }
      })
    }
  }

  //resizing listener
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 1024) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }
}
