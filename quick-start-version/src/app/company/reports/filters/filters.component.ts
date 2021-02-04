import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ReportService } from 'src/app/Shared/Reports/report.service';
import { PdfGeneratorService } from 'src/app/Shared/Reports/pdf-generator.service';
import { ColumnMode, RowHeightCache } from '@swimlane/ngx-datatable';
import * as jsPDF from 'jspdf'
import { AmiriRegular } from 'src/app/Shared/Reports/fontArabicSuport';
import { orderReportIcon } from 'src/app/Shared/Base64Icons/orderReport';
import { formatDate } from '@angular/common';
import { PermissionsManagerService } from '../../../Shared/Permissions/permissions-manager.service';
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  suppliers = [];
  inlandShippers = []
  warehouses = []
  forworders = []
  customAgents = []
  category = []
  infoForm: FormGroup;
  loadCard = false;
  loadCard1 = false;
  ColumnMode;
  lstRows = [];
  isSubmit = false;
  formChange = false;
  columnsFilter = [
    { display: '#', value: 'id', width: .5, colWidth: 200 },
    { display: 'Supplier', value: 'suplier', width: 1.5, colWidth: 300 },
    { display: 'Description', value: 'descreption', width: 2, colWidth: 400 },
    { display: 'Arrival To Port', value: 'arrivalDateToPort', width: 1, colWidth: 200 },
    { display: 'Warehouse', value: 'warehouses', width: 1, colWidth: 200 },
    { display: 'Forwarder', value: 'forwarder', width: 1, colWidth: 200 },
    { display: 'Customs Agent', value: 'customsAgent', width: 1.5, colWidth: 200 },
    { display: 'CFN', value: 'customsFileNumber', width: 1, colWidth: 200 },
    { display: 'Inland Shipper', value: 'inlandShipper', width: 1.5, colWidth: 200 },
    { display: 'Cleared', value: 'isCleared', width: 1.2, colWidth: 200 },
  ];
  doc;
  constructor(private pdfGeneratorService: PdfGeneratorService, private permissionsManagerService: PermissionsManagerService, private reportService: ReportService, private route: ActivatedRoute, private fbuilder: FormBuilder, private thirdPartytoastyService: ThirdPartytoastyService) {
    this.filterKey = this.route.snapshot.paramMap.get("name")
    this.formChange = true;
    // this.filterReport();
    this.permissionsManagerService.ReportPageAutharizatioonManager(this.filterKey)
    if (this.filterKey == 'order') {
      this.GeneralFilterFormPrepare()
    } else if (this.filterKey == 'container') {
      this.GeneralFilterFormPrepare()
      this.ContainersPrepare();
    } else if (this.filterKey.includes('item')) {
      this.ItemsPrepare();
    }
    this.ColumnMode = ColumnMode;

  }
  onSort($e) {
    console.log($e);
    if ($e.column.prop != 'arrivalDateToPort' && $e.column.prop != 'isCleared' && $e.column.prop != 'arrivalDateToCompany' && $e.column.prop != 'returnedDateToPort' && $e.column.prop != 'exitDate') {
      if ($e['newValue'] == 'desc') {
        this.lstRows = this.lstRows.sort((first, second) => Number(first[$e.column.prop] < second[$e.column.prop]))
      } else if ($e['newValue'] == 'asc') {
        this.lstRows = this.lstRows.sort((first, second) => Number(first[$e.column.prop] > second[$e.column.prop]))
      }
    } else {
      let dateSort = (a: any, b: any) => {
        var dateA: any = new Date(a);
        let dateB: any = new Date(b);
        return dateA - dateB;
      }
      if ($e['newValue'] == 'desc') {
        this.lstRows = this.lstRows.sort((first: any, second: any) => dateSort(first[$e.column.prop], second[$e.column.prop]))
      } else if ($e['newValue'] == 'asc') {
        this.lstRows = this.lstRows.sort((first: any, second: any) => dateSort(first[$e.column.prop], second[$e.column.prop]))
        this.lstRows = this.lstRows.reverse()
      }
    }
  }
  ContainersPrepare() {
    this.columnsFilter.push({ display: 'Container #', value: 'containerNumber', width: 1, colWidth: 200 });
    this.columnsFilter.push({ display: 'Arrival To Company', value: 'arrivalDateToCompany', width: 1.2, colWidth: 200 });
    this.columnsFilter.push({ display: 'Returned To Port', value: 'returnedDateToPort', width: 1.2, colWidth: 200 });
    this.columnsFilter.push({ display: 'Exis Date', value: 'exitDate', width: 1, colWidth: 200 });

    this.infoForm.addControl("arrivalDateToCompanyFrom", new FormControl());
    this.infoForm.addControl("arrivalDateToCompanyTo", new FormControl());
  }
  ItemsPrepare() {
    if (this.filterKey == 'item01') {
      this.columnsFilter = [
        { display: '#', value: 'id', width: .5, colWidth: 200 },
        { display: 'Item', value: 'itemName', width: .5, colWidth: 200 },
        { display: 'Supplier', value: 'suplier', width: 1.5, colWidth: 300 },
        { display: 'Notes', value: 'note', width: 1.2, colWidth: 200 },
        { display: 'Quantity', value: 'quantity', width: 1.2, colWidth: 200 },
        { display: 'Unit', value: 'unitName', width: 1.2, colWidth: 200 },
        { display: 'Arrival To Port', value: 'arrivalDateToPort', width: 1.2, colWidth: 200 },
        { display: 'Warehouse', value: 'warehouses', width: 1, colWidth: 200 },
      ];
    } else if (this.filterKey == 'item02') {
      this.columnsFilter = [
        { display: 'Item', value: 'itemName', width: .5, colWidth: 200 },
        { display: 'Quantity', value: 'quantitySum', width: 1.2, colWidth: 200 },
        { display: 'Unit', value: 'unitName', width: 1.2, colWidth: 200 },
      ];
    } else if (this.filterKey == 'item03') {
      this.columnsFilter = [
        { display: 'Item', value: 'itemName', width: .5, colWidth: 200 },
        { display: 'Supplier', value: 'suplierName', width: 1.5, colWidth: 300 },
        { display: 'Quantity', value: 'quantitySum', width: 1.2, colWidth: 200 },
        { display: 'Unit', value: 'unitName', width: 1.2, colWidth: 200 },
      ];
    }
    this.infoForm = this.fbuilder.group({
      "supplier": [[]],
      "category": [[]],
      "warehouse": [[]],
      "arrivalDateToPortFrom": [''],
      "arrivalDateToPortTo": [''],
      "iscleared": [''],
      "clearDateFrom": [''],
      "clearDateTo": [''],
      "columns": [this.columnsFilter],
    });
    this.infoForm.valueChanges.subscribe(z => {
      this.formChange = true;
    })
  }
  dateFormater(date) {
    if (date) return formatDate(date, 'yyyy-MM-dd', 'en')
    else return ''
  }
  buildData() {
    let headerRow = this.frmC.columns.value.map(z => z.display);

    let headerKeys = this.frmC.columns.value.map(z => z.value);
    let keysDatesNeedFormat = ['arrivalDateToPort', 'isCleared', 'arrivalDateToCompany', 'returnedDateToPort', 'exitDate'];
    let Rows = [];
    Rows.push(headerRow);

    this.lstRows.forEach(row => {
      let excelRow = [];
      headerKeys.forEach(key => {
        if (keysDatesNeedFormat.find(z => z == key))
          excelRow.push(this.dateFormater(row[key]))
        else
          excelRow.push(row[key]);
      });
      Rows.push(excelRow);
    })

    console.log(headerRow);
    console.log(Rows);
    return Rows;
  }
  initExcel() {
    var wb = XLSX.utils.book_new();
    wb.Props = {
      Title: "SheetJS Tutorial",
      Subject: "Test",
      Author: "Red Stapler",
      CreatedDate: new Date(2017, 12, 19)
    };
    wb.SheetNames.push("Test Sheet");
    var ws_data = this.buildData();
    var ws = XLSX.utils.aoa_to_sheet(ws_data);

    wb.Sheets["Test Sheet"] = ws;
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([this.s2ab(wbout)], { type: "application/octet-stream" }), `Report${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDay()}${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}.xlsx`);
  }
  s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
  }
  GeneralFilterFormPrepare() {
    this.infoForm = this.fbuilder.group({
      "supplier": [[]],
      "category": [[]],
      "warehouse": [[]],
      "arrivalDateToPortFrom": [''],
      "arrivalDateToPortTo": [''],
      "iscleared": [''],
      "clearDateFrom": [''],
      "clearDateTo": [''],
      "customAgent": [[]],
      "forworder": [[]],
      "inlandshipper": [[]],
      "columns": [this.columnsFilter],
    });
    this.infoForm.valueChanges.subscribe(z => {
      this.formChange = true;
    })
  }
  ngOnInit() {

    this.loadCard = true;
    this.reportService.init(this.filterKey).subscribe((z: any) => {
      this.suppliers = z.suppliers;
      this.inlandShippers = z.inlandShippers;
      this.warehouses = z.warehouses;
      this.forworders = z.forworders;
      this.customAgents = z.customAgents;
      this.category = z.category;
      this.loadCard = false;

    })
  }
  get frmC() {
    return this.infoForm.controls;
  }
  timeout: any;
  filterKey;
  rowsCounter = 0;
  filterReport() {
    let formValid = typeof this.infoForm == 'undefined' ? true : this.infoForm.valid;
    if (formValid && !this.isSubmit && this.formChange) {
      this.isSubmit = true
      this.loadCard1 = true;

      this.reportService.loadResport(typeof this.infoForm == 'undefined' ? {} : this.infoForm.value, this.filterKey).subscribe((z: any) => {
        console.log(z);
        this.lstRows = [];
        z.forEach(z => {
          let row = {};
          Object.keys(z).forEach(prop => {
            // if (prop == 'arrivalDateToPort' || prop == 'isCleared' || prop == 'arrivalDateToCompany' || prop == 'returnedDateToPort' || prop == 'exitDate') {
            //   row[prop] = formatDate(z[prop], 'dd/MM/yyyy', 'en-US');
            // } else {
            row[prop] = z[prop]
            // }
          })
          this.lstRows.push(row);
        });
        this.rowsCounter = this.lstRows.length;
        this.isSubmit = false
        this.formChange = false;
        this.loadCard1 = false;
      })
    }
  }

  initDoc() {
    let orderReportIcon1 = orderReportIcon;
    let ControlDisplayNameFilters = [
      "Suppliers List : ",
      "Category : ",
      "Warehouse : ",
      "Arrival Date To Port From : ",
      "Arrival Date To Port : ",
      "Is Cleared : ",
      "Clear Date From : ",
      "Clear Date To : ",
      "Custom Agent : ",
      "Forworder : ",
      "Inland Shipper : ",
    ]
    let Header = ""
    let limitFilter = 11
    if (this.filterKey == 'order') Header = "ORDERS REPORT";
    else if (this.filterKey == 'container') Header = "CONTAINERS REPORT"
    else if (this.filterKey.includes('item')) { Header = "ITEMS REPORT"; limitFilter = 8 }
    console.log(Header, this.columnsFilter, this.lstRows, orderReportIcon1, ControlDisplayNameFilters, this.frmC);

    this.pdfGeneratorService.initDoc(Header, this.columnsFilter, this.lstRows, orderReportIcon1, ControlDisplayNameFilters, this.frmC, limitFilter)
  }
}
