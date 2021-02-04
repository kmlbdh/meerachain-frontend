import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';
import { CustomValidators } from 'ng2-validation';
import { HttpEventType, HttpHeaders, HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';
import { CompanyUsersManagerService } from 'src/app/Shared/CompanyUsersManager/company-users-manager.service';
import { PermissionsManagerService } from 'src/app/Shared/Permissions/permissions-manager.service';

@Component({
  selector: 'app-settings-account',
  templateUrl: './settings-account.component.html',
  styleUrls: ['./settings-account.component.scss']
})
export class SettingsAccountComponent implements OnInit {
  infoForm: FormGroup;
  constructor(private fbuilder: FormBuilder,  private thirdPartytoastyService: ThirdPartytoastyService, private http: HttpClient, private companyUsersManagerService: CompanyUsersManagerService) { }
  ngOnInit() {
    this.PrepareForm()
  }
  PrepareForm() {
    this.infoForm = this.fbuilder.group({
      "password": ['', Validators.compose([Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@.,$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])],
      "userpicture": [],
    });
    this.infoForm.addControl('conPassword', new FormControl('', Validators.compose([CustomValidators.equalTo(this.frmC.password)])))

  }
  get frmC() {
    return this.infoForm.controls;
  }


  progress;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token',
      "Access-Control-Allow-Origin": '*'
    })
  };
  authenticatedHttp() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    };
  }


  uploadedFiles;
  fileChange(element) {
    this.uploadedFiles = element.target.files;
    this.infoForm.controls.userpicture.setValue("set image");
  }
  cardLoad
  uploadNewPicture() {
    if (!this.infoForm.valid || (this.frmC.password.value == "" && this.frmC.userpicture.value == "")) {
      this.thirdPartytoastyService.addToastDefault('error');
    }
    this.authenticatedHttp();
    swal({
      title: 'Upload files!',
      html: 'Please wait to upload files.<b></b>%',
      onBeforeOpen: () => {
        swal.showLoading()
        setInterval(() => {
          const content = swal.getContent()
          if (content) {
            let b: any = content.querySelector('b')
            if (b) {
              b.textContent = this.progress
            }
          }
        }, 100);
      }
    }).then((willDelete) => {
      swal('The Internet?', '', 'error');
    });
    let formData = new FormData();
    this.cardLoad = true;
    this.thirdPartytoastyService.addToastDefault('wait');
    if (this.uploadedFiles) {
      for (var i = 0; i < this.uploadedFiles.length; i++) {
        formData.append("uploads[]", this.uploadedFiles[i], this.uploadedFiles[i].name);
      }

      this.http.post('http://localhost:58991/api/FilesManager/upload', formData, { reportProgress: true, observe: 'events', headers: this.httpOptions.headers })
      .subscribe((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        }
        else if (event.type === HttpEventType.Response) {
          this.thirdPartytoastyService.addToastDefault('wait');
          let attachments = event.body.strAttachmentsNames.join(",");
          this.infoForm.controls.userpicture.setValue(attachments);
          this.updateInfo()

        }

      }, e => {

        swal('Upload Faild', e, 'error');
      });
    }else{
      this.updateInfo()
    }

    
  }
  updateInfo() {
    this.companyUsersManagerService.updateprofile(this.infoForm.value)
      .subscribe(z => {
        this.thirdPartytoastyService.addToastDefault('success', 'Edit');
        swal.close();
      }, e => {
        this.thirdPartytoastyService.addToastDefault('error')
        this.cardLoad = false;

      })
  }
}
