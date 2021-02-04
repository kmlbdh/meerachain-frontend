import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationsService } from 'src/app/Shared/Notifications/notifications.service';
import { NotificationType } from 'src/app/Shared/Enums/NotificationType';
import { HttpHeaders, HttpClient, HttpEventType } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cu-notes',
  templateUrl: './cu-notes.component.html',
  styleUrls: ['./cu-notes.component.scss']
})
export class CuNotesComponent implements OnInit {
  infoForm: FormGroup;
  orderId;

  lstNoteType = [];
  lstOrderContacts = [];
  constructor(private fbuilder: FormBuilder, private _router: Router, private route: ActivatedRoute, private http: HttpClient, private notificationsService: NotificationsService, private thirdPartytoastyService: ThirdPartytoastyService) {
    this.route.queryParams
      .subscribe(params => {
        this.orderId = params.i
        this.preparePage();
      });






  }

  preparePage() {
    this.lstNoteType = Object.keys(NotificationType).filter(k => typeof NotificationType[k as any] === "number" && NotificationType[k] != 0).map((z, i) => {
      return {
        value: (i + 1) + '',
        label: z
      }
    })
    console.log('this.lstNoteType', this.lstNoteType);

    this.notificationsService.initAddOrderNote(this.orderId).subscribe((z: any) => {
      console.log(z);
      this.lstOrderContacts = z.orderUsers;
    })
    this.PrepareForm({});
  }
  PrepareForm(note) {
    this.infoForm = this.fbuilder.group({
      "id": [note.id],
      "orderId": [this.orderId], //note.orderId,Validators.compose([Validators.required])
      "type": [typeof note.type == 'undefined' ? '1' : note.type + '', Validators.compose([Validators.required])],
      "content": [note.content],
      "doneBy": [note.doneBy],
      "files": [note.files],
      "TfShowAll": [note.showTo ? note.showTo == 'all' ? true : false : true],
      "TfAssignAll": [note.assignTo == 'all' ? true : false],
      'showTo': [note.showTo ? note.showTo.split(",") : []],
      'assignTo': [note.assignTo ? note.assignTo.split(",") : []],
    });


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
  get frmC() {
    return this.infoForm.controls;
  }

  ngOnInit() {
  }
  add() {
    this.authenticatedHttp();
    if (this.infoForm.valid) {
      Swal({
        title: 'Upload files!',
        html: 'Please wait to upload files.<b></b>%',
        onBeforeOpen: () => {
          Swal.showLoading()

          setInterval(() => {
            const content = Swal.getContent()
            if (content) {
              let b: any = content.querySelector('b')
              if (b) {
                b.textContent = this.progress
              }
            }
          }, 100);
        }
      }).then((willDelete) => {
        Swal('The Internet?', '', 'error');
      });

      var note = this.infoForm.value;
      note.showTo = note.TfShowAll ? "all" : note.showTo.join(",")
      note.assignTo = note.TfAssignAll ? "all" : note.assignTo.join(",")

      const formData = new FormData();
      // let fileToUpload = this.frmC.files.value[0];
      if (this.frmC.files && this.frmC.files.value) {
        <File>this.frmC.files.value.forEach(fileToUpload => {
          formData.append('file', fileToUpload, fileToUpload.name);
        });

      }
      this.http.post('http://localhost:58991/api/FilesManager/upload', formData, { reportProgress: true, observe: 'events', headers: this.httpOptions.headers })
        .subscribe((event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
          }
          else if (event.type === HttpEventType.Response) {
            this.thirdPartytoastyService.addToastDefault('wait');
            note.attachments = event.body.strAttachmentsNames.join(",");
            note.files = null;
            this.notificationsService.add(note).subscribe(z => {
              Swal.close();
              this.thirdPartytoastyService.addToastDefault('success', 'Add');
              this._router.navigate(['./impostorcompany/ordernotes'], {
                queryParams: { 'i': this.orderId }
              });
            }, e => {
              this.thirdPartytoastyService.addToastDefault('error')
            })
          }

        }, e => {
          console.log(e);

          Swal('Upload Faild', e, 'error');
        });

      // this.notificationsService.add(note).subscribe(z => {
      //   console.log(z);

      // })
    } else {
      console.log("ERoro", this.infoForm);

    }
  }
}
