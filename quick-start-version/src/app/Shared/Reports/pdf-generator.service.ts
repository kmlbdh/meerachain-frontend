import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf'
import { applyPlugin, autoTable } from 'jspdf-autotable'
import { AmiriRegular } from './fontArabicSuport';
import { orderReportIcon } from '../Base64Icons/orderReport';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  ControlDisplayNameFilters;
  Xaxis = 20;
  Yaxis = 20;
  MaxXaxis = 577;
  MaxYaxis = 842;
  rowHeight = 20;
  reportHeader;
  get getXaxis() {
    this.Xaxis += 20;
    return this.Xaxis
  }
  doc
  imageData
  frmC
  limitFilter
  constructor() {
  }
  initDoc(reportHeader,columnsFilter:any, rows:any,imageData:any,controlDisplayNameFilters:any,frmC:any,limitFilter = 11, startXaxis = 20, startYaxis = 20) {
    this.Yaxis = startYaxis;
    this.Xaxis = startXaxis
    this.imageData = imageData;
    this.reportHeader = reportHeader;
    this.frmC = frmC;
    this.limitFilter = limitFilter;
    this.ControlDisplayNameFilters = controlDisplayNameFilters;
    this.doc = new jsPDF("p", "pt", "a4");
    this.doc.setFontSize(12);
    this.drowPageHeaderFiltersData()
    this.drowHeader(this.frmC.columns.value)
    rows.forEach(row => {
      this.drowRow(this.frmC.columns.value, row)
    })
    this.doc.save('table.pdf')
  }
  drowPageHeaderFiltersData() {
    this.doc.setFont("times");
    let row = 10;
    this.doc.setTextColor(3, 19, 56);
    var imgData = this.imageData;
    this.doc.addImage(imgData, 'JPEG', 5, row, 70, 70);
    this.doc.addImage(imgData, 'JPEG', this.MaxXaxis - 67, row, 70, 70);
    this.doc.setFontSize(20);
    var dim = this.doc.getTextDimensions(this.reportHeader);
    this.doc.text(this.reportHeader, (this.MaxXaxis / 2) - (dim.w/2), this.getYaxis + 20);
    this.doc.setFontSize(12);
    this.getYaxis;
    this.getYaxis;
    this.getYaxis;

    row = this.getYaxis;
    Object.keys(this.frmC).forEach((z: any, i) => {
      if (i < this.limitFilter) {
        if (typeof this.frmC[z].value != 'undefined' && typeof this.frmC[z].value != undefined) {
          if (this.frmC[z].value instanceof Array && this.frmC[z].value.length > 0) {
            row = this.getYaxisLine
            let text = this.ControlDisplayNameFilters[i] + this.frmC[z].value.map(a => a['display']).join(', ') + "."; //Join names tag
            var splitTitle = this.doc.splitTextToSize(String(text), this.MaxXaxis - 50);
            this.doc.text(splitTitle, this.Xaxis , row);
            if (splitTitle.length > 1) {//wrap text
              let length = splitTitle.length;
              while (length > 1) {
                row = this.getYaxisLine
                length--;
              }
            }
          } else if (this.frmC[z].value != '') {
            row = this.getYaxisLine
            let text = this.ControlDisplayNameFilters[i] + this.frmC[z].value;
            this.doc.text(text + ".", this.Xaxis , row);
          }
        }
      }
    })
  }
  get getYaxisLine() {
    this.Yaxis += 15;
    if (this.Yaxis >= this.MaxYaxis - 50) {
      this.doc.addPage();
      this.Yaxis = 20;
    }
    return this.Yaxis
  }
  get getYaxis() {
    this.Yaxis += 20;
    if (this.Yaxis >= this.MaxYaxis - 80) {
      this.doc.addPage();
      this.Yaxis = 20;
    }
    return this.Yaxis
  }
  drowHeader(columns) {
    this.doc.addFileToVFS("Amiri-Regular.ttf", AmiriRegular);
    this.doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    this.doc.setFont('Amiri');

    let row = this.getYaxis;
    this.doc.setFillColor(246, 245, 248);    // RGB numbers of type "number"
    this.doc.rect(this.Xaxis, row, (this.MaxXaxis - this.Xaxis), this.rowHeight, 'F');
    this.doc.setDrawColor(34, 56, 101)
    this.doc.setFontSize(10);
    let startPoint = row;
    let xPointer = this.Xaxis;
    var totalWeight = 0;
    columns.forEach(z => totalWeight += z['width'])
    let lines = 1; 
    this.doc.setTextColor(16, 28, 51);
    columns.forEach((col, i) => {
      var splitTitle = this.doc.splitTextToSize(String(col['display']), (col['width'] * ((this.MaxXaxis - this.Xaxis) / totalWeight) - 10));
      lines = lines < splitTitle.length ? splitTitle.length : lines;
    });
    let TF = lines == 2 ? true : false;
    while (lines > 1) {
      this.Yaxis -= 10;
      row = this.getYaxis;
      if(TF) {
        this.Yaxis -= 10;
        row = this.getYaxis;
      }
      this.doc.setFillColor(246, 245, 248); 
      this.doc.rect(this.Xaxis, row, (this.MaxXaxis - this.Xaxis), row - startPoint, 'F');
      console.log(this.Xaxis, row, this.MaxXaxis, row - startPoint);
      this.doc.setDrawColor(34, 56, 101)
      lines--;
    }
    this.doc.setFillColor(34, 56, 101);
    this.doc.setDrawColor(34, 56, 101)
    columns.forEach((col, i) => {
      var splitTitle = this.doc.splitTextToSize(String(col['display']), (col['width'] * ((this.MaxXaxis - this.Xaxis) / totalWeight) - 10));
      this.doc.text(xPointer + 2, startPoint + 12, splitTitle);
      xPointer += col['width'] * ((this.MaxXaxis - this.Xaxis) / totalWeight);
    });
  }
  drowRow(columns, rowData) {
    this.doc.setFontSize(10);
    let row = this.getYaxis;
    let startPoint = row;
    let xPointer = this.Xaxis;
    var totalWeight = 0;
    columns.forEach(z => totalWeight += z['width'])
    let lines = 1;
    columns.forEach((col, i) => {
      console.log(col['value'], rowData[col['value']]);
      var splitTitle = this.doc.splitTextToSize(rowData[col['value']] + '', (col['width'] * ((this.MaxXaxis - this.Xaxis) / totalWeight) - 5));
      this.doc.text(xPointer + 2, row + this.rowHeight - 6, splitTitle);
      // this.doc.text(text, 220, 205, {maxWidth: 250, align: "right",lang: 'ar'})
      lines = lines < splitTitle.length ? splitTitle.length : lines;
      if (xPointer < (this.MaxXaxis - this.Xaxis) - 20)
        xPointer += col['width'] * ((this.MaxXaxis - this.Xaxis) / totalWeight);
    });
    while (lines > 1) {
      this.Yaxis -= 10;
      row = this.getYaxis;
      lines--;
    }
    xPointer = this.Xaxis;
    columns.forEach((col, i) => {
      xPointer += col['width'] * ((this.MaxXaxis - this.Xaxis) / totalWeight);
      if (xPointer < this.MaxXaxis - 20)
        this.doc.line(xPointer - 2, startPoint, xPointer - 2, row + this.rowHeight); //Cell right |
    });
    this.doc.line(this.Xaxis, startPoint, this.Xaxis, row + this.rowHeight);// left |
    this.doc.line(this.Xaxis, row + this.rowHeight, this.MaxXaxis, row + this.rowHeight);//______
    this.doc.line(this.MaxXaxis, startPoint, this.MaxXaxis, row + this.rowHeight);// right |
  }


  drowCardRow(columns, rowData){
    this.doc.setFontSize(10);
    let row = this.getYaxis;

  }
}
