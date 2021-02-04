import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/Shared/Notifications/notifications.service';
import { ActionType } from 'src/app/Shared/Enums/ActionType';
import { zip } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-notes',
  templateUrl: './order-notes.component.html',
  styleUrls: ['./order-notes.component.scss']
})
export class OrderNotesComponent implements OnInit {
  myUserPicture;
  chagneTrackViewTable = false;
  lstNotesTypes = [{
    label: "Changes Track",
    value: 0,
    activeColor: 'btn-dark',
    disActiveColor: 'btn-outline-dark',
    isActive: false
  }, {
    label: "Story Notes",
    value: 1,
    activeColor: 'btn-info',
    disActiveColor: 'btn-outline-info',
    isActive: true
  }, {
    label: "Assignment Notes",
    value: 2,
    activeColor: 'btn-info',
    disActiveColor: 'btn-outline-info',
    isActive: true
  }, {
    label: "Evaluation Notes",
    value: 3,
    activeColor: 'btn-info',
    disActiveColor: 'btn-outline-info',
    isActive: true
  }, {
    label: "Warning Notes",
    value: 4,
    activeColor: 'btn-warning',
    disActiveColor: 'btn-outline-warning',
    isActive: false
  },
  ]
  replayText;
  orderId;
  loadCard = false;
  pageChanged($e) {
    this.paggingManager.currentPage = $e;
    this.search();
  }
  isRevision;
  goToOrder(){
    this.router.navigate(["impostorcompany/orders/cu"],{
      queryParams:{t:'e',i:this.orderId}
    })
  }
  public paggingManager = {
    id: 'notespaging',
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 100
  }
  noteToHistoryId;
  noteHistoryContent;
  openHistory(noteId) {
    this.noteToHistoryId = noteId;
    this.notificationsService.getNoteChanges(noteId).subscribe(z => {
      this.noteHistoryContent = z;
    })
  }
  openCloseReplay(noteID, Tf) {
    this.replayText = '';
    var note = this.lstNotes.find(z => z.id == noteID);
    note.active_replay = Tf;
  }
  updateNote(noteID, subNote = false) {
    var note: any = {};
    if (!subNote)
      note = this.lstNotes.find(z => z.id == noteID);
    else if (subNote) {
      this.lstNotes.forEach(_note => {
        _note.lstReplays.forEach(subNote => {
          if (subNote.id == noteID) {
            note = subNote;
          }
        });
      })
    }
    let NoteBase = { baseNotificationId: noteID, content: note.content };

    this.notificationsService.updateBaseNotification(NoteBase).subscribe(z => {
      note.editable = false;
    })
  }
  makeReplay(noteID) {
    this.notificationsService.addReplay({ replayToId: noteID, content: this.replayText }).subscribe(z => {
      this.search();
    })
    this.openCloseReplay(noteID, false)
  }
  UndoDone(id) {
    this.notificationsService.UndoDone(id).subscribe(z => {
      this.search();
    })
  }
  MakeNoteAsDone(id) {
    this.notificationsService.MakeNoteAsDone(id).subscribe(z => {
      this.search();
    })
  }
  lstNotes = [];
  keysOrderChanges = ['mainOrder', 'orderGenerals', 'orderCustoms', 'orderShippings', 'orderItems', 'orderContainers'];
  lstNoteChanges = {};
  OrderDetails;
  search() {
    this.loadCard = true;
    this.notificationsService.loadOrderNotes(this.paggingManager.currentPage - 1, this.paggingManager.itemsPerPage, this.orderId, this.lstNotesTypes.filter(z => z.isActive).map(z => z.value)).subscribe((z: any) => {
      this.lstNotes = z.data;
      this.lstNotes.forEach(z => {
        let changeOnArr = [];
        this.keysOrderChanges.forEach(key => {
          if (z.content.includes(key)) {
            changeOnArr.push(key);
          }
        })
        z.changeOn = changeOnArr.join(', ');

        if (z.attachments) {
          z.attachments = z.attachments.split(",").map(attach => {
            return {
              name: attach.split("__")[2],
              url: "./attachment/" + attach
            }
          });
        }

      })
      this.paggingManager.itemsPerPage = 10
      this.paggingManager.totalItems = z.totalElements;
      this.loadCard = false;
      this.OrderDetails = z.orderDetails;
    })
  }

