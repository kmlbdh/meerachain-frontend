import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';
import { ItemsService } from 'src/app/Shared/Items/items.service';
import { Router } from '@angular/router';
import { PermissionsManagerService } from 'src/app/Shared/Permissions/permissions-manager.service';

@Component({
  selector: 'app-table-items',
  templateUrl: './table-items.component.html',
  styleUrls: ['./table-items.component.scss']
})
export class TableItemsComponent implements OnInit {

  loadAllCat;
  
  // canDeleteItem
  canEditItem
  constructor(private _router: Router,private itemsService: ItemsService,private permissionsManagerService:PermissionsManagerService, private thirdPartytoastyService: ThirdPartytoastyService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.loadAllCat = true;
    this.getAutharizationLevel('show');

    this.canEditItem = this.permissionsManagerService.checkForPermissionInSpecificPage(
      [
        {
          main: 'items', //For loop and get any thing is access == true
          subAccess: ['edit']
        }
      ]
    );
    // this.canDeleteItem = this.permissionsManagerService.checkForPermissionInSpecificPage(
    //   [
    //     {
    //       main: 'items', //For loop and get any thing is access == true
    //       subAccess: ['edit']
    //     }
    //   ]
    // );
  }

  fileds;
  getAutharizationLevel(mode) {
    if (!this.fileds) {
      this.fileds = this.permissionsManagerService.getOrderPartsFileds('items',mode)['showEditable'];
    }
  }
  closeCreateModel(event) {
    (((event.target.parentElement.parentElement).parentElement).parentElement).classList.remove('md-show');
  }
  isMobile = false;
  ngOnInit() {
    this.setPage({ offset: 0 });
    if (window.innerWidth < 1024) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }
  cardLoad = false;
  page: any = {};
  rows = [];
  txtFilterEnglishName = '';
  lastTxtFilterEnglishName = '';
  pageSize = 10;
  pageInfo;
  CatId = -1;
  lstCategory = [];
  // lstCategoryBasedIdIndex=[];
  @ViewChild('myTable', {}) table: any;
  ColumnMode = ColumnMode;
  setPage(pageInfo = null) {
    this.cardLoad = true;
    this.pageInfo = pageInfo == null ? this.pageInfo : pageInfo;
    this.page.pageNumber = this.pageInfo.offset;
    this.pageInfo.pageSize = this.pageSize;
    this.page.size = this.pageSize;
    this.itemsService.loadcompanyitems(typeof this.pageInfo.offset == 'undefined' ? '' : this.pageInfo.offset,
      typeof this.pageInfo.pageSize == 'undefined' ? '' : this.pageInfo.pageSize,
      this.txtFilterEnglishName.length >= 3 ? this.txtFilterEnglishName : "", this.CatId, this.loadAllCat).subscribe((pagedData: any) => {
      /*  if (this.loadAllCat == true) {
          this.loadAllCat = false;
          this.lstCategory = pagedData.compCat;
          this.lstCategory.forEach(z => {
            this.lstCategoryBasedIdIndex[z.id] = z.name;
          })
          
        }*/

        this.page.totalPages = pagedData.totalPages;
        this.page.totalElements = pagedData.totalElements;
        if (this.pageInfo.offset + 1 * this.pageSize > this.page.totalPages) {
          this.pageInfo.offset = 0;
        }
        this.rows = pagedData.data;
        this.cardLoad = false;
        this.lstCategory = pagedData.categories;
        if(!(this.lstCategory instanceof Array)){
          this.lstCategory = [this.lstCategory];
        }
        this.lastTxtFilterEnglishName = this.txtFilterEnglishName;
      });
  }

  updateFilter() {
    if (this.lastTxtFilterEnglishName != this.txtFilterEnglishName)
      this.setPage();
  }
  updateSize() {
    this.setPage();
  }
  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
  }
  onSelectedItem(row, action) {
    if (action == 'Edit') {
      this._router.navigate(['./impostorcompany/items/cu'], {
        queryParams: { t: 'e', i: row.id }
      });
    } else if(action == 'Show'){
      this._router.navigate(['./impostorcompany/items/cu'], {
        queryParams: { t: 's', i: row.id }
      });
    }
    else if (action == 'modal-8') {
      document.querySelector('#' + action).classList.add('md-show');
    }
  }
  btnModelTxt;
  ConfirmDelete(id, name, type) {
    // var txt = type == 1 ? `Once deleted, this Contact will be lose from system!` : `Once deleted, ${name} Can't be able to login to the system!`;
    // Swal({
    //   title: 'Are you sure?',
    //   text: txt,
    //   type: 'warning',
    //   showCloseButton: true,
    //   showCancelButton: true
    // }).then((willDelete) => {
    //   if (willDelete.value == true) {
    //     this.thirdPartytoastyService.addToastDefault('wait');
    //     if (type == 1) //Delete User
    //       this.companyUsersManagerService.deleteuser(id).subscribe(z => {
    //         this.setPage();
    //         this.thirdPartytoastyService.addToastDefault('success', 'delete');
    //       });
    //     else if (type == 2) // deleteuseracc
    //       this.companyUsersManagerService.deleteuseracc(id).subscribe(z => {
    //         this.setPage();
    //         this.thirdPartytoastyService.addToastDefault('success', 'delete');
    //       });
    //   }
    // });
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
