import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/Shared/Notifications/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionType } from 'src/app/Shared/Enums/ActionType';

@Component({
  selector: 'app-user-tasks',
  templateUrl: './user-tasks.component.html',
  styleUrls: ['./user-tasks.component.scss']
})
export class UserTasksComponent implements OnInit {
  lstNotesTypes = [{
    label: "Assignment Tasks",
    value: 2,
    activeColor: 'btn-info',
    disActiveColor: 'btn-outline-info',
    isActive: true
  }, {
    label: "Warning Tasks",
    value: 4,
    activeColor: 'btn-warning',
    disActiveColor: 'btn-outline-warning',
    isActive: true
  },
  ]
  replayText;
  orderId;
  loadCard = false;
  pageChanged($e) {
    console.log($e);
    this.paggingManager.currentPage = $e;
    this.search();
  }
  public paggingManager = {
    id: 'notespaging',
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 100
  }
  openorder(orderId) {
    console.log('orderId',orderId);
    
    this.router.navigate(["./impostorcompany/orders/cu"], {
      queryParams: { 't':'e','i':orderId }
    })
  }
  noteToHistoryId;
  noteHistoryContent;
  openHistory(noteId) {
    this.noteToHistoryId = noteId;
    this.notificationsService.getNoteChanges(noteId).subscribe(z => {
      console.log(z);
      this.noteHistoryContent = z;
    })
  }
  openCloseReplay(noteID, Tf) {
    this.replayText = '';
    var note = this.lstNotes.find(z => z.id == noteID);
    note.active_replay = Tf;
  }
  updateNote(noteID, subNote = false) {
    console.log(noteID, this.replayText);
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
    console.log(NoteBase);

    this.notificationsService.updateBaseNotification(NoteBase).subscribe(z => {
      console.log(z);
      note.editable = false;
    })
  }
  makeReplay(noteID) {
    console.log(noteID, this.replayText);
    this.notificationsService.addReplay({ replayToId: noteID, content: this.replayText }).subscribe(z => {
      console.log(z);
      this.search();
    })
    this.openCloseReplay(noteID, false)
  }
  UndoDone(id) {
    this.notificationsService.UndoDone(id).subscribe(z => {
      console.log(z);
      this.search();
    })
  }
  MakeNoteAsDone(id) {
    this.notificationsService.MakeNoteAsDone(id).subscribe(z => {
      console.log(z);
      this.search();
    })
  }
  lstNotes = [];
  lstNoteChanges = {};
  search() {
    this.loadCard = true;
    this.notificationsService.loadUserTasks(this.paggingManager.currentPage - 1, this.paggingManager.itemsPerPage, this.lstNotesTypes.filter(z => z.isActive).map(z => z.value)).subscribe((z: any) => {
      console.log(z);
      this.lstNotes = z.data;
      this.lstNotes.forEach(z => {
        let changeOnArr = [];
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
    })
  }

  clickNoteType(typeValue) {
    var x = this.lstNotesTypes.find(z => z.value == typeValue);
    x.isActive = !x.isActive;
    this.search();

  }
  actionType = {};
  constructor(private notificationsService: NotificationsService, private router: Router) {

    Object.keys(ActionType).forEach((z, i) => {
      this.actionType[i + ''] = ActionType[z]
    })

    this.search()
  }

  ngOnInit() {
    // this.clickNoteType(0)
  }
}
