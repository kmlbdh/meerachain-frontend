import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CompanyUsersManagerService } from 'src/app/Shared/CompanyUsersManager/company-users-manager.service';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { SubType } from 'src/app/Shared/Enums/SubType';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  isEdit;
  infoForm: FormGroup;
  isSubmit = false;
  subType;
  CUTitle;
  getLstCompaniesBasedType = [];

  MapperType = new FormControl([]);
  lstCompaniesBasedTypes = {};
  constructor(private fbuilder: FormBuilder, private _router: Router, private companyUsersManagerService: CompanyUsersManagerService, private thirdPartytoastyService: ThirdPartytoastyService) {
    this.subType = Object.keys(SubType).filter(key => !isNaN(Number(SubType[key])));
    this.page.pageNumber = 0;
    this.page.size = 10;


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
    this.companyUsersManagerService.loadcompnaycontacts(typeof this.pageInfo.offset == 'undefined' ? '' : this.pageInfo.offset,
      typeof this.pageInfo.pageSize == 'undefined' ? '' : this.pageInfo.pageSize,
      this.txtFilterEnglishName.length >= 3 ? this.txtFilterEnglishName : "", this.Type).subscribe((pagedData: any) => {
        this.page.totalPages = pagedData.totalPages;
        this.page.totalElements = pagedData.totalElements;
        if (this.pageInfo.offset + 1 * this.pageSize > this.page.totalPages) {
          this.pageInfo.offset = 0;
        }
        this.rows = pagedData.data;
        this.cardLoad = false;

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
      this._router.navigate(['./impostorcompany/contacts/cu'], {
        queryParams: { t: 'e', i: row.id }
      });
    } else if (action == 'modal-8') {
      this.PrepareCreateForm(row);
      document.querySelector('#' + action).classList.add('md-show');
    }
  }
  showUserDataFilter(uid) {
    this._router.navigate(["../impostorcompany/usersaccessmanager/userfilters/" + uid])
  }
  createAcc(event) {
    this.isSubmit = true;
    if (this.infoForm.valid) {
      this.thirdPartytoastyService.addToastDefault('wait');
      this.companyUsersManagerService.creatingAcc(this.infoForm.value).subscribe(z => {
        this.thirdPartytoastyService.addToastDefault('success', 'Add');
        this.setPage();
        (((event.target.parentElement.parentElement).parentElement).parentElement).classList.remove('md-show');
        this.infoForm.reset();
        this.isSubmit = false;
      }, e =>
        this.thirdPartytoastyService.addToastDefault('error'))
    }
  }
  btnModelTxt;
  PrepareCreateForm(row) {
    this.infoForm = this.fbuilder.group({
      "id": [row.id, Validators.compose([])],
      "englishName": [row.englishName, Validators.compose([Validators.required])],
      "userName": [row.userName, Validators.compose([Validators.required])],
      "password": [row.password, Validators.compose([Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@.,$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])],
    });
    this.infoForm.addControl('conPassword', new FormControl(row.password, Validators.compose([Validators.required, Validators.minLength(3), CustomValidators.equalTo(this.frmC.password), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@.,$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])))

    typeof row.userName == 'undefined' ? this.CUTitle = 'Create account for ' + this.frmC.englishName.value : this.CUTitle = 'Edit account for ' + this.frmC.englishName.value;
    typeof row.userName == 'undefined' ? this.btnModelTxt = 'Create Account' : this.btnModelTxt = 'Save Edit';
  }
  get frmC() {
    return this.infoForm.controls;
  }

  ConfirmDelete(id, name, type) {
    var txt = type == 1 ? `Once deleted, this Contact will be lose from system!` : `Once deleted, ${name} Can't be able to login to the system!`;
    Swal({
      title: 'Are you sure?',
      text: txt,
      type: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete.value == true) {
        this.thirdPartytoastyService.addToastDefault('wait');
        if (type == 1) //Delete User
          this.companyUsersManagerService.deleteuser(id).subscribe(z => {
            this.setPage();
            this.thirdPartytoastyService.addToastDefault('success', 'delete');
          });
        else if (type == 2) // deleteuseracc
          this.companyUsersManagerService.deleteuseracc(id).subscribe(z => {
            this.setPage();
            this.thirdPartytoastyService.addToastDefault('success', 'delete');
          });
      }
    });
  }
  fromContactId;
  toContactId = new FormControl();
  

  //resizing listener
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 1024) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }
  importExcelExpand
  excelLoading
  file: any;
  lstImportErrors;
  excelData = [];
  fileChanged(e) {
    this.file = e.target.files[0];
    this.excelLoading = true;
    this.readFile(this.file)
    this.lstImportErrors = [];
    this.excelData = [];
  }
  CloseImportExcel() {
    this.file = {}
    this.excelLoading = false;
    this.lstImportErrors = [];
    this.excelData = [];
    this.importExcelExpand = false
  }
  OpenImportExcel() {
    this.importExcelExpand = true;
  }
  fetchExcel(data) {
    let newData = [];
    data.forEach(z => {
      newData.push({
        'contactNumber': z['Contact Number *'],
        'email': z['Email *'],
        'englishName': z['English Name *'],
        'address': z['Address'],
        'contactPerson': z['Contact Person'],
        'telephoneNumber': z['Telephone Number'],
        'website': z['Website'],
        'row': z['__rowNum__'] + 1,
      })
    });
    return newData;
  }
  checkPropError(z, propName) {
    if (!z[propName]) {
      this.lstImportErrors.push(`Error in line ${z['row']}, Please fill ${propName} - this required field!`)
    }
  }
  errorChecking(data) {
    this.lstImportErrors = [];
    data.forEach(z => {
      // if (!z['contactNumber'] || !z['email'] || !z['englishName']) {
      this.checkPropError(z, 'contactNumber')
      this.checkPropError(z, 'email')
      this.checkPropError(z, 'englishName')
      // }

    });
  }
  readFile(file: File) {
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = (e: any) => {
      let bufferArray = e.target.result;

      let wb: XLSX.WorkBook = XLSX.read(bufferArray, { type: 'buffer' });

      let wsname: string = wb.SheetNames[0];

      let ws: XLSX.WorkSheet = wb.Sheets[wsname];

      let data = XLSX.utils.sheet_to_json(ws);


      //Fetched Data 
      data = this.fetchExcel(data);

      this.errorChecking(data);
      if (this.lstImportErrors.length > 0) {

      }
      else {
        this.excelData = data;
      }
      this.excelLoading = false;
      //
    };

  }

  saveExcelSheet() {
    this.thirdPartytoastyService.addToastDefault('wait');
    this.companyUsersManagerService.contactsImportExcel({ contactType: 0, lstContacts: this.excelData }).subscribe(z => {
      if (z['status']) {
        this.thirdPartytoastyService.addToastDefault('success', 'Add');
        this.setPage();
        this.importExcelExpand = false;
        this.excelData = []
      } else {
        z['lstErrors'].forEach(index => {
          this.excelData[Number(index)]['error'] = true;
        });
        this.thirdPartytoastyService.addToastDefault('error');
        this.lstImportErrors.push("Duplicate English Name Or Contact Number Found!");
      }
      // alert("Upload Success");
    })
  }
  LoadExcelTemplate() {
    var wb = XLSX.utils.book_new();
    wb.Props = {
      Title: "SheetJS Tutorial",
      Subject: "Test",
      Author: "Red Stapler",
      CreatedDate: new Date(2017, 12, 19)
    };
    wb.SheetNames.push("Test Sheet");
    var ws_data = [['Contact Number *', 'English Name *', 'Email *', 'Website', 'Telephone Number', 'Address', 'Tax Number', 'Contact Person']];
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets["Test Sheet"] = ws;
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([this.s2ab(wbout)], { type: "application/octet-stream" }), 'ExampleSupplier.xlsx');
  }
  s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
  }
}
