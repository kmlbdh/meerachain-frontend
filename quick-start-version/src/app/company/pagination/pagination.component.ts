import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() id: string;
  @Input() maxSize: number;
  @Output() pageChange: EventEmitter<number> = new EventEmitter();;
  @Output() pageBoundsCorrection: EventEmitter<number> = new EventEmitter();;
  
  constructor() { }

  ngOnInit() {
    console.log('this.maxSize',this.maxSize);
    
  }

}
