import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';
import { WarehousesService } from 'src/app/Shared/Warehouses/warehouses.service';

@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.scss']
})
export class WarehousesComponent implements OnInit {

  errorvalue;
  infoForm: FormGroup;
  CUTitle; btnModelTxt; EditMode = false;
  isSubmit = false;
  lstWarehouses = [];
  cardLoad = false;
  constructor(private fbuilder: FormBuilder, private thirdPartytoastyService: ThirdPartytoastyService, private warehousesService: WarehousesService) {
    this.getAll();
  }
  ngOnInit() {
  }
  getAll() {
    this.cardLoad = true;
    this.warehousesService.getAll().subscribe((z: any) => {
      this.lstWarehouses = z;
      this.cardLoad = false;
    })
  }
  closeCreateModel(event) {
    (((event.target.parentElement.parentElement).parentElement).parentElement).classList.remove('md-show');
  }
  PrepareCreateForm(row) {
    this.infoForm = this.fbuilder.group({
      "id": [row.id, Validators.compose([])],
      "name": [row.name, Validators.compose([Validators.required])],
      "description": [row.description, Validators.compose([])],
    });
    typeof row.name == 'undefined' ? this.CUTitle = 'Creating new warehouse' : this.CUTitle = 'Edit warehouse';
    typeof row.name == 'undefined' ? this.btnModelTxt = 'Create Account' : this.btnModelTxt = 'Save Edit';
    typeof row.name == 'undefined' ? this.EditMode = false : this.EditMode = true;
  }
  get frmC() {
    return this.infoForm.controls;
  }
  openmodel(row) {
    this.PrepareCreateForm(row);
    document.querySelector('#modal-8').classList.add('md-show');
    this.errorvalue = null;
  }
  createWH(event) {
    this.isSubmit = true;
    if (this.infoForm.valid) {
      this.thirdPartytoastyService.addToastDefault('wait');
      console.log(this.infoForm.value);
      this.warehousesService.addNew(this.infoForm.value).subscribe(z => {
        this.thirdPartytoastyService.addToastDefault('success', 'Add');
        console.log(z);
        this.getAll();
        (((event.target.parentElement.parentElement).parentElement).parentElement).classList.remove('md-show');
        this.infoForm.reset();
        this.isSubmit = false;
      }, e => {
        this.thirdPartytoastyService.addToastDefault('error');

        this.errorvalue = e.error;
      })
    }
  }
  editWH(event) {
    this.isSubmit = true;
    if (this.infoForm.valid) {
      this.thirdPartytoastyService.addToastDefault('wait');
      console.log(this.infoForm.value);
      this.warehousesService.edit(this.infoForm.value).subscribe(z => {
        this.thirdPartytoastyService.addToastDefault('success', 'Edit');
        console.log(z);
        this.getAll();
        (((event.target.parentElement.parentElement).parentElement).parentElement).classList.remove('md-show');
        this.infoForm.reset();
        this.isSubmit = false;
      }, e => {
        this.thirdPartytoastyService.addToastDefault('error');
        this.errorvalue = e.error;
      })
    }
  }
}