  fetchChanges(id) {

    if (typeof this.lstNoteChanges[id + ''] == 'undefined') {
      this.lstNoteChanges[id + ''] = {};
      this.lstNoteChanges[id + '']['expand'] = true;


      this.lstNoteChanges[id + ''] = JSON.parse(this.lstNotes.find(z => z.id == id).content);

      let normalFetch = ['mainOrder', 'orderGenerals', 'orderCustoms', 'orderShippings'];
      Object.keys(this.lstNoteChanges[id + '']).forEach(z => {
        if (normalFetch.find(a => a == z)) {
          this.lstNoteChanges[id + ''][z + 'Changes'] = [];
          this.lstNoteChanges[id + ''][z].forEach(change => {
            this.lstNoteChanges[id + ''][z + 'Changes'].push({
              'text': `
              <p style="color: black;font-size: 110%;">
                On part <span class="bold">${z}</span>, The user changed the value of the ${change.propName} from '${change.lastValue ? change.lastValue : 'Empty'}' to '${change.newValue ? change.newValue : 'Empty'}'.</p>`
            })
          });
        }
      })
      // let complexFetch = ['orderItems', 'orderContainers'];
      //Containers Changed Fetch
      if (this.lstNoteChanges[id + '']['orderContainers']) {
        this.lstNoteChanges[id + '']['orderContainers' + 'Changes'] = [];
        this.lstNoteChanges[id + '']['orderContainers'].forEach(change => {
          if (change.actionType == ActionType.Edit) {
            this.lstNoteChanges[id + '']['orderContainers' + 'Changes'].push({
              'text': `
                <p style="color: black;font-size: 110%;">
                  On part <span class="bold">Containers</span> - ${change.entityName},
                   The user changed the value of the ${change.propName} from '${change.lastValue ? change.lastValue : 'Empty'}' to '${change.newValue ? change.newValue : 'Empty'}'.</p>`
            })
          }
          else if (change.actionType == ActionType.Add) {
            this.lstNoteChanges[id + '']['orderContainers' + 'Changes'].push({
              'text': `
                <p style="color: black;font-size: 110%;">
                  On part <span class="bold">Containers</span> ,
                   The user add new container called '${change.entityName}'.</p>`
            })
          }
          else if (change.actionType == ActionType.Edit) {
            this.lstNoteChanges[id + '']['orderContainers' + 'Changes'].push({
              'text': `
                <p style="color: black;font-size: 110%;">
                  On part <span class="bold">Containers</span> ,
                   The user removed container called '${change.entityName}'.</p>`
            })
          }
        });

      }
      //Items Changed Fetch
      if (this.lstNoteChanges[id + '']['orderItems']) {
        this.lstNoteChanges[id + '']['orderItems' + 'Changes'] = [];
        this.lstNoteChanges[id + '']['orderItems'].forEach(change => {
          if (change.actionType == ActionType.Edit) {
            this.lstNoteChanges[id + '']['orderItems' + 'Changes'].push({
              'text': `
                <p style="color: black;font-size: 110%;">
                  On part <span class="bold">Items</span> - ${change.entityName},
                   The user changed the value of the ${change.propName} from '${change.lastValue ? change.lastValue : 'Empty'}' to '${change.newValue ? change.newValue : 'Empty'}'.</p>`
            })
          }
          else if (change.actionType == ActionType.Add) {
            this.lstNoteChanges[id + '']['orderItems' + 'Changes'].push({
              'text': `
                <p style="color: black;font-size: 110%;">
                  On part <span class="bold">Items</span> ,
                   The user add new item called '${change.entityName}'.</p>`
            })
          }
          else if (change.actionType == ActionType.Edit) {
            this.lstNoteChanges[id + '']['orderItems' + 'Changes'].push({
              'text': `
                <p style="color: black;font-size: 110%;">
                  On part <span class="bold">Items</span> ,
                   The user removed item called '${change.entityName}'.</p>`
            })
          }
        });
      }
      console.log(this.lstNoteChanges[id + '']);

    } else {
      this.lstNoteChanges[id + '']['expand'] = !this.lstNoteChanges[id + '']['expand'];
    }
  }
  clickNoteType(typeValue) {
    var x = this.lstNotesTypes.find(z => z.value == typeValue);
    x.isActive = !x.isActive;
    console.log(`clickNoteType(${typeValue})`);
    if (typeValue == 0) {
      this.lstNotesTypes.forEach(z => z.value != 0 ? z.isActive = false : null);
      this.chagneTrackViewTable = true;
    } else {
      this.chagneTrackViewTable = false;
      var x = this.lstNotesTypes.find(z => z.value == 0);
      x.isActive = false;
    }
    this.search();

  }
  actionType = {};
  constructor(private notificationsService: NotificationsService, private route: ActivatedRoute, private router:Router) {
    this.myUserPicture = localStorage.getItem("userpicture");
    Object.keys(ActionType).forEach((z, i) => {
      this.actionType[i + ''] = ActionType[z]
    })

    this.route.queryParams
      .subscribe(params => {
        this.orderId = params.i
        this.search();
      });
  }
  openMyModal(event) {
    document.querySelector('#' + event).classList.add('md-show');
  }

  ngOnInit() {
    // this.clickNoteType(0)
  }



}
