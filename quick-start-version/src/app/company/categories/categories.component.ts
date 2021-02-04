import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';
import { Category } from 'src/app/Shared/Category/Category';
import { CategoryService } from 'src/app/Shared/Category/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  errorvalue;
  infoForm: FormGroup;
  CUTitle; btnModelTxt; EditMode = false;
  isSubmit = false;
  lstCategories = [];
  cardLoad = false;
  txtFilterName=""
  constructor(private fbuilder: FormBuilder, private _router: Router, private thirdPartytoastyService: ThirdPartytoastyService, private categoryService: CategoryService) {
    this.getAll();
  }
  ngOnInit() {
  }
  getAll() {
    this.cardLoad = true;
    this.categoryService.getAll(this.txtFilterName).subscribe((z: any) => {
      this.lstCategories = z;
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
    typeof row.name == 'undefined' ? this.CUTitle = 'Creating new category' : this.CUTitle = 'Edit category';
    typeof row.name == 'undefined' ? this.btnModelTxt = 'Create category' : this.btnModelTxt = 'Save edit';
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
      this.categoryService.addNew(this.infoForm.value).subscribe(z => {
        this.thirdPartytoastyService.addToastDefault('success', 'Add');
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
      this.categoryService.edit(this.infoForm.value).subscribe(z => {
        this.thirdPartytoastyService.addToastDefault('success', 'Edit');
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
