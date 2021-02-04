import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PreDefinedAutoDataService } from 'src/app/Shared/PreDefinedAutoData/pre-defined-auto-data.service';
import { PreDefinedAutoDataModel } from 'src/app/Shared/PreDefinedAutoData/PreDefinedAutoDataModel';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { TupleTypes } from 'src/app/Shared/Enums/TupleTypes';

@Component({
  selector: 'app-tables-show',
  templateUrl: './tables-show.component.html',
  styleUrls: ['./tables-show.component.scss']
})
export class TablesShowComponent implements OnInit {

  infoForm: FormGroup;
  isSubmit = false;
  tripleData;
  CUTitle = 'Create New PreDefined Types';
  isEdit = false;
  constructor(private fbuilder: FormBuilder, private preDefinedAutoDataService: PreDefinedAutoDataService, private thirdPartytoastyService: ThirdPartytoastyService) {
    this.tripleData = Object.keys(TupleTypes).filter(key => !isNaN(Number(TupleTypes[key])));
    this.PrepareCreateForm({});
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  PrepareCreateForm(row) {
    this.infoForm = this.fbuilder.group({
      "id": [row.id],
      "name": [row.name, Validators.compose([Validators.required])],
      "description": [row.description, Validators.compose([])],
      "tupleType": [row.tupleType, Validators.compose([Validators.required])],
    });
  }
  get frmC() {
    return this.infoForm.controls;
  }
  openCreateModel(event) {
    document.querySelector('#' + event).classList.add('md-show');
  }
  editPreDefinedData(event) {
    console.log("Posted", new PreDefinedAutoDataModel(this.infoForm.value));

    this.thirdPartytoastyService.addToast({ title: 'Process', msg: 'Please wait...', timeout: 5000, closeOther: true, type: 'wait' })
    this.preDefinedAutoDataService.edit(new PreDefinedAutoDataModel(this.infoForm.value)).subscribe(z => {
      console.log(z);
      this.thirdPartytoastyService.addToast({ title: 'Added Success', msg: '', timeout: 3000, closeOther: true, type: 'success' });
      this.isEdit = false;
      this.CUTitle = 'Create New PreDefined Types';
      this.infoForm.reset();
      this.setPage();
      (((event.target.parentElement.parentElement).parentElement).parentElement).classList.remove('md-show');
    }, e => {
      this.thirdPartytoastyService.addToast({ title: 'Added Faild', msg: '', timeout: 3000, closeOther: true, type: 'error' })
    })
  }
  addNewPreDefinedData(event) {
    console.log("Posted", new PreDefinedAutoDataModel(this.infoForm.value));

    this.thirdPartytoastyService.addToast({ title: 'Process', msg: 'Please wait...', timeout: 5000, closeOther: true, type: 'wait' })
    this.preDefinedAutoDataService.addNew(new PreDefinedAutoDataModel(this.infoForm.value)).subscribe(z => {
      console.log(z);
      this.thirdPartytoastyService.addToast({ title: 'Added Success', msg: '', timeout: 3000, closeOther: true, type: 'success' });

      this.setPage();
      (((event.target.parentElement.parentElement).parentElement).parentElement).classList.remove('md-show');
    }, e => {
      this.thirdPartytoastyService.addToast({ title: 'Added Faild', msg: '', timeout: 3000, closeOther: true, type: 'error' })
    })
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
  Type = -1;

  @ViewChild('myTable', {}) table: any;
  ColumnMode = ColumnMode;
  setPage(pageInfo = null) {
    this.cardLoad = true;
    this.pageInfo = pageInfo == null ? this.pageInfo : pageInfo;
    this.page.pageNumber = this.pageInfo.offset;
    this.pageInfo.pageSize = this.pageSize;
    this.page.size = this.pageSize;
    console.log(this.pageInfo, this.page);
    console.log(this.txtFilterEnglishName);

    this.preDefinedAutoDataService.loadpredefinedautodata(typeof this.pageInfo.offset == 'undefined' ? '' : this.pageInfo.offset,
      typeof this.pageInfo.pageSize == 'undefined' ? '' : this.pageInfo.pageSize,
      this.txtFilterEnglishName.length >= 3 ? this.txtFilterEnglishName : "",this.Type).subscribe((pagedData: any) => {
        this.page.totalPages = pagedData.totalPages;
        this.page.totalElements = pagedData.totalElements;
        if(this.pageInfo.offset + 1  * this.pageSize >  this.page.totalPages) {
          this.pageInfo.offset = 0;
        }
        this.rows = pagedData.data;
        console.log(this.page, this.rows);
        this.cardLoad = false;

        this.lastTxtFilterEnglishName = this.txtFilterEnglishName;
      });
  }
  updateFilter() {
    console.log('updateFilter', this.txtFilterEnglishName,this.lastTxtFilterEnglishName);
    if (this.lastTxtFilterEnglishName != this.txtFilterEnglishName  && this.txtFilterEnglishName.length >= 3)
      this.setPage();
  }
  updateSize(){
    this.setPage();
  }
  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
  onSelectedItem(row, action) {
    if(action == 'Edit'){
      console.log(row);
      
      this.PrepareCreateForm(row);
      this.CUTitle = 'Edit PreDefined Data';
      this.isEdit = true;
      this.openCreateModel('modal-8');

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
