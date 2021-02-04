import { Component, OnInit, Input, Output ,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-custom-date-picker',
  templateUrl: './custom-date-picker.component.html',
  styleUrls: ['./custom-date-picker.component.scss']
})
export class CustomDatePickerComponent implements OnInit {
  
  @Input() initValue;
  @Output() valueChange = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
